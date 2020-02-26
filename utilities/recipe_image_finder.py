#!/usr/bin/end python3
import argparse
import io
import os
import shutil

import mysql.connector
from google.cloud import vision
from google.cloud.vision import types
from google_images_download import google_images_download

# noinspection DuplicatedCode
arg_parser = argparse.ArgumentParser()
arg_parser.add_argument('directory', type=str)
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

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = '../credentials/Pantry Raid-2279557bb1dd.json'
vision_client = vision.ImageAnnotatorClient()
image_response = google_images_download.googleimagesdownload()

cursor.execute(f"SELECT id_Recipe, name FROM Recipe;")
recipes = cursor.fetchall()

if not os.path.exists(args.directory):
    os.mkdir(args.direstory)


def search(keywords, num_results_):
    paths = []
    while len(paths) == 0:
        arguments = {'keywords': keywords, 'limit': num_results_, 'print_urls': False,
                     'output_directory': args.directory}
        paths = image_response.download(arguments)[0][keywords]
    for path_ in paths:
        try:
            content = io.open(path_, 'rb').read()
            image = types.Image(content=content)
            response = vision_client.text_detection(image=image)
            text = response.text_annotations
            if len(text) == 0:
                return path_
        except:
            pass

    return ''


for rid, recipe in recipes[568:]:
    num_results = 4
    path = ''
    while path == '':
        path = search(recipe.replace(',', '').replace('w/', '').replace('/', ' ').replace('dish', ''), num_results)
        num_results += num_results
    os.rename(path, os.path.join(args.directory, f'{rid}.{path.split(".")[-1]}').replace('..', '.'))
    print(os.path.dirname(path))
    shutil.rmtree(os.path.dirname(path))
