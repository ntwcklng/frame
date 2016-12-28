#!/usr/bin/env node
import updateNotifier from 'update-notifier'
import frameCLI from '../cli'

updateNotifier({pkg: require('../../package.json')}).notify()
frameCLI(process.argv.slice(2))
