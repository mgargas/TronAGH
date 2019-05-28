import React, {Component} from 'react';

import {Stomp} from "@stomp/stompjs";
import SockJS from "sockjs-client"


const socket = new SockJS('http://192.168.43.218:9999/gs-guide-websocket');
const client = Stomp.over(this.socket);

// export default class Client extends Component {
//     constructor(props) {
//         super(props);
//         this.sendTo = this.sendName.bind(this);
//         this.connect();
//
//         socket = new SockJS('http://192.168.43.73:9999/gs-guide-websocket');
//         client = Stomp.over(this.socket);
//     }
//     connect() {
//         this.client.connect({},
//             function (frame) {
//                 console.log('CONNECTED!');
//             });
//     }
//
//     connected() {
//         return this.client.connected;
//     }
//
//     disconnect() {
//         if (this.client !== null) {
//             this.client.disconnect();
//         }
//         console.log("Disconnected");
//     }
//
//     sendName() {
//         try {
//             this.client.send("/app/room/0", {}, JSON.stringify({'name': "TEST NAME !!!"}));
//         } catch(e) {
//             console.error(e);
//             alert('cannot send message on /app/room/0');
//         }
//     }
// }

export default { client, socket };
