import "./Chat_section.css";
import { useState, useEffect, useCallback } from "react";
import ChatBox from "./ChatBox";
import Popup from "./Popup";
import ExPrompt from "./ExPrompt";

const ChatSection = ({ user, setUser }) => {
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isClicked, setisClicked] = useState(false);
  const [title, setTitle] = useState("");

  const fetchChatHistory = useCallback(async () => {
    try {
      const response = await fetch(
        "https://notyourregularai-a10447bffa4b.herokuapp.com/user/profile",
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();

      if (data.ok) {
        setUser(data);
      }
    } catch (err) {
      console.log(err);
    }
  }, [setUser]); // Only redefine if setUser changes

  useEffect(() => {
    fetchChatHistory();
  }, [fetchChatHistory]); // Now this won't trigger on every render

  const handleNew = () => {
    setisClicked((prevState) => !prevState);
  };

  const handleTitleClick = async () => {
    setisClicked(false);
    if (title.length > 0) {
      try {
        const response = await fetch(
          "https://notyourregularai-a10447bffa4b.herokuapp.com/user/clear-chat",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: title,
              chats: user.user ? user.user.chatHistory : [],
            }),
          }
        );
        const data = await response.json();
        console.log(data);
        await fetchChatHistory(); // Use the function here as well
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("Enter the title");
    }
  };

  const handleClick = async (userInput) => {
    setIsTyping(true);
    try {
      const response = await fetch(
        "https://notyourregularai-a10447bffa4b.herokuapp.com/user/query",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: userInput }),
        }
      );
      const data = await response.json();

      if (data.ok) {
        setUserInput("");
        await fetchChatHistory(); // Use the function here as well
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleClick(userInput);
  };

  return (
    <>
      <ChatBox user={user} isTyping={isTyping} />
      <div className="chat-Input">
        <form onSubmit={handleSubmit} className="message-input">
          <input
            onChange={handleInputChange}
            value={userInput}
            type="text"
            autoComplete="off"
            name="text"
            className="input"
            placeholder="Go ahead..."
          />
          <button type="submit">Ask</button>
          <button type="button" onClick={handleNew}>
            {isClicked ? `Cancel` : "Save and Clear"}
          </button>
        </form>

        {isClicked && (
          <Popup
            title={title}
            handleTitleClick={handleTitleClick}
            setTitle={setTitle}
            content={"Enter a title to save the Chat"}
          />
        )}
      </div>
      <div>
        {user.user &&
        user.user.chatHistory &&
        user.user.chatHistory.length > 0 ? (
          ""
        ) : (
          <ExPrompt
            setIsTyping={setIsTyping}
            user={user}
            handleClick={handleClick}
          />
        )}
      </div>
    </>
  );
};

export default ChatSection;
