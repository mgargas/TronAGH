import React, {Component} from 'react';

import './Results.css';

export default class Results extends Component {

    constructor(props) {
        super(props);

        this.state = {
            scores: []
        };
    }

    componentWillMount(){
        this.setState( {scores: [{name:"test", wins:3},{name:"test1", wins:4},{name:"tes2", wins:5}] });
    }

    renderTableData() {
        return this.state.scores.map((user) => {
            const { name, wins } = user;
            return (
                <tr key={name}>
                    <td className="name">{name}</td>
                    <td className="wins">{wins}</td>
                </tr>
            )
        })
    }

    render() {
        return (
            <div className="results-table">
                <table id='scores'>
                    <tbody>
                    {this.renderTableData()}
                    </tbody>
                </table>
                <button className="back-button" onClick={() => this.props.history.push("/home")}>MAIN MENU</button>
            </div>
        )
    }
}