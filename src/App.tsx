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

const App: React.FC = () => {
  const [session, setSession] = React.useState<Session | null>(null);
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [profileLoaded, setProfileLoaded] = React.useState(false);
  const [editProfile, setEditProfile] = React.useState(false);

  const lastProfileUserId = React.useRef<string | null>(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession((prevSession) => {
        if (prevSession?.user.id !== newSession?.user.id) {
          setProfileLoaded(false);
        }
        return newSession;
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    const fetchProfile = async () => {
      if (session && session.user.id !== lastProfileUserId.current) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (!error && data) {
          setProfile(data as Profile);
        } else {
          setProfile(null);
        }
        lastProfileUserId.current = session.user.id;
        setProfileLoaded(true);
      }
    };
    if (session && !profileLoaded) {
      fetchProfile();
    }
  }, [session, profileLoaded]);

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

  // if (session && !profileLoaded) {
  //   return (
  //     <main className="h-[88vh] md:h-[91.8vh]  flex-1 flex flex-col justify-between relative">
  //       <div className="flex items-center justify-center flex-1 flex-col space-y-6">
  //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
  //         <p className="text-gray-600 text-center">Loading...</p>
  //       </div>
  //     </main>
  //   );
  // }

  if (session.user.email === undefined || session.user.email === null) {
    session.user.email = "anonymous@no-mail";
  }

  if (session && profileLoaded && (!profile || editProfile)) {
    return (
      <SetupProfile
        userId={session.user.id}
        email={session.user.email}
        profile={profile}
        onComplete={(updatedProfile) => {
          setProfile(updatedProfile);
          setProfileLoaded(true);
          setEditProfile(false);
        }}
        onCancel={() => setEditProfile(false)}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <HeaderNav
        email={session.user.email}
        signOut={async () => {
          await supabase.auth.signOut();
          setSession(null);
        }}
        profile={profile}
        editProfile={() => setEditProfile(true)}
      />
      <div className="flex flex-1">
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
};

export default App;
