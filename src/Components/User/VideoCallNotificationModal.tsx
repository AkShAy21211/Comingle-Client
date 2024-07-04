import React, { SetStateAction } from "react";
import { FaPhoneSlash } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";

interface VideoCallNotificationModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  onAccept: ()=>void;
  onReject: () => void;
  callerName: string | undefined;
}

const VideoCallNotificationModal: React.FC<VideoCallNotificationModalProps> = ({
  isOpen,
  onAccept,
  onReject,
  setIsOpen,
  callerName,
}) => {
  const handleAccept = () => {
    onAccept()
    setIsOpen(false);
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-custom-blue text-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-semibold mb-4"> Video Call</h2>
        <p className="mb-6">{callerName} is calling you</p>
        <div className="flex justify-center gap-4">
          <button
            className="bg-green-500 animate-pulse text-white p-4  rounded-full hover:bg-green-600"
            onClick={handleAccept}
          >
            <FaPhoneAlt  />
          </button>
          <button
            className="bg-red-500 animate-pulse text-white p-4  rounded-full hover:bg-red-600"
            onClick={onReject}
          >
            <FaPhoneSlash />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallNotificationModal;
