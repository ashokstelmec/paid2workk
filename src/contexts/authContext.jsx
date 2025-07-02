import React, { createContext, useState, useEffect, useContext } from "react";
import { Cookies, useCookies } from "react-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import { useChat } from "./chatContext";

// Create the AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { ensureConnection } = useChat();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const location = useLocation();
  const [refresh, setRefresh] = useState(false);
  const [currencies, setCurrencies] = useState([]);

  function clearAllCookies() {
    const cookie = new Cookies().getAll();
    Object.keys(cookie).forEach((cookieName) => {
      new Cookies().remove(cookieName, { path: "/" });
    });
  }

  const auth = localStorage.getItem("authentication");

  useEffect(() => {
    if (
      (!auth || auth === "false") &&
      (location.pathname === "/dashboard" || location.pathname === "/messages")
    ) {
      navigate("/login");
      return;
    }
    if (
      isLoggedIn &&
      (location.pathname === "/" ||
        location.pathname === "/dashboard" ||
        location.pathname === "/messages")
    ) {
      setRefresh(!refresh);
    }
  }, [location.pathname, auth]);

  useEffect(() => {
    const token = cookies.token;
    const verifyUser = async () => {
      const formData = new FormData();
      formData.append("LoginToken", token);
      const response = await fetch(
        "https://paid2workk.solarvision-cairo.com/Login",
        {
          method: "POST",
          body: formData,
        }
      );

      await ensureConnection();
      fetch(
        "https://paid2workk.solarvision-cairo.com/api/Projects_/GetActiveCurrency"
      )
        .then((response) => response.json())
        .then((data) => setCurrencies(data))
        .catch((error) => console.error("Error fetching currencies:", error));

      const lastRoute = localStorage.getItem("lastRoute");
      if (response.ok) {
        localStorage.setItem("authentication", true);
        setIsLoggedIn(true);
        const data = await response.json();
        const userData = data.user;
        // console.log("Verified Token!");
        // console.log(userData);
        setUser({
          username: userData.Username,
          skill: userData.Skill,
          nUserID: userData.nUserID,
          progress: userData.Progress,
          photoPath: userData.photopath,
          roleId: userData.roleId,
          email: userData.Email,
          currency: userData.CurrencyID,
          balance: userData.balance,
          contact: userData.PhoneNumber,
        });
        sessionStorage.setItem("username", userData.Username);
        sessionStorage.setItem("skill", userData.Skill);
        sessionStorage.setItem("NUserID", userData.nUserID);
        sessionStorage.setItem("progress", userData.Progress);
        sessionStorage.setItem("photoPath", userData.photopath);
        sessionStorage.setItem("roleId", userData.roleId);
        sessionStorage.setItem("currency", userData.CurrencyID);

        if (!auth && location.pathname === "/login") {
          navigate("/");
          setIsLoggedIn(true);

          localStorage.setItem("authentication", true);
        } else if (auth && location.pathname === "/login") {
          setIsLoggedIn(true);

          localStorage.setItem("authentication", true);
          navigate("/");
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
        navigate(lastRoute);
        localStorage.removeItem("authentication");
      }
      setLoading(false);
    };

    if (token) {
      verifyUser();
    } else {
      fetch(
        "https://paid2workk.solarvision-cairo.com/api/Projects_/GetActiveCurrency"
      )
        .then((response) => response.json())
        .then((data) => setCurrencies(data))
        .catch((error) => console.error("Error fetching currencies:", error));
      setLoading(false);
    }
  }, [refresh]);

  const login = (userData) => {
    sessionStorage.setItem("username", userData.username);
    sessionStorage.setItem("skill", userData.skill);
    sessionStorage.setItem("NUserID", userData.nUserID);
    sessionStorage.setItem("progress", userData.progress);
    sessionStorage.setItem("photoPath", userData.photoPath);
    sessionStorage.setItem("roleId", userData.roleId);
    sessionStorage.setItem("currency", userData.CurrencyID);

    fetch(
      "https://paid2workk.solarvision-cairo.com/api/Projects_/GetActiveCurrency"
    )
      .then((response) => response.json())
      .then((data) => setCurrencies(data))
      .catch((error) => console.error("Error fetching currencies:", error));

    setUser(userData);
    setIsLoggedIn(true);
  };

  const getCurrencySymbolName = (currencyId) => {
    const currency = currencies.find((c) => c.currency_Id === currencyId);
    return currency ? currency.currency : "INR";
  };

  const getCurrencySymbolId = (currencyId) => {
    const currency = currencies.find((c) => c.currency_Id === currencyId);
    return currency ? currency.symbol : "₹";
  };

  const logout = () => {
    window.location.href = "/";
    clearAllCookies();
    sessionStorage.clear();
    setUser(null);
    setIsLoggedIn(false);
    localStorage.setItem("authentication", false);
  };

  const updateUser = (newUserData) => {
    setUser(newUserData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        updateUser,
        login,
        logout,
        loading,
        isLoggedIn,
        getCurrencySymbolName,
        getCurrencySymbolId,
        currencies,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
