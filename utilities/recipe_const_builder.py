#!/usr/bin/env python3
import argparse

import mysql.connector

# noinspection DuplicatedCode
arg_parser = argparse.ArgumentParser()
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

cursor.execute(f'SELECT id_Recipe, name FROM Recipe;')
names_const = f'  const recipe_names = [\n'
line = '   '
for id, name in cursor.fetchall():
    name = name.replace("'", "\\'")
    entry = f" [{id}, '{name}'],"
    if len(line) + len(entry) > 120:
        names_const += line + '\n'
        line = '   '
    line += entry
names_const += line + '\n  ];'

cursor.execute(f'SELECT recipe, food from Recipe_Food;')
ingredients_map = {}
for recipe, food in cursor.fetchall():
    if recipe in ingredients_map:
        ingredients_map[recipe].append(food)
    else:
        ingredients_map[recipe] = [food]

# ingredients_const = 'export const RECIPE_FOODS = new Map([\n'
# line = ' '
# for recipe, ingredients in ingredients_map.items():
#     entry = f' [{recipe}, {ingredients}],'
#     if len(line) + len(entry) > 120:
#         ingredients_const += line + '\n'
#         line = ' '
#     line += entry
# ingredients_const += line + '\n]);'

print(names_const)
# print()
# print(ingredients_const)
