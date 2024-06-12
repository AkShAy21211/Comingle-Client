import React, { useEffect, useState } from "react";
import EditBenifitsModal from "./EditBenifitsModal";
import adminApi from "../../../Apis/admin";
import { Plans } from "../../../Interface/interface";
import { Bounce, toast } from "react-toastify";
import CreateBenefitsModal from "./CreateBenefitsModal";

type PlanBenifitBoxPros = {
  title: string;
  plan: string;
};

function PlanBenifitBox({ title, plan }: PlanBenifitBoxPros) {
  const [showDefaultModal, setShowDefaultModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [defaultPlans, setDefaultPlans] = useState<Plans | null>(null);
  const [premiumPlans, setPremiumPlans] = useState<Plans | null>(null);
  const [showCreateDefaultModal,setShowCreateDefaultModal] = useState(false)
  const [showCreatePremiumModal,setShowCreatePremiumModal] = useState(false)

  const getPlanData = async () => {
    try {
      const plans = await adminApi.getPlanDetails();
      if (plans) {
        plans.plans.forEach((plan: any) => {
          if (plan.title === "Default") {
            setDefaultPlans({ ...plan });
          } else if (plan.title === "Premium") {
            setPremiumPlans({ ...plan });
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPlanData();
  }, []);

  const handleViewBenefits = () => {
    console.log('cliked',title,premiumPlans);
    
    if (plan === "Premium") {
      if (!premiumPlans) {        
        toast.warning("Plan is empty, create one", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        setShowCreatePremiumModal(true);
        return;
      }
      setShowPremiumModal(true);
    } else if (plan === "Default") {
      if (!defaultPlans) {
        toast.warning("Plan is empty, create one", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        setShowCreateDefaultModal(true)
        return;
      }
      setShowDefaultModal(true);
    }
  };

  return (
    <>
      <div
        className={`w-4/5 sm:w-3/4 md:w-1/2 lg:w-3/12 h-52 flex flex-col gap-y-1 justify-center items-center rounded-xl`}
      >
        <p className="text-lg font-bold">{title}</p>
        <button
          onClick={handleViewBenefits}
          className={`${
            plan === "Premium"
              ? "bg-custom-gold text-black"
              : "bg-custom-blue text-white"
          } w-32 rounded-xl p-1`}
        >
          View
        </button>
      </div>

      {showDefaultModal && defaultPlans && (
        <EditBenifitsModal plan={defaultPlans} setShowModal={setShowDefaultModal} />
      )}
      {showPremiumModal && premiumPlans && (
        <EditBenifitsModal plan={premiumPlans} setShowModal={setShowPremiumModal} />
      )}

      {
        showCreateDefaultModal && <CreateBenefitsModal setShowModal={setShowCreateDefaultModal}/>
        
      }
       {
        showCreatePremiumModal && <CreateBenefitsModal setShowModal={setShowCreatePremiumModal}/>
        
      }
    </>
  );
}

export default PlanBenifitBox;
