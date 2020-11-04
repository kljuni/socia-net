import React, { Component } 
from "react";
import axiosInstance from "./axiosApi"; 
import "core-js/stable";
import "regenerator-runtime/runtime";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';

class Signup extends Component{ 
    constructor(props){ super(props); 
        this.state = { username: "", password: "", confirmation_password: "", email: "", errors: "" }; 
        this.handleChange = this.handleChange.bind(this); 
        this.handleSubmit = this.handleSubmit.bind(this); 
    } 

    handleChange(event) { 
        this.setState({[event.target.name]: event.target.value}); 
    } 
    
    
    async handleSubmit(event) { 
        event.preventDefault(); 
        try { 
            const response = await axiosInstance.post('/user/create/', { 
                username: this.state.username, 
                email: this.state.email, 
                password: this.state.password 
            }); 
            this.props.display_form('login')
            return response; 
        } 
        
        catch (error) { 
            console.log(error.stack); 
            this.setState({ errors:error.response.data }); 
        } 
    } 
    
    render() { 
        return ( 
                // <div>
        <Col className="mx-auto my-5 p-5 border rounded box-shadow log-form">
            <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control onChange={this.handleChange} value={this.state.username} name="username" type="text" autocomplete="off"
                    placeholder="Your socia! posts will display this username" />
                    { this.state.errors.username ? this.state.errors.username : null} 
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control onChange={this.handleChange} value={this.state.email} name="email" type="email" placeholder="Enter email" />
                    { this.state.errors.email ? this.state.errors.email : null}
                    <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control onChange={this.handleChange} value={this.state.password} name="password"  type="password" placeholder="Password" autocomplete="off"/>
                    { this.state.errors.password ? this.state.errors.password : null}
                </Form.Group>
                <Form.Group controlId="formBasicPassword2">
                    <Form.Label>Confirm password</Form.Label>
                    <Form.Control onChange={this.handleChange} value={this.state.confirmation_password} name="confirmation_password"  type="password" placeholder="Confirm password" autocomplete="off"/>
                </Form.Group>
                <Button variant="primary" type="submit" disabled={
                    ((this.state.password != '') && (this.state.confirmation_password != '') &&
                    (this.state.email != '') && (this.state.username != '') && 
                    this.state.password === this.state.confirmation_password) ? false : true}>
                    Submit
                </Button>
            </Form>
        </Col>
            
        ) 
    }

} 

export default Signup;