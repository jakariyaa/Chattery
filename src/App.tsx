import React from "react";
import { supabase } from "./supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import type { Session } from "@supabase/supabase-js";
import { Chat } from "./components/Chat";
import { Sidebar } from "./components/Sidebar";
import { HeaderNav } from "./components/HeaderNav";
import { SetupProfile } from "./components/SetupProfile";

export interface Profile {
  id: string;
  full_name: string;
  age: number;
  avatar_url: string;
  color: string;
}

interface Room {
  id: number;
  name: string;
}

type ProfileStatus = "idle" | "loading" | "creating" | "ready";

const DEFAULT_PROFILE = (userId: string, email: string): Profile => ({
  id: userId,
  full_name: email.split("@")[0] || "Anonymous",
  age: 13,
  avatar_url: "",
  color: "#3b82f6",
});

const App: React.FC = () => {
  const [session, setSession] = React.useState<Session | null>(null);
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [profileStatus, setProfileStatus] =
    React.useState<ProfileStatus>("idle");
  const [editProfile, setEditProfile] = React.useState(false);
  const [selectedRoomId, setSelectedRoomId] = React.useState<number>(1);
  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setProfile(null);
      setProfileStatus("idle");
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    const loadOrCreateProfile = async () => {
      if (!session) return;
      setProfileStatus("loading");
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      if (data) {
        setProfile(data as Profile);
        setProfileStatus("ready");
      } else if (error && error.code === "PGRST116") {
        setProfileStatus("creating");
        const defaultProfile = DEFAULT_PROFILE(
          session.user.id,
          session.user.email ?? "anonymous@no-mail"
        );
        const { data: created, error: createError } = await supabase
          .from("profiles")
          .insert([defaultProfile])
          .select()
          .single();
        if (created && !createError) {
          setProfile(created as Profile);
          setProfileStatus("ready");
        } else {
          setProfile(null);
          setProfileStatus("idle");
        }
      } else {
        setProfile(null);
        setProfileStatus("idle");
      }
    };
    if (session && profileStatus === "idle") {
      loadOrCreateProfile();
    }
  }, [session, profileStatus]);

  React.useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("id, name")
        .order("id");
      if (!error && data) setRooms(data);
    };
    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "blue",
                  brandAccent: "darkblue",
                },
              },
            },
          }}
          providers={["google"]}
        />
      </div>
    );
  }

  if (profileStatus === "loading" || profileStatus === "creating") {
    return (
      <main className="h-[88vh] md:h-[91.8vh] flex-1 flex flex-col justify-between relative">
        <div className="flex items-center justify-center flex-1 flex-col space-y-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
          <p className="text-gray-600 text-center">
            {profileStatus === "loading"
              ? "Loading profile..."
              : "Creating profile..."}
          </p>
        </div>
      </main>
    );
  }

  if (session.user.email === undefined || session.user.email === null) {
    session.user.email = "anonymous@no-mail";
  }

  if (profileStatus === "ready" && profile && editProfile) {
    return (
      <SetupProfile
        userId={session.user.id}
        email={session.user.email}
        profile={profile}
        onComplete={async (updatedProfile) => {
          setProfile(updatedProfile);
          setEditProfile(false);
        }}
        onCancel={() => setEditProfile(false)}
      />
    );
  }

  if (profileStatus === "ready" && profile) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <HeaderNav
          email={session.user.email}
          signOut={async () => {
            await supabase.auth.signOut();
            setSession(null);
            setProfile(null);
            setProfileStatus("idle");
          }}
          profile={profile}
          editProfile={() => setEditProfile(true)}
          selectedRoomId={selectedRoomId}
          setSelectedRoomId={setSelectedRoomId}
          rooms={filteredRooms}
          search={search}
          setSearch={setSearch}
        />
        <div className="flex flex-1">
          <Sidebar
            selectedRoomId={selectedRoomId}
            setSelectedRoomId={setSelectedRoomId}
            rooms={filteredRooms}
            search={search}
            setSearch={setSearch}
          />
          <Chat selectedRoomId={selectedRoomId} />
        </div>
      </div>
    );
  }

  // If profile creation failed or is missing, allow user to retry
  return (
    <main className="h-[88vh] md:h-[91.8vh] flex-1 flex flex-col justify-between relative">
      <div className="flex items-center justify-center flex-1 flex-col space-y-6">
        <p className="text-gray-600 text-center">
          Profile could not be loaded or created.{" "}
          <button
            className="underline text-blue-700"
            onClick={() => setProfileStatus("idle")}
          >
            Retry
          </button>
        </p>
      </div>
    </main>
  );
};

export default App;
