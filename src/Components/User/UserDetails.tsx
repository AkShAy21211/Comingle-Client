import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { FaArrowLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { useFormik } from "formik";
import ProfileUpdation from "../../Validation/User/ProfileUpdation";
import userApi from "../../Apis/user";

const UserDetails: React.FC = () => {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const user = useSelector((state: RootState) => state.user.user);
  const [isEditing, setIsEditing] = useState(false);

  console.log(user);

  ////////////////////////// Handling Form submit for edit user detail///////////////////////////

  const onSubmit = async (data: any) => {
    const { name, email, phone, age, gender, country, bio } = data;

    const userData: any = {};

    if (name) userData.name = name;
    if (email) userData.email = email;
    if (phone) userData.phone = phone;

    if (age || gender || country || bio) {
      userData.profile = {};
      if (age) userData.profile.age = age;
      if (gender) userData.profile.gender = gender;
      if (country) userData.profile.country = country;
      if (bio) userData.profile.bio = bio;
    }

    try {
      const updateResponse = await userApi.updateUserInfo(userData);
      if (updateResponse) {
        setIsEditing(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const {
    errors,
    handleBlur,
    handleChange,
    values,
    handleSubmit,
    handleReset,
  } = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: 0,
      bio: "",
      age: 0,
      country: "",
      gender: "",
    },
    onSubmit: onSubmit,
    validationSchema: ProfileUpdation,
  });

  /////////////////////// TOOGLE USEDETAIL FORM TO EDIT AND SUBMIT//////////////////////
  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={`  ${isDarkMode ? "text-white" : ""}`}
      >
        <Link to="/settings">
          <FaArrowLeft className="mx-3 mt-1  lg:hidden" size={18} to="" />
        </Link>
        <div className="lg:flex justify-center flex-wrap gap-5 p-3">
          <div className="mb-4 lg:w-96">
            <label className="block text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              onBlur={handleBlur}
              id="name"
              name="name"
              defaultValue={user.name}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full ${
                isDarkMode ? "bg-gray-900" : ""
              } px-3 py-2 border ${
                isEditing ? "border-blue-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200`}
            />
            <p className="text-sm mt-1 font-light text-red-400">
              {errors.name}
            </p>
          </div>
          <div className="mb-4 lg:w-96">
            <label className="block text-sm font-bold mb-2" htmlFor="name">
              Bio
            </label>
            <textarea
              id="bio"
              onBlur={handleBlur}
              name="bio"
              defaultValue={user?.profile?.bio}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full ${
                isDarkMode ? "bg-gray-900" : ""
              } px-3 py-2 border ${
                isEditing ? "border-blue-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200`}
            />
            <p className="text-sm mt-1 font-light text-red-400">{errors.bio}</p>
          </div>
          <div className="mb-4  lg:w-96 ">
            <label className="block text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              onBlur={handleBlur}
              name="email"
              defaultValue={user?.email}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full px-3 ${
                isDarkMode ? "bg-gray-900" : ""
              } py-2 border ${
                isEditing ? "border-blue-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200`}
            />
            <p className="text-sm mt-1 font-light text-red-400">
              {errors.email}
            </p>
          </div>
          <div className="mb-4 lg:w-96">
            <label className="block  text-sm font-bold mb-2" htmlFor="phone">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              onBlur={handleBlur}
              defaultValue={user?.phone}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full px-3 ${
                isDarkMode ? "bg-gray-900" : ""
              } py-2 border ${
                isEditing ? "border-blue-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200`}
            />
            <p className="text-sm mt-1 font-light text-red-400">
              {errors.phone}
            </p>
          </div>
          <div className="mb-4 lg:w-96">
            <label className="block text-sm font-bold mb-2" htmlFor="phone">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              onBlur={handleBlur}
              defaultValue={user?.age}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full px-3  ${
                isDarkMode ? "bg-gray-900" : ""
              } py-2 border ${
                isEditing ? "border-blue-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200`}
            />
            <p className="text-sm mt-1 font-light text-red-400">{errors.age}</p>
          </div>
          <div className="mb-4 lg:w-96">
            <label className="block  text-sm font-bold mb-2" htmlFor="phone">
              Gender
            </label>
            <input
              type="text"
              id="gender"
              name="gender"
              onBlur={handleBlur}
              defaultValue={user?.gender}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full px-3 py-2 border ${
                isDarkMode ? "bg-gray-900" : ""
              } ${
                isEditing ? "border-blue-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200`}
            />
            <p className="text-sm mt-1 font-light text-red-400">
              {errors.gender}
            </p>
          </div>
          <div className="mb-4 lg:w-96">
            <label className="block  text-sm font-bold mb-2" htmlFor="phone">
              Country
            </label>
            <input
              type="text"
              id="country"
              onBlur={handleBlur}
              name="country"
              defaultValue={user?.country}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full px-3 py-2 border ${
                isDarkMode ? "bg-gray-900" : ""
              } ${
                isEditing ? "border-blue-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200`}
            />
            <p className="text-sm mt-1 font-light text-red-400">
              {errors.country}
            </p>
          </div>
        </div>

        {isEditing && (
          <div className=" flex justify-center ">
            <button
              type="submit"
              className={` ${
                isDarkMode ? "text-white" : "text-black"
              }   px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-blue-200`}
            >
              Submit
            </button>
          </div>
        )}
      </form>

      {!isEditing && (
        <div className="flex justify-center">
          <button
            type="button"
            data-tooltip-target="tooltip-default"
            onClick={handleEdit}
            className="  text-center text-center  px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <FiEdit size={20} />
          </button>
        </div>
      )}
    </>
  );
};

export default UserDetails;
