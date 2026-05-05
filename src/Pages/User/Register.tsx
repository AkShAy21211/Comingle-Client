import LoginLeft from "../../Components/User/LoginLeft";
import RegisterForm from "../../Components/User/RegisterForm";

function Register() {
  return (
    <div className="min-h-screen justify-center bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.25),_transparent_28%),linear-gradient(135deg,_#082f49_0%,_#0f172a_42%,_#f8fafc_42%,_#eff6ff_100%)] px-4 py-8 lg:flex lg:items-center">
      <LoginLeft text=" Unlock a world of connections. Join us today!" />
      <RegisterForm />
    </div>
  );
}

export default Register;
