import React from "react";
import { supabase } from "../supabaseClient";
import type { Profile } from "../App";

interface SetupProfileProps {
  userId: string;
  email: string;
  profile: Profile | null;
  onComplete: (updatedProfile: Profile) => void;
  onCancel: () => void;
}

export const SetupProfile: React.FC<SetupProfileProps> = ({
  userId,
  email,
  profile,
  onComplete,
  onCancel,
}) => {
  const [fullName, setFullName] = React.useState(profile?.full_name || "");
  const [age, setAge] = React.useState(profile?.age?.toString() || "");
  const [avatarUrl, setAvatarUrl] = React.useState(profile?.avatar_url || "");
  const [color, setColor] = React.useState(profile?.color || "ff8080");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.from("profiles").upsert([
      {
        id: userId,
        full_name: fullName,
        age: age ? parseInt(age) : null,
        avatar_url: avatarUrl,
        color,
      },
    ]);
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      onComplete({
        id: userId,
        full_name: fullName,
        age: age ? parseInt(age) : 0,
        avatar_url: avatarUrl,
        color,
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96 flex flex-col gap-4"
      >
        <h2 className="text-xl font-bold mb-2">
          {profile ? "Edit" : "Setup"} your profile
        </h2>
        <span className="text-gray-500">Email: {email}</span>
        <input
          className="border p-2 rounded"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          className="border p-2 rounded"
          placeholder="Age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Avatar/Image URL (optional)"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
        />
        <label className="flex items-center gap-2">
          <span>Color:</span>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </label>
        {error && <div className="text-red-500">{error}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
        {profile && (
          <button
            type="button"
            className="text-blue-600 border border-blue-600 py-2 rounded hover:bg-blue-100 cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};
