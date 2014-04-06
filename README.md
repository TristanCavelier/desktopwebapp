desktopwebapp
=============

Code your desktop application with HTML, CSS, and JavaScript very quickly!

Getting Started
---------------

- [Installation](#installation)
- [First App](#fisrt-app)

### Installation

Install dependencies,

- on ArchLinux:

        # pacman -S nodejs surf

Clone the repository:

    $ git clone https://github.com/TristanCavelier/desktopwebapp.git

Install `desktopwebapp` globally:

    $ sudo ./install.desktopwebapp.sh

You can uninstall this program with:

    $ sudo ./uninstall.desktopwebapp.sh

### First App

Create your web app anywhere you want, for instance an `index.html`, and just
run:

    $ desktopwebapp index.html

API
---

- [window.argv](#windowargv)
- [window.env](#windowenv)
- [window.fs](#windowfs)
    - [window.fs.read](#windowfsread)
    - [window.fs.readAsText](#windowfsreadastext)
    - [window.fs.readAsArrayBuffer](#windowfsreadasarraybuffer)
    - [window.fs.write](#windowfswrite)

### window.argv

Provides the process arguments. In this example:

    $ desktopwebapp path/to/index.html a b

the `argv` global will be equal to `["a", "b"]`.

### window.env

Provides the process environment variables.

Some useful environment vars:

    env.HOME
    env.USER
    env.PWD

### window.fs

#### window.fs.read

#### window.fs.readAsText

    fs.read(path, callback);
    fs.readAsText(path, callback);

Read file from the filesystem as text. If `path` is not an absolute path, the
real path will be equal to `env.PWD + "/" + path`.

The `callback` arguments are `(err, res)` which `err` is request error event,
and `res` the request success event. To know if the file is not found, you can
do this test: `res.status === 404`, and to retrieve the data:
`res.target.responseText`.

#### window.fs.readAsArrayBuffer

    fs.readAsArrayBuffer(path, callback);

Same as `fs.readAsText` but the data will be in `res.target.response` as an
array buffer.

#### window.fs.write

    fs.write(path, data, callback);

Write string, blob or array buffer into a file pointed by `path`. If `path` is
not an absolute path, the real path will be equal to `env.PWD + "/" + path`.

License
-------

> Copyright (c) 2014 Tristan Cavelier <t.cavelier@free.fr>
>
> This program is free software. It comes without any warranty, to
> the extent permitted by applicable law. You can redistribute it
> and/or modify it under the terms of the Do What The Fuck You Want
> To Public License, Version 2, as published by Sam Hocevar. See
> the COPYING file for more details.
