import React, {Component} from 'react';

import './Menu.css';
//import {Stomp} from "@stomp/stompjs";
//import SockJS from "sockjs-client"

export default class Menu extends Component {

    constructor(props) {
        super(props);
        this.sendTo = this.sendName.bind(this);
        this.connect();
    }

    connect() {
        let socket = new SockJS('/gs-guide-websocket');
        this.client = Stomp.over(socket);
        this.client.connect({},
            function (frame) {
                console.log('CONNECTED!');
                console.log('Connected: ' + JSON.stringify(frame));
                this.client.subscribe('/topic/greetings', function (greeting) {
                    console.log('MESSAGE : '+JSON.parse(greeting.body).content);
                });
            });
    }

    disconnect() {
        if (this.client !== null) {
            this.client.disconnect();
        }
        console.log("Disconnected");
    }

    sendName() {
        try {
            this.client.send("/app/hello", {}, JSON.stringify({'name': "TEST NAME !!!"}));
        } catch(e) {
            console.error(e);
            alert('cannot send message on /app/hello');
        }
    }

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
                <button onClick={this.sendTo}>SEND</button>
            </div>
        )
    }
}
