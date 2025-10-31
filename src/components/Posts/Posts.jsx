import styles from "./Posts.module.css";
import { useEffect, useState } from "react";
import { Link } from "react-router";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const backendAddress =
    import.meta.env.VITE_BACKEND_ADDRESS || 'http://localhost:8080';
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${backendAddress}/posts`, { signal });
        if (!response.ok) {
          throw new Error("Fetch error");
        }
        const postsData = await response.json();
        console.log(postsData);
        setPosts(postsData);
        setLoading(false);
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
      <Link
        to={`/posts/${post.id}`}
        key={post.id}
        className={styles.linkNoUnderscore}
      >
        <div className={`post ${styles.post}`}>
            <h2 className={`title, ${styles.title}`}>{post.title}</h2>
          <div
            className={styles.message}
            dangerouslySetInnerHTML={{ __html: post.message }}
          />
          <div className="createdAt">
            Created:{" "}
            {new Date(post.createdAt).toLocaleDateString(undefined, {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "numeric",
              minute: "numeric"
            })}
          </div>
          <div className="comments">Comments: {post._count.comments}</div>
          <div className="author">Author: {post.author.username}</div>
        </div>
      </Link>
    );
  });

  if (loading) {
    return <p className={styles.loading}>Loading...</p>;
  }

  return (
    <div className={styles.posts}>
      {posts.length > 0 ? postItems : <p>No posts yet...</p>}
    </div>
  );
}
