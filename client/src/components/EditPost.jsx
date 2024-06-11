import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthToken } from "../AuthTokenContext";
import ReactQuill from "react-quill";
import "../style/home.css";
import 'react-quill/dist/quill.snow.css';


const EditPost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [notification, setNotification] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const { accessToken } = useAuthToken();

  const fetchPostDetails = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/posts/${postId}`);
      const data = await response.json();
      setPost(data);
      setEditedTitle(data.title);
      setEditedContent(data.content);
    } catch (error) {
      console.error('Error fetching post details:', error);
    }
  };

  
  useEffect(() => {
    fetchPostDetails();
  }, [postId]);
  

  const handleTitleChange = (event) => {
    setEditedTitle(event.target.value);
  };

  const handleContentChange = (content) => {
    setEditedContent(content);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Implement logic to update the post on the server
      const token = accessToken; // Get the access token
      const response = await fetch(`${process.env.REACT_APP_API_URL}/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editedTitle,
          content: editedContent,
        }),
      });

      if (response.ok) {
        // If the update operation is successful, you may want to navigate
        // the user back to the post details page or another relevant page
        setNotification('Post updated successfully!');
        console.log('Post updated successfully!');
        
      } else {
        console.error('Error updating post:', response.statusText);
        setNotification('Cannot update post. Please try again.');
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className='editpostContainer'>
      
      <h1 className='editposth1'>Edit Post</h1>
      
        <form className="editform" onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" value={editedTitle} onChange={handleTitleChange} />
        </label>
        <br />
      
        <label>
          Content:
          <ReactQuill value={editedContent} onChange={handleContentChange} />
        </label>
        <br />
        {notification && <div style={{ color: notification.includes('successfully') ? 'green' : 'red' }}>{notification}</div>}
        <br></br>
        <button type="submit">Update Post</button>
      </form>
      
    </div>
  );
};

export default EditPost;