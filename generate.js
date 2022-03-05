const pitches = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const pitchNames = ['c', 'd♭', 'd', 'e♭', 'e', 'f', 'g♭', 'g', 'a♭', 'a', 'b♭', 'b']
const pitchMap = Object.fromEntries(pitches.map((p, i) => [p, pitchNames[i]]))

// https://bit.ly/3J1NQBf  https://bit.ly/3Kl6xQA
const chordTypes = [{
  type: 'o7',
  members: [0, 3, 6, 9],
  tones: [0, 2, 3, 5, 6, 8, 9, 11],
  weight: 1,
}, {
  type: 'ø7',
  members: [0, 3, 6, 10],
  tones: [0, 2, 3, 5, 6, 8, 10],
  weight: 2,
}, {
  type: '−7',
  members: [0, 3, 7, 10],
  tones: [0, 2, 3, 5, 7, 9, 10],
  weight: 5,
}, {
  type: '−Δ7',
  members: [0, 3, 7, 11],
  tones: [0, 2, 3, 5, 7, 9, 11],
  weight: 4,
}, {
  type: '7',
  members: [0, 4, 7, 10],
  tones: [0, 1, 2, 3, 4, 6, 7, 8, 9, 10],
  weight: 4,
}, {
  type: '7♭5',
  members: [0, 4, 6, 10],
  tones: [0, 1, 2, 3, 4, 6, 7, 8, 9, 10],
  weight: 1,
}, {
  type: 'Δ7',
  members: [0, 4, 7, 11],
  tones: [0, 2, 4, 6, 7, 9, 11],
  weight: 5,
}, {
  type: '+7',
  members: [0, 4, 8, 10],
  tones: [0, 1, 2, 3, 4, 6, 8, 9, 10],
  weight: 1,
}, {
  type: '+Δ7',
  members: [0, 4, 8, 11],
  tones: [0, 2, 4, 6, 8, 11],
  weight: 1,
}]

const allChords = pitches.map(pitch =>
  chordTypes
    .map(chordType => ({
      pitch,
      pitchName: pitchMap[pitch],
      type: chordType.type,
      members: chordType.members.map(member => (pitch + member) % 12),
      tones: chordType.tones.map(tone => (pitch + tone) % 12),
      weight: chordType.weight,
    }))
).flat()

function makeChordSequence(length = 32) {
  let localAllChords = deepCopy(allChords)
  let currentChord = pickRandom(localAllChords)
  const chords = [currentChord]
  while (chords.length < length) {
    const intersectLength = Math.random() > 0.1
      ? 2
      : Math.random() > 0.3
        ? 3
        : 1
    let availableChords = localAllChords.filter(candidate =>
      intersect(currentChord.members, candidate.members).length == intersectLength
    )
    if (chords.length === length - 1) {
      availableChords = availableChords.filter(candidate =>
        intersect(chords[0].members, candidate.members).length == 2
      )
    }
    currentChord = pickRandomWithWeight(availableChords)
    currentChord.weight = 2 * chordTypes.find(ct => ct.type === currentChord.type).weight
    chords.push(currentChord)
  }
  return chords
}

function makeMeasureRhythm() {
  return [...Array(8)].map(() => Math.random() > 0.7)
}

function makeMelody() {
  const chords = makeChordSequence()
  const rhythm1 = makeMeasureRhythm()
  const rhythm2 = makeMeasureRhythm()

  return chords.map(chord => {
    const rhythm = Math.random() > 0.5 ? rhythm1 : rhythm2
    chord.melody = rhythm.map(on => {
      on = Math.random() > 0.9 ? !on : on
      if (!on) return false
      return pickRandom((Math.random() > 0.5 ? chord.members : chord.tones).slice(1))
    })
    return chord
  })
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickRandomWithWeight(arr) {
  const excessArr = arr.map(e => [...Array(e.weight)].fill(e)).flat()
  return pickRandom(excessArr)
}

function intersect(a, b) {
  return a.slice().filter(x => b.includes(x))
}

function deepCopy(a) {
  return JSON.parse(JSON.stringify(a))
}

const sequence = makeMelody()
console.log(
  sequence.map(chord => `${
    (chord.pitchName.toUpperCase() + chord.type).padStart(5)
  }: ${
    chord.melody.map(p => (pitchMap[p] || '-').padEnd(2)).join(' ')
  }`).join('\n')
)
