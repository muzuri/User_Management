import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { changeProfilePicture } from "../../features/user/UserSlice";

function ChangeProfile() {
  const [docImage, setDocImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState({ value: "" });
  const API_URL = useSelector((state) => state.userInfo.url_api);
  const [isloading, setIsloading] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const axios = require("axios").default;
  const _user = useSelector((state) => state.userInfo.logedIn);

  const onFileChange = (event) => {
    setDocImage(event.target.files[0]);
  };

  const updateProfileDb=(url)=>{
    setIsloading(false);
    const email=_user.data.user.email;
    axios
    .post(`${API_URL}/user/profile`,{email:email,photo_url:url})
    .then((response) => {
      setIsloading(true)
      setErrorMessage((prevState) => ({
        value: "Your profile has been changed",
      }));
      setTimeout(() => {
        history.push("/home");
      }, 1500);  

    }).catch((err)=>{

    })
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsloading(true);
    const formData = new FormData();
    if (docImage) {
      formData.append("profile_image", docImage);
    axios
        .post(`${API_URL}/upload`, formData)
        .then((response) => {
          setIsloading(false);
          // console.log(,"welcome")
          dispatch(changeProfilePicture(response.data.url));
          updateProfileDb(response.data.url);
        })
        .catch((error) => {
          setIsloading(false);
          setErrorMessage((prevState) => ({
            value: JSON.stringify(error),
          }));
        });
    }
  };

  return (
    <div className=" container-fluid">
      <div className="row">
        <div className="col-4"></div>
        <div className="col-4 mt-5 p-5">
          <div className="card">
            <div className=" card-header  p-3 bg-primary">
              <h2 className="mb-3">Profile picture modification</h2>
            </div>
            <div className=" card-body">
              <form className="">
                <div className=" form-group">
                  <label>Photos</label>
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
                    disabled={isloading?"disabled":""}
                  >
                    change
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

export default ChangeProfile;
