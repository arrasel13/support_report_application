import React from "react";
import { MdDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { BsPersonWorkspace } from "react-icons/bs";
import { Link, NavLink } from "react-router";
import { FaTasks } from "react-icons/fa";
import { IoLayersSharp } from "react-icons/io5";
import siteLogo from "/Wpdeveloper.png";
import useAdmin from "../../../hooks/useadmin";

const Sidebar = () => {
  const [isAdmin] = useAdmin();
  // console.log("Admin/ Super Admin: ", isAdmin);

  return (
    <div>
      <aside className="fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 w-[290px] -translate-x-full lg:translate-x-0">
        <div className="py-8 flex justify-start">
          <Link to="/" data-discover="true">
            <img
              className="dark:hidden"
              alt="Logo"
              width="150"
              height="40"
              src={siteLogo}
            />
          </Link>
        </div>

        <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
          <nav className="mb-6">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="mb-4 text-xs uppercase flex leading-[20px] text-gray-400 justify-start">
                  Menu
                </h2>
                <ul className="flex flex-col gap-4">
                  <li>
                    <NavLink
                      to="/"
                      className="menu-item group menu-item-inactive"
                    >
                      <span className="menu-item-icon-size">
                        <MdDashboard className="text-xl" />
                      </span>
                      <span className="menu-item-text">Dashboard</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/tasks"
                      className="menu-item group menu-item-inactive"
                    >
                      <FaTasks className="text-xl" />
                      All Tasks
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/workUpdate"
                      className="menu-item group menu-item-inactive"
                    >
                      <BsPersonWorkspace className="text-xl" />
                      Work Update
                    </NavLink>
                  </li>
                </ul>
              </div>

              {isAdmin && (
                <>
                  <div>
                    <h2 className="mb-4 text-xs uppercase flex leading-[20px] text-gray-400 justify-start">
                      Admin
                    </h2>

                    <ul className="flex flex-col gap-4">
                      {/* <li>
                    <NavLink
                      to="/report"
                      className="menu-item group menu-item-inactive"
                    >
                      <BsGraphUpArrow className="text-xl" />
                      Support Report
                    </NavLink>
                  </li> */}
                      <li>
                        <NavLink
                          to="/users"
                          className="menu-item group menu-item-inactive"
                        >
                          <FaUsers className="text-xl" />
                          All Users
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/workreport"
                          className="menu-item group menu-item-inactive"
                        >
                          <IoLayersSharp className="text-xl" />
                          Work Report
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/integrations"
                          className="menu-item group menu-item-inactive"
                        >
                          <IoLayersSharp className="text-xl" />
                          Integration
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </nav>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
