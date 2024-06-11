
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../style/postDetail.css"; 
import DOMPurify from "dompurify";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/posts/${id}`, {
          method: "GET",
          // Add headers if needed (e.g., Authorization header with access token)
        });

        if (response.ok) {
          const postData = await response.json();
          console.log(postData);
          setPost(postData);
        } else {
          console.error("Failed to fetch post details:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };

    fetchPostDetail();
  }, [id]);

  return (
    <div className="post-detail">
      {post ? (
        <>
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            <p className="post-author">Author: {post.user.name || "Unknown"}</p>
            <p className="post-updated-at">Last Updated: {new Date(post.updatedAt).toLocaleString()}</p>
          </div>
          <p className="post-content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}></p>
          {/* <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(truncateWords(post.content, 30)) }}></p> */}
          {/* Add other post details as needed */}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}