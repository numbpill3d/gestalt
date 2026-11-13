const extensionApi = globalThis.browser ?? globalThis.chrome;

async function getAppUrl() {
  const saved = await extensionApi.storage.local.get({ appUrl: globalThis.GESTALT_EXTENSION_DEFAULT_URL });
  return String(saved.appUrl || globalThis.GESTALT_EXTENSION_DEFAULT_URL).replace(/\/$/, "");
}

function setStatus(message) { document.querySelector("#status").textContent = message; }

document.querySelector("#open").addEventListener("click", async () => {
  await extensionApi.tabs.create({ url: await getAppUrl() });
  window.close();
});

document.querySelector("#save").addEventListener("click", async () => {
  const [tab] = await extensionApi.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url || !/^https?:\/\//i.test(tab.url)) { setStatus("THIS TAB CANNOT BE SAVED."); return; }
  const url = new URL(await getAppUrl());
  url.searchParams.set("gestaltBookmark", JSON.stringify({ title: tab.title || tab.url, url: tab.url }));
  await extensionApi.tabs.create({ url: url.toString() });
  setStatus("BOOKMARK SENT TO GESTALT.");
});

document.querySelector("#settings").addEventListener("click", () => extensionApi.runtime.openOptionsPage());
