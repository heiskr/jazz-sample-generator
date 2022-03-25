import fs from 'fs/promises'
import iRealReader from 'ireal-reader'

const irealData = await fs.readFile('./irealstr.txt', 'utf8')
const read = iRealReader(irealData)

const songs = read.songs
  .map(song => song.music.measures.flat())

const lookup = {}

for (let song of songs) {
  let a
  let b = song.shift()
  while (song.length) {
    a = b
    b = song.shift()
    lookup[a] = lookup[a] || {}
    lookup[a][b] = lookup[a][b] || 0
    lookup[a][b]++
  }
}

console.log(lookup)
