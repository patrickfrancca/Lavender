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
    return <p className="text-center text-gray-400">Carregando histórias...</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {stories.length === 0 ? (
        <p className="text-gray-400 text-center">Nenhuma história disponível.</p>
      ) : (
        stories.map((story) => (
          <Link
            key={story._id}
            href={`/reading/${story.slug}`}
            className="block p-4 bg-gray-100 rounded-lg shadow hover:bg-gray-200 transition"
          >
            <h3 className="text-xl font-bold text-gray-800">{story.title}</h3>
            <p className="text-gray-600">{story.description}</p>
            <img src={story.image} alt={story.title} className="w-full h-40 object-cover rounded-md mb-3" />
          </Link>
        ))
      )}
    </div>
  );
}
