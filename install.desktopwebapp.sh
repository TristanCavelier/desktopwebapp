#!/bin/sh
here=$(dirname "$0")
cd "$here" || exit 15
mkdir -m0755 /usr/lib/desktopwebapp
install -m0644 noderestfs.server.js -t /usr/lib/desktopwebapp || exit 1
install -m0644 noderestfs.api.js -t /usr/lib/desktopwebapp || exit 1
install -m0755 desktopwebapp -t /usr/bin || exit 1
