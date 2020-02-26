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

cursor.execute(f"SELECT `id_food`, `name` FROM `Food`;")
foods = cursor.fetchall()
for food in foods:
    fid = food[0]
    alias = food[1].replace(' ', '').replace('-', '').lower()
    cursor.execute(f"INSERT INTO `Food_Alias` (`food`, `alias`) VALUES ({fid}, '{alias}');")
mydb.commit()
