import styles from "./Header.module.css";
import { Link, Outlet } from "react-router";
import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(undefined);
  let jwt = localStorage.getItem("authToken");
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    if (jwt) {
      async function authUser() {
        try {
          const response = await fetch("http://localhost:8080/auth", {
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
  }

  return (
    <>
      <header className={styles.header}>
        <h1 className="logo">Rely's Blog</h1>
        <div className={`links ${styles.headerLinks}`}>
          <Link to="/">Home</Link>
          <Link to="/posts">Posts</Link>
          {jwt ? (
            <>
              <span>Username: {user.username}</span>
              <span onClick={logout}>Logout</span>
            </>
          ) : (
            <>
            <Link to="/register">Register</Link>
            <Link to="/login">Log In</Link>
            </>
          )}
        </div>
      </header>
      <main>
        <Outlet context={{user, setUser}} />
      </main>
    </>
  );
}

export default App;
