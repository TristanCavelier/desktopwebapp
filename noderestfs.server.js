#!/usr/bin/env node
// Copyright (c) 2014 Tristan Cavelier <t.cavelier@free.fr>
// This program is free software. It comes without any warranty, to
// the extent permitted by applicable law. You can redistribute it
// and/or modify it under the terms of the Do What The Fuck You Want
// To Public License, Version 2, as published by Sam Hocevar. See
// the COPYING file for more details.

var EventEmitter = require("events");
var http = require("http");
//var path = require("path");
var fs = require("fs");

var port = process.pid;
if (port <= 1024) {
  port += 32768;
}
var cwd = process.cwd();

var CORS = {
  "Cache-Control": "private, max-age=0, must-revalidate",
  "Access-Control-Max-Age": "3600",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTION, GET, PUT, DELETE",
  "Access-Control-Allow-Headers": "Origin, Accept, Content-Type, Authorization",
  "Access-Control-Expose-Headers": "Content-Type, Content-Length, WWW-Authenticate"
};

var hasOwnProperty =
  Function.prototype.call.bind(Object.prototype.hasOwnProperty);

function update(o1, o2) {
  /*jslint forin: true */
  var key;
  for (key in o2) {
    if (hasOwnProperty(o2, key)) {
      o1[key] = o2[key];
    }
  }
  return o1;
}

function respondReadFile(path, stats, res) {
  fs.open(path, "r", function (err, fd) {
    if (err) {
      console.error("respondReadFile fs.open", err);
      res.writeHead(500, CORS);
      res.end("Impossible to read file");
      return;
    }
    res.writeHead(200, update({
      "Last-Modified": stats.mtime.toGMTString()
    }, CORS));
    function readAndSend() {
      fs.read(
        fd,
        new Buffer(stats.blksize),
        0,
        stats.blksize,
        null,
        function (err, bytesRead, buf) {
          if (err) {
            console.error("respondReadFile readAndSend", err);
            res.writeHead(500, CORS);
            res.end("Error during readfile.\n");
            fs.close(fd);
            return;
          }
          if (bytesRead === stats.blksize) {
            res.write(buf);
            readAndSend();
          } else if (bytesRead === 0) {
            res.end();
            fs.close(fd);
          } else {
            res.write(buf.slice(0, bytesRead));
            res.end();
            fs.close(fd);
          }
        }
      );
    }
    readAndSend();
  });
}

function writeFile(path, req, res) {
  fs.open(path, "w", function (err, fd) {
    if (err) {
      console.error("writeFile fs.open", err);
      res.writeHead(500, CORS);
      res.end("Impossible to write file");
      return;
    }
    var length = parseInt(req.headers["content-length"], 10);
    if (!isFinite(length)) {
      res.writeHead(400, CORS);
      res.end("Header Content-Length has to be defined.");
      return;
    }
    var count = 0;
    req.on("data", function (chunk) {
      fs.write(fd, chunk, 0, chunk.length, null, function (err) {
        if (err) {
          console.error("writeFile fs.write", err);
          res.writeHead(500, CORS);
          res.end("Cannot write chunk of data.");
          fs.close(fd);
          return;
        }
        count += chunk.length;
        if (count >= length) {
          res.writeHead(204, CORS);
          res.end();
        }
      });
    });
    req.on("error", function () {
      fs.close(fd);
    });
    req.on("end", function () {
      fs.close(fd);
      res.writeHead(204, CORS);
      res.end();
    });
  });
}

function manageGetRequest(req, res) {
  fs.stat(cwd + req.url, function (err, stats) {
    if (err) {
      switch (err.errno) {
      case 34: // ENOENT 404 Not Found
        res.writeHead(404, CORS);
        res.end();
        return;
      default:
        console.error("manageGetRequest fs.stat", err);
        res.writeHead(500, CORS);
        res.end();
        return;
      }
    }
    if (stats.isDirectory()) {
      // XXX
      res.writeHead(501, CORS);
      res.end("Directories are not managed by the server.");
      return;
    }
    if (stats.isFile()) {
      respondReadFile(cwd + req.url, stats, res);
      return;
    }
    // XXX
    res.writeHead(501, CORS);
    res.end("File type not managed by the server.");
  });
}

function managePutRequest(req, res) {
  fs.stat(cwd + req.url, function (err, stats) {
    if (err) {
      switch (err.errno) {
      case 34: // ENOENT 404 Not Found
        writeFile(cwd + req.url, req, res);
        return;
      default:
        console.error("managePutRequest fs.stat", err);
        res.writeHead(500, CORS);
        res.end();
        return;
      }
    }
    if (stats.isDirectory()) {
      // XXX
      res.writeHead(501, CORS);
      res.end("Directories are not managed by the server.");
      return;
    }
    if (stats.isFile()) {
      writeFile(cwd + req.url, req, res);
      return;
    }
    // XXX
    res.writeHead(501, CORS);
    res.end("File type not managed by the server.");
  });
}

function manageRequest(req, res) {
  if (req.method === "GET") {
    manageGetRequest(req, res);
    return;
  }
  if (req.method === "PUT") {
    managePutRequest(req, res);
    return;
  }
  if (req.method === "OPTION") {
    res.writeHead(200, CORS);
    res.end();
    return;
  }
  res.writeHead(405, CORS);
  res.end("Method not allowed by the server.");
}

function openRestServer() {
  var server = http.createServer(manageRequest);
  server.listen(port, "localhost", function () {
    console.log("Server running at http://localhost:" + port);
  });
  server.on("error", function (err) {
    console.error(err);
  });
  server.on("close", function () {
    console.log("Server closed");
  });
  // server.on("connection", function (socket) {
  //   socket.setTimeout(30000); // 30 seconds
  // });
}
openRestServer();
