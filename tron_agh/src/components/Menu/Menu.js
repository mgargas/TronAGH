import React, {Component} from 'react';

import './Menu.css';
const URL = 'ws://localhost:3030';

export default class Menu extends Component {

    sendTo() {
        console.log("send");
        this.ws.send(JSON.stringify('TEST!'))
    }


    webSocket = new WebSocket(URL);

    constructor(props) {
        super(props);
        this.sendTo = this.sendTo.bind(this);
        this.getFrom = this.getFrom.bind(this);
    }

    componentDidMount() {
        this.webSocket.onopen = () => {
            // on connecting, do nothing but log it to the console
            console.log('connected')
        };

        this.webSocket.onmessage = evt => {
            // on receiving a message, add it to the list of messages
            console.log('ws message = ' + JSON.parse(evt.data));
        };

        this.webSocket.onclose = () => {
            console.log('disconnected');
            // automatically try to reconnect on connection loss
            this.setState({
                ws: new WebSocket(URL),
            })
        };
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
            </div>
        )
    }
}
