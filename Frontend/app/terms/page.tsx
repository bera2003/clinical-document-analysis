export default function Terms() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* HERO */}
      <div className="relative overflow-hidden border-b border-white/10">
        
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 opacity-40" />

        <div className="relative max-w-5xl mx-auto px-6 py-28 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Terms of Service
          </h1>

          <p className="text-gray-300 text-lg">
            Transparent terms designed to ensure trust, security, and
            responsible platform usage.
          </p>

          <p className="text-gray-500 mt-3 text-sm">
            Effective — February 2026
          </p>
        </div>
      </div>



      {/* TERMS CARDS */}
      <div className="max-w-5xl mx-auto px-6 py-20 space-y-8">

        {[
          {
            title: "Acceptance of Terms",
            desc: "By accessing Clinical NLP, you agree to these terms. If you do not agree, please discontinue use of the platform."
          },
          {
            title: "Responsible Platform Usage",
            desc: "You agree to use the platform in compliance with applicable laws and avoid misuse, unauthorized access, or disruption."
          },
          {
            title: "Account Security",
            desc: "You are responsible for maintaining the confidentiality of your credentials and all activities under your account."
          },
          {
            title: "Data Ownership",
            desc: "Users retain ownership of submitted data. Clinical NLP processes data solely to provide insights and improve services."
          },
          {
            title: "Service Reliability",
            desc: "We strive for high availability but cannot guarantee uninterrupted service due to maintenance or technical events."
          },
          {
            title: "Limitation of Liability",
            desc: "Clinical NLP is provided without warranties. We are not liable for indirect or consequential damages."
          },
          {
            title: "Updates to Terms",
            desc: "We may revise these terms periodically. Continued platform use indicates acceptance of the updated terms."
          }
        ].map((term, i) => (

          <div
            key={i}
            className="
              p-8 rounded-3xl
              bg-gradient-to-br from-white/5 to-white/0
              border border-white/10
              backdrop-blur-xl
              hover:border-white/20
              transition
            "
          >
            <h2 className="text-2xl font-semibold mb-3">
              {term.title}
            </h2>

            <p className="text-gray-400 leading-8">
              {term.desc}
            </p>
          </div>

        ))}

      </div>



      {/* LEGAL NOTICE */}
      <div className="border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">

          <h3 className="text-2xl font-semibold mb-3">
            Questions About These Terms?
          </h3>

          <p className="text-gray-400 mb-6">
            If you have any questions regarding these Terms of Service,
            please contact our support team.
          </p>

          <button className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-900/30">
            Contact Support
          </button>

        </div>
      </div>

    </div>
  )
}
