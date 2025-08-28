import styles from "./Posts.module.css";
import { useEffect, useState } from "react"

export default function Posts() {
  const [posts, setPosts] = useState([
    {
      title: "My first post",
      message: "body of my first post wow",
      createdAt: "some time",
      comments: [],
      author: "Rely",
    },
  ]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:8080/posts", { signal });
        if (!response.ok) {
          throw new Error("Fetch error");
        }
        const postsData = await response.json();
        console.log(postsData);
        setPosts(postsData);
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Request aborted");
        } else {
          console.log(err);
        }
      }
    };
    fetchPosts();
    return () => controller.abort();
  }, []);

  const postItems = posts.map((post) => {
    return (
      <div className={`post ${styles.post}`} key={post.id}>
        <div className="title">{post.title}</div>
        <div className="message">{post.message}</div>
        <div className="createdAt">{post.createdAt}</div>
        {/* <div className="comments">Comments: {post.comments.length}</div> */}
        <div className="author">{post.author}</div>
      </div>
    );
  });
  return <>{postItems}</>;
}
