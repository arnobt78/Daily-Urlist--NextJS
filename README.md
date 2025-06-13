# The Daily Urlist 🔗 -- NextJS

![alt text](<Screenshot 2025-06-13 at 18.35.24-1.png>)![alt text](<Screenshot 2025-06-13 at 18.35.39.png>)![alt text](<Screenshot 2025-06-13 at 18.35.54.png>)![alt text](<Screenshot 2025-06-13 at 18.36.45.png>)![alt text](<Screenshot 2025-06-13 at 18.37.03.png>)![alt text](<Screenshot 2025-06-13 at 18.37.24.png>)

A modern, elegant URL bookmarking and sharing platform built with Next.js 13+, Supabase, TypeScript, and Tailwind CSS.

**Live Demo:** <https://daily-urlist.vercel.app>

## Features ✨

- **Create & Manage Lists:** Organize your URLs into custom lists with ease.
- **Rich URL Previews:** Automatic fetching of metadata, titles, descriptions, and images for each URL.
- **Custom URLs:** Create custom slugs for your lists.
- **Notes & Reminders:** Add optional notes and reminders to any URL.
- **Responsive Design:** Beautiful, modern UI that works on all devices.
- **Real-time Updates:** Instant updates using Supabase real-time features.
- **Authentication:** Secure email/password authentication.
- **Share Lists:** Share your curated lists with custom URLs.
- **Favorites:** Mark your favorite URLs for quick access.
- **Bulk Import/Export:** Import/export URLs in JSON or CSV format.
- **Modern Stack:** Built with Next.js 13+, React, Tailwind CSS, and TypeScript.

## Tech Stack 🛠️

- **Frontend:** Next.js 13+, React, TypeScript
- **Styling:** Tailwind CSS, Heroicons
- **Backend:** Supabase (Database, Authentication, Realtime)
- **State Management:** Nanostores
- **Deployment:** Vercel

## Getting Started 🚀

### Prerequisites

- Node.js 16+
- npm or yarn
- A Supabase account

### Installation

1. **Clone the repository:**

   ````bash
   git clone https://github.com/yourusername/urlist.git
   cd urlist
   ```markdown

   ````

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Create a `.env.local` file in the root directory:**

   ```env

   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up your Supabase project:**

   - Create a new project in Supabase.
   - Run the migration files in the `supabase/migrations` directory.
   - Copy your project URL and anon key to the `.env.local` file.

5. **Start the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

### Production Deployment 🌐

The project is configured for deployment on Vercel. When deploying:

1. Connect your repository to Vercel.
2. Set the following environment variables in your Vercel project settings:
   - `NEXT_PUBLIC_BASE_URL=https://daily-urlist.vercel.app`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Project Structure 📁

```bash

urlist/
├── src/
│   ├── app/                 # Next.js 13+ app directory (routing, pages, layouts)
│   ├── components/          # React components (lists, UI, layout)
│   ├── lib/                 # Utility libraries (e.g., supabase client)
│   ├── stores/              # Nanostores state management
│   ├── utils/               # Helper functions (e.g., urlMetadata)
│   ├── assets/              # Project images and logos
│   ├── types/               # TypeScript type definitions
│   └── hooks/               # (Reserved for custom React hooks)
├── public/                  # Static assets (logo, favicon, images)
├── supabase/                # Supabase SQL migrations
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── ...
```

## Key Features in Detail 🔍

### URL List Management

- Create, edit, and delete multiple lists of URLs.
- Add, edit, and remove URLs from lists.
- Automatic metadata fetching for rich previews (title, description, image, favicon).
- Add optional notes and reminders to any URL.
- Custom titles and descriptions for URLs.

### Authentication

- Secure email/password authentication.
- Protected routes for authenticated users.
- User-specific list management.

### Sharing

- Generate shareable links for lists.
- Custom URL slugs for easy sharing.
- Public/private list options.
- Collaborator support (invite others to your list).

### UI/UX

- Responsive design for all screen sizes.
- Modern, clean interface with Tailwind CSS.
- Loading states and error handling.
- Smooth animations and transitions.
- Bulk import/export of URLs (JSON/CSV).

### Other Features

- Real-time updates with Supabase.
- Favorites and sorting/filtering.
- Social preview cards with Open Graph and Twitter meta tags.

## Screenshots

<!-- Your existing screenshots and images will remain here. Do not remove or rename them! -->

Look above, thank you!

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📝

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact 📧

For any questions or suggestions, please contact: <arnob_t78@yahoo.com>

## Acknowledgments 🙏

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Heroicons](https://heroicons.com/)
- [Nanostores](https://github.com/nanostores/nanostores)
