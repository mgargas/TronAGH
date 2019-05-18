import React, {Component} from 'react';
import SockJsClient from 'react-stomp';

import './Menu.css';

export default class Menu extends Component {

    sendTo() {
        console.log("send");
        let message = "TEST!";
        this.clientRef.sendMessage('/app/hello', message);
    }

    constructor(props) {
        super(props);
        this.sendTo = this.sendTo.bind(this);
    }

    render() {
        return(
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
                <button onClick={this.sendTo}>SEND</button>
                <SockJsClient url='/gs-guide-websocket' topics={['/topic/greetings']}
                              onMessage={(msg) => { console.log(msg); }}
                              ref={ (client) => { this.clientRef = client }} />
            </div>
        )
    }
}
