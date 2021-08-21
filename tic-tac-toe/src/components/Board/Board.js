import React from 'react';
import ReactDOM from 'react-dom';
import Square from '../Square/Square.js';
import '../../styles/Board/Board.css'

class Board extends React.Component {
    // props: rowCnt, colCnt
    constructor(props) {
        super(props);
        this.state = {
            nextPlayer: true,
        }
    } 

    checkPosition = (row, col, typ) => {
        const position = row * this.props.colCnt + col;
      return (row >= 0) && (row < this.props.rowCnt) && (col >= 0) && (col < this.props.colCnt) && (this.props.boardState[position] === typ);
    }

    countSquare = (row, col, dRow, dCol, typ) => {
      let res = 0;
    //   console.log(row, col, position, this.props.colCnt);
      for(let i = 1; i <= 5 && this.checkPosition(row, col, typ); i++) {
        res += 1;
        row += dRow;
        col += dCol;
      }
      return res;
    }
    checkWinner = (position) => {
        const winLimit = this.props.winLimit;
      let row = Math.floor(position / this.props.colCnt), col = position % this.props.colCnt, typ = this.props.boardState[position];

      // diagonal \
      let cnt = this.countSquare(row, col, -1, -1, typ) + this.countSquare(row, col, 1, 1, typ) - 1;
    //   console.log(position, row, col, cnt);
      if(cnt >= winLimit) return this.props.boardState[position];

      // diagonal /
      cnt = this.countSquare(row, col, -1, 1, typ) + this.countSquare(row, col, 1, -1, typ) - 1;
    //   console.log(position, row, col, cnt, typ);
      if(cnt >= winLimit) return this.props.boardState[position];

      // vertical |
      cnt = this.countSquare(row, col, -1, 0, typ) + this.countSquare(row, col, 1, 0, typ) - 1;
      if(cnt >= winLimit) return this.props.boardState[position];

      // horizonal 
      cnt = this.countSquare(row, col, 0, -1, typ) + this.countSquare(row, col, 0, 1, typ) - 1;
      if(cnt >= winLimit) return this.props.boardState[position];

      return null;
    } 

    handleClick = (i) => {
      if(this.props.winner) 
        return;
      let boardState = this.props.boardState.slice();
      // console.log(boardState);
      if(boardState[i] === null) {
        boardState[i] = ((this.props.nextPlayer === true) ? 'X' : 'O');
        this.props.addHistory(boardState, i);

      }
    }

    renderSquare(i) {
      return <Square value={i} squareState={this.props.boardState[i]} onClick={() => this.handleClick(i)}/>;
    }

    render() {
        if(!this.props.winner) {
            const winner = this.checkWinner(this.props.lastMove);
            if(winner) {
                this.props.setWinner(winner);
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

export default Board;