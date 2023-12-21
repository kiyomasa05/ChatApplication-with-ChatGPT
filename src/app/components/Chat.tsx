"use client";

import React, { useEffect, useRef, useState } from "react";
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
import LoadingIcons from "react-loading-icons";

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
  const { selectedRoom, selectedRoomName } = useAppContext();
  const [inputMessage, setInputMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const scrollDiv = useRef<HTMLDivElement>(null);
  const omikuzi = [
    "ヤバめ（いい意味で）",
    "This is a pen.を使う場面が訪れる",
    "勢い'だけ'はある",
    "モテ期近し",
    "凶ではない",
    "君より下はいるはず",
    "大吉(仮)",
  ];
  const d = new Date()
  console.log(new Date());
  console.log(d);
  console.log(new Date());

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
          const newMessages = snapshot.docs.map(
            (doc: any) => doc.data() as Message
          );
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

  useEffect(() => {
    if (scrollDiv.current) {
      const element = scrollDiv.current;
      element.scrollTo({
        top: element.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // messageを送る
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
    const roomDocRef = doc(db, "rooms", selectedRoom!);
    // collectionを取得
    const messageCollectionRef = collection(roomDocRef, "messages");
    await addDoc(messageCollectionRef, messageData);

    setInputMessage("");
    setIsLoading(true);

    //openAIからの返信
    // Docs:https://platform.openai.com/docs/guides/text-generation/chat-completions-api
    const gpt3Response = await openai.chat.completions.create({
      messages: [{ role: "user", content: inputMessage }],
      model: "gpt-3.5-turbo",
    });

    setIsLoading(false);
    // responseの配列からメッセージを取り出す
    const botResponse = gpt3Response.choices[0].message.content;
    // firebaseにresponseを書き込む
    await addDoc(messageCollectionRef, {
      text: botResponse,
      sender: "bot",
      createdAt: serverTimestamp(),
    });
    await addDoc(messageCollectionRef, {
      text:
        "おみくじ😆 : 「 " +
        omikuzi[Math.floor(Math.random() * omikuzi.length)] +
        " 」",
      sender: "bot",
      createdAt: serverTimestamp(),
    });
  };
  return (
    <div className="bg-gray-500 h-full p-4 flex flex-col">
      <h1 className="text-2xl text-white font-semibold mb-4">
        {selectedRoomName}
      </h1>
      <div className="flex-grow overflow-y-auto mb-4" ref={scrollDiv}>
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
        {isLoading && <LoadingIcons.SpinningCircles />}
      </div>
      <div className="flex-shrink-0 relative">
        <textarea
          placeholder="Send a Message"
          className="border-2 rounded w-full pr-10 focus:outline-none p-2"
          onChange={(e) => setInputMessage(e.target.value)}
          value={inputMessage}
          // enterでも送信する
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (e.shiftKey) {
                sendMessage();
              }
            }
          }}
        />
        <button
          className="absolute inset-y-0 right-4 flex items-center"
          onClick={() => sendMessage()}
        >
          <FaPaperPlane />
        </button>
      </div>
      <div className="text-right">
        <span className="text-white">Shift+Enterキーで送信できます。</span>
      </div>
    </div>
  );
};

export default Chat;
