import React, { Component } from 'react';
import styled from 'styled-components';

export default class NavBar extends Component {
    render() {
        const Bar = styled.p`
            font-family: roboto, sans-serif;
            font-size: 4rem;
            width: 100%;
            background-color: #85bdde;
            color: white;
            text-align: center;
            margin: 0 auto;
            padding: 2rem 0;
            border: 3px solid #6089a1;
            border-style: none none solid none;
        `;
        return (
            <Bar>
                Popularity of Artist's Albums on Spotify
            </Bar>
        )
    }
}
