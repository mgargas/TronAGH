import React, {Component} from 'react';

import './Menu.css';
import {Stomp} from "@stomp/stompjs";
import SockJS from "sockjs-client"

const socket = new SockJS('http://localhost:8080/gs-guide-websocket');
const client = Stomp.over(socket);

export default class Menu extends Component {

    constructor(props) {
        super(props);
        this.sendTo = this.sendName.bind(this);
        this.connect();
    }

    connect() {

        
        client.connect({},
            function (frame) {
                console.log('CONNECTED!');
                console.log('Connected: ' + JSON.stringify(frame));
                console.log(client);
                client.subscribe('/topic/greetings', function (greeting) {
                    console.log('MESSAGE : '+JSON.parse(greeting.body).content);
                });
            });
    }

    disconnect() {
        if (client !== null) {
            client.disconnect();
        }
        console.log("Disconnected");
    }

    sendName() {
        try {
            client.send("/app/hello", {}, JSON.stringify({'name': "TEST NAME !!!"}));
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
