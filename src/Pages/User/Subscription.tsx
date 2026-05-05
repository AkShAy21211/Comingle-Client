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
  const currentUser = useSelector((state: RootState) => state.user.user);

  const getPlans = async () => {
    try {
      const { plans } = await userApi.getPlans();

      if (plans) {
        const foundDefaultPlan = plans.find(
          (plan: Plans) => plan.title === "default" || plan.title === "Default"
        );
        const foundPremiumPlan = plans.find(
          (plan: Plans) => plan.title === "Premium" || plan.title === "premium"
        );

        setPremiumPlan(foundPremiumPlan);
        setDefaultPlan(foundDefaultPlan);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPlans();
  }, []);

  return (
    <div className="col-span-full lg:col-start-2 lg:col-end-3">
      <div className="app-page pt-0">
        <div className={`app-panel mx-auto max-w-[980px] p-5 sm:p-8 ${isDarkMode ? "border-white/10 bg-slate-900/60 text-white" : ""}`}>
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="app-chip">Subscription</span>
              <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight sm:text-3xl">Choose your plan</h1>
              <p className={`mt-2 text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                Compare benefits and upgrade when you're ready.
              </p>
            </div>
            <span className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold ${currentUser.isPremium ? "bg-custom-gold text-slate-900" : "bg-custom-blue text-white"}`}>
              Current: {currentUser.isPremium ? "Premium" : "Default"}
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <PremiumAd plan={defaultPlan} isPremiumPage />
            <PremiumAd plan={premiumPlan} isPremiumPage />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Subscription;
