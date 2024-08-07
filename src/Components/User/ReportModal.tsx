import React, { useState, ChangeEvent } from 'react';
import { RootState } from '../../Redux/rootReducer';
import { useSelector } from 'react-redux';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState<string>('');
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  const handleReasonChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setReason(event.target.value);
  };

  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className={`  ${isDarkMode?'backdrop-blur-lg border border-gray-300 text-white':"bg-gray-200 text-black"}rounded-lg p-6 md:max-w-md w-96 `}>
        <h2 className="text-2xl font-semibold mb-4">Report Post</h2>
          <label className="block mb-4">
            <span className="">Select a reason:</span>
            <select
              className={`block w-full mt-1 p-2 focus:outline-none rounded-md
                ${isDarkMode?' bg-black':"bg-gary-200 text-black"}`}
              value={reason}
              onChange={handleReasonChange}
            >
              <option value="">--Select--</option>
              <option value="Spam or Promotional Content">Spam or Promotional Content</option>
              <option value="Offensive or Inappropriate Material">Offensive or Inappropriate Material</option>
              <option value="Harassment or Bullying Behavior">Harassment or Bullying Behavior</option>
              <option value="Hate Speech or Discrimination">Hate Speech or Discrimination</option>
              <option value="False or Misleading Information">False or Misleading Information</option>
              <option value="Violence or Threatening Remarks">Violence or Threatening Remarks</option>
              <option value="Self-Harm or Suicidal Content">Self-Harm or Suicidal Content</option>
              <option value="Explicit Nudity or Sexuality">Explicit Nudity or Sexuality</option>
              <option value="Illegal or Unlawful Activities">Illegal or Unlawful Activities</option>
              <option value="Intellectual Property Rights Violation">Intellectual Property Rights Violation</option>
              <option value="Fraudulent Schemes or Scams">Fraudulent Schemes or Scams</option>
              <option value="Impersonation or Identity Theft">Impersonation or Identity Theft</option>
            </select>
          </label>
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-2 px-4 py-2  rounded-md"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={()=>onSubmit(reason)}
              className="px-4 py-2 bg-custom-bluerounded-md bg-custom-blue text-white rounded-lg"
            >
              Submit
            </button>
          </div>
    
      </div>
    </div>
  );
};

export default ReportModal;
