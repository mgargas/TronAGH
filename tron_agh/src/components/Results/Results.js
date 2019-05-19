import React, {Component} from 'react';
import axios from 'axios';

import './Results.css';

const host = 'http://192.168.43.218:9999';
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
                console.log('result = '+JSON.stringify(res))
            });

        // TODO : move it to
        let res = [{name:"test", wins:3},{name:"test1", wins:124},{name:"tes2", wins:5}];
        res.sort((a,b) => b.wins - a.wins);
        this.setState({scores: res});
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