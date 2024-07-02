import QuickViewBox from '../QuickViewBox';



type SectionOneProp={

  totalUsers:number;
  totalPosts:number;
  premiumUsers:number;
  blockedUsers:number;
}
function SectionOne({totalUsers,totalPosts,premiumUsers,blockedUsers}:SectionOneProp) {
  return (
    <div className="flex flex-col lg:flex-row  justify-center items-center lg:items-start  w-full gap-10 space-y-8 lg:space-y-0 lg:pt-32  pt-32 h-auto lg:h-scrautoeen">
       
      
          <QuickViewBox  count={totalUsers} title='Total Users' />
          <QuickViewBox  count={totalPosts} title='Total Posts' />
          <QuickViewBox  count={premiumUsers} title='Premium Users' />
          <QuickViewBox  count={blockedUsers} title='Blocked Users' />

       
      </div>
  )
}

export default SectionOne
