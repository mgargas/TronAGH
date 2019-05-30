import React, {Component} from 'react';
import axios from 'axios';

import './Results.css';

const host = 'http://127.0.0.1:9999';
export default class Results extends Component {

    constructor(props) {
        super(props);

        this.state = {
            scores: []
        };
    }

    componentWillMount(){
        axios.get(host+'/accounts/')
            .then(res => {
                if(res.data) {
                    let scores = res.data;
                    scores.sort((a,b) => b.wins - a.wins);
                    this.setState({scores: scores});
                }
            });
    }

    renderTableData() {
        return this.state.scores.map((user) => {
            const { username, wins } = user;
            return (
                <tr key={username}>
                    <td className="name">{username}</td>
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