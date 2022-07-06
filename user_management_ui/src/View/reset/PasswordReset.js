import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { setMyEmail } from "../../features/user/UserSlice";
// import App from "../../App";
const axios = require("axios").default;

function PasswordReset() {
  const [userData, setUserData] = useState({ username: "" });
  const [isVerified, setIsVerfied] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ value: "" });
  const dispatch = useDispatch();
  const history = useHistory();
  const [isloading, setIsloading] = useState(false);
  const API_URL = useSelector((state) => state.userInfo.url_api);
  const [hideBtn,setHideBtn]=useState(false);

  const handleInputChange = (e) => {
    setUserData((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
    if (isValideEmail(userData.username)) {
      setIsVerfied(true);
    }
  };
  const isValideEmail = (input) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input)) {
      return true;
    }
    setIsVerfied(false);
    return false;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const em = userData.username;
    if (userData.username === "") {
      setErrorMessage((prevState) => ({
        value: "Empty username field",
      }));
    } else {
      setIsloading(true);
      axios
        .get(`${API_URL}/auth/email/forgot-password/${userData.username}`)
        .then((response) => {
          // setIsloading(false);
          if(response.data.success){
            setHideBtn(true);
          dispatch(setMyEmail({ em }));
          setErrorMessage((prevState) => ({
            value:"Please check your email and confirm",
          }));
          }
        })
        .catch((error) => {
          setIsloading(false);
          setErrorMessage((prevState) => ({
            value: error.toJSON().message,
          }));
        });
      // setIsVerfied(true);
      // setErrorMessage({ value: "" });
    }
  };

  return (
    <div className=" container-fluid">
      <div className="row">
        <div className="col-3"></div>
        <div className="col-5 mt-5  p-5">
          <div className=" card">
            <div className=" card-header p-3 bg-primary">
              <h1
                style={{ fontSize: 24, fontWeight: 300, letterSpacing: -0.5 }}
              >
                Reset your password
              </h1>
            </div>
            <div className=" card-body">
              {!hideBtn &&(<><form className="">
                <div className="form-group">
                  <p className="" style={{ fontWeight: 600 }}>
                    Enter your user account's verified email address and we will
                    send you a password reset link.
                  </p>
                  <input
                    className="form-control border border-1"
                    type="email"
                    name="username"
                    value={userData.username}
                    placeholder="Enter your email address"
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
                <div className="form-group my-3 d-flex justify-content-center">
                  {/* <h2 class="f4 mb-3">Verify your account</h2> */}
                  {isVerified ? (
                    <div className=" text-success d-flex flex-justify-center flex-items-center width-full">
                      <svg
                        height="64"
                        aria-label="Account has been verified. Please continue."
                        role="img"
                        viewBox="0 0 24 24"
                        version="1.1"
                        width="64"
                        data-view-component="true"
                        className="octicon octicon-check color-fg-success"
                      >
                        <path
                          fillRule="evenodd"
                          d="M21.03 5.72a.75.75 0 010 1.06l-11.5 11.5a.75.75 0 01-1.072-.012l-5.5-5.75a.75.75 0 111.084-1.036l4.97 5.195L19.97 5.72a.75.75 0 011.06 0z"
                        ></path>
                      </svg>
                    </div>
                  ) : (
                    <img
                      src="spinner1.gif"
                      className="img-fluid w-50"
                      alt="spinner"
                    ></img>
                  )}
                </div>
                <div className="form-group justify-content-center d-flex flex-column">
                  {isVerified && (
                    <button
                      type="submit"
                      className="btn btn-success p-3 btn-sm btn-block p-1"
                      onClick={handleSubmit}
                      disabled={isloading ? "disabled" : ""}
                    >
                      Send password reset email
                    </button>
                  )}
                  {isloading && (
                    <span className="text-warning"> Please wait ...</span>
                  )}
                  <a href="/signin" className=" btn btn-link">
                    Back to Signin
                  </a>
                </div>

                {errorMessage.value && (
                  <p className="text-danger"> {errorMessage.value} </p>
                )}
              </form></>)}
              {hideBtn &&(<><h1>Please check your email and confirm </h1></>)}
              
            </div>
          </div>
        </div>
        <div className="col-4"></div>
      </div>
    </div>
  );
}

export default PasswordReset;
