// import { useState } from 'react'
import styles from "./Header.module.css"
import { Link } from 'react-router'

function App() {
  // const [count, setCount] = useState(0)

  return (
   <header className={styles.header}>
    <h1 className="logo">Rely's Blog</h1>
    <div className={`links ${styles.headerLinks}`}>
      <Link to="/">Home</Link>
      <Link to="/posts">Posts</Link>
    </div>
   </header> 
  )
}

export default App
