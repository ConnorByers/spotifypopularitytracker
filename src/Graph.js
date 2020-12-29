import React, { Component } from 'react'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Text, Legend, ResponsiveContainer
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
        
          return (
            <ResponsiveContainer aspect={1.6}>
                <LineChart key={this.props.key}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="date"/>
                  <YAxis dataKey="popularity"/>
                  <Legend />
                  {newSeries.map((s, idx) => (
                      <Line dataKey="popularity" stroke={strokeColours[idx]} activateDot={false} dot={false} data={s.data} name={s.albumName} key={s.albumId} />
                  ))}
                </LineChart>
            </ResponsiveContainer>
          );
    }
}
