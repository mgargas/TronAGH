import React, {Component} from 'react';
import SockJsClient from 'react-stomp';

import './Menu.css';

export default class Menu extends Component {

    constructor(props) {
        super(props);
        this.sendTo = this.sendMessage.bind(this);
        this.state = {
            clientConnected: false,
            messages: []
        };
    }

    onMessageReceive = (msg, topic) => {
        console.log('msg = '+JSON.stringify(msg)+ ' topic = '+JSON.stringify(topic));
        this.setState(prevState => ({
            messages: [...prevState.messages, msg]
        }));
    };

    sendMessage = (msg, selfMsg) => {
        try {
            this.clientRef.sendMessage("/app/all", JSON.stringify(selfMsg));
            return true;
        } catch(e) {
            alert('cannot send message on /app/all');
            return false;
        }
    };

    render() {
        const wsSourceUrl = window.location.protocol + "//" + window.location.host + "/gs-guide-websocket";
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
                <SockJsClient url={ wsSourceUrl } topics={["/topic/all"]}
                              onMessage={ this.onMessageReceive } ref={ (client) => { this.clientRef = client }}
                              onConnect={ () => {
                                  console.log('CONNECTED!');
                                  this.setState({clientConnected: true }) } }
                              onDisconnect={ () => {
                                  console.log('DISCONNECTED!');
                                  this.setState({ clientConnected: false }) } }
                              debug={ false }/>
            </div>
        )
    }
}
