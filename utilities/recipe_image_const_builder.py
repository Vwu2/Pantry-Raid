#!/usr/bin/env python3

import argparse
import os

arg_parser = argparse.ArgumentParser()
arg_parser.add_argument('images_directory', type=str)
args = arg_parser.parse_args()

files = os.listdir(args.images_directory)

images = 'export const RECIPE_IMAGES = new Map([\n'
line = ' '
for file in os.listdir(args.images_directory):
    rid = file[:file.find('.')]
    entry = f" [{rid}, '{file}'],"
    if len(line) + len(entry) > 120:
        images += line + '\n'
        line = ' '
    line += entry
images += line[:-1] + '\n]);'

print(images)
