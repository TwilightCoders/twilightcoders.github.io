import React, { Component } from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
import Marked from 'marked';
import './carousel-item.css';

class CarouselItem extends Component {
  state = {
    big: false
  }

  makeBig() {
    if (!this.props.active) return;

    this.props.toggle();
    this.setState({big: !this.state.big});
  }

  truncate(str, amount = 100) {
    if (str.length > amount + 3) {
      return str.substring(0, amount) + '...';
    }
    return str;
  }

  render() {
    let { project, active } = this.props;
    let readme = (<div dangerouslySetInnerHTML={project.readme ? { __html: Marked(project.readme.text) } : { __html: 'No readme' }}></div>);
    let activeName = active ? `carousel-item active` : `carousel-item`;
    if (this.state.big) activeName += ' big';
    return (
      <li className={activeName} onClick={() => this.makeBig()}>
        <h1>{ project.name }</h1>
        <h2>{project.description}</h2>
        {readme}
      </li>
    );
  }
}

export default createFragmentContainer(
  CarouselItem,
  graphql`
    fragment carouselItem_project on Repository {
      name
      id
      homepageUrl
      description
      url
      readme: object(expression: "master:README.md") {
        ... on Blob {
          text
        }
      }
    }
  `
);
