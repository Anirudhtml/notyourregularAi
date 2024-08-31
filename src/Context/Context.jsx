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
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  // Clear error message after 3 seconds
  useEffect(() => {
    if (err) {
      const timer = setTimeout(() => {
        setErr(null);
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [err]);

  // Set token if available in localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setisLoggedIn(true);
    }
  }, []);

  // Fetch user profile if logged in
  useEffect(() => {
    if (isLoggedIn) {
      setLoading(true);
      axios
        .get("https://notyourregularai-a10447bffa4b.herokuapp.com/user/profile")
        .then(({ data }) => {
          if (data.ok) {
            setUser(data);
          } else {
            setUser(null);
            setisLoggedIn(false);
            localStorage.removeItem("token");
          }
        })
        .catch((err) => {
          console.log(err);
          setUser(null);
          setisLoggedIn(false);
          localStorage.removeItem("token");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isLoggedIn]);

  // Handle user login
  async function login(credentials) {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://notyourregularai-a10447bffa4b.herokuapp.com/user/login",
        credentials
      );
      const data = response.data;

      if (data.ok) {
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        setUser({
          email: credentials.email,
          name: data.name,
        });
        setisLoggedIn(true);
        navigate("/");
      } else {
        console.log("Could not fetch the data", data.message);
        setisLoggedIn(false);
        setErr("Check your credentials again");
      }
    } catch (err) {
      console.log("ERROR logging in", err);
    } finally {
      setLoading(false);
    }
  }

  // Handle user logout
  async function logout() {
    setLoading(true);
    try {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      setisLoggedIn(false);
    } catch (err) {
      console.log("ERROR logging out", err);
    } finally {
      setLoading(false);
      navigate("/login");
    }
  }

  // Fetch chat data based on user ID
  async function fetchChat(id) {
    try {
      const response = await axios.get(
        `https://notyourregularai-a10447bffa4b.herokuapp.com/user/chat/${id}`
      );
      if (response.data.ok) {
        setChat(response.data.chat.chats);
      } else {
        setErr("No data found");
        console.log("No data found");
      }
    } catch (err) {
      console.log("Fetching error", err);
    }
  }

  // Handle user signup
  async function signup(credentials) {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://notyourregularai-a10447bffa4b.herokuapp.com/user/signup",
        credentials
      );
      const data = response.data;

      if (data.ok) {
        navigate("/login");
      } else {
        console.log(data.message);
        setErr(data.message);
      }
    } catch (err) {
      console.log("ERROR signing up", err);
    } finally {
      setLoading(false);
    }
  }

  // Handle chat deletion
  async function handleDelete(id) {
    setLoading(true);
    try {
      const response = await axios.delete(
        `https://notyourregularai-a10447bffa4b.herokuapp.com/user/delete/${id}`
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
