import React, { Component } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

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
    return (
      <div>
        {Object.keys(this.state.allArtistAlbumPopularities).map(key=>{
            const artistName = this.state.allArtistAlbumPopularities[key]['artistName']
            const allPopularities = this.state.allArtistAlbumPopularities[key]['albumIds']
            console.log(artistName)
            console.log(allPopularities)
            const newSeries = Object.keys(allPopularities).map(key=>(
              {
                albumName: allPopularities[key].albumName,
                data: allPopularities[key].popularities,
                albumId: key
              }
            ))

            return (
              <div>
              <LineChart width={600} height={300} key={key}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="date" label="Date"/>
                <YAxis dataKey="popularity"/>
                <Legend />
                {newSeries.map(s => (
                  <Line dataKey="popularity" activateDot={false} dot={false} data={s.data} name={s.albumName} key={s.albumId} />
                ))}
              </LineChart>
              </div>
            );
        })}
      </div>
    )
  }
}
