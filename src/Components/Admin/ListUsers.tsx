import React, { useEffect, useState } from 'react';
import { User } from '../../Interface/interface';
import adminApi from '../../Apis/admin';
import Avatar from 'react-avatar';
import ViewUserModal from './ViewUserModal';
import { FaEye } from 'react-icons/fa';
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

function ListUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(3);
  const [totalUsers, setTotalUsers] = useState(0);

  const getUsers = async (page = 1, limit = usersPerPage) => {
    try {
      const { users, total } = await adminApi.getUsers(page, limit);
      if (users) {
        setUsers(users);
        setTotalUsers(total);
        setFetchAgain(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers(currentPage);
  }, [fetchAgain, currentPage]);

  const handleSearchUsers = (name: string) => {
    if (!name.trim()) {
      setFetchAgain(true);
      return;
    }

    const lowerCaseName = name.toLowerCase();
    const filteredUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowerCaseName) ||
        user.email.toLowerCase().includes(lowerCaseName)
    );

    setUsers(filteredUsers);
  };

  const totalPages = Math.ceil(totalUsers / usersPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setFetchAgain(true);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setFetchAgain(true);
    }
  };

  return (
    <div className="flex flex-col lg:px-20 pt-20">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="flex justify-between w-full px-2 ">
            <input
              type="text"
              onChange={(e) => handleSearchUsers(e.target.value)}
              placeholder="Search user......"
              className="placeholder:text-sm p-2 h-8 border border-custom-blue w-72 rounded-lg mb-5"
            />
            <p className="bg-custom-teal shadow-xl flex justify-center items-center text-sm p-2 text-white rounded-lg mb-5">
              Total {totalUsers}
            </p>
          </div>
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg h-[75vh]">
            <div className="overflow-y-auto h-full">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 tee text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((person) => (
                    <tr key={person.email}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {person.profile.image ? (
                              <img
                                className="h-10 w-10 rounded-full"
                                src={person.profile.image}
                                alt=""
                              />
                            ) : (
                              <Avatar
                                size="40"
                                className="rounded-full"
                                name={person.name}
                              />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {person.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {person.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs text-white leading-5 font-semibold rounded-full ${
                            person.isBlocked ? 'bg-red-400' : 'bg-green-300'
                          }`}
                        >
                          {person.isBlocked ? 'BLOCKED' : 'ACTIVE'}
                        </span>
                      </td>
                      <td className="py-4 whitespace-nowrap text-sm flex justify-center text-center font-medium">
                        <FaEye
                          onClick={() => setSelectedUser(person)}
                          className="text-custom-blue text-center cursor-pointer hover:animate-pulse"
                          size={20}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {selectedUser && (
                <ViewUserModal
                  fetchUsers={getUsers}
                  user={selectedUser}
                  setSelectedUser={setSelectedUser}
                />
              )}
            </div>
          </div>
          <div className="flex justify-around items-center mt-0">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="bg-custom-teal text-white px-4 py-2 rounded"
            >
              <IoIosArrowBack/>
            </button>
            <p>
              Page {currentPage} of {totalPages}
            </p>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="bg-custom-teal text-white px-4 py-2 rounded"
            >
              <IoIosArrowForward/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListUsers;
