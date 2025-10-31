// import styles from "./Post.module.css";
import { useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router";
import styles from "./Post.module.css";

function Comments({ commentsData }) {
  const commentsResult = commentsData.map((comment) => {
    return (
      <div className={`comment ${styles.comment}`} key={comment.id}>
        <p className={styles.commentTitle}>
          {comment.author.username} said on{" "}
          {new Date(comment.createdAt).toLocaleDateString(undefined, {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
          :{" "}
        </p>
        <p className={styles.commentMessage}>{comment.message}</p>
      </div>
    );
  });
  return <>{commentsResult}</>;
}

function NewCommentForm({ postId, onNewComment }) {
  async function handleNewComment(e) {
    console.log({ works: e });
    const jwt = localStorage.getItem("authToken");
    e.preventDefault();
    const formData = new FormData(e.target);
    const newComment = formData.get("newComment");
    const backendAddress =
      import.meta.env.VITE_BACKEND_ADDRESS || 'http://localhost:8080';
    try {
      const requestBody = { message: newComment };
      const response = await fetch(
        `${backendAddress}/posts/${postId}/comments`,
        {
          method: "POST",
          body: JSON.stringify(requestBody),
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        throw new Error("Error posting data to server");
      }
      const createdComment = await response.json();
      e.target.reset();
      onNewComment(createdComment);
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <form className={styles.newCommentForm} onSubmit={handleNewComment}>
      <textarea
        placeholder="Leave a comment!"
        name="newComment"
        id="newComment"
        rows={2}
        cols={40}
      />
      <button type="submit">Add Comment</button>
    </form>
  );
}

export default function Post() {
  const { postId } = useParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const { user } = useOutletContext();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const jwt = localStorage.getItem("authToken");
    const backendAddress =
      import.meta.env.VITE_BACKEND_ADDRESS || 'http://localhost:8080';
    const fetchPost = async () => {
      try {
        const response = await fetch(`${backendAddress}/posts/${postId}`, {
          signal,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        if (!response.ok) {
          throw new Error("Fetch error");
        }
        console.log(response);
        const postData = await response.json();
        console.log(postData);
        setPost(postData);
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

  const onNewComment = (comment) => {
    setPost((prevPost) => ({
      ...prevPost,
      comments: [...prevPost.comments, comment],
    }));
  };

  return (
    <div className={`post ${styles.postContainer}`}>
      <div className={`blogPost ${styles.post}`}>
        <h1 className={styles.title}>{post.title}</h1>
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: post.message }}
        ></div>
      </div>
      <div className={styles.comments}>
        {user ? (
          <NewCommentForm postId={postId} onNewComment={onNewComment} />
        ) : (
          <div className={styles.whiteText}>Login to add comments!</div>
        )}
        {post.comments.length < 1 ? (
          <p className={styles.comment}>No comments yet.</p>
        ) : (
          <Comments commentsData={post.comments} />
        )}
      </div>
    </div>
  );
}
