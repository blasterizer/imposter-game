export function choosePair(pool, used, lastWord, random = Math.random) {
  if (!pool.length) return null
  let available = pool.filter(pair => !used.includes(pair.word))
  let history = used
  if (!available.length) {
    available = pool.length > 1 ? pool.filter(pair => pair.word !== lastWord) : pool
    history = used.filter(word => !pool.some(pair => pair.word === word))
  }
  const pair = available[Math.floor(random() * available.length)]
  return { pair, used: [...history, pair.word] }
}

export function countVotes(votes, playerCount) {
  return Array.from({ length: playerCount }, (_, index) => votes.filter(vote => vote === index).length)
}

export function voteOutcome(votes, playerCount, impostor) {
  const counts = countVotes(votes, playerCount)
  const highest = Math.max(...counts)
  if (counts.filter(count => count === highest).length > 1) return 'tie'
  return counts.indexOf(highest) === impostor ? 'guess' : 'wrong-person'
}

export function guessOutcome(guess, word) {
  return guess.trim().toLowerCase() === word.toLowerCase() ? 'stolen' : 'caught'
}
