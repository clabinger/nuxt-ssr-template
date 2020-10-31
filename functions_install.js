#!/usr/bin/env node
'use strict'

const resolve = require('path').resolve
const { spawnSync } = require('child_process')
const consola = require('consola')

// Prepare package.json in functions folder.
consola.info({
  message: 'Generate the functions package.json file...',
  badge: true
})
spawnSync('node generate_functions_package_json.js', {
  shell: true,
  env: process.env,
  stdio: 'inherit'
})
consola.info({
  message: '... package.json generated - DONE',
  badge: true
})

// Run "npm install" in functions folder.
consola.info({
  message: 'Run "yarn" in functions folder...',
  badge: true
})
spawnSync('yarn', {
  shell: true,
  env: process.env,
  cwd: resolve(__dirname, './functions'),
  stdio: 'inherit'
})
consola.info({
  message: '... packages in functions folder installed - DONE',
  badge: true
})
