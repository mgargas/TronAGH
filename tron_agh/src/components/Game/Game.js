import React from 'react';

import './Game.css';

import {Stomp} from "@stomp/stompjs";
import SockJS from "sockjs-client"

const socket = new SockJS('http://localhost:9999/gs-guide-websocket');
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

let responsePoints;

// the main view
export default class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            size: 500,
            board: [],
            bonus: [],
            responsePoints: [],
            // 0 = not started, 1 = in progress, 2 = finished
            status: 0,
            // using keycodes to indicate direction
            direction: 39
        };


        this.startGame = this.startGame.bind(this);
        this.endGame = this.endGame.bind(this);
        this.setDirection = this.setDirection.bind(this);
        this.removeTimers = this.removeTimers.bind(this);
        this.updateBoard = this.updateBoard.bind(this);

        this.sendTo = this.sendDirection.bind(this);
        this.connect = this.connect.bind(this);
    }

    connect() {
        console.log('connect method')
        client.connect({},
            function (frame) {
                console.log('CONNECTED!');
                client.subscribe('/topic/room/0', 
                    function(message) {
                    if (message.body) {
                        responsePoints = JSON.parse(message.body)
                    }
                  });
            });
    }

    disconnect() {
        if (client !== null) {
            client.disconnect();
        }
        console.log("Disconnected");
    }

    sendDirection(direction) {
        try {
            client.send("/app/room/0", {}, JSON.stringify({'id': 0, 'turn': direction}));
        } catch(e) {
            console.error(e);
            alert('cannot send message on /app/room/0');
        }
    }

    componentWillMount(){
 
    }

    componentDidMount() {
        this.createBoard();
        this.connect();
    }


    setDirection({keyCode}) {
        let changeDirection = false;
        [[37, 39]].forEach(dir => {
            if (dir.indexOf(keyCode) > -1) {
                changeDirection = true;
            }
        });

        if (changeDirection){ 
            switch(keyCode) {
                case 39:
                    this.sendDirection(1);
                    break;
                case 37:
                    this.sendDirection(-1);
                    break;
            }
        }

    }

    createBoard() {
        this.numCells = Math.floor(this.state.size / 10);
        this.setState(
            {board: [...Array(this.numCells)].map(x => Array(this.numCells).fill(0))}
        );
    }

    updateBoard() {
        if(this.state.board.length > 30) {
            if(responsePoints !== undefined) {
                console.log(responsePoints.playersInfo)
                Object.values(responsePoints.playersInfo).forEach(player =>
                    {
                    let x = player.position.x, y = player.position.y
                    x > -1 && y > -1 
                    ? this.setState(prevState => {
                        let newBoard = prevState.board;
                        newBoard[x][y] = player.id+1;
                        return {board: newBoard}
                    }) 
                    : this.endGame()
                    }
                )
            }


        }
        
    }

    startGame() {
        this.removeTimers();
        this.movemotorInterval = setInterval(this.updateBoard, 130);


        this.setState({
            status: 1,
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
        this.numCells = Math.floor(this.state.size / 10);
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
                    <button className="button__game" onClick={this.startGame}>Start game!</button>
                </div>
            );
        } else if (this.state.status === 2) {
            overlay = (
                <div className="motor-app__overlay">
                    <div className="mb-1"><b>GAME OVER!</b></div>
                    <div className="mb-1">Your score: {Infinity} </div>
                    <button className="button__game" onClick={this.startGame}>
                            Start a new game
                    </button>
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

