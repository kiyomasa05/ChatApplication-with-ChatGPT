"use client";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { RiLogoutBoxLine } from "react-icons/ri";
import { db } from "../../../firebase";

type Room = {
  id: string;
  name: string;
  createdAt: Timestamp;
};

const Sidebar = () => {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      // collection(db)を取得 firestoreに用意してあるcollection関数を利用 第一引数db,第二引数コレクションの名前
      // DOCS:https://firebase.google.com/docs/firestore/data-model?hl=ja
      const roomCollectionRef = collection(db, "rooms");

      // queryを用意 firestoreに用意してあるquery関数を利用 上で取得したroomCollectionRefを指定、createdAtの順で並べる
      // DOCS:https://firebase.google.com/docs/firestore/query-data/order-limit-data?hl=ja
      const q = query(
        roomCollectionRef,
        where("userId", "==", "fkF8e6ni9VWHmmkiUrJUY4Rf0p02"),
        orderBy("createdAt")
      );

      // リアルタイムで反映させるためonsnapを取得
      // DOCS:https://firebase.google.com/docs/firestore/query-data/listen?hl=ja
      const unsubscribe = onSnapshot(q, (snapshot: any) => {
        const newRooms = snapshot.docs.map((doc) => ({
          id: doc.id, //doc.idはコレクションのidのこと
          // ...（スプレット構文）にすることでid以外のプロパティも取得可能
          ...doc.data(), // dataはフィールドに指定したcreatedAtやnameなどのこと
        }));
        setRooms(newRooms);
      });
      return () => {
        unsubscribe();
      };
    };

    fetchRooms();
  }, []);

  return (
    <div className="bg-custom-blue h-full overflow-y-auto px-5 flex flex-col">
      <div className="flex-grow">
        <div className="cursol-pointer flex justify-evenly items-center border mt-2 rounded-md hover:bg-blue-800 duration-150">
          <span className="text-white p-4 text-2xl">+</span>
          <h1 className="text-white text-xl font-semibold p-4">new chat</h1>
        </div>
        <ul>
          {rooms.map((room) => (
            <li
              key={room.id}
              className="cursol-ponter border-b p-4 text-slate-100 hover:bg-slate-700 duration-150"
            >
              {room.name}
            </li>
          ))}
          {/* <li className="cursol-ponter border-b p-4 text-slate-100 hover:bg-slate-700 duration-150">
            Room1
          </li>
          <li className="cursol-ponter border-b p-4 text-slate-100 hover:bg-slate-700 duration-150">
            Room1
          </li>
          <li className="cursol-ponter border-b p-4 text-slate-100 hover:bg-slate-700 duration-150">
            Room1
          </li> */}
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
