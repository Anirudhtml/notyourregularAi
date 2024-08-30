import React from "react";
import "./DarkToggle.css";

function Toggle({ setMode }) {
  return (
    <div>
      <label htmlFor="switch" className="switch">
        <input
          onChange={() => {
            setMode((prev) => (prev === "light" ? "dark" : "light"));
          }}
          id="switch"
          type="checkbox"
        />
        <span className="slider"></span>
        <span className="decoration"></span>
      </label>
    </div>
  );
}

export default Toggle;
