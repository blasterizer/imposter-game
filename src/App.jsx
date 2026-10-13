import { useState } from 'react'
import './App.css'
import { WORD_PAIRS } from './words'

function randomIndex(length) {
  return Math.floor(Math.random() * length)
}

function App() {
  // Setup screen
  const [players, setPlayers] = useState([])
  const [name, setName] = useState('')
  const [mode, setMode] = useState('classic') // 'classic' or 'twist'

  // Which screen we're on: 'setup', 'reveal', 'discuss', 'vote', 'guess' or 'result'
  const [phase, setPhase] = useState('setup')

  // The secret parts of a round
  const [secretWord, setSecretWord] = useState('')
  const [impostorWord, setImpostorWord] = useState('')
  const [impostor, setImpostor] = useState(0)
  const [firstSpeaker, setFirstSpeaker] = useState(0)

  // Pass-the-phone progress (used for revealing words and for voting)
  const [current, setCurrent] = useState(0)
  const [showing, setShowing] = useState(false)

  // Voting and the impostor's last guess
  const [votes, setVotes] = useState([])
  const [guess, setGuess] = useState('')
  const [result, setResult] = useState('')

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
    const pair = WORD_PAIRS[randomIndex(WORD_PAIRS.length)]
    setSecretWord(pair.word)
    setImpostorWord(pair.related)
    setImpostor(randomIndex(players.length))
    setFirstSpeaker(randomIndex(players.length))
    setCurrent(0)
    setShowing(false)
    setVotes([])
    setGuess('')
    setResult('')
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

  function startVoting() {
    setCurrent(0)
    setVotes([])
    setPhase('vote')
  }

  // Count how many votes each player got
  function countVotes(allVotes) {
    const counts = players.map(() => 0)
    allVotes.forEach((suspect) => {
      counts[suspect] = counts[suspect] + 1
    })
    return counts
  }

  function castVote(suspect) {
    const newVotes = [...votes, suspect]
    setVotes(newVotes)

    if (current < players.length - 1) {
      setCurrent(current + 1)
      return
    }

    // Everyone has voted: find who got the most votes
    const counts = countVotes(newVotes)
    const highest = Math.max(...counts)
    const topPlayers = counts.filter((c) => c === highest).length

    if (topPlayers > 1) {
      setResult('tie')
      setPhase('result')
    } else if (counts.indexOf(highest) === impostor) {
      setPhase('guess')
    } else {
      setResult('wrong-person')
      setPhase('result')
    }
  }

  function submitGuess() {
    const isCorrect = guess.trim().toLowerCase() === secretWord.toLowerCase()
    setResult(isCorrect ? 'stolen' : 'caught')
    setPhase('result')
  }

  if (phase === 'reveal') {
    const isImpostor = current === impostor
    const impostorText = mode === 'twist' ? impostorWord : '🤫 You are the impostor!'
    return (
      <div className="app">
        <p>Player {current + 1} of {players.length}</p>
        {showing ? (
          <>
            <h2>{players[current]}, your word is:</h2>
            <div className="secret">
              {isImpostor ? impostorText : secretWord}
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
        <p><b>{players[firstSpeaker]}</b> goes first. Everyone gives a one-word clue. When you're ready, vote on who the impostor is.</p>
        <button className="big" onClick={startVoting}>Start voting</button>
      </div>
    )
  }

  if (phase === 'vote') {
    return (
      <div className="app">
        <p>Vote {current + 1} of {players.length}</p>
        <h2>{players[current]}, who is the impostor?</h2>
        <p>Vote secretly, then pass the phone.</p>
        {players.map((p, index) =>
          index === current ? null : (
            <button key={p} className="big" onClick={() => castVote(index)}>{p}</button>
          )
        )}
      </div>
    )
  }

  if (phase === 'guess') {
    return (
      <div className="app">
        <h2>🎯 Caught! It was {players[impostor]}</h2>
        <p>{players[impostor]}, you get one chance to steal the win. What's the secret word?</p>
        <div className="row">
          <input
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitGuess()}
            placeholder="Your guess"
          />
          <button onClick={submitGuess}>Guess</button>
        </div>
      </div>
    )
  }

  if (phase === 'result') {
    const counts = countVotes(votes)
    const messages = {
      tie: '🤝 It was a tie, so the impostor escapes! Impostor wins.',
      'wrong-person': '😈 Wrong person! Impostor wins.',
      stolen: '😱 The impostor guessed the word and stole the win!',
      caught: '🎉 The impostor was caught and guessed wrong. Players win!',
    }
    return (
      <div className="app">
        <h2>{messages[result]}</h2>
        <div className="secret">
          Impostor: <b>{players[impostor]}</b><br />Word: <b>{secretWord}</b>
          {mode === 'twist' && <><br />Impostor's word: <b>{impostorWord}</b></>}
        </div>
        <ul>
          {players.map((p, index) => (
            <li key={p}>{p} <span>{counts[index]} votes</span></li>
          ))}
        </ul>
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
      <div className="modes">
        <button className={mode === 'classic' ? 'selected' : ''} onClick={() => setMode('classic')}>
          Classic
        </button>
        <button className={mode === 'twist' ? 'selected' : ''} onClick={() => setMode('twist')}>
          Twist
        </button>
      </div>
      <p className="hint">
        {mode === 'classic'
          ? 'The impostor knows they are the impostor.'
          : "The impostor gets a related word and doesn't know they're the impostor!"}
      </p>
      <button className="big" disabled={players.length < 3} onClick={startGame}>
        Start game ({players.length} players)
      </button>
    </div>
  )
}

export default App