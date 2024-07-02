import  { useEffect, useState } from "react";
import QuickViewBox from "../QuickViewBox";
import PlanBenifitBox from "./PlanBenifitBox";
import adminApi from "../../../Apis/admin";
import { Subscription } from "../../../Interface/interface";

function SectionOne() {
  const [subscriptions, setSubscriptions] = useState<Subscription[] | null>(
    null
  );
  const getSubscriptions = async () => {
    try {
      const subscriptions = await adminApi.getSubscriptions();
      if (subscriptions) {
        setSubscriptions(subscriptions.subscriptions);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSubscriptions();
  }, []);
  console.log(subscriptions);

  return (
    <>
      <div className="flex flex-col justify-center items-center lg:flex-row lg:justify-center   w-full gap-10 space-y-8 lg:space-y-0 lg:pt-32  pt-32 h-auto lg:h-scrautoeen">
        <QuickViewBox title="Total amount" count={30000} />
        <PlanBenifitBox plan="Premium" title="Premium Plan Details" />
        <PlanBenifitBox plan="Default" title="Default Plan Details" />
      </div>

      <div className=" mt-20  rounded-xl overflow-x-auto shadow-lg  mx-14 overflow-auto">
        <table className="w-full text-sm text-left rtl:text-right   ">
          <thead className="text-xs  uppercase bg-gray-50 dark:bg-gray-300 dark:text-gray-400">
            <tr>
                
                <th scope="col" className="px-6 py-3">
                    Name
                </th>
                
                <th scope="col" className="px-6 py-3">
                    OrderID
              
                </th>
                  <th scope="col" className="px-6 py-3">
                    Amount
                </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                </th>
              
              
            </tr>
        </thead>
          <tbody>
            {subscriptions?.map((subscription) => (
              <tr className="   rounded-xl shadow-xl border-2">
               
                <th
                  scope="row"
                  className="px-6 py-4 font-medium  whitespace-nowrap "
                >
                  {subscription.userId.username}
                </th>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium  whitespace-nowrap "
                >
                  {subscription.orderId}
                </th>
                 
                  <th
                scope="row"
                className={`px-6 py-4 font-medium    whitespace-nowrap `}
              >
                Rs:{subscription.amount}
              </th>
                  <th
                scope="row"
                className={`px-6 py-4 font-medium   ${subscription.status?'text-green-600':"text-red-600"} whitespace-nowrap `}
              >
                {subscription.status?'complete':"failed"}
              </th>
              
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default SectionOne;
