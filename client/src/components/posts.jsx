import "../style/postList.css";
import 'react-quill/dist/quill.snow.css';

import React, { useState } from "react";
import usePosts from "../hooks/usePosts";
import { useAuthToken } from "../AuthTokenContext";
import ReactQuill from "react-quill";
import { useLocation } from "react-router-dom";

export default function Posts() {
  const [notification, setNotification] = useState(null);
  const state = useLocation().state;
  const [newItemText, setNewItemText] = useState("");
  const [newItemContent, setNewItemContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(state?.category);
  const [postsItems, setPostsItems] = usePosts();
  const { accessToken } = useAuthToken();

  async function insertPost(title, content, category) {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title,
          content,
          category,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const post = await response.json();
      setNotification("Blog submitted successfully!");
      return post;
    } catch (error) {
      setNotification(`Failed to submit blog: ${error.message}`);
      return null;
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!newItemText || !selectedCategory) {
      setNotification("Please provide a title and select a category.");
      return;
    }

    const newPost = await insertPost(newItemText, newItemContent, selectedCategory);
    if (newPost) {
      setPostsItems([...postsItems, newPost]);
      setNewItemText("");
      setNewItemContent("");
      setSelectedCategory(null);
    }
  };

  return (
    <div className="post-list">
      <form onSubmit={handleFormSubmit} className="post-form" autoComplete="off">
        <div className="content">
          <input
            type="text"
            name="item"
            id="item"
            placeholder="Title"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
          />
          <div className="editorContainer">
            <ReactQuill
              className="editor"
              value={newItemContent}
              onChange={setNewItemContent}
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                  ["clean"],
                ],
              }}
              formats={[
                "header",
                "bold",
                "italic",
                "underline",
                "strike",
                "blockquote",
                "list",
                "bullet",
                "link",
                "image",
              ]}
            />
          </div>
        </div>

        <div>Category</div>
        {["art", "science", "technology", "cinema", "design", "food"].map((category, index) => (
          <div className="cat" key={category}>
            <input
              type="radio"
              checked={selectedCategory && selectedCategory.name === category}
              name="category"
              value={category}
              id={category}
              onChange={() => setSelectedCategory({ id: index + 1, name: category })}
            />
            <label htmlFor={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</label>
          </div>
        ))}

        <button type="submit" className="submit-button">+ Submit Blog</button>
        {notification && <div className="notification">{notification}</div>}
      </form>
    </div>
  );
}
