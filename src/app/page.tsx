'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Auth from '@/components/Auth';
import { LinkIcon, ShareIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';

const features = [
  {
    icon: <LinkIcon className="h-8 w-8 text-blue-600" />,
    title: 'Easy to Create',
    description: 'Create lists in seconds with our simple interface. Add URLs, titles, and descriptions effortlessly.'
  },
  {
    icon: <ShareIcon className="h-8 w-8 text-purple-600" />,
    title: 'Share Instantly',
    description: 'Share your lists with anyone using a simple URL. Perfect for sharing resources, bookmarks, and collections.'
  },
  {
    icon: <PhotoIcon className="h-8 w-8 text-indigo-600" />,
    title: 'Rich Previews',
    description: 'Beautiful previews for all your saved URLs, including titles, descriptions, and images.'
  }
];

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="bg-blue-100 rounded-2xl p-4 inline-block">
                <LinkIcon className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
              The Urlist
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Create and share lists of URLs easily. Perfect for sharing resources, bookmarks, and collections with others.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                href="/new"
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-8 py-3 rounded-xl shadow-md hover:shadow-xl transition-all duration-200"
              >
                Create New List
              </Button>
              <Button
                href="/lists"
                variant="outline"
                className="text-gray-700 border-gray-300 hover:bg-gray-50 text-lg px-8 py-3 rounded-xl"
              >
                View My Lists
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl border border-gray-200/80 bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-100"
              >
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-3 inline-block mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-semibold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Create a List</h3>
              <p className="text-gray-600">Start by creating a new list and give it a memorable name.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xl font-semibold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Add URLs</h3>
              <p className="text-gray-600">Add your favorite URLs to the list with rich previews.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-semibold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Share</h3>
              <p className="text-gray-600">Share your list with others using a simple URL.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Create Your First List?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start organizing and sharing your favorite URLs today.
          </p>
          <Button
            href="/new"
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white text-lg font-semibold px-8 py-3 rounded-xl shadow-md hover:shadow-xl transition-all duration-200"
          >
            Get Started Now
          </Button>
        </div>
      </section>
    </main>
  );
}
