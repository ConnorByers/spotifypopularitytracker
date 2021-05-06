import React, { Component } from 'react'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Label, Legend, ResponsiveContainer
  } from 'recharts';

export default class Graph extends Component {
    render() {
        const newSeries = Object.keys(this.props.allPopularities).map(key=>(
            {
              albumName: this.props.allPopularities[key].albumName,
              data: this.props.allPopularities[key].popularities.map((popularityObj)=>{
                let dateWTimezone = new Date(popularityObj.date.replace(/\//g, '-'));
                const userTimezoneOffset = dateWTimezone.getTimezoneOffset() * 60000;
                const dateWOTimezone = new Date(dateWTimezone.getTime() + userTimezoneOffset);

                return {
                  date: dateWOTimezone.getTime(),
                  popularity: popularityObj.popularity}
              }).sort((a,b)=>a.date - b.date),
              albumId: key
            }
          ))
          
          const strokeColours = ['#FFFF00', '#FF0000', '#00FF00', '#00FFFF', '#FF00FF', '#9D00FF', '#0033FF', '#FF0099', '#FF6600']
          const legendTextCSSFunction = (value, entry) => {
            
            return <span style={{ fontSize: '1.2rem',fontFamily: 'Roboto', color: 'white'}}>{value}</span>;
          };

          const formatXAxis = (timeInMilli) => {
            let date = new Date(timeInMilli);
            const userTimezoneOffset = date.getTimezoneOffset() * 60000;
            date = new Date(date.getTime() + userTimezoneOffset);
            return date.getFullYear() + '/' + String(date.getMonth() + 1).padStart(2, '0') + '/' + String(date.getDate()).padStart(2, '0')
          }

          return (
            <ResponsiveContainer aspect={1.6} >
                <LineChart key={this.props.key}>
                  <CartesianGrid strokeDasharray="3 3" fill="black" stroke="white"/>
                  <XAxis scale="time" dataKey="date" style={{fontSize: '1rem',fontFamily: 'Roboto', color: 'white'}} stroke="white" type="number" tickFormatter={formatXAxis} domain={['dataMin', 'dataMax']}/>
                  <YAxis dataKey="popularity" style={{fontSize: '1rem',fontFamily: 'Roboto'}} domain={[0, 100]} stroke="white">
                    <Label angle={-90} value='Popularity on Spotify' position='insideLeft' style={{textAnchor: 'middle', fontSize: '20px', fontFamily: 'Roboto', color: 'white', fontWeight: '100', letterSpacing: '5px'}} stroke="white" fill="white" />
                  </YAxis>
                  <Legend formatter={legendTextCSSFunction} stroke="white" fill="white" />
                  {newSeries.map((s, idx) => (
                      <Line  strokeWidth={2} dataKey="popularity" stroke={strokeColours[idx]} activateDot={false} dot={false} data={s.data} name={s.albumName} key={s.albumId} />
                  ))}
                </LineChart>
            </ResponsiveContainer>
          );
    }
}
