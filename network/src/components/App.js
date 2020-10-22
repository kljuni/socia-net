import React, { Component } from "react";
import { render } from "react-dom";
import Button from "react-bootstrap/Button";
import Navigation from "./Navigation"
import Post from "./Post"

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
            content: "all_posts"
        }
    };

    handleChange = (e) => {
        this.setState({post: e.target.value})
    }

    handleSubmit = (e) => {
        e.preventDefault();
        console.log(this.state.post)
        console.log(e.target.value)
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
            .then(data => console.log(data));
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
                <Navigation user={this.state.user} loaded={this.state.user_loaded} />
                {/* If user logged in display post form */}
                {this.state.user.email ? <Post handleSubmit={this.handleSubmit} handleChange={this.handleChange}/> : null}
                <ul>
                    {this.state.data.map(post => {
                        return (
                            <li key={post.id}>
                                {post.author} - {post.body} - |{post.like}|
                            </li>
                        );
                    })}
                </ul>
            </div>
        )
    }
}

export default App;

const container = document.getElementById("root");
render(<App />, container);