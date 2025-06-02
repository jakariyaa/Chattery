import React from "react";
import { RoomListNav } from "./RoomListNav";

interface Room {
  id: number;
  name: string;
}

interface SidebarProps {
  selectedRoomId: number | null;
  setSelectedRoomId: (id: number) => void;
  rooms: Room[];
  search: string;
  setSearch: (s: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedRoomId,
  setSelectedRoomId,
  rooms,
  search,
  setSearch,
}) => {
  return (
    <RoomListNav
      mode="sidebar"
      selectedRoomId={selectedRoomId}
      setSelectedRoomId={setSelectedRoomId}
      rooms={rooms}
      search={search}
      setSearch={setSearch}
    />
  );
};
