// import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { useHistory } from "react-router";
import { getAllUsers, setSelectedUser } from "../../features/user/UserSlice";
const axios = require("axios").default;
function Lists() {
  const API_URL = useSelector((state) => state.userInfo.url_api);
  const _user = useSelector((state) => state.userInfo.logedIn);
  const [userList,setUserList]=useState([]);
  const [isloading, setIsloading] = useState(false);
  const history=useHistory();
  const dispatch=useDispatch();
  useEffect(()=>{
    if(_user.data.user.roles!='admin'){
        history.push("/home");
        return;
    }
    // get all users
    setIsloading(true);
    axios
    .get(`${API_URL}/user`)
    .then((response) => {
      setUserList(response.data);
      setIsloading(false);
    })
    .catch((err) => {
      console.log(err,"error");
    });
  },[]);
const handleReview=(user)=>{
    dispatch(setSelectedUser(user));
    history.push("/user");
    
}

  return (
    <div className=" container-fluid">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header bg-primary mt-3">
             <h3>Lists of users <span className=" badge bg-info">{userList.length}</span></h3>
             <a href="/home" className="btn btn-info btn-sm float-end"> Back to home</a>
            </div>
            <div className="card-body">
            <table id="example" className="table table-striped table-bordered w-100">
        <thead>
            <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Nationality</th>
                <th>Document</th>
                <th>Attachment</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            {isloading &&(<tr><td colSpan="9">Loading ....</td></tr>)}
            {userList.map((u,index)=><tr key={u.id}><td>{index+1}</td><td>{u.first_name}</td>
            <td>{u.last_name}</td><td>{u.gender}</td><td>{u.age}</td><td>{u.nationality}</td>
            <td>{u.documentType}</td><td>{u.doc_image}</td><td>{u.accountStatus}</td><td>
                <button className=" btn btn-inf" type="button" onClick={()=>handleReview(u)}>review</button></td>
            </tr>
            )}
        </tbody>
    </table>
</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Lists;
