import React, { Component } from "react"; 
import axiosInstance from "./axiosApi";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';

class Login extends Component { 
    constructor(props) { super(props); 
        this.state = {username: "", password: ""}; 
        this.handleChange = this.handleChange.bind(this); 
        this.handleSubmitWThen = this.handleSubmitWThen.bind(this);
    } 
    
    handleChange(event) { 
        this.setState({[event.target.name]: event.target.value}); 
    } 
    
    handleSubmitWThen(event){ 
        event.preventDefault(); 
        axiosInstance.post('/token/obtain/', { username: this.state.username, password: this.state.password })
            .then(result => { 
                axiosInstance.defaults.headers['Authorization'] = "JWT " + result.data.access; 
                localStorage.setItem('access_token', result.data.access); 
                localStorage.setItem('refresh_token', result.data.refresh); 
                console.log(result.data.refresh)
                const token_data = this.props.parseJwt(result.data.access)
                this.props.handle_login(token_data); 
                this.props.fetchAllPost(1, 'all')
            })
            .catch (error => { 
                throw error; 
            }) 
        }
    
    render() { 
        return (
            <Col className="mx-auto my-5 p-5 border rounded box-shadow log-form">
                <Form onSubmit={this.handleSubmitWThen}>
                    <Form.Group controlId="formEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control onChange={this.handleChange} value={this.state.username} name="username" type="text" 
                        placeholder="Username" />
                    </Form.Group>
                    <Form.Group controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control onChange={this.handleChange} value={this.state.password} name="password"  type="password" placeholder="Password" />
                    </Form.Group>
                    <Button value="Submit" variant="primary" type="submit" disabled={
                        ((this.state.password != '') && (this.state.username != '')) ? false : true}>
                        Login
                    </Button>
                </Form>
            </Col>
        ) 
    } 
}

export default Login;