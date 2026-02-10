export default function Integrations() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="text-center py-24 px-6">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Seamless Integrations
        </h1>

        <p className="text-gray-400 max-w-3xl mx-auto text-lg">
          Clinical NLP connects effortlessly with the tools healthcare teams
          already rely on — enabling faster workflows, better collaboration,
          and smarter data exchange.
        </p>
      </section>



      {/* INTEGRATION GRID */}
      <section className="max-w-6xl mx-auto px-8 pb-24 grid sm:grid-cols-2 md:grid-cols-3 gap-8">

        {[
          {
            name: "Electronic Health Records (EHR)",
            desc: "Sync clinical data directly with EHR systems to maintain consistency across patient records."
          },
          {
            name: "Hospital Management Systems",
            desc: "Streamline administrative and clinical workflows with unified data pipelines."
          },
          {
            name: "Cloud Storage Platforms",
            desc: "Securely import and manage large volumes of clinical documents."
          },
          {
            name: "Analytics Platforms",
            desc: "Export structured insights for deeper reporting and operational intelligence."
          },
          {
            name: "Telehealth Solutions",
            desc: "Enhance virtual care with AI-powered clinical documentation."
          },
          {
            name: "Identity Providers",
            desc: "Support secure authentication with SSO and role-based access."
          },
        ].map((tool, i) => (

          <div
            key={i}
            className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            {/* Fake Logo Circle */}
            <div className="w-14 h-14 rounded-xl bg-blue-500/20 mb-4 flex items-center justify-center text-blue-400 font-bold text-xl">
              {tool.name.charAt(0)}
            </div>

            <h3 className="text-xl font-semibold mb-2">
              {tool.name}
            </h3>

            <p className="text-gray-400">
              {tool.desc}
            </p>

          </div>

        ))}

      </section>



      {/* HOW IT WORKS */}
      <section className="border-t border-white/10 py-20 text-center px-6">
        <h2 className="text-3xl font-bold mb-4">
          Built for Effortless Connectivity
        </h2>

        <p className="text-gray-400 max-w-2xl mx-auto">
          Our flexible architecture ensures quick integrations with minimal
          setup — helping organizations unlock value without disrupting
          existing workflows.
        </p>
      </section>

    </div>
  )
}
