"use strict";

var fs = require("fs"),
    Remarkable = require("remarkable"),
    md = new Remarkable(),
    diff = require("deep-diff").diff,
    obj = require("object-path");
    
var a = fs.readFileSync("./a.md", "utf8");
var b = fs.readFileSync("./b.md", "utf8");

var template = md.parse(a, {});

var compare = md.parse(b, {});


var changes = diff(template, compare);

changes = changes.filter(function(change) {
    return change.path[change.path.length - 1] !== "content";
});

console.log(template);

changes.forEach(function(change) {
    var path = change.path.slice(0, -1);
    
    console.log(obj.get(template, path.join(".")));
});
