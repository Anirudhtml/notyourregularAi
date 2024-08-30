import "./Chat_section.css";
import axios from "axios";
import { useState, useEffect } from "react";
import ChatBox from "./ChatBox";
import Popup from "./Popup";
import Loading from "./Loading";
import ExPrompt from "./ExPrompt";

const ChatSection = ({ user, setUser }) => {
  const [userInput, setUserInput] = useState("");
  const [fetching, setFetching] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isClicked, setisClicked] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const fetchChatHistory = async () => {
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
  };

  function handleNew() {
    setisClicked(!isClicked);
  }

  async function handleTitleClick() {
    setisClicked(false);
    if (title.length > 0) {
      const response = await axios.post(
        "http://localhost:4000/user/clear-chat",
        { title: title, chats: user.user ? user.user.chatHistory : [] },
        { withCredentials: true }
      );
      console.log(response.data);
      console.log(user);
      await fetchChatHistory();
    } else {
      alert("Enter the title");
    }
  }

  async function handleClick(userInput) {
    setFetching(true);
    setIsTyping(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/user/query",
        { prompt: userInput },
        { withCredentials: true }
      );

      if (response.data.ok) {
        setUserInput("");
        await fetchChatHistory();
        setIsTyping(false);
      }
    } catch (err) {
      console.log(err);
      setIsTyping(false);
    } finally {
      setFetching(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <>
      <ChatBox user={user} isTyping={isTyping} />
      <div className="chat-Input">
        <form onSubmit={handleSubmit} className="message-input">
          <input
            onChange={(e) => {
              setUserInput(e.target.value);
            }}
            value={userInput}
            type="text"
            autoComplete="off"
            name="text"
            className="input"
            placeholder="Go ahead..."
          />
          <button type="submit" onClick={() => handleClick(userInput)}>
            Ask
          </button>
          <button onClick={handleNew}>
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
