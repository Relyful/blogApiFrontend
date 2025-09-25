import { useState } from "react";

export default function Register() {
  const [error, setError] = useState();

  async function handleRegisterForm(e) {
    const form = e.target.form;
    console.log(form.elements.password);
    if (form.elements.password.value !== form.elements.repeatPassword.value) {
      form.elements.repeatPassword.setCustomValidity("Passwords do not match!");
    } else {
      form.elements.repeatPassword.setCustomValidity("");
    }
    if (!form.reportValidity()) {
      return;
    }
    e.preventDefault();
    const formData = new FormData(form);
    const username = formData.get('username');
    const password = formData.get('password');
    try {
      const requestBody = {username, password};
      const response = await fetch(`http://localhost:8080/register`, {
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
    } catch (err) {
      console.error(err);
    }
    
  }
  return (

    <>
      <h2>Join Rely's blog now!</h2>
      {error ? <>{`${error}`}</> : <></>}
      <form>
        <label htmlFor="username">Username: </label>
        <input type="text" name="username" id="username" required minLength={5} />
        <label htmlFor="password">Password: </label>
        <input type="password" name="password" id="password" />
        <label htmlFor="repeatPassword">Repeat Password: </label>
        <input type="password" name="repeatPassword" id="repeatPassword" />
        <button type="submit" onClick={handleRegisterForm}>Register</button>
      </form>
      {/* TODO: checkvalidity reportvalidity pouzi na overenie formy zacni s fetchom po validation */}
    </>
  )
}