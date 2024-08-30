import React, { useState } from "react";
import Robot from "../Components/Robot";
import "./Login.css";
import { Link } from "react-router-dom";

function Signup({ signup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const credentials = {
      name,
      email,
      password,
    };

    signup(credentials);
  }

  return (
    <div className="FormWrapper">
      <div className="Form">
        <div className="imageWrapper">
          <div className="imageContainer">
            <Robot />
            <span>notyourregularAI</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} class="form">
          <p id="heading">Signup</p>
          <div class="field">
            <svg
              class="icon"
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2.5a5.5 5.5 0 0 1 3.096 10.047 9.005 9.005 0 0 1 5.9 8.181.75.75 0 1 1-1.499.044 7.5 7.5 0 0 0-14.993 0 .75.75 0 0 1-1.5-.045 9.005 9.005 0 0 1 5.9-8.18A5.5 5.5 0 0 1 12 2.5ZM8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z"></path>
            </svg>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              autocomplete="off"
              placeholder="Username"
              class="input-field"
              type="text"
            />
          </div>
          <div class="field">
            <svg
              class="input-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"></path>
            </svg>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autocomplete="off"
              placeholder="E-mail"
              class="input-field"
              type="text"
            />
          </div>
          <div class="field">
            <svg
              class="input-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
            </svg>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Password"
              class="input-field"
              type="password"
            />
          </div>
          <div class="btn">
            <Link to="/login">
              <button class="button1">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Login&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </button>
            </Link>

            <button type="submit" class="button2">
              Sign Up
            </button>
          </div>
          <button class="button3">Forgot Password</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
