import React, { Component } from 'react';
import { graphql, QueryRenderer } from 'react-relay';
import environment from './relay';
import './App.css';
import Carousel from './carousel/carousel';

const repos = [
  { id: 'MDEwOlJlcG9zaXRvcnk2Nzg0Nzg2Mw==' },
  { id: 'MDEwOlJlcG9zaXRvcnkyMjAwMjk4Ng==' },
  { id: 'MDEwOlJlcG9zaXRvcnkyMzM3NjY3NA==' },
  { id: 'MDEwOlJlcG9zaXRvcnk4NzYxMTk2MA==' },
  //{ id: 'MDEwOlJlcG9zaXRvcnkyNjI0NTc0Mw==' },
  //{ id: 'MDEwOlJlcG9zaXRvcnkxMjY1MTA3MzE=' },
  //{ id: 'MDEwOlJlcG9zaXRvcnkxMTk3NTU0OTQ=' },
  { id: 'MDEwOlJlcG9zaXRvcnk4NjYwODIwMg==' },
  { id: 'MDEwOlJlcG9zaXRvcnk4MTQ4MTM4Nw==' },
];

const projects = repos.map(repo => { return repo.id });

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentDegrees: 0,
      style: {},
      numElems: projects.length,
      active: projects.length,
      paused: false
    };

    this.RotateCarousel = this.RotateCarousel.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  RotateCarousel(direction) {
    if (this.state.paused) return;

    let count = this.state.numElems;  // The number of items in the carousel
    let currdeg = this.state.currentDegrees;
    let active = this.state.active;
    let degs = 360.0 / count;

    // If we are rotating right...
    if (direction === "right") {
      currdeg = currdeg - degs;
      active = (active === count) ? 1 : active + 1;
    }
    // If we are rotating left...
    if (direction === "left") {
      currdeg = currdeg + degs;
      active = (active < 2) ? count : active - 1;
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
    
    console.log(`Active: ${active}`);

    this.setState({ currentDegrees: currdeg, style: newStyle, active });
  }

  toggle(index) {
    if (++index !== this.state.active) return;

    let paused = this.state.paused;

    /*if (paused) console.log('Was paused, now unpausing');
    else console.log('Was not paused, now pausing');*/

    this.setState({paused: !paused});
  }

  render() {
    let appClass = this.state.paused ? 'App paused' : 'App';
    return (
      <div className={appClass}>
        <h1>Twilight Coders</h1>
        <QueryRenderer
          environment={environment}
          query={graphql`
            query AppQuery($projects:[ID!]!) {
              projects: nodes(ids:$projects){
                ...carousel_projects
              }
            }
          `}
          variables={{ projects }}
          render={({ error, props }) => {
            if (error) return <div>Error!</div>
            if (!props) return <div>Loading...</div>
            return <Carousel
                    style={this.state.style}
                    numElems={this.state.numElems}
                    active={this.state.active}
                    toggle={this.toggle}
                    projects={props.projects} />;
          }}
        />
        <div className="next" onClick={() => this.RotateCarousel('right')}>Next</div>
        <div className="prev" onClick={() => this.RotateCarousel('left')}>Prev</div>
      </div>
    );
  }
}

export default App;
