import React, { Component } from 'react';
import axios from 'axios';
import Graph from './Graph';
import NavBar from './NavBar';
import styled from 'styled-components';
import './style.css';

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
  goToTop(){
    window.scrollTo(0,0);
  }
  render() {  
    const Container = styled.div`
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          padding: 5% 30%;
          background-color: black;
        `;  
    const Roboabad = styled.div`
          display: grid;
          grid-template-columns: 100%;
          padding: 0 0 5% 0 ;
          border: 1px solid #000;
          border-radius: 0.5rem;
          margin: 0 0 5% 0;
          background-color: black;
        `;
    const GraphTitle = styled.p`
      text-align: center;
      line-height: 1.25; 
      font-size: 30px; 
      color: white;
    `;
    const divForTopButton = styled.div`
      width: 100%;
      background-color: def1fc;
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
