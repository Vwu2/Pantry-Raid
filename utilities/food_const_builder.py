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

cursor.execute(f"SELECT name, id_Food FROM Food;")
foods = sorted(cursor.fetchall(), key=lambda x: x[0])

all_foods = '  const food_names = [\n'
line = '   '
for name, id in foods:
    item = f" [{id}, '{name}'],"
    if len(line) + len(item) > 120:
        all_foods += line + '\n'
        line = '   '
    line += item
all_foods += f'{line[:-1]}\n  ];'
print(all_foods)

cursor.execute(f"SELECT id_Food, expiration  FROM Food;")
food_expirations = '  const food_expirations = [\n'
line = '   '
for fid, expiration in cursor.fetchall():
    exp = f' [{fid}, {expiration}],'
    if len(line) + len(exp) > 120:
        food_expirations += f'{line}\n'
        line = '   '
    line += exp
food_expirations += f'{line[:-1]}\n  ];'

print(food_expirations)
