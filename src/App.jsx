import { useState } from 'react'
import './App.css'
import { WORDS } from './words'

function randomIndex(length) {
  return Math.floor(Math.random() * length)
}

function App() {
  // Setup screen
  const [players, setPlayers] = useState([])
  const [name, setName] = useState('')

  // Which screen we're on: 'setup', 'reveal' or 'discuss'
  const [phase, setPhase] = useState('setup')

  // The secret parts of a round
  const [secretWord, setSecretWord] = useState('')
  const [impostor, setImpostor] = useState(0)
  const [firstSpeaker, setFirstSpeaker] = useState(0)

  // Pass-the-phone progress
  const [current, setCurrent] = useState(0)
  const [showing, setShowing] = useState(false)
  const [impostorRevealed, setImpostorRevealed] = useState(false)

  function addPlayer() {
    const trimmed = name.trim()
    if (trimmed === '' || players.includes(trimmed)) return
    setPlayers([...players, trimmed])
    setName('')
  }

  function removePlayer(playerToRemove) {
    setPlayers(players.filter((p) => p !== playerToRemove))
  }

  function startGame() {
    setSecretWord(WORDS[randomIndex(WORDS.length)])
    setImpostor(randomIndex(players.length))
    setFirstSpeaker(randomIndex(players.length))
    setCurrent(0)
    setShowing(false)
    setImpostorRevealed(false)
    setPhase('reveal')
  }

  function hideAndPass() {
    setShowing(false)
    if (current < players.length - 1) {
      setCurrent(current + 1)
    } else {
      setPhase('discuss')
    }
  }

  if (phase === 'reveal') {
    const isImpostor = current === impostor
    return (
      <div className="app">
        <p>Player {current + 1} of {players.length}</p>
        {showing ? (
          <>
            <h2>{players[current]}, your word is:</h2>
            <div className="secret">
              {isImpostor ? '🤫 You are the impostor!' : secretWord}
            </div>
            <button className="big" onClick={hideAndPass}>Hide & pass the phone</button>
          </>
        ) : (
          <>
            <h2>Pass the phone to {players[current]}</h2>
            <p>Make sure nobody else is looking 👀</p>
            <button className="big" onClick={() => setShowing(true)}>Tap to reveal</button>
          </>
        )}
      </div>
    )
  }

  if (phase === 'discuss') {
    return (
      <div className="app">
        <h2>Time to talk! 🗣️</h2>
        <p><b>{players[firstSpeaker]}</b> goes first. Everyone gives a one-word clue, then vote on who the impostor is.</p>
        {impostorRevealed ? (
          <div className="secret">
            The impostor was <b>{players[impostor]}</b>.<br />The word was <b>{secretWord}</b>.
          </div>
        ) : (
          <button className="big" onClick={() => setImpostorRevealed(true)}>Reveal the impostor</button>
        )}
        <button className="big" onClick={startGame}>Play again</button>
        <button className="big" onClick={() => setPhase('setup')}>Change players</button>
      </div>
    )
  }

  return (
    <div className="app">
      <h1>🕵️ Impostor</h1>
      <div className="row">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
          placeholder="Player name"
        />
        <button onClick={addPlayer}>Add</button>
      </div>
      <ul>
        {players.map((p) => (
          <li key={p}>
            {p} <button onClick={() => removePlayer(p)}>✕</button>
          </li>
        ))}
      </ul>
      <button className="big" disabled={players.length < 3} onClick={startGame}>
        Start game ({players.length} players)
      </button>
    </div>
  )
}

export default App