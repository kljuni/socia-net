import React, { Component } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ContentLoader, { Facebook } from "react-content-loader";
import { BrowserView, MobileView, isBrowser, isMobile } from "react-device-detect";

function WritePost({ handleSubmit, handleChange, post }) {
    return(
        <Row className="mt-4 mx-auto px-3">
            <Col className="px-0" xs={2} md={1}>
                <svg width={isMobile ? "2em" : "3em"} height={isMobile ? "2em" : "3em"} viewBox="0 0 16 16" className="bi bi-chat mx-auto" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
                </svg>
            </Col>
            <Col className="px-0" xs={10} md={11}>
                <Form className="border-0" onSubmit={handleSubmit}>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Control maxLength="140" placeholder="What's happening?" value={post} className="form-control-post border-0 input-font" onChange={(e) => handleChange(e, 'post')} as="textarea" rows={isMobile ? 4 : 5} />
                    </Form.Group>
                    <Button className="rounded-pill ml-auto mr-1 my-4 d-flex align-items-center" variant="primary" type="submit" disabled={(post.length === 0)}>
                        Socia! <img className="ml-1" width="25px" src="/static/images/wink.svg"/>
                    </Button>
                </Form>
            </Col>
        </Row>
    )
};

export default WritePost;