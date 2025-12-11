export default function About() {
  return (
    <main className="container-rt py-12 space-y-10">
      <section className="card p-10 text-center bg-gradient-to-br from-brand-50 to-white">
        <h1 className="text-4xl font-extrabold text-brand-700 mb-3">
          About RTC Bliss Drive
        </h1>
        <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
          RTC Bliss Drive Blog was created to celebrate success stories,
          share inspiring road-test journeys, and guide new drivers
          with lessons learned from real people like you.
        </p>
      </section>

      <section className="grid md:grid-cols-3 gap-8">
        {[
          {
            title: "Our Mission",
            desc: "To build confidence in every learner by sharing genuine stories and practical driving insights.",
          },
          {
            title: "Our Vision",
            desc: "A global driving community that learns from one another and celebrates every milestone.",
          },
          {
            title: "Who We Are",
            desc: "A passionate team of instructors, developers, and storytellers making safe driving fun.",
          },
        ].map((item) => (
          <div key={item.title} className="card p-6">
            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
            <p className="text-gray-600">{item.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
