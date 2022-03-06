async function play (sequence) {
  await Tone.start()
  const now = Tone.now()
  const bassSynth = new Tone.PolySynth(Tone.Synth, {
    volume: -6,
    oscillator: { type: 'square8' },
    envelope: { attack: 0.05, release: 0.1 },
  }).toDestination()
  const padSynth = new Tone.PolySynth(Tone.Synth, {
    volume: -16,
    oscillator: { type: 'square4' },
    envelope: { attack: 0.5, sustain: 1, release: 0.5 },
  }).toDestination()
  const leadSynth = new Tone.PolySynth(Tone.Synth, {
    volume: -6,
    oscillator: { type: 'square8' },
    envelope: { attack: 0.01, release: 1 },
  }).toDestination()
  sequence.forEach((chord, i) => {
    bassSynth.triggerAttackRelease(`${pitchMap[chord.members[0]]}3`, '1n', `${i}:0:0`)
    padSynth.triggerAttackRelease([
      `${pitchMap[chord.members[1]]}4`,
      `${pitchMap[chord.members[2]]}4`,
      `${pitchMap[chord.members[3]]}4`,
    ], '1n', `${i}:0:0`)
    chord.melody.map((pitch, j) => {
      if (pitch === false) return false
      leadSynth.triggerAttackRelease(`${pitchMap[pitch]}5`, '8n', `${i}:${j / 2}:0`)
    })
  })
  Tone.Transport.start()
}
