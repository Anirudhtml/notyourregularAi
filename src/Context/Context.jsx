import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../Components/Loading";
import Error from "../Components/Error";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [chat, setChat] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();
  
  // Clear error message after 3 seconds
  useEffect(() => {
    if (err) {
      const timer = setTimeout(() => {
        setErr(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [err]);

  // Check if user is logged in when the component mounts
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
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
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.log(err);
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Fetch chat data based on user ID
  async function fetchChat(id) {
    try {
      const response = await fetch(
        `https://notyourregularai-a10447bffa4b.herokuapp.com/user/chat/${id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.ok) {
        setChat(data.chat.chats);
      } else {
        setErr("No data found");
        console.log("No data found");
      }
    } catch (err) {
      console.log("Fetching error", err);
    }
  }

  // Handle user login
  async function login(credentials) {
    setLoading(true);
    try {
      const response = await fetch(
        "https://notyourregularai-a10447bffa4b.herokuapp.com/user/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );
      const data = await response.json();

      if (data.ok) {
        setUser({
          email: credentials.email,
          name: data.name,
          chatHistory: data.chatHistory,
        });
        setIsLoggedIn(true);
        navigate("/"); // Navigate to the home page
      } else {
        console.log("Could not fetch the data", data.message);
        setIsLoggedIn(false);
        setErr("Check your credentials again");
      }
    } catch (err) {
      console.log("ERROR logging in", err);
      setErr("An error occurred while logging in");
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  }
  
  // Handle user signup
  async function signup(credentials) {
    setLoading(true);
    try {
      const response = await fetch(
        "https://notyourregularai-a10447bffa4b.herokuapp.com/user/signup",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      const data = await response.json();

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

  // Handle user logout
  async function logout() {
    setLoading(true);
    try {
      const response = await fetch(
        "https://notyourregularai-a10447bffa4b.herokuapp.com/user/logout",
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();

      if (data.ok) {
        setUser(null);
        setIsLoggedIn(false);
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log("ERROR logging out", err);
    } finally {
      setLoading(false);
      navigate("/login");
    }
  }

  // Handle chat deletion
  async function handleDelete(id) {
    setLoading(true);
    try {
      const response = await fetch(
        `https://notyourregularai-a10447bffa4b.herokuapp.com/user/delete/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await response.json();

      if (data.ok) {
        setUser((prevUser) => {
          const updatedChats = prevUser?.savedChats?.filter(
            (chat) => chat._id !== id
          );

          return {
            ...prevUser,
            savedChats: updatedChats || [],
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
