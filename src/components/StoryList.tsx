"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Story {
  _id: string;
  title: string;
  description: string;
  slug: string;
  image: string;
}

export default function StoryList({ theme }: { theme: string }) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMorePopup, setShowMorePopup] = useState(false);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch(`/api/stories?theme=${theme}`);
        if (!res.ok) throw new Error("Failed to fetch stories");
        const data = await res.json();
        setStories(data.stories);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [theme]);

  if (loading) {
    return <p className="text-center text-gray-400">Loading stories...</p>;
  }

  const visibleStories = stories.slice(0, 4);
  const hasMoreStories = stories.length > 4;

  // Componente de card para as histórias. Recebe a prop opcional "popup" para ajustar os estilos.
  const StoryCard = ({ story, popup = false }: { story: Story; popup?: boolean }) => (
    <Link
      key={story._id}
      href={`/reading/${story.slug}`}
      className={`relative group rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${popup ? "max-h-full" : ""}`}
    >
      <img
        src={story.image}
        alt={story.title}
        className={`w-full ${popup ? "h-64" : "h-48"} object-cover transition-all duration-300 group-hover:scale-110`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className={`font-bold text-white ${popup ? "text-2xl" : "text-xl"}`}>{story.title}</h3>
        <p className={`text-gray-200 ${popup ? "text-lg" : ""}`}>{story.description}</p>
      </div>
    </Link>
  );

  return (
    <div>
      {/* Grid das histórias visíveis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {visibleStories.length === 0 ? (
          <p className="text-gray-400 text-center">No story available.</p>
        ) : (
          visibleStories.map((story) => <StoryCard key={story._id} story={story} />)
        )}
      </div>

      {/* Botão "Ver Mais" modernizado */}
      {hasMoreStories && (
        <div className="text-center mt-4">
          <button
            onClick={() => setShowMorePopup(true)}
            className="rounded-xl px-6 py-3 bg-gradient-to-r bg-[#B3BAFF] hover:bg-[#b3bbff9d] transition-all text-lg font-semibold"
          >
            See more {theme} stories
          </button>
        </div>
      )}

      {/* Pop-up com todas as histórias com container e cards maiores */}
      {showMorePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl max-w-6xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-[#B3BAFF]"> All {theme} stories</h2>
              <button
                onClick={() => setShowMorePopup(false)}
                className="text-[#B3BAFF] hover:text-[#b3bbffa2] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Alteramos o grid para duas colunas em telas maiores para dar mais espaço aos cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
              {stories.map((story) => (
                <StoryCard key={story._id} story={story} popup={true} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
