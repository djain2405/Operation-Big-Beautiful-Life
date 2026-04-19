import { useState, useEffect, useCallback, useRef } from "react";

// ─── DATA ─────────────────────────────────────────────────────
const T = (text) => ({ text, done: false });
const M = (title, tasks) => ({ title, tasks: tasks.map(T) });
const G = (id, title, date, notes, milestones) => ({ id, title, targetDate: date, status: "on-track", notes, milestones });

const DEFAULT_AREAS = [
  { id: "health", name: "Health & Energy", color: "#10b981", emoji: "💪", goals: [
    G("he1", "Build a sustainable workout identity", "2026-06-30",
      "Have a weekly workout rhythm you can realistically follow. Include running, strength, and one exploratory training style. Be someone who moves daily in some form.", [
      M("Define your fitness system", [
        "Decide what counts as a workout", "Decide what counts as a low-energy workout",
        "Choose your weekly workout structure", "Choose initial workout types: running, strength, exploratory",
        "Decide how you want to track workouts"]),
      M("Build weekly consistency", [
        "Complete first full week of planned workouts", "Test backup low-energy options",
        "Adjust weekly split if unrealistic", "Identify preferred workout times",
        "Reduce friction by preparing clothes/shoes/workout setup"]),
      M("Expand into a balanced rhythm", [
        "Include at least 2 running sessions weekly", "Include at least 2 strength sessions weekly",
        "Add 1 recovery / mobility session", "Try one new training style",
        "Assess what format is most sustainable"]),
    ]),
    G("he2", "Stabilize physical and mental energy", "2026-05-31",
      "Reduce the all-or-nothing cycle. Have a low-energy plan for tired days. Feel more physically regulated and less constantly depleted.", [
      M("Identify energy drains", [
        "List current sources of exhaustion", "Identify top 3 physical drains",
        "Identify top 3 mental/emotional drains", "Define your travel-mode / low-energy standard",
        "Stop using peak-performance expectations during depleted periods"]),
      M("Create an energy support plan", [
        "Define minimum daily standards for food, hydration, movement, sleep",
        "Create a short recovery menu for low-energy days", "Decide what body reset options help most",
        "Identify work tasks that are doable when tired", "Define what 'good enough' looks like on hard days"]),
      M("Improve consistency", [
        "Hit hydration goal most days", "Eat proper meals consistently",
        "Complete body reset most days", "Avoid all-or-nothing crashes",
        "Do weekly energy check-in"]),
    ]),
    G("he3", "Build healthy baseline routines", "2026-06-15",
      "Have a workable rhythm for sleep, hydration, meals, and movement. Create enough stability that productivity is not constantly fighting exhaustion.", [
      M("Define baseline routine", [
        "Define simple morning baseline", "Define simple evening baseline",
        "Define your minimum daily routine", "Remove overly ambitious routine items",
        "Choose 3 non-negotiables only"]),
      M("Practice routine", [
        "Follow morning baseline 4+ days per week", "Follow evening baseline 4+ days per week",
        "Refine routine to fit real life", "Identify what causes routine breakdowns",
        "Simplify further if needed"]),
    ]),
  ]},
  { id: "career", name: "Career & Work Leadership", color: "#6366f1", emoji: "🚀", goals: [
    G("ca1", "Move from doer to enabler at work", "2026-07-31",
      "Build systems that give visibility across projects. Track team growth and ownership more intentionally. Reduce the 'always playing catch-up' feeling.", [
      M("Define what 'enabler' means in your role", [
        "Write what you currently do as a doer", "Write what an enabler version of you would do differently",
        "Identify 3 areas where you are over-involved", "Identify 3 areas where the team needs more ownership",
        "Identify 3 repeat problems that need systems, not heroics"]),
      M("Shift your behavior", [
        "Delegate one meaningful task or area", "Create clear ownership for one workstream",
        "Coach instead of solving in one repeated situation", "Document one recurring process",
        "Create one visibility mechanism for team/project work"]),
      M("Make enabling repeatable", [
        "Review delegation weekly", "Track where you are still a bottleneck",
        "Strengthen team decision-making", "Update team notes regularly",
        "Build weekly leadership rhythm"]),
    ]),
    G("ca2", "Build a lightweight office operating system", "2026-05-31",
      "Have one simple system for tracking active projects, status, blockers, and next actions. Have a repeatable weekly review cadence.", [
      M("Create the tracker structure", [
        "Choose tool for tracker", "Define fields: project, owner, status, blocker, next action, last updated",
        "List all current projects", "Categorize projects by type",
        "Fill in first version for top projects"]),
      M("Make the tracker useful", [
        "Update tracker weekly", "Identify projects needing visibility",
        "Identify top blockers", "Define top weekly priorities",
        "Create Monday and Friday review rhythm"]),
      M("Use system with team", [
        "Decide what can be shared with team", "Use tracker in leadership reviews or planning",
        "Note what changed this week", "Reduce work lost in your head",
        "Refine based on real usage"]),
    ]),
    G("ca3", "Create team management notebooks / growth tracking", "2026-06-15",
      "Have a dedicated page/system for each team member. Track strengths, growth areas, ownership, and follow-ups.", [
      M("Build notebook template", [
        "Decide notebook format/tool", "Create template fields",
        "Include current focus, strengths, growth areas, blockers, ownership, follow-ups",
        "Make one sample notebook"]),
      M("Backfill current team context", [
        "Create notebook for each direct report", "Fill current scope and responsibilities",
        "Write strengths for each person", "Write growth areas for each person",
        "Write current support needed"]),
      M("Use in management rhythm", [
        "Update before or after 1:1s", "Note wins and concerns weekly",
        "Track stretch opportunities", "Track delegation opportunities",
        "Track follow-through on growth support"]),
    ]),
    G("ca4", "Act on performance review feedback", "2026-06-30",
      "Translate feedback into visible leadership behaviors and systems. Show progress in how you lead, delegate, and enable.", [
      M("Translate feedback into themes", [
        "Paste full review feedback into one note", "Highlight major themes",
        "Group feedback into 3-5 categories", "Rewrite each theme as a behavior change needed"]),
      M("Turn themes into systems", [
        "Link each theme to one concrete behavior", "Link each theme to one system or ritual",
        "Define 'what good looks like weekly'", "Choose top 2 feedback themes to work on first"]),
      M("Review progress", [
        "Self-review weekly", "Note examples of improved behavior",
        "Note remaining gaps", "Ask for informal feedback if useful",
        "Refine systems based on what sticks"]),
    ]),
  ]},
  { id: "build", name: "Build & Ship", color: "#f43f5e", emoji: "🛠️", goals: [
    G("bs1", "Ship your current app", "2026-06-30",
      "Aggressive but realistic enough to create urgency. Define MVP, cut non-essential features, finish core launch tasks, ship a first usable version.", [
      M("Define the MVP", [
        "Reopen codebase/product docs", "Audit what is done", "Audit what is unfinished",
        "List bugs separately", "List nice-to-have ideas separately",
        "Define minimum shippable version in one paragraph",
        "Decide what launch means: TestFlight, App Store, public launch"]),
      M("Create launch plan", [
        "Sort all work into must-have, nice-to-have, post-launch",
        "Choose top 3 launch tasks", "Identify biggest blocker",
        "Create launch checklist", "Estimate rough sequence of remaining work"]),
      M("Build toward launch", [
        "Complete each must-have task", "Test core flow regularly",
        "Fix high-priority bugs", "Prepare launch assets if needed",
        "Do final polish only where necessary"]),
      M("Ship", [
        "Final QA pass", "Submit / release", "Announce launch if relevant",
        "Collect first feedback", "Move remaining ideas to post-launch backlog"]),
    ]),
    G("bs2", "Rebuild momentum as a builder", "2026-05-31",
      "Get unstuck. Return to consistent app progress. Stop letting the app live only as emotional pressure.", [
      M("Reconnect with the project", [
        "Open project regularly again", "Review code/product state",
        "Write why the app matters", "Write what currently feels stuck",
        "Identify smallest visible next step"]),
      M("Create rhythm", [
        "Choose recurring app work blocks", "Define what counts as progress",
        "Complete one small visible task", "Capture ideas in one place only",
        "Stop rethinking the whole app every session"]),
    ]),
  ]},
  { id: "thought", name: "Thought Leadership & Public Presence", color: "#8b5cf6", emoji: "🎤", goals: [
    G("tl1", "Rebuild consistency in public presence", "2026-05-31",
      "Return to a sustainable posting rhythm. Stop losing momentum between posts.", [
      M("Create content engine", [
        "Define 3-5 content pillars", "Create one content backlog note",
        "Review recent published work", "Collect old talks/blogs/posts worth repurposing",
        "Choose posting cadence"]),
      M("Restart rhythm", [
        "Publish one LinkedIn post weekly", "Capture 3+ ideas weekly",
        "Repurpose one blog/talk/work lesson into posts",
        "Create simple post structure template", "Reduce friction to posting"]),
      M("Maintain consistency", [
        "Review what posts resonate", "Keep backlog stocked",
        "Tie content to current real work/app progress",
        "Avoid long gaps without posting"]),
    ]),
    G("tl2", "Become known as a go-to voice in Mobile + AI", "2026-12-31",
      "Build consistent, recognizable content themes. Tie together mobile engineering, AI, leadership, and real product lessons.", [
      M("Clarify positioning", [
        "Define what you want to be known for", "Define who you want to reach",
        "Write a one-paragraph positioning statement", "Decide recurring themes to reinforce"]),
      M("Build evidence publicly", [
        "Publish content in core themes", "Connect app-building journey to your voice",
        "Share practical insights from work/leadership/mobile AI",
        "Continue blog/workshop/talk style thought pieces"]),
      M("Strengthen recognition", [
        "Maintain consistency over months", "Make content recognizable in style and substance",
        "Engage with relevant communities", "Keep output aligned to positioning"]),
    ]),
    G("tl3", "Build a repeatable content system", "2026-06-15",
      "Have content pillars. Have an idea backlog. Repurpose talks, blog posts, app work, and leadership lessons.", [
      M("Set up infrastructure", [
        "Create idea backlog", "Create pillar list",
        "Create templates for short post, long post, repurpose note",
        "Create 'published' archive"]),
      M("Systemize repurposing", [
        "Turn each blog into 2-3 post ideas", "Turn each app insight into 1-2 posts",
        "Turn each work/leadership lesson into content", "Build a rolling backlog"]),
    ]),
  ]},
  { id: "love", name: "Love, Relationships & Social Life", color: "#ec4899", emoji: "💕", goals: [
    G("lo1", "Date intentionally toward partnership", "2026-09-30",
      "Be actively open to dating. Have clarity on what you want. Take real steps instead of leaving this only in dream mode.", [
      M("Clarify vision", [
        "Write what kind of relationship you want", "Define qualities you want in a partner",
        "Define relationship standards", "Define what intentional dating means for you"]),
      M("Open the channel", [
        "Decide how you want to meet people", "Update or create dating profile if using apps",
        "Identify social avenues to meet people", "Schedule time/energy for dating"]),
      M("Build active practice", [
        "Take one dating action weekly", "Reflect on experiences without spiraling",
        "Refine standards as you learn", "Stay open while protecting your energy"]),
    ]),
    G("lo2", "Build a fuller life outside of work", "2026-07-31",
      "Have hobbies, experiences, and social moments built into your life. Feel self-fulfilled, not just professionally driven.", [
      M("Identify what feels alive", [
        "List hobbies/interests you want to explore", "List experiences you want more of",
        "Choose top 2 hobbies for now", "Define what a fuller week would include"]),
      M("Make space for joy", [
        "Schedule one hobby/joy block weekly", "Try one new thing",
        "Plan one personal or social outing", "Make fun visible in calendar/system"]),
      M("Build identity beyond work", [
        "Reflect on who you are outside productivity", "Protect personal time more intentionally",
        "Notice when work starts consuming identity", "Re-anchor into lived life"]),
    ]),
    G("lo3", "Strengthen self-trust and self-fulfillment", "2026-08-31",
      "Feel more internally anchored. Build a life that feels rich regardless of relationship status.", [
      M("Build inner support", [
        "Define what self-fulfilled means to you", "Identify where you abandon yourself",
        "Identify what supports your confidence and peace", "Create a short self-check-in practice"]),
      M("Reinforce self-trust", [
        "Keep small promises to yourself", "Track follow-through on habits",
        "Reduce self-attack after low-output days", "Record identity wins, not just task wins"]),
    ]),
  ]},
  { id: "home", name: "Home & Lifestyle", color: "#f59e0b", emoji: "🏡", goals: [
    G("ho1", "Keep apartment guest-ready and easy to maintain", "2026-06-15",
      "Everything has a place. Mess does not pile into chaos. Home feels calm and welcoming.", [
      M("Define the standard", [
        "Define what guest-ready means", "Identify key zones",
        "Identify major clutter points", "Write daily reset checklist",
        "Write weekly reset checklist"]),
      M("Organize the space", [
        "Assign homes for important items", "Declutter one problem zone at a time",
        "Reduce visual clutter", "Simplify storage where needed"]),
      M("Maintain consistently", [
        "Do daily reset", "Do weekly deeper reset",
        "Keep surfaces, dishes, laundry manageable", "Do guest-ready pass regularly"]),
    ]),
    G("ho2", "Build discipline into daily life through environment", "2026-07-15",
      "Chores feel manageable. Home reset becomes normal. Your space supports the life you want.", [
      M("Reduce friction", [
        "Identify which chores pile up most", "Break chores into smaller recurring tasks",
        "Define cadence for dishes, laundry, trash, tidying",
        "Pair chores with triggers or time anchors"]),
      M("Create discipline rhythm", [
        "Complete daily reset most days", "Complete weekly home block",
        "Prep environment for tomorrow", "Notice where discipline breaks down"]),
    ]),
    G("ho3", "Build a lifestyle that feels beautiful and alive", "2026-08-31",
      "Your home and routines feel like a reflection of your dream life. Not just functional, but grounding and joyful.", [
      M("Define your desired lifestyle feel", [
        "Write what your dream apartment/lifestyle feels like",
        "Identify what makes home feel calm and beautiful",
        "Identify aesthetic/lifestyle upgrades that matter most"]),
      M("Embody it gradually", [
        "Make one small upgrade at a time", "Maintain environment intentionally",
        "Use space for joy and life, not just recovery", "Align routines with desired identity"]),
    ]),
  ]},
  { id: "admin", name: "Admin, Money & Immigration", color: "#f97316", emoji: "💰", goals: [
    G("ad1", "Finalize EB-1A and start O-1A process", "2026-04-30",
      "EB-1A: maintain responsiveness until filed/complete. O-1A sheet first pass: by April 30, 2026.", [
      M("Stabilize EB-1A tracking", [
        "Maintain one immigration tracker",
        "Mark EB-1A as pending on me / pending on them / done",
        "Keep tracker updated", "Respond quickly to new asks"]),
      M("Start O-1A preparation", [
        "Open O-1A sheet", "Do messy first pass", "Mark unknowns as NEEDS INFO",
        "Identify overlap with EB-1A evidence", "List questions that come up"]),
      M("Build O-1A readiness", [
        "Gather needed info", "Fill remaining blanks",
        "Organize reusable evidence", "Clarify differences from EB-1A"]),
    ]),
    G("ad2", "Build a reliable personal admin rhythm", "2026-05-31",
      "Budget, finances, documents, and practical tasks stop floating in your head.", [
      M("Capture all admin", [
        "Create one life admin note/tracker", "Dump all pending practical tasks",
        "Sort by money, forms, appointments, misc", "Choose top 3 pending adult tasks"]),
      M("Build recurring admin block", [
        "Schedule one weekly admin slot", "Handle at least one overdue task per week",
        "Keep documents filed", "Reduce floating practical stress"]),
    ]),
    G("ad3", "Improve financial visibility", "2026-06-30",
      "Have a basic budgeting / money review rhythm. Be clearer on spending and future financial priorities.", [
      M("Create money visibility", [
        "Review current spending", "Define main financial buckets",
        "Decide how you want to track budget", "List financial priorities"]),
      M("Build review rhythm", [
        "Do monthly finance review", "Note unusual spending",
        "Check progress on financial priorities", "Connect spending to dream goals"]),
    ]),
  ]},
  { id: "dream", name: "Dream Life & Future Expansion", color: "#14b8a6", emoji: "✨", goals: [
    G("dr1", "Keep long-term dreams alive without overwhelming the present", "2026-05-31",
      "Capture your someday dreams. Stop letting them become guilt clouds.", [
      M("Capture all dreams", [
        "Create someday dreams note",
        "List cafe, novel, home, travel, other dream tracks",
        "Write one sentence for what each means"]),
      M("Separate active vs parked", [
        "Label each dream as someday / maybe soon / not now",
        "Choose one dream to nurture lightly this year",
        "Stop mixing dream goals with weekly execution"]),
    ]),
    G("dr2", "Define your major long-term dream tracks", "2026-06-30",
      "Cafe dream. Novel. Future home. Travel vision.", [
      M("Clarify each dream", [
        "Write what opening a cafe would actually mean",
        "Write what writing a novel would mean",
        "Write what buying a home would mean", "Write your travel vision"]),
      M("Identify future prerequisites", [
        "Note what skills, money, time, or life stage each dream requires",
        "Note which dreams are 1-2 year vs later",
        "Avoid turning them into current guilt"]),
    ]),
    G("dr3", "Make gentle progress on one dream track this year", "2026-12-31",
      "Choose one dream to nurture lightly, without making it a second job.", [
      M("Choose one", [
        "Decide which dream gets gentle nurturing",
        "Define what 'gentle progress' means", "Create one monthly touchpoint"]),
      M("Keep it alive lightly", [
        "Research, write, save inspiration, or plan one small step monthly",
        "Keep notes in one place", "Review quarterly"]),
    ]),
  ]},
];

const DEFAULT_HABITS = [
  { id: "h01", name: "Movement / exercise done" },
  { id: "h02", name: "Water / hydration target met" },
  { id: "h03", name: "Slept at reasonable time" },
  { id: "h04", name: "Ate proper meals" },
  { id: "h05", name: "10-min body reset / stretch" },
  { id: "h06", name: "Deep work block completed" },
  { id: "h07", name: "Leadership task (not just reactive)" },
  { id: "h08", name: "Worked on app, even briefly" },
  { id: "h09", name: "Content idea captured" },
  { id: "h10", name: "Did something enjoyable outside work" },
  { id: "h11", name: "Reached out to someone" },
  { id: "h12", name: "10-min home reset" },
  { id: "h13", name: "Journaled / self check-in" },
  { id: "h14", name: "Prep for tomorrow done" },
];

const STORAGE_KEY = "life-command-center-v3";
const today = () => new Date().toISOString().slice(0, 10);
const getWeekId = (d) => { const dt = new Date(d); const j = new Date(dt.getFullYear(),0,1); return `${dt.getFullYear()}-W${String(Math.ceil(((dt-j)/864e5+j.getDay()+1)/7)).padStart(2,"0")}`; };
const uid = () => Math.random().toString(36).slice(2, 8);

// ─── PROGRESS CALCULATORS ────────────────────────────────────
const goalProgress = (g) => {
  const tasks = g.milestones.flatMap(m => m.tasks);
  if (!tasks.length) return 0;
  return Math.round(tasks.filter(t => t.done).length / tasks.length * 100);
};
const milestoneProgress = (m) => {
  if (!m.tasks.length) return 0;
  return Math.round(m.tasks.filter(t => t.done).length / m.tasks.length * 100);
};
const areaProgress = (a) => {
  if (!a.goals.length) return 0;
  return Math.round(a.goals.reduce((s, g) => s + goalProgress(g), 0) / a.goals.length);
};

// ─── COMPONENTS ──────────────────────────────────────────────
function ProgressRing({ progress, color, size = 80, sw = 6 }) {
  const r = (size - sw) / 2, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={sw} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c - (progress/100)*c} style={{ transition: "stroke-dashoffset 0.6s ease" }} />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central" fill={color}
        fontSize={size*0.22} fontWeight="700" style={{ transform: "rotate(90deg)", transformOrigin: "center" }}>
        {Math.round(progress)}%
      </text>
    </svg>
  );
}

function ProgressBar({ progress, color, height = 6 }) {
  return (
    <div style={{ flex: 1, height, background: "rgba(255,255,255,0.06)", borderRadius: height/2 }}>
      <div style={{ width: `${progress}%`, height: "100%", borderRadius: height/2, background: color, transition: "width 0.4s" }} />
    </div>
  );
}

function StarRating({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1,2,3,4,5].map(s => (
        <button key={s} onClick={() => onChange(s)} style={{
          background: "none", border: "none", cursor: "pointer", fontSize: 22, padding: 2,
          color: s <= value ? "#f59e0b" : "rgba(255,255,255,0.15)",
          transition: "transform 0.15s", transform: s <= value ? "scale(1.15)" : "scale(1)",
        }}>★</button>
      ))}
    </div>
  );
}

function StatusPill({ status }) {
  const m = { "on-track": { bg: "rgba(16,185,129,0.15)", c: "#10b981", l: "On Track" },
    "at-risk": { bg: "rgba(245,158,11,0.15)", c: "#f59e0b", l: "At Risk" },
    done: { bg: "rgba(99,102,241,0.15)", c: "#6366f1", l: "Done" } };
  const s = m[status] || m["on-track"];
  return <span style={{ background: s.bg, color: s.c, fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 99, letterSpacing: 0.3, textTransform: "uppercase" }}>{s.l}</span>;
}

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#1a1d2e", borderRadius: 16, padding: 28, width: "92%", maxWidth: 480, border: "1px solid rgba(255,255,255,0.08)", maxHeight: "85vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, color: "#fff" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "#aaa", fontSize: 18, width: 32, height: 32, borderRadius: 8, cursor: "pointer" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const cardStyle = { background: "rgba(255,255,255,0.03)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", padding: 20, marginBottom: 16 };
const inputStyle = { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 12px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" };

// ─── MAIN APP ────────────────────────────────────────────────
export default function LifeCommandCenter() {
  const [tab, setTab] = useState("today");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedGoal, setExpandedGoal] = useState(null);
  const [expandedArea, setExpandedArea] = useState(null);
  const [newHabit, setNewHabit] = useState("");
  const [editingHabit, setEditingHabit] = useState(null);
  const [editingHabitName, setEditingHabitName] = useState("");
  const [areaModal, setAreaModal] = useState(null);
  const [areaForm, setAreaForm] = useState({ name: "", color: "", emoji: "" });
  const saveTimeout = useRef(null);
  const fileInputRef = useRef(null);
  const [importMsg, setImportMsg] = useState(null);

  const loadData = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        const ids = new Set(saved.areas.map(a => a.id));
        const newA = DEFAULT_AREAS.filter(a => !ids.has(a.id));
        if (newA.length) saved.areas = [...saved.areas, ...newA];
        setData(saved);
      } else {
        const init = { areas: DEFAULT_AREAS, habits: DEFAULT_HABITS, habitLog: {}, priorities: {}, dayRatings: {}, weeklyReviews: {} };
        setData(init);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(init));
      }
    } catch {
      setData({ areas: DEFAULT_AREAS, habits: DEFAULT_HABITS, habitLog: {}, priorities: {}, dayRatings: {}, weeklyReviews: {} });
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const persist = useCallback((nd) => {
    setData(nd);
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(nd)); } catch {} }, 400);
  }, []);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0f1119", color: "#6366f1", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ textAlign: "center" }}><div style={{ fontSize: 40, marginBottom: 12 }}>⚡</div><div style={{ fontSize: 16, fontWeight: 500 }}>Loading your command center…</div></div>
    </div>
  );

  const d = today();
  const todayPriorities = data.priorities[d] || ["", "", ""];
  const todayRating = data.dayRatings[d] || 0;
  const overallProg = data.areas.length ? Math.round(data.areas.reduce((s, a) => s + areaProgress(a), 0) / data.areas.length) : 0;

  const setPriority = (i, v) => { const p = { ...data.priorities }; p[d] = [...(p[d] || ["","",""])]; p[d][i] = v; persist({ ...data, priorities: p }); };
  const setRating = (v) => { const r = { ...data.dayRatings }; r[d] = v; persist({ ...data, dayRatings: r }); };
  const toggleHabit = (hid) => { const l = { ...data.habitLog }; l[`${d}:${hid}`] = !l[`${d}:${hid}`]; persist({ ...data, habitLog: l }); };
  const getStreak = (hid) => { let s = 0; const dt = new Date(); while (data.habitLog[`${dt.toISOString().slice(0,10)}:${hid}`]) { s++; dt.setDate(dt.getDate()-1); } return s; };
  const habitsToday = data.habits.filter(h => data.habitLog[`${d}:${h.id}`]).length;

  const toggleTask = (areaId, goalId, mi, ti) => {
    const areas = data.areas.map(a => {
      if (a.id !== areaId) return a;
      return { ...a, goals: a.goals.map(g => {
        if (g.id !== goalId) return g;
        const milestones = g.milestones.map((m, mIdx) => {
          if (mIdx !== mi) return m;
          return { ...m, tasks: m.tasks.map((t, tIdx) => tIdx === ti ? { ...t, done: !t.done } : t) };
        });
        const prog = goalProgress({ ...g, milestones });
        let status = g.status;
        if (prog === 100) status = "done";
        else if (status === "done") status = "on-track";
        return { ...g, milestones, status };
      })};
    });
    persist({ ...data, areas });
  };

  const updateGoalStatus = (areaId, goalId, status) => {
    const areas = data.areas.map(a => a.id === areaId ? { ...a, goals: a.goals.map(g => g.id === goalId ? { ...g, status } : g) } : a);
    persist({ ...data, areas });
  };

  const addHabit = () => { if (!newHabit.trim()) return; persist({ ...data, habits: [...data.habits, { id: uid(), name: newHabit.trim() }] }); setNewHabit(""); };
  const deleteHabit = (id) => persist({ ...data, habits: data.habits.filter(h => h.id !== id) });
  const renameHabit = (id) => { if (!editingHabitName.trim()) return; persist({ ...data, habits: data.habits.map(h => h.id === id ? { ...h, name: editingHabitName.trim() } : h) }); setEditingHabit(null); };
  const updateArea = (aid) => { const areas = data.areas.map(a => a.id === aid ? { ...a, name: areaForm.name||a.name, color: areaForm.color||a.color, emoji: areaForm.emoji||a.emoji } : a); persist({ ...data, areas }); setAreaModal(null); };

  const wk = getWeekId(d);
  const weekReview = data.weeklyReviews[wk] || { wins: ["","",""], blocker: "" };
  const setWeekReview = (u) => { const wr = { ...data.weeklyReviews }; wr[wk] = { ...weekReview, ...u }; persist({ ...data, weeklyReviews: wr }); };
  const last7 = Array.from({ length: 7 }, (_, i) => { const dt = new Date(); dt.setDate(dt.getDate()-i); return dt.toISOString().slice(0,10); });
  const weekHabitsDone = last7.reduce((s, day) => s + data.habits.filter(h => data.habitLog[`${day}:${h.id}`]).length, 0);
  const avgRating = (() => { const r = last7.map(d2 => data.dayRatings[d2]).filter(Boolean); return r.length ? (r.reduce((a,b) => a+b, 0)/r.length).toFixed(1) : "—"; })();

  const resetData = () => {
    if (confirm("Reset ALL data? This cannot be undone.")) {
      const init = { areas: DEFAULT_AREAS, habits: DEFAULT_HABITS, habitLog: {}, priorities: {}, dayRatings: {}, weeklyReviews: {} };
      setData(init);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(init)); } catch {}
    }
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `life-command-center-backup-${today()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const imported = JSON.parse(ev.target.result);
        if (!imported.areas || !imported.habits) { setImportMsg("Invalid file — missing areas or habits."); return; }
        persist(imported);
        setImportMsg("Data restored successfully!");
        setTimeout(() => setImportMsg(null), 3000);
      } catch { setImportMsg("Failed to parse file."); setTimeout(() => setImportMsg(null), 3000); }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const upcoming = data.areas.flatMap(a => a.goals.filter(g => g.status !== "done" && g.targetDate).map(g => ({ ...g, area: a.name, color: a.color, prog: goalProgress(g) })))
    .filter(g => { const diff = (new Date(g.targetDate) - new Date()) / 864e5; return diff <= 30 && diff >= -7; })
    .sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate)).slice(0, 5);

  const TABS = [
    { id: "today", label: "Today", icon: "⚡" },
    { id: "goals", label: "Goals", icon: "🎯" },
    { id: "review", label: "Review", icon: "📊" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#0f1119", color: "#e2e8f0", minHeight: "100vh", maxWidth: 720, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ padding: "28px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, background: "linear-gradient(135deg, #6366f1, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Life Command Center
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <div style={{ background: "rgba(99,102,241,0.1)", borderRadius: 12, padding: "8px 14px", fontSize: 13, color: "#6366f1", fontWeight: 600 }}>
          {overallProg}% overall
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, padding: "16px 20px", overflow: "auto" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: tab === t.id ? "rgba(99,102,241,0.15)" : "transparent",
            color: tab === t.id ? "#818cf8" : "#64748b",
            border: tab === t.id ? "1px solid rgba(99,102,241,0.25)" : "1px solid transparent",
            borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600,
            cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s",
          }}><span style={{ marginRight: 6 }}>{t.icon}</span>{t.label}</button>
        ))}
      </div>

      <div style={{ padding: "0 20px 40px" }}>

      {/* ═══ TODAY ═══ */}
      {tab === "today" && <>
        <div style={cardStyle}>
          <h3 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>🎯 Top 3 Priorities</h3>
          {[0,1,2].map(i => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ width: 24, height: 24, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: `rgba(99,102,241,${0.25-i*0.07})`, color: "#818cf8", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i+1}</span>
              <input value={todayPriorities[i]} onChange={e => setPriority(i, e.target.value)} placeholder={`Priority ${i+1}…`}
                style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "9px 12px", color: "#e2e8f0", fontSize: 14, outline: "none" }} />
            </div>
          ))}
        </div>

        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>✅ Daily Habits</h3>
            <span style={{ fontSize: 13, color: "#6366f1", fontWeight: 600 }}>{habitsToday}/{data.habits.length}</span>
          </div>
          {data.habits.map(h => {
            const done = data.habitLog[`${d}:${h.id}`]; const streak = getStreak(h.id);
            return (
              <div key={h.id} onClick={() => toggleHabit(h.id)} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", marginBottom: 5, borderRadius: 10, cursor: "pointer",
                background: done ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${done ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.05)"}`, transition: "all 0.2s",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${done ? "#10b981" : "rgba(255,255,255,0.15)"}`, background: done ? "#10b981" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff" }}>{done ? "✓" : ""}</div>
                  <span style={{ fontSize: 13, color: done ? "#10b981" : "#e2e8f0", textDecoration: done ? "line-through" : "none", opacity: done ? 0.7 : 1 }}>{h.name}</span>
                </div>
                {streak > 0 && <span style={{ fontSize: 10, fontWeight: 600, color: "#f59e0b", background: "rgba(245,158,11,0.1)", padding: "2px 7px", borderRadius: 6 }}>🔥{streak}d</span>}
              </div>
            );
          })}
        </div>

        <div style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>Rate Your Day</h3>
            <p style={{ margin: 0, fontSize: 12, color: "#475569" }}>How intentional were you today?</p>
          </div>
          <StarRating value={todayRating} onChange={setRating} />
        </div>

        {upcoming.length > 0 && <div style={cardStyle}>
          <h3 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>⏰ Upcoming Deadlines</h3>
          {upcoming.map(g => {
            const days = Math.ceil((new Date(g.targetDate) - new Date()) / 864e5);
            return (
              <div key={g.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div><div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{g.title}</div><div style={{ fontSize: 11, color: g.color }}>{g.area}</div></div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: days < 0 ? "#ef4444" : days <= 7 ? "#f59e0b" : "#94a3b8" }}>{days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? "Today!" : `${days}d left`}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>{g.prog}% done</div>
                </div>
              </div>
            );
          })}
        </div>}

        <div style={cardStyle}>
          <h3 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>Life Areas</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {data.areas.map(a => {
              const ap = areaProgress(a);
              return (
                <div key={a.id} onClick={() => { setTab("goals"); setExpandedArea(a.id); }} style={{ textAlign: "center", padding: 10, borderRadius: 12, background: `${a.color}08`, border: `1px solid ${a.color}20`, cursor: "pointer" }}>
                  <ProgressRing progress={ap} color={a.color} size={48} sw={4} />
                  <div style={{ fontSize: 10, color: a.color, fontWeight: 600, marginTop: 4, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {a.emoji} {a.name.split(/[,&]/)[0].trim()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>}

      {/* ═══ GOALS ═══ */}
      {tab === "goals" && <>
        {data.areas.map(area => {
          const ap = areaProgress(area);
          const isAreaOpen = expandedArea === area.id;
          return (
            <div key={area.id} style={{ ...cardStyle, borderLeft: `3px solid ${area.color}` }}>
              <div onClick={() => setExpandedArea(isAreaOpen ? null : area.id)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{area.emoji}</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, color: area.color, fontWeight: 700 }}>{area.name}</h3>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748b" }}>{area.goals.length} goals · {ap}% complete</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <ProgressRing progress={ap} color={area.color} size={46} sw={4} />
                  <span style={{ fontSize: 12, color: "#64748b", transform: isAreaOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▶</span>
                </div>
              </div>

              {isAreaOpen && <div style={{ marginTop: 16 }}>
                {area.goals.map(g => {
                  const gp = goalProgress(g);
                  const isGoalOpen = expandedGoal === g.id;
                  const totalTasks = g.milestones.reduce((s, m) => s + m.tasks.length, 0);
                  const doneTasks = g.milestones.reduce((s, m) => s + m.tasks.filter(t => t.done).length, 0);
                  return (
                    <div key={g.id} style={{ marginBottom: 12, borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
                      <div onClick={() => setExpandedGoal(isGoalOpen ? null : g.id)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", cursor: "pointer" }}>
                        <div style={{ flex: 1, marginRight: 10 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <span style={{ fontSize: 10, color: "#64748b", transform: isGoalOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s", display: "inline-block" }}>▶</span>
                            <span style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{g.title}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <ProgressBar progress={gp} color={area.color} />
                            <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, minWidth: 60, textAlign: "right" }}>{doneTasks}/{totalTasks} tasks</span>
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                          <StatusPill status={gp === 100 ? "done" : g.status} />
                          <span style={{ fontSize: 10, color: "#64748b" }}>
                            {g.targetDate ? new Date(g.targetDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
                          </span>
                        </div>
                      </div>

                      {isGoalOpen && <div style={{ padding: "0 14px 14px" }}>
                        {g.notes && <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 12px", lineHeight: 1.6, padding: "10px 12px", background: "rgba(255,255,255,0.02)", borderRadius: 8, borderLeft: `2px solid ${area.color}40` }}>{g.notes}</p>}

                        <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                          {["on-track", "at-risk", "done"].map(st => (
                            <button key={st} onClick={() => updateGoalStatus(area.id, g.id, st)} style={{
                              padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                              background: g.status === st ? (st === "on-track" ? "rgba(16,185,129,0.2)" : st === "at-risk" ? "rgba(245,158,11,0.2)" : "rgba(99,102,241,0.2)") : "rgba(255,255,255,0.03)",
                              color: g.status === st ? (st === "on-track" ? "#10b981" : st === "at-risk" ? "#f59e0b" : "#6366f1") : "#64748b",
                              border: `1px solid ${g.status === st ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)"}`,
                            }}>{st === "on-track" ? "On Track" : st === "at-risk" ? "At Risk" : "Done"}</button>
                          ))}
                        </div>

                        {g.milestones.map((m, mi) => {
                          const mp = milestoneProgress(m);
                          const mDone = m.tasks.filter(t => t.done).length;
                          return (
                            <div key={mi} style={{ marginBottom: 14 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                <div style={{ width: 22, height: 22, borderRadius: 11, background: mp === 100 ? area.color : "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: mp === 100 ? "#fff" : "#64748b", fontWeight: 700, border: `1.5px solid ${mp === 100 ? area.color : "rgba(255,255,255,0.1)"}`, flexShrink: 0 }}>
                                  {mp === 100 ? "✓" : mi + 1}
                                </div>
                                <span style={{ fontSize: 13, fontWeight: 600, color: mp === 100 ? area.color : "#e2e8f0", flex: 1 }}>{m.title}</span>
                                <span style={{ fontSize: 10, color: "#64748b", fontWeight: 500 }}>{mDone}/{m.tasks.length}</span>
                              </div>
                              {m.tasks.map((t, ti) => (
                                <div key={ti} onClick={() => toggleTask(area.id, g.id, mi, ti)} style={{
                                  display: "flex", alignItems: "flex-start", gap: 10, padding: "7px 0 7px 32px", cursor: "pointer",
                                  borderBottom: ti < m.tasks.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
                                }}>
                                  <div style={{
                                    width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1,
                                    border: `2px solid ${t.done ? "#10b981" : "rgba(255,255,255,0.15)"}`,
                                    background: t.done ? "#10b981" : "transparent",
                                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff",
                                    transition: "all 0.15s",
                                  }}>{t.done ? "✓" : ""}</div>
                                  <span style={{ fontSize: 13, color: t.done ? "#64748b" : "#cbd5e1", textDecoration: t.done ? "line-through" : "none", lineHeight: 1.4 }}>{t.text}</span>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>}
                    </div>
                  );
                })}
              </div>}
            </div>
          );
        })}
      </>}

      {/* ═══ REVIEW ═══ */}
      {tab === "review" && <>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
          {[{ l: "Habits This Week", v: `${weekHabitsDone}/${data.habits.length*7}`, c: "#10b981" },
            { l: "Avg Day Rating", v: avgRating, c: "#f59e0b" },
            { l: "Overall Progress", v: `${overallProg}%`, c: "#6366f1" }
          ].map(s => (
            <div key={s.l} style={{ ...cardStyle, textAlign: "center", marginBottom: 0, borderTop: `3px solid ${s.c}` }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: s.c }}>{s.v}</div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 4, fontWeight: 500 }}>{s.l}</div>
            </div>
          ))}
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>Area Progress</h3>
          {data.areas.map(a => {
            const ap = areaProgress(a);
            const totalT = a.goals.reduce((s, g) => s + g.milestones.reduce((s2, m) => s2 + m.tasks.length, 0), 0);
            const doneT = a.goals.reduce((s, g) => s + g.milestones.reduce((s2, m) => s2 + m.tasks.filter(t => t.done).length, 0), 0);
            return (
              <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ fontSize: 16 }}>{a.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: a.color }}>{a.name}</span>
                    <span style={{ fontSize: 11, color: "#64748b" }}>{doneT}/{totalT} tasks</span>
                  </div>
                  <ProgressBar progress={ap} color={a.color} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: a.color, minWidth: 36, textAlign: "right" }}>{ap}%</span>
              </div>
            );
          })}
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>7-Day Habit Map</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead><tr>
                <th style={{ textAlign: "left", padding: "6px 8px", color: "#64748b", fontWeight: 500 }}>Habit</th>
                {last7.slice().reverse().map(day => <th key={day} style={{ padding: "6px 4px", color: "#64748b", fontWeight: 500, textAlign: "center" }}>{new Date(day+"T12:00:00").toLocaleDateString("en-US",{weekday:"narrow"})}</th>)}
              </tr></thead>
              <tbody>{data.habits.map(h => (
                <tr key={h.id}>
                  <td style={{ padding: "5px 8px", color: "#94a3b8", fontSize: 11, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.name}</td>
                  {last7.slice().reverse().map(day => {
                    const dn = data.habitLog[`${day}:${h.id}`];
                    return <td key={day} style={{ textAlign: "center", padding: "5px 4px" }}><div style={{ width: 18, height: 18, borderRadius: 4, margin: "0 auto", background: dn ? "#10b981" : "rgba(255,255,255,0.04)", border: `1px solid ${dn ? "#10b98140" : "rgba(255,255,255,0.06)"}` }} /></td>;
                  })}
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>🏆 Top 3 Wins This Week</h3>
          {[0,1,2].map(i => <input key={i} value={weekReview.wins[i]||""} placeholder={`Win ${i+1}…`}
            onChange={e => { const w = [...weekReview.wins]; w[i] = e.target.value; setWeekReview({wins:w}); }} style={{ ...inputStyle, marginBottom: 8 }} />)}
        </div>
        <div style={cardStyle}>
          <h3 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>🚧 Biggest Blocker</h3>
          <textarea value={weekReview.blocker} placeholder="What's holding you back?" onChange={e => setWeekReview({blocker:e.target.value})}
            style={{ ...inputStyle, minHeight: 80, resize: "vertical", fontFamily: "inherit" }} />
        </div>
      </>}

      {/* ═══ SETTINGS ═══ */}
      {tab === "settings" && <>
        <div style={cardStyle}>
          <h3 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>Life Areas</h3>
          {data.areas.map(a => (
            <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", marginBottom: 6, borderRadius: 8, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: a.color }} />
                <span style={{ fontSize: 14, color: "#e2e8f0" }}>{a.emoji} {a.name}</span>
              </div>
              <button onClick={() => { setAreaForm({ name: a.name, color: a.color, emoji: a.emoji }); setAreaModal(a.id); }}
                style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "#94a3b8", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer" }}>Edit</button>
            </div>
          ))}
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>Habits</h3>
          {data.habits.map(h => (
            <div key={h.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", marginBottom: 6, borderRadius: 8, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
              {editingHabit === h.id ? (
                <input autoFocus value={editingHabitName} onChange={e => setEditingHabitName(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") renameHabit(h.id); if (e.key === "Escape") setEditingHabit(null); }}
                  onBlur={() => renameHabit(h.id)}
                  style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(99,102,241,0.4)", borderRadius: 6, padding: "6px 10px", color: "#fff", fontSize: 14, outline: "none", marginRight: 8 }} />
              ) : <span style={{ fontSize: 14, color: "#e2e8f0", flex: 1 }}>{h.name}</span>}
              <div style={{ display: "flex", gap: 6 }}>
                {editingHabit !== h.id && <button onClick={() => { setEditingHabit(h.id); setEditingHabitName(h.name); }}
                  style={{ background: "rgba(99,102,241,0.1)", border: "none", color: "#818cf8", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer" }}>Edit</button>}
                <button onClick={() => deleteHabit(h.id)} style={{ background: "rgba(239,68,68,0.1)", border: "none", color: "#ef4444", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer" }}>Remove</button>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <input value={newHabit} onChange={e => setNewHabit(e.target.value)} placeholder="New habit…" onKeyDown={e => e.key === "Enter" && addHabit()}
              style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "9px 12px", color: "#e2e8f0", fontSize: 14, outline: "none" }} />
            <button onClick={addHabit} style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Add</button>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>💾 Data Backup</h3>
          <p style={{ margin: "0 0 14px", fontSize: 12, color: "#475569" }}>Export your data as JSON to back up or transfer to another device.</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={exportData} style={{
              background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)",
              borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>⬇ Export Data</button>
            <button onClick={() => fileInputRef.current?.click()} style={{
              background: "rgba(99,102,241,0.1)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>⬆ Import Data</button>
            <input ref={fileInputRef} type="file" accept=".json" onChange={importData} style={{ display: "none" }} />
          </div>
          {importMsg && <div style={{
            marginTop: 10, padding: "8px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500,
            background: importMsg.includes("success") ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
            color: importMsg.includes("success") ? "#10b981" : "#ef4444",
          }}>{importMsg}</div>}
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>Danger Zone</h3>
          <button onClick={resetData} style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Reset All Data</button>
        </div>
      </>}

      </div>

      <Modal open={!!areaModal} onClose={() => setAreaModal(null)} title="Edit Life Area">
        <div style={{ marginBottom: 14 }}><label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 5, fontWeight: 500 }}>Name</label>
          <input value={areaForm.name} onChange={e => setAreaForm({...areaForm, name: e.target.value})} style={inputStyle} /></div>
        <div style={{ marginBottom: 14 }}><label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 5, fontWeight: 500 }}>Emoji</label>
          <input value={areaForm.emoji} onChange={e => setAreaForm({...areaForm, emoji: e.target.value})} placeholder="e.g., 🚀" style={inputStyle} /></div>
        <div style={{ marginBottom: 14 }}><label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 5, fontWeight: 500 }}>Color</label>
          <input type="color" value={areaForm.color} onChange={e => setAreaForm({...areaForm, color: e.target.value})} style={{ width: 48, height: 36, border: "none", borderRadius: 8, cursor: "pointer", background: "transparent" }} /></div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={() => setAreaModal(null)} style={{ background: "transparent", color: "#6366f1", border: "1px solid #6366f1", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
          <button onClick={() => updateArea(areaModal)} style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Save</button>
        </div>
      </Modal>
    </div>
  );
}
