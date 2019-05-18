import React, {Component} from 'react';

import './Banner.css';

class Banner extends Component {
    constructor(props) {
        super(props);
        this.timer = 0;
        this.state = {
            visible: true,
        }
    }

    componentWillMount(){
        // set up timer
        this.timer = setTimeout(() => {
            this.setState({
                visible: true,
            });
            this.componentWillMount();
        }, 1000);
    }

    componentWillUnmount(){
        clearTimeout(this.timer);
    }
    
    render(){
        let banner = <h1>Click Play to start the game</h1>;
        return (
            <div className="banner-wrapper">
                {this.state.visible ? banner : null }
            </div>
        );
    }
}

export default Banner;
