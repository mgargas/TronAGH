import React from 'react';

import './Game.css';

import {Stomp} from "@stomp/stompjs";
import SockJS from "sockjs-client"

const socket = new SockJS('http://localhost:8080/gs-guide-websocket');
const client = Stomp.over(socket);

// display a single cell
function GridCell(props) {
    const classes = `grid-cell 
  ${props.bonusCell ? "grid-cell--bonus" : ""} 
  ${props.motorCell ? "grid-cell--motor__"+props.motorCell : ""}
  `;
    return (
        <div
            className={classes}
            style={{height: props.size + "px", width: props.size + "px"}}
        />
    );
}

const fakeMap = {
    players: [
        {
            id: 1,
            x: 5,
            y: 6
        },
        {
            id: 2,
            x: 15,
            y: 16
        },
        {
            id: 3,
            x: 16,
            y: 17
        },
    ],
}
const board = {
    fields: [
        {
            value: 'empty',
            x: 7,
            y: 7,
        }
    ],
}

// the main view
export default class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            size: 500,
            motor: [],
            board: [],
            bonus: [],
            // 0 = not started, 1 = in progress, 2 = finished
            status: 0,
            // using keycodes to indicate direction
            direction: 40
        };


        this.startGame = this.startGame.bind(this);
        this.endGame = this.endGame.bind(this);
        this.setDirection = this.setDirection.bind(this);
        this.removeTimers = this.removeTimers.bind(this);
        this.updateBoard = this.updateBoard.bind(this);

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

    sendName(direction) {
        try {
            client.send("/app/room/0", {}, JSON.stringify({'turn': direction}));
        } catch(e) {
            console.error(e);
            alert('cannot send message on /app/room/0');
        }
    }
    componentDidMount() {
        this.createBoard();
    }

    setDirection({keyCode}) {
        // if it's the same direction or simply reversing, ignore
        let changeDirection = true;
        [[37, 39]].forEach(dir => {
            if (dir.indexOf(this.state.direction) > -1 && dir.indexOf(keyCode) > -1) {
                changeDirection = false;
            }
        });

        if (changeDirection) this.setState(
            {
                direction: keyCode
            }
        );
        if(this.state.direction === 39){ this.sendName(1); console.log('right') }
        if(this.state.direction === 37){ this.sendName(-1); console.log('left')}
    }

    createBoard() {
        this.numCells = Math.floor(this.state.size / 15);
        this.setState(
            {board: [...Array(this.numCells)].map(x => Array(this.numCells).fill(0))}
        );
    }

    updateBoard() {
        if(this.state.board.length > 30) {
            fakeMap.players.forEach(player =>
                this.setState(prevState => {
                    let newBoard = prevState.board;
                    newBoard[player.x][player.y] = player.id;
                    return {board: newBoard}
                })
            )}
    }

    startGame() {
        this.removeTimers();
        this.movemotorInterval = setInterval(this.updateBoard, 130);


        this.setState({
            status: 1,
            motor: [[5, 5], [5, 6], [5, 7]],

        });
        //need to focus so keydown listener will work!
        this.el.focus();
    }

    endGame() {
        this.removeTimers();
        this.setState({
            status: 2
        })
    }

    removeTimers() {
        if (this.movemotorInterval) clearInterval(this.movemotorInterval);
        if (this.movebonusTimeout) clearTimeout(this.movebonusTimeout)
    }

    componentWillUnmount() {
        this.removeTimers();
    }

    render() {
        this.numCells = Math.floor(this.state.size / 15);
        const cellSize = this.state.size / this.numCells;
        const cellIndexes = Array.from(Array(this.numCells).keys());
        let key = 0;
        const cells = this.state.board.map(x => {
            return x.map(y => {
                key++;
                return (
                    <GridCell
                        bonusCell={false}
                        motorCell={y}
                        size={cellSize}
                        key={key}
                    />
                )
            })
        });
        let overlay;
        if (this.state.status === 0) {
            overlay = (
                <div className="motor-app__overlay">
                    <button onClick={this.startGame}>Start game!</button>
                </div>
            );
        } else if (this.state.status === 2) {
            overlay = (
                <div className="motor-app__overlay">
                    <div className="mb-1"><b>GAME OVER!</b></div>
                    <div className="mb-1">Your score: {this.state.motor.length} </div>
                    <button onClick={this.startGame}>Start a new game</button>
                </div>
            );
        }
        return (
            <div
                className="motor-app"
                onKeyDown={this.setDirection}
                style={{
                    width: this.state.size + "px",
                    height: this.state.size + "px"
                }}
                ref={el => (this.el = el)}
                tabIndex={-1}
            >
                {overlay}
                <div
                    className="grid"
                    style={{
                        width: this.state.size + "px",
                        height: this.state.size + "px"
                    }}
                >
                    {cells}
                </div>
            </div>
        );
    }
}

