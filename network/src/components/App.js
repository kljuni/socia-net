import React, { Component } from "react";
import { render } from "react-dom";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Navigation from "./Navigation";
import WritePost from "./WritePost";
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
            user_id: '',
            user_view: {},
            user_loaded: false,
            num_pages: 0,
            cur_page: 1,
            expanded: false
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
                body: this.state.post
            })
        }; 
        fetch('api/posts/0', requestOptions)
            .then(this.handleErrors)
            .then(response => response.json())
            .then(data => {
                this.setState({msg: 'Your socia! was sent.'});
                this.fetchAllPost(1);
            })

    }

    handleScroll = () => {
        this.setState({expanded: false})
    }

    handleDisplayMenu = () => {
        this.setState({expanded: !this.state.expanded})
    }

    handleErrors = (response) => {
        if (!response.ok) {
            throw Error(response.statusText + " - " + response.url);
        }
        return response;
    }

    componentDidMount() {
        if (this.state.logged_in) {
            fetch('http://localhost:8000/current_user/', {
              headers: {
                Authorization: `JWT ${localStorage.getItem('token')}`
              }
            })
            .then(this.handleErrors)
            .then(res => res.json())
            .then(json => {
                this.setState({ 
                    username: json.username,
                    user_id: json.id});
            })
            .catch(err => {
                this.setState({ 
                    username: '',
                    user_id: '',
                    logged_in: false
                });                  
            });
        }
        else {
            this.setState({
                displayed_form: 'login',
            });
        }
        document.addEventListener('scroll', this.handleScroll)
    }
    
    fetchAllPost = (page) => {
        window.scrollTo(0, 0)
        this.setState({
            displayed_form: '',
            content: 'All Posts',
            user_view: {},
            user_loaded: false,
            expanded: false,
            cur_page: page
        });
        fetch(`api/posts/${page}`)
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
                    data:data.data,
                    num_pages: data.num_pages,
                    loaded: true
                };
            });
        });
    }
    
    showProfile = (id) => {
        window.scrollTo(0, 0)
        this.setState({
            displayed_form: '',
            content: 'Profile',
            expanded: false,
            loaded: false
        });
        fetch("api/user/" + id)
        .then(response => response.json())
        .then(json => {
            this.setState({
                data: json.posts,
                user_view: json,
                user_loaded: true,
                loaded: true
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
            user_id: '',
            expanded: false
        });
      };
    
    display_form = form => {
        window.scrollTo(0, 0)
        this.setState({
            displayed_form: form,
            content: '',
            data : [],
            expanded: false
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
                    showProfile={this.showProfile}
                    expanded={this.state.expanded}
                    handleDisplayMenu={this.handleDisplayMenu} />
                </Container>
                {form}
                <div className="container p-0 bg-white whole-height">                
                    <div className="border-left border-right">                        
                        {this.state.content === 'Profile' && this.state.user_loaded === true ? <Profile user_loaded={this.state.user_loaded} data={this.state.data} user_id={this.state.user_id} user_view={this.state.user_view} /> : null}
                        {/* If user logged in display post form */}
                        {(this.state.logged_in && ['All Posts','Following',''].includes(this.state.content)) ? <WritePost handleSubmit={this.handleSubmit} handleChange={this.handleChange} post={this.state.post}/> : null}
                        <ReactCSSTransitionGroup
                            transitionName="fade"
                            transitionEnterTimeout={500}
                            transitionLeaveTimeout={300}>
                            {this.state.msg ? <NewAlert className="position-absolute" closeAlert={this.closeAlert} msg={this.state.msg}></NewAlert> : null}
                        </ReactCSSTransitionGroup>  
                    </div>
                    <div className="border-left border-right h-100">
                        {['All Posts','Following','Profile'].includes(this.state.content) ? <PostsList 
                        cur_page={this.state.cur_page} 
                        num_pages={this.state.num_pages} 
                        fetchAllPost={this.fetchAllPost} 
                        data={this.state.data} 
                        showProfile={this.showProfile}
                        loaded={this.state.loaded}
                        content={this.state.content}
                        user_id={this.state.user_id}/> : 
                        <div className="row h-100">
                            <div className="text-center mt-auto mx-auto">
                                SVG's thanks to <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>         
                            </div>
                        </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default App;

const container = document.getElementById("root");
render(<App />, container);