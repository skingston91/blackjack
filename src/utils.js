export const shuffleCards = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const startGame = (state) => {
  const newState = { ...state }
  const currentCardArray = [ ...newState.currentCardArray ]
  const players = newState.players.map(player => {
    player.currentCards = dealOpeningCards(currentCardArray, player.type)
    const { currentScore, newCurrentCards } = calculateScore(player.currentCards)
    player.score = currentScore
    player.currentCards = newCurrentCards
    return player
  })
  newState.players = players
  newState.currentPlayer = 'Player 1'
  newState.currentPlayerType = 'player'
  newState.currentCardArray = currentCardArray
  return newState
}

export const cardNormalizer = (card, show) => {
  if (card === 'Jack' || card === 'Queen' || card === 'King') {
    return {
      value: 10,
      name: card,
      show
    }
  }
  if (card === 'Ace') {
    return {
      value: 11,
      name: card,
      show
    }
  }
  return {
    value: card,
    name: card && card.toString(),
    show
  }
}
export const drawCard = (cards) => cards.shift()
export const dealCard = (cards) => cardNormalizer(cards.shift(), true)

export const dealOpeningCards = (cards, type) => type === 'dealer' ?
 [cardNormalizer(drawCard(cards), true), cardNormalizer(drawCard(cards), false)] :
 [cardNormalizer(drawCard(cards), true), cardNormalizer(drawCard(cards), true)]

export const calculateScore = (currentCards) => {
  const newCurrentCards = [ ...currentCards ]
  const currentScore = (
    newCurrentCards.reduce((currentScore, card, index, currentCards) => {
      if (card.show) {
        if (currentScore >= 21) {
          currentCards.find((card) => {
            if (card.name === 'Ace' && card.value === 11) {
              card.value = 1
            }
            currentScore = currentScore - 10
            return card
          })
        }
        return currentScore + card.value
      }
      return currentScore
    }, 0)
  )
  return { currentScore, newCurrentCards }
}

export const gameLogic = (state, playerIndex) => {
  const newState = state
  const players = newState.players
  const player = players[playerIndex]
  if (player.score > 21) {
    player.status = 'bust'
  }
  let endState
  if (player.type === 'player') {
    if (player.status === 'bust') {
      endState = 'lose'
    }
    if (player.status === 'stuck') {
      const { player: dealer, endState: newEndState } = dealerLogic(state)
      players[0] = dealer
      endState = newEndState
    }
  }
  players[playerIndex] = player
  return { ...newState, endState }
}

export const hitLogic = (state, playerIndex) => {
  const newState = { ...state }
  const players = newState.players
  const player = players[playerIndex]
  const newCard = dealCard(newState.currentCardArray)
  player.currentCards.push(newCard)
  const { currentScore, newCurrentCards } = calculateScore(player.currentCards)
  player.score = currentScore
  player.currentCards = newCurrentCards
  return { players, currentCardArray: newState.currentCardArray }
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
    return { player: stickLogic(dealer), endState: 'lose', newCardArrays }
  }

  return { player: bustLogic(dealer), endState: 'win', newCardArrays }
}
