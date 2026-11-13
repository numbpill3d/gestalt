const extensionApi = globalThis.browser ?? globalThis.chrome;
const input = document.querySelector("#app-url");
const status = document.querySelector("#status");

extensionApi.storage.local.get({ appUrl: globalThis.GESTALT_EXTENSION_DEFAULT_URL }).then(({ appUrl }) => { input.value = appUrl; });
document.querySelector("#save").addEventListener("click", async () => {
  try {
    const value = new URL(input.value).toString().replace(/\/$/, "");
    await extensionApi.storage.local.set({ appUrl: value });
    status.textContent = "SAVED. GESTALT WILL OPEN HERE.";
  } catch { status.textContent = "ENTER A VALID HTTP(S) URL."; }
});
