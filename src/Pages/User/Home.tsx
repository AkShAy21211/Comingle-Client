import { lazy, Suspense } from "react";
import PostSkeleton from "../../Components/Skleton/PostSkleton";
const Posts = lazy(() => import("../../Components/User/Posts"));

function Home() {
  return (
    <Suspense fallback={<PostSkeleton/>}>
      <Posts />
    </Suspense>
  );
}
export default Home;
