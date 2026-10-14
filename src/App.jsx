import { useEffect, useState } from 'react'
import './App.css'
import { WORD_PAIRS } from './words'
import { choosePair, countVotes, voteOutcome, guessOutcome } from './game'

function savedSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem('impostor-settings'))
    return { players: Array.isArray(saved?.players) ? saved.players.filter(p => typeof p === 'string' && p.trim()).slice(0, 20) : [], mode: saved?.mode === 'twist' ? 'twist' : 'classic' }
  } catch { return { players: [], mode: 'classic' } }
}
const categories = [...new Set(WORD_PAIRS.map(p => p.category))]

function App() {
  const [saved] = useState(savedSettings)
  const [players, setPlayers] = useState(saved.players)
  const [mode, setMode] = useState(saved.mode)
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [category, setCategory] = useState('All categories')
  const [difficulty, setDifficulty] = useState('All levels')
  const [used, setUsed] = useState([])
  const [phase, setPhase] = useState('setup')
  const [pair, setPair] = useState(null)
  const [impostor, setImpostor] = useState(0)
  const [firstSpeaker, setFirstSpeaker] = useState(0)
  const [current, setCurrent] = useState(0)
  const [showing, setShowing] = useState(false)
  const [votes, setVotes] = useState([])
  const [suspect, setSuspect] = useState(null)
  const [guess, setGuess] = useState('')
  const [result, setResult] = useState('')
  const [scores, setScores] = useState({})
  const [round, setRound] = useState(0)
  const [clueRound, setClueRound] = useState(1)
  const [duration, setDuration] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    try { localStorage.setItem('impostor-settings', JSON.stringify({ players, mode })) } catch { /* Storage is optional. */ }
  }, [players, mode])
  useEffect(() => {
    if (phase !== 'discuss' || !running || seconds <= 0) return
    const timer = setInterval(() => setSeconds(value => Math.max(0, value - 1)), 1000)
    return () => clearInterval(timer)
  }, [phase, running, seconds])

  const pool = WORD_PAIRS.filter(p => (category === 'All categories' || p.category === category) && (difficulty === 'All levels' || p.difficulty === difficulty))
  function addPlayer(event) {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return setError('Enter a name first.')
    if (players.some(p => p.toLowerCase() === trimmed.toLowerCase())) return setError('That name is already playing. Add an initial to tell players apart.')
    if (players.length >= 20) return setError('You can play with up to 20 people.')
    setPlayers([...players, trimmed]); setName(''); setError('')
  }
  function startGame() {
    if (players.length < 3 || !pool.length) return
    const next = choosePair(pool, used, pair?.word)
    setPair(next.pair); setUsed(next.used)
    setImpostor(Math.floor(Math.random() * players.length))
    setFirstSpeaker(Math.floor(Math.random() * players.length))
    setCurrent(0); setShowing(false); setVotes([]); setSuspect(null); setGuess(''); setResult('')
    setRound(value => value + 1); setClueRound(1); setSeconds(duration); setRunning(false); setPhase('reveal')
  }
  function finish(outcome) {
    setResult(outcome)
    setScores(previous => {
      const next = Object.assign(Object.create(null), previous)
      players.forEach((player, index) => {
        const won = outcome === 'caught' ? index !== impostor : index === impostor
        next[player] = (Object.hasOwn(next, player) ? next[player] : 0) + (won ? 1 : 0)
      })
      return next
    })
    setPhase('result')
  }
  function castVote() {
    if (suspect === null) return
    const next = [...votes, suspect]
    setVotes(next); setSuspect(null); setShowing(false)
    if (current < players.length - 1) return setCurrent(current + 1)
    const outcome = voteOutcome(next, players.length, impostor)
    if (outcome === 'guess') setPhase('guess')
    else finish(outcome)
  }
  function submitGuess(event) {
    event.preventDefault()
    if (guess.trim()) finish(guessOutcome(guess, pair.word))
  }
  const steps = ['setup', 'reveal', 'discuss', 'vote', 'result']
  const step = phase === 'guess' ? 3 : steps.indexOf(phase)
  let content
  if (phase === 'setup') content = <>
    <div className="intro"><span className="eyebrow">ONE PHONE. A ROOM FULL OF SUSPECTS.</span><h1>Trust your friends.<br/><span>Question their clues.</span></h1><p>A secret word, one impostor, and a very convincing poker face.</p></div>
    <section className="panel"><div className="section-heading"><h2>Your players</h2><span className="badge">{players.length} / 20</span></div>
      <form className="row" onSubmit={addPlayer}><label className="sr-only" htmlFor="player-name">Player name</label><input id="player-name" value={name} onChange={e => { setName(e.target.value); setError('') }} placeholder="Enter a name" maxLength={30} aria-invalid={!!error} aria-describedby={error ? 'name-error' : undefined} autoComplete="off"/><button className="primary">Add</button></form>
      {error && <p className="error" id="name-error" role="alert">{error}</p>}
      {players.length ? <ul className="player-list">{players.map((p, i) => <li key={p}><span className="avatar">{i + 1}</span><span className="player-name">{p}</span><button className="icon-button" aria-label={`Remove ${p}`} onClick={() => setPlayers(players.filter(name => name !== p))}>×</button></li>)}</ul> : <p className="empty">Who’s playing? Add your group to get started.</p>}
      <p className="small">3–20 players · Names and mode are remembered on this device.</p>
    </section>
    <section className="panel"><h2>Choose your twist</h2><div className="mode-grid">{[['classic', 'Classic', 'One player knows they’re the impostor and must bluff without a word.'], ['twist', 'Twist', 'One player gets a related word. Nobody knows who the impostor is.']].map(([value, title, text]) => <button key={value} className={`mode-card ${mode === value ? 'selected' : ''}`} aria-pressed={mode === value} onClick={() => setMode(value)}><span>{title}<span aria-hidden="true">{mode === value ? '●' : '○'}</span></span><small>{text}</small></button>)}</div>
      <div className="settings"><label>Category<select value={category} onChange={e => setCategory(e.target.value)}><option>All categories</option>{categories.map(c => <option key={c}>{c}</option>)}</select></label><label>Difficulty<select value={difficulty} onChange={e => setDifficulty(e.target.value)}><option>All levels</option><option>Easy</option><option>Tricky</option></select></label><label className="full">Discussion timer<select value={duration} onChange={e => setDuration(Number(e.target.value))}><option value={0}>No timer — take your time</option><option value={60}>1 minute per clue round</option><option value={120}>2 minutes per clue round</option><option value={180}>3 minutes per clue round</option></select></label></div><p className="small">{pool.length} word pairs · No repeats until your selection is used up.</p>
    </section>
    <details className="rules"><summary>How to play</summary><ol><li>Pass the phone around. Privately reveal your word or role.</li><li>Give one clue each in the shown order. Don’t say your word. Discuss who sounds suspicious.</li><li>Pass the phone again to vote secretly. You can’t vote for yourself.</li><li>A caught impostor gets one guess at the secret word to steal the win. A tied vote lets them escape.</li></ol><p>Each winning player earns 1 point. Scores last for this session.</p></details>
    <button className="primary big" disabled={players.length < 3 || !pool.length} onClick={startGame}>Start game →</button><p className="small centered">{players.length < 3 ? `Add ${3 - players.length} more ${players.length === 2 ? 'player' : 'players'} to start.` : !pool.length ? 'Choose another category or difficulty to find words.' : `${players.length} players. One impostor. Let’s play.`}</p>
  </>
  else if (phase === 'reveal') content = <section className="panel game-panel"><span className="eyebrow">SECRET REVEAL · {current + 1} OF {players.length}</span>{showing ? <><h1>{players[current]}</h1><p>{current === impostor && mode === 'classic' ? 'Your role is' : 'Your secret word is'}</p><div className="secret">{current === impostor ? mode === 'twist' ? pair.related : 'You’re the impostor' : pair.word}</div><p>{current === impostor && mode === 'classic' ? 'Listen carefully. Blend in. Don’t get caught.' : 'Remember it. Keep it to yourself.'}</p><button className="primary big" onClick={() => { setShowing(false); if (current < players.length - 1) setCurrent(current + 1); else setPhase('discuss') }}>Hide & {current < players.length - 1 ? 'pass phone' : 'start discussion'}</button></> : <><div className="handoff-icon" aria-hidden="true">↗</div><h1>Pass to<br/><span>{players[current]}</span></h1><p>Only {players[current]} should look at the next screen.</p><button className="primary big" onClick={() => setShowing(true)}>I’m {players[current]} · Reveal</button></>}</section>
  else if (phase === 'discuss') content = <section className="panel game-panel"><span className="eyebrow">CLUE ROUND {clueRound}</span><h1>Let’s hear<br/><span>your clues.</span></h1><p>Give one clue each. Keep the word secret, then discuss who doesn’t fit.</p><ol className="speaking-order">{players.map((_, i) => <li key={i}><span className="avatar">{i + 1}</span><span className="player-name">{players[(firstSpeaker + i) % players.length]}</span>{i === 0 && <span className="badge">Goes first</span>}</li>)}</ol>{duration > 0 && <div className="timer"><span role="timer" aria-label={`${seconds} seconds remaining`}>{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</span><p aria-live="polite">{seconds === 0 ? 'Time’s up. Finish your clues and vote when ready.' : 'Vote whenever you’re ready.'}</p><button disabled={seconds === 0} onClick={() => setRunning(!running)}>{running && seconds > 0 ? 'Pause' : 'Start timer'}</button><button onClick={() => { setSeconds(duration); setRunning(false) }}>Reset</button></div>}<button className="primary big" onClick={() => { setCurrent(0); setShowing(false); setSuspect(null); setRunning(false); setPhase('vote') }}>Start secret voting</button><button className="big" onClick={() => { setClueRound(v => v + 1); setFirstSpeaker(v => (v + 1) % players.length); setSeconds(duration); setRunning(false) }}>Another clue round</button></section>
  else if (phase === 'vote') content = <section className="panel game-panel"><span className="eyebrow">SECRET VOTE · {current + 1} OF {players.length}</span>{!showing ? <><div className="handoff-icon" aria-hidden="true">↗</div><h1>Pass to<br/><span>{players[current]}</span></h1><p>Keep your choice private. Only {players[current]} should look.</p><button className="primary big" onClick={() => setShowing(true)}>I’m {players[current]} · Ready to vote</button></> : <><h1>{players[current]},<br/><span>who’s bluffing?</span></h1><p>Select a suspect, then lock in your vote.</p><div className="vote-list">{players.map((p, i) => i === current ? null : <button key={p} className={suspect === i ? 'selected' : ''} aria-pressed={suspect === i} onClick={() => setSuspect(i)}>{p}<span aria-hidden="true">{suspect === i ? '●' : '○'}</span></button>)}</div><button className="primary big" disabled={suspect === null} onClick={castVote}>Lock vote & {current < players.length - 1 ? 'hide' : 'see outcome'}</button></>}</section>
  else if (phase === 'guess') content = <section className="panel game-panel"><span className="eyebrow">ONE LAST CHANCE</span><h1>Caught,<br/><span>{players[impostor]}.</span></h1><p>You’re the impostor! Guess the group’s secret word to steal the win.</p><form onSubmit={submitGuess}><label className="input-label" htmlFor="guess">Your final guess</label><input id="guess" value={guess} onChange={e => setGuess(e.target.value)} placeholder="What was their word?" autoComplete="off" maxLength={80}/><button className="primary big" disabled={!guess.trim()}>Submit guess</button></form></section>
  else {
    const messages = { tie: ['A split decision.', 'The vote was tied, so the impostor escapes.'], 'wrong-person': ['The perfect bluff.', 'The group voted for an innocent player. The impostor wins.'], stolen: ['Stolen at the finish.', 'The impostor guessed the word and stole the win.'], caught: ['Case closed.', 'The impostor was caught and guessed wrong. The group wins!'] }
    const counts = countVotes(votes, players.length)
    content = <section className="panel game-panel"><span className="eyebrow">ROUND {round} · {result === 'caught' ? 'GROUP WINS' : 'IMPOSTOR WINS'}</span><h1>{messages[result][0]}</h1><p>{messages[result][1]}</p><div className="result-card"><span className="small">THE IMPOSTOR</span><strong>{players[impostor]}</strong><span className="small">THE SECRET WORD</span><strong>{pair.word}</strong>{mode === 'twist' && <><span className="small">THE IMPOSTOR’S WORD</span><strong>{pair.related}</strong></>}{guess && <p>Final guess: {guess}</p>}</div><h2 className="result-heading">The votes</h2><ul className="player-list">{players.map((p, i) => <li key={p}><span className="player-name">{p}{i === impostor && <small> · Impostor</small>}</span><span className="badge">{counts[i]} {counts[i] === 1 ? 'vote' : 'votes'}</span></li>)}</ul><details className="rules"><summary>Session scores</summary><ul className="player-list">{players.map(p => <li key={p}><span className="player-name">{p}</span><span>{Object.hasOwn(scores, p) ? scores[p] : 0} pts</span></li>)}</ul><button onClick={() => setScores({})}>Reset scores</button></details><button className="primary big" onClick={startGame}>Play next round →</button><button className="big" onClick={() => setPhase('setup')}>Players & settings</button></section>
  }
  return <div className="app"><header><span className="brand">◈ <span>IMPOSTOR</span></span><span className="small">{phase === 'setup' ? 'A little friendly suspicion' : `Round ${round} · ${mode === 'classic' ? 'Classic' : 'Twist'}`}</span></header><nav className="progress" aria-label="Game progress">{['Setup', 'Reveal', 'Discuss', 'Vote', 'Result'].map((label, i) => <span key={label} className={i === step ? 'active' : i < step ? 'complete' : ''} aria-current={i === step ? 'step' : undefined}>{label}</span>)}</nav><main key={phase} className="content">{content}</main><footer>Stay curious. Stay suspicious.</footer></div>
}
export default App
