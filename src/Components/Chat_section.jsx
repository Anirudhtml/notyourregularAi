import "./Chat_section.css";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import ChatBox from "./ChatBox";
import Popup from "./Popup";
import ExPrompt from "./ExPrompt";

const ChatSection = ({ user, setUser }) => {
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isClicked, setisClicked] = useState(false);
  const [title, setTitle] = useState("");

  // Wrap fetchChatHistory with useCallback
  const fetchChatHistory = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:4000/user/profile", {
        withCredentials: true,
      });

      if (response.data.ok) {
        setUser(response.data);
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
        const response = await axios.post(
          "http://localhost:4000/user/clear-chat",
          { title: title, chats: user.user ? user.user.chatHistory : [] },
          { withCredentials: true }
        );
        console.log(response.data);
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
      const response = await axios.post(
        "http://localhost:4000/user/query",
        { prompt: userInput },
        { withCredentials: true }
      );

      if (response.data.ok) {
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
        {user.user && user.user.chatHistory && user.user.chatHistory.length > 0 ? (
          ""
        ) : (
          <ExPrompt setIsTyping={setIsTyping} user={user} handleClick={handleClick} />
        )}
      </div>
    </>
  );
};

export default ChatSection;
