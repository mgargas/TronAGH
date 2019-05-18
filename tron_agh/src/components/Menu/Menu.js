import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import './Menu.css';

export default class Menu extends Component {
    render() {
        return(
            <div className="menu__items">
                <ul>
                    <li>
                        <Link to="/game">Play</Link>
                    </li>
                    <li>
                        <a href="/results">Results</a>
                    </li>
                    <li>
                        <a href="/credits">
                            Credits
                        </a>
                    </li>
                </ul>
            </div>
        );
    }
}
