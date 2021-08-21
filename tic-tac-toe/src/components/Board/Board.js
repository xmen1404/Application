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
      let res = [];

    //   console.log(row, col, position, this.props.colCnt);
      let nRow = row + dRow, nCol = col + dCol;
      for(let i = 1; i <= 5 && this.checkPosition(nRow, nCol, typ); i++) {
        let position = nRow*this.props.colCnt + nCol;
        res.push(position);
        nRow += dRow;
        nCol += dCol;
      }
      return res;
    }
    checkWinner = (position) => {
        const winLimit = this.props.winLimit;
      let row = Math.floor(position / this.props.colCnt), col = position % this.props.colCnt, typ = this.props.boardState[position];

      // diagonal \
      let cnt = [...this.countSquare(row, col, -1, -1, typ), ...this.countSquare(row, col, 1, 1, typ), position];
    //   console.log(position, row, col, cnt);
      if(cnt.length >= winLimit) return cnt;

      // diagonal /
      cnt = [...this.countSquare(row, col, -1, 1, typ), ...this.countSquare(row, col, 1, -1, typ), position];
    //   console.log(position, row, col, cnt, typ);
    if(cnt.length >= winLimit) return cnt;

      // vertical |
      cnt = [...this.countSquare(row, col, -1, 0, typ), ...this.countSquare(row, col, 1, 0, typ), position];
      if(cnt.length >= winLimit) return cnt;

      // horizonal 
      cnt = [...this.countSquare(row, col, 0, -1, typ), ...this.countSquare(row, col, 0, 1, typ), position];
      if(cnt.length >= winLimit) return cnt;

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

    renderSquare(i, color) {
      return <Square 
        value={i} 
        squareState={this.props.boardState[i]} 
        onClick={() => this.handleClick(i)}
        color={color}
      />;
    }

    // traceMove = (diff, position) => {
    //   let row = Math.floor(position / this.props.colCnt) + diff[0];
    //   let col = position % this.props.colCnt + diff[1];
    //   let res = [position];
    //   for(let i = 0; i < 5 && this.checkPosition(row, col); ++i) {
    //     position = row*this.props.colCnt + col;
    //     res.push(position);
    //     row += diff[0];
    //     col += diff[1];
    //   }
    // }

    componentDidUpdate(prevProps) {
      if(!this.props.winner) {
        const winner = this.checkWinner(this.props.lastMove);
        if(winner) {
            this.props.setWinner(winner, this.props.lastMove);
        }
      }
    }

    render() {
      let boardState = [];
      for(let i = 0 ; i < this.props.rowCnt; ++i) {
        let curRow = [];
        for(let j = 0; j < this.props.colCnt; ++j) {
          const pos = i*this.props.colCnt + j;
          curRow.push(this.renderSquare(pos, this.props.color[pos]));
        }
        boardState.push(
          <div className="board-row">
            {curRow}
          </div>
        );
      }
      
      return (
        <div>
          {boardState}
        </div>
      );
    }
  }

export default Board;