import React, {Component} from 'react';

import './Menu.css';

export default class Menu extends Component {

    render() {
        return (
            <div className="menu__items">
                <ul>
                    <li>
                        <a href="/play">Play</a>
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
        )
    }
}
