export default function Register() {
  return (
    <>
      <h2>Join Rely's blog now!</h2>
      <form>
        <label htmlFor="username">Username: </label>
        <input type="text" name="username" id="username" required minLength={5} />
        <label htmlFor="password">Password: </label>
        <input type="password" name="password" id="password" />
        <label htmlFor="repeatPassword">Repeat Password: </label>
        <input type="password" name="repeastPassword" id="repeatPassword" />
      </form>
      {/* TODO: checkvalidity reportvalidity pouzi na overenie formy zacni s fetchom po validation */}
    </>
  )
}