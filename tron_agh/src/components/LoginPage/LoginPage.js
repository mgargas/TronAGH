import React from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import './LoginPage.css';


//  login    : accounts/username/password
//  register : accounts/
// {
//     username :
//     password :
// }
export default class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);

        this.state = {
            login: "",
            password: ""
        };
    }

    handleLogin(event) {
        event.preventDefault();
        console.log('login = '+this.state.login);
        console.log('password = '+this.state.password);

        // if ok :
        this.props.history.push("/home")
    };

    handleRegister(event) {
        event.preventDefault();
        console.log('login = '+this.state.login);
        console.log('password = '+this.state.password);

        // if ok :
        this.props.history.push("/home")
    };


    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    validateForm() {
        return this.state.login.length > 0 && this.state.password.length > 0;
    }

    render(){
        return (
            <div className="Login">
                <Form onSubmit={this.handleSubmit}>
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
                </Form>
            </div>
        )};
}