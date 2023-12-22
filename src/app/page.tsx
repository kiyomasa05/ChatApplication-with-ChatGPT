"use client";
import Chat from "./components/Chat";
import Sidebar from "./components/Sidebar";
import { useAppContext } from "@/context/AppContext";
import { useState } from "react";
import { TfiAlignJustify } from "react-icons/tfi";

export default function Home() {
  const { user } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative flex h-screen">
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-0 left-0 m-3"
      >
        <TfiAlignJustify size={"45px"} />
      </button>

      {/* モバイル時には左側にサイドバーを表示 */}
      <div
        onClick={closeSidebar}
        className={`md:hidden fixed inset-0 z-50 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-black opacity-50"></div>
        <div
          className={`absolute left-0 top-0 h-full w-4/5 bg-white transition-transform ${
            isOpen ? "transform translate-x-0" : "transform -translate-x-full"
          }`}
        >
          <Sidebar />
        </div>
      </div>

      {/* PC時には常に表示 */}
      <div className="hidden md:flex w-1/5">
        <Sidebar />
      </div>
      <div className="flex-1">
        <Chat />
      </div>
    </div>
  );
}
