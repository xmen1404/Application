import React from 'react';
import ReactDOM from 'react-dom';
import Board from '../Board/Board.js';
import '../../styles/Game/Game.css'

class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        rowCnt:38, 
        colCnt:38,
        winLimit: 5,
        history: [[Array(38*38).fill(null), true, null]], 
        color: [Array(38*38).fill('black')],
        winner: null,
        nextPlayer: true,
      };
    }

    setWinner = (winTrace, position) => {
      const boardState = this.state.history[this.state.history.length - 1][0];
      this.setState({winner: boardState[position]});
      console.log(position, boardState[position]);  
      const color = this.state.color.slice();
      winTrace.forEach(item => {
        color[item] = 'blue';
      });
      this.setState({color: color});
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
      this.setState({color: [Array(38*38).fill('black')]});
    }

    render() {
      const historyChange = this.state.history.map((boardState, move) => {
        const desc = move ? 'Go to move: ' + move : 'Go to game start';
        return (
          <li key={move}>
            <button onClick={() => {this.moveTo(move)}}>{desc}</button>
          </li>
        );
      });
      let status = 'Next player: ' + ((this.state.nextPlayer === true) ? 'X' : 'O');
      if(this.state.winner) {
        status = (this.state.winner === 'X') ? 'X took down the opponent!' : "You're fucked up, X";
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
              rowCnt={this.state.rowCnt}
              colCnt={this.state.colCnt}
              winLimit={this.state.winLimit}
              color={this.state.color}
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