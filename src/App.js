import React, { Component } from 'react';
import './App.css';
import Carousel from './carousel/carousel';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentDegrees: 0,
      style: {},
      numElems: 5
    };

    this.RotateCarousel = this.RotateCarousel.bind(this);
  }

  RotateCarousel(direction) {
    let count = this.state.numElems;  // The number of items in the carousel
    let degs = 360.0 / count;
    let currdeg = this.state.currentDegrees;

    // If we are rotating right...
    if (direction === "right") {
      currdeg = currdeg - degs;
    }
    // If we are rotating left...
    if (direction === "left") {
      currdeg = currdeg + degs;
    }

    // Padding
    let extra = "rotateX(-5deg)";

    let value = extra + " rotateY(" + currdeg + "deg)";

    let newStyle = {
      WebkitTransform: value,
      MsTransform: value,
      Transform: value
    };
    /*
      "-webkit-transform: " + extra + " rotateY(" + currdeg + "deg) " +
      "-moz-transform: " + extra + " rotateY(" + currdeg + "deg)" +
      "-o-transform: " + extra + " rotateY(" + currdeg + "deg)" +
      "transform: " + extra + " rotateY(" + currdeg + "deg)";*/
    
    this.setState({currentDegrees: currdeg, style: newStyle});
  }

  render() {
    return (
      <div className="App">
        <h1>Twilight Coders</h1>
        <Carousel style={this.state.style} />
        <div className="next" onClick={() => this.RotateCarousel('right')}>Next</div>
        <div className="prev" onClick={() => this.RotateCarousel('left')}>Prev</div>
      </div>
    );
  }
}

export default App;
