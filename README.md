# Chattery

Chattery is a modern, full-stack chat application I built using React, Vite, Tailwind CSS, and Supabase. Through this project, I learned how to leverage Supabase as a backend for authentication, real-time messaging, and user profile management, all powered by PostgreSQL. This journey has been invaluable for deepening my understanding of building real-time web apps with a Postgres backend using Supabase.

### Live Demo: [https://chattery.pages.dev/](https://chattery.pages.dev/)

## What I Learned

- **Supabase Auth**: I implemented user authentication with Google, Facebook, and email, gaining hands-on experience with Supabase Auth and its integration with Postgres.
- **Profile Management**: I designed and managed user profiles (name, age, avatar, color) in a Postgres `profiles` table, learning about relational data modeling and best practices for user data.
- **Real-time Messaging**: By storing messages in a Postgres `messages` table and delivering them in real-time using Supabase's Realtime API (Postgres triggers and websockets), I experienced firsthand how to build a responsive, collaborative chat experience.
- **Room-based UI**: I created a sidebar for chat rooms (mocked for demo purposes), which helped me understand how to structure scalable UIs for chat applications.
- **Modern Frontend Stack**: Building with React 19, Tailwind CSS 4, and Lucide icons, I improved my frontend skills and learned how to create clean, responsive interfaces.

## My Learning Focus

This project helped me:

- Use Supabase as a backend for authentication and real-time data with PostgreSQL.
- Structure a Postgres database for chat apps (users, profiles, messages).
- Subscribe to real-time changes in Postgres tables using Supabase's Realtime API.
- Build a modern React frontend with Vite and Tailwind CSS.

## Project Structure

```
├── src/
│   ├── App.tsx            # Main app logic, session/profile management
│   ├── supabaseClient.ts  # Supabase client setup
│   ├── components/
│   │   ├── Chat.tsx       # Real-time chat UI and logic
│   │   ├── HeaderNav.tsx  # Top navigation bar
│   │   ├── Sidebar.tsx    # Room list (mocked)
│   │   └── SetupProfile.tsx # Profile setup/edit form
│   ├── utils/
│   │   └── TimeFormatter.ts # Utility for formatting timestamps in chat
│   ├── main.tsx           # React entry point
│   └── index.css          # Tailwind CSS import
├── index.html             # App entry HTML
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite + Tailwind config
└── ...
```

## Database Schema (Postgres via Supabase)

- **profiles**: Stores user profile info (id, fullname, age, avatar_url, color)
- **messages**: Stores chat messages (id, user_id, username, content, inserted_at)

Supabase provides instant RESTful and real-time APIs for these tables, which I used to power the app's backend.

## Getting Started

1. **Clone the repo**
   ```sh
   git clone https://github.com/yourusername/chattery.git
   cd chattery
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Set up Supabase**
   - Create a project at [supabase.com](https://supabase.com/)
   - Create `profiles` and `messages` tables (see below)
   - Get your project URL and anon key
   - Create a `.env` file:
     ```env
     VITE_SUPABASE_URL=your-supabase-url
     VITE_SUPABASE_KEY=your-anon-key
     ```
4. **Run the app**
   ```sh
   npm run dev
   ```

## Example Table Definitions

```sql
-- profiles table
create table profiles (
  id uuid primary key references auth.users(id),
  fullname text,
  age integer,
  avatar_url text,
  color text
);

-- messages table
create table messages (
  id serial primary key,
  user_id uuid references profiles(id),
  username text,
  content text,
  inserted_at timestamp with time zone default timezone('utc', now())
);
```

## Real-time Setup

One of the most exciting parts of this project was learning how Supabase automatically enables real-time on tables. I set up the frontend to subscribe to `messages` inserts, which allowed for instant chat updates and a seamless user experience.

## Customization & Extensions

- I can add more chat rooms or direct messages by extending the schema and UI.
- I could add file uploads, reactions, or notifications.
- I explored Supabase Row Level Security (RLS) for fine-grained access control.

## Acknowledgments

- [Supabase](https://supabase.com/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Lucide](https://lucide.dev/)

## Contact

For questions or feedback, please open an issue on [GitHub](https://github.com/jakariyaa/chattery/issues).
