const pull = require('pull-gharchive-minimized')

const onehour = 1000 * 60 * 60

const pullDay = async function * (dt) {
  dt = (new Date(dt)).getTime()
  for (let i = 0; i < 24; i++) {
    yield * pull(dt)
    dt += onehour
  }
}

const filter = async (org, day) => {
  const results = []
  for await (const event of pullDay(day)) {
    if (event.repo.startsWith(org + '/')) {
      results.push(event)
    }
  }
  return results
}

module.exports = filter
