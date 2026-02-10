export default function APIPage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-20">

      {/* HERO */}
      <div className="max-w-5xl mx-auto mb-16">
        <h1 className="text-5xl font-bold mb-4">
          Clinical NLP API
        </h1>

        <p className="text-gray-400 text-lg">
          Integrate powerful clinical text analysis directly into your
          applications with our fast, secure, and developer-friendly API.
        </p>
      </div>



      {/* BASE URL */}
      <div className="max-w-5xl mx-auto mb-12">
        <p className="text-gray-400 mb-2">Base URL</p>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4 font-mono">
          https://api.clinicalnlp.com/v1
        </div>
      </div>



      {/* SAMPLE REQUEST */}
      <div className="max-w-5xl mx-auto mb-20">
        <h2 className="text-2xl font-semibold mb-4">
          Example Request
        </h2>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 font-mono text-sm text-green-400 overflow-x-auto">
{`POST /analyze

{
  "text": "Patient reports severe chest pain and shortness of breath."
}`}
        </div>
      </div>



      {/* ENDPOINTS */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">
          Available Endpoints
        </h2>

        <div className="space-y-6">

          {[
            {
              method: "POST",
              endpoint: "/analyze",
              desc: "Extract medical entities and clinical insights from text."
            },
            {
              method: "POST",
              endpoint: "/summarize",
              desc: "Generate concise summaries from lengthy clinical documents."
            },
            {
              method: "GET",
              endpoint: "/reports",
              desc: "Retrieve previously analyzed clinical reports."
            },
          ].map((api, i) => (

            <div
              key={i}
              className="p-6 rounded-xl bg-white/5 border border-white/10 flex items-start gap-6"
            >
              <span className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 font-semibold">
                {api.method}
              </span>

              <div>
                <p className="font-mono text-lg">
                  {api.endpoint}
                </p>

                <p className="text-gray-400">
                  {api.desc}
                </p>
              </div>

            </div>

          ))}

        </div>
      </div>

    </div>
  )
}
