import React, { useState, useEffect } from "react";
import { useNavigate,Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";



export default function Profile() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const { accessToken } = useAuthToken();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      setPosts([]); // Clear existing posts data

      const fetchPosts = async () => {
        try {
          const token = await getAccessTokenSilently();
          const response = await fetch(`${process.env.REACT_APP_API_URL}/profile/posts`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();
          const sortedPosts = data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          setPosts(sortedPosts);
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      };

      fetchPosts();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  const editPost = (postId) => {
    navigate(`/app/posts/${postId}/edit`);
  };

  const deletePost = async (postId) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log('Post deleted successfully!');
        setLoading(true);
        const updatedResponse = await fetch(`${process.env.REACT_APP_API_URL}/profile/posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const updatedData = await updatedResponse.json();
        const sortedPosts = updatedData.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setPosts(sortedPosts);
      } else {
        console.error('Error deleting post:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="userinfo">
        <div>
          <p>Name: {user.name}</p>
        </div>
        <div>
          <img src={user.picture} width="70" alt="profile avatar" />
        </div>
        <div>
          <p>📧 Email: {user.email}</p>
        </div>
        <div>
          <p>✅ Email verified: {user.email_verified?.toString()}</p>
        </div>
      </div>

      <div>
      <h1 className="posth1">Take a tour of your posts!</h1>
     

      <div className = "posteditor">
          <div className="profileposts">
            {posts.map(post=>(
                <div className="post" key={post.id}>    
                <div className="content">
                  <Link className="link" to={`/app/posts/${post.id}`}>
                    <h1 className="titleh1">{post.title}</h1>   
                </Link>
            
                    <Link className="link" to={`/app/posts/${post.id}`}>
                    </Link>
                    <div className="button-container">
                    <button className="editbtn" onClick={() => editPost(post.id)}>Edit</button>
                    <button className="btn-dlt" onClick={() => deletePost(post.id)}>Delete</button>
                    </div>
                 </div>
                </div>
            ))}
            </div>
        </div>
    
      </div>
      
      </div>
    
  );
}