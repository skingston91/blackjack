import React, { Component } from 'react'
import Player from './Components/Player'
import Button from './Components/Button'

import {
    shuffleCards,
    hitLogic,
    stickLogic,
    startGame,
    dealerLogic,
    gameLogic,
} from './utils'

const cards = [
  2,3,4,5,6,7,8,9,10, 'Ace', 'Jack', 'Queen', 'King',
  2,3,4,5,6,7,8,9,10, 'Ace', 'Jack', 'Queen', 'King',
  2,3,4,5,6,7,8,9,10, 'Ace', 'Jack', 'Queen', 'King',
  2,3,4,5,6,7,8,9,10, 'Ace', 'Jack', 'Queen', 'King',
]

const initalState = {
  currentPlayer: 'start',
  currentPlayerType: undefined,
  players: [
    {
      status: 'playing',
      score: 0,
      currentCards: [],
      type: 'dealer',
      name: 'The Dealer',
    },
    {
      status: 'playing',
      score: 0,
      currentCards: [],
      type: 'player',
      name: 'Player 1'
    },
  ],
  currentCardArray: shuffleCards(cards),
  endState: undefined,
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = startGame(initalState)
  }

  reset = () => {
    const newInitalState = { ...initalState }
    const shuffledCards = [ ...shuffleCards(cards) ]
    newInitalState.currentCardArray = shuffledCards
    this.setState(startGame(newInitalState))
  }

  hit = (playerIndex) => {
    const currentState = { ...this.state, ...hitLogic(this.state, playerIndex) }
    this.setState(gameLogic(currentState, playerIndex))
  }

  stick = (playerIndex) => {
    const players = [ ...this.state.players]
    players[playerIndex] = stickLogic(players[playerIndex])
    const { player, endState, currentCardArray } = dealerLogic(this.state)
    players[0] = player;
    this.setState({ players, currentPlayer: 'The Dealer', currentPlayerType: 'dealer', endState, currentCardArray })
  }

  render() {
    const { currentPlayer, endState } = this.state
    return (
      <div className="App">
        <h1> Blackjack </h1>
        { endState === 'lose' && <h1> You Lose Sorry! </h1> }
        { endState === 'win' && <h1> You Win Wohoo! </h1> }
        { this.state.players.map((player, index) => (
          <Player
            key={ index }
            index={ index }
            player={ player }
            currentPlayer={ currentPlayer === player.name }
            stickClick={ this.stick }
            hitClick= { this.hit }
          /> ))
        }
        <Button content='Reset' className='reset' onClick={ this.reset } />
      </div>
    )
  }
}

export default App
