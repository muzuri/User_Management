import "./App.css";
import Home from "./View/Home";
import { BrowserRouter, Route } from "react-router-dom";
// import Signin from "./View/Authentication/Signin";
import Login from "./View/Login";
import Signup from "./View/Signup";
import PasswordReset from "./View/reset/PasswordReset";
import UpdatePassword from "./View/reset/UpdatePassword";
import ProtectedRoute from "./components/ProtectedRoute";
import Verify from "./View/Verify";
import ChangeProfile from "./View/ChangeProfile";
import Lists from "./View/users/Lists";
import User from "./View/users/user";

function App() {
  return (
    <BrowserRouter>
      <Route exact path="/signin" component={Login} />
      <Route exact path="/password_reset" component={PasswordReset} />
      <Route exact path="/reset-password" component={UpdatePassword} />
      <Route exact path="/signup" component={Signup} />
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute exact path="/home" component={Home} />
      <ProtectedRoute exact path="/verify" component={Verify} />
      <ProtectedRoute exact path="/change-profile" component={ChangeProfile} />
      <ProtectedRoute exact path="/users" component={Lists} />
      <ProtectedRoute exact path="/user" component={User} />
      
    </BrowserRouter>
  );
}

export default App;
