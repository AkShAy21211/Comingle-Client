import React, { Dispatch, SetStateAction, useState } from "react";
import adminApi from "../../../Apis/admin";
import { Bounce, toast } from "react-toastify";

type CreateBenefitsModalProp = {
  setShowModal: Dispatch<SetStateAction<boolean>>;
};

function CreateBenefitsModal({ setShowModal }: CreateBenefitsModalProp) {
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [benefits, setBenifits] = useState<string[]>([]);
  const [newBenefits, setNewBenefits] = useState<string>("");

  const handleAppendNewBenifits = () => {
    if (newBenefits.trim()) {
      setBenifits((prev) => [...prev, newBenefits]);
    }
  };

  const handleSubmit = async () => {
    try {
      const data = {
        title,
        amount,
        benefits,
      };
      console.log(data);
      
      const response = await adminApi.createPlan(data);

      if(response){

        toast.warn('Plan created', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        id="modal"
        aria-hidden="true"
        className="fixed inset-0 z-50 flex items-center justify-center w-full h-full"
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          {/* Modal content */}
          <div className="relative bg-custom-blue/30 rounded-lg shadow backdrop-blur-lg h-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900">Create</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="authentication-modal"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <div className="p-4 md:p-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Title
                </label>
                <input
                  type="text"
                  onChange={(e) => setTitle(e.target.value)}
                  name="title"
                  id="title"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  onChange={(e) => setAmount(parseInt(e.target.value))}
                  id="amount"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div className="overflow-auto mt-3 h-40">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Benefits
                </label>
                <ul>
                  {benefits.map((benefit, index) => (
                    <li key={index} className="bg-custom-blue/20 mt-2 p-3">
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3 mt-5 mb-5">
                <input
                  type="text"
                  name="newBenefit"
                  onChange={(e) => setNewBenefits(e.target.value)}
                  id="newBenefit"
                  placeholder="Add new benefit"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
                <button
                  type="button"
                  onClick={handleAppendNewBenifits}
                  className="text-white bg-custom-blue focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Add
                </button>
              </div>

              <button
                type="submit"
                onClick={()=>handleSubmit()}
                className="w-full text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-custom-blue"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateBenefitsModal;
