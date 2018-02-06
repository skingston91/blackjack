import { ucs2 } from 'punycode';

export const shuffleCards = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const startGame = (state) => {
  const newState = { ...state }
  let remainingCards = [ ...newState.currentCardArray ]
  const players = newState.players.map(player => {
    const openingResult =  dealOpeningCards(remainingCards, player.type)
    remainingCards = openingResult.remainingCards
    const { currentScore, newCurrentCards } = calculateScore(openingResult.playerCards)
    player.score = currentScore
    player.currentCards = newCurrentCards
    return player
  })
  return {
    ...state,
    players,
    currentPlayer: 'Player 1',
    currentPlayerType: 'player',
    currentCardArray: remainingCards
  }
}

export const cardNormalizer = (card, show) => {
  let code
  if (card === 'Jack' || card === 'Queen' || card === 'King') {
    if (card === 'Jack') {
      code = ucs2.encode([0x1F0AB])
    }
    if (card === 'Queen') {
      code = ucs2.encode([0x1F0AD])
    }
    if (card === 'King') {
      code = ucs2.encode([0x1F0AE])
    }
    return {
      value: 10,
      name: card,
      show,
      code,
    }
  }
  if (card === 'Ace') {
    return {
      value: 11,
      name: card,
      show,
      code: ucs2.encode([0x1F0A1]),
    }
  }
  code = `0x1F0A${card}`
  return {
    value: card,
    name: card && card.toString(),
    show,
    code: ucs2.encode([code]),
  }
}

export const dealCard = (cards, show = true) => {
  return {
    cards: cards.slice(1, cards.length -1), card: cardNormalizer(cards.slice(1)[0], show)
  }
}

export const dealOpeningCards = (cards, type) => {
  const firstResult = dealCard(cards)
  let secondResult
  if (type === 'dealer') {
    secondResult = dealCard(firstResult.cards, false)
  } else {
    secondResult = dealCard(firstResult.cards)
  }
  return { remainingCards: secondResult.cards, playerCards: [firstResult.card, secondResult.card] }
}

export const calculateScore = (currentCards) => {
  const newCurrentCards = [ ...currentCards ]
  const currentScore = scoreLogic(newCurrentCards);
  const finalState = aceLogic(currentScore, newCurrentCards)
  return { ...finalState }
}

const scoreLogic = (currentCards) => (
  currentCards.reduce((currentScore, card, index, currentCards) => {
    if (card.show) {
      return currentScore + card.value
    }
    return currentScore
  }, 0)
)

const aceLogic = (currentScore, currentCards) => {
  if (currentScore < 21) {
    return { currentScore, newCurrentCards: currentCards };
  }
  let newScore = currentScore;
  const newCurrentCards = currentCards.map(card => {
    if (card.name === 'Ace' && card.value === 11 && newScore > 21 ) {
      card.value = 1
      newScore = newScore - 10
      return card
    }
    return card
  })
  return { currentScore: newScore, newCurrentCards };
}

export const gameLogic = (state, playerIndex) => {
  const players = [ ...state.players]
  const player = { ...players[playerIndex]}
  let currentCardArray = [ ...state.currentCardArray ]
  if (player.score > 21) {
    player.status = 'bust'
  }
  let endState
  if (player.type === 'player') {
    if (player.status === 'bust') {
      endState = 'lose'
    }
    if (player.status === 'stuck') {
      const { player: dealer, endState: newEndState, currentCardArray: newCurrentCardArray } = dealerLogic(state)
      players[0] = dealer
      endState = newEndState
      currentCardArray = newCurrentCardArray
    }
  }
  players[playerIndex] = player
  return { players, endState, currentCardArray }
}

export const hitLogic = (state, playerIndex) => {
  const newState = { ...state }
  const players = newState.players
  const player = players[playerIndex]
  const cardResult = dealCard(newState.currentCardArray)
  const currentCards = player.currentCards.concat(cardResult.card);
  const { currentScore, newCurrentCards } = calculateScore(currentCards)

  player.score = currentScore
  player.currentCards = newCurrentCards
  return { players, currentCardArray: cardResult.cards }
}

export const stickLogic = (currentPlayer) => {
  const newCurrentPlayer = { ...currentPlayer }
  newCurrentPlayer.status = 'stuck'
  return newCurrentPlayer
}

const bustLogic = (currentPlayer) => {
  const newCurrentPlayer = { ...currentPlayer }
  newCurrentPlayer.status = 'bust'
  return newCurrentPlayer
}

export const dealerLogic = (state) => {
  const newPlayers = [ ...state.players ]
  let newCardArrays = [ ...state.currentCardArray ]
  const player = newPlayers.find(player => player.type === 'player')
  let dealer = newPlayers.find(player => player.type === 'dealer')
  const hiddenCardPosition = dealer.currentCards.findIndex((card, index) => card.show === false) // need to show the hidden card
  dealer.currentCards[hiddenCardPosition].show = true
  while (player.score >= dealer.score && dealer.score < 21 ) {
    const { players, currentCardArray } = hitLogic(state, 0)
    dealer = players[0]
    newCardArrays = currentCardArray
  }

  if (player.score <= dealer.score && dealer.score <= 21) {
    return { player: stickLogic(dealer), endState: 'lose', currentCardArray: newCardArrays }
  }

  return { player: bustLogic(dealer), endState: 'win', currentCardArray: newCardArrays }
}
