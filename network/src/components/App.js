import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Navigation from "./Navigation";
import WritePost from "./WritePost";
import PostsList from "./PostsList";
import NewAlert from "./NewAlert";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Profile from './Profile';
import Login from "./login"; 
import Signup from "./signup";
import axiosInstance from "./axiosApi"
import "core-js/stable";
import "regenerator-runtime/runtime";

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: [],
            loaded: false,
            user_loaded: false,
            post: '',
            content: '',
            msg: '',
            logged_in: localStorage.getItem('access_token') ? true : false,
            displayed_form: '',
            username: '',
            user_id: '',
            user_view: {},
            num_pages: 0,
            cur_page: 1,
            expanded: false,
            comment: ''
        }
        this.handleLogout = this.handleLogout.bind(this);
    };

    handleLogout = async () => { 
        try { 
            window.scrollTo(0, 0)
            const response = await axiosInstance.post('/blacklist/', { refresh_token: localStorage.getItem("refresh_token")}); 
            console.log("sucess2")
            localStorage.removeItem('access_token'); 
            localStorage.removeItem('refresh_token'); 
            axiosInstance.defaults.headers['Authorization'] = null;
            this.setState({
                displayed_form: 'login',
                logged_in: false, 
                expanded: false,
                username: '',
                content: '',
                user_id: '',
            }); 
            return response; 
        } 
        catch (e) { 
            console.log(e);
            localStorage.removeItem('access_token'); 
            localStorage.removeItem('refresh_token'); 
        } 
    };

    handleChange = (e, post_type) => {
        if (post_type === 'post') this.setState({post: e.target.value});
        else if (post_type === 'comment')this.setState({comment: e.target.value});
    }

    closeAlert = (e) => {        
        if (e == true) this.setState({msg: ''});
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        try {
            this.setState({post: ''})
            const response = await axiosInstance.post('posts/0/all/', {
                author: this.state.user_id,
                body: this.state.post
            })
            const data = response.data
            this.setState({msg: 'Your socia! was sent.'});
            this.fetchAllPost(1);
            console.log(data);
        } 
        catch (e) { 
            console.log(e); 
        } 
    };

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

    parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    };

    componentDidMount() {
        if (this.state.logged_in) {
            const token_data = this.parseJwt(localStorage.getItem('access_token'))
            this.setState({ 
                username: token_data.username,
                user_id: token_data.id}
            );
            this.fetchAllPost(1, 'all')
        }
        else {
            this.setState({
                displayed_form: 'login',
            });
        }
        document.addEventListener('scroll', this.handleScroll)
    }
    
    fetchAllPost = async (page, follow) => {
        try { 
            this.setState({
                displayed_form: '',
                content: 'All Posts',
                user_view: {},
                user_loaded: false,
                expanded: false,
                cur_page: page,
                loaded: false
            });
            window.scrollTo(0, 0)
            const response = await axiosInstance.get(`posts/${page}/${follow}/`);
            console.log(response.data);
            const data = response.data
            this.setState(() => {
                return {
                    data:data.data,
                    num_pages: data.num_pages,
                    loaded: true
                };
            });
        } 
        catch (e) { 
            console.log(e); 
        } 
    };
    
    fetchAllPost = async (page, follow) => {
        try { 
            this.setState({
                displayed_form: '',
                content: 'All Posts',
                user_view: {},
                user_loaded: false,
                expanded: false,
                cur_page: page,
                loaded: false
            });
            window.scrollTo(0, 0)
            const response = await axiosInstance.get(`posts/${page}/${follow}/`);
            console.log(response.data);
            const data = response.data
            this.setState(() => {
                return {
                    data:data.data,
                    num_pages: data.num_pages,
                    loaded: true
                };
            });
        } 
        catch (e) { 
            console.log(e); 
        } 
    };

    showProfile = async (id) => {
        window.scrollTo(0, 0)
        try { 
            this.setState({
                displayed_form: '',
                content: '',
                expanded: false,
                loaded: false
            });
            const response = await axiosInstance.get(`user/${id}/`);
            const data = response.data
            console.log(data)
            console.log("here data")
            this.setState({
                data: data.posts,
                content: 'Profile',
                user_view: data,
                user_loaded: true,
                loaded: true
            });
        } 
        catch (e) { 
            console.log(e); 
        } 
    }

    handle_login = (json) => {
        this.setState({
            logged_in: true,
            displayed_form: '',
            username: json.username,
            user_id: json.id
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
            form = <Login fetchAllPost={this.fetchAllPost} parseJwt={this.parseJwt} handle_login={this.handle_login} />;
            break;
        case 'register':
            form = <Signup display_form={this.display_form}/>;
            break;
        default:
            form = null;}
        return (
                <div className="h-100">
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
                        handleDisplayMenu={this.handleDisplayMenu}
                        handleLogout={this.handleLogout} />
                    </Container>            

                    {form}
                    <div className="container p-0 bg-white h-100 whole-height">                
                        <div className="border-left border-right">                        
                            {this.state.content === 'Profile' && this.state.user_loaded === true ? <Profile showProfile={this.showProfile} user_loaded={this.state.user_loaded} data={this.state.data} user_id={this.state.user_id} user_view={this.state.user_view} /> : null}
                            {/* If user logged in display post form */}
                            {(this.state.logged_in && ['All Posts','Following',''].includes(this.state.content)) ? <WritePost handleSubmit={this.handleSubmit} handleChange={this.handleChange} post={this.state.post}/> : <hr className="mt-2 mb-0"/>}
                            <ReactCSSTransitionGroup
                                transitionName="fade"
                                transitionEnterTimeout={500}
                                transitionLeaveTimeout={300}>
                                {this.state.msg ? <NewAlert className="position-absolute" closeAlert={this.closeAlert} msg={this.state.msg}></NewAlert> : null}
                            </ReactCSSTransitionGroup>  
                        </div>
                        <div className="d-flex flex-column h-100">
                            {['All Posts','Following','Profile'].includes(this.state.content) ? 
                            <PostsList 
                            cur_page={this.state.cur_page} 
                            num_pages={this.state.num_pages} 
                            fetchAllPost={this.fetchAllPost} 
                            data={this.state.data} 
                            showProfile={this.showProfile}
                            loaded={this.state.loaded}
                            content={this.state.content}
                            user_id={this.state.user_id}/> 
                            : 
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