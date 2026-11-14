const extensionApi = globalThis.browser ?? globalThis.chrome;
extensionApi.runtime.onInstalled.addListener(() => {
  extensionApi.contextMenus?.create({ id: "gestalt-save-tab", title: "Save page to GESTALT", contexts: ["page", "link"] });
});

extensionApi.contextMenus?.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== "gestalt-save-tab") return;
  const targetUrl = info.linkUrl || tab?.url;
  if (!targetUrl || !/^https?:\/\//i.test(targetUrl)) return;
  const saved = await extensionApi.storage.local.get({ bookmarks: [] });
  const bookmarks = Array.isArray(saved.bookmarks) ? saved.bookmarks : [];
  if (!bookmarks.some((bookmark) => bookmark.url === targetUrl)) bookmarks.push({ id: crypto.randomUUID(), title: tab?.title || targetUrl, url: targetUrl, createdAt: Date.now() });
  await extensionApi.storage.local.set({ bookmarks });
  extensionApi.tabs.create({ url: extensionApi.runtime.getURL("dashboard.html") });
});
