import React, { Component } from 'react';
import './carousel.css';
import CarouselItem from './carousel-item';

export default class carousel extends Component {
  render() {
    let items = [];

    for (let i = 0; i < 5; ++i) {
      items.push(
        <CarouselItem />
      );
    }
    return (
      <div className="container showcase">
        <ul className="carousel" style={this.props.style}>
          {items.map((item, index) =>
            <CarouselItem key={index} id={index} />
          )}
        </ul>
      </div>
    );
  }
};