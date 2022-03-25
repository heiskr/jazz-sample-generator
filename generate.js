// https://stackoverflow.com/a/47593316
function xmur3(str) {
  for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}

function weightedPick (xmap) {
  const xarr = Object.entries(xmap)
    .map(([key, weight]) => [...Array(weight).fill(key)])
    .flat()
  return pick(xarr)
}

function pick (xarr) {
  return xarr[Math.floor(rand() * xarr.length)]
}

let seed = new URLSearchParams(location.search).get('seed')
if (!seed) seed = Math.random().toString(36).slice(2)
document.querySelector('[name="seed"]').value = seed
const rand = xmur3(seed)

const changes = [weightedPick(counts)]
while (changes.length < 32) {
  const prev = changes[changes.length - 1]
  changes.push(weightedPick(lookup[prev]))
}

document.querySelector('ul').innerHTML = changes
  .map(chord => `<li>${chord}</li>`)
  .join('\n')
