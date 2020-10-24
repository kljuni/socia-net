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
import Profile from './Profile';

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
            content: '',
            msg: '',
            logged_in: localStorage.getItem('token') ? true : false,
            displayed_form: '',
            username: '',
            user_id: ''
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
        console.log(this.state.user_id)
        this.setState({post: ''})
        console.log("submited");
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                author: this.state.user_id,
                body: this.state.post,
                msg: "sth works"
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
                this.setState({ 
                    username: json.username,
                    user_id: json.id});
              });
              console.log(this.state.user_id)
        }
        else {
            this.setState({
                displayed_form: 'login',
            });
        }
    }
    
    fetchAllPost = () => {
        window.scrollTo(0, 0)
        this.setState({
            displayed_form: '',
            content: 'All Posts'
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
            console.log(data)
            this.setState(() => {
                return {
                    data:data,
                    loaded: true
                };
            });
        });
    }
    
    showProfile = (id) => {
        window.scrollTo(0, 0)
        this.setState({
            displayed_form: '',
            content: 'Profile'
        });
        console.log(id)
        fetch("api/user/" + id)
        .then(response => response.json())
        .then(json => {
            console.log(json.posts)
            this.setState({
                data: json.posts
            })
        })
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
              username: json.user.username,
              user_id: json.user.id
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
              username: json.username,
              user_id: json.id
            });
          });
    };

    handle_logout = () => {
        localStorage.removeItem('token');
        this.setState({
            displayed_form: 'login',
            logged_in: false, 
            username: '',
            content: '',
            user_id: ''
        });
      };
    
    display_form = form => {
        window.scrollTo(0, 0)
        this.setState({
            displayed_form: form,
            content: '',
            data : []
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
                    username={this.state.username} 
                    user_id={this.state.user_id} 
                    loaded={this.state.user_loaded}
                    fetchAllPost={this.fetchAllPost}
                    showProfile={this.showProfile} />
                </Container>
                {form}
                <div className="container p-0 bg-white whole-height">                
                    <div className="border-left border-right">
                        <h1 className="px-3">{this.state.content}</h1>
                        
                        {(this.state.logged_in && this.state.content === 'Profile') ? <Profile data={this.state.data} /> : null}
                        {/* If user logged in display post form */}
                        {(this.state.logged_in && ['All Posts','Following',''].includes(this.state.content)) ? <Post handleSubmit={this.handleSubmit} handleChange={this.handleChange} post={this.state.post}/> : null}
                        <ReactCSSTransitionGroup
                            transitionName="fade"
                            transitionEnterTimeout={500}
                            transitionLeaveTimeout={300}>
                            {this.state.msg ? <NewAlert className="position-absolute" closeAlert={this.closeAlert} msg={this.state.msg}></NewAlert> : null}
                        </ReactCSSTransitionGroup>  
                    </div>
                    <div className="border-left border-right">
                        {['All Posts','Following','Profile'].includes(this.state.content) ? <PostsList data={this.state.data} showProfile={this.showProfile}/> : null}
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