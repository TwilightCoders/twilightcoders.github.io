import React, { Component } from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
import './carousel.css';
import CarouselItem from './carousel-item';


class carousel extends Component {
  
  render() {
    let { projects, active } = this.props;

    return (
      <div className="container showcase">
        <ul className="carousel" style={this.props.style}>
          {projects.map((project, index) => {
            return (
              <CarouselItem
                key={index}
                active={index === (active - 1)}
                project={project}
                toggle={() => { if (active) this.props.toggle(index); }} />
            );
          })}
        </ul>
      </div>
    );
  }
};

export default createFragmentContainer(
  carousel,
  graphql`
    fragment carousel_projects on Node @relay(plural: true) {
      ... on Repository {
        ...carouselItem_project
      }
    }
  `
);
