"use client";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useRouter } from "../../node_modules/next/navigation";
import Chat from "./components/Chat";
import Sidebar from "./components/Sidebar";

export default function Home() {
  const { user } = useAppContext();
  const router = useRouter();

  if (!user) {
    router.push("/auth/login");
  }
  return (
    <div className="flex h-screen justify-center items-center">
      <div className="h-full flex" style={{ width: "1280px" }}>
        <div className="w-1/5 h-full border-r">
          <Sidebar />
        </div>
        <div className="w-4/5 h-full">
          <Chat />
        </div>
      </div>
    </div>
  );
}
