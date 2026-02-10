export default function Security() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="text-center py-24 px-6 border-b border-white/10">
        <h1 className="text-6xl font-bold mb-6">
          Security Comes First
        </h1>

        <p className="text-gray-400 max-w-3xl mx-auto text-lg">
          Clinical NLP is built with a security-first architecture to protect
          sensitive healthcare data. Our platform follows modern encryption
          standards, strict access controls, and compliance-ready practices.
        </p>
      </section>



      {/* SECURITY GRID */}
      <section className="max-w-6xl mx-auto px-8 py-20 grid md:grid-cols-3 gap-8">

        {[
          {
            title: "End-to-End Encryption",
            desc: "All data is encrypted during transmission and storage to prevent unauthorized access."
          },
          {
            title: "Role-Based Access Control",
            desc: "Ensure only authorized personnel can view or modify sensitive clinical information."
          },
          {
            title: "Secure Cloud Infrastructure",
            desc: "Hosted on highly secure cloud environments designed for reliability and protection."
          },
          {
            title: "Compliance-Ready Architecture",
            desc: "Designed to align with healthcare security standards and privacy regulations."
          },
          {
            title: "Continuous Monitoring",
            desc: "Real-time system monitoring helps detect threats before they become risks."
          },
          {
            title: "Automated Backups",
            desc: "Regular backups ensure data integrity and rapid recovery in case of incidents."
          },
        ].map((item, i) => (

          <div
            key={i}
            className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <h3 className="text-xl font-semibold mb-3">
              {item.title}
            </h3>

            <p className="text-gray-400 leading-7">
              {item.desc}
            </p>
          </div>

        ))}

      </section>



      {/* TRUST STATEMENT */}
      <section className="text-center pb-24 px-6">
        <h2 className="text-3xl font-bold mb-4">
          Built for Trust in Healthcare AI
        </h2>

        <p className="text-gray-400 max-w-2xl mx-auto">
          We prioritize confidentiality, integrity, and availability to ensure
          healthcare organizations can rely on Clinical NLP with confidence.
        </p>
      </section>

    </div>
  )
}
