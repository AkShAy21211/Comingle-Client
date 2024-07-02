import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { Link } from "react-router-dom";
import userApi from "../../Apis/user";
import useRazorpay from "react-razorpay";
import { Plans } from "../../Interface/interface";
import { updatePLan } from "../../Redux/Slice/User/userSlice";
import { Bounce, toast } from "react-toastify";

type PremiumProp = {
  plan?: Plans | null;
  isPremiumPage?: boolean;
};

function PremiumAd({ plan, isPremiumPage }: PremiumProp) {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const currentUser = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const [Razorpay] = useRazorpay();

  const handlePremium = async (amount: number) => {
    try {
      if (currentUser.isPremium) {
        toast.warn('You are already a premium member', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });

        return;
      }

      const { key } = await userApi.getRazorpayKey();

      const { order } = await userApi.upgradeToPremium(amount);

      const options: any = {
        key: key, // Enter the Key ID generated from the Dashboard
        amount: order.amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "Commingle",
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: function (response: any) {
          console.log(response);

          handlePaymentVerification(
            response.razorpay_payment_id,
            response.razorpay_order_id,
            response.razorpay_signature,
            order.id,
            amount,
            "Premium"
          );
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

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
    } catch (error) {
      console.log(error);
    }
  };

  const handlePaymentVerification = async (
    razorpay_payment_id: string,
    razorpay_order_id: string,
    razorpay_signature: string,
    orderId: string,
    amount: number,
    product: string
  ) => {
    try {
      const status = await userApi.verifyPremiumOrder(
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        orderId,
        amount,
        product
      );
      if (status) {
        dispatch(updatePLan());
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
        isDarkMode ? "" : "bg-white"
      }  mt-14 p-10 flex flex-col  border `}
    >
      <h2 className={`text-center lg:text-f-10 xl:text-xl`}>{plan?.title}</h2>
      <ul
        className={` w-auto ${
          isPremiumPage ? "block" : "hidden"
        }  text-nowrap lg:text-sm md:text-f-10 list-inside space-y-1  list-disc ${
          isDarkMode ? "text-white" : "text-gray-500"
        } `}
      >
        {plan?.benefits?.map((benifit) => (
          <li className=" w-auto text-wrap p-3">{benifit}</li>
        ))}
      </ul>
      {!isPremiumPage && (
       <>
        <Link
          to={"/settings/subscription"}
          className={` 
            bg-custom-gold mt-4  md:w-full  lg:bgg lg:text-f-10 text-center w-full  font-bold py-2 md:px-0 px-4 rounded-full xl:text-sm`}
        >
          {"UPGRADE"}
        </Link>
        <p    className={` 
            mt-4  md:w-full  lg:bgg lg:text-f-10 text-center w-full   py-2 md:px-0 px-4 rounded-full xl:text-sm`}
        >Enjoy premium benifits for jus Rs:499</p>
       </>
      )}
      {isPremiumPage && (
        <button
          onClick={
            plan?.title === "Premium" ? () => handlePremium(499) : undefined
          }
          disabled={plan?.title === "Premium" ? false : true}
          className={` ${
            !isDarkMode && plan?.title === "Premium"
              ? "bg-custom-gold text-white"
              : isDarkMode && plan?.title === "Premium"
              ? "bg-custom-gold text-black"
              : " bg-custom-blue"
          } mt-4  md:w-full  lg:bgg lg:text-f-10 text-center w-full  font-bold py-2 md:px-0 px-4 rounded-full xl:text-sm text-white`}
        >
          {plan?.title == "Premium" && !isPremiumPage
            ? "View Benifits"
            : plan?.title === "Default" && isPremiumPage
            ? "Default"
            : "Upgrade"}
        </button>
      )}
    </div>
  );
}

export default PremiumAd;
