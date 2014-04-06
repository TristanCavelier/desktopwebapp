/*jslint indent: 2, vars: true */
/*global document, alert, argv, env, fs */

(function () {
  "use strict";

  var inputFile = document.querySelector("#path");
  var loadButton = document.querySelector("#load-button");
  var saveButton = document.querySelector("#save-button");
  var textArea = document.querySelector("#editor");
  var preInfo = document.querySelector("#info");

  preInfo.textContent = "argv: " + JSON.stringify(argv) + "\n" +
    "env: " + JSON.stringify(env, null, 2);

  loadButton.addEventListener("click", function () {
    fs.read(inputFile.value, function (err, event) {
      if (event.target.status === 404) {
        alert("File not found");
        return;
      }
      if (err || event.target.status > 399) {
        // XXX
        alert("Cannot load this file.");
        return;
      }
      textArea.value = event.target.responseText;
    });
  });

  saveButton.addEventListener("click", function () {
    fs.write(inputFile.value, textArea.value, function (err, event) {
      if (err || event.target.status > 399) {
        // XXX
        alert("Cannot save this file.");
        return;
      }
      alert("Saved!");
    });
  });

}());
