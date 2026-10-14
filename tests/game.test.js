import { test } from 'node:test'
import assert from 'node:assert/strict'
import { choosePair, countVotes, voteOutcome, guessOutcome } from '../src/game.js'
import { WORD_PAIRS } from '../src/words.js'

test('votes distinguish a tie, an innocent player, and a caught impostor', () => {
  assert.equal(voteOutcome([1, 2, 0], 3, 1), 'tie')
  assert.equal(voteOutcome([1, 0, 1], 3, 2), 'wrong-person')
  assert.equal(voteOutcome([1, 0, 1], 3, 1), 'guess')
  assert.deepEqual(countVotes([1, 0, 1], 3), [1, 2, 0])
})
test('guesses ignore capitalization and outer spaces', () => {
  assert.equal(guessOutcome('  TRAIN STATION  ', 'Train station'), 'stolen')
  assert.equal(guessOutcome('Airport', 'Train station'), 'caught')
})
test('every category and level plays through without repeats', () => {
  for (const category of new Set(WORD_PAIRS.map(pair => pair.category))) {
    for (const difficulty of ['Easy', 'Tricky']) {
      const pool = WORD_PAIRS.filter(pair => pair.category === category && pair.difficulty === difficulty)
      assert.ok(pool.length > 1)
      let used = [], last
      const seen = new Set()
      for (let i = 0; i < pool.length; i++) {
        const next = choosePair(pool, used, last, () => 0)
        assert.ok(!seen.has(next.pair.word))
        seen.add(next.pair.word); used = next.used; last = next.pair.word
      }
      assert.notEqual(choosePair(pool, used, last, () => 0).pair.word, last)
    }
  }
})
test('selection handles empty pools, one word, and a changed category', () => {
  const pool = [{ word: 'A' }, { word: 'B' }]
  assert.equal(choosePair([], [], undefined), null)
  assert.equal(choosePair([pool[0]], ['A'], 'A').pair.word, 'A')
  const next = choosePair(pool, ['A', 'B', 'Other'], 'B', () => 0)
  assert.deepEqual(next.used, ['Other', 'A'])
})
test('word bank has unique, complete pairs', () => {
  assert.equal(new Set(WORD_PAIRS.map(pair => pair.word)).size, WORD_PAIRS.length)
  assert.equal(WORD_PAIRS.length, 90)
  WORD_PAIRS.forEach(pair => {
    assert.ok(pair.word && pair.related && pair.category)
    assert.notEqual(pair.word, pair.related)
    assert.ok(['Easy', 'Tricky'].includes(pair.difficulty))
  })
})
