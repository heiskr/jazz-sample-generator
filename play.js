async function play (sequence) {
  await Tone.start()
  const now = Tone.now()
  const reverb = new Tone.Reverb({ wet: 0.5 }).toDestination()
  const bassSynth = new Tone.PolySynth(Tone.Synth, {
    volume: -6,
    oscillator: { type: 'sawtooth8' },
    envelope: { attack: 0.03, sustain: 0.6, release: 0.1 },
  }).connect(reverb)
  const padSynth = new Tone.PolySynth(Tone.Synth, {
    volume: -16,
    oscillator: { type: 'square4' },
    envelope: { attack: 0.5, sustain: 1, release: 0.5 },
  }).connect(reverb)
  const leadSynth = new Tone.PolySynth(Tone.Synth, {
    volume: -6,
    oscillator: { type: 'square6' },
    envelope: { attack: 0.01, release: 10 },
  }).connect(reverb)
  Tone.Transport.bpm.value = 80
  sequence.forEach((chord, i) => {
    [0, 1.5, 2.5].map(b => {
      bassSynth.triggerAttackRelease(`${pitchMap[chord.members[0]]}3`, '4n', `${i}:${b}:0`)
      padSynth.triggerAttackRelease(
        [1, 2, 3].map(m => `${pitchMap[chord.members[m]]}4`),
        '4n',
        `${i}:${b}:0`
      )
    })
    chord.melody.map((pitch, j) => {
      if (pitch === false) return false
      leadSynth.triggerAttackRelease(
        `${pitchMap[pitch]}5`,
        '8n',
        `${i}:${Math.floor(j / 2)}:${j % 2 ? 2.5 : 0}`
      )
    })
  })
  Tone.Transport.start()
}
