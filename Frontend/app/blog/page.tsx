import Link from "next/link"

export default function Blog() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-20">

      {/* HERO */}
      <div className="max-w-6xl mx-auto mb-20">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Clinical Insights Blog
        </h1>

        <p className="text-gray-400 text-lg max-w-2xl">
          Explore ideas, innovations, and perspectives at the intersection
          of artificial intelligence and modern healthcare.
        </p>
      </div>



      {/* FEATURED POST */}
      <div className="max-w-6xl mx-auto mb-20">
        <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">

          {/* Fake Image */}
          <div className="h-72 bg-gradient-to-r from-blue-600 to-indigo-700" />

          <div className="p-10">
            <p className="text-blue-400 mb-2">Featured</p>

            <h2 className="text-3xl font-bold mb-4">
              How AI is Transforming Clinical Decision-Making
            </h2>

            <p className="text-gray-400 mb-6 max-w-3xl">
              Artificial intelligence is redefining how healthcare professionals
              interpret data, reduce diagnostic delays, and improve patient
              outcomes. Discover how NLP is leading this transformation.
            </p>

            <Link
  href="/blog/ai-clinical-decision-making"
  className="inline-block px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
>
  Read Article
</Link>
          </div>

        </div>
      </div>



      {/* BLOG GRID */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

        {[
  {
    title: "The Future of AI in Healthcare",
    desc: "A look into emerging technologies shaping the next decade of medical innovation.",
    slug: "future-of-ai"
  },
  {
    title: "Why Clinical Data Needs Structure",
    desc: "Understanding the importance of transforming unstructured notes.",
    slug: "clinical-data-structure"
  },
  {
    title: "Security in Healthcare AI",
    desc: "Best practices for protecting sensitive patient information.",
    slug: "security-in-healthcare"
  },
].map((post, i) => (

          <div
            key={i}
            className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:bg-white/10 transition"
          >

            {/* Fake Image */}
            <div className="h-40 bg-gradient-to-r from-indigo-600 to-purple-700" />

            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">
                {post.title}
              </h3>

              <p className="text-gray-400 mb-4">
                {post.desc}
              </p>

              <Link
  href={`/blog/${post.slug}`}
  className="text-blue-400 hover:underline"
>
  Read More →
</Link>
            </div>

          </div>

        ))}

      </div>

    </div>
  )
}
