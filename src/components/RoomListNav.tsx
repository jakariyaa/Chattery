import React from "react";
import { Menu, X } from "lucide-react";

interface Room {
  id: number;
  name: string;
}

interface RoomListNavProps {
  selectedRoomId: number | null;
  setSelectedRoomId: (id: number) => void;
  rooms: Room[];
  search: string;
  setSearch: (s: string) => void;
  mode: "sidebar" | "drawer";
  isOpen?: boolean;
  onClose?: () => void;
}

export const RoomListNav: React.FC<RoomListNavProps> = ({
  selectedRoomId,
  setSelectedRoomId,
  rooms,
  search,
  setSearch,
  mode,
  isOpen = true,
  onClose,
}) => {
  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(search.toLowerCase())
  );

  if (mode === "drawer" && !isOpen) return null;

  return (
    <aside
      className={
        mode === "sidebar"
          ? "hidden md:flex w-80 bg-white border-r border-gray-200 flex-col p-6"
          : "fixed top-0 left-0 w-72 max-w-full bg-white border-r border-gray-200 flex flex-col p-6 h-screen shadow-xl animate-slide-in-left z-40"
      }
      style={mode === "sidebar" ? {} : { height: "100vh" }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Rooms</h2>
        {mode === "drawer" && (
          <button onClick={onClose}>
            <X className="text-gray-600 cursor-pointer" />
          </button>
        )}
      </div>
      <input
        type="text"
        placeholder="Search..."
        className="mb-4 px-4 py-2 rounded bg-gray-100 focus:outline-none w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex-1 space-y-3 overflow-y-auto">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
              selectedRoomId === room.id ? "bg-blue-100" : "hover:bg-gray-100"
            }`}
            onClick={() => {
              if (mode === "drawer" && onClose) onClose();
              setSelectedRoomId(room.id);
            }}
          >
            <div>
              <Menu
                className={`w-8 h-8 ${
                  selectedRoomId === room.id ? "text-blue-500" : "text-gray-300"
                }`}
              />
            </div>
            <span
              className={`font-medium ${
                selectedRoomId === room.id ? "text-blue-700" : "text-gray-700"
              }`}
            >
              {room.name}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
};
