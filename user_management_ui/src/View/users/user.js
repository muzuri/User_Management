
import { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { useHistory } from "react-router";
import { getAllUsers, setSelectedUser } from "../../features/user/UserSlice";
const axios = require("axios").default;
function User() {
  const selected=useSelector((state) => state.userInfo.selectedUser);
  useEffect(()=>{
    if(typeof selected.id =="undefined"){
        history.push("/home");
        return;
    }
  },[selected])
  const [isloading, setIsloading] = useState(false);
  const history=useHistory();
  const [accountStatus,setAccountStatus]=useState("");
  const API_URL = useSelector((state) => state.userInfo.url_api);
  const dispatch=useDispatch();
  
const back=()=>{
    dispatch(setSelectedUser({}));
    history.push("/users");
}
const handleAccountStatus=(value)=>{
    setIsloading(true);
const path=value=="VERIFIED"?"accountVerify":"accountUnverify";
  axios.post(`${API_URL}/user/${path}`,{email:selected.email}).then((response)=>{
    console.log(response);
    setAccountStatus(value);
    setIsloading(false);
    selected.accountStatus=value;
    dispatch(setSelectedUser(selected));
  }).catch((err)=>{
    setIsloading(false);
    console.log("Error",err);
  })
}

  return (
    <div className=" container-fluid">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header bg-primary mt-3">
             <h3>User Information </h3>
             <button onClick={()=>back()} className="btn btn-info btn-sm float-end"> Back to list</button>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-12">
                        <div className="form-group row">
                            <div className="col-4">
                                <label>First name</label>
                                <input type="text" readOnly="true" className=" form-control" value={selected.first_name} style={{backgroundColor:"#ccc"}}/>
                            </div>
                            <div className="col-4">
                                <label>Last name</label>
                                <input type="text" readOnly="true" className=" form-control" value={selected.last_name} style={{backgroundColor:"#ccc"}}/>
                            </div>
                            <div className="col-4">
                                <label>Gender</label>
                                <input type="text" readOnly="true" className=" form-control" value={selected.gender} style={{backgroundColor:"#ccc"}}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="form-group row">
                            <div className="col-4">
                                <label>Nationality</label>
                                <input type="text" readOnly="true" className=" form-control" value={selected.nationality} style={{backgroundColor:"#ccc"}}/>
                            </div>
                            <div className="col-4">
                                <label>Date of birth</label>
                                <input type="text" readOnly="true" className=" form-control" value={selected.birthDate} style={{backgroundColor:"#ccc"}}/>
                            </div>
                            <div className="col-4">
                                <label>martalStatus</label>
                                <input type="text" readOnly="true" className=" form-control" value={selected.martalStatus} style={{backgroundColor:"#ccc"}}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="form-group row">
                            <div className="col-6">
                                <label>Document({selected.documentType})</label>
                                <input type="text" readOnly="true" className=" form-control" value={selected.nationalIdNumber} style={{backgroundColor:"#ccc"}}/>
                            </div>
                            <div className="col-6">
                                <label>Attachment</label>
                                <input type="text" readOnly="true" className=" form-control" value={selected.doc_image} style={{backgroundColor:"#ccc"}}/>
                               {selected.doc_image &&(<a className=" btn btn-link btn-sm" target="_blank" href={selected.doc_image}>view</a>)} 
                            </div>
                           
                        </div>
                        <div className="form-group">
                                <label>Account Status({selected.accountStatus})  {isloading&&(<span className=" text-warning"> Wait moment ...</span>)}</label>
                                        <select className=" form-control w-50" value={accountStatus} onChange={(e)=>handleAccountStatus(e.target.value)}>
                                    <option value="">change status</option>
                                    <option value="VERIFIED">VERIFIED</option>
                                    <option value="UNVERIFIED">UNVERIFIED</option>
                                </select>
                                
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

export default User;
