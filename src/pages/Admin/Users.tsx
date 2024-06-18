import React, { useEffect, useState } from "react";
import adminApi from "../../Apis/admin";
import { User } from "../../Interface/interface";
import ListUsers from "../../Components/Admin/ListUsers";

function Users() {




  return (
    <div className="mt-20">
      <ListUsers/>
    </div>
  );
}

export default Users;
