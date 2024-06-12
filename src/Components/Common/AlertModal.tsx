import  { Dispatch, SetStateAction } from "react";
import { CiCircleAlert } from "react-icons/ci";





type AlertModal={


    setShowAlert:Dispatch<SetStateAction<boolean>>;
    handleToggleUserStatus:()=>Promise<void>;
}




function AlertModal({setShowAlert,handleToggleUserStatus}:AlertModal) {

  
  return (
 <div
      id="modal"
      aria-hidden="true"
      className="fixed inset-0 z-50 flex items-center justify-center w-full h-full"
    >
      <div className="relative p-4 w-96 max-w-md max-h-full">
        {/* Modal content */}
        <div className="relative pt-3  pb-5 rounded-lg shadow  bg-white h-auto">
          
        
         

          <div className="p-4 md:p-5 flex  gap-3 justify-center">
           <CiCircleAlert size={40} color="red"/>
           <p className="text-2xl p-1 text-clip">Are you sure</p>

           
          </div>
          <div className="flex  items-center justify-center gap-3 mt-5 mb-5">
          
            <button
            onClick={()=>setShowAlert(false)}
              className={`  bg-red-500 px-8 py-1 text-white rounded-lg`}
            >
                No 
            </button>
            <button
            onClick={()=>handleToggleUserStatus()}
              className={` bg-green-500 px-8 py-1 rounded-lg`}
            >
                Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlertModal
