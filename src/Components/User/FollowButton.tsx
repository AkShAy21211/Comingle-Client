import { useEffect, useState } from "react";
import userApi from "../../Apis/user";
import { Follow } from "../../Interface/interface";
import { data } from "../Admin/DashBoard/SectionThree";

type FollowBtnProps = {
  requesterId: string;
  recipientId: string;
};

function FollowButton({ recipientId, requesterId }: FollowBtnProps) {
  const [status, setStatus] = useState("");
  const [followedByOther, setFollowedByOther] = useState<Follow[] | null>(null);
  const [folloedBytMe, setFollowedByme] = useState<Follow[] | null>(null);

  useEffect(() => {
    async function fetchFollowStatus() {
      try {
        const response = await userApi.getFollowStatus(
          requesterId,
          recipientId
        );
        if (response?.data) {
          setFollowedByme(response?.data?.followedByMe);
          setFollowedByOther(response?.data?.followedByOther);
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchFollowStatus();
  }, [recipientId, requesterId]);

  useEffect(() => {
    if (
      followedByOther &&
      followedByOther.some((follow) => follow.requester === recipientId)
    ) {
      const followed = followedByOther.find(
        (follow) => follow.requester === recipientId
      );
      setStatus(followed?.status as string);
    } else if (
      folloedBytMe &&
      folloedBytMe.some((follow) => follow.recipient === recipientId)
    ) {
      const followed = folloedBytMe.find(
        (follow) => follow.recipient === recipientId
      );
      setStatus(followed?.status as string);
    } else {
      setStatus("not_following");
    }
  }, [followedByOther, folloedBytMe, recipientId]);

  async function handleFollow() {
    try {
      setStatus("Pending");
      const response = await userApi.followRequest(recipientId);
      if (response.data) {
        setStatus(response.data.follow.status);
      }
    } catch (err) {
      setStatus("not_following");
      console.error(err);
    }
  }

  async function handleAcceptFollow(followId:string) {
    try {
      setStatus("Accepted");
      const response = await userApi.acceptFollow(followId);

      if (response?.data) {
        setStatus(response.data.follow.status);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const isFollowedBuyOther = followedByOther?.find(
    (folow) => folow.requester === recipientId
  );

  const isFollowedByMe = folloedBytMe?.find(
    (follow) => follow.recipient === recipientId
  );

  return (
    <>
      {isFollowedBuyOther &&
        status === "Pending" &&
        isFollowedBuyOther.requester === recipientId && (
          <button onClick={()=>handleAcceptFollow(isFollowedBuyOther._id)} className="bg-custom-teal px-3 py-1 text-white rounded-lg mt-5">
            Follow Back
          </button>
        )}
      {isFollowedBuyOther &&
        status === "Accepted" &&
        isFollowedBuyOther.requester === recipientId && (
          <button className=" border border-custom-teal px-3 py-1 text-custom-teal rounded-lg mt-5">
            Following
          </button>
        )}
      {isFollowedByMe &&
        status === "Pending" &&
        isFollowedByMe.requester === requesterId && (
          <button className="border border-custom-teal px-3 py-1 text-custom-teal rounded-lg mt-5">
            Pending
          </button>
        )}
      {isFollowedByMe &&
        status === "Accepted" &&
        isFollowedByMe.requester === requesterId && (
          <button className="border border-custom-teal px-3 py-1 text-custom-teal rounded-lg mt-5">
            Following
          </button>
        )}
      {!isFollowedBuyOther && !isFollowedByMe && (
        <button
          onClick={handleFollow}
          className="bg-custom-teal px-3 py-1 rounded-lg my-5 text-white"
        >
          {status === "Pending" ? "Pending" : "Follow"}
        </button>
      )}
    </>
  );
}

export default FollowButton;
