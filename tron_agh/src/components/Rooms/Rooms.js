import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

import './Rooms.css';

const server_adress = 'http://192.168.43.73:9999';
const myId = 3;

export default class Home extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        rooms: [],
      }
  }

  componentDidMount() {
    axios.get(server_adress+`/room`)
    .then(res => {
      this.setState({ rooms: res.data });
    })
  }

  handlePostSubmit = event => {
    event.preventDefault();

    axios.post(server_adress+`/room`,  { maxPlayers: 4, creatorId: myId }, {headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}}).then(res => {})
  }

  handleRefresh() {
    axios.get(server_adress+`/room`)
    .then(res => {
      this.setState({ rooms: res.data });
    })
  }

  joinRoom = (room, event) => {
      event.preventDefault();
      room.playersIds.push(myId);
      const data = {maxPlayers: room.maxPlayers, id: room.id, minPlayers: room.minPlayers, playersIds: room.playersIds};
      axios.put(server_adress+`/room/`+room.id, data,
          {headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}})
          .then( res => {
              this.setState( { rooms: res.data });
          })
  };

  startGame = (room, event) => {
      event.preventDefault();
      const data = {maxPlayers: room.maxPlayers, id: room.id, minPlayers: room.minPlayers, playersIds: room.playersIds, readyToStart: true};
      axios.put(server_adress+`/room/`+room.id, data,
          {headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}})
          .then( res => {
              this.setState( { rooms: res.data });
          })
  };

  generateRooms = () => {
    let keys = Object.keys(this.state.rooms);
    return keys.map((item, index) => {
        let room = this.state.rooms[item];
        console.log(room);
        return (
            <div
                className='room__item'
                key={index}
            >
                <Link to="/game">
                    <h1>Room{room.id} ({room.playersIds.length}/{room.maxPlayers})</h1>
                </Link>
                <form onSubmit={(e) => this.joinRoom(room, e)}>
                    <button
                        className="join__button"
                        type="submit"
                        disabled={room.maxPlayers === room.playersIds.length}>
                        Join
                    </button>
                </form>
                <form onSubmit={(e) => this.startGame(room, e)}>
                    <button
                        className="start__button"
                        type="submit"
                        disabled={room.creatorId === myId}>
                        Start Game!
                    </button>
                </form>
            </div>
        )}
);
  }

  render(){
    let rooms = this.state.rooms ? this.generateRooms() : null;
    return (
    <div className="container">
        {rooms}

        <form onSubmit={this.handlePostSubmit}>
          <button className="create__button" type="submit">Create new room!</button>
        </form>
        <form onSubmit={this.handleRefresh}>
          <button className="create__button" type="submit">Refresh</button>
        </form>
    </div>

  )};
}
