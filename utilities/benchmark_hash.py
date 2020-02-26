#!/usr/bin/env python

import argparse
import time

from passlib.hash import pbkdf2_sha256

arg_parser = argparse.ArgumentParser()
arg_parser.add_argument('rounds', type=int)
args = arg_parser.parse_args()

start = time.time()
pwhash = pbkdf2_sha256.encrypt("pw", rounds=args.rounds)
stop = time.time()
print(f'time: {int(1000 * (stop - start))} ms\nhash: {pwhash}\nhash length: {len(pwhash)}')

print(f'password {"" if pbkdf2_sha256.verify("password", pwhash) else " not "}verified')
