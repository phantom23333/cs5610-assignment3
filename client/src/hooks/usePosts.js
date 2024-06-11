import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";

// this is a custom hook that fetches the posts items from the API
// custom hooks are a way to share logic between components
export default function usePosts() {
  const [postsItems, setPostsItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);  // Add isLoading state

  const { accessToken } = useAuthToken();

  useEffect(() => {
    async function getPostsFromApi() {
      setIsLoading(true);  // Notify that data fetching is in progress

      // fetch the posts from the API, passing the access token in the Authorization header
      const data = await fetch(`${process.env.REACT_APP_API_URL}/posts`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const posts = await data.json();

      setPostsItems(posts);
      setIsLoading(false);  // Notify that data fetching is complete

    }

    if (accessToken) {
      getPostsFromApi();
    }
  }, [accessToken]);

  return [postsItems, setPostsItems, isLoading];
}
