import React from 'react';
import ReactDOM from 'react-dom';
import '../../styles/Square/Square.css'

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

export default Square;