import "../style/home.css";
import Header from "../img/header.png";
import GeoForm from "../components/GeoForm";
import WeatherChart from "../components/WeatherChart";

import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthToken } from "../AuthTokenContext";
import DOMPurify from "dompurify";

const truncateWords = (text, maxWords) => {
  const words = text.split(" ");
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(" ") + " ...";
  }
  return text;
};

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const signUp = () => loginWithRedirect({ screen_hint: "signup" });
  const location = useLocation();
  const { accessToken } = useAuthToken();

  const [posts, setPosts] = useState([]);
  const [latLng, setLatLng] = useState(null);

  const postsPics = [
    {
      id: 1,
      img: "https://media.newyorker.com/photos/6567af6658fc112eddd40429/master/w_1600,c_limit/1_GharibScott_dog.jpg",
    },
    {
      id: 2,
      img: "https://i.pinimg.com/564x/5c/da/76/5cda76e1b8267e7b1016d5ad68c67913.jpg",
    },
    {
      id: 3,
      img: "https://i.pinimg.com/564x/96/16/d5/9616d593d90be28e9c69b9fec05f57fd.jpg",
    },
    {
      id: 4,
      img: "https://i.pinimg.com/564x/7f/d4/89/7fd489dde70d3abe09e2343bbfbe9b5c.jpg",
    },
    {
      id: 5,
      img: "https://i.pinimg.com/564x/83/8d/d2/838dd2db0b74afbc5200d954c3e88a7b.jpg",
    },
    {
      id: 6,
      img: "https://i.pinimg.com/564x/57/78/f4/5778f4a3c1554a60a9673c14be613c70.jpg",
    },
    {
      id: 7,
      img: "https://plus.unsplash.com/premium_photo-1675344576121-81e305536fd3?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 8,
      img: "https://images.unsplash.com/photo-1539667547529-84c607280d20?q=80&w=1722&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 9,
      img: "https://i.pinimg.com/564x/c7/2e/10/c72e102735971f3685a0c98fac579397.jpg",
    },
    {
      id: 10,
      img: "https://i.pinimg.com/564x/48/bb/ba/48bbba8d81fbde0d3dbfc3d72ca63604.jpg",
    },
    {
      id: 11,
      img: "https://i.pinimg.com/564x/49/a1/88/49a188d0e6f0effad20c95f6f29421e0.jpg",
    },
    {
      id: 12,
      img: "https://i.pinimg.com/564x/cd/54/3c/cd543cc249e87394d062966c93bf2636.jpg",
    },
    {
      id: 13,
      img: "https://i.pinimg.com/564x/fe/d3/25/fed3252f6d1e6d9cd7d9bc5120b9833f.jpg",
    },
    {
      id: 14,
      img: "https://i.pinimg.com/564x/fc/a0/ef/fca0ef6d9988db1cc3f8951b981be8a6.jpg",
    },
    {
      id: 15,
      img: "https://i.pinimg.com/564x/af/e9/da/afe9da56587bdfe1c2edf4afbc456396.jpg",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const category = new URLSearchParams(location.search).get("cat");
      const query = category ? `?cat=${category}` : "";

      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/posts${query}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (res.ok) {
          const postsData = await res.json();
          setPosts(postsData);
        } else {
          console.error("Failed to fetch posts:", res.status, res.statusText);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchData();
  }, [location.search, accessToken]);

  const handleNewPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  return (
    <div className="home">
      <div className="header1">
        <img src={Header} alt="Header" />
      </div>
      <h1 className="welcome-header">Welcome to Night City</h1>
      <div className="weather">
        <GeoForm setLatLng={setLatLng} />
        {latLng && <WeatherChart latLng={latLng} />}
      </div>
      <div className="container">
        <br />
        <div className="btn-container">
          {!isAuthenticated ? (
            <button className="btn-primary" onClick={loginWithRedirect}>
              Login
            </button>
          ) : (
            <button className="btn-primary" onClick={() => navigate("/app")}>
              Enter My Blog
            </button>
          )}
        </div>
        <button className="btn-secondary" onClick={signUp}>
          Create Account
        </button>
        <br />
      </div>
      <div className="posts">
        {posts.map((post) => (
          <div className="post" key={post.id}>
            <div className="img">
              <img
                src={post.id > postsPics.length ? postsPics[Math.floor(Math.random() * postsPics.length)].img : postsPics[post.id - 1].img}
                alt="Post"
              />
            </div>
            <div className="content">
              <Link className="link" to={`/app/posts/${post.id}`}>
                <h1>{post.title}</h1>
              </Link>
              <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(truncateWords(post.content, 30)) }}></p>
              <Link className="link" to={`/app/posts/${post.id}`}>
                <button>Read More</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
