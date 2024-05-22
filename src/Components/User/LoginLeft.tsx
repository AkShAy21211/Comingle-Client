
type LoginProType = {

    text:string;
}

function LoginLeft({text}:LoginProType) {
  return (
    <div className="hidden lg:flex h-screen xl:w-6/12 lg:w-9/12 bg-blue-900  flex-col justify-center items-center">
    <h1 className="text-5xl text-white">comingle</h1>
    <h2 className="mt-5  sm:text-lg md:text-xl text-center text-gray-400">{text}</h2>
    <img className="object-contain w-80 h-60 absolute bottom-0" src="/User/login.png" alt="" />
    </div>
  )
}

export default LoginLeft
