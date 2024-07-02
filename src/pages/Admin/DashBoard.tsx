import  { useEffect, useState } from "react";
import SectionOne from "../../Components/Admin/DashBoard/SectionOne";
import SectionTwo from "../../Components/Admin/DashBoard/SectionTwo";
import SectionThree from "../../Components/Admin/DashBoard/SectionThree";
import adminApi from "../../Apis/admin";
import { Engagement } from "../../Interface/interface";
function DashBoard() {
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [blockedUsers, setBlockedUsers] = useState(0);
  const [premiumUsers, setPremiumUsers] = useState(0);
  const [engagements, setEngagements] = useState<Engagement[] | null>(null);

  const [agetGroup, setAgeGroup] = useState<{
    "<15": number;
    "15-25": number;
    "26-35": number;
    "35+": number;
  }>({ "<15": 0, "15-25": 0, "26-35": 0, "35+": 0 });
  const getAnalytics = async () => {
    try {
      const data = await adminApi.getAnalytics();

      console.log(data);

      if (data) {
        setTotalPosts(data.post);
        setTotalUsers(data.user.totalUsers);
        setBlockedUsers(data.user.blockedUsers);
        setPremiumUsers(data.user.premiumUsers);
        setAgeGroup(data.user.ageGroups);
        setEngagements(data.engagement);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAnalytics();
  }, []);

  
  return (
    <>
      <SectionOne
        premiumUsers={premiumUsers}
        totalPosts={totalPosts}
        totalUsers={totalUsers}
        blockedUsers={blockedUsers}
      />
      <SectionTwo ageRoup={agetGroup} />
      <SectionThree
      engagements={engagements}
        premiumUsers={premiumUsers}
        
        normalUsers={totalUsers - premiumUsers}
      />
    </>
  );
}

export default DashBoard;
