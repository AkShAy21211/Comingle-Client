
function Header() {
  return (
    <div className='fixed left-0 right-0 top-0 z-40 flex h-20 items-center justify-between border-b border-white/10 bg-slate-950/90 px-6 backdrop-blur-xl'>
       <div className="flex flex-col">
        <p className="font-display text-2xl font-bold text-white">Comingle Admin</p>
        <p className="text-sm text-slate-400">Moderation and insights hub</p>
       </div>
       <div className="flex">
        <img className="h-10 w-10 rounded-2xl ring-2 ring-white/15" src="https://img.freepik.com/premium-vector/businessman-flat-icon-man-business-suit-avatar-businessman-flat-internet-icon-rounded-shape-web-mobile-design-element-male-profile-vector-colored-illustration_263753-2878.jpg?size=626&ext=jpg&ga=GA1.1.885222701.1706885504&semt=ais_user" alt="Bordered avatar"/>
       </div>
    </div>
  )
}

export default Header
