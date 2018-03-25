import React, { Component } from 'react';
import './carousel-item.css';

export default class CarouselItem extends Component {
  render() {
    return (
      <li className='carousel-item'>
        <h1>Project {this.props.id + 1}</h1>
        <h2>Does Great Things</h2>
        <p>This is a description for the project</p>
      </li>
    );
  }
}