import React, { Component } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ContentLoader, { Facebook } from "react-content-loader";
import { BrowserView, MobileView, isBrowser, isMobile } from "react-device-detect";

function Comment ({ comment, comment_id, handleChange, handleSubmitComment }) {
    return (
        <Form className="border-0" onSubmit={() => handleSubmitComment(comment_id)}>
            <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Control maxLength="140" placeholder="Your reply" value={comment} className="form-control-post border-0 input-font" onChange={(e) => handleChange(e, 'comment')} as="textarea" rows={isMobile ? 3 : 4} />
            </Form.Group>
            <Button className="rounded-pill ml-auto mr-1 my-4 d-flex align-items-center" variant="primary" type="submit" disabled={(comment.length === 0)}>
                Reply
            </Button>
        </Form>
    )
}

export default Comment;





