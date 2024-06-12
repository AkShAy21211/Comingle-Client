import React, { Dispatch, SetStateAction, useState } from "react";
import { User } from "../../Interface/interface";
import Avatar from "react-avatar";
import adminApi from "../../Apis/admin";
import AlertModal from "../Common/AlertModal";

type ViewUserModalProps = {
  user: User | null;
  setShowModal: Dispatch<SetStateAction<boolean>>;
};

function ViewUserModal({ user, setShowModal }: ViewUserModalProps) {
  const [userStatus, setUserStatus] = useState(user?.isBlocked);
  const [showAlert,setShoAlert] = useState(false);

  const handleToggleUserStatus = async () => {
    try {
      const userResponse = await adminApi.blockOrUnblockUser(user?._id as string);

      if (userResponse) {
        const updatedUserStatus = userResponse.user.isBlocked;
        setUserStatus(updatedUserStatus);
        setShoAlert(false)
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
        <div className="relative bg-custom-blue/30 pb-5 rounded-lg shadow backdrop-blur-lg h-auto">
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl bg-yellow-400/80 px-2 rounded-lg text-white font-semibold">
              {user?.profile.isPremium ? " Premium user " : ""}
            </h3>
            <button
              onClick={() => setShowModal(false)}
              type="button"
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
            <div className="w-full h-auto md:h-52 rounded-lg flex flex-col items-center cursor-pointer">
              {user?.profile?.image ? (
                <img
                  src={user.profile.image}
                  className="w-36 h-36 rounded-full object-cover"
                  alt={user.name}
                />
              ) : (
                <Avatar
                  name={user?.name}
                  className="rounded-full mt-2"
                  size={"150"}
                />
              )}

              <h6 className="mt-3 text-center">
                {user?.username.toLowerCase()}
              </h6>
            </div>

            <div className="flex justify-around gap-3 mt-5 mb-5">
              <div className="flex rounded-md flex-col w-20 justify-center items-center bg-custom-blue text-white p-2 text-sm">
                <p>Following</p>
                <p className="text-center">2</p>
              </div>
              <div className="flex rounded-md flex-col w-20 justify-center items-center bg-custom-blue text-white p-2 text-sm">
                <p>Follower</p>
                <p className="text-center">3</p>
              </div>
              <div className="flex rounded-md flex-col w-20 justify-center items-center bg-custom-blue text-white p-2 text-sm">
                <p>Posts</p>
                <p className="text-center">5</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 mt-5 mb-5">
            <p className="font-bold">Name: {user?.name.toUpperCase()}</p>
            <p className="font-bold">Email: {user?.email.toUpperCase()}</p>
            <p className="font-bold">
              Age: {user?.profile.age ? user?.profile.age : "Not mentioned"}
            </p>

            <button
              onClick={() => setShoAlert(true)}
              className={` ${userStatus ? "bg-green-500" : "bg-red-600"} px-10 py-1 text-white rounded-lg`}
            >
              {userStatus ? "UNBLOCK" : "BLOCK"}
            </button>
          </div>
        </div>
      </div>
    </div>

    {
      showAlert&&
    <AlertModal setShowAlert={setShoAlert} handleToggleUserStatus={handleToggleUserStatus}/>
    }

    </>
  );
}

export default ViewUserModal;
