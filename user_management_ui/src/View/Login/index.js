import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLogedIn } from "./../../features/user/UserSlice";
const axios = require("axios").default;
// import { useHistory } from "react-router-dom";

export default function Login() {
  const [userData, setUserData] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState({ value: "" });
  const [isloading, setIsloading] = useState(false);
  // const history = useHistory();
  const dispatch = useDispatch();
  const API_URL = useSelector((state) => state.userInfo.url_api);
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
    if (userData.username === "" || userData.password === "") {
      setErrorMessage((prevState) => ({
        value: "Empty username/password field",
      }));
      return;
    }
    setIsloading(true);
    axios
      .post(`${API_URL}/auth/email/login`, {
        email: userData.username,
        password: userData.password,
      })
      .then((response) => {
        setIsloading(false);
         const data=response.data.data;
        if(response.data.success){
          setIsloading(false);
        localStorage.setItem("isAuthenticated", "true");
        dispatch(setLogedIn({data}));
        window.location.pathname = "/home";
        }else{
          setErrorMessage((prevState) => ({
            value:"Login failedz",
          }));
        }
      })
      .catch((error) => {
        setIsloading(false);
        setErrorMessage((prevState) => ({
          value: error.toJSON().message,
        }));
      });
  };
  return (
    <div className=" container-fluid">
      <div className="row">
        <div className="col-md-4"></div>
        <div className="col-md-4 mt-5 p-5">
          <div className=" card">
            <div className=" card-header p-3 bg-primary">
              <h2
                className="mb-3"
                style={{ fontSize: 24, fontWeight: 300, letterSpacing: -0.5 }}
              >
                Signin
              </h2>
            </div>
            <div className="card-body">
              <form className="">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    className="form-control"
                    type="email"
                    name="username"
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
                <div className="form-group mb-3">
                  <div className=" d-flex flex-row align-items-center justify-content-between">
                    <label>Password</label>
                    <label>
                      <a className=" btn-link btn" href="password_reset">
                        Forgot password?
                      </a>
                    </label>
                  </div>
                  <input
                    className="form-control"
                    type="password"
                    name="password"
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
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
                  {isloading && <span>Wait moment ...</span>}
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
