import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { Link } from "react-router-dom";
import userApi from "../../Apis/user";
import useRazorpay, { RazorpayOptions } from "react-razorpay";
import { log } from "console";

type PremiumProp = {
  title: string;
  plan: string;
  benifits: string[];
  isPremiumPage: boolean;
};

function PremiumAd({ benifits, plan, isPremiumPage, title }: PremiumProp) {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const [Razorpay] = useRazorpay();
  const [orderDetails, setOrderDetails] = useState({
    orderId: "",
    currency: "",
    amount: "",
  });
  const handlePremium = async (amount: number) => {
    try {
      const { key } = await userApi.getRazorpayKey();

      const { order } = await userApi.upgradeToPremium(amount);
      console.log(order);

      if (order) {
        setOrderDetails({
          orderId: order.id,
          currency: order.currency,
          amount: order.amount,
        });

        console.log(key);

        const options: any = {
          key: key, // Enter the Key ID generated from the Dashboard
          amount: amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          currency: "INR",
          name: "Commingle",
          description: "Test Transaction",
          image: "https://example.com/your_logo",
          order_id: orderDetails.orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          handler: async function (response: any) {
            
            await userApi.verifyPremiumOrder(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature,
              order.id,
              order.amount,
              'Premium'

            ).then(data=>{

              console.log('fwijfwjofjneiouwfniuenwfiun',data);
              
            });
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#3399cc",
          },
        };
        console.log(options);

        const rzp1 = new Razorpay(options);
        rzp1.on("payment.failed", function (response: any) {
          alert(response.error.code);
          alert(response.error.description);
          alert(response.error.source);
          alert(response.error.step);
          alert(response.error.reason);
          alert(response.error.metadata.order_id);
          alert(response.error.metadata.payment_id);
        });

        rzp1.open();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`${
        !isDarkMode ? "border-l border-gray-300" : ""
      }  h-auto  overflow-hidden rounded-lg ${
        isDarkMode ? "bg-blue-950/75" : "bg-white"
      }  mt-14 p-10 flex flex-col shadow-xl border `}
    >
      <h2 className={`text-center lg:text-f-10 xl:text-xl`}>{title}</h2>
      <ul
        className={` w-auto ${
          isPremiumPage ? "block" : "hidden"
        }  text-nowrap lg:text-sm md:text-f-10 list-inside space-y-1  list-disc ${
          isDarkMode ? "text-white" : "text-gray-500"
        } `}
      >
        {benifits.map((benifit) => (
          <li className=" w-auto text-wrap p-3">{benifit}</li>
        ))}
      </ul>
      {!isPremiumPage && (
        <Link
          to={"/settings/subscription"}
          className={` 
            bg-custom-gold mt-4  md:w-full  lg:bgg lg:text-f-10 text-center w-full  font-bold py-2 md:px-0 px-4 rounded-full xl:text-sm`}
        >
          {plan == "Premium" && !isPremiumPage
            ? "View Benifits"
            : plan === "Default" && isPremiumPage
            ? "Default"
            : "Upgrade"}
        </Link>
      )}
      {isPremiumPage && (
        <button
          onClick={plan === "Premium" ? () => handlePremium(499) : undefined}
          disabled={plan === "Premium" ? false : true}
          className={` ${
            !isDarkMode && plan === "Premium"
              ? "bg-custom-gold text-white"
              : isDarkMode && plan === "Premium"
              ? "bg-custom-gold text-black"
              : " bg-custom-blue"
          } mt-4  md:w-full  lg:bgg lg:text-f-10 text-center w-full  font-bold py-2 md:px-0 px-4 rounded-full xl:text-sm text-white`}
        >
          {plan == "Premium" && !isPremiumPage
            ? "View Benifits"
            : plan === "Default" && isPremiumPage
            ? "Default"
            : "Upgrade"}
        </button>
      )}
    </div>
  );
}

export default PremiumAd;
