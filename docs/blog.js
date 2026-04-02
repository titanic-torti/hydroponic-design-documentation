const POSTS_BASE = "../posts/";
const params = new URLSearchParams(window.location.search);
const state = {
  medium: params.get("medium") || "all",
  project: params.get("project") || "all",
};
let allPosts = [];

fetch("manifest.json")
  .then((r) => r.json())
  .then((manifest) =>
    Promise.all(
      manifest.posts.map((filename) =>
        fetch(POSTS_BASE + filename)
          .then((r) => (r.ok ? r.text() : null))
          .then((raw) => (raw ? parseMd(raw) : null)),
      ),
    ),
  )
  .then((results) => {
    allPosts = results.filter(Boolean);
    allPosts.sort((a, b) => b.date.localeCompare(a.date));
    renderAll();
  });

function parseMd(raw) {
  const lines = raw.split("\n");
  if (lines[0].trim() !== "---") {
    return { title: "Untitled", date: "", medium: "", project: "", body: raw };
  }
  const closeIdx = lines.indexOf("---", 1);
  if (closeIdx === -1) {
    return { title: "Untitled", date: "", medium: "", project: "", body: raw };
  }
  const meta = {};
  lines.slice(1, closeIdx).forEach((line) => {
    const colon = line.indexOf(":");
    if (colon === -1) return;
    meta[line.slice(0, colon).trim()] = line.slice(colon + 1).trim();
  });
  const body = lines
    .slice(closeIdx + 1)
    .join("\n")
    .trim();
  return { title: "", date: "", medium: "", project: "", ...meta, body };
}

function renderAll() {
  const container = document.getElementById("posts-container");
  container.innerHTML = "";
  allPosts.forEach((post) => container.appendChild(buildCard(post)));

  // Activate pills matching initial state from URL params
  [
    ["filter-medium", state.medium],
    ["filter-project", state.project],
  ].forEach(([groupId, value]) => {
    const group = document.getElementById(groupId);
    group.querySelectorAll(".pill").forEach((p) => {
      p.classList.toggle("active", p.dataset.value === value);
    });
  });

  applyFilters();
}

function buildCard(post) {
  const article = document.createElement("article");
  article.className = "post-card";
  article.dataset.medium = post.medium || "";
  article.dataset.project = post.project || "";

  const dateStr = post.date
    ? new Date(post.date + "T00:00:00").toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  article.innerHTML = `
    <div class="post-card-meta quicksand">
      <span class="post-tag medium-tag">${post.medium || ""}</span>
      <span class="post-tag project-tag">${post.project || ""}</span>
      <span class="post-date">${dateStr}</span>
    </div>
    <h2 class="post-title">${post.title || "Untitled"}</h2>
    <div class="post-body libre-baskerville">${marked.parse(post.body)}</div>
  `;
  return article;
}

function applyFilters() {
  const cards = document.querySelectorAll(".post-card");
  let visibleCount = 0;

  cards.forEach((card) => {
    const mediumMatch =
      state.medium === "all" || card.dataset.medium === state.medium;
    const projectMatch =
      state.project === "all" || card.dataset.project === state.project;
    const visible = mediumMatch && projectMatch;
    card.hidden = !visible;
    if (visible) visibleCount++;
  });

  document.getElementById("posts-empty").hidden = visibleCount > 0;
}

function initFilterGroup(groupId, stateKey) {
  document.getElementById(groupId).addEventListener("click", (e) => {
    const pill = e.target.closest(".pill");
    if (!pill) return;
    document
      .querySelectorAll(`#${groupId} .pill`)
      .forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");
    state[stateKey] = pill.dataset.value;
    applyFilters();
  });
}

initFilterGroup("filter-medium", "medium");
initFilterGroup("filter-project", "project");
