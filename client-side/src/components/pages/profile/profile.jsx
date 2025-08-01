import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useaxiossecure";
import useAuth from "../../../hooks/useauth";

const Profile = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: profileInfo = [] } = useQuery({
    queryKey: ["profileInfo"],
    queryFn: async () => {
      const res = await axiosSecure.get("/userprofile", {
        props: { email: user.email },
      });
      return res.data;
    },
  });

  console.log("User Profile info: ", profileInfo);

  return (
    <>
      <div className="space-y-6 w-2/6">
        <h1 className="text-2xl font-bold">User Profile info</h1>
        <div className="">
          <div className="w-20">
            <img src="wpdev.png" alt="" />
          </div>
          <h2>Name: {user.displayName}</h2>
          <h3>Email: {user.email}</h3>
        </div>
      </div>
    </>
  );
};

export default Profile;
