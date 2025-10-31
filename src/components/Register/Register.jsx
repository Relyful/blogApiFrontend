import { useState } from "react";
import styles from "./Register.module.css";
import { useNavigate } from "react-router";

export default function Register() {
  const [error, setError] = useState();
  const navigate = useNavigate()

  async function handleRegisterForm(e) {
    e.preventDefault();
    const form = e.target;
    setError(``);
    console.log(form.elements.password);
    if (form.elements.username.value.length > 10 || form.elements.username.value.length < 4) {
      form.elements.username.setCustomValidity("Username too long or too short");
    } else {
      form.elements.username.setCustomValidity("");
    }
    if (form.elements.password.value !== form.elements.repeatPassword.value) {
      form.elements.repeatPassword.setCustomValidity("Passwords do not match!");
    } else {
      form.elements.repeatPassword.setCustomValidity("");
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
      return setError(responseData.error);
    };
    return navigate('/login');
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