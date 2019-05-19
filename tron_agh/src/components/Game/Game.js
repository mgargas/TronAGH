import React from 'react';

import './Game.css';

import {withRouter} from "react-router-dom";
import { client } from "../Rooms/Rooms";

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
class Game extends React.Component {
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
            direction: 39,
        };

        this.startGame = this.startGame.bind(this);
        this.endGame = this.endGame.bind(this);
        this.setDirection = this.setDirection.bind(this);
        this.removeTimers = this.removeTimers.bind(this);
        this.updateBoard = this.updateBoard.bind(this);

        this.sendTo = this.sendDirection.bind(this);
        this.connect = this.connect.bind(this);
    }

    // componentWillUnmount() {
    //     client.unsubscribe('/topic/room/' + this.props.location.state.id);
    // }

    connect() {
        if (this.props.location.state.id !== null) {
            client.subscribe('/topic/room/' + this.props.location.state.id,
                function (message) {
                    if (message.body) {
                        responsePoints = JSON.parse(message.body)
                    }
                });
        }
    }

    disconnect() {
        client.unsubscribe();
    }

    sendDirection(direction) {
        try {
            client.send('/app/room/' + this.props.location.state.id, {}, JSON.stringify({'id': this.props.location.state.playerId, 'turn': direction}));
        } catch(e) {
            console.error(e);
            alert('cannot send message on /app/room/0');
        }
    }

    componentDidMount() {
        this.connect();
        this.createBoard();
        this.removeTimers();
        this.movemotorInterval = setInterval(this.updateBoard, 30);
        //need to focus so keydown listener will work!
        this.el.focus();
        this.setState({status: 1 });
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
                if (responsePoints.gameOver) {
                    if(responsePoints.winnerId === this.props.location.state.playerId) {
                        this.endGame(3);
                    } else {
                        this.endGame(2);
                    }
                }
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

    }

    endGame(gameStatus) {
        if (gameStatus) {
            this.removeTimers();
            this.setState({
                status: gameStatus,
            });
        }
    }

    removeTimers() {
        if (this.movemotorInterval) clearInterval(this.movemotorInterval);
        if (this.movebonusTimeout) clearTimeout(this.movebonusTimeout)
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
                    {cells}
                </div>
            </div>
        );
    }
}

export default withRouter(Game);
