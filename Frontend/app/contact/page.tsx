export default function Contact() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-24">

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">

        {/* LEFT SIDE */}
        <div>
          <h1 className="text-5xl font-bold mb-6">
            Get in Touch
          </h1>

          <p className="text-gray-400 mb-10 text-lg">
            Have questions about Clinical NLP? Want to learn more about our
            platform? We'd love to hear from you.
          </p>

          <div className="space-y-6 text-gray-300">

            <div>
              <p className="font-semibold">Email</p>
              <p className="text-gray-400">
                support@clinicalnlp.com
              </p>
            </div>

            <div>
              <p className="font-semibold">Response Time</p>
              <p className="text-gray-400">
                Typically within 24 hours
              </p>
            </div>

            <div>
              <p className="font-semibold">For Partnerships</p>
              <p className="text-gray-400">
                partnerships@clinicalnlp.com
              </p>
            </div>

          </div>
        </div>



        {/* RIGHT SIDE — FORM */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">

          <h2 className="text-2xl font-semibold mb-6">
            Send us a message
          </h2>

          <form className="space-y-5">

            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-4 rounded-lg bg-black border border-white/10 focus:outline-none focus:border-blue-500"
            />

            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-4 rounded-lg bg-black border border-white/10 focus:outline-none focus:border-blue-500"
            />

            <textarea
              rows={5}
              placeholder="Your Message"
              className="w-full p-4 rounded-lg bg-black border border-white/10 focus:outline-none focus:border-blue-500"
            />

            <button
              className="w-full py-4 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Send Message
            </button>

          </form>

        </div>

      </div>

    </div>
  )
}
