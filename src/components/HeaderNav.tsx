import { ChevronDown, CircleUserRound, Menu, X } from "lucide-react";
import type { Profile } from "../App";
import React from "react";

interface Room {
  id: number;
  name: string;
}

interface HeaderNavProps {
  email: string;
  profile: Profile | null;
  signOut: () => void;
  editProfile: () => void;
  selectedRoomId?: number | null;
  setSelectedRoomId?: (id: number) => void;
  rooms: Room[];
  search: string;
  setSearch: (s: string) => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  email,
  profile,
  signOut,
  editProfile,
  selectedRoomId,
  setSelectedRoomId,
  rooms,
  search,
  setSearch,
}) => {
  const [menuIsOpen, setMenuIsOpen] = React.useState(false);
  const [userMenuIsOpen, setUserMenuIsOpen] = React.useState(false);

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <header className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
              onClick={() => setMenuIsOpen(!menuIsOpen)}
            >
              <Menu />
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
            <span className="font-bold text-xl text-blue-600 tracking-tight">
              Chattery
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              className="hidden md:block mt-1 z-10 bg-gray-100 hover:bg-blue-100 text-blue-700 font-medium py-1.5 px-4 rounded-md border border-blue-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-all duration-150"
              onClick={editProfile}
            >
              Edit Profile
            </button>
            <button onClick={() => setUserMenuIsOpen(!userMenuIsOpen)}>
              {profile?.avatar_url ? (
                <img
                  src={profile?.avatar_url}
                  alt="Profile Avatar"
                  className="h-10 w-10 rounded-full object-cover border-1 border-blue-500"
                />
              ) : (
                <CircleUserRound className="h-9 w-9 text-blue-500" />
              )}
              <ChevronDown className="hidden md:block h-4 w-4 absolute right-1.5 lg:right-3 top-6 text-gray-500" />
            </button>
          </div>
        </div>
      </header>

      {userMenuIsOpen && (
        <div className="absolute right-2 top-16 z-40 bg-white border border-gray-200 shadow-lg rounded-lg px-6 py-4 space-y-2 flex flex-col items-end animate-fade-in">
          <div className="flex flex-col items-end w-full">
            <span className="font-semibold text-gray-900 text-base truncate max-w-[180px]">
              {profile?.full_name || "No name"}
            </span>
            <span className="text-xs text-gray-500 text-right truncate max-w-[150px]">
              {email}
            </span>
          </div>
          <button
            type="button"
            className="md:hidden z-20 w-full bg-gradient-to-r from-white to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-600 font-semibold py-2 px-5 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-150"
            onClick={editProfile}
          >
            Edit Profile
          </button>

          <button
            type="button"
            className="z-20 w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-2 px-5 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-150"
            onClick={signOut}
          >
            Sign out
          </button>
        </div>
      )}

      {menuIsOpen && (
        <aside className="fixed top-0 left-0 w-72 max-w-full bg-white border-r border-gray-200 flex flex-col p-6 h-screen shadow-xl animate-slide-in-left z-40">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Rooms</h2>
            <button onClick={() => setMenuIsOpen(false)}>
              <X className="text-gray-600 cursor-pointer" />
            </button>
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
                  selectedRoomId === room.id
                    ? "bg-blue-100"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => {
                  setMenuIsOpen(false);
                  if (setSelectedRoomId) setSelectedRoomId(room.id);
                }}
              >
                <div>
                  <Menu
                    className={`w-8 h-8 ${
                      selectedRoomId === room.id
                        ? "text-blue-500"
                        : "text-gray-300"
                    }`}
                  />
                </div>
                <span
                  className={`font-medium ${
                    selectedRoomId === room.id
                      ? "text-blue-700"
                      : "text-gray-700"
                  }`}
                >
                  {room.name}
                </span>
              </div>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
};
