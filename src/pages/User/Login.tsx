import { ToastContainer } from "react-toastify";
import LoginLeft from "../../Components/User/LoginLeft";
import LoginFrom from "../../Components/User/LoginFom";
function Login() {

  return (
    <div className=" flex bg-blue-900  lg:bg-white justify-center h-screen items-center md:bg-blue-900">
      <LoginLeft text=" Unlock a world of connections. Join us today!" />
      <LoginFrom/>
    </div>
  );
}

export default Login;
