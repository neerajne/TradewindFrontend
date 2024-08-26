import React, { useState } from "react";
import axios from "axios";
import "./AuthPage.css";
import { Bounce, Slide, toast } from "react-toastify";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export const SignUp = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const { user, setUser } = useUserContext();
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSuccessfulAuth = (userData) => {
    const dashboardUrl = new URL("https://dashboardtradewind.netlify.app/");
    dashboardUrl.searchParams.append("token", userData.token);
    window.location.href = dashboardUrl.toString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignUp ? "signUp" : "login";

    try {
      const response = await axios.post(
        `https://tradewindbackend.onrender.com/user/${endpoint}`,
        userInfo
      );
      const result = response.data;
      sessionStorage.setItem("userInfo", JSON.stringify(result));
      setUser(result);

      if (result && result.token) {
        handleSuccessfulAuth(result);
      } else {
        navigate("/");
      }

      toast.success(`${isSignUp ? "Signed up" : "Logged in"} successfully`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
      });

      setUserInfo({});
      e.target.reset();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  return (
    <div className="auth-container pt-5 pb-5">
      <div className="form-container">
        <h2>{isSignUp ? "Sign Up" : "Log in"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <i className="bi bi-envelope"></i>
            <input
              type="text"
              placeholder="email"
              name="email"
              onChange={inputChangeHandler}
            />
          </div>
          <div className="input-container">
            <i className="bi bi-lock"></i>
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={inputChangeHandler}
            />
          </div>
          <button type="submit" className="btn">
            {isSignUp ? "Sign Up" : "Login"}
          </button>
          <div className="switch-link">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <span onClick={toggleForm}>Log in</span>
              </>
            ) : (
              <>
                Create a new account? <span onClick={toggleForm}>Sign Up</span>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
