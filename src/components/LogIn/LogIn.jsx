import styles from "./LogIn.module.css"

export default function LogIn() {

  async function handleLogIn(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');
    console.log('E target');
    console.log(e.target);
    try {
      const requestBody = {username, password};
      const response = await fetch("http://localhost:8080/login", {method: 'POST', body: JSON.stringify(requestBody), headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}});
      if (!response.ok) {
        throw new Error('fetch error'); 
      };
      const responseData = await response.json();
      console.log(responseData)
    } catch (err) {
      console.error(err);
    }
  }

return (
  <>
    <h2>This is a login form</h2>
    <form action="" method="post" onSubmit={handleLogIn} className={`${styles.form}`}>
      <label htmlFor="username">Username: </label>
      <input type="text" name="username" id="username" />
      <label htmlFor="password">Password: </label>
      <input type="password" name="password" id="password" />
      <button type="submit">Submit</button>
    </form>
  </>
)
}