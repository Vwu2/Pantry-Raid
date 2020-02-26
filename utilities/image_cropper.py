#!/usr/bin/env python3
import argparse
import multiprocessing.dummy
import os
import sys


def magick(file):
    if file[-5:] == '.jpeg' or file[-5:] == '.JPEG' or file[-4:] == '.jpg' or file[-4:] == '.JPG':
        ext = '.jpeg'
    elif file[-4:] == '.png' or file[-4:] == '.PNG':
        ext = '.png'
    elif file[-4:] == '.gif' or file[-4:] == '.GIF':
        ext = '.gif'
    else:
        print(f'unrecognized extension for file: {file}', file=sys.stderr)
        return

    infile = os.path.join(args.indir, file)
    outfile = os.path.join(args.outdir, file[:-len(ext) + 1] + ext)

    command = f'magick "{infile}" -gravity center -crop {args.width}:{args.height} ' \
              f'"{outfile}"'
    # print(command)
    os.system(command)


arg_parser = argparse.ArgumentParser()
arg_parser.add_argument('width', type=int)
arg_parser.add_argument('height', type=int)
arg_parser.add_argument('indir', type=str)
arg_parser.add_argument('outdir', type=str)
arg_parser.add_argument('--processes', '-p', dest='subprocesses', type=int, default=multiprocessing.cpu_count())
args = arg_parser.parse_args()

if not os.path.exists(args.outdir):
    os.mkdir(args.outdir)

files = [file for file in os.listdir(args.indir) if
         os.path.isfile(os.path.join(args.indir, file))]
thread_pool = multiprocessing.dummy.Pool(args.subprocesses)
thread_pool.map(magick, files)
thread_pool.close()
thread_pool.join()
