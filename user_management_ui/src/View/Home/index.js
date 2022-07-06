// import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import "../../App.css";

function Home() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.pathname = "/signin";
  };
  const _user = useSelector((state) => state.userInfo.logedIn);
  return (
    <div className=" container-fluid">
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-8 mt-5 p-5">
          <div className="card">
            <div className="card-header bg-primary p-3">
              <div className="row">
                <div className="col-8">
                  <h3
                    className=" d-flex justify-content-center "
                  >
                    <span>Your Account is</span>
                   {_user.data.user.accountStatus=="UNVERIFIED" &&(<span className="badge bg-danger m-1 fs-2">UNVERIFIED</span>)} 
                   {_user.data.user.accountStatus=="PENDING_VERIFICATION" &&(<span className="badge bg-info fs-2">
                      PENDING VERIFICATION
                    </span>)} 
                    {_user.data.user.accountStatus=="VERIFIED" &&(<span className="badge bg-success fs-2">VERIFIED</span>)}
                    {_user.data.user.accountStatus!="VERIFIED" && (<a className="btn btn-warning   " href="/verify">
                      Account verification
                    </a>)}
                  </h3>
                </div>
                <div className="col-4">
                  {" "}
                 {_user.data.user.roles=='admin' &&(<a href="/users" className="btn btn-success float-end">users</a>)} 
                  <button
                    href="#"
                    className="btn btn-primary float-end "
                    onClick={() => handleLogout()}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <div className="card">
                    <div className=" card-body">
                      <div className="row">
                        <div className="col-12 d-flex flex-column p-1">
                          <img
                            src={_user.data.user.profile_image?_user.data.user.profile_image:"avatar.png"}
                            className="img-fluid w-100 border border-1"
                            alt="avatar"
                          />
                          <a
                            className="btn btn-primary btn-sm mt-2 p-2"
                            href="/change-profile"
                          >
                            change Now
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="row">
                    <div className="col-12">
                      <div className="card">
                        <div className=" card-body ">
                          <p className="h5">First Name: {_user.data.user.first_name}</p>
                        
                        </div>
                      </div>
                    </div>
                    <div className="col-12 mt-2">
                      <div className="card">
                        <div className=" card-body">
                          <p className="h5">Last Name:{_user.data.user.last_name}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 mt-2">
                      <div className="card">
                        <div className=" card-body">
                          <p className="h5">Gender:{_user.data.user.gender}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 mt-2">
                      <div className="card">
                        <div className=" card-body">
                          <p className="h5">Date of Birth:{_user.data.user.birthDate}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 mt-2">
                      <div className="card">
                        <div className=" card-body">
                          <p className="h5">Marital status:{_user.data.user.martalStatus}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 mt-2">
                      <div className="card">
                        <div className=" card-body">
                          <p className="h5">Nationality:{_user.data.user.nationality}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
