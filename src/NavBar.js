import React, { Component } from 'react';
import styled from 'styled-components';

export default class NavBar extends Component {
    render() {
        const Bar = styled.p`
            font-size: 3rem;
            width: 100%;
            background-color: black;
            color: white;
            text-align: center;
            margin: 2rem auto;
        `;
        return (
            <Bar>
                Popularity of Artist's Albums on Spotify
            </Bar>
        )
    }
}
