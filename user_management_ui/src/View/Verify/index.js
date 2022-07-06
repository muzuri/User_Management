import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
const axios = require("axios").default;

function Verify() {
  const [userData, setUserData] = useState({ docType: "", doc: "",docImageUrl:"" });
  const [docImage, setDocImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState({ value: "" });
  const [isloading, setIsloading] = useState(false);
  const _user = useSelector((state) => state.userInfo.logedIn);
  const history = useHistory();
  const API_URL = useSelector((state) => state.userInfo.url_api);

  const handleInputChange = (e) => {
    setUserData((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
  };
  const onFileChange = (event) => {
    setDocImage(event.target.files[0]);
  };
  const sendDoc=async()=>{
    if (docImage) {
    const formData = new FormData();
    formData.append("profile_image", docImage);
    axios
    .post(`${API_URL}/upload`, formData)
    .then((response) => {
      setUserData((prevState)=>{
        return {...prevState,docImageUrl:response.data.url};
      });
      axios
      .post(`${API_URL}/user/submitDocument`,{
        documentType:userData.docType,
        nationalIdNumber:userData.doc,
        doc_image:userData.docImageUrl,
        email:_user.data.user.email
      })
      .then((response) => {
        console.log(response);
        setIsloading(false);
        setErrorMessage((prevState) => ({
          value:
            "Your document has been submited please wait account verification",
        }));
        setTimeout(() => {
          // history.push("/home");
        }, 1000);
      })
      .catch((error) => {
        setIsloading(false);
        setErrorMessage((prevState) => ({
          value: error.toJSON().message,
        }));
      });
    })
    .catch((error) => {
      setUserData((prevState)=>{
        return {...prevState,docImageUrl:""};
      })
      setErrorMessage((prevState) => ({
        value: JSON.stringify(error),
      }));
    });
  }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsloading(true);
    // send request
     sendDoc();
 
  
  };

  return (
    <div className=" container-fluid">
      <div className="row">
        <div className="col-4"></div>
        <div className="col-4 mt-5 p-5">
          <div className="card">
            <div className=" card-header  p-3 bg-primary">
              <h2 className="mb-3">Account Verifications</h2>
            </div>
            <div className=" card-body">
              <form className="">
                <div className=" form-group">
                  <label>Document Type</label>
                  <select
                    name="docType"
                    className=" form-control"
                    value={userData.docType}
                    onChange={(e) => handleInputChange(e)}
                  >
                    <option value="">__select__</option>
                    <option value="NID">NID</option>
                    <option value="PASSPORT">Passport</option>
                  </select>
                </div>
                <div className=" form-group">
                  <label>Document</label>
                  <input
                    type="text"
                    name="doc"
                    placeholder="document ..."
                    className="form-control"
                    value={userData.doc}
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
                <div className=" form-group">
                  <label>Document Image</label>
                  <input
                    type="file"
                    name="docImage"
                    className="form-control"
                    accept="images/*"
                    onChange={(e) => onFileChange(e)}
                  />
                </div>
                <div className="form-group">
                  <button
                    type="submit"
                    className="btn btn-success p-3 btn-sm btn-block w-100"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                  {isloading && (
                    <span className="text-warning">Please wait ...</span>
                  )}
                </div>

                {errorMessage.value && (
                  <div className="form-group mt-2">
                    <p className="text-danger"> {errorMessage.value} </p>
                  </div>
                )}
                <div className="form-group mt-3">
                  <p className="text-center border-1 border-gray p-3 border rounded">
                    <a href="/" className=" btn btn-link">
                      Back to home
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

export default Verify;
