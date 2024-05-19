import React from "react";
import ModalImage from "react-modal-image";

function ProfileAndBg() {
  return (
    <>
      <div className="w-full">
        <ModalImage
        hideDownload
        loading="eager"
        hideZoom
          small={
            "https://plus.unsplash.com/premium_photo-1673306778968-5aab577a7365?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFja2dyb3VuZCUyMGltYWdlfGVufDB8fDB8fHww"
          }
          large="https://plus.unsplash.com/premium_photo-1673306778968-5aab577a7365?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFja2dyb3VuZCUyMGltYWdlfGVufDB8fDB8fHww"
          className="object-cover h-52 lg:h-72 w-full "
        />
        
      </div>

      <div className="relative border shadow-lg -top-16 lg:-top-24 rounded-full lg:w-52 h-32 w-32 lg:h-52 bg-white ">
        
       <div className="flex"> 
         <img
          className="rounded-full object-cover"
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt=""
        />

       </div>
        <h2 className="text-center mt-auto">@terry</h2>
        
      </div>
    </>
  );
}

export default ProfileAndBg;
