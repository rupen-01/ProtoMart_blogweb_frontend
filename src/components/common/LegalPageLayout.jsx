const LegalPageLayout = ({ eyebrow, title, description, lastUpdated, children }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg">
            {description}
          </p>
          <p className="mt-6 text-sm text-slate-300">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <div className="prose prose-slate max-w-none prose-headings:scroll-mt-24 prose-h2:text-2xl prose-h2:font-semibold prose-h3:text-xl prose-li:marker:text-slate-400">
            {children}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LegalPageLayout;
