import React, { Component } from 'react'
import Player from './Components/Player'
import Button from './Components/Button'

// bug fix with the reset on the player status

import {
    shuffleCards,
    hitLogic,
    startGame,
    dealerLogic,
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
    const { player, currentCardArray } = hitLogic(this.state.players[playerIndex], this.state.currentCardArray)
    const newPlayers = [...this.state.players]
    let endState
    if (player.type === 'player') {
      if (player.status === 'bust') {
        endState = 'lose'
      } else {
        const { player, endState: newEndState } = dealerLogic(newPlayers, currentCardArray)
        newPlayers[0] = player
        endState = newEndState
      }
    }
    newPlayers[playerIndex] = player
    this.setState({ ...this.state, players: newPlayers, endState })
  }

  stick = (playerIndex) => {
    const players = [ ...this.state.players]
    const { player, endState } = dealerLogic(players, this.state.currentCardArray)
    players[playerIndex].status = 'stuck'
    players[0] = player
    this.setState({ ...this.state, players, currentPlayer: 'The Dealer', currentPlayerType: 'dealer', endState})
  }

  render() {
    const { currentPlayer, endState } = this.state
    return (
      <div className="App">
        { endState === 'lose' && <h1> You Lose Sorry! </h1> }
        { endState === 'win' && <h1> You Win Wohoo! </h1> }
        <Button content='Reset' className='button' onClick={ this.reset } />
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
      </div>
    )
  }
}

export default App
