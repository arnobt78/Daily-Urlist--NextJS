# Daily Urlist - NextJS 🔗

<img width="1248" alt="Screenshot 2025-06-02 at 15 15 10" src="https://github.com/user-attachments/assets/3ca8f3ab-1302-4d3a-84dd-d87c336dbac7" />
<img width="1245" alt="Screenshot 2025-06-02 at 15 15 24" src="https://github.com/user-attachments/assets/6918d01d-1438-434f-a202-b6b51ca3d623" />
<img width="1269" alt="Screenshot 2025-06-02 at 15 16 17" src="https://github.com/user-attachments/assets/ce1ba99c-31c6-4625-b8ae-86becc2b0912" />
<img width="1244" alt="Screenshot 2025-06-02 at 15 16 34" src="https://github.com/user-attachments/assets/f73dc1e4-edb4-4606-b3da-b71b913129ff" />


A modern, elegant URL bookmarking and sharing platform built with Next.js 13+, Supabase, and Tailwind CSS.

**Online-Live:** https://daily-urlist.vercel.app/

## Features ✨

- **Create & Manage Lists**: Easily organize your URLs into custom lists
- **Rich URL Previews**: Automatic fetching of metadata, titles, descriptions, and images
- **Custom URLs**: Create custom slugs for your lists
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Real-time Updates**: Instant updates using Supabase real-time features
- **Authentication**: Secure email/password authentication
- **Share Lists**: Share your curated lists with custom URLs
- **Favorites**: Mark your favorite URLs for quick access
- **Modern Stack**: Built with Next.js 13+, React, Tailwind CSS, and TypeScript

## Tech Stack 🛠️

- **Frontend**: Next.js 13+, React, TypeScript
- **Styling**: Tailwind CSS, Heroicons
- **Backend**: Supabase (Database, Authentication)
- **State Management**: Nanostores
- **Deployment**: Vercel

## Getting Started 🚀

### Prerequisites

- Node.js 16+ 
- npm or yarn
- A Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/urlist.git
   cd urlist
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory:
   ```env
   # Base URL Configuration
   NEXT_PUBLIC_BASE_URL=http://localhost:3000

   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Set up your Supabase project:
   - Create a new project in Supabase
   - Run the migration files in the `supabase/migrations` directory
   - Copy your project URL and anon key to the `.env.local` file

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Production Deployment 🌐

The project is configured for deployment on Vercel. When deploying:

1. Connect your repository to Vercel
2. Set the following environment variables in your Vercel project settings:
   - `NEXT_PUBLIC_BASE_URL=https://daily-urlist.vercel.app`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Project Structure 📁

```
urlist/
├── src/
│   ├── app/                 # Next.js 13+ app directory
│   ├── components/          # React components
│   ├── lib/                 # Utility libraries
│   ├── stores/             # Nanostores state management
│   └── utils/              # Helper functions
├── public/                 # Static assets
├── supabase/              # Supabase configurations
└── ...config files
```

## Key Features in Detail 🔍

### URL List Management
- Create multiple lists of URLs
- Add, edit, and remove URLs from lists
- Automatic metadata fetching for rich previews
- Custom titles and descriptions for URLs

### Authentication
- Secure email/password authentication
- Protected routes for authenticated users
- User-specific list management

### Sharing
- Generate shareable links for lists
- Custom URL slugs for easy sharing
- Public/private list options

### UI/UX
- Responsive design for all screen sizes
- Modern, clean interface
- Loading states and error handling
- Smooth animations and transitions

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

For any questions or suggestions, please contact:
- Support: arnob_t78@yahoo.com
- Legal: arnob_t78@yahoo.com
- Privacy: arnob_t78@yahoo.com

## Acknowledgments 🙏

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Heroicons](https://heroicons.com/)
- [Nanostores](https://github.com/nanostores/nanostores)
