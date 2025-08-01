import { Route, Routes } from "react-router";
import MainLayout from "../layouts/mainlayout";
import Home from "../components/pages/home/home";
import TaskLists from "../components/pages/tasklists/tasklists";
import AllUsers from "../components/pages/users/allusers";
import WorkUpdate from "../components/pages/workupdate/workupdate";
import WorkReport from "../components/pages/workreport/workreport";
import Profile from "../components/pages/profile/profile";
import SignIn from "../components/pages/authentication/signin";
import SupportReport from "../components/pages/workreport/supportReport";
import ErrorNotFound from "../components/pages/errorpage/404";
import PrivateRoute from "./privateroute";
import AdminRoute from "./adminroute";
import ViewWorkUpdate from "../components/pages/workupdate/viewworkupdate";
import EditWorkupdate from "../components/pages/workupdate/editworkupdate";
import AddWorkUpdate from "../components/pages/workupdate/addworkupdate";

const Routers = () => {
  return (
    <>
      <Routes>
        <Route path="/signin" element={<SignIn />} />

        <Route
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/tasks" element={<TaskLists />} />
          {/* <Route path="/workUpdate" element={<WorkUpdate />} /> */}
          <Route path="/workUpdate">
            <Route index element={<WorkUpdate />} />
            <Route path=":id" element={<ViewWorkUpdate />} />
            <Route path=":id/edit" element={<EditWorkupdate />} />
            <Route path="add" element={<AddWorkUpdate />} />
          </Route>

          <Route path="/profile" element={<Profile />} />
          <Route
            path="/users"
            element={
              <AdminRoute>
                <AllUsers />
              </AdminRoute>
            }
          />
          <Route
            path="/report/:email"
            element={
              <AdminRoute>
                <SupportReport />
              </AdminRoute>
            }
          />
          <Route
            path="/workreport"
            element={
              <AdminRoute>
                <WorkReport />
              </AdminRoute>
            }
          />
          {/* <Route path="/report" element={<WorkReport />} /> */}
        </Route>

        {/* 404 page */}
        <Route path="*" element={<ErrorNotFound />} />
      </Routes>
    </>
  );
};

export default Routers;
