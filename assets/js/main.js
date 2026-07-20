"use strict";

const configUrl = "data/profile.json";
let profileData;
let activePublicationCategory = "全部";

function getByPath(object, path) {
  return path.split(".").reduce((value, key) => value && value[key], object);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;" })[character]);
}

function setTextFields(data) {
  document.querySelectorAll("[data-field]").forEach(element => {
    const value = getByPath(data, element.dataset.field);
    if (value) element.textContent = value;
  });
  document.title = `${data.person.name} | Academic Profile`;
}

function renderProfile(data) {
  document.getElementById("profile-links").innerHTML = data.links.map(link =>
    `<a class="button-link" href="${escapeHtml(link.url)}" ${link.external ? "target=\"_blank\" rel=\"noopener noreferrer\"" : ""}>${escapeHtml(link.label)}</a>`
  ).join("");

  document.getElementById("quick-facts").innerHTML = data.person.facts.map(fact =>
    `<dt>${escapeHtml(fact.label)}</dt><dd>${escapeHtml(fact.value)}</dd>`
  ).join("");
}

function renderResearch(items) {
  document.getElementById("research-list").innerHTML = items.map((item, index) => `
    <article class="col-md-4"><div class="research-card"><p class="research-number">0${index + 1}</p><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></div></article>
  `).join("");
}

function renderEducation(items) {
  document.getElementById("education-list").innerHTML = items.map(item => `
    <li class="timeline-item"><div class="timeline-date">${escapeHtml(item.period)}</div><h3 class="mt-1 mb-1">${escapeHtml(item.institution)}</h3><p class="timeline-meta mb-0">${escapeHtml(item.degree)}${item.major ? ` · ${escapeHtml(item.major)}` : ""}</p>${item.note ? `<p class="mb-0 mt-2">${escapeHtml(item.note)}</p>` : ""}</li>
  `).join("");
}

function renderPublicationFilters(items) {
  const categories = ["全部", ...new Set(items.map(item => item.category))];
  document.getElementById("publication-filters").innerHTML = categories.map(category => `
    <button class="filter-button" type="button" data-category="${escapeHtml(category)}" aria-pressed="${category === activePublicationCategory}">${escapeHtml(category)}</button>
  `).join("");
  document.querySelectorAll(".filter-button").forEach(button => button.addEventListener("click", () => {
    activePublicationCategory = button.dataset.category;
    renderPublicationFilters(profileData.publications);
    renderPublications(profileData.publications);
  }));
}

function renderPublications(items) {
  const visibleItems = activePublicationCategory === "全部" ? items : items.filter(item => item.category === activePublicationCategory);
  document.getElementById("filter-status").textContent = `当前显示 ${visibleItems.length} 项${activePublicationCategory === "全部" ? "全部成果" : activePublicationCategory}`;
  document.getElementById("publication-list").innerHTML = visibleItems.length ? visibleItems.map(item => `
    <article class="publication-item"><div class="publication-year">${escapeHtml(item.year)}</div><div><h3 class="publication-title">${item.url ? `<a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.title)}</a>` : escapeHtml(item.title)}</h3><p class="publication-authors">${escapeHtml(item.authors)}</p><p class="publication-venue">${escapeHtml(item.venue)}</p><span class="publication-tag">${escapeHtml(item.category)}</span></div></article>
  `).join("") : '<p class="empty-state">该分类暂未收录成果。</p>';
}

function renderProjects(items) {
  document.getElementById("project-list").innerHTML = items.map(item => `
    <article class="col-md-6"><div class="project-card"><p class="project-meta">${escapeHtml(item.period)} · ${escapeHtml(item.role)}</p><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></div></article>
  `).join("");
}

function renderContacts(items) {
  document.getElementById("contact-list").innerHTML = items.map(item => `
    <div><dt>${escapeHtml(item.label)}</dt><dd>${item.url ? `<a href="${escapeHtml(item.url)}" ${item.external ? "target=\"_blank\" rel=\"noopener noreferrer\"" : ""}>${escapeHtml(item.value)}</a>` : escapeHtml(item.value)}</dd></div>
  `).join("");
}

function initialiseTheme() {
  const savedTheme = localStorage.getItem("academic-profile-theme");
  const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  applyTheme(savedTheme || preferredTheme);
  document.getElementById("theme-toggle").addEventListener("click", () => {
    const nextTheme = document.documentElement.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
    localStorage.setItem("academic-profile-theme", nextTheme);
    applyTheme(nextTheme);
  });
}

function applyTheme(theme) {
  const button = document.getElementById("theme-toggle");
  document.documentElement.setAttribute("data-bs-theme", theme);
  button.setAttribute("aria-label", theme === "dark" ? "切换浅色模式" : "切换深色模式");
  button.setAttribute("title", button.getAttribute("aria-label"));
  button.querySelector("span").textContent = theme === "dark" ? "☼" : "◐";
}

function updateVisitCount() {
  const counter = document.getElementById("visit-count");
  try {
    const key = "gjt-academic-profile-visits";
    const visits = Number.parseInt(localStorage.getItem(key) || "0", 10) + 1;
    localStorage.setItem(key, String(visits));
    counter.textContent = String(visits);
  } catch (_) { counter.textContent = "不可用"; }
}

async function initialisePage() {
  try {
    const response = await fetch(configUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    profileData = await response.json();
    setTextFields(profileData);
    renderProfile(profileData);
    renderResearch(profileData.research);
    renderEducation(profileData.education);
    renderPublicationFilters(profileData.publications);
    renderPublications(profileData.publications);
    renderProjects(profileData.projects);
    renderContacts(profileData.contacts);
  } catch (error) {
    document.querySelector("main").innerHTML = '<section class="section-block"><div class="container"><h1>资料暂时无法加载</h1><p>请确认 <code>data/profile.json</code> 文件存在且 JSON 格式有效。</p></div></section>';
    console.error("Profile configuration could not be loaded:", error);
  }
}

document.getElementById("current-year").textContent = String(new Date().getFullYear());
initialiseTheme();
updateVisitCount();
initialisePage();
