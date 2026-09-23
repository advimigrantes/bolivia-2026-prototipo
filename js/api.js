/* Camada de leitura: Apps Script → snapshot local → fallback seguro. */
(() => {
  const ENDPOINT = "https://script.google.com/macros/s/AKfycbxhGXIh4KLh95xo3Kbd5KNAoAjJYnMeJe0PamADoqKKMFkQyUyvewFarZuhc_u2MZr_LQ/exec";
  const SNAPSHOT_KEY = "bolivia-2026.sheet-snapshot.v1";
  const listeners = [];
  let state = { mode:"fallback", updatedAt:null, error:null };

  const readSnapshot = () => { try { return JSON.parse(localStorage.getItem(SNAPSHOT_KEY) || "null"); } catch { return null; } };
  const writeSnapshot = (payload) => { try { localStorage.setItem(SNAPSHOT_KEY, JSON.stringify({ payload, savedAt:new Date().toISOString() })); } catch {} };
  const valid = (payload) => payload && payload.meta?.schema === "bolivia-2026/v1" && Array.isArray(payload.itinerary) && Array.isArray(payload.tasks) && Array.isArray(payload.episodes);
  const merge = (payload) => ({ ...window.appData, ...payload, trip:{ ...window.appData.trip, ...payload.trip }, alerts:payload.alerts || [], experiences:payload.experiences || [] });
  const notify = () => listeners.forEach((listener) => listener({ data:window.appData, ...state }));
  const jsonp = () => new Promise((resolve, reject) => {
    const callback = `boliviaSheet_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement("script");
    const finish = () => { delete window[callback]; script.remove(); window.clearTimeout(timer); };
    const timer = window.setTimeout(() => { finish(); reject(new Error("Tempo esgotado ao consultar a planilha.")); }, 45000);
    window[callback] = (payload) => { finish(); resolve(payload); };
    script.onerror = () => { finish(); reject(new Error("Não foi possível consultar a planilha.")); };
    script.src = `${ENDPOINT}?callback=${callback}`;
    document.head.append(script);
  });
  const bootstrap = () => {
    const snapshot = readSnapshot();
    if (snapshot && valid(snapshot.payload)) {
      window.appData = merge(snapshot.payload);
      state = { mode:"offline", updatedAt:snapshot.savedAt, error:null };
    }
    return window.appData;
  };
  const refresh = async () => {
    if (!navigator.onLine) throw new Error("Sem conexão. Mantidos os últimos dados disponíveis.");
    const payload = await jsonp();
    if (!valid(payload)) throw new Error("Resposta inválida da planilha. Dados anteriores preservados.");
    window.appData = merge(payload);
    writeSnapshot(payload);
    state = { mode:"online", updatedAt:payload.meta.generatedAt, error:null };
    notify();
    return { data:window.appData, ...state };
  };
  window.appApi = { bootstrap, refresh, getStatus:() => ({ ...state }), onChange:(listener) => listeners.push(listener) };
})();
