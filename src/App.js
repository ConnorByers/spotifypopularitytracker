import React, { Component } from 'react';
import axios from 'axios';
import Graph from './Graph';
import NavBar from './NavBar';
import styled from 'styled-components';
import './style.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = { allArtistAlbumPopularities: [], isLoading: true }
  }
  componentDidMount(){
    axios.get('/get_all_album_data')
      .then((res)=>{
        this.setState({
          allArtistAlbumPopularities: res.data,
          isLoading: false,
        })
      });
  }

  render() {  
    const Container = styled.div`
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          background-color: black;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        `;  
    const Roboabad = styled.div`
          display: grid;
          grid-template-columns: 100%;
          padding: 0 0 5% 0 ;
          width: 1000px;
          background-color: black;
          @media (max-width: 1300px) {
              width: 600px;
          }

          @media (max-width: 800px) {
              width: 90%;
          }
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
    const LoadingText = styled.p`
      font-size: 1.3rem;
      color: white;
      text-align: center;
      margin-top: 2rem;
    `;
    const LoadingDiv = styled.div`
      margin: 0;
      margin-top: 8rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    `;
    return (
      <Container>
        {this.state.isLoading ?
          <LoadingDiv>
            <Loader
              type="Circles"
              color="white"
              height={150}
              width={150}
            />
            <LoadingText>Loading....</LoadingText>
            <LoadingText>If this takes too long, refresh as free Heroku sometimes causes problems when this site is loading for the first time in a while</LoadingText>
          </LoadingDiv>
          :
          <>
            <NavBar />
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
          </>
        }
        
      </Container>
    )
  }
}
