import React, { Component } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import ContentLoader, { Facebook } from "react-content-loader";

function Navigation({ user, loaded }) {
    
    if (!loaded) {
        return (
            <ContentLoader viewBox="0 0 380 20">
                {/* Only SVG shapes */}    
                <rect x="0" y="0" rx="5" ry="5" width="100%" height="20" />
            </ContentLoader>
        )
    }

    return(
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">Network</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                {/* If user logged in display button username */}
                {user.email ? <Nav.Link href="#"><b>{user.username}</b></Nav.Link> : null}
                <Nav.Link href="/">All Posts</Nav.Link>
                {/* If user logged in display button following */}
                {user.email ? <Nav.Link href="#">Following</Nav.Link> : null}
                {/* If user NOT logged in display login and register button */}
                {user.email ? null : <Nav.Link href="/login">Log in</Nav.Link>}
                {user.email ? null : <Nav.Link href="/register">Register</Nav.Link>}
                {/* If user logged in display button log out */}
                {user.email ? <Nav.Link href="/logout">Log Out</Nav.Link> : null}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )


}

export default Navigation;