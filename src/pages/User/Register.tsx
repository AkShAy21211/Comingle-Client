import LoginLeft from "../../Components/User/LoginLeft";
import { ToastContainer } from "react-toastify";
import RegisterForm from "../../Components/User/RegisterForm";

function Register() {
  return (
    <div className="flex bg-blue-900  lg:bg-white justify-center h-screen items-center md:bg-blue-900">
      <LoginLeft text=" Unlock a world of connections. Join us today!" />
      <RegisterForm />
    </div>
  );
}

export default Register;
