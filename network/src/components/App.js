import React, { Component } from "react";
import { render } from "react-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Navigation from "./Navigation";
import Post from "./Post";
import PostsList from "./PostsList";
import NewAlert from "./NewAlert";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: [],
            user: {},
            post: '',
            loaded: false,
            user_loaded: false,
            placeholder: "Loading",
            content: "All Posts",
            msg: '',
        }
    };

    handleChange = (e) => {
        this.setState({post: e.target.value})
    }

    closeAlert = (e) => {        
        if (e == true) this.setState({msg: ''});
    }
    
    handleSubmit = (e) => {
        e.preventDefault();
        console.log(this.state.post)
        this.setState({post: ''})
        console.log("submited");
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                author: this.state.user.id,
                body: this.state.post
            })
        };
        fetch('api/posts', requestOptions)
            .then(response => response.json())
            .then(data => this.setState({msg: 'Your socia! was sent.'}));
    }

    componentDidMount() {
        fetch("api/user")
            .then(response => response.json())
            .then(user => {
                this.setState({user:user, user_loaded: true});
            });
        fetch("api/posts")
            .then(response => {
                if (response.status > 400) {
                    return this.setState(() => {
                        return { placeholder: "Something went wrong!" };
                    });
                }
                return response.json();
            })
            .then(data => {
                this.setState(() => {
                    return {
                        data,
                        loaded: true
                    };
                });
            });
    }        

    render() {
        return (
            <div>
                <Container><Navigation user={this.state.user} loaded={this.state.user_loaded} /></Container>
                <div className="container p-0 bg-white whole-height">                
                    <div className="border-left border-right">
                        <h1 className="px-3">{this.state.content}</h1>
                        {/* If user logged in display post form */}
                        {this.state.user.email ? <Post handleSubmit={this.handleSubmit} handleChange={this.handleChange} post={this.state.post}/> : null}
                        <ReactCSSTransitionGroup
                            transitionName="fade"
                            transitionEnterTimeout={500}
                            transitionLeaveTimeout={300}>
                            {this.state.msg ? <NewAlert className="position-absolute" closeAlert={this.closeAlert} msg={this.state.msg}></NewAlert> : null}
                        </ReactCSSTransitionGroup>  
                    </div>
                    <div className="border-left border-right">
                        <PostsList data={this.state.data}/>
                    </div>
                </div>
                <div className="text-center">
                    SVG's thanks to <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>         
                </div>
            </div>
        )
    }
}

export default App;

const container = document.getElementById("root");
render(<App />, container);