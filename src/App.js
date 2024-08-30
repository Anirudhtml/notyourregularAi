import { useContext, useEffect, useState } from "react";
import "./App.css";
import Header from "./Components/Header";
import { Routes, Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import { AuthContext } from "./Context/Context";
import Loading from "./Components/Loading";
import Sidebar from "./Pages/Sidebar";
import Logo from "./Components/logo";
import Hamburger from "./Components/Hamburger";
import ChatSection from "./Components/Chat_section";
import ChatPreview from "./Components/Chatpreview";
import Toggle from "./Components/DarkToggle";

function App() {
  const [showSideBar, setSidebar] = useState(true);
  const [mode, setMode] = useState(localStorage.getItem("mode") || "dark");

  useEffect(() => {
    localStorage.setItem("mode", mode)
    document.documentElement.className = mode
  }, [mode])

  const handleHamburger = () => {
    setSidebar(!showSideBar);
  };

  const {
    setUser,
    user,
    login,
    logout,
    signup,
    loading,
    isLoggedIn,
    chat,
    fetchChat,
    handleDelete,
  } = useContext(AuthContext);

  return (
    <div className={`App ${showSideBar ? "hide" : ""} ${mode}`}>
        <div className="LeftBarContainer">
          <div className="logoAndHamburger">
            <Logo />
            <Hamburger handleHamburger={handleHamburger} />
            <Toggle setMode={setMode} />
          </div>
          <div className="LeftBar">
            <Sidebar
              handleDelete={handleDelete}
              fetchChat={fetchChat}
              chat={chat}
              user={user}
              showSideBar={showSideBar}
            />
          </div>
        </div>
        <div className="RightBar">
          <Header isLoggedIn={isLoggedIn} logout={logout} />
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <ChatSection setUser={setUser} user={user} />
                ) : (
                  <Homepage />
                )
              }
            />
            <Route path="/Login" element={<Login login={login} />} />
            <Route path="/Signup" element={<Signup signup={signup} />} />
            <Route
              path="/user/chat/:id"
              element={<ChatPreview chat={chat} />}
            />
          </Routes>
        </div>
        {loading && <Loading />}
    </div>
  );
}

export default App;
