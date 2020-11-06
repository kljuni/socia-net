import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import axiosInstance from "./axiosApi";
import ReactTooltip from 'react-tooltip';

class Profile extends Component {
    constructor(props){
        super(props);
        this.state = {
            user_follows: this.props.user_view.user_follows,            
            followers: this.props.user_view.followers,
            unfollow: false,
            selectedFile: null,
            avatar: this.props.user_view.user.image
        }
    };

    submit = (action, id) => {
        confirmAlert({
          title: `Unfollow ${this.props.user_view.user.username}?`,
          message: 'Are you sure to do this.',
          buttons: [
            {
              label: 'Yes',
              onClick: () => this.followUser(action, id, 'yes')
            },
            {
              label: 'No',
            }
          ]
        });
    };

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

    followUser = async (action, id, pass) => {
        if (action === 'unfollow' && pass === 'no') {
            this.submit(action, id)
            return null;    
        }
        try { 
            const response = await axiosInstance.post(`follow/${action}/${id}/`, { 
                follower: this.props.user_id,
                followed: id
            });
            const data = response.data;
            this.setState({
                user_follows: data.following,
                followers: action == 'follow' ? (this.state.followers += 1) : (this.state.followers -= 1),
            });
        } 
        catch (e) { 
            console.log(e); 
        }
    }

    fileSelectHandler = event => {
        this.setState({selectedFile: event.target.files[0]})
        console.log(this.state.selectedFile)
    }

    fileSelectAndUploadHandeler = async (event, id) => {
        try {
            this.setState({
                selectedFile: event.target.files[0]
            }, async () => {
                const fd = new FormData();
                fd.append('image', this.state.selectedFile, this.state.selectedFile.name);
                const response = await axiosInstance.put(`image/${id}/`, fd);
                const image_url = response.data.image
                if(response.status == 200) {
                    this.setState({avatar:image_url});
                    this.props.showProfile(id);
                }
            });
        } 
        catch (e) { 
            console.log(e); 
        }
    } 

    fileUploadHandeler = async (id) => {
        try { 
            const fd = new FormData();
            fd.append('image', this.state.selectedFile, this.state.selectedFile.name);
            const response = await axiosInstance.put(`image/${id}/`, fd);
            const data = response.data;
            console.log(data);
        } 
        catch (e) { 
            console.log(e); 
        }
    } 

    render() {
        const { user_id, user_view, user_loaded } = this.props;

        if (user_loaded === false) return null;
        console.log("here is ")
        console.log(user_view)

        // If user is logged in display follow button, otherwise not.
        const follow_button = user_id ? ((user_id == user_view.user.id) ? null :
            (
                <div className="text-right">
                    <Button 
                        value={this.state.user_follows ? "unfollow" : "follow" }
                        onClick={(e) => this.followUser(e.target.value, user_view.user.id, 'no')} 
                        className="rounded-pill mr-2 mb-1" 
                        variant={this.state.user_follows ? "primary" : "outline-primary"}
                    >{this.state.user_follows ? "Following" : "Follow"}</Button>
                </div>
        )) : null;

        return (
            <div> 
                <div className="profile-banner">                    
                    <div className="avatar-pic" style={{backgroundImage: `url(${this.state.avatar})`}}
                        data-tip="Image will be uploaded only for the lifetime of the dyno session."
                        data-for="main"
                        data-iscapture="true">
                            <ReactTooltip
                                id="main"
                                place="bottom"
                                type="info"
                                effect="solid"
                            />
                        {user_id === user_view.user.id ? (<div className="h-100 w-100 avatar-parent" role="button">
                            <input className="p-2 avatar-input" type='file' name='avatar' onChange={(e) => this.fileSelectAndUploadHandeler(e, user_id)}/>
                        </div>) : null}
                    </div>
                </div>        
                <div className="pl-3 pt-5 pb-2 d-flex justify-content-between">
                    <div>{user_view.user_following} Following {this.state.followers} Follower{this.state.followers === 1 ? null : 's'}</div> 
                    <div className="neg-margin">{follow_button}</div>
                </div>
            </div>
        )
    };
};

export default Profile;
