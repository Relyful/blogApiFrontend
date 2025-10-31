import { useState } from "react";
import styles from "./Register.module.css";
import { useNavigate } from "react-router";

export default function Register() {
  const [error, setError] = useState();
  const navigate = useNavigate()

  async function handleRegisterForm(e) {
    e.preventDefault();
    setError(``);
    const form = e.target;
    console.log(form.elements.password);
    const usernameInput = form.elements.username;
    console.log("Username:", usernameInput.value, "Length:", usernameInput.value.length);
    usernameInput.setCustomValidity("");
    if (usernameInput.value.length > 10 || usernameInput.value.length < 4) {
      usernameInput.setCustomValidity("Username too long or too short");
    }
    const repeatInput = form.elements.repeatPassword;
    repeatInput.setCustomValidity("");
    if (form.elements.password.value !== repeatInput.value) {
      repeatInput.setCustomValidity("Passwords do not match!");
    }
    if (!form.reportValidity()) {
      return;
    }
    const formData = new FormData(form);
    const username = formData.get('username');
    const password = formData.get('password');
    const backendAddress =
      import.meta.env.VITE_BACKEND_ADDRESS || 'http://localhost:8080';
    try {
      const requestBody = {username, password};
      const response = await fetch(`${backendAddress}/register`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      console.log(response);
      throw new Error('Error posting data to server');
    };
    const responseData = await response.json();
    if (responseData.error) {
      setError(responseData.error);
    };
    navigate('/login');
    } catch (err) {
      console.error(err);
    }
  }
  return (

    <div className={styles.register}>
      <div className={styles.registerContent}>
        <h2>Join Rely's blog now!</h2>
        {error ? <p className={styles.error}>{`${error}`}</p> : <></>}
        <form className={styles.mainForm} onSubmit={handleRegisterForm}>
          <label htmlFor="username">Username: </label>
          <input type="text" name="username" id="username" required />
          <label htmlFor="password">Password: </label>
          <input type="password" name="password" id="password" />
          <label htmlFor="repeatPassword">Repeat Password: </label>
          <input type="password" name="repeatPassword" id="repeatPassword" />
          <button type="submit" className={styles.button} >Register</button>
        </form>
      </div>
    </div>
  )
}