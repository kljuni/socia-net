import React from "react";
import Button from 'react-bootstrap/Button';
import AuthorList from './AuthorList';
import Post from './Post';

function PostsList({ content, cur_page, num_pages, fetchAllPost, data, showProfile, loaded, user_id }) {
    if (!loaded) {
        return (<div className="text-center"><AuthorList></AuthorList></div>)
    }
    
    return(
        <div className={`d-flex flex-column border-left border-right ${data.length < 5 ? 'h-100' : null}`}>
                {data.length == 0 ? <p className="lead mx-auto my-2">No socias posted yet...</p> : null}
                {['All Posts','Following'].includes(content) ? <div className="post-divider"></div> : null}
                {data.map((post, y) => {
                    return (
                        <Post key={post.id} 
                        cur_page={cur_page} 
                        num_pages={num_pages} 
                        fetchAllPost={fetchAllPost} 
                        data={post} 
                        showProfile={showProfile}
                        loaded={loaded}
                        comments={post.comments}
                        post={post}
                        y={y}
                        user_id={user_id}
                        >
                        </Post>
                    );
                })}
            <div className="flex-grow-1"></div>
            <div className="text-center">
                {(cur_page - 1) > 0 ? <Button  variant="outline-primary" className="btn-pagination my-3 mr-2 border-0" onClick={() => fetchAllPost(cur_page - 1)} size="sm">
                <svg width="2.5em" height="2.5em" viewBox="0 0 16 16" className="bi bi-arrow-left-circle" fill="#007bff" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path fillRule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"/>
                </svg>
                </Button> : null}
                {(cur_page + 1) > num_pages ? null : 
                <Button  variant="outline-primary" className="btn-pagination my-3 mr-2 border-0" onClick={() => fetchAllPost(cur_page + 1)} size="sm">
                    <svg width="2.5em" height="2.5em" viewBox="0 0 16 16" className="bi bi-arrow-right-circle" fill="#007bff" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path fillRule="evenodd" d="M4 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5A.5.5 0 0 0 4 8z"/>
                    </svg>
                </Button>}   
            </div>
            <div className="text-center">
                    SVG's thanks to <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>         
            </div>
        </div>
    )
};

export default PostsList;