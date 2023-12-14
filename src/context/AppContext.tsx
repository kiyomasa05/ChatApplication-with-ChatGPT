"use client";

import { onAuthStateChanged, User } from "firebase/auth";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "../../firebase";

type AppProviderProps = {
  children: ReactNode;
};

// userという型はfirebaseで用意してくれている
type AppContextType = {
  user: User | null;
  userId: string | null;
  // 関数のActionを実行するためにのdispatchの型
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  selectedRoom: string | null;
  setSelectedRoom: React.Dispatch<React.SetStateAction<string | null>>;
  selectedRoomName: string | null;
  setSelectedRoomName: React.Dispatch<React.SetStateAction<string | null>>;
};

// デフォルト値を定義する 全て空
const defaultContextData = {
  user: null,
  userId: null,
  setUser: () => {},
  selectedRoom: null,
  setSelectedRoom: () => {},
  selectedRoomName: null,
  setSelectedRoomName: () => {},
};

//引数にデフォルトの設定が必要
const AppContext = createContext<AppContextType>(defaultContextData);

// アプリ全体に反映させるためのproviderを作成
export function AppProvider({ children }: AppProviderProps) {
  // 状態変数を用意
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedRoomName, setSelectedRoomName] = useState<string | null>(null);

  useEffect(() => {
    // firebaseのonAuthStateChanged関数でuser情報を管理
    // DOCS:https://firebase.google.com/docs/auth/web/manage-users?hl=ja
    const unsubscribe = onAuthStateChanged(auth, (newUser) => {
      setUser(newUser);
      setUserId(newUser ? newUser.uid : null);
    });
    // unsubscribeとすることでuser状態を常に監視している状態からアンマウントしたらストップするようにメモリリークを防ぐ
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        userId,
        setUser,
        selectedRoom,
        setSelectedRoom,
        selectedRoomName,
        setSelectedRoomName
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// 各コンポーネントでuseContext(appContext)せずに済むように
export function useAppContext() {
  return useContext(AppContext);
}
