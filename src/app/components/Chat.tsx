"use client";

import React, { useEffect, useState } from "react";
import { FaPaperPlane } from "react-icons/fa6";
import {
  Timestamp,
  doc,
  collection,
  addDoc,
  serverTimestamp,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { useAppContext } from "@/context/AppContext";
import OpenAI from "openai";

type Message = {
  text: string;
  sender: string;
  createAt: Timestamp;
};

const Chat = () => {
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });
  const { selectedRoom } = useAppContext();
  const [inputMessage, setInputMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message>([]);

  // 各Roomにおけるメッセージを取得
  useEffect(() => {
    if (selectedRoom) {
      const fetchMessages = async () => {
        // 今選択しているroomからメッセージを取得
        const roomDocRef = doc(db, "rooms", selectedRoom);

        const messagesCollectionRef = collection(roomDocRef, "messages");

        // queryを用意 firestoreに用意してあるquery関数を利用 上で取得したroomCollectionRefを指定、createdAtの順で並べる
        // DOCS:https://firebase.google.com/docs/firestore/query-data/order-limit-data?hl=ja
        const q = query(messagesCollectionRef, orderBy("createdAt"));

        // リアルタイムで反映させるためonsnapを取得
        // DOCS:https://firebase.google.com/docs/firestore/query-data/listen?hl=ja
        const unsubscribe = onSnapshot(q, (snapshot: any) => {
          const newMessages = snapshot.docs.map((doc) => doc.data() as Message);
          setMessages(newMessages);
        });
        return () => {
          unsubscribe();
        };
      };
      fetchMessages();
    }
    // 部屋が選択された時に実行するように
  }, [selectedRoom]);

  const sendMessage = async () => {
    //入力値が無ければ返す
    if (!inputMessage.trim()) return;

    const messageData = {
      text: inputMessage,
      sender: "user",
      createdAt: serverTimestamp(),
    };

    // メッセージをfirestoreに保存する
    // Docs:https://firebase.google.com/docs/firestore/manage-data/add-data?hl=ja
    // roomを取得
    const roomDocRef = doc(db, "rooms", "2aeFeGBzHNdRw1kfdofg");
    // collectionを取得
    const messageCollectionRef = collection(roomDocRef, "messages");
    await addDoc(messageCollectionRef, messageData);
  };
  return (
    <div className="bg-gray-500 h-full p-4 flex flex-col">
      <h1 className="text-2xl text-white font-semibold mb-4">ROOM</h1>
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={message.sender === "user" ? "text-right" : "text-left"}
          >
            <div
              className={
                message.sender === "user"
                  ? "bg-blue-500 inline-block rounded px-4 py-2 mb-2"
                  : "bg-green-500 inline-block rounded px-4 py-2 mb-2"
              }
            >
              <p className="text-white font-medium">{message.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex-shrink-0 relative">
        <input
          type="text"
          placeholder="Send a Message"
          className="border-2 rounded w-full pr-10 focus:outline-none p-2"
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button
          className="absolute inset-y-0 right-4 flex items-center"
          onClick={() => sendMessage()}
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default Chat;
