#!/usr/bin/env python3
import configparser
import io
import os
import re
import string
import sys
import tempfile
import threading
import time
from dataclasses import dataclass
from datetime import datetime, timedelta
from hashlib import blake2b
from hmac import compare_digest
from typing import List

import mysql.connector
import simplejson
from flask import Flask, request
from flask_cors import CORS, cross_origin
from google.cloud import vision
from google.cloud.vision import types
from passlib.hash import pbkdf2_sha256


@dataclass
class Recipe:
    tokens: List[str]
    foods: List[int]
    rid: int


@dataclass
class Recommendations:
    recommendations: List[Recipe]
    expiration: datetime


config = configparser.ConfigParser()
config.read('backend.ini')
COOKIE_SECRET_KEY = eval(config['Cookies']['key'])
COOKIE_AUTH_SIZE = int(config['Cookies']['auth_size'])
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = config['Vision']['credentials']

vision_client = vision.ImageAnnotatorClient()

app = Flask(__name__)
CORS(app)

mydb = None
cursor = None
all_foods = None
all_recipes = None
recipe_recommendations = {}


def renew_db_connection():
    global mydb, cursor
    if not mydb or not mydb.is_connected():
        mydb = mysql.connector.connect(
            host='localhost',
            user='pantryraid',
            passwd='sqlS3c',
            database='Pantry_Raid',
            auth_plugin='mysql_native_password'
        )
        cursor = mydb.cursor()


def init():
    global all_foods, all_recipes

    renew_db_connection()
    cursor.execute(f'SELECT id_Food, name FROM Food')
    all_foods = {fid: name for fid, name in cursor.fetchall()}

    cursor.execute(f'SELECT id_Recipe, name FROM Recipe')
    all_recipes = {rid: Recipe([token.lower() for token in name.replace(',', '').split(' ')], [], rid)
                   for rid, name in cursor.fetchall()}
    cursor.execute(f'SELECT recipe, food from Recipe_Food')
    for recipe, food in cursor.fetchall():
        all_recipes[recipe].foods.append(food)


def get_now():
    return int(datetime.now().timestamp())


def get_tomorrow():
    return int((datetime.now() + timedelta(days=1)).timestamp())


def sign_cookie(cookie):
    h = blake2b(digest_size=COOKIE_AUTH_SIZE, key=COOKIE_SECRET_KEY)
    h.update(bytes(cookie, 'utf-8'))
    return h.hexdigest().encode('utf8')


def verify_cookie(cookie, signature):
    return compare_digest(sign_cookie(cookie), bytes(signature, 'utf-8'))


def verify_session():
    renew_db_connection()

    session_cookie = request.form['session']
    session_sig = request.form['session_sig']

    if not verify_cookie(session_cookie, session_sig):
        return None

    session = simplejson.loads(session_cookie)
    return session['account'] if session['expiration'] > get_now() else None


def find_fid(food):
    # noinspection SpellCheckingInspection
    stopwords = ['half', 'ex', 'frozen', 'restaurant', 'restaur', 'glutenfree', 'shredded', 'fresh', 'ground', 'large',
                 'small', 'medium', 'multicolor']

    def recurse(food_):
        cursor.execute(f"SELECT `food` FROM `Food_Alias` WHERE `alias` = '{food_}';")
        fid = cursor.fetchall()
        if len(fid) != 0:
            return fid[0][0]

        if len(food_) >= 4 and food_[-3:] == 'ies':
            cursor.execute(f"SELECT `food` FROM `Food_Alias` WHERE `alias` = '{food_[:-3] + 'y'}';")
            fid = cursor.fetchall()
            if len(fid) != 0:
                return fid[0][0]

        if len(food_) >= 2 and food_[-1] == 's':
            cursor.execute(f"SELECT `food` FROM `Food_Alias` WHERE `alias` = '{food_[:-1]}';")
            fid = cursor.fetchall()
            if len(fid) != 0:
                return fid[0][0]

        for stopword in stopwords:
            if food_.startswith(stopword):
                return recurse(food_[len(stopword):])

        return None

    first_letter = re.search('[a-zA-Z]', food)
    if first_letter is None:
        return None
    return recurse(food[first_letter.start():].replace(' ', '').replace('-', '').lower())


@app.route("/register", methods=['POST'])
@cross_origin(headers=['Content-Type'])
def register():
    renew_db_connection()

    email = request.form['email']

    cursor.execute(f"SELECT id_account FROM Account WHERE email='{email}'")
    if len(cursor.fetchall()) != 0:
        return 'user exists'

    pw_hash = pbkdf2_sha256.encrypt(request.form['password'], rounds=600000)
    first_name = request.form['first_name']
    last_name = request.form['last_name']

    cursor.execute(f"INSERT INTO Account (first_name, last_name, email, pw_hash) "
                   f"VALUES ('{first_name}', '{last_name}', '{email}', '{pw_hash}');")
    mydb.commit()
    return 'success'


@app.route("/login", methods=['POST'])
@cross_origin(headers=['Content-Type'])
def login():
    renew_db_connection()

    email = request.form['email']
    password = request.form['password']

    cursor.execute(f"SELECT id_Account, pw_hash FROM Account WHERE email='{email}';")
    result = cursor.fetchall()
    if len(result) == 0:
        return 'failure'
    account, pw_hash = result[0]
    if not pbkdf2_sha256.verify(password, pw_hash):
        return 'failure'

    expiration = get_tomorrow()
    session = simplejson.dumps({'account': account, 'expiration': expiration})
    session_sig = sign_cookie(session)

    return simplejson.dumps({'session': session, 'session_sig': session_sig})


@app.route("/inventory", methods=['POST'])
@cross_origin(headers=['Content-Type'])
def inventory():
    account = verify_session()
    if not account:
        return 'failure'

    cursor.execute(
        f"SELECT id_Food, quantity, added, expiration FROM Food, Inventory WHERE id_Food=food AND account={account};")
    rows = cursor.fetchall()
    items = {}
    for fid, quantity, added, expiration_time in rows:
        expiration = time.mktime((added + timedelta(days=expiration_time)).timetuple())
        if fid in items:
            entries = items[fid]
            unique_expiration = True
            for entry in entries:
                if entry[1] == expiration:
                    entry[0] += quantity
                    unique_expiration = False
                    break
            if unique_expiration:
                entries.append([quantity, expiration])
        else:
            items[fid] = [[quantity, expiration]]

    for entry in items.values():
        entry.sort(key=lambda x: x[1])

    json = simplejson.dumps(sorted([[k, v] for k, v in items.items()], key=lambda x: all_foods[x[0]]))
    # print(json)
    return json


@app.route("/add_food", methods=['POST'])
@cross_origin(headers=['Content-Type'])
def add_food():
    account = verify_session()
    if not account:
        return 'failure'
    food = request.form['food']
    added = get_now()

    command = f"INSERT INTO Inventory (food, account, added, quantity) VALUES ('{food}', '{account}', " \
              f"FROM_UNIXTIME({added}), '1.00')"
    cursor.execute(command)
    mydb.commit()

    if account in recipe_recommendations:
        del recipe_recommendations[account]

    return 'success'


@app.route("/remove_food", methods=['POST'])
@cross_origin(headers=['Content-Type'])
def remove_food():
    account = verify_session()
    if not account:
        return 'failure'
    food = request.form['food']

    command = f"DELETE FROM Inventory WHERE (account = {account} AND food = {food});"
    cursor.execute(command)
    mydb.commit()

    if account in recipe_recommendations:
        del recipe_recommendations[account]

    return 'success'


@app.route("/receipt", methods=['POST'])
@cross_origin(headers=['Content-Type'])
def receipt():
    def food_filter(food):
        if food[-2:] == 'F1':
            return False
        try:
            float(food)
        except ValueError:
            return True
        return False

    account = verify_session()
    if not account:
        return 'failure'

    if 'file' not in request.files:
        # flash('No file part')
        return 'failure'
    file = request.files['file']
    if file.filename == '':
        # flash('No selected file')
        return 'failure'
    receipt_tempfile = tempfile.NamedTemporaryFile()
    file.save(receipt_tempfile.name)

    content = io.open(receipt_tempfile.name, 'rb').read()
    image = types.Image(content=content)
    response = vision_client.text_detection(image=image)
    text = response.text_annotations
    added = get_now()

    lines = list(filter(food_filter, text[0].description.split('\n')))
    foods = []
    for line in lines:
        first_letter = re.search('[a-zA-Z]', line)
        if first_letter is None:
            continue
        fid = find_fid(
            line[first_letter.start():].replace(' ', '').replace('-', '').lower())
        if fid is not None:
            cursor.execute(
                f"INSERT INTO `Inventory` (`food`, `account`, `added`, `quantity`) "
                f"VALUES ({fid}, {account}, FROM_UNIXTIME({added}), 1)")
            foods.append(fid)
        else:
            print(f'unknown food: {line}', file=sys.stderr)
    mydb.commit()

    if account in recipe_recommendations:
        del recipe_recommendations[account]

    return simplejson.dumps(foods)


def recipe_directions_to_html(directions):
    return '<p>' + directions.replace('\n\n', '</p><p>').replace('\n', '<br>') + '</p>'


def get_user_recommendations(account):
    if account in recipe_recommendations:
        user_recommendations = recipe_recommendations[account]
        user_recommendations.expiration = datetime.now() + timedelta(hours=1)
        return user_recommendations

    cursor.execute(f'SELECT food FROM Inventory WHERE account = {account};')
    account_inventory = [row[0] for row in cursor.fetchall()]

    scores = {}
    for fid, recipe in all_recipes.items():
        intersection_size = 0
        for food in recipe.foods:
            if food in account_inventory:
                intersection_size += 1
        score = intersection_size * intersection_size / len(recipe.foods)
        scores[fid] = score

    recommendations_list = [all_recipes[rid] for rid, _ in sorted(scores.items(), key=lambda x: -x[1])]
    expiration = datetime.now() + timedelta(hours=1)
    user_recommendations = Recommendations(recommendations_list, expiration)
    recipe_recommendations[account] = user_recommendations

    return user_recommendations


@app.route("/search_recipes", methods=['POST'])
@cross_origin(headers=['Content-Type'])
def search_recipes():
    account = verify_session()
    if not account:
        return 'failure'

    match_ids = []
    query = re.split(' +', ''.join([c.lower() for c in request.form['query'] if c not in string.punctuation]))
    for rid, recipe in all_recipes.items():
        match = True
        for token in query:
            if token not in recipe.tokens:
                match = False
                break
        if match:
            match_ids.append(rid)

    matches = []
    for recommendation in get_user_recommendations(account).recommendations:
        match = True
        for token in query:
            if token not in recommendation.tokens:
                match = False
                break
        if match:
            cursor.execute(f'SELECT name, directions FROM Recipe WHERE id_Recipe = {recommendation.rid};')
            name, directions = cursor.fetchall()[0]
            directions = recipe_directions_to_html(directions)
            foods = all_recipes[recommendation.rid].foods
            matches.append({'name': name, 'foods': foods, 'directions': directions, 'id': recommendation.rid})

    # print(matches)
    return simplejson.dumps(matches)


@app.route("/recommend_recipes", methods=['POST'])
@cross_origin(headers=['Content-Type'])
def recommend_recipes():
    account = verify_session()
    if not account:
        return 'failure'

    start = int(request.form['start'])
    stop = int(request.form['stop'])

    recommendations = []
    for recommendation in get_user_recommendations(account).recommendations[start:stop]:
        cursor.execute(f'SELECT name, directions FROM Recipe WHERE id_Recipe = {recommendation.rid}')
        name, directions = cursor.fetchall()[0]
        directions = recipe_directions_to_html(directions)
        foods = all_recipes[recommendation.rid].foods
        recommendations.append(
            {'name': name, 'foods': foods, 'directions': directions, 'id': recommendation.rid})

    return simplejson.dumps(recommendations)


@app.route("/add_shopping_list", methods=['POST'])
@cross_origin(headers=['Content-Type'])
def add_shopping_list():
    account = verify_session()
    if not account:
        return 'failure'

    name = request.form['name']
    foods = simplejson.loads(request.form['foods'])

    cursor.execute(f"INSERT INTO Shopping_List (name, account) VALUES ('{name}', {account})")
    slid = cursor.lastrowid

    for food in foods:
        cursor.execute(f"INSERT INTO Shopping_List_Food (food, shopping_list) VALUES ({food}, {slid})")

    mydb.commit()

    return 'success'


@app.route("/get_shopping_lists", methods=['POST'])
@cross_origin(headers=['Content-Type'])
def get_shopping_lists():
    account = verify_session()
    if not account:
        return 'failure'

    shopping_lists = []

    cursor.execute(f"SELECT id_Shopping_List, name FROM Shopping_List WHERE (account = '{account}')")
    for sid, name in cursor.fetchall():
        cursor.execute(f"SELECT food from Shopping_List_Food WHERE (shopping_list = {sid})")
        shopping_lists.append({'sid': sid, 'name': name, 'foods': [food for (food,) in cursor.fetchall()]})

    return simplejson.dumps(shopping_lists)


@app.route("/remove_shopping_list", methods=['POST'])
@cross_origin(headers=['Content-Type'])
def remove_shopping_list():
    account = verify_session()
    if not account:
        return 'failure'

    sid = request.form['sid']

    # TODO: ON DELETE CASCADE
    cursor.execute(f'DELETE FROM Shopping_List_Food WHERE (shopping_list = {sid})')
    cursor.execute(f'DELETE FROM Shopping_List WHERE (id_Shopping_List = {sid})')
    mydb.commit()

    return 'success'


@app.route("/add_meal_plan", methods=['POST'])
@cross_origin(headers=['Content-Type'])
def add_mean_plan():
    account = verify_session()
    if not account:
        return 'failure'

    recipes = simplejson.loads(request.form['recipes'])
    start_date = request.form['start_date']
    end_date = request.form['end_date']

    cursor.execute(f"INSERT INTO Meal_Plan (account, start_date, end_date) "
                   f"VALUES ({account}, FROM_UNIXTIME({start_date}), FROM_UNIXTIME({end_date}))")
    mpid = cursor.lastrowid
    for recipe in recipes:
        cursor.execute(f"INSERT INTO Meal_Plan_Recipe (meal_plan, recipe) VALUES ({mpid}, {recipe})")

    mydb.commit()

    return 'success'


@app.route("/remove_meal_plan", methods=['POST'])
@cross_origin(headers=['Content-Type'])
def remove_mean_plan():
    account = verify_session()
    if not account:
        return 'failure'

    mpid = request.form['mpid']

    cursor.execute(f"DELETE FROM Meal_Plan_Recipe WHERE (meal_plan = {mpid})")
    cursor.execute(f"DELETE FROM Meal_Plan WHERE (id_Meal_Plan = {mpid})")
    mydb.commit()

    return 'success'


@app.route("/get_meal_plans", methods=['POST'])
@cross_origin(headers=['Content-Type'])
def get_meal_plans():
    account = verify_session()
    if not account:
        return 'failure'

    meal_plans = []

    cursor.execute(f"SELECT id_Meal_Plan, start_date, end_date FROM Meal_Plan WHERE (account = {account})")
    for mpid, start_date, end_date in cursor.fetchall():
        cursor.execute(f"SELECT recipe FROM Meal_Plan_Recipe WHERE (meal_plan = {mpid})")
        meal_plans.append({
            'start_date': int(datetime.fromordinal(start_date.toordinal()).timestamp()),
            'end_date': int(datetime.fromordinal(end_date.toordinal()).timestamp()),
            'recipes': [recipe for (recipe,) in cursor.fetchall()],
            'mpid': mpid})

    return simplejson.dumps(meal_plans)


def recommendation_cleaner():
    while True:
        time.sleep(300)
        now = datetime.now()
        for account, user_recommendations in recipe_recommendations.items():
            if now > user_recommendations.expiration:
                del recipe_recommendations[account]
                print(f'deleting expired recommendations for account {account}')


init()
threading.Thread(target=recommendation_cleaner, daemon=True).start()
