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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
      setisLoggedIn(true);
    }
  }, []);

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
        axios.defaults.headers.common["Authorization"] = data.token;
        setUser({
          email: credentials.email,
          name: data.name,
        });
        setisLoggedIn(true);
        navigate("/");
      } else {
        console.log("could not fetch the data", data.message);
        setisLoggedIn(false);
        setErr("Check your credentials again");
      }
    } catch (err) {
      console.log("ERROR logging in", err);
    } finally {
      setLoading(false);
    }
  }

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
