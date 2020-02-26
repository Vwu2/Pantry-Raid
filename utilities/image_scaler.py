#!/usr/bin/env python3
import argparse
import multiprocessing.dummy
import os


def magick(file):
    infile = os.path.join(args.indir, file)
    outfile = os.path.join(args.outdir, file)

    command = f'magick convert "{infile}" -resize "{args.length}x{args.length}>" "{outfile}"'
    os.system(command)


arg_parser = argparse.ArgumentParser()
arg_parser.add_argument('length', type=int)
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
