# Srimati Jewelers - Client Website

Premium digital jewelry catalog for Srimati Jewelers.

## Tech Stack
- React
- Vite
- JavaScript
- Plain CSS
- Supabase (Backend/Database)
- React Router DOM

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file based on `.env.example`:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Supabase Setup**
   - Run the `supabase/schema.sql` in your Supabase SQL Editor to create tables.
   - Run `supabase/seed.sql` to populate demo data.

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

## Folder Structure

- `/src`: Customer-facing React frontend code.
- `/admin`: Reserved for the Admin Panel developer (contains architecture/database contracts).
- `/supabase`: SQL schema and seed data.

## Architecture & Database

This project implements a parent-child category architecture:
`Parent Category (e.g. Gold) -> Child Category (e.g. Rings) -> Products`

Product specific attributes (weight, purity, finish, collection) are stored on the product itself, not in deep category trees.

## Design Philosophy

- Deep burgundy and antique gold color palette.
- Premium typography.
- High-quality imagery focus.
- Lightweight interactions.
