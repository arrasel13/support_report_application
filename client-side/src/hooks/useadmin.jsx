import { useQuery } from "@tanstack/react-query";
import useAuth from "./useauth";
import useAxiosSecure from "./useaxiossecure";

const useAdmin = () => {
  const { user, loading, tokenReady } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: isAdmin, isPending: isAdminLoading } = useQuery({
    queryKey: [user?.email, "isAdmin"],
    enabled: tokenReady && !loading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/admin/${user.email}`);
      // console.log("From use Admin: ", res.data);
      return res.data?.admin;
    },
  });
  return [isAdmin, isAdminLoading];
};

export default useAdmin;
