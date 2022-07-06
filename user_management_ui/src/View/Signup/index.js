import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
// import { createdAccount } from "../../features/user/UserSlice";
import {
  isValideEmail,
  testPassword,
  calculate_age,
} from "../../utils/functions";
const axios = require("axios").default;
// import App from "./../../App";

function Signup() {
  const [step, setStep] = useState({ s1: true, s2: false, s3: false });
  const [userData, setUserData] = useState({
    lastName: "",
    firstName: "",
    gender: "",
    birthDate: "",
    nationality: "__select__",
    maritalStatus: "",
  });
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [inputIsValide, setInputIsValide] = useState({
    password: "is-invalid",
    lastName: "is-invalid",
    firstName: "is-invalid",
    gender: "is-invalid",
    birthDate: "is-invalid",
    nationality: "is-invalid",
    maritalStatus: "is-invalid",
    email: "is-invalid",
  });
  const [email, setEmail] = useState("");
  const [isEmailExists, setIsEmailExists] = useState(false);
  const [hideBtn, setHideBtn] = useState({ s1: "", s2: "", s3: "" });
  const [passwordType, setPasswordType] = useState("password");
  // const [showSaveBtn, setShowSavebtn] = useState(false);
  const [isValidePassword, setIsValidePassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ value: "" });
  const countryList = useSelector((state) => state.userInfo.countryList);
  const API_URL = useSelector((state) => state.userInfo.url_api);
  const [isloading, setIsloading] = useState(false);
  const history = useHistory();

  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    let name=e.target.name;
    if(name=="birthDate"){
      let age=calculate_age(e.target.value);
      if(age<=0){
        userData.birthDate="";
        alert("Please enter correct date");
        return;
      }
    }
    setUserData((prevState) => {
      return {
        ...prevState,
        [name]: e.target.value,
      };
    });
    setInputIsValide((prevState) => {
      return { ...prevState, [e.target.name]: "is-valid" };
    });
  };
  const checkEmail = (input) => {
    setEmail(input);
    if (isValideEmail(input)) {
      setIsEmailExists(true);
      setInputIsValide((prevState) => {
        return { ...prevState, email: "is-valid" };
      });
      // setShowSavebtn(true);
    }
  };
  const validatePassword = (input) => {
    setPassword(input);
    setPasswordError(testPassword(input));
  };

  const onNext = (s = "s1", last = "s1") => {
    // validate email
    if(last=='s1'){
      axios
      .get(`${API_URL}/user/${email}`)
      .then((response) => {
        if( typeof response.data==="object"){
          setIsEmailExists(true);
          setInputIsValide((prevState) => {
            return { ...prevState, email: "is-invalid" };
          });
          setErrorMessage((prevState) => ({
            value: "Email already taken",
          }));
        }else{
          setStep((prevState) => {
            return { ...prevState, [s]: true };
        });
          setHideBtn((prevState) => {
            return { ...prevState, [last]: "d-none" };
           });
          setIsEmailExists(false);
          setInputIsValide((prevState) => {
            return { ...prevState, email: "is-valid" };
          });
          setErrorMessage((prevState) => ({
            value: "",
          }));
        }
        
      })
      .catch((err) => {
        console.log(err)
       setIsEmailExists(false);
       setInputIsValide((prevState) => {
        return { ...prevState, email: "is-invalid" };
      });
      });
    }else{
      setStep((prevState) => {
        return { ...prevState, [s]: true };
    });
      setHideBtn((prevState) => {
        return { ...prevState, [last]: "d-none" };
       });
    }

  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsloading(true);
       const age = calculate_age(userData.birthDate);
        axios.post(`${API_URL}/auth/email/register`,
        {first_name:userData.firstName,
          last_name:userData.lastName,
          email:email,
          password:password,
          martalStatus:userData.maritalStatus,
          nationality:userData.nationality,
          birthDate:userData.birthDate,
          age:age,
          gender:userData.gender
        }).then((response) => {
        setStep({ s1: true, s2: false, s3: false });
        setIsloading(false);
        setErrorMessage((prevState) => ({
          value: "Go to your email to confirm your email",
        }));
        setTimeout(() => {
          history.push("/signin");
        }, 1500);
      }).catch((error) => {
        setIsloading(false);
        setErrorMessage((prevState) => ({
          value: error.toJSON().message,
        }));
      });
  };

  return (
    <div className=" container-fluid">
      <div className="row">
        <div className="col-3"></div>
        <div className="col-5 mt-5  p-5">
          <div className=" card">
            <div className=" card-header  p-3 bg-primary">
              <h2 className="  mb-3" style={{ fontSize: 16 }}>
                Welcome to User account managment ! <br></br>
              </h2>
            </div>
            <div className="card-body">
              <form className="">
                {step.s1 && (
                  <div className="form-group">
                    <label className=" font-weight-bold">
                      Enter your Email
                    </label>
                    <div className=" d-flex flex-row justify-content-center w-100">
                      <input
                        className={"form-control " + inputIsValide.email}
                        type="text"
                        name="email"
                        value={email}
                        onChange={(e) => checkEmail(e.target.value)}
                      />
                      {isEmailExists && (
                        <button
                          className={
                            "btn btn-sm btn-success ml-2 " + hideBtn.s1
                          }
                          type="button"
                          onClick={() => onNext("s2", "s1")}
                        >
                          continue
                        </button>
                      )}
                    </div>
                  </div>
                )}
                {step.s2 && (
                  <div className="form-group row">
                    <div className="col-12">
                      <label>Create a Password</label>
                      <div className=" d-flex flex-row justify-content-center">
                        <input
                          type={passwordType}
                          name="password"
                          className=" form-control"
                          value={password}
                          onChange={(e) => {
                            validatePassword(e.target.value);
                            // handleInputChange(e);
                          }}
                        />
                        {passwordType === "password" ? (
                          <button
                            onClick={() => setPasswordType("text")}
                            className="btn btn-sm  btn-link"
                            type="button"
                            data-view-component="true"
                          >
                            {" "}
                            <svg
                              aria-hidden="true"
                              height="16"
                              viewBox="0 0 16 16"
                              version="1.1"
                              width="16"
                              data-view-component="true"
                              className="octicon octicon-eye"
                            >
                              <path
                                fillRule="evenodd"
                                d="M1.679 7.932c.412-.621 1.242-1.75 2.366-2.717C5.175 4.242 6.527 3.5 8 3.5c1.473 0 2.824.742 3.955 1.715 1.124.967 1.954 2.096 2.366 2.717a.119.119 0 010 .136c-.412.621-1.242 1.75-2.366 2.717C10.825 11.758 9.473 12.5 8 12.5c-1.473 0-2.824-.742-3.955-1.715C2.92 9.818 2.09 8.69 1.679 8.068a.119.119 0 010-.136zM8 2c-1.981 0-3.67.992-4.933 2.078C1.797 5.169.88 6.423.43 7.1a1.619 1.619 0 000 1.798c.45.678 1.367 1.932 2.637 3.024C4.329 13.008 6.019 14 8 14c1.981 0 3.67-.992 4.933-2.078 1.27-1.091 2.187-2.345 2.637-3.023a1.619 1.619 0 000-1.798c-.45-.678-1.367-1.932-2.637-3.023C11.671 2.992 9.981 2 8 2zm0 8a2 2 0 100-4 2 2 0 000 4z"
                              ></path>
                            </svg>
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-sm  btn-link"
                            onClick={() => setPasswordType("password")}
                          >
                            <svg
                              aria-hidden="true"
                              height="16"
                              viewBox="0 0 16 16"
                              version="1.1"
                              width="16"
                              data-view-component="true"
                              className="octicon octicon-eye-closed"
                            >
                              <path
                                fillRule="evenodd"
                                d="M.143 2.31a.75.75 0 011.047-.167l14.5 10.5a.75.75 0 11-.88 1.214l-2.248-1.628C11.346 13.19 9.792 14 8 14c-1.981 0-3.67-.992-4.933-2.078C1.797 10.832.88 9.577.43 8.9a1.618 1.618 0 010-1.797c.353-.533.995-1.42 1.868-2.305L.31 3.357A.75.75 0 01.143 2.31zm3.386 3.378a14.21 14.21 0 00-1.85 2.244.12.12 0 00-.022.068c0 .021.006.045.022.068.412.621 1.242 1.75 2.366 2.717C5.175 11.758 6.527 12.5 8 12.5c1.195 0 2.31-.488 3.29-1.191L9.063 9.695A2 2 0 016.058 7.52l-2.53-1.832zM8 3.5c-.516 0-1.017.09-1.499.251a.75.75 0 11-.473-1.423A6.23 6.23 0 018 2c1.981 0 3.67.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.619 1.619 0 010 1.798c-.11.166-.248.365-.41.587a.75.75 0 11-1.21-.887c.148-.201.272-.382.371-.53a.119.119 0 000-.137c-.412-.621-1.242-1.75-2.366-2.717C10.825 4.242 9.473 3.5 8 3.5z"
                              ></path>
                            </svg>
                          </button>
                        )}
                        {!isValidePassword && (
                          <button
                            className={
                              "btn btn-sm btn-success ml-2 " + hideBtn.s2
                            }
                            type="button"
                            onClick={() => onNext("s3", "s2")}
                          >
                            continue
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="col-12">
                      <p className={"mb-1 " + passwordError}>
                        Password is {passwordError}
                      </p>
                      <p>
                        Make sure it's <span>at least 15 characters</span> OR{" "}
                        <span>at least 8 characters</span>{" "}
                        <span>including a number</span>{" "}
                        <span>and a lowercase letter</span>.
                      </p>
                    </div>
                  </div>
                )}
                {step.s3 && (
                  <>
                    {" "}
                    <div className=" form-group row">
                      <div className="col-md-6">
                        <div className=" form-group">
                          <label>First Name</label>
                          <input
                            type="text"
                            name="firstName"
                            className={
                              "form-control " + inputIsValide.firstName
                            }
                            value={userData.firstName}
                            onChange={(e) => handleInputChange(e)}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className=" form-group">
                          <label>Last Name</label>
                          <input
                            type="text"
                            name="lastName"
                            className={"form-control " + inputIsValide.lastName}
                            value={userData.lastName}
                            onChange={(e) => handleInputChange(e)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className=" form-group row">
                      <div className="col-md-6">
                        <div className=" form-group">
                          <label>Gender</label>
                          <select
                            name="gender"
                            className={"form-control " + inputIsValide.gender}
                            value={userData.gender}
                            onChange={(e) => handleInputChange(e)}
                          >
                            <option value="">__select__</option>
                            <option value="male">Male</option>
                            <option value="female">female</option>
                            <option value="both">Both</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className=" form-group">
                          <label>Date of birth</label>
                          <input
                            type="date"
                            name="birthDate"
                            value={userData.birthDate}
                            className={
                              "form-control " + inputIsValide.birthDate
                            }
                            onChange={(e) => handleInputChange(e)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className=" form-group row">
                      <div className="col-md-6">
                        <div className=" form-group">
                          <label>Marital status</label>
                          <select
                            name="maritalStatus"
                            className={
                              "form-control " + inputIsValide.maritalStatus
                            }
                            onChange={(e) => handleInputChange(e)}
                            value={userData.maritalStatus}
                          >
                            <option value="">__select__</option>
                            <option value="SINGLE">SINGLE</option>
                            <option value="MARRIED">MARRIED</option>
                            <option value="DIVORCED">DIVORCED</option>
                            <option value="WIDOWED">WIDOWED</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className=" form-group">
                          <label>Nationality</label>
                          <select
                            name="nationality"
                            value={userData.nationality}
                            className={
                              "form-control " + inputIsValide.maritalStatus
                            }
                            onChange={(e) => handleInputChange(e)}
                          >
                            {countryList.map((c) => (
                              <option value={c} key={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {step.s3 && (
                  <div className="form-group">
                    <button
                      type="submit"
                      className="btn btn-success p-3 btn-sm btn-block w-100"
                      onClick={handleSubmit}
                      disabled={isloading?"disabled":""}
                    >
                      Register
                    </button>
                  </div>
                )}
                {isloading && (
                  <span className="text-warning">Please wait ...</span>
                )}

                {errorMessage.value && (
                  <div className="form-group mt-2">
                    <p className="text-danger"> {errorMessage.value} </p>
                  </div>
                )}
                <div className="form-group mt-3">
                  <p className="text-center border-0 p-3 border rounded">
                    Do you have account?
                    <a href="signin" className=" btn btn-link">
                      SignIn
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

export default Signup;
