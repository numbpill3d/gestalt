const extensionApi = globalThis.browser ?? globalThis.chrome;

async function getBookmarks() {
  const saved = await extensionApi.storage.local.get({ bookmarks: [] });
  return Array.isArray(saved.bookmarks) ? saved.bookmarks : [];
}

function renderRecent(bookmarks) {
  const recent = document.querySelector("#recent");
  recent.replaceChildren();
  if (!bookmarks.length) { recent.textContent = "NO LOCAL BOOKMARKS YET."; recent.className = "recent recent-empty"; return; }
  recent.className = "recent";
  bookmarks.slice(-4).reverse().forEach((bookmark) => {
    const link = document.createElement("a");
    link.href = bookmark.url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = bookmark.title || bookmark.url;
    recent.append(link);
  });
}

async function refreshRecent() { renderRecent(await getBookmarks()); }

function setStatus(message) { document.querySelector("#status").textContent = message; }

document.querySelector("#open").addEventListener("click", async () => {
  await extensionApi.tabs.create({ url: extensionApi.runtime.getURL("dashboard.html") });
  window.close();
});

document.querySelector("#save").addEventListener("click", async () => {
  const [tab] = await extensionApi.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url || !/^https?:\/\//i.test(tab.url)) { setStatus("THIS TAB CANNOT BE SAVED."); return; }
  const bookmarks = await getBookmarks();
  if (!bookmarks.some((bookmark) => bookmark.url === tab.url)) bookmarks.push({ id: crypto.randomUUID(), title: tab.title || tab.url, url: tab.url, createdAt: Date.now() });
  await extensionApi.storage.local.set({ bookmarks });
  setStatus("BOOKMARK SAVED LOCALLY.");
  await refreshRecent();
});

document.querySelector("#settings").addEventListener("click", () => extensionApi.runtime.openOptionsPage());
void refreshRecent();
