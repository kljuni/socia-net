import React, { Component } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import ContentLoader, { Facebook } from "react-content-loader";

function Navigation({ user, fetchAllPost, display_form, handle_logout, logged_in }) {
    
    // if (!loaded) {
    //     return (
    //         <ContentLoader viewBox="0 0 380 20">
    //             {/* Only SVG shapes */}    
    //             <rect x="0" y="0" rx="5" ry="5" width="100%" height="20" />
    //         </ContentLoader>
    //     )
    // }

    return(
        <Navbar className="border-bottom" fixed="top" bg="light" expand="lg">
            {/* <Navbar.Brand href="#home">Network</Navbar.Brand> */}
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className='mx-auto h4'>
                    {/* If user logged in display button username */}
                    {user.email ? <Nav.Link href="#"><b>{user.username}</b></Nav.Link> : null}
                    <Nav.Link onClick={() => fetchAllPost()}>All Posts</Nav.Link>
                    {/* If user logged in display button following */}
                    {user.email ? <Nav.Link href="#">Following</Nav.Link> : null}

                    {/* If user NOT logged in display login and register button */}
                    {user.email ? null : <Nav.Link onClick={() => display_form('login')} >Log in</Nav.Link>}
                    {user.email ? null : <Nav.Link onClick={() => display_form('register')} >Register</Nav.Link>}

                    {/* If user logged in display button log out */}
                    {logged_in ? <Nav.Link onClick={handle_logout} >Logout</Nav.Link> : null}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Navigation;