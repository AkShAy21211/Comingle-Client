import PremiumAd from "../../Components/User/PremiumAd";
import { RootState } from "../../Redux/store";
import { useSelector } from "react-redux";

const Default = [
  "No Verified Badge",
  "With Ads free experience",
  "Up to 50 follows per day",
];

const Premium = [
  "Verified Badge",
  "Ads free experience",
  "Up to 200 follows per day",
];

function Subscription() {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  return (
    <div
      className={` h-scsreen border  flex ${
        isDarkMode ? "bg-black text-white lg:border-x" : ""
      }  flex-col overflow-hidden col-span-full mt-18 pt-20  lg:col-start-2 lg:col-end-5`}
    >
      <div className="flex">
       
        <h4 className="px-10 mt-5 font-bold">Current Plan</h4>
        <span className="px-5  flex justify-center items-center rounded-lg text-white text-center font-serif text-xs  mt-5 -mx-8 bg-custom-blue">Default</span>
      </div>
      <div className="grid md:grid-cols-2 p-10  mb-32 md:mb-0 md:gap-32  md:pt-3">
        <PremiumAd
          benifits={Default}
          title="Default"
          plan="Default"
          isPremiumPage
        />
        <PremiumAd
          benifits={Premium}
          title="Upgrade to premium fo just 499/only"
          plan="Premium"
          isPremiumPage
        />
      </div>
    </div>
  );
}

export default Subscription;
