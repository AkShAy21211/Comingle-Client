import React, { useEffect, useState } from "react";
import People from "../../Components/Common/People";
import adminApi from "../../Apis/admin";
import { User } from "../../Interface/interface";
import ViewUserModal from "../../Components/Admin/ViewUserModal";

function Users() {
  const [users, setUsers] = useState<User[]>([]);

  const getUsers = async () => {
    try {
      const user = await adminApi.getUsers();
      if (user) {
        setUsers(user);
      }
    } catch (error) {
      console.log(error);
    }

  };

  useEffect(() => {
    getUsers();
  }, []);


      console.log(users);

  return (
    <div className="mt-20">
      <People isAdminView users={users}  />
    </div>
  );
}

export default Users;
