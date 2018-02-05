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
    player.currentCards = dealOpeningCards(currentCardArray, player.type) // fix card array modification
    player.score = calculateScore(player.currentCards)
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
    name: card.toString(),
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
  return (
    newCurrentCards.reduce((currentScore, card, index, currentCards) => {
      if (card.show) {
        if (currentScore >= 21) {
          currentCards.find((card) => {
            if (card.name === 'Ace' && card.value === 11) {
              card.value = 1
            }
            currentScore = currentScore - 10;
            return card
          })
        }
        return currentScore + card.value
      }
      return currentScore
    }, 0)
  )
}

export const hitLogic = (player, currentCardArray) => {
  const newPlayer = { ...player }
  const newCardArray = [ ...currentCardArray ]
  const newCard = dealCard(newCardArray)
  newPlayer.currentCards.push(newCard)
  newPlayer.score = newPlayer.currentCards ? calculateScore(newPlayer.currentCards) : 0
  if (newPlayer.score > 21) {
    newPlayer.status = 'bust'
  }
  return { player: newPlayer, currentCardArray: newCardArray }
}

export const stickLogic = (currentPlayer) => {
  const newCurrentPlayer = { ...currentPlayer }
  newCurrentPlayer.status = 'stuck'
  return newCurrentPlayer
}

export const dealerLogic = (players, currentCardArray) => {
  const newPlayers = [ ...players ]
  let newCardArrays = [ ...currentCardArray ]
  const player = newPlayers.find(player => player.type === 'player')
  let dealer = newPlayers.find(player => player.type === 'dealer')
  const hiddenCardPosition = dealer.currentCards.findIndex((card, index) => card.show === false) // need to show the hidden card
  dealer.currentCards[hiddenCardPosition].show = true

  while (player.score >= dealer.score || dealer.score > 21  ) {
    const hitResult = hitLogic(dealer, newCardArrays)
    dealer = hitResult.player
    currentCardArray = hitResult.currentCardArray
  }

  if (player.score <= dealer.score || dealer.score > 21) {
    return { player: stickLogic(dealer), endState: 'lose', currentCardArray }
  }
  return { player: stickLogic(dealer), endState: 'win', currentCardArray }
}
