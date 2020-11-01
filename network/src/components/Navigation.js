import React, { Component } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import ContentLoader, { Facebook } from "react-content-loader";

function Navigation({ handleDisplayMenu, expanded, username, user_id, fetchAllPost, display_form, handle_logout, logged_in, showProfile, handleLogout }) {
    
    // if (!loaded) {
    //     return (
    //         <ContentLoader viewBox="0 0 380 20">
    //             {/* Only SVG shapes */}    
    //             <rect x="0" y="0" rx="5" ry="5" width="100%" height="20" />
    //         </ContentLoader>
    //     )
    // }

    return(
        <Navbar collapseOnSelect className="border-bottom" fixed="top" expanded={expanded} bg="light" expand="lg">
            {/* <Navbar.Brand href="#home">Network</Navbar.Brand> */}
            <Navbar.Toggle onClick={() => handleDisplayMenu()} aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className='mx-auto h4'>
                    {/* If user logged in display button username */}
                    {logged_in && username ? <Nav.Link href="#" onSelect={() => showProfile(user_id)}><b>{username.charAt(0).toUpperCase() + username.slice(1)}</b></Nav.Link> : null}
                    <Nav.Link href="#" onSelect={() => fetchAllPost(1, 'all')}>All Posts</Nav.Link>
                    {/* If user logged in display button following */}
                    {logged_in ? <Nav.Link href="#" onSelect={() => fetchAllPost(1, 'follow')}>Following</Nav.Link> : null}

                    {/* If user NOT logged in display login and register button */}
                    {logged_in ? null : <Nav.Link href="#" onSelect={() => display_form('login')} >Log in</Nav.Link>}
                    {logged_in ? null : <Nav.Link href="#" onSelect={() => display_form('register')} >Register</Nav.Link>}

                    {/* If user logged in display button log out */}
                    {logged_in ? <Nav.Link href="#" onSelect={() => handleLogout()} >Logout</Nav.Link> : null}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Navigation;