/* Sem API: apenas URLs públicas do Google Maps, reutilizáveis pela futura fonte de leitura. */
window.buildGoogleMapsSearchUrl = (place) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;
window.buildGoogleMapsDirectionsUrl = (origin, destination, travelMode = "driving") => {
  const modes = ["driving", "transit", "walking"];
  const mode = modes.includes(travelMode) ? travelMode : "driving";
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=${mode}`;
};
window.openMap = (url) => window.open(url, "_blank", "noopener,noreferrer");
