
type LoginProType = {

    text:string;
}

function LoginLeft({text}:LoginProType) {

  return (
    <div className="relative hidden h-[calc(100vh-4rem)] overflow-hidden rounded-[36px] xl:w-6/12 lg:flex lg:w-7/12 lg:flex-col lg:justify-between lg:bg-[linear-gradient(160deg,_rgba(4,64,128,0.95),_rgba(0,127,134,0.9))] lg:p-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(255,215,0,0.18),_transparent_28%)]" />
      <div className="relative">
        <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/90">
          Socially modern
        </span>
        <h1 className="mt-8 font-display text-6xl font-bold tracking-tight text-white">Comingle</h1>
        <h2 className="mt-5 max-w-xl text-lg leading-8 text-white/72">{text}</h2>
      </div>
      <div className="relative mt-10 flex items-end justify-between gap-6">
        <div className="max-w-sm rounded-[28px] border border-white/15 bg-white/10 p-6 backdrop-blur-md">
          <p className="text-sm uppercase tracking-[0.24em] text-white/60">Why people stay</p>
          <p className="mt-3 text-2xl font-semibold text-white">Cleaner conversations, stronger discovery, and a feed that feels alive.</p>
        </div>
        <img className="h-72 w-80 object-contain" src="/User/login.png" alt="" />
      </div>
    </div>
  )
}

export default LoginLeft
