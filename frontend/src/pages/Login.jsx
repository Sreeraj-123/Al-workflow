import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/login", {
        email,
        password,
      });

      localStorage.setItem(
        "token",
        res.data.token
      );

      navigate("/requests");
    } catch (error) {
  console.log(error);
  console.log(error.response?.data);

  alert("Login Failed");
}
  };

  return (
    <div>
      <h1>Admin Login</h1>

      <input
        placeholder="Email"
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <br />

      <button onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}

export default Login;