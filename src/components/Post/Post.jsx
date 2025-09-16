// import styles from "./Post.module.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router";


function Comments({ commentsData }) {
  const commentsResult = commentsData.map(comment => {
    return (
      <div className="comment" key={comment.id}>
        <p className="commentMessage">{comment.message}</p>
        <p className="commentAuthor">{comment.author.username}</p>
        <p className="commentCreatedAt">{comment.createdAt}</p>
      </div>
    )
  });
  return <>{commentsResult}</>;
}

export default function Post() {
  const { postId } = useParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);

  useEffect(() => {
      const controller = new AbortController();
      const signal = controller.signal;
      const jwt = localStorage.getItem("authToken");
      const fetchPost = async () => {
        try {
          const response = await fetch(`http://localhost:8080/posts/${postId}`, { signal, 
            headers: {
              Authorization: `Bearer ${jwt}`,
            }, });
          if (!response.ok) {
            throw new Error("Fetch error");
          }
          console.log(response);
          const postData = await response.json();
          console.log(postData);
          setPost(postData)
          setLoading(false);
        } catch (err) {
          if (err.name === "AbortError") {
            console.log("Request aborted");
          } else {
            console.log(err);
          }
        }
      };
      fetchPost();
      return () => controller.abort();
    }, [postId]);
    
 if (loading) {
    return <p>Loading...</p>;
  }

  if (!post) {
    return <p>Post not found.</p>;
  }

  return (
    <div className="post">
      <div className="title">{post.title}</div>
      <div className="content">{post.message}</div>
      <div className="comments">
        {post.comments.length < 1 ? <p>No comments yet.</p> : <Comments commentsData={post.comments}/>}
      </div>
      
    </div>
  );
}