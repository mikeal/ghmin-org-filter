#!/usr/bin/env node

const filter = require('./')
const mkdirp = require('mkdirp')
const path = require('path')
const brotli = require('brotli-max')

const oneday = 1000 * 60 * 60 * 24

const filepath = ts => {
  ts = new Date(ts)
  const year = ts.getUTCFullYear()
  const month = (ts.getUTCMonth() + 1).toString().padStart(2, '0')
  const day = ts.getUTCDate().toString().padStart(2, '0')
  return `${year}/${month}/${day}.json.br`
}

const runPull = async argv => {
  let start = (new Date(argv.start)).getTime()
  const end = (new Date(argv.end)).getTime()
  const basedir = argv.out || process.cwd()
  while (start <= end) {
    console.log('pull', new Date(start))
    let results
    try {
      results = await filter(argv.org, start, argv.local)
    } catch (e) {
      console.log(e.message)
      console.error('skipping, not found')
      start += oneday
      continue
    }
    const filename = path.join(basedir, filepath(start))
    mkdirp.sync(path.dirname(filename))
    const buffer = Buffer.from(JSON.stringify(results))
    await brotli(buffer, filename)
    start += oneday
  }
}

const options = yargs => {
  yargs.option('out', {
    desc: 'Base directory for data output'
  })
  yargs.option('local', {
    desc: 'Local directory containing minimized gharchive data.',
    default: false
  })
}

const yargs = require('yargs')
const args = yargs
  .command('pull <org> <start> <end>', 'Pull data and write regression.', options, runPull)
  .argv

if (!args._.length) {
  yargs.showHelp()
}
