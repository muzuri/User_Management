import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLogedIn } from "./../../features/user/UserSlice";
import { getUrlVars } from "./../../utils/functions";

const axios = require("axios").default;

export default function UpdatePassword() {
  const [userData, setUserData] = useState({ password: "", cpassword: "" });
  const [errorMessage, setErrorMessage] = useState({ value: "" });
  const [isloading, setIsloading] = useState(false);
  const API_URL = useSelector((state) => state.userInfo.url_api);
  const my_email = useSelector((state) => state.userInfo.myEmail);
  const token = getUrlVars()["token"];
  if (typeof token === "undefined") {
    window.location.pathname = "/home";
    return;
  }

  const handleInputChange = (e) => {
    // dispatch(increment());
    setUserData((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    //if username or password field is empty, return error message
    if (userData.password === "") {
      setErrorMessage((prevState) => ({
        value: "Empty new password field",
      }));
    } else {
      // send
      setIsloading(true);
      // console.log(my_email.em, userData.password,token);
      axios
        .post(`${API_URL}/auth/email/reset-password`, {
          email: my_email.em,
          newPassword: userData.password,
          newPasswordToken:token,
        })
        .then((response) => {
          setIsloading(false);
          if(response.data.success){
            setErrorMessage((prevState) => ({
              value: response.data.message,
            }));
            setTimeout(() => {
              window.location.pathname = "/signin";
            }, 1000);
          // 
          }
        })
        .catch((error) => {
          setIsloading(false);
          setErrorMessage((prevState) => ({
            value: error.toJSON().message,
          }));
        });
    }
  };
  return (
    <div className=" container-fluid">
      <div className="row">
        <div className="col-md-4"></div>
        <div className="col-md-4 mt-5 p-5">
          <div className=" card">
            <div className=" card-header p-3 bg-primary">
              <h2 className="mb-3">Change your password</h2>
            </div>
            <div className="card-body">
              <form className="">
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    className="form-control"
                    type="password"
                    name="password"
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
                {/* <div className="form-group mb-3">
                  <div className=" d-flex flex-row align-items-center justify-content-between">
                    <label>Confirm Password</label>
                  </div>
                  <input
                    className="form-control"
                    type="password"
                    name="cpassword"
                    onChange={(e) => handleInputChange(e)}
                  />
                </div> */}
                <div className="form-group">
                  {!isloading && (
                    <button
                      type="submit"
                      className="btn btn-success p-3 btn-sm btn-block w-100"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  )}
                  {isloading && (
                    <span className="text-warning">Wait moment ...</span>
                  )}
                </div>

                {errorMessage.value && (
                  <div className="form-group mt-2">
                    <p className="text-danger"> {errorMessage.value} </p>
                  </div>
                )}
                <div className="form-group mt-3">
                  <p className="text-center border-1 border-gray p-3 border rounded">
                    New to User Account Management?
                    <a href="signup" className=" btn btn-link">
                      Create an account
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-4"></div>
      </div>
    </div>
  );
}
