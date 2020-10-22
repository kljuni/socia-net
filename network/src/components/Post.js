import React, { Component } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import ContentLoader, { Facebook } from "react-content-loader";
import { BrowserView, MobileView, isBrowser, isMobile } from "react-device-detect";

function Post({ handleSubmit, handleChange }) {
    return(
        <Col className="mt-4 mx-auto" xs={12} md={8} lg={6}>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Control onChange={(e) => handleChange(e)} as="textarea" rows={isMobile ? 8 : 5} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit new post
                </Button>
            </Form>
        </Col>
    )
};

export default Post;