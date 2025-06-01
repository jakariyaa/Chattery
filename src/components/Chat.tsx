import React from "react";
import { supabase } from "../supabaseClient";
import { SendHorizontal, UserRound } from "lucide-react";
import { formatRelativeTime } from "../utils/TimeFormatter";
import type { Profile } from "../App";
import ReactMarkdown from "react-markdown";

interface MessageWithProfile {
  id: number;
  user_id: string;
  username: string;
  content: string;
  inserted_at: string;
  room_id: number;
  profiles: Profile | null;
}

interface ChatProps {
  selectedRoomId: number | null;
}

export const Chat: React.FC<ChatProps> = ({ selectedRoomId }) => {
  const [messages, setMessages] = React.useState<MessageWithProfile[]>([]);
  const [newMessage, setNewMessage] = React.useState("");
  const [userId, setUserId] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error fetching session:", error.message);
        return;
      }
      if (session?.user) {
        setUserId(session.user.id);
      }
    };

    fetchUser();
  }, []);

  React.useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .select("*, profiles(id, full_name, avatar_url, color)")
        .eq("room_id", selectedRoomId)
        .order("inserted_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        setMessages(data as MessageWithProfile[]);
        setLoading(false);
      }
    };

    fetchMessages();

    const subscription = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${selectedRoomId}`,
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [selectedRoomId]);

  React.useEffect(() => {
    const messagesContainer = document.getElementById("messages-container");
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomId) return;
    if (newMessage.trim() === "") return;
    const { error } = await supabase.from("messages").insert([
      {
        user_id: userId,
        content: newMessage.trim(),
        room_id: selectedRoomId,
      },
    ]);
    if (error) {
      console.error("Error sending message:", error.message);
    } else {
      setNewMessage("");
    }
  };

  const handleTextareaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (!e.shiftKey && e.key === "Enter") {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        const event = new Event("submit", { bubbles: true, cancelable: true });
        form.dispatchEvent(event);
      }
    }
  };

  if (loading) {
    return (
      <main className="h-[88vh] md:h-[91.8vh]  flex-1 flex flex-col justify-between relative">
        <div className="flex items-center justify-center flex-1 flex-col space-y-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
          <p className="text-gray-600 text-center">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="h-[88vh] md:h-[91.8vh]  flex-1 flex flex-col justify-between relative">
      <div id="messages-container" className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col space-y-4">
          {messages.map((message) => {
            const isOwn = message.user_id === userId;
            const profiles = message.profiles;
            return (
              <div
                key={message.id}
                className={`flex items-center ${
                  isOwn ? "justify-end" : "justify-start"
                }`}
              >
                {!isOwn &&
                  (profiles?.avatar_url ? (
                    <img
                      src={profiles.avatar_url}
                      alt={profiles.full_name}
                      className="w-12 h-12 rounded-full border-3 border-gray-200 mr-4 object-cover"
                    />
                  ) : (
                    <UserRound className="w-12 h-12 text-gray-400 mr-4 border-2 border-gray-200 rounded-full" />
                  ))}
                <div className="flex flex-col">
                  {!isOwn && profiles && (
                    <div
                      className="text-xs mb-1 font-semibold"
                      style={{ color: profiles.color || undefined }}
                    >
                      {profiles.full_name}
                    </div>
                  )}
                  <div
                    className={`rounded-xl px-4 py-2 max-w-xs break-words shadow-sm text-sm font-medium ${
                      isOwn
                        ? "bg-blue-500 text-white ml-10"
                        : "bg-gray-100 text-gray-900 mr-10"
                    }`}
                  >
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                  <div
                    className={`text-gray-400 text-xs mt-1 ${
                      isOwn ? "ml-auto" : "mr-auto"
                    }`}
                  >
                    {formatRelativeTime(message.inserted_at)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <form
        onSubmit={handleSendMessage}
        className="w-full flex items-center bg-white p-6 border-t border-gray-200"
      >
        <textarea
          ref={textareaRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleTextareaKeyDown}
          placeholder="Type a message... (Markdown supported)"
          rows={1}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-3 mr-4 focus:outline-none bg-gray-50 resize-none min-h-[48px] max-h-40"
          style={{ lineHeight: "1.5", overflow: "auto" }}
        />
        <button
          type="submit"
          className="border-1 border-blue-500 hover:text-white hover:bg-blue-600 text-blue-500 rounded-full p-3 flex items-center justify-center shadow-md"
        >
          <SendHorizontal />
        </button>
      </form>
    </main>
  );
};
