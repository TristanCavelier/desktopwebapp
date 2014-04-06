// Copyright (c) 2014 Tristan Cavelier <t.cavelier@free.fr>
// This program is free software. It comes without any warranty, to
// the extent permitted by applicable law. You can redistribute it
// and/or modify it under the terms of the Do What The Fuck You Want
// To Public License, Version 2, as published by Sam Hocevar. See
// the COPYING file for more details.

/*jslint indent: 2 */
/*global window, XMLHttpRequest */

(function () {
  var hostname = window.env.NODEREST_HOSTNAME, port = window.env.NODEREST_PORT;

  function write(path, data, callback) {
    if (path[0] !== "/") { path = window.env.PWD + "/" + path; }
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", callback.bind(null, null));
    xhr.addEventListener("error", callback);
    xhr.addEventListener("abort", callback);
    xhr.open(
      "PUT",
      "http://" + hostname + ":" + port + path,
      true
    );
    xhr.send(data);
  }

  function readAsText(path, callback) {
    if (path[0] !== "/") { path = window.env.PWD + "/" + path; }
    var xhr = new XMLHttpRequest();
    xhr.responseType = "text";
    xhr.addEventListener("load", callback.bind(null, null));
    xhr.addEventListener("error", callback);
    xhr.addEventListener("abort", callback);
    xhr.open(
      "GET",
      "http://" + hostname + ":" + port + path,
      true
    );
    xhr.send(null);
  }

  function readAsArrayBuffer(path, callback) {
    if (path[0] !== "/") { path = window.env.PWD + "/" + path; }
    var xhr = new XMLHttpRequest();
    xhr.responseType = "arraybuffer";
    xhr.addEventListener("load", callback.bind(null, null));
    xhr.addEventListener("error", callback);
    xhr.addEventListener("abort", callback);
    xhr.open(
      "GET",
      "http://" + hostname + ":" + port + path,
      true
    );
    xhr.send(null);
  }

  window.fs = {
    "read": readAsText,
    "readAsText": readAsText,
    "readAsArrayBuffer": readAsArrayBuffer,
    "write": write
  };
}());
