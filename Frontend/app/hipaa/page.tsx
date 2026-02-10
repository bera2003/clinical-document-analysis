export default function HIPAA() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">

      {/* TRUST HERO */}
      <div className="max-w-6xl mx-auto px-6 py-28 text-center">

        <p className="text-blue-400 font-semibold mb-3">
          Trust Center
        </p>

        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          HIPAA-Aligned Security
        </h1>

        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Clinical NLP is designed with healthcare-grade safeguards to help
          organizations protect sensitive information and operate with
          confidence in regulated environments.
        </p>

        {/* IMPORTANT SAFE WORDING */}
        <p className="text-sm text-gray-500 mt-4">
          Our platform supports compliance-ready architectures but should be
          evaluated by each organization based on its regulatory needs.
        </p>

      </div>



      {/* COMPLIANCE PILLARS */}
      <div className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-2 gap-10">

        {[
          {
            title: "Encryption Everywhere",
            desc: "Data is protected both in transit and at rest using modern encryption standards."
          },
          {
            title: "Access Control",
            desc: "Role-based permissions ensure only authorized individuals can access sensitive information."
          },
          {
            title: "Audit Readiness",
            desc: "System activity can be monitored to support transparency and accountability."
          },
          {
            title: "Secure Infrastructure",
            desc: "Built on hardened cloud environments designed for reliability and protection."
          },
          {
            title: "Data Minimization",
            desc: "We encourage collecting only the data necessary for operational effectiveness."
          },
          {
            title: "Ongoing Safeguards",
            desc: "Security practices evolve continuously to address emerging threats."
          },
        ].map((item, i) => (

          <div
            key={i}
            className="
              p-10 rounded-2xl
              border border-white/10
              bg-gradient-to-br from-white/5 to-transparent
              hover:border-blue-500/40
              transition
            "
          >
            <h2 className="text-2xl font-semibold mb-3">
              {item.title}
            </h2>

            <p className="text-gray-400 leading-7">
              {item.desc}
            </p>
          </div>

        ))}

      </div>



      {/* SHARED RESPONSIBILITY */}
      <div className="border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">

          <h2 className="text-3xl font-bold mb-4">
            Shared Responsibility Model
          </h2>

          <p className="text-gray-400 leading-8">
            Maintaining compliance is a collaborative effort. While Clinical NLP
            provides secure infrastructure and protective controls, healthcare
            organizations are responsible for configuring workflows and data
            practices according to their regulatory obligations.
          </p>

        </div>
      </div>



      {/* SECURITY CTA */}
      <div className="border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">

          <h2 className="text-3xl font-bold mb-4">
            Security Is Built Into Everything We Do
          </h2>

          <p className="text-gray-400 mb-8">
            Our commitment to safeguarding data drives every architectural
            decision — helping teams innovate without compromising trust.
          </p>

          <button className="
            px-8 py-4 rounded-xl
            bg-blue-600 hover:bg-blue-700
            transition shadow-lg shadow-blue-900/30
          ">
            Learn More About Security
          </button>

        </div>
      </div>

    </div>
  )
}
