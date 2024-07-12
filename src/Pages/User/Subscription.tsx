import userApi from "../../Apis/user";
import PremiumAd from "../../Components/User/PremiumAd";
import { RootState } from "../../Redux/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Plans } from "../../Interface/interface";



function Subscription() {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const [premiumPlan, setPremiumPlan] = useState<Plans | null>(null);
  const [defaultPlan, setDefaultPlan] = useState<Plans | null>(null);
  const currentUser = useSelector((state:RootState)=>state.user.user);
  const getPlans = async () => {
    try {
      const { plans } = await userApi.getPlans();

      if (plans) {
        const defaultPlan = plans.find(
          (plan: Plans) => plan.title === "default" || plan.title === "Default"
        );
        const premiumPlan = plans.find(
          (plan: Plans) => plan.title === "Premium" || plan.title === "premium"
        );

        setPremiumPlan(premiumPlan);
        setDefaultPlan(defaultPlan);
      }
    } catch (error) {
      console.log(error);
    }
  };

 
  useEffect(() => {
    getPlans();
  }, []);


  return (
    <div
      className={` h-scsreen   flex ${
        isDarkMode ? "bg-black text-white " : ""
      }  flex-col overflow-hidden col-span-full mt-18 pt-20  lg:col-start-2 lg:col-end-5`}
    >
      <div className="flex">
        <h4 className="px-10 mt-5 font-bold">Current Plan</h4>
        <span className={`px-5  ${currentUser.isPremium?'bg-custom-gold':"bg-custom-blue"} flex justify-center items-center rounded-lg text-white text-center font-serif text-xs  mt-5 -mx-8`}>
         {currentUser.isPremium?'Premium':'Default'}
        </span>
      </div>
      <div className="grid md:grid-cols-2 p-10  mb-32 md:mb-0 md:gap-32  md:pt-3">
        <PremiumAd
         plan={defaultPlan}
         isPremiumPage
        />
        <PremiumAd
         plan={premiumPlan}
         isPremiumPage
        />
      </div>
    </div>
  );
}

export default Subscription;
