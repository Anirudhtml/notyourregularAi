import React from "react";
import './typing.css';

const TypingIndicator = () => {
  return (
    <div className="typing-indicator">
      <div className="bubble">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
};

export default TypingIndicator;
