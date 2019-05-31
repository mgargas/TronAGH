import React from 'react';
import axios from 'axios';
import {Link, Redirect} from 'react-router-dom';

import './Credits.css';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className="credits__list">
                <h1>Credits</h1>
                <h3>Na froncie walczyli:</h3>
                <ul>
                    <li>Pawel Gedlek</li>
                    <li>Jan Liberacki</li>
                    <li>Kamil Borowiec</li>
                </ul>
                <h3>Backend serw(er)owali:</h3>
                <ul>
                    <li>Rafal Cegielski</li>
                    <li>Marek Gargas</li>
                    <li>Andrzej Kepka</li>
                    <li>Gustaw Lippa</li>
                </ul>
            </div>

        )
    };
}