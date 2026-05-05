import LoginLeft from "../../Components/User/LoginLeft";
import LoginFrom from "../../Components/User/LoginFom";
function Login() {

  return (
    <div className="min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.25),_transparent_28%),linear-gradient(135deg,_#082f49_0%,_#0f172a_42%,_#f8fafc_42%,_#eff6ff_100%)] px-4 py-8 lg:flex">
      <LoginLeft text=" Unlock a world of connections. Join us today!" />
      <LoginFrom/>
    </div>
  );
}

export default Login;
