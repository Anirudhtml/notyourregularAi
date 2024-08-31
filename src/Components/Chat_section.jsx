import "./Chat_section.css";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import ChatBox from "./ChatBox";
import Popup from "./Popup";
import ExPrompt from "./ExPrompt";

const getAuthHeader = () => ({
  headers: { Authorization: localStorage.getItem("token") },
});

const ChatSection = ({ user, setUser }) => {
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isClicked, setisClicked] = useState(false);
  const [title, setTitle] = useState("");

  const fetchChatHistory = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://notyourregularai-a10447bffa4b.herokuapp.com/user/profile",
        getAuthHeader()
      );

      if (response.data.ok) {
        setUser(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  }, [setUser]);

  useEffect(() => {
    fetchChatHistory();
  }, [fetchChatHistory]);

  const handleNew = () => {
    setisClicked((prevState) => !prevState);
  };

  const handleTitleClick = async () => {
    setisClicked(false);
    if (title.length > 0) {
      try {
        const response = await axios.post(
          "https://notyourregularai-a10447bffa4b.herokuapp.com/user/clear-chat",
          { title: title, chats: user.user ? user.user.chatHistory : [] },
          getAuthHeader()
        );
        console.log(response.data);
        await fetchChatHistory();
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
        "https://notyourregularai-a10447bffa4b.herokuapp.com/user/query",
        { prompt: userInput },
        getAuthHeader()
      );

      if (response.data.ok) {
        setUserInput("");
        await fetchChatHistory();
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
