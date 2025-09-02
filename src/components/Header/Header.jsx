import styles from "./Header.module.css"
import { Link, Outlet } from 'react-router'

function App() {  
  return (
  <>
   <header className={styles.header}>
    <h1 className="logo">Rely's Blog</h1>
    <div className={`links ${styles.headerLinks}`}>
      <Link to="/">Home</Link>
      <Link to="/posts">Posts</Link>
      <Link to="/login">Log In</Link>
    </div>
   </header>
   <main>
    <Outlet />
   </main>
   </>
  )
}

export default App
