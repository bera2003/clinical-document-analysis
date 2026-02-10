export default function About() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Transforming Healthcare with Intelligent AI
        </h1>

        <p className="text-gray-400 text-lg max-w-3xl mx-auto">
          Clinical NLP was created with a simple vision — to unlock the
          power of unstructured clinical data and help healthcare
          professionals make faster, smarter, and more informed decisions.
        </p>
      </section>



      {/* OUR MISSION */}
      <section className="border-t border-white/10 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-8 py-20 grid md:grid-cols-2 gap-16">

          <div>
            <h2 className="text-3xl font-bold mb-4">
              Our Mission
            </h2>

            <p className="text-gray-400 leading-7">
              We believe critical healthcare insights should never remain
              hidden inside lengthy clinical documents. Our mission is to
              empower organizations with AI-driven tools that transform
              complex medical text into clear, actionable intelligence.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4">
              Why Clinical NLP?
            </h2>

            <p className="text-gray-400 leading-7">
              Healthcare generates massive amounts of unstructured data every
              day. Traditional analysis is slow and error-prone. Clinical NLP
              bridges this gap by delivering speed, accuracy, and scalability
              — enabling teams to focus on what truly matters: patient care.
            </p>
          </div>

        </div>
      </section>



      {/* CORE VALUES */}
      <section className="max-w-6xl mx-auto px-8 py-24">
        <h2 className="text-3xl font-bold text-center mb-16">
          Our Core Principles
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          {[
            {
              title: "Security First",
              desc: "Protecting sensitive healthcare data is foundational to everything we build."
            },
            {
              title: "Built for Impact",
              desc: "We design technology that solves real-world clinical challenges."
            },
            {
              title: "Innovation Driven",
              desc: "We continuously push the boundaries of AI to improve healthcare outcomes."
            },
          ].map((value, i) => (

            <div
              key={i}
              className="p-8 rounded-2xl bg-white/5 border border-white/10"
            >
              <h3 className="text-xl font-semibold mb-3">
                {value.title}
              </h3>

              <p className="text-gray-400">
                {value.desc}
              </p>
            </div>

          ))}

        </div>
      </section>



      {/* CLOSING */}
      <section className="border-t border-white/10 py-20 text-center px-6">
        <h2 className="text-3xl font-bold mb-4">
          Building the Future of Clinical Intelligence
        </h2>

        <p className="text-gray-400 max-w-2xl mx-auto">
          Clinical NLP represents a step toward smarter, data-driven healthcare.
          We are committed to creating technology that enhances decision-making,
          improves efficiency, and ultimately supports better patient outcomes.
        </p>
      </section>

    </div>
  )
}
