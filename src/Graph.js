import React, { Component } from 'react'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Label, Legend, ResponsiveContainer
  } from 'recharts';

export default class Graph extends Component {
    render() {
        const newSeries = Object.keys(this.props.allPopularities).map(key=>(
            {
              albumName: this.props.allPopularities[key].albumName,
              data: this.props.allPopularities[key].popularities.map((popularityObj)=>({
                date: Date.parse(popularityObj.date.replace(/\//g, '-')),
                popularity: popularityObj.popularity
              })),
              albumId: key
            }
          ))
          const strokeColours = ['#332288', '#88CCEE', '#44AA99', '#117733', '#999933', '#DDCC77', '#CC6677', '#882255', '#AA4499']
          const legendTextCSSFunction = (value, entry) => {
            
            return <span style={{ fontSize: '1.2rem',fontFamily: 'Times New Roman' }}>{value}</span>;
          };

          const formatXAxis = (timeInMilli) => {
            var date = new Date(timeInMilli);
            return date.getFullYear() + '/' + String(date.getMonth() + 1).padStart(2, '0') + '/' + String(date.getDate()).padStart(2, '0')
          }

          return (
            <ResponsiveContainer aspect={1.6} >
                <LineChart key={this.props.key}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="date" style={{fontSize: '1rem',fontFamily: 'Times New Roman'}} type="number" tickFormatter={formatXAxis} domain={['dataMin', 'dataMax']}/>
                  <YAxis dataKey="popularity" style={{fontSize: '1rem',fontFamily: 'Times New Roman'}} domain={[0, 100]}>
                    <Label angle={-90} value='Popularity on Spotify' position='insideLeft' style={{textAnchor: 'middle', fontSize: '1.2rem',fontFamily: 'Times New Roman'}} />
                  </YAxis>
                  <Legend formatter={legendTextCSSFunction} />
                  {newSeries.map((s, idx) => (
                      <Line  strokeWidth={2} dataKey="popularity" stroke={strokeColours[idx]} activateDot={false} dot={false} data={s.data} name={s.albumName} key={s.albumId} />
                  ))}
                </LineChart>
            </ResponsiveContainer>
          );
    }
}
