import { useState } from "react";
import Textfield from "../Common/Textfield";

function LoginForm({ handleLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      onSubmit={(e) => handleLogin(e, email, password)}
      className="space-y-4 border p-4 rounded"
    >
      <Textfield
        type="email"
        labelText="Email Address"
        placeholder="you@example.com"
        data={email}
        setData={setEmail}
      />

      <Textfield
        type="password"
        labelText="Password"
        placeholder="••••••••"
        data={password}
        setData={setPassword}
      />

      <button
        type="submit"
        className="border px-4 py-2 rounded"
      >
        Submit
      </button>
    </form>
  );
}

export default LoginForm;