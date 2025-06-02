export default function AboutPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About The Urlist</h1>
        
        <div className="prose prose-lg">
          <p className="text-lg text-gray-600 mb-6">
            The Urlist is a modern URL bookmarking and sharing platform designed to help you organize and share your favorite web resources efficiently.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-600 mb-6">
            We aim to simplify the way people collect, organize, and share web resources. Whether you're a researcher, student, professional, or just someone who loves to curate content, The Urlist provides you with the tools to manage your digital resources effectively.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Features</h2>
          <ul className="list-disc list-inside text-lg text-gray-600 mb-6 space-y-2">
            <li>Create and manage multiple URL lists</li>
            <li>Share lists with custom URLs</li>
            <li>Rich previews for all your links</li>
            <li>Organize with titles and descriptions</li>
            <li>Secure and private lists with optional public sharing</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact</h2>
          <p className="text-lg text-gray-600">
            Have questions or suggestions? Feel free to reach out to us at arnob_t78@yahoo.com
          </p>
        </div>
      </div>
    </div>
  );
} 