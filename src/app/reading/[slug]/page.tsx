"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Story {
  title: string;
  description: string;
  content: string;
}

export default function StoryPage() {
  const { slug } = useParams();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchStory = async () => {
      try {
        const res = await fetch(`/api/stories/${slug}`);
        if (!res.ok) throw new Error("Story not found");
        const data = await res.json();
        setStory(data.story);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [slug]);

  if (loading) return <p className="text-center text-black-400">Loading...</p>;
  if (!story) return <p className="text-center text-red-500">Story not found.</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold">{story.title}</h1>
      <p className="text-gray-400 mt-2">{story.description}</p>
      <div className="mt-6 max-w-3xl text-lg leading-relaxed">
        {story.content.split("\n").map((paragraph, index) => (
          <p key={index} className="mb-4">{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
