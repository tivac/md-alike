"use strict";

var fs = require("fs"),
    Remarkable = require("remarkable"),
    md = new Remarkable(),
    deepDiff = require("deep-diff").diff,
    diff = require("diff"),
    chalk = require("chalk"),
    obj = require("object-path");
    
var a = fs.readFileSync("./a.md", "utf8");
var b = fs.readFileSync("./b.md", "utf8");

var template = md.parse(a, {});
var compare  = md.parse(b, {});

var changes = deepDiff(template, compare),
    lines   = {};

changes.forEach(function(change) {
    var loc;
    
    if(!change.path || change.path[change.path.length - 1] === "content") {
        return;
    }
    
    change.path.some(function(part, idx) {
        loc = change.path.slice(0, idx + 1).join(".");
        
        return !!obj.get(template, loc).lines;
    });
    
    lines[obj.get(template, loc).lines.join(",")] = true;
});

var al = a.split(/\r?\n/g),
    bl = b.split(/\r?\n/g);

Object.keys(lines).forEach(function(lines) {
    var parts;
    
    lines = lines.split(",");
    
    parts = diff.diffWords(
        al.slice(lines[0], lines[1]).join("\n"),
        bl.slice(lines[0], lines[1]).join("\n")
    );
    
    parts.forEach(function(part) {
        process.stderr.write(
            part.removed || part.added ?
                chalk["bg" + (part.added ? "Green" : "Red")](part.value) :
                chalk.dim(part.value)
        );
    });
});
