import React from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import './LoginPage.css';
import ClientStateService from "../../services/ClientStateService";


const host = 'http://192.168.43.218:9999';
export default class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);

        this.state = {
            login: "",
            password: "",
            loginError: ""
        };
    }

    handleLogin(event) {
        event.preventDefault();
        axios.get(host+'/accounts/'+this.state.login+'/'+this.hashString(this.state.password))
            .then(res => this.onLogin(res));
    };

    handleRegister(event) {
        event.preventDefault();
        axios.post(host+'/accounts/',
                {username: this.state.login,
                 password: this.hashString(this.state.password)})
            .then(res => this.onLogin(res));
    };

    onLogin(response) {
        console.log('result = '+JSON.stringify(response));
        this.setError(null);
        if(response.data) {
            ClientStateService.clientId = response.data.playerId;
            ClientStateService.clientName = this.state.login;
            ClientStateService.clientPasswordHash = this.hashString(this.state.password);
            this.props.history.push("/home");
        } else {
            this.setError("Wrong login/password or You don't have an account");
        }
    }

    setError(errorText) {
        this.setState( {loginError: errorText });
    }

    handleChange = event => {
        this.setError(null);
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    validateForm() {
        return this.state.login.length > 0 && this.state.password.length > 0;
    }

    hashString = s => {
        return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0).toString();
    };

    render(){
        return (
            <div className="Login">
                <Form>
                    <Form.Group controlId="login">
                        <Form.Control
                            autoFocus
                            value={this.state.email}
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Control
                            value={this.state.password}
                            onChange={this.handleChange}
                            type="password"
                        />
                    </Form.Group>
                    <div className="buttons-panel">
                        <Button
                            block
                            className="login-button"
                            onClick={this.handleLogin}
                            disabled={!this.validateForm()}>LOGIN</Button>
                        <Button
                            block
                            onClick={this.handleRegister}
                            className="register-button"
                            disabled={!this.validateForm()}>REGISTER</Button>
                    </div>
                    <div className="error-message">
                    {this.state.loginError && (
                        <span>{this.state.loginError}</span>
                    )}
                    </div>
                </Form>
            </div>
        )};
}