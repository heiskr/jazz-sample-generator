const pitches = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const pitchNames = ['c', 'd♭', 'd', 'e♭', 'e', 'f', 'g♭', 'g', 'a♭', 'a', 'b♭', 'b']
const pitchMap = Object.fromEntries(pitches.map((p, i) => [p, pitchNames[i]]))

const chordTypes = [{
  name: 'diminished',
  members: [0, 3, 6, 9],
  weight: 1,
}, {
  name: 'halfDiminished',
  members: [0, 3, 6, 10],
  weight: 2,
}, {
  name: 'minor',
  members: [0, 3, 7, 10],
  weight: 5,
}, {
  name: 'minorMajor',
  members: [0, 3, 7, 11],
  weight: 4,
}, {
  name: 'dominant',
  members: [0, 4, 7, 10],
  weight: 4,
}, {
  name: 'major',
  members: [0, 4, 7, 11],
  weight: 5,
}, {
  name: 'augmented',
  members: [0, 4, 8, 10],
  weight: 1,
}, {
  name: 'augmentedMajor',
  members: [0, 4, 8, 11],
  weight: 1,
}]

const allChords = pitches.map(pitch =>
  chordTypes
    .map(chordType => ({
      pitch,
      pitchName: pitchMap[pitch],
      chordName: chordType.name,
      members: chordType.members.map(member => (pitch + member) % 12),
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
    currentChord.weight += 1
    chords.push(currentChord)
  }
  return chords
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

const sequence = makeChordSequence()
console.log(sequence.map(chord => `${chord.pitchName} ${chord.chordName}: ${chord.members.map(p => pitchMap[p]).join(' ')}`).join('\n'))
