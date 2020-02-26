#!/usr/bin/env python3
import argparse
import random
import xml.etree.ElementTree as ET

import mysql.connector


def filter_ingredient(ingredient):
    return ingredient.split(',')[0].title()


arg_parser = argparse.ArgumentParser()
arg_parser.add_argument('functions', type=str)
arg_parser.add_argument('files', type=str, nargs='+')
arg_parser.add_argument('--host', type=str, dest='host', default='localhost')
args = arg_parser.parse_args()

mydb = mysql.connector.connect(
    host=args.host,
    user='pantryraid',
    passwd='sqlS3c',
    database='Pantry_Raid',
    auth_plugin='mysql_native_password'
)
cursor = mydb.cursor()

if 'i' in args.functions:
    ingredients = set()

    for file in args.files:
        tree = ET.parse(file)
        root = tree.getroot()
        for child in root:
            if child.tag != 'recipe':
                continue
            ingredients.update(
                [filter_ingredient(ingredient.attrib['ItemName']) for ingredient in child.findall('RecipeItem')])

    ingredients = list(ingredients)
    expirations = [random.randint(7, 35) for _ in range(len(ingredients))]

    for i in range(len(ingredients)):
        command = f"INSERT INTO `Food` (`name`, `expiration`) VALUES ('{ingredients[i]}', '{expirations[i]}');"
        # print(f'executing: {command}')
        cursor.execute(command)
    mydb.commit()

if 'r' in args.functions:
    recipes = []
    directions = []
    ingredients = []

    for file in args.files:
        tree = ET.parse(file)
        root = tree.getroot()
        for child in root:
            if child.tag != 'recipe':
                continue
            xml_memo1 = child.find('XML_MEMO1')
            if xml_memo1 is None:
                continue
            recipes.append(child.attrib['description'].replace("'", "\\'").replace('"', '\\"'))
            directions.append(xml_memo1.text.replace("'", "\\'").replace('"', '\\"'))
            ingredients.append(
                [filter_ingredient(ingredient.attrib['ItemName']) for ingredient in child.findall('RecipeItem')])

    for i in range(len(recipes)):
        command = f"INSERT INTO `Recipe` (`name`, `directions`) VALUES ('{recipes[i]}', '{directions[i]}');"
        # print(f'executing: {command}')
        cursor.execute(command)
        cursor.execute('SELECT LAST_INSERT_ID();')
        rid = cursor.fetchone()[0]
        for ingredient in ingredients[i]:
            command = f"SELECT `id_Food` FROM `Food` WHERE `name` = '{ingredient}'"
            cursor.execute(command)
            fid = cursor.fetchone()[0]
            command = f"INSERT INTO `Recipe_Food` (`food`, `recipe`) VALUES ('{fid}', '{rid}')"
            cursor.execute(command)

    mydb.commit()
