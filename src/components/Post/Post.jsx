// import styles from "./Post.module.css";
import { useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router";
import styles from "./Post.module.css";

function Comments({ commentsData, user, onRequestDelete }) {
  return (
    <>
      {commentsData.map((comment) => (
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
            {user?.id === comment.authorId && (
              <span className={styles.editMenu}>
                <button
                  onClick={() => onRequestDelete(comment.id)}
                  type="button"
                  className={styles.commentDeleteButton}
                >
                  Delete
                </button>
              </span>
            )}
          </p>
          <p className={styles.commentMessage}>{comment.message}</p>
        </div>
      ))}
    </>
  );
}

function NewCommentForm({ postId, onNewComment }) {
  async function handleNewComment(e) {
    e.preventDefault();
    const jwt = localStorage.getItem("authToken");
    const newComment = new FormData(e.target).get("newComment");
    const backendAddress =
      import.meta.env.VITE_BACKEND_ADDRESS || "http://localhost:8080";

    try {
      const response = await fetch(`${backendAddress}/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ message: newComment }),
        headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Error posting comment");

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
  const { user } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const jwt = localStorage.getItem("authToken");
    const backendAddress =
      import.meta.env.VITE_BACKEND_ADDRESS || "http://localhost:8080";

    async function fetchPost() {
      try {
        const response = await fetch(`${backendAddress}/posts/${postId}`, {
          signal: controller.signal,
          headers: { Authorization: `Bearer ${jwt}` },
        });
        if (!response.ok) throw new Error("Fetch error");

        const postData = await response.json();
        setPost(postData);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
    return () => controller.abort();
  }, [postId]);

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found.</p>;

  const onNewComment = (comment) => {
    setPost((prevPost) => ({
      ...prevPost,
      comments: [...prevPost.comments, comment],
    }));
  };

  const handleCommentDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    const backendAddress =
      import.meta.env.VITE_BACKEND_ADDRESS || "http://localhost:8080";
    const jwt = localStorage.getItem("authToken");
    
    const previousComments = post.comments;
    setPost((prevPost) => ({
      ...prevPost,
      comments: prevPost.comments.filter((c) => String(c.id) !== String(commentId)),
    }));
    try {
      const response = await fetch(
        `${backendAddress}/posts/${postId}/comments/${commentId}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${jwt}` } }
      );
      if (!response.ok) throw new Error("Error deleting comment");
    } catch (err) {
      console.error(err);
      alert("Failed to delete comment. Restoring previous state.");
      setPost((prevPost) => ({ ...prevPost, comments: previousComments }));
    }
  };

  return (
    <div className={`post ${styles.postContainer}`}>
      <div className={`blogPost ${styles.post}`}>
        <h1 className={styles.title}>{post.title}</h1>
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: post.message }}
        />
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
          <Comments
            commentsData={post.comments}
            user={user}
            onRequestDelete={handleCommentDelete}
          />
        )}
      </div>
    </div>
  );
}
