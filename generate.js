const pitches = [...Array(12).keys()]
const pitchNames = [
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'Gb',
  'G',
  'Ab',
  'A',
  'Bb',
  'B',
]
const pitchMap = Object.fromEntries(pitches.map((p, i) => [p, pitchNames[i]]))

// https://bit.ly/3J1NQBf  https://bit.ly/3Kl6xQA
const chordTypes = [
  {
    type: 'o7',
    members: [0, 3, 6, 9],
    tones: [0, 2, 3, 5, 6, 8, 9, 11],
    weight: 1,
  },
  {
    type: 'ø7',
    members: [0, 3, 6, 10],
    tones: [0, 2, 3, 5, 6, 8, 10],
    weight: 2,
  },
  {
    type: '−7',
    members: [0, 3, 7, 10],
    tones: [0, 2, 3, 5, 7, 9, 10],
    weight: 16,
  },
  {
    type: '−Δ7',
    members: [0, 3, 7, 11],
    tones: [0, 2, 3, 5, 7, 9, 11],
    weight: 4,
  },
  {
    type: '7',
    members: [0, 4, 7, 10],
    tones: [0, 1, 2, 3, 4, 6, 7, 8, 9, 10],
    weight: 4,
  },
  {
    type: '7b5',
    members: [0, 4, 6, 10],
    tones: [0, 1, 2, 3, 4, 6, 7, 8, 9, 10],
    weight: 1,
  },
  {
    type: 'Δ7',
    members: [0, 4, 7, 11],
    tones: [0, 2, 4, 6, 7, 9, 11],
    weight: 16,
  },
  {
    type: '+7',
    members: [0, 4, 8, 10],
    tones: [0, 1, 2, 3, 4, 6, 8, 9, 10],
    weight: 1,
  },
  {
    type: '+Δ7',
    members: [0, 4, 8, 11],
    tones: [0, 2, 4, 6, 8, 11],
    weight: 1,
  },
]

const allChords = pitches
  .map((pitch) =>
    chordTypes.map((chordType) => ({
      pitch,
      pitchName: pitchMap[pitch],
      type: chordType.type,
      members: chordType.members.map((member) => (pitch + member) % 12),
      tones: chordType.tones.map((tone) => (pitch + tone) % 12),
      weight: chordType.weight,
    }))
  )
  .flat()

function makeChordSequence(rand, length = 32) {
  let localAllChords = deepCopy(allChords)
  let currentChord = pickRandom(rand, localAllChords)
  const chords = [currentChord]
  while (chords.length < length) {
    const intersectLength =
      rand() > 0.1 ? 2 : rand() > 0.3 ? 3 : Math.round(rand())
    let availableChords = localAllChords.filter(
      (candidate) =>
        intersect(currentChord.members, candidate.members).length ==
        intersectLength
    )
    if (chords.length === length - 1) {
      availableChords = availableChords.filter(
        (candidate) =>
          intersect(chords[0].members, candidate.members).length == 2
      )
    }
    if (availableChords.length) {
      currentChord = pickRandomWithWeight(rand, availableChords)
    } else {
      currentChord = pickRandom(rand, localAllChords)
    }
    currentChord.weight =
      8 * chordTypes.find((ct) => ct.type === currentChord.type).weight
    chords.push(currentChord)
  }
  return chords
}

function makeMeasureRhythm(rand) {
  return [...Array(8)].map(() => rand() > 0.5)
}

function makeMelody(rand, sequence) {
  const rhythm1 = makeMeasureRhythm(rand)
  const rhythm2 = makeMeasureRhythm(rand)
  return deepCopy(sequence).map((chord) => {
    const rhythm = rand() > 0.5 ? rhythm1 : rhythm2
    chord.melody = rhythm.map((on) => {
      on = rand() > 0.9 ? !on : on
      if (!on) return false
      return pickRandom(
        rand,
        (rand() > 0.2 ? chord.members : chord.tones).slice(1)
      )
    })
    return chord
  })
}

function pickRandom(rand, arr) {
  return arr[Math.floor(rand() * arr.length)]
}

function pickRandomWithWeight(rand, arr) {
  const excessArr = arr.map((e) => [...Array(e.weight)].fill(e)).flat()
  return pickRandom(rand, excessArr)
}

function intersect(a, b) {
  return a.slice().filter((x) => b.includes(x))
}

function deepCopy(a) {
  return JSON.parse(JSON.stringify(a))
}

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

function formatSequence(sequence) {
  return sequence
    .map(
      (chord) => `${
        (chord.pitchName + chord.type).padStart(5)
      }: ${
        chord.melody.map((p) => (Number.isInteger(p) ? pitchMap[p] : '-').padEnd(2)).join(' ')
      }`
    )
    .join('\n')
}

function main(seed) {
  if (!seed) seed = Math.random().toString(36).slice(2)
  const rand = xmur3(seed)
  let sequence = makeChordSequence(rand)
  sequence = makeMelody(rand, sequence)
  return [seed, sequence, formatSequence(sequence)]
}

if (typeof require !== 'undefined' && require.main === module) {
  console.log(main().join('\n'))
}
