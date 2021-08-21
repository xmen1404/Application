import React from 'react';
import ReactDOM from 'react-dom';
import Board from '../Board/Board.js';
import '../../styles/Game/Game.css'

class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [[Array(9).fill(null), true, null]], 
        winner: null,
        nextPlayer: true,
      };
    }

    setWinner = (winner) => {
      this.setState({winner: winner});
    }

    addHistory = (boardState, lastMove) => {
      let history = this.state.history.slice();
      history.push([boardState, !this.state.nextPlayer, lastMove]);
      this.setState({history: history});
      this.setState({nextPlayer: !this.state.nextPlayer});
    }

    moveTo = (move) => {
      const history = this.state.history.slice(0, move + 1);
      this.setState({history: history});
      this.setState({nextPlayer: history[history.length-1][1]});
      this.setState({winner: null});
    }

    render() {
      const historyChange = this.state.history.map((boardState, move) => {
        const desc = move ? 'Go to move: ' + move : 'Go to game start';
        return (
          <li>
            <button onClick={() => {this.moveTo(move)}}>{desc}</button>
          </li>
        );
      });
      let status = 'Next player: ' + ((this.state.nextPlayer === true) ? 'X' : 'O');
      if(this.state.winner) {
        status = this.state.winner + ' Won! Game ended.';
      }
      const lastBoardState = this.state.history[this.state.history.length-1];
      return (
        <div className="game">
          <div className="game-board">
            <Board 
              addHistory={this.addHistory} 
              setWinner={this.setWinner} 
              winner={this.state.winner} 
              boardState={lastBoardState[0]} 
              nextPlayer={lastBoardState[1]}
              lastMove={lastBoardState[2]}
              rowCnt={3}
              colCnt={3}
              winLimit={3}
            />
          </div>
          <div className="game-info">
          <div className="status">{status}</div>
            <ol>{historyChange}</ol>
          </div>
        </div>
      );
    }
  }

export default Game;