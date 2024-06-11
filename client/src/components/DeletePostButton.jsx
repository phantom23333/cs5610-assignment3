import React from "react";

export default function DeletePostButton({ postId, onDelete }) {
  const handleDelete = () => {
    // Call the onDelete callback with the postId
    onDelete(postId);
  };

  return (
    <button onClick={handleDelete}>
      Delete
    </button>
  );
}
