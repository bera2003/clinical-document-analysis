export default function Features() {
  return (
    <div className="min-h-screen bg-black text-white">

      <div className="max-w-5xl mx-auto px-8 py-20">

        <h1 className="text-5xl font-bold mb-12">
          Features
        </h1>

        {/* FEATURE 1 */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">
            AI-Powered Medical Entity Extraction
          </h2>

          <p className="text-gray-400 leading-7">
            Clinical NLP automatically identifies diagnoses, medications,
            procedures, and critical health indicators from unstructured
            clinical notes. This eliminates manual review and helps
            healthcare professionals focus on patient care instead of
            paperwork.
          </p>
        </div>


        {/* FEATURE 2 */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">
            Real-Time Clinical Insights
          </h2>

          <p className="text-gray-400 leading-7">
            Upload clinical documents and receive structured analytics within
            seconds. Our system processes large volumes of healthcare data
            without compromising accuracy or performance.
          </p>
        </div>


        {/* FEATURE 3 */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">
            Enterprise-Grade Security
          </h2>

          <p className="text-gray-400 leading-7">
            Built with security-first architecture, Clinical NLP protects
            sensitive patient data through encryption, access controls,
            and compliance-ready infrastructure aligned with modern
            healthcare standards.
          </p>
        </div>


        {/* FEATURE 4 */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">
            Smart Clinical Summarization
          </h2>

          <p className="text-gray-400 leading-7">
            Generate concise and accurate summaries from lengthy clinical
            documents, enabling faster decision-making for healthcare teams.
          </p>
        </div>


        {/* FEATURE 5 */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">
            Seamless EHR Integration
          </h2>

          <p className="text-gray-400 leading-7">
            Integrate effortlessly with Electronic Health Record systems to
            streamline workflows and maintain data consistency across platforms.
          </p>
        </div>

      </div>

    </div>
  )
}
