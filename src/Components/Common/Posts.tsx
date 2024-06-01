import React from "react";
import { PostsType } from "../../Interface/interface";

type PostProps = {
  allPosts: PostsType[];
};

function Posts({ allPosts }: PostProps) {
  return (
    <>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          <div className=" w-full h-52 md:h-72 shadow-lg rounded-lg flex flex-col items-center">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              className="w-full h-full  object-cover mt-5"
            />
          </div>
        
          <div className=" w-full h-52 md:h-72 shadow-lg rounded-lg flex flex-col items-center">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              className="w-full h-full  object-cover mt-5"
            />
          </div>
          <div className=" w-full h-52 md:h-72 shadow-lg rounded-lg flex flex-col items-center">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              className="w-full h-full  object-cover mt-5"
            />
          </div>
          <div className=" w-full h-52 md:h-72 shadow-lg rounded-lg flex flex-col items-center">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              className="w-full h-full  object-cover mt-5"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Posts;
