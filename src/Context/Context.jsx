import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../Components/Loading";
import Error from "../Components/Error";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [chat, setChat] = useState([]);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null)
  const navigate = useNavigate();
  
  useEffect(() => {
    if(err) {
      const timer = setTimeout(() => {
        setErr(null)
      }, 3000)

      return () => {
        clearTimeout(timer)
      }
    } 
  }, [err])

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(true);
      axios
        .get("https://notyourregularai-a10447bffa4b.herokuapp.com/user/profile", { withCredentials: true })
        .then(({ data }) => {
          if (data.ok) {
            setUser(data);
            setisLoggedIn(true);
          } else {
            setUser(null);
            setisLoggedIn(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setUser(null);
          setisLoggedIn(false);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isLoggedIn]);

  async function fetchChat(id) {
    try {
      const response = await axios.get(
        `https://notyourregularai-a10447bffa4b.herokuapp.com/user/chat/${id}`,
        { withCredentials: true }
      );
      if (response.data.ok) {
        setChat(response.data.chat.chats);
        console.log(chat);
      } else {
        setErr("no data found")
        console.log("no data found");
      }
    } catch (err) {
      console.log("fetching error");
    }
  }

  async function login(credentials) {
    setLoading(true);
    try {
      const response = await fetch("https://notyourregularai-a10447bffa4b.herokuapp.com/user/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (data.ok) {
        setUser({
          email: credentials.email,
          name: data.name,
          chatHistory: data.chatHistory,
        });
        setisLoggedIn(true);
        navigate("/");
        window.location.reload();
      } else {
        console.log("could not fetch the data", data.message);
        setisLoggedIn(false);
        setErr("Check your credentials again")
      }
    } catch (err) {
      console.log("ERROR logging in", err);
    } finally {
      setLoading(false);
    }
  }

  async function signup(credentials) {
    setLoading(true); // Start loading
    try {
      const response = await fetch("https://notyourregularai-a10447bffa4b.herokuapp.com/user/signup", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (data.ok) {
        navigate("/login");
      } else {
        console.log(data.message);
        setErr(data.message)
      }
    } catch (err) {
      console.log("ERROR signing up", err);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    try {
      const response = await axios.get("https://notyourregularai-a10447bffa4b.herokuapp.com/user/logout", {
        withCredentials: true,
      });

      if (response.data.ok) {
        setUser(null);
        setisLoggedIn(false);
      } else {
        console.log(response.data.message);
      }
    } catch (err) {
      console.log("ERROR logging out", err);
    } finally {
      setLoading(false);
      navigate("/login");
    }
  }

  async function handleDelete(id) {
    setLoading(true);
    try {
      const response = await axios.delete(
        `https://notyourregularai-a10447bffa4b.herokuapp.com/user/delete/${id}`,
        { withCredentials: true }
      );
  
      if (response.data.ok) {
        setUser((prevUser) => {
          const updatedChats = prevUser?.user?.savedChats?.filter(
            (chat) => chat._id !== id
          );

          return {
            ...prevUser,
            user: {
              ...prevUser.user,
              savedChats: updatedChats || [],
            },
          };
        });
      }
    } catch (err) {
      console.error("Error occurred while deleting", err);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <AuthContext.Provider
      value={{
        chat,
        fetchChat,
        user,
        login,
        signup,
        isLoggedIn,
        logout,
        loading,
        setUser,
        handleDelete,
      }}
    >
      {err && <Error errorText={err} />}
      {loading ? <Loading /> : children}
    </AuthContext.Provider>
  );
}
