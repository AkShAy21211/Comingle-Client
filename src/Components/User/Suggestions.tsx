import UserAvatar from "./UserAvatar";
import userApi from "../../Apis/user";
import { useEffect, useState } from "react";
import { User } from "../../Interface/interface";
import { RootState } from "../../Redux/rootReducer";
import { useSelector } from "react-redux";
function Suggestions() {
  const [suggestions, setSuggestions] = useState<User[] | []>([]);
  const currentUser = useSelector((state: RootState) => state.user.user);

  const getFriendsSuggestions = async () => {
    try {
      const respoonse = await userApi.frindsSuggestions();

      if (respoonse) {
        const suggestions = respoonse.suggestions.filter(
          (user: User) => user._id !== currentUser._id
        );
        setSuggestions(suggestions);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFriendsSuggestions();
  }, []);

  return (
    <>
      <UserAvatar
        friends={suggestions}
        suggestions={"You might know"}
        isRight={false}
      />
    </>
  );
}

export default Suggestions;
