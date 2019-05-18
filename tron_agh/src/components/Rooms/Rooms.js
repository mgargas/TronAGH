import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

import './Rooms.css';

export default class Home extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        rooms: [],
      }
  }

  componentDidMount() {
    axios.get(`http://localhost:9999/room`)
    .then(res => {
      this.setState({ rooms: res.data });
    })
  }

  handlePostSubmit = event => {
    event.preventDefault();

    axios.post(`http://localhost:9999/room`,  { maxPlayers: 4, playersIds: [0] }, {headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}}).then(res => {})
  }

  handleRefresh() {
    axios.get(`http://localhost:9999/room`)
    .then(res => {
      this.setState({ rooms: res.data });
    })
  }

  generateRooms = () => {
    let keys = Object.keys(this.state.rooms);
    return keys.map( (item, index) => (
        <div 
            className='room__item' 
            key={ index } 
          >
            <Link to="/game">
                <h1>Room{this.state.rooms[item].id} (0/{this.state.rooms[item].maxPlayers})</h1>
            </Link>
            
        </div>    
    )
);
  }

  render(){
    let rooms = this.state.rooms ? this.generateRooms() : null;
    return (
    <div>
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
