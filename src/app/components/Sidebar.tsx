import React from "react";
import { RiLogoutBoxLine } from "react-icons/ri";

const Sidebar = () => {
  return (
    <div className="bg-custom-blue h-full overflow-y-auto px-5 flex flex-col">
      <div className="flex-grow">
        <div className="cursol-pointer flex justify-evenly items-center border mt-2 rounded-md hover:bg-blue-800 duration-150">
          <span className="text-white p-4 text-2xl">+</span>
          <h1 className="text-white text-xl font-semibold p-4">new chat</h1>
        </div>
        <ul>
          <li className="cursol-ponter border-b p-4 text-slate-100 hover:bg-slate-700 duration-150">
            Room1
          </li>
          <li className="cursol-ponter border-b p-4 text-slate-100 hover:bg-slate-700 duration-150">
            Room1
          </li>
          <li className="cursol-ponter border-b p-4 text-slate-100 hover:bg-slate-700 duration-150">
            Room1
          </li>
          <li className="cursol-ponter border-b p-4 text-slate-100 hover:bg-slate-700 duration-150">
            Room1
          </li>
        </ul>
      </div>
      <div className="text-xl flex items-center justify-evenly mb-3 cursor-pointer p-4 text-slate-100 hover:bg-slate-700 duration-150">
        <RiLogoutBoxLine />
        <span>ログアウト</span>
      </div>
    </div>
  );
};

export default Sidebar;
