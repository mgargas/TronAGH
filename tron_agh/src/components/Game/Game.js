import React from 'react';

import './Game.css';

import {withRouter} from "react-router-dom";
import {client} from "../Rooms/Rooms";

// display a single cell
function GridCell(props) {
    const classes = `grid-cell 
  ${props.bonusCell ? "grid-cell--bonus" : ""} 
  ${props.motorCell ? "grid-cell--motor__" + props.motorCell : ""}
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
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            size: 500,
            board: [],
            bonus: [],
            // 0 = not started, 1 = in progress, 2 = finished
            status: 0,
            // using keycodes to indicate direction
            direction: 39,
        };


        this.endGame = this.endGame.bind(this);
        this.setDirection = this.setDirection.bind(this);
        this.removeTimers = this.removeTimers.bind(this);
        this.updateBoard = this.updateBoard.bind(this);

        this.sendTo = this.sendDirection.bind(this);
        this.connect = this.connect.bind(this);

        let numCells = 50;
        let local_board = [...Array(numCells)].map(x => Array(numCells).fill(0));

        const cellSize = 500 / numCells;
        let i = 0, j = 0;
        this.cells = local_board.map(x => {
            i++;
            j = 0;
            return x.map(y => {
                j++;
                return (
                    <div className="game-cell" key={i + "," + j} id={i + "," + j}></div>
                )
            })
        });
    }

    // componentWillUnmount() {
    //     client.unsubscribe('/topic/room/' + this.props.location.state.id);
    // }


    connect() {
        var that = this;
            if (this.props.location.state.id !== null) {
                console.log('player id = '+this.props.location.state.playerId);
                console.log('subscribe on '+('/topic/room/' + this.props.location.state.id));
                client.subscribe('/topic/room/' + this.props.location.state.id,
                // TODO : why no message from server ??????
                function (message) {
                    console.log('message = '+message);
                    if (message.body) {
                        //console.log(message);
                        //responsePoints = JSON.parse(message.body)
                        that.updateBoard(JSON.parse(message.body));
                        responsePoints = JSON.parse(message.body)
                    }
                });
        } else {
            console.log('NULL!!!????!!!')
        }
    }

    disconnect() {
        client.unsubscribe();
    }

    sendDirection(direction) {
        console.log('direction from '+this.props.location.state.playerId+'  on room '+this.props.location.state.id);
        try {
            client.send('/app/room/' + this.props.location.state.id, {}, JSON.stringify({
                'id': this.props.location.state.playerId,
                'turn': direction
            }));
        } catch (e) {
            console.error(e);
            alert('cannot send message on /app/room/0');
        }
    }

    componentDidMount() {
        this.connect();
        //this.createBoard();
        //this.removeTimers();
        //this.movemotorInterval = setInterval(this.updateBoard, 30);
        //need to focus so keydown listener will work!
        this.el.focus();
        this.setState({status: 1});
    }


    setDirection({keyCode}) {
        let changeDirection = false;
        [[37, 39]].forEach(dir => {
            if (dir.indexOf(keyCode) > -1) {
                changeDirection = true;
            }
        });

        if (changeDirection) {
            switch (keyCode) {
                case 39:
                    this.sendDirection(1);
                    break;
                case 37:
                    this.sendDirection(-1);
                    break;
            }
        }

    }


    updateBoard(responsePoints) {
        if (responsePoints !== undefined) {
            console.log(responsePoints);
            if (responsePoints.gameOver) {
                if (responsePoints.winnerId === this.props.location.state.playerId) {
                    this.endGame(3);
                } else {
                    this.endGame(2);
                }
            } else {
                Object.values(responsePoints.playersInfo).forEach(player => {
                        if (player.position.x > -1 && player.position.y > -1 && document.getElementById(player.position.x + "," + player.position.y)) {
                            document.getElementById(player.position.x + "," + player.position.y).classList.add("grid-cell--motor__" + (player.id%6))
                        }
                    }
                )
            }
        }

    }

    endGame(gameStatus) {
        client.unsubscribe();
        if (gameStatus) {
            this.removeTimers();
            this.setState({
                status: gameStatus,
            });
        }
    }

    removeTimers() {
        //if (this.movemotorInterval) clearInterval(this.movemotorInterval);
        //if (this.movebonusTimeout) clearTimeout(this.movebonusTimeout)
    }

    render() {
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
                    {/*<div className="mb-1">Your score: {Infinity} </div>*/}
                </div>
            );
            setTimeout(() => {
                this.props.history.push(`/rooms`);
            }, 3000);
        } else if (this.state.status === 3) {
            overlay = (
                <div className="motor-app__overlay">
                    <div className="mb-1"><b>You Won!</b></div>
                    {/*<div className="mb-1">Your score: {Infinity} </div>*/}
                </div>
            );
            setTimeout(() => {
                this.props.history.push(`/rooms`);
            }, 3000);
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
                    {this.cells}
                </div>
            </div>
        );
    }
}

export default withRouter(Game);
