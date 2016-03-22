#!/usr/bin/python

import sys
from client import PynstagramClient
from optparse import OptionParser


def main(args=None):
    """ The main routine """
    if args is None:
        args = sys.argv[1:]
    parser = OptionParser(usage="usage: %prog [options]")
    parser.add_option('-u', dest='username', help='username')
    parser.add_option('-p', dest='password', help='password')
    parser.add_option('-k', dest='key', help='key')
    parser.add_option('-v', dest='version', help='version')
    parser.add_option('-i', dest='uuid', help='uuid')
    parser.add_option('-a', dest='agent', help='user agent')
    parser.add_option('-f', dest='file', help='file path')
    parser.add_option('-t', dest='caption', help='caption text')

    (options, args) = parser.parse_args(args)
    if not options.username:
        parser.error('Username is required')
    if not options.password:
        parser.error('Password is required')
    if not options.file:
        parser.error('File path is required')

    with PynstagramClient(options.username, options.password, options.agent, options.uuid, options.key, options.version) as client:
        text = options.caption or ''
        client.upload(options.file, text)

if __name__ == '__main__':
    main()
