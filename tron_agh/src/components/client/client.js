import React, {Component} from 'react';

import {Stomp} from "@stomp/stompjs";
import SockJS from "sockjs-client"

const socket = new SockJS('http://localhost:8080/gs-guide-websocket');
const client = Stomp.over(socket);


export default class Client extends Component {
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
                client.subscribe('/topic/room/0', function (greeting) {
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
        return(
            <button onClick={this.sendTo}>SEND</button>
        );
    }
}