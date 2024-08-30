import React, { useEffect, useState } from "react";
import "./ChatBox.css";
import TypingIndicator from "./typing";

function ChatBox({ user, isTyping }) {
  const [greet, setGreet] = useState("");

  useEffect(() => {
    const greetUser = () => {
      const time = new Date().getHours();
      if (time < 12) {
        setGreet("Good Morning");
      } else if (time < 18) {
        setGreet("Good Afternoon");
      } else {
        setGreet("Good Evening");
      }
    };

    greetUser();
  }, [])

  if (!user || !user.user || !user.user.chatHistory) {
    return <div>{""}</div>;
  }

  return (
    <div className="ChatBox">
      <div className="ChatBox">
        <div className="ChatWrapper">
          {user.user.chatHistory.length > 0 ? (
            <>
              {user.user.chatHistory.map((chat, index) => (
                <div key={index} className={`chat ${chat.role}`}>
                  <div className={`textWrapper ${chat.role}text`}>
                    {chat.role === "assistant" ? <img className="ai-img" src="/assets/chat_img.jpg" /> : ""}
                    <li className="user-chat">{chat.content}</li>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="typing-animation">
                  <TypingIndicator />
                </div>
              )}
            </>
          ) : (
            <>
              <div className="userName">
                {user ? `Hey ${user.name}, ${greet}.` : "Hello, Stranger."}
              </div>
              <span className="slogan">
                Ask away, because clearly, you’ve got nothing better to do.
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
