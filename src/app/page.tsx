export default function home() {
  const skills = [
    { id: 1, name: "Vocabulary", description: "Memorize words with the spaced repetition technique that polyglots use.", href: "/vocabulary" },
    { id: 2, name: "Reading", description: "Read immersive stories and use our dictionary word tool.", href: "/reading" },
    { id: 3, name: "Writing", description: "Write something about any topic of your choice, use our grammar checker tool.", href: "/writing" },
    { id: 3, name: "Grammar", description: "Learn grammar rules and practice with our exercises.", href: "/grammar" },
    { id: 4, name: "Listening", description: "listen stories about different topics and answer questions.", href: "/listening" },
    { id: 5, name: "Speaking", description: "Talking in real time with an AI.", href: "/speaking" },
    { id: 5, name: "Pronunciation", description: "Enhancing your pronunciation with our pronunciation tool.", href: "/pronunciation" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4x1 mx-auto px-4">
        <h1 className="text-3x1 font-bold text-center mb-8">LangSaaS</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <a
              key={skill.id}
              href={skill.href}
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-x1 font-semibold mb-2">{skill.name}</h2>
              <p className="text-gray-600">{skill.description}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}