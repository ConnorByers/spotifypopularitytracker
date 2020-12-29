import React, { Component } from 'react';
import axios from 'axios';

import Graph from './Graph';
import styled from 'styled-components'
export default class App extends Component {
  constructor(props){
    super(props);
    this.state = { allArtistAlbumPopularities: [] }
  }
  componentDidMount(){
    axios.get('/get_all_album_data')
      .then((res)=>{
        this.setState({
          allArtistAlbumPopularities: res.data
        })
      });
  }
  render() {  
    const Container = styled.div`
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          padding: 0 30%;
          background-color: #fff;
        `;  
    const Roboabad = styled.div`
          display: grid;
          grid-template-columns: 100%;
          margin: 5%;
        `;
    const GraphTitle = styled.p`
      text-align: center;
    `;
    return (
      <Container>
        {
        Object.keys(this.state.allArtistAlbumPopularities).map((key)=>{
            const artistName = this.state.allArtistAlbumPopularities[key]['artistName']
            const allPopularities = this.state.allArtistAlbumPopularities[key]['albumIds']
            
            return (
                <Roboabad>
                  <GraphTitle>{artistName}</GraphTitle>
                  <Graph allPopularities={allPopularities} key={key} />
                </Roboabad>
            );
            
        })
        }
       
      </Container>
    )
  }
}
