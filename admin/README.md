# Shrimati Jewellers - Admin Panel

This is the internal Admin application for managing the Shrimati Jewellers catalog.
It is integrated into the root Vite application but logically separated under `/admin`.

## 1. Application Structure

```text
admin/
├── src/
│   ├── components/  # Reusable UI elements (ProtectedRoute)
│   ├── layouts/     # Page layouts (AdminLayout)
│   ├── pages/       # Route components (Login, Dashboard, Categories, Products, Settings)
│   ├── hooks/       # Custom React hooks (useAuth)
│   ├── lib/         # External integrations (supabase.js)
│   ├── utils/       # Utility functions (imageCompression.js)
│   ├── AdminApp.jsx # Main application routing for Admin
│   └── index.css    # Scoped Admin styles
```

## 2. How to Run Locally

1. Open your terminal at the ROOT of the project (`shrimati-jewellers`).
2. Run the development server: `npm run dev`
3. The Admin Panel is accessible at: `http://localhost:5173/admin`

## 3. Required Environment Variables

Create a `.env` file in the ROOT directory (if not already present):
```text
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 5. Manual Supabase Setup (IMPORTANT)

Since this project has a strict rule against automatic Admin user creation, you must **manually** provision your Admin account:

**A. Create the Supabase Auth User:**
1. Go to your Supabase Dashboard.
2. Go to **Authentication** -> **Users**.
3. Click **Add User** -> **Create New User**.
4. Enter an email and password for your Admin account.
5. Disable "Auto Confirm User?" if you haven't set up SMTP, or manually verify the email in the dashboard.
6. Copy the **User UID** of the newly created user.

**B. Authorize the User as an Admin:**
1. Go to **SQL Editor** in your Supabase Dashboard.
2. Run the `supabase/admin_setup.sql` script provided in the repository to create the `admin_users` table and set up all RLS/Storage policies.
3. Manually insert the User UID into the `admin_users` table:
```sql
INSERT INTO public.admin_users (id, email) 
VALUES ('THE-UID-YOU-COPIED', 'your.admin@email.com');
```

## 6. Security & RLS Model

- **Authentication:** Uses Supabase `signInWithPassword()`. Unauthenticated users are redirected to `/login`.
- **Authorization:** Only users whose ID exists in the `admin_users` table are considered authorized admins (via the `is_admin()` SQL function).
- **Row Level Security (RLS):** All CRUD operations (`INSERT`, `UPDATE`, `DELETE`) on categories, products, and product_images are protected by RLS and require `is_admin()`.
- **Public Read Access:** The customer website retains public read access to published products.
- **Storage Model:** A `product-images` bucket has been defined. Admins can upload/delete images. The public can only read them.
- **Credentials:** No Service Role key is used in the frontend. Only the Anon key is used.

## 7. Image Compression Foundation

A reusable browser-side image compression utility has been implemented at `src/utils/imageCompression.js`. It compresses JPEGs and WebPs to a maximum 1200x1200px before uploading to Supabase Storage, preserving customer website performance and reducing bandwidth.

## 8. What is Completed (Phase 1 & 2)

- [x] Separate Vite + React architecture established.
- [x] Dependencies installed (`react-router-dom`, `lucide-react`, `@supabase/supabase-js`).
- [x] Supabase Auth context and login flow.
- [x] Protected routes implementation.
- [x] Professional Admin Layout (Sidebar, Header).
- [x] Dashboard, Categories, Products, and Settings page foundations.
- [x] Admin Theme (`index.css`).
- [x] Admin RLS and Storage Bucket SQL policies generated.
- [x] Image compression utility.

## 9. What Remains for Next Phase

- Complete Categories CRUD UI (Parent & Child).
- Complete Products CRUD UI (Multi-step form, dependent dropdowns).
- Image Upload component (Drag & Drop, integrating the compression utility).
- Data tables for listing categories and products.
