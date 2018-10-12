#!/usr/bin/env node
const path = require('path');
const spawn = require('cross-spawn');

const args = process.argv.slice(2);

const script = path.join(__dirname, '../../node_modules/prettier/bin-prettier.js');

const result = spawn.sync(script, args, { stdio: 'inherit' });

process.exit(result.status);
