import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import './Menu.css';
import ClientStateService from "../../services/ClientStateService";

export default class Menu extends Component {

    render() {
        return (
            <div className="menu__items">
                <ul>
                    <li>
                        <Link to="/rooms">Play</Link>
                    </li>
                    <li>
                        <a href="/results">Results</a>
                    </li>
                    <li>
                        <a href="/credits">
                            Credits
                        </a>
                    </li>
                    <li onClick={() => ClientStateService.clientName = ClientStateService.clientPasswordHash = null}>
                        <a href="/">
                            Logout
                        </a>
                    </li>
                </ul>

            </div>
        )
    }
}
