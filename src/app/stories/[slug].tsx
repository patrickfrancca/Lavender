import { GetServerSideProps } from 'next';
import dbConnect from '@/app/lib/mongodb';
import Story from '@/app/models/Story';

interface StoryPageProps {
  story: {
    title: string;
    content: string;
  } | null;
}

const StoryPage: React.FC<StoryPageProps> = ({ story }) => {
  if (!story) return <p>Story not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{story.title}</h1>
      <div className="prose">
        <p>{story.content}</p>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  await dbConnect();
  const { slug } = params!;
  const storyDoc = await Story.findOne({ slug });
  const story = storyDoc
    ? {
        title: storyDoc.title,
        content: storyDoc.content,
      }
    : null;

  return {
    props: { story },
  };
};

export default StoryPage;
