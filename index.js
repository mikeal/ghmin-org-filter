const pull = require('pull-gharchive-minimized')

const onehour = 1000 * 60 * 60

const pullDay = async function * (dt, local = false) {
  dt = (new Date(dt)).getTime()
  for (let i = 0; i < 24; i++) {
    yield * pull(dt, local)
    dt += onehour
  }
}

const filter = async (org, day, local = false) => {
  const results = []
  for await (const event of pullDay(day, local)) {
    if (event.repo.startsWith(org + '/')) {
      results.push(event)
    }
  }
  return results
}

module.exports = filter
