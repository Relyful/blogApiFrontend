import styles from "./Header.module.css";
import { Link, Outlet, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import Footer from "../Footer/Footer";

function App() {
  const [user, setUser] = useState(undefined);
  const navigate = useNavigate();
  let jwt = localStorage.getItem("authToken");
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const backendAddress =
      import.meta.env.VITE_BACKEND_ADDRESS || 'http://localhost:8080';
    if (jwt) {
      async function authUser() {
        try {
          const response = await fetch(`${backendAddress}/auth`, {
            signal,
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });
          if (!response.ok) {
            localStorage.removeItem("authToken");
            setUser(undefined);
            throw new Error("Auth failed");
          }
          const data = await response.json();
          setUser(data.user);
        } catch (err) {
          if (err.name === "AbortError") {
            console.log("Request aborted");
          } else {
            console.log(err);
          }
        }
      }
      console.log("hehtest");
      authUser();
    }
    return () => controller.abort();
  }, [jwt]);

  function logout() {
    localStorage.removeItem("authToken");
    jwt = null;
    setUser(undefined);
    navigate('/');
  }

  return (
    <>
      <header className={styles.header}>
        <Link to='/' className={`logo ${styles.logo}`}><h2>Rely's Blog</h2></Link>
        <div className={`links ${styles.headerLinks}`}>
          <Link className={styles.linkContent} to="/">Home</Link>
          <Link className={styles.linkContent} to="/posts">Posts</Link>
          {user ? (
            <>
              <span className={styles.linkContent}>Username: {user.username}</span>
              <span className={styles.linkContent} onClick={logout}>Logout</span>
            </>
          ) : (
            <>
            <Link className={styles.linkContent} to="/register">Register</Link>
            <Link className={styles.linkContent} to="/login">Log In</Link>
            </>
          )}
        </div>
      </header>
      <main>
        <Outlet context={{user, setUser}} />
      </main>
      <Footer />
    </>
  );
}

export default App;
