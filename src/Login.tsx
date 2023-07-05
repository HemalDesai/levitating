import React, { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

interface LoginResponse {
  authToken: string;
}

interface LoginProps {
  setToken: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "https://x8ki-letl-twmt.n7.xano.io/api:XooRuQbs/auth/login",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.ok) {
        const data: LoginResponse = await response.json();
        const { authToken } = data;

        setLoginStatus("Login successful!");
        setToken(authToken);

        // Perform further actions like saving the auth token or redirecting the user
        navigate("/homepage");
      } else {
        setLoginStatus("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setLoginStatus("An error occurred during login. Please try again later.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundColor: "#99afff",
        backgroundImage:
          "radial-gradient(at 20% 33%, hsla(149,98%,77%,1) 0px, transparent 50%),\nradial-gradient(at 13% 89%, hsla(270,95%,77%,1) 0px, transparent 50%),\nradial-gradient(at 40% 87%, hsla(305,73%,72%,1) 0px, transparent 50%),\nradial-gradient(at 53% 95%, hsla(158,74%,60%,1) 0px, transparent 50%),\nradial-gradient(at 80% 47%, hsla(327,92%,66%,1) 0px, transparent 50%),\nradial-gradient(at 43% 5%, hsla(348,69%,75%,1) 0px, transparent 50%),\nradial-gradient(at 60% 65%, hsla(133,63%,67%,1) 0px, transparent 50%)",
      }}
    >
      <div className="max-w-md w-full p-6 bg-blue-50 rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <div className="mb-4">
          <label htmlFor="email" className="text-sm font-medium">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            className="border border-gray-300 px-3 py-2 rounded-sm w-full mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="text-sm font-medium">
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            className="border border-gray-300 px-3 py-2 rounded-sm w-full mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded-md focus:outline-none hover:bg-blue-600"
        >
          Login
        </button>
        {loginStatus && <p className="mt-2 text-red-500">{loginStatus}</p>}
      </div>
    </div>
  );
};

export default Login;
