import { SubpageShell } from "@/components/SubpageShell";
import { getProblems } from "@/lib/api";

function formatMeta(
  problem: Awaited<ReturnType<typeof getProblems>>[number],
): string {
  const role =
    problem.postedByRole.charAt(0).toUpperCase() +
    problem.postedByRole.slice(1);
  const ago = new Date(problem.createdAt).toDateString();
  return `Posted by ${role} · ${problem.postedByName} · ${problem.location} · ${ago} · ${problem.upvotes} upvotes`;
}

export default async function AdminProblemBoardPage() {
  const problems = await getProblems();

  return (
    <SubpageShell
      variant="admin"
      title="💡 CAMPUS PROBLEM BOARD"
      subtitle="Post a real problem · Claude AI breaks it into 3 actionable quests."
      ctaHref="/admin"
      ctaLabel="← BACK"
      ctaClass="pixel-btn pixel-btn-blue"
    >
      <div className="panel">
        <h2>📝 POST A NEW PROBLEM</h2>
        <form className="grid grid-cols-2 gap-5 max-[900px]:grid-cols-1">
          <div className="field">
            <label htmlFor="posted-by">POSTED BY</label>
            <select id="posted-by" name="postedByRole" defaultValue="student">
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="staff">Staff</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="location">LOCATION / DEPT</label>
            <input
              id="location"
              name="location"
              type="text"
              placeholder="e.g. CICS Building, 3rd floor"
            />
          </div>
          <div className="field col-span-full">
            <label htmlFor="problem">DESCRIBE THE PROBLEM</label>
            <textarea
              id="problem"
              name="description"
              placeholder="e.g. The cafeteria still uses single-use plastic utensils for every meal..."
            />
          </div>
          <div className="col-span-full flex gap-3.5 justify-end mt-2.5">
            <button type="submit" className="pixel-btn pixel-btn-green">
              ▶ POST + GENERATE QUESTS
            </button>
          </div>
        </form>
      </div>

      <h2 className="section-title" style={{ margin: "30px 0 20px" }}>
        <span className="yellow">★</span> RECENT PROBLEMS{" "}
        <span className="yellow">★</span>
      </h2>

      {problems.map((problem) => (
        <div className="problem-card" key={problem.id}>
          <h3>{problem.title}</h3>
          <p className="meta">{formatMeta(problem)}</p>
          <p style={{ fontSize: 18 }}>{problem.description}</p>
          <div className="quest-breakdown">
            <ul className="quest-list">
              {problem.quests.map((quest) => (
                <li key={`${problem.id}-${quest.tier}`}>
                  <span>
                    <b>{quest.tier.toUpperCase()}</b> · {quest.text}
                  </span>
                  <span className="pts">+{quest.points}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </SubpageShell>
  );
}
