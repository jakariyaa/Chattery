import React from "react";
import { Menu } from "lucide-react";

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
  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="hidden w-80 bg-white border-r border-gray-200 md:flex flex-col p-6">
      <h2 className="text-2xl font-bold mb-6">Rooms</h2>
      <input
        type="text"
        placeholder="Search..."
        className="mb-4 px-4 py-2 rounded bg-gray-100 focus:outline-none"
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
            onClick={() => setSelectedRoomId(room.id)}
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
