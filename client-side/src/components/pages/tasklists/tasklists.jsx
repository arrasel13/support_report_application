import React, { useEffect, useState } from "react";
import AddNewTask from "../../utils/modals/addNewTask";
import { MdFormatListBulletedAdd } from "react-icons/md";
import BreadCrumb from "../common/breadcrumb";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FiCalendar, FiFilter, FiPlus } from "react-icons/fi";
import { BsChat } from "react-icons/bs";

const tabs = ["All Tasks", "To do", "In Progress", "Completed"];
const initialTasks = {
  todo: [
    {
      id: 1,
      title: "Finish user onboarding",
      tag: "Marketing",
      due: "Tomorrow",
      comments: 1,
      user: "https://randomuser.me/api/portraits/men/75.jpg",
      checked: false,
    },
    {
      id: 2,
      title: "Solve the Dribble prioritization issue with the team",
      tag: "Marketing",
      due: "Tomorrow",
      comments: 2,
      user: "https://randomuser.me/api/portraits/men/76.jpg",
      checked: false,
    },
  ],
  inProgress: [
    {
      id: 1,
      title: "Work in Progress (WIP) Dashboard",
      tag: "Template",
      due: "Jan 8, 2027",
      comments: 2,
      user: "https://randomuser.me/api/portraits/men/78.jpg",
      checked: false,
    },
    {
      id: 2,
      title: "Product Update – Q4 2024",
      due: "Jan 8, 2027",
      comments: 2,
      user: "https://randomuser.me/api/portraits/men/79.jpg",
    },
  ],
  completed: [
    {
      id: 1,
      title: "Work in Progress (WIP) Dashboard",
      tag: "Template",
      due: "Jan 8, 2027",
      comments: 2,
      user: "https://randomuser.me/api/portraits/men/78.jpg",
      checked: false,
    },
    {
      id: 2,
      title: "Product Update – Q4 2024",
      due: "Jan 8, 2027",
      comments: 2,
      user: "https://randomuser.me/api/portraits/men/79.jpg",
    },
  ],
};

const TaskLists = () => {
  useEffect(() => {
    document.title = "All Task";
  }, []);

  const [activeTab, setActiveTab] = useState("All Tasks");
  const [taskData, setTaskData] = useState(initialTasks);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceList = [...taskData[result.source.droppableId]];
    const [movedItem] = sourceList.splice(result.source.index, 1);
    const destList = [...taskData[result.destination.droppableId]];

    destList.splice(result.destination.index, 0, movedItem);

    setTaskData({
      ...taskData,
      [result.source.droppableId]: sourceList,
      [result.destination.droppableId]: destList,
    });
  };

  const renderTaskList = (list, key) => (
    <Droppable droppableId={key} key={key}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="space-y-3 mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="flex items-center gap-3 text-base font-medium text-gray-800 capitalize dark:text-white/90">
              {key.replace(/([A-Z])/g, " $1")}
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-theme-xs font-medium ${
                  key === "todo"
                    ? "bg-gray-100 text-gray-700 dark:bg-white/[0.03] dark:text-white/80"
                    : key === "inProgress"
                    ? "text-warning-700 bg-warning-50 dark:bg-warning-500/15 dark:text-orange-400"
                    : "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500"
                }`}
              >
                3
              </span>
            </h3>
            <div className="relative">
              <button className="dropdown-toggle">
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-400 hover:text-gray-700 size-6 dark:hover:text-gray-300"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.99915 10.2451C6.96564 10.2451 7.74915 11.0286 7.74915 11.9951V12.0051C7.74915 12.9716 6.96564 13.7551 5.99915 13.7551C5.03265 13.7551 4.24915 12.9716 4.24915 12.0051V11.9951C4.24915 11.0286 5.03265 10.2451 5.99915 10.2451ZM17.9991 10.2451C18.9656 10.2451 19.7491 11.0286 19.7491 11.9951V12.0051C19.7491 12.9716 18.9656 13.7551 17.9991 13.7551C17.0326 13.7551 16.2491 12.9716 16.2491 12.0051V11.9951C16.2491 11.0286 17.0326 10.2451 17.9991 10.2451ZM13.7491 11.9951C13.7491 11.0286 12.9656 10.2451 11.9991 10.2451C11.0326 10.2451 10.2491 11.0286 10.2491 11.9951V12.0051C10.2491 12.9716 11.0326 13.7551 11.9991 13.7551C12.9656 13.7551 13.7491 12.9716 13.7491 12.0051V11.9951Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </button>

              <div className="hidden absolute z-40  right-0 mt-2  rounded-xl border border-gray-200 bg-white  shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark right-0 top-full w-[140px] space-y-1 rounded-2xl border-gray-200 bg-white p-2 shadow-theme-md dark:border-gray-800 dark:bg-gray-dark">
                <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                  Edit
                </button>
                <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                  Delete
                </button>
                <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                  Clear All
                </button>
              </div>
            </div>
          </div>
          {list.map((task, index) => (
            <Draggable
              key={index}
              draggableId={`${key}-${index}`}
              index={index}
            >
              {(provided) => (
                <div
                  // className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-300 cursor-move"
                  className="p-5 mb-4 bg-white border border-gray-200 task rounded-xl shadow-theme-sm dark:border-gray-800 dark:bg-white/5"
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  {/* <div className="flex items-center gap-3"> */}
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex items-start w-full gap-4">
                      <span className="text-gray-400">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M2.43311 5.0001C2.43311 4.50304 2.83605 4.1001 3.33311 4.1001L16.6664 4.1001C17.1635 4.1001 17.5664 4.50304 17.5664 5.0001C17.5664 5.49715 17.1635 5.9001 16.6664 5.9001L3.33311 5.9001C2.83605 5.9001 2.43311 5.49716 2.43311 5.0001ZM2.43311 15.0001C2.43311 14.503 2.83605 14.1001 3.33311 14.1001L16.6664 14.1001C17.1635 14.1001 17.5664 14.503 17.5664 15.0001C17.5664 15.4972 17.1635 15.9001 16.6664 15.9001L3.33311 15.9001C2.83605 15.9001 2.43311 15.4972 2.43311 15.0001ZM3.33311 9.1001C2.83605 9.1001 2.43311 9.50304 2.43311 10.0001C2.43311 10.4972 2.83605 10.9001 3.33311 10.9001L16.6664 10.9001C17.1635 10.9001 17.5664 10.4972 17.5664 10.0001C17.5664 9.50304 17.1635 9.1001 16.6664 9.1001L3.33311 9.1001Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </span>
                      <label
                        htmlFor={`taskCheckbox${key}-${index}`}
                        className="w-full cursor-pointer"
                      >
                        <div className="relative flex items-start">
                          <input
                            id={`taskCheckbox${key}-${index}`}
                            className="sr-only taskCheckbox"
                            type="checkbox"
                            defaultChecked={task.checked}
                          />
                          <div className="flex items-center justify-center w-full h-5 mr-3 border border-gray-300 rounded-md box max-w-5 dark:border-gray-700">
                            <span className="opacity-0">
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M11.6668 3.5L5.25016 9.91667L2.3335 7"
                                  stroke="white"
                                  strokeWidth="1.94437"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                ></path>
                              </svg>
                            </span>
                          </div>
                          <p className="-mt-0.5 text-base text-gray-800 dark:text-white/90">
                            {task.title}
                          </p>
                        </div>
                      </label>
                    </div>

                    <div className="flex flex-col-reverse items-start justify-end w-full gap-3 xl:flex-row xl:items-center xl:gap-5">
                      {task.tag && (
                        <span className="tag1 inline-flex rounded-full bg-brand-50 px-2 py-0.5 text-theme-xs font-medium text-brand-500 dark:bg-brand-500/15 dark:text-brand-400">
                          {task.tag}
                        </span>
                      )}

                      <div className="flex items-center justify-between w-full gap-5 xl:w-auto xl:justify-normal">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer dark:text-gray-400">
                            <svg
                              className="fill-current"
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5.33329 1.0835C5.74751 1.0835 6.08329 1.41928 6.08329 1.8335V2.25016L9.91663 2.25016V1.8335C9.91663 1.41928 10.2524 1.0835 10.6666 1.0835C11.0808 1.0835 11.4166 1.41928 11.4166 1.8335V2.25016L12.3333 2.25016C13.2998 2.25016 14.0833 3.03366 14.0833 4.00016V6.00016L14.0833 12.6668C14.0833 13.6333 13.2998 14.4168 12.3333 14.4168L3.66663 14.4168C2.70013 14.4168 1.91663 13.6333 1.91663 12.6668L1.91663 6.00016L1.91663 4.00016C1.91663 3.03366 2.70013 2.25016 3.66663 2.25016L4.58329 2.25016V1.8335C4.58329 1.41928 4.91908 1.0835 5.33329 1.0835ZM5.33329 3.75016L3.66663 3.75016C3.52855 3.75016 3.41663 3.86209 3.41663 4.00016V5.25016L12.5833 5.25016V4.00016C12.5833 3.86209 12.4714 3.75016 12.3333 3.75016L10.6666 3.75016L5.33329 3.75016ZM12.5833 6.75016L3.41663 6.75016L3.41663 12.6668C3.41663 12.8049 3.52855 12.9168 3.66663 12.9168L12.3333 12.9168C12.4714 12.9168 12.5833 12.8049 12.5833 12.6668L12.5833 6.75016Z"
                                fill=""
                              ></path>
                            </svg>
                            {task.due}
                          </span>
                          <span className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer dark:text-gray-400">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9 15.6343C12.6244 15.6343 15.5625 12.6961 15.5625 9.07178C15.5625 5.44741 12.6244 2.50928 9 2.50928C5.37563 2.50928 2.4375 5.44741 2.4375 9.07178C2.4375 10.884 3.17203 12.5246 4.35961 13.7122L2.4375 15.6343H9Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinejoin="round"
                              ></path>
                            </svg>
                            {task.comments}
                          </span>
                        </div>
                        <div className="h-6 w-full max-w-6 overflow-hidden rounded-full border-[0.5px] border-gray-200 dark:border-gray-800">
                          <img
                            width="24"
                            height="24"
                            alt="user"
                            src={task.user}
                          />
                        </div>
                      </div>
                    </div>

                    {/* <input
                      type="checkbox"
                      className="w-4 h-4"
                      defaultChecked={task.checked}
                    /> */}
                    {/* <span className="text-sm font-medium text-gray-800">
                      {task.title}
                    </span> */}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {/* {task.tag && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full tag">
                        {task.tag}
                      </span>
                    )} */}
                    {/* <span className="flex items-center gap-1">
                      <FiCalendar /> {task.due}
                    </span> */}
                    {/* <span className="flex items-center gap-1">
                      <BsChat /> {task.comments}
                    </span> */}
                    {/* <img
                      src={task.user}
                      alt="User"
                      className="w-7 h-7 rounded-full object-cover"
                    /> */}
                  </div>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );

  return (
    <>
      <BreadCrumb bTitle="Task List" bText="Task List" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col items-center px-4 py-5 xl:px-6 xl:py-6">
          <div className="flex flex-col w-full gap-5 sm:justify-between xl:flex-row xl:items-center">
            {/* Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 items-center gap-x-1 gap-y-2 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  // className={`px-4 py-2 text-sm font-medium rounded-full cursor-pointer ${
                  // className={`btn text-sm font-medium rounded-full cursor-pointer ${
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md group cursor-pointer ${
                    activeTab === tab
                      ? "bg-white text-gray-900 dark:text-white dark:bg-gray-800"
                      : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                    // : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab}
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium leading-normal group-hover:bg-brand-50 group-hover:text-brand-500 dark:group-hover:bg-brand-500/15 dark:group-hover:text-brand-400 dark:bg-white/[0.03] ${
                      activeTab === tab
                        ? "text-brand-500 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/15"
                        : "bg-white dark:bg-white/[0.03]"
                    }`}
                  >
                    3
                  </span>
                </button>
              ))}
            </div>

            {/* Filter and Add New Task button */}
            <div className="flex flex-wrap items-center gap-3 xl:justify-end">
              <button className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 cursor-pointer">
                <FiFilter />
                Filter & Sort
              </button>
              <button
                className="inline-flex items-center justify-center gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 cursor-pointer"
                onClick={() =>
                  document.getElementById("add_new_task").showModal()
                }
              >
                <MdFormatListBulletedAdd className="text-lg" />
                Assign Task
              </button>
            </div>
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="p-4 space-y-8 border-t border-gray-200 mt-7 dark:border-gray-800 sm:mt-0 xl:p-6">
            {Object.entries(taskData).map(([key, list]) =>
              renderTaskList(list, key)
            )}
          </div>
        </DragDropContext>

        {/* Assign task modal */}
        <dialog
          id="add_new_task"
          className="modal fixed inset-0 flex items-center justify-center overflow-y-auto modal z-99999"
        >
          <AddNewTask />
        </dialog>
      </div>
    </>
  );
};

export default TaskLists;
