import { Menu } from "lucide-react";

// Mock chat list for sidebar
const chatList = [
  { id: 1, name: "Room 1", active: true },
  { id: 2, name: "Room 2", active: false },
  { id: 3, name: "Room 3", active: false },
];

export const Sidebar = () => (
  <aside className="hidden w-80 bg-white border-r border-gray-200 md:flex flex-col p-6">
    <h2 className="text-2xl font-bold mb-6">Rooms</h2>
    <input
      type="text"
      placeholder="Search..."
      className="mb-4 px-4 py-2 rounded bg-gray-100 focus:outline-none"
    />
    <div className="flex-1 space-y-3 overflow-y-auto">
      {chatList.map((chat) => (
        <div
          key={chat.id}
          className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
            chat.active ? "bg-blue-100" : "hover:bg-gray-100"
          }`}
        >
          <div>
            <Menu
              className={`w-8 h-8 ${
                chat.active ? "text-blue-500" : "text-gray-300"
              }`}
            />
          </div>
          <span
            className={`font-medium ${
              chat.active ? "text-blue-700" : "text-gray-700"
            }`}
          >
            {chat.name}
          </span>
        </div>
      ))}
    </div>
  </aside>
);
