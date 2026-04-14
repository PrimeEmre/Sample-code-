// ── State ──────────────────────────────────────────────────────
let selectedTone = "professional";
let selectedLength = "medium";
let lastResult = null;

// ── Pill selection ─────────────────────────────────────────────
document.querySelectorAll("#tonePills .pill").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#tonePills .pill").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedTone = btn.dataset.value;
  });
});

document.querySelectorAll("#lengthPills .pill").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#lengthPills .pill").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedLength = btn.dataset.value;
  });
});

// ── Char counter ───────────────────────────────────────────────
document.getElementById("topic").addEventListener("input", function () {
  document.getElementById("charCount").textContent = this.value.length;
});

// ── Enter to submit ────────────────────────────────────────────
document.getElementById("topic").addEventListener("keydown", function (e) {
  if (e.key === "Enter" && e.ctrlKey) generate();
});

// ── Generate ───────────────────────────────────────────────────
async function generate() {
  const topic = document.getElementById("topic").value.trim();
  if (!topic) { showError("Please enter a topic first."); return; }

  setLoading(true);
  hideError();
  hide("resultCard");
  show("statusBar");
  animateSteps();

  try {
    const resp = await fetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, tone: selectedTone, length: selectedLength })
    });

    const data = await resp.json();

    if (!resp.ok || data.error) {
      throw new Error(data.error || "Something went wrong.");
    }

    lastResult = data;
    displayResult(data);

  } catch (err) {
    showError(err.message);
    hide("statusBar");
  } finally {
    setLoading(false);
  }
}

// ── Display result ─────────────────────────────────────────────
function displayResult(data) {
  hide("statusBar");
  document.querySelectorAll(".step").forEach(el => el.className = "step done");
  document.getElementById("resultTopic").textContent = data.topic;

  const badges = document.getElementById("resultBadges");
  badges.innerHTML = `
    <span class="badge">${data.tone}</span>
    <span class="badge">${data.length}</span>
    <span class="badge">📅 ${data.generated}</span>
    ${data.from_cache ? '<span class="badge">⚡ cached</span>' : ''}
  `;

  document.getElementById("blogOutput").textContent = data.blog_post;
  show("resultCard");
  document.getElementById("resultCard").scrollIntoView({ behavior: "smooth", block: "start" });
}

// ── Copy ───────────────────────────────────────────────────────
async function copyPost() {
  if (!lastResult) return;
  await navigator.clipboard.writeText(lastResult.blog_post);
  const btn = event.target;
  btn.textContent = "✅ Copied!";
  setTimeout(() => btn.textContent = "📋 Copy", 2000);
}

// ── Download ───────────────────────────────────────────────────
function downloadPost() {
  if (!lastResult) return;
  const blob = new Blob([lastResult.blog_post], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const safe = lastResult.topic.replace(/[^a-z0-9]/gi, "_").substring(0, 40);
  a.href = url;
  a.download = `${safe}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Reset ──────────────────────────────────────────────────────
function resetForm() {
  hide("resultCard");
  hide("statusBar");
  hide("errorBox");
  document.getElementById("topic").value = "";
  document.getElementById("charCount").textContent = "0";
  lastResult = null;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── Step animation ─────────────────────────────────────────────
function animateSteps() {
  const steps = ["step1", "step2", "step3"];
  const delays = [0, 8000, 20000]; // rough timing of each agent

  steps.forEach((id, i) => {
    const el = document.getElementById(id);
    el.className = "step";
    if (i === 0) el.classList.add("active");
  });

  delays.slice(1).forEach((delay, i) => {
    setTimeout(() => {
      document.getElementById(steps[i]).className = "step done";
      document.getElementById(steps[i + 1]).className = "step active";
    }, delay);
  });
}

// ── Helpers ────────────────────────────────────────────────────
function setLoading(on) {
  const btn = document.getElementById("generateBtn");
  btn.disabled = on;
  document.getElementById("btnText").classList.toggle("hidden", on);
  document.getElementById("btnLoader").classList.toggle("hidden", !on);
}

function showError(msg) {
  const box = document.getElementById("errorBox");
  box.textContent = "⚠️ " + msg;
  box.classList.remove("hidden");
}

function hideError() { document.getElementById("errorBox").classList.add("hidden"); }
function show(id) { document.getElementById(id).classList.remove("hidden"); }
function hide(id) { document.getElementById(id).classList.add("hidden"); }