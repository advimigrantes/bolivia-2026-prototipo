/* Sem API: apenas URLs públicas do Google Maps, reutilizáveis pela futura fonte de leitura. */
window.buildGoogleMapsSearchUrl = (place) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;
window.buildGoogleMapsDirectionsUrl = (origin, destination, travelMode = "driving") => {
  const modes = ["driving", "transit", "walking"];
  const mode = modes.includes(travelMode) ? travelMode : "driving";
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=${mode}`;
};
window.buildGoogleMapsDayRouteUrl = (points = [], travelMode = "driving") => {
  const route = points.filter(Boolean);
  if (route.length < 2) return window.buildGoogleMapsSearchUrl(route[0] || "Bolívia");
  const mode = ["driving", "transit", "walking"].includes(travelMode) ? travelMode : "driving";
  const params = new URLSearchParams({api:"1",origin:route[0],destination:route[route.length - 1],travelmode:mode});
  if (route.length > 2) params.set("waypoints", route.slice(1,-1).join("|"));
  return `https://www.google.com/maps/dir/?${params.toString()}`;
};
window.openMap = (url) => window.open(url, "_blank", "noopener,noreferrer");
