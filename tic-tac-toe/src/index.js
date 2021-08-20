import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
      return (
        <button className="square" onClick={this.props.onClick}>
          {this.props.squareState}
        </button>
      );
    }
  }
  
  class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nextPlayer: true,
        }
    }

    checkWinner = () => {
      let boardState = this.props.boardState;
      const winPosition = [
        [0, 1, 2], 
        [3, 4, 5], 
        [6, 7, 8], 
        [0, 3, 6], 
        [1, 4, 7], 
        [2, 5, 8], 
        [0, 4, 8], 
        [2, 4, 6]
      ];
      for(let i = 0; i < winPosition.length; i++) {
        const [x, y, z] = winPosition[i];
        // console.log(i, this.state.boardState[x]);
        if(boardState[x] === null) continue;
        if(boardState[x] === boardState[y] && boardState[x] === boardState[z])
          return boardState[x];
      }
      return null;
    }

    handleClick = (i) => {
      if(this.props.winner) 
        return;
      let boardState = this.props.boardState.slice();
      // console.log(boardState);
      if(boardState[i] === null) {
        boardState[i] = ((this.props.nextPlayer === true) ? 'X' : 'O');
        this.props.addHistory(boardState);
      }
    }

    renderSquare(i) {
      return <Square value={i} squareState={this.props.boardState[i]} onClick={() => this.handleClick(i)}/>;
    }

    render() {
      console.log(this.props.winner);
      if(!this.props.winner) {
        const winner = this.checkWinner();
        if(winner) {
          this.props.setWinner(winner);
          console.log('haha');
          return null;
        }
      } 
  
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [[Array(9).fill(null), true]], 
        winner: null,
        nextPlayer: true,
      };
    }

    setWinner = (winner) => {
      this.setState({winner: winner});
    }

    addHistory = (boardState) => {
      let history = this.state.history.slice();
      history.push([boardState, !this.state.nextPlayer]);
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
            <Board addHistory={this.addHistory} setWinner={this.setWinner} winner={this.state.winner} boardState={lastBoardState[0]} nextPlayer={lastBoardState[1]}/>
          </div>
          <div className="game-info">
          <div className="status">{status}</div>
            <ol>{historyChange}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  