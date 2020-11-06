import React, { Component } from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import moment from 'moment';
import axiosInstance from "./axiosApi";
import Comment from "./Comment";

class Post extends Component {
    constructor(props){
        super(props);
        this.state = {
            edit: false,
            tweet: this.props.post.body,
            like: this.props.post.isLiked,
            like_count: this.props.post.like_count,
            commenting: false,
            comment: '',
            showComments: false
        }
    };

    editPost = () => {
        this.setState({edit:true})
    }

    enableComment = () => {
        this.setState({commenting: !this.state.showComments})
    }

    enableShowComment = () => {
        this.setState({showComments:!this.state.showComments})
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        try { 
            const response = await axiosInstance.post(`edit/${this.props.post.id}/`, { 
                author: this.props.user_id,
                body: this.state.tweet
            });
            const data = response.data;
            this.setState({
                tweet: data.body,
                edit: false})
        } 
        catch (e) { 
            console.log(e); 
        }
    }

    likePost = async (id) => {
        // If user is not signed in, invite to log in
        if (!this.props.user_id) {
            console.log("please sign in")
            return null;
        } 
        try { 
            const response = await axiosInstance.post(`like/${id}/`, { 
                liker: this.props.user_id,
                post: id
            });
            const data = response.data;
            if (data.action === 'like') this.setState({
                like:true,
                like_count: this.state.like_count += 1
            });
            else if (data.action === 'deleted') this.setState({
                like:false,
                like_count: this.state.like_count -= 1
            });
        } 
        catch (e) { 
            console.log(e); 
        } 
    };

    handleSubmitComment = async (id) => {
        // If user is not signed in, invite to log in
        if (!this.props.user_id) {
            console.log("please sign in")
            return null;
        }
        try { 
            const response = await axiosInstance.post(`comment/${id}/`, { 
                author: this.props.user_id,
                post: id,
                body: this.state.comment
            });
            const data = response.data;
            // add the comment to state of App
        } 
        catch (e) { 
            console.log(e); 
        } 
    }

    handleChange = (e, post_type) => {
        if (post_type === 'post') this.setState({tweet: e.target.value});
        else if (post_type === 'comment') this.setState({comment: e.target.value});
    }

    render() {
        const { post, showProfile, y, user_id, comments } = this.props;
        const { edit, tweet, like, commenting, showComments } = this.state;
        const comments_section = comments.map((comm, y) => {
            return (
            <div  className="p-0 mt-1">
            <Card key={comm.id} className={y === 0 ? "mx-1 mt-2 border-0 pb-1 px-2" : "mx-1 mt-2 border-0 pb-1 px-2"}>
                <Card.Body key={comm.id} className="p-0">
                    <Row key={comm.id} className="mx-auto">
                        <Col key={comm.id} className="px-0" xs={2} md={1}>
                            <div className="avatar-div h-100 w-100">
                                <div className="avatar-icon mx-auto" style={{backgroundImage: `url(${comm.image_url})`}}></div>
                            </div>
                        </Col>
                        <Col key={comm.id + 1} className="pl-2 px-0 d-flex" xs={10} md={11}>
                            <Card.Title 
                                key={comm.id} 
                                className="my-auto ml-2 pointer"
                                onClick={() => showProfile(comm.author)}>
                                    {comm.comment_author}
                                <span className="text-secondary small"> · {moment(comm.timestamp).fromNow()}</span>
                            </Card.Title>
                        </Col>
                    </Row>
                    <Row key={comm.id + 1} className="mt-2 mx-auto">
                        <Col key={comm.id} className="px-0" xs={2} md={1}>
                            <div className="pad-line h-100 w-100">
                                {y == comments.length - 1 ? null : 
                                <div className="line-div h-100">
                                    <div className="line-icon reply-line mx-auto h-100"></div>
                                </div>
                                }
                            </div>
                        </Col>
                        <Col key={comm.id + 1} className="px-0 pl-2" xs={10} md={11}>
                            <Card.Text style={{whiteSpace: 'pre-wrap'}} key={post.id} className="ml-2">
                                            <p><i>Commented: </i></p>
                                            {comm.body}
                                            <br/>                                           
                                            <br/>                                           
                            </Card.Text>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            {y == comments.length - 1 ? <div class="post-divider"></div> : <hr className="mt-2 mb-0"/> }
            </div>
            )
        })
        return(
            <div className="p-0 mt-1">
                <Card key={post.id} className={y === 0 ? "mx-1 mt-1 border-0 pt-2 px-2" : "mx-1 mt-2 border-0 pb-1 px-2"}>
                    <Card.Body key={post.id} className="p-0">
                        <Row key={post.id} className="mx-auto">
                            <Col key={post.id} className="px-0" xs={2} md={1}>
                                {/* <img src={`/media/${post.image}`}/> */}
                                <div className="avatar-div h-100 w-100 pointer" onClick={() => showProfile(post.author)}>
                                    <div className="avatar-icon" style={{backgroundImage: `url(${post.image_url})`}}></div>
                                </div>
                            </Col>
                            <Col key={post.id + 1} className="pl-2 px-0 d-flex" xs={10} md={11}>
                                <Card.Title 
                                    key={post.id} 
                                    className="my-0 ml-2 pointer"
                                    onClick={() => showProfile(post.author)}>
                                        {post.post_author}
                                    <span className="text-secondary small"> · {moment(post.timestamp).fromNow()}</span>
                                </Card.Title>
                                <div className="ml-auto my-auto">

                                    {/* Show edit button if user is the author of the post */}
                                    {user_id === post.author ? <svg onClick={() => this.editPost()} width="1.4em" height="1.4em" viewBox="0 0 16 16" className="bi bi-pencil-square mr-2 mb-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                    </svg> : null}
                                </div>
                                {!like ? 
                                <div>
                                    <svg onClick={() => this.likePost(post.id)} key={post.id + 1} width="2.6em" height="2.6em" viewBox="0 0 16 16" className="like-heart bi bi-heart my-auto p-2 pointer" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                                    </svg>{this.state.like_count}
                                </div> 
                                :
                                <div>
                                    <svg onClick={() => this.likePost(post.id)} width="2.6em" height="2.6em" viewBox="0 0 16 16" className="like-heart bi bi-heart my-auto p-2 pointer" fill="rgb(224, 36, 94)" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                                    </svg>{this.state.like_count}
                                </div>
                                }
                            </Col>
                        </Row>
                        <Row key={post.id + 1} className="mt-2 mx-auto">
                            <Col key={post.id} className="px-0" xs={2} md={1}>
                                <div className="pad-f-line h-100 w-100">
                                    {showComments ? <div className="line-div h-100">
                                        <div className="line-icon reply-line mx-auto h-100"></div>
                                    </div> : null}
                                </div>
                            </Col>
                            <Col key={post.id + 1} className="pl-2 px-0" xs={10} md={11}>
                                
                                {/* If editing unmount post body and dissable comments */}
                                {edit ? 
                                    <Form className="border-0" onSubmit={this.handleSubmit}>
                                        <Form.Group controlId="exampleForm.ControlTextarea1">
                                            <Form.Control maxLength="140" placeholder="What's happening?" value={tweet} className="form-control-post border-0 input-font" onChange={(e) => this.handleChange(e, 'post')} as="textarea" rows={post.body.split(/\r\n|\r|\n/).length} />
                                        </Form.Group>
                                        <Button className="rounded-pill ml-auto mr-1 my-2 d-flex align-items-center" variant="primary" type="submit" disabled={(post.length === 0)}>
                                            Save
                                        </Button>
                                    </Form>
                                :
                                    <div>
                                        <Card.Text style={{whiteSpace: 'pre-wrap'}} key={post.id} className="ml-2">
                                                        {tweet}
                                        </Card.Text>
                                        <Card.Link key={post.id + 1} className="ml-2 text-primary pointer" onClick={() => this.enableComment()}>
                                        <svg width="1.4em" height="1.4em" viewBox="0 0 16 16" class="bi bi-chat" fill="#212529" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
                                        </svg>
                                        </Card.Link>
                                        {post.comments.length > 0 ? <Card.Link key={post.id + 2} className="ml-2 text-primary pointer" onClick={() => this.enableShowComment()}>View comments</Card.Link> : null}
                                    </div>                                    
                                }

                                {commenting ? <Comment comment={this.state.comment} comment_id={this.props.post.id} handleChange={this.handleChange} handleSubmitComment={this.handleSubmitComment} ></Comment> : null}
                                
                                
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                <hr className="mt-2 mb-0"/>
                {showComments ? comments_section : null}
            </div>
        )
    }
};

export default Post;