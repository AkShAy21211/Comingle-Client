import { SlLike } from "react-icons/sl";
import { FaRegCommentAlt } from "react-icons/fa";
import { VscSave } from "react-icons/vsc";
import CreatePost from "./CreatePost";
import Contents from "./Contets";
import FormattedRelativeTime from "../../Utils/Time";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { is } from "date-fns/locale";
const images = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDI5fHxwbGFjZWhvbGRlcnxlbnwwfHx8fDE2Mjc0MjQ4MjY&ixlib=rb-1.2.1&q=80&w=1080",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDI5fHxwbGFjZWhvbGRlcnxlbnwwfHx8fDE2Mjc0MjQ4MjY&ixlib=rb-1.2.1&q=80&w=1080",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1487700160041-babef9c3cb55?q=80&w=2052&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fGxvZ2lufGVufDB8fDB8fHww",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDI5fHxwbGFjZWhvbGRlcnxlbnwwfHx8fDE2Mjc0MjQ4MjY&ixlib=rb-1.2.1&q=80&w=1080",
  },
];

function Posts() {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  return (
    <>
      <div
        className={`h-full mb-16  ${
          isDarkMode ? "bg-black text-white" : ""
        }  flex flex-col items-center col-span-full lg:col-start-2 lg:col-end-5  overflow-auto overscroll-y-auto`}
      >
        <CreatePost />

        <div
          className={` w-full mt-32 lg:mt-0  shadow-sm ${
            isDarkMode ? "bg-black text-white  " : ""
          }  flex flex-col justify-between items-center w-5/6 lg:w-3/5 mb-10`}
        >
          <div className="flex items-center p-4 w-full">
            <img
              className="w-10 h-10 mr-4 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Rounded avatar"
            />
            <div className="flex flex-col md:flex-row md:items-center w-full justify-between">
              <h3 className="text-base md:text-lg font-semibold">Terry</h3>
              <p className="text-sm md:text-base text-gray-500 mt-1 md:mt-0">
                {FormattedRelativeTime()}
              </p>
            </div>
          </div>

          <div className="flex-grow w-full p-2">
            <Contents images={images} />
          </div>
          <div
            className={`w-full  ${
              isDarkMode ? "bg-black " : ""
            } flex justify-around items-center p-4`}
          >
            <SlLike />
            <FaRegCommentAlt />
            <VscSave />
          </div>
        </div>

 <div
          className={` w-full  lg:mt-0  shadow-sm ${
            isDarkMode ? "bg-black text-white  " : ""
          }  flex flex-col justify-between items-center w-5/6 lg:w-3/5 mb-10`}
        >
          <div className="flex items-center p-4 w-full">
            <img
              className="w-10 h-10 mr-4 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Rounded avatar"
            />
            <div className="flex flex-col md:flex-row md:items-center w-full justify-between">
              <h3 className="text-base md:text-lg font-semibold">Terry</h3>
              <p className="text-sm md:text-base text-gray-500 mt-1 md:mt-0">
                {FormattedRelativeTime()}
              </p>
            </div>
          </div>

          <div className="flex-grow w-full p-2">
            <Contents images={images} />
          </div>
          <div
            className={`w-full  ${
              isDarkMode ? "bg-black " : ""
            } flex justify-around items-center p-4`}
          >
            <SlLike />
            <FaRegCommentAlt />
            <VscSave />
          </div>
        </div>
        <div
          className={` w-full  lg:mt-0  shadow-sm ${
            isDarkMode ? "bg-black text-white  " : ""
          }  flex flex-col justify-between items-center w-5/6 lg:w-3/5 mb-10`}
        >
          <div className="flex items-center p-4 w-full">
            <img
              className="w-10 h-10 mr-4 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Rounded avatar"
            />
            <div className="flex flex-col md:flex-row md:items-center w-full justify-between">
              <h3 className="text-base md:text-lg font-semibold">Terry</h3>
              <p className="text-sm md:text-base text-gray-500 mt-1 md:mt-0">
                {FormattedRelativeTime()}
              </p>
            </div>
          </div>

          <div className="flex-grow w-full p-2">
            <Contents images={images} />
          </div>
          <div
            className={`w-full  ${
              isDarkMode ? "bg-black " : ""
            } flex justify-around items-center p-4`}
          >
            <SlLike />
            <FaRegCommentAlt />
            <VscSave />
          </div>
        </div>
      </div>
    </>
  );
}

export default Posts;