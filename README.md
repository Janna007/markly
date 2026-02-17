# Markly: Smart Bookmark Manager

Markly is a high-performance, real-time bookmark management application built with the latest Next.js 15+ App Router, Supabase, and Tailwind CSS v4. It provides a secure, deterministic environment for users to organize and access their links with instant synchronization across devices.

## 🚀 Technical Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Backend**: [Supabase](https://supabase.com/) (Auth, PostgreSQL, Realtime)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Components**: [Radix UI](https://www.radix-ui.com/)

## ✨ Key Features

- **Google OAuth Integration**: Secure, industry-standard authentication using Supabase SSR for robust session management.
- **Real-time Synchronization**: Instant UI updates across multiple tabs/devices via Supabase Realtime (PostgreSQL Changes).
- **Private Data Isolation**: Strict Row Level Security (RLS) policies ensure user data remains completely private.
- **Modern Design System**: A deterministic, premium UI built with Tailwind v4's new CSS-first architectural markers.
- **Server-Side Rendering**: Optimized initial page loads with server-side data fetching.

## 🛠️ Setup Instructions

### 1. Requirements
Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Environment Configuration
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Schema
Execute the following SQL in your Supabase SQL Editor:
```sql
create table bookmarks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  url text not null,
  user_id uuid references auth.users(id) not null
);

-- Enable RLS
alter table bookmarks enable row level security;

-- Policies
create policy "Users can only see their own bookmarks" on bookmarks
  for select using (auth.uid() = user_id);

create policy "Users can only insert their own bookmarks" on bookmarks
  for insert with check (auth.uid() = user_id);

create policy "Users can only delete their own bookmarks" on bookmarks
  for delete using (auth.uid() = user_id);
```

### 4. Running the Application
```bash
npm install
npm run dev
```

## 🧠 Challenges & Solutions

### 1. Robust Server-Side Authentication
**Challenge**: Ensuring seamless session persistence across both Client and Server components in the Next.js App Router.
**Solution**: Leveraged `@supabase/ssr` with custom middleware to handle automatic token refreshing and protected route logic at the edge, ensuring a consistent auth state throughout the application.

### 2. State Deduplication in Real-time Streams
**Challenge**: Managing potential race conditions where a manually added bookmark and a real-time event might update the UI simultaneously.
**Solution**: Implemented a robust ID-based deduplication layer in the client-side state management, ensuring that real-time payloads are only committed if the record doesn't already exist in the local cache.
This ensures that even across multiple tabs or simultaneous actions, the UI remains clean and consistent.

### 3. Modernizing with Tailwind CSS v4
**Challenge**: Working within the new CSS-first configuration model of Tailwind v4 while maintaining a highly specific design system.
**Solution**: Utilized the new `@theme` directive to define a deterministic color palette and font system directly in the global CSS, reducing configuration overhead and improving build performance.

