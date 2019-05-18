import React, {Component} from 'react';

import './Menu.css';
import * as StompJS from '@stomp/stompjs'

export default class Menu extends Component {

    constructor(props) {
        super(props);
        this.sendTo = this.sendMessage.bind(this);
        this.client = StompJS.Stomp.client('http://localhost:8080/gs-guide-websocket');
        this.connected = false;
        if(this.client) {
            this.client.connect(
                {login: 'mylogin', passcode: 'mypasscode'},
                () => {
                    console.log('connected');
                    this.connected = true;
                },
                () => {
                    console.log('not able to connect')
                });
        }
        if(this.connected && this.client) {
            this.client.subscribe("/topic/all", (message) => {
                console.log('message = '+JSON.stringify(message.body));
            });
        }
    }

    onMessageReceive = (msg, topic) => {
        console.log('msg = '+JSON.stringify(msg)+ ' topic = '+JSON.stringify(topic));
        this.setState(prevState => ({
            messages: [...prevState.messages, msg]
        }));
    };

    sendMessage() {
        try {
            this.client.send("/app/hello", {}, JSON.stringify("Hello, STOMP"));
            return true;
        } catch(e) {
            console.error(e);
            alert('cannot send message on /app/hello');
            return false;
        }
    };

    componentWillMount(){
        // set up timer
        this.timer = setTimeout(() => {
            this.setState({
                visible: true,
            });
            this.componentWillMount();
        }, 1000);
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
