import React, { Component } from "react";
import { render } from "react-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Navigation from "./Navigation";
import Post from "./Post";
import PostsList from "./PostsList";
import NewAlert from "./NewAlert";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

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
            displayed_form: 'login',
            logged_in: localStorage.getItem('token') ? true : false,
            username: ''
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
        if (this.state.logged_in) {
            fetch('http://localhost:8000/current_user/', {
              headers: {
                Authorization: `JWT ${localStorage.getItem('token')}`
              }
            })
              .then(res => res.json())
              .then(json => {
                this.setState({ username: json.username });
              });
        }
    }
    
    fetchAllPost = () => {
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
                    data:data
                };
            });
        });
    }
    
    handle_login = (e, data) => {
        e.preventDefault();
        fetch('http://localhost:8000/token-auth/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
          .then(res => res.json())
          .then(json => {
            localStorage.setItem('token', json.token);
            this.setState({
              logged_in: true,
              displayed_form: '',
              username: json.user.username
            });
          });
    };

    handle_signup = (e, data) => {
        e.preventDefault();
        fetch('http://localhost:8000/users/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
          .then(res => res.json())
          .then(json => {
            localStorage.setItem('token', json.token);
            this.setState({
              logged_in: true,
              displayed_form: '',
              username: json.username
            });
          });
    };

    handle_logout = () => {
        localStorage.removeItem('token');
        this.setState({ logged_in: false, username: '' });
      };
    
    display_form = form => {
        this.setState({
            displayed_form: form
        });
    };

    render() {
        let form;
        switch (this.state.displayed_form) {
        case 'login':
            form = <LoginForm handle_login={this.handle_login} />;
            break;
        case 'register':
            form = <RegisterForm handle_signup={this.handle_signup} />;
            break;
        default:
            form = null;}
        return (
            <div>
                <Container><Navigation 
                    logged_in={this.state.logged_in}
                    display_form={this.display_form}
                    handle_logout={this.handle_logout}
                    user={this.state.user} 
                    loaded={this.state.user_loaded}
                    fetchAllPost={this.fetchAllPost} />
                </Container>
                {form}
                <h3>
                {this.state.logged_in
                    ? `Hello, ${this.state.username}`
                    : 'Please Log In'}
                </h3>
                <div className="container p-0 bg-white whole-height">                
                    <div className="border-left border-right">
                        <h1 className="px-3">{this.state.content}</h1>
                        {/* If user logged in display post form */}
                        {this.state.logged_in ? <Post handleSubmit={this.handleSubmit} handleChange={this.handleChange} post={this.state.post}/> : null}
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