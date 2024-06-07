import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";

const PostSkeleton = () => {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  return (
    <div className="flex justify-center">
      <div className="w-full lg:w-3/5">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className={`w-full flex flex-col justify-between items-center mb-10 relative animate-pulse`}
          >
            <div className="flex items-center mb-3 p-2 w-full">
              <div
                className={`w-12 h-10 mr-4 rounded-full ${
                  isDarkMode ? "bg-gray-600" : "bg-gray-400"
                }`}
              ></div>
              <div className="flex flex-col md:flex-row md:items-center w-full justify-between">
                <div
                  className={`h-4 rounded w-1/4 ${
                    isDarkMode ? "bg-gray-600" : "bg-gray-400"
                  }`}
                ></div>
                <div
                  className={`h-3 rounded w-1/6 mt-1 md:mt-0 ${
                    isDarkMode ? "bg-gray-600" : "bg-gray-400"
                  }`}
                ></div>
              </div>
              <div className="ml-1">
                <div
                  className={`w-5 h-5 rounded-full ${
                    isDarkMode ? "bg-gray-600" : "bg-gray-400"
                  }`}
                ></div>
              </div>
            </div>

            <div
              className={`w-full h-56 mb-3 ${
                isDarkMode ? "bg-gray-600" : "bg-gray-400"
              }`}
            ></div>

            <div className="w-full flex items-center mt-2 p-2 md:p-0">
              <div
                className={`h-4 rounded w-full ${
                  isDarkMode ? "bg-gray-600" : "bg-gray-400"
                }`}
              ></div>
            </div>

            <div className="w-full flex justify-around gap-8 p-4">
              <div className="flex w-full gap-5">
                <div
                  className={`w-6 h-6 rounded-full ${
                    isDarkMode ? "bg-gray-600" : "bg-gray-400"
                  }`}
                ></div>
                <div
                  className={`w-6 h-6 rounded-full ${
                    isDarkMode ? "bg-gray-600" : "bg-gray-400"
                  }`}
                ></div>
                <div
                  className={`w-6 h-6 rounded-full ${
                    isDarkMode ? "bg-gray-600" : "bg-gray-400"
                  }`}
                ></div>
              </div>
              <div
                className={`w-8 h-7 rounded-full ${
                  isDarkMode ? "bg-gray-600" : "bg-gray-400"
                }`}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostSkeleton;
