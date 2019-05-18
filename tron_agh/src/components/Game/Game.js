import React from 'react';

import './Game.css';

function shallowEquals(arr1, arr2) {
    if (!arr1 || !arr2 || arr1.length !== arr2.length) return false;
    let equals = true;
    for (var i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) equals = false;
    }
    return equals;
  }
  
  function arrayDiff(arr1, arr2){
    return arr1.map((a, i)=>{ 
      return a - arr2[i]
    })
  }
  
  // display a single cell
  function GridCell(props) {
    const classes = `grid-cell 
  ${props.bonusCell ? "grid-cell--bonus" : ""} 
  ${props.motorCell ? "grid-cell--motor" : ""}
  `;
    return (
      <div
        className={classes}
        style={{ height: props.size + "px", width: props.size + "px" }}
        />
    );
  }
  
const fakeMap = {
    players: [
        {   
            x: 5,
            y: 6
        }, 
        {   
            x: 15,
            y: 16
        }, 
        {   
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
        board: null,
        bonus: [],
        // 0 = not started, 1 = in progress, 2 = finished
        status: 0,
        // using keycodes to indicate direction
        direction: 40
      };
  

      this.startGame = this.startGame.bind(this);
      this.endGame = this.endGame.bind(this);
      this.movemotor = this.movemotor.bind(this);
      this.doesntOverlap = this.doesntOverlap.bind(this);
      this.setDirection = this.setDirection.bind(this);
      this.removeTimers = this.removeTimers.bind(this);
    }
  
    setDirection({ keyCode }) {
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
    }
  
    fillBoard() {
        const newmotor = [];
            fakeMap.players.forEach(player => {
            newmotor[0] = [player.x, player.y];
            }
        );
        
                        
        // now shift each "body" segment to the previous segment's position
        [].push.apply(
          newmotor,
          this.state.motor.slice(0).map((s, i) => {
            // since we're starting from the second item in the list,
            // just use the index, which will refer to the previous item
            // in the original list
            return this.state.motor[i];
          })
        );
    
        this.setState({ motor: newmotor });
    
    }

    movemotor() {
      //console.log(this.state.motor)
      const newmotor = [];
      // set in the new "head" of the motor
      fakeMap.players.forEach(player => {
        newmotor.push([player.x, player.y]);
      }
    );
                       
      // now shift each "body" segment to the previous segment's position

  
      return this.state.motor.push.apply(
        newmotor,
        this.state.motor.slice(0).map((s, i) => {
          // since we're starting from the second item in the list,
          // just use the index, which will refer to the previous item
          // in the original list
          return this.state.motor[i];
        })
    );
    this.setState({ motor: newmotor });
  
      //this.checkIfAtebonus(newmotor);
      if (!this.isValid(newmotor[0]) || !this.doesntOverlap(newmotor)) {
        // end the game
        this.endGame()
      } 
    }
  
    
    // is the cell's position inside the grid?
    isValid(cell) {
      return (
        cell[0] > -1 &&
        cell[1] > -1 &&
        cell[0] < this.numCells &&
        cell[1] < this.numCells
      );
    }
  
    doesntOverlap(motor) {
      return (
        motor.slice(1).filter(c => {
          return shallowEquals(motor[0], c);
        }).length === 0
      );
    }
  
    startGame() {
      this.removeTimers();
      this.movemotorInterval = setInterval(this.movemotor, 130);

  
      this.setState({
        status: 1,
        motor: [[5, 5], [5,6], [5,7]],
        
      });
      //need to focus so keydown listener will work!
      this.el.focus();
    }
    
    endGame(){
      this.removeTimers();
      this.setState({
        status : 2
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
      // each cell should be approximately 15px wide, so calculate how many we need
      this.numCells = Math.floor(this.state.size / 15);
      const cellSize = this.state.size / this.numCells;
      const cellIndexes = Array.from(Array(this.numCells).keys());
      const cells = cellIndexes.map(y => {
        return cellIndexes.map(x => {
          const bonusCell = this.state.bonus[0] === x && this.state.bonus[1] === y;
          let motorCell = this.state.motor.filter(c => c[0] === x && c[1] === y);
          motorCell = motorCell.length && motorCell[0];
  
          return (
            <GridCell
              bonusCell={bonusCell}
              motorCell={motorCell}
              size={cellSize}
              key={x + " " + y}
              />
          );
        });
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
  
