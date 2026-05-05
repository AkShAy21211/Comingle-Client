import UserAvatar from "./UserAvatar";
import userApi from "../../Apis/user";
import { useEffect, useState } from "react";
import { User } from "../../Interface/interface";
import { RootState } from "../../Redux/rootReducer";
import { useSelector } from "react-redux";
function Suggestions() {
  const [suggestions, setSuggestions] = useState<User[] | []>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = useSelector((state: RootState) => state.user.user);

  const getFriendsSuggestions = async () => {
    try {
      setIsLoading(true);
      const respoonse = await userApi.frindsSuggestions();
      const fetchedSuggestions = Array.isArray(respoonse?.suggestions)
        ? respoonse.suggestions
        : [];

      const suggestions = fetchedSuggestions.filter(
        (user: User) => user?._id !== currentUser._id
      );
      setSuggestions(suggestions);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getFriendsSuggestions();
  }, [currentUser._id]);

  const handleSuggestionFollowed = (followedUserId: string) => {
    setSuggestions((prev) => prev.filter((user) => user._id !== followedUserId));
  };

  return (
    <>
      <UserAvatar
        friends={suggestions}
        suggestions={"You might know"}
        isRight={false}
        isLoading={isLoading}
        onFollowSuccess={handleSuggestionFollowed}
      />
    </>
  );
}

export default Suggestions;
