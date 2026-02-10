import { blogPosts } from "../blogData";

export default function BlogPost({ params }: any) {

  const post = blogPosts.find(
    (p) => p.slug === params.slug
  );

  if (!post) {
    return <div className="text-white p-20">Article not found.</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-24">

      <div className="max-w-4xl mx-auto">

        {/* Title */}
        <h1 className="text-5xl font-bold mb-10">
          {post.title}
        </h1>

        {/* Article */}
        <div className="text-gray-300 leading-8 whitespace-pre-line text-lg">
          {post.content}
        </div>

      </div>

    </div>
  );
}
