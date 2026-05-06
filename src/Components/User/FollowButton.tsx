import { useEffect, useState } from "react";
import userApi from "../../Apis/user";
import { Follow } from "../../Interface/interface";

type FollowBtnProps = {
  requesterId: string;
  recipientId: string;
};

function FollowButton({ recipientId, requesterId }: FollowBtnProps) {
  const [status, setStatus] = useState("");
  const [followedByOther, setFollowedByOther] = useState<Follow[] | null>(null);
  const [folloedBytMe, setFollowedByme] = useState<Follow[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStatusLoading, setIsStatusLoading] = useState(true);

  useEffect(() => {
    async function fetchFollowStatus() {
      try {
        setIsStatusLoading(true);
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
      } finally {
        setIsStatusLoading(false);
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
      setIsLoading(true);
      setStatus("Pending");
      const response = await userApi.followRequest(recipientId);
      if (response?.data) {
        setStatus(response.data.follow.status);
      }
    } catch (err) {
      setStatus("not_following");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAcceptFollow(followId:string) {
    try {
      setIsLoading(true);
      setStatus("Accepted");
      const response = await userApi.acceptFollow(followId);

      if (response?.data) {
        setStatus(response.data.follow.status);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
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
      {isStatusLoading && (
        <button className="mt-5 rounded-lg border border-slate-200 px-3 py-1 text-slate-500" disabled>
          Loading...
        </button>
      )}
      {isFollowedBuyOther &&
        !isStatusLoading &&
        status === "Pending" &&
        isFollowedBuyOther.requester === recipientId && (
          <button
            disabled={isLoading}
            onClick={() => handleAcceptFollow(isFollowedBuyOther._id)}
            className="mt-5 rounded-lg bg-custom-teal px-3 py-1 text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Please wait..." : "Follow Back"}
          </button>
        )}
      {isFollowedBuyOther &&
        !isStatusLoading &&
        status === "Accepted" &&
        isFollowedBuyOther.requester === recipientId && (
          <button className=" border border-custom-teal px-3 py-1 text-custom-teal rounded-lg mt-5">
            Following
          </button>
        )}
      {isFollowedByMe &&
        !isStatusLoading &&
        status === "Pending" &&
        isFollowedByMe.requester === requesterId && (
          <button className="border border-custom-teal px-3 py-1 text-custom-teal rounded-lg mt-5">
            Pending
          </button>
        )}
      {isFollowedByMe &&
        !isStatusLoading &&
        status === "Accepted" &&
        isFollowedByMe.requester === requesterId && (
          <button className="border border-custom-teal px-3 py-1 text-custom-teal rounded-lg mt-5">
            Following
          </button>
        )}
      {!isStatusLoading && !isFollowedBuyOther && !isFollowedByMe && (
        <button
          disabled={isLoading}
          onClick={handleFollow}
          className="my-5 rounded-lg bg-custom-teal px-3 py-1 text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Please wait..." : status === "Pending" ? "Pending" : "Follow"}
        </button>
      )}
    </>
  );
}

export default FollowButton;
