# EagerMinds Bookmarks

A full-stack bookmark management application built with Next.js, Supabase, Tailwind CSS, and Resend.

## Live Demo

https://eagerminds-bookmarks-eight.vercel.app/login

## GitHub Repository

https://github.com/Abhishekyadav1807/eagerminds-bookmarks

## Features

* User Authentication (Signup/Login/Logout)
* Protected Dashboard
* Bookmark CRUD (Create, Read, Update, Delete)
* Public and Private Bookmarks
* Unique User Handles
* Public Profile Pages
* Welcome Emails via Resend
* Row Level Security (RLS) with Supabase
* Responsive UI with Tailwind CSS

## Tech Stack

* Next.js 16
* TypeScript
* Tailwind CSS
* Supabase
* Resend
* Vercel

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=EagerMinds Bookmarks <onboarding@resend.dev>
```

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Deployment

The application is deployed on Vercel.

Deployment steps:

1. Push code to GitHub.
2. Import repository into Vercel.
3. Configure environment variables.
4. Deploy.

## Application Flow

1. User signs up.
2. Welcome email is sent through Resend.
3. User logs in.
4. User manages bookmarks from the dashboard.
5. Public bookmarks are displayed on the user's public profile page.
6. Private bookmarks remain visible only to the owner.

## Security

* Supabase Authentication
* Row Level Security (RLS)
* Protected Dashboard Routes
* Secure Server Actions
* Environment Variables for Secrets

## Author

Abhishek Yadav
