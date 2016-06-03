#! /usr/bin/env node

var CLI = require('./cli.js');
var userArgs = process.argv.slice(2);

var cli = new CLI(userArgs);
cli.handle();
