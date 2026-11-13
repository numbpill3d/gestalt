const extensionApi = globalThis.browser ?? globalThis.chrome;
const defaultAppUrl = "http://127.0.0.1:3000";

extensionApi.runtime.onInstalled.addListener(() => {
  extensionApi.contextMenus?.create({ id: "gestalt-save-tab", title: "Save page to GESTALT", contexts: ["page", "link"] });
});

extensionApi.contextMenus?.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== "gestalt-save-tab") return;
  const targetUrl = info.linkUrl || tab?.url;
  if (!targetUrl || !/^https?:\/\//i.test(targetUrl)) return;
  const saved = await extensionApi.storage.local.get({ appUrl: defaultAppUrl });
  const appUrl = new URL(String(saved.appUrl || defaultAppUrl));
  appUrl.searchParams.set("gestaltBookmark", JSON.stringify({ title: tab?.title || targetUrl, url: targetUrl }));
  extensionApi.tabs.create({ url: appUrl.toString() });
});
