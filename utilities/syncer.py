#!/usr/bin/env python3

import argparse
import os
import signal
import subprocess
import time

arg_parser = argparse.ArgumentParser()
arg_parser.add_argument('-t', '--time', dest='time', type=int, default=3600, help='time per sync in seconds')
arg_parser.add_argument('-p', '--port', dest='port', type=int, default=3000, help='React webserver port')
args = arg_parser.parse_args()

os.chdir('team-website')
os.environ['PORT'] = str(args.port)

subprocess.call(['git', 'pull'])
while True:
    subprocess.Popen(['npm', 'start'])
    time.sleep(args.time)
    subprocess.call(['git', 'pull'])
    server_pid = int(subprocess.check_output(['lsof', '-ti', f'tcp:{args.port}']).decode('utf8'))
    os.kill(server_pid, signal.SIGTERM)
