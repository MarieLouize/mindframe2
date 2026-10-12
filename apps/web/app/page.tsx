const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function Home() {
  return (
    <main>
      <h1>mindframe</h1>
      <p className="lede">
        A scoped node of <strong>Lattice</strong>. Turn source text into a
        source-tagged concept article and a per-topic workbook.
      </p>

      <div className="card">
        <h2>Status</h2>
        <p>
          <span className="tag">v0.0.1</span>
          <span className="tag">pipeline scaffold</span>
          <span className="tag">M0</span>
        </p>
        <p>
          Engine:{" "}
          <a href={`${apiUrl}/health`} target="_blank" rel="noreferrer">
            <code>{apiUrl}/health</code>
          </a>
        </p>
      </div>

      <div className="card">
        <h2>What this will do</h2>
        <ol>
          <li>Ingest a short public-domain text</li>
          <li>Extract source-tagged concept cards</li>
          <li>Sequence them and add a four-mode personal layer</li>
          <li>Generate a per-topic workbook</li>
          <li>Gate and render the deliverable</li>
        </ol>
      </div>

      <div className="card">
        <h2>Platform</h2>
        <p>
          Part of{" "}
          <a href="https://github.com" target="_blank" rel="noreferrer">
            Lattice
          </a>{" "}
          — small public systems sharing one data core.
        </p>
      </div>
    </main>
  );
}
