import React, { Component } from 'react'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Label, Legend, ResponsiveContainer
  } from 'recharts';
export default class Graph extends Component {
    render() {
        const newSeries = Object.keys(this.props.allPopularities).map(key=>(
            {
              albumName: this.props.allPopularities[key].albumName,
              data: this.props.allPopularities[key].popularities,
              albumId: key
            }
          ))
          const strokeColours = ['#332288', '#88CCEE', '#44AA99', '#117733', '#999933', '#DDCC77', '#CC6677', '#882255', '#AA4499']
          const renderColorfulLegendText = (value, entry) => {
            
            return <span style={{ fontSize: '1.2rem',fontFamily: 'Times New Roman' }}>{value}</span>;
          };

          return (
            <ResponsiveContainer aspect={1.6} >
                <LineChart key={this.props.key}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="date" style={{fontSize: '1rem',fontFamily: 'Times New Roman'}} allowDuplicatedCategory={false}/>
                  <YAxis dataKey="popularity" style={{fontSize: '1rem',fontFamily: 'Times New Roman'}} domain={[0, 100]}>
                    <Label angle={-90} value='Popularity on Spotify' position='insideLeft' style={{textAnchor: 'middle', fontSize: '1.2rem',fontFamily: 'Times New Roman'}} />
                  </YAxis>
                  <Legend formatter={renderColorfulLegendText} />
                  {newSeries.map((s, idx) => (
                      <Line  strokeWidth={2} dataKey="popularity" stroke={strokeColours[idx]} activateDot={false} dot={false} data={s.data} name={s.albumName} key={s.albumId} />
                  ))}
                </LineChart>
            </ResponsiveContainer>
          );
    }
}
