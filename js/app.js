(() => {
  let data = window.appApi?.bootstrap() || window.appData;
  const state = { view:"today", routeFilter:"today", routeCity:"all", taskFilter:"all", tripView:null, episodeView:null, productionFilter:null, weatherCity:null, expanded:null, navigationDepth:0 };
  const icons = {
    today:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m17.1-7.1-1.4 1.4M6.3 17.7l-1.4 1.4m14.2 0-1.4-1.4M6.3 6.3 4.9 4.9"></path></svg>',
    route:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18V6l6-2 5 2 5-2v12l-5 2-5-2-6 2Z"></path><path d="M10 4v12m5-10v12"></path></svg>',
    pending:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5h10v15H5V5h4"></path><path d="M9 3h6v4H9zM8 12l2 2 4-4m-6 7h6"></path></svg>',
    production:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4z"></path><path d="m17 11 4-3v10l-4-3z"></path></svg>',
    trip:'<img class="trip-icon" src="assets/aviao.png" alt="" aria-hidden="true" />'
  };
  const nav = [{id:"today",label:"Hoje",icon:"today"},{id:"route",label:"Roteiro",icon:"route"},{id:"pending",label:"Pendências",icon:"pending"},{id:"production",label:"Produção",icon:"production"},{id:"trip",label:"Viagem",icon:"trip"}];
  const $ = (selector) => document.querySelector(selector);
  const formatDate = (date, options={day:"2-digit",month:"2-digit"}) => new Intl.DateTimeFormat("pt-BR",options).format(new Date(`${date}T12:00:00`));
  const dateText = (date) => new Intl.DateTimeFormat("pt-BR",{weekday:"short",day:"2-digit",month:"short"}).format(new Date(`${date}T12:00:00`)).replace(".","");
  const localISODate = () => { const now=new Date(); return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`; };
  const operationalDate = () => localISODate();
  const routeForDate = (date=operationalDate()) => data.itinerary.find((item)=>item.date===date) || [...data.itinerary].filter((item)=>item.date<=date).pop() || data.itinerary[0] || {};
  const plannedCity = () => tripProgress().phase === "before" ? (data.trip.firstCity || data.itinerary[0]?.city || "La Paz") : (routeForDate().city || data.trip.firstCity || "La Paz");
  const activeCity = () => state.locationCity || plannedCity();
  const activeLodging = () => data.lodgings.find((item)=>item.checkin && item.checkout && item.checkin<=operationalDate() && operationalDate()<item.checkout) || data.lodgings.find((item)=>item.city===activeCity()) || data.lodgings[0] || {name:"Base não definida",address:"",place:activeCity(),city:activeCity()};
  const nextRouteChange = () => data.itinerary.find((item)=>item.date>operationalDate() && item.origin && item.destination) || {};
  const syncLabel = () => { const source=window.appApi?.getStatus?.() || {mode:"fallback"}; if(source.mode==="online") return "ONLINE · Atualizado agora"; if(source.mode==="offline" && source.updatedAt) return `OFFLINE · Última atualização: ${new Intl.DateTimeFormat("pt-BR",{dateStyle:"short",timeStyle:"short"}).format(new Date(source.updatedAt))}`; return "FALLBACK · Dados locais de segurança"; };
  const calendarDay = (date) => Date.parse(`${date}T00:00:00Z`);
  const tripProgress = () => {
    const date=localISODate(); const current=calendarDay(date); const start=calendarDay(data.trip.startDate); const end=calendarDay(data.trip.endDate);
    if(current<start){ const days=Math.round((start-current)/86400000); return {date,label:`Faltam ${days} ${days===1?"dia":"dias"} para a viagem`,phase:"before"}; }
    if(current<=end){ const currentDay=Math.round((current-start)/86400000)+1; const total=Math.round((end-start)/86400000)+1; return {date,label:`Dia ${currentDay} de ${total}`,phase:"during"}; }
    return {date,label:"Viagem concluída",phase:"after"};
  };
  const tripProgressText = () => { const {date,label}=tripProgress(); return `${formatDate(date,{weekday:"long",day:"2-digit",month:"long",year:"numeric"})} · ${label}`; };
  const updateTripProgress = () => { const progress=tripProgress(); const target=$("[data-trip-progress]"); const cityLabel=$("[data-trip-city-label]"); if(target)target.textContent=`${formatDate(progress.date,{weekday:"long",day:"2-digit",month:"long",year:"numeric"})} · ${progress.label}`; if(cityLabel)cityLabel.textContent=progress.phase==="before"?"Primeira cidade":"Cidade atual"; };
  const startTripProgressClock = () => { updateTripProgress(); if(!startTripProgressClock.timer)startTripProgressClock.timer=window.setInterval(updateTripProgress,60000); };
  const statusTone = (value="") => {
    const status=String(value).toLowerCase();
    if(/vencida|urgente|crítica/.test(status)) return "critical";
    if(/bloqueada/.test(status)) return "blocked";
    if(/vence hoje/.test(status)) return "today";
    if(/próxima/.test(status)) return "soon";
    if(/sem prazo/.test(status)) return "no-deadline";
    if(/gravando|em andamento|editando/.test(status)) return "progress";
    if(/gravado|confirmado|concluída|ok|publicado|no prazo/.test(status)) return "good";
    if(/pendente|a gravar|planejado|em pauta|a reservar|a conferir/.test(status)) return "warning";
    return "neutral";
  };
  const episode = (number) => data.episodes.find((item) => item.number === number);
  const getAllEpisodes = () => data.episodes;
  const getNextToRecord = () => getAllEpisodes().find((item) => item.status === "A GRAVAR");
  const getNextToPublish = () => getAllEpisodes().filter((item) => item.editingStatus !== "PUBLICADO" && item.publishDate >= operationalDate()).sort((a,b) => a.publishDate.localeCompare(b.publishDate))[0];
  const getContentStock = () => getAllEpisodes().filter((item) => ["GRAVADO","EDITANDO","PRONTO"].includes(item.status) && item.editingStatus !== "PUBLICADO");
  const episodeTone = (item) => statusTone(item.editingStatus === "EDITANDO" ? item.editingStatus : item.status);
  const lodging = (id) => data.lodgings.find((item) => item.id === id);
  const mapSearch = (place) => `onclick="openMap(buildGoogleMapsSearchUrl('${String(place).replaceAll("'","\\'")}'))"`;
  const mapDirections = (origin,destination,mode="driving") => `onclick="openMap(buildGoogleMapsDirectionsUrl('${String(origin).replaceAll("'","\\'")}','${String(destination).replaceAll("'","\\'")}','${mode}'))"`;
  const mapDayRoute = (points,mode="driving") => `onclick="openMap('${buildGoogleMapsDayRouteUrl(points,mode)}')"`;
  const commonsVisual = (file, author, license) => ({
    image:`https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1280`,
    source:`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file).replaceAll("%20","_")}`,
    credit:`Foto: ${author} · ${license}`
  });
  const cityVisual = (city) => ({
    "La Paz": { image:"https://commons.wikimedia.org/wiki/Special:FilePath/Centro_de_La_Paz%2C_Bolivia.jpg?width=1280", source:"https://commons.wikimedia.org/wiki/File:Centro_de_La_Paz,_Bolivia.jpg", credit:"Foto: EEJCC · CC0" },
    "Coroico": { image:"https://commons.wikimedia.org/wiki/Special:FilePath/Coroico_town.jpg?width=1280", source:"https://commons.wikimedia.org/wiki/File:Coroico_town.jpg", credit:"Foto: Fergui · domínio público" },
    "El Alto": commonsVisual("El Alto - panoramio.jpg","Pavel Špindler","CC BY 3.0"),
    "Tiwanaku": commonsVisual("Tiwanaku - Ruins of monumental gate.jpg","P. Hughes","CC BY 4.0"),
    "Charazani": commonsVisual("Charazani, Bolivia.jpg","Carlillasa","CC BY-SA 4.0"),
    "Rurrenabaque": commonsVisual("Rurrenabaque ciudad.jpg","Rodrigo Mariaca","CC BY-SA 4.0"),
    "Potosí": commonsVisual("Vista de la Villa Imperial de Potosí.jpg","Parallelepiped09","CC BY-SA 4.0"),
    "Uyuni": commonsVisual("Reflection on the Salar de Uyuni, bolivia.jpg","Christopher Crouzet","CC BY-SA 4.0"),
    "Santa Cruz": commonsVisual("Vista panorámica de Santa Cruz de la Sierra (Bolivia).jpg","Aamariscal","CC0"),
    "Puerto Quijarro": commonsVisual("Puerto Quijarro, Bolivia - panoramio (2).jpg","francisco souza dias","CC BY 3.0")
  })[city] || null;
  const weatherLocations = {
    "La Paz":{lat:-16.4897,lon:-68.1193,timezone:"America/La_Paz"},
    "Coroico":{lat:-16.1900,lon:-67.7290,timezone:"America/La_Paz"},
    "El Alto":{lat:-16.50434,lon:-68.16096,timezone:"America/La_Paz"},
    "Tiwanaku":{lat:-16.55228,lon:-68.67953,timezone:"America/La_Paz"},
    "Charazani":{lat:-15.1777,lon:-68.99448,timezone:"America/La_Paz"},
    "Rurrenabaque":{lat:-14.44125,lon:-67.52781,timezone:"America/La_Paz"},
    "Potosí":{lat:-19.58361,lon:-65.75306,timezone:"America/La_Paz"},
    "Uyuni":{lat:-20.45967,lon:-66.82503,timezone:"America/La_Paz"},
    "Santa Cruz":{lat:-17.78629,lon:-63.18117,timezone:"America/La_Paz"},
    "Puerto Quijarro":{lat:-17.78333,lon:-57.76667,timezone:"America/La_Paz"}
  };
  const distanceInKm = (from,to) => {
    const radians=(value)=>value*Math.PI/180; const earthRadius=6371;
    const deltaLat=radians(to.lat-from.lat); const deltaLon=radians(to.lon-from.lon);
    const a=Math.sin(deltaLat/2)**2+Math.cos(radians(from.lat))*Math.cos(radians(to.lat))*Math.sin(deltaLon/2)**2;
    return earthRadius*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
  };
  const nearestMappedCity = (coords) => Object.entries(weatherLocations).map(([city,location])=>({city,distance:distanceInKm({lat:coords.latitude,lon:coords.longitude},{lat:location.lat,lon:location.lon})})).sort((a,b)=>a.distance-b.distance)[0];
  const applyCurrentLocation = (position) => {
    const match=nearestMappedCity(position.coords);
    if(!match || match.distance>75 || match.city===state.locationCity)return;
    state.locationCity=match.city; state.weatherCity=null; render();
  };
  const startLocationTracking = () => {
    if(!navigator.geolocation || startLocationTracking.watchId!==undefined)return;
    startLocationTracking.watchId=navigator.geolocation.watchPosition(applyCurrentLocation,()=>{}, {enableHighAccuracy:true,maximumAge:300000,timeout:15000});
  };
  const weatherMeta = (code) => code===0?["☀︎","Céu limpo"]:code<=2?["⛅","Poucas nuvens"]:code===3?["☁","Nublado"]:code<=48?["〰","Neblina"]:code<=57?["☂","Garoa"]:code<=67?["🌧","Chuva"]:code<=77?["❄","Neve"]:code<=82?["🌦","Pancadas"]:["⛈","Trovoadas"];
  const weatherApiUrl = (location) => `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=${encodeURIComponent(location.timezone)}&forecast_days=15`;
  const weatherTime = (timezone) => new Intl.DateTimeFormat("pt-BR",{hour:"2-digit",minute:"2-digit",timeZone:timezone}).format(new Date());
  const sidebarTimeReference = () => {
    const city=weatherLocations[activeCity()] ? activeCity() : "La Paz";
    return { city, timezone:weatherLocations[city].timezone };
  };
  const updateSidebarClock = () => {
    const {city,timezone}=sidebarTimeReference();
    const cityLabel=$("#sidebar-local-city"); const timeLabel=$("#sidebar-local-time");
    if(cityLabel)cityLabel.textContent=city;
    if(timeLabel)timeLabel.textContent=weatherTime(timezone);
  };
  const startSidebarClock = () => {
    updateSidebarClock();
    if(!startSidebarClock.timer)startSidebarClock.timer=window.setInterval(updateSidebarClock,60000);
  };
  const cityHeroMarkup = (city) => {
    const visual=cityVisual(city); const location=weatherLocations[city];
    return `<section class="hero city-hero" data-city-hero="${city}"><div class="eyebrow">Cidade do roteiro</div><h2>${city}</h2><p>Referência visual da cidade</p><aside class="weather-panel"><span>Clima atual · ${city}</span><b class="city-weather-value">Carregando clima...</b><small class="city-local-time">Horário local: ${location?weatherTime(location.timezone):"indisponível"}</small><a class="city-weather-source" href="https://open-meteo.com/en/docs" target="_blank" rel="noopener noreferrer">Fonte: Open-Meteo <span class="external-mark" aria-hidden="true">↗</span></a></aside>${visual?`<div class="place-visual"><img src="${visual.image}" alt="Vista de ${city}" /><a class="photo-source" href="${visual.source}" target="_blank" rel="noopener noreferrer">${visual.credit} <span class="external-mark" aria-hidden="true">↗</span></a><a class="map-source" href="${buildGoogleMapsSearchUrl(`${city}, Bolívia`)}" target="_blank" rel="noopener noreferrer">Google Maps <span class="external-mark" aria-hidden="true">↗</span></a></div>`:""}</section>`;
  };
  const hydrateCityHeroes = () => {
    document.querySelectorAll("[data-city-hero]:not([data-hydrated])").forEach(async (hero)=>{
      hero.dataset.hydrated="true";
      const city=hero.dataset.cityHero; const location=weatherLocations[city]; const value=hero.querySelector(".city-weather-value");
      if(!location){value.textContent="Clima indisponível";return;}
      try { const response=await fetch(weatherApiUrl(location)); if(!response.ok) throw new Error("weather"); const forecast=await response.json(); if(!hero.isConnected)return; const info=weatherMeta(forecast.current.weather_code); value.innerHTML=`${info[0]} ${Math.round(forecast.current.temperature_2m)}° <small>${info[1]} · sensação ${Math.round(forecast.current.apparent_temperature)}°</small>`; }
      catch { if(hero.isConnected)value.textContent="Clima indisponível"; }
    });
    if(!hydrateCityHeroes.timer) hydrateCityHeroes.timer=window.setInterval(()=>document.querySelectorAll("[data-city-hero]").forEach((hero)=>{const location=weatherLocations[hero.dataset.cityHero];const clock=hero.querySelector(".city-local-time");if(location&&clock)clock.textContent=`Horário local: ${weatherTime(location.timezone)}`;}),60000);
  };
  const openCityDialog = (city) => {
    if(!cityVisual(city)) return;
    document.querySelector(".city-dialog")?.remove();
    document.body.insertAdjacentHTML("beforeend",`<div class="city-dialog" role="dialog" aria-modal="true" aria-label="Informações de ${city}"><div class="city-dialog-shell"><button class="button secondary city-dialog-close" data-city-close>← Voltar</button>${cityHeroMarkup(city)}</div></div>`);
    hydrateCityHeroes();
    document.querySelector(".city-dialog-close")?.focus();
  };
  const showToast = (message) => { const toast=$("#toast"); toast.textContent=message; toast.classList.add("show"); window.clearTimeout(showToast.timer); showToast.timer=window.setTimeout(()=>toast.classList.remove("show"),2400); };
  const button = (text, action, kind="secondary") => `<button class="button ${kind}" ${action}>${text}</button>`;
  const cityButton = (city) => `<button class="button small secondary" data-city-info="${city}">Ver cidade · ${city}</button>`;
  const navMarkup = () => nav.map((item)=>`<button class="nav-button ${state.view===item.id?"active":""}" data-view="${item.id}"><span class="nav-icon">${icons[item.icon]}</span><span>${item.label}</span></button>`).join("");
  const pageTitle = (title, subtitle) => `<div class="page-top"><div>${state.navigationDepth>0?`<button class="button ghost nav-back" data-nav-back>← Voltar</button>`:""}<div class="eyebrow">${data.trip.name}</div><h1>${title}</h1>${subtitle?`<div class="subtle">${subtitle}</div>`:""}<div class="data-source">${syncLabel()}</div></div>${button("Atualizar","data-action=refresh","secondary")}</div>`;
  const metric = (label,value,detail="",tone="") => `<div class="metric ${tone}"><span>${label}</span><b>${value}</b>${detail?`<small class="tiny">${detail}</small>`:""}</div>`;
  const alertList = () => `<div class="list">${data.alerts.map(a=>{const tone=statusTone(`${a.level} ${a.type}`);return `<button class="list-item alert ${tone}" data-view="${a.target}"><div class="item-row"><span class="alert-text">${a.text}</span><span class="status ${tone}">${a.type}</span></div></button>`;}).join("")}</div>`;
  const routeCard = (item) => { const isOpen = state.expanded === item.id; const ep = episode(item.episode); return `<div class="timeline-card" data-route-card="${item.id}"><div class="list-item"><button class="item-toggle" data-expand="${item.id}"><span class="item-row"><span><span class="item-title">${dateText(item.date)} · ${item.city}</span><span class="item-meta">${item.activity}</span></span><span class="tag">${item.dayType}</span></span></button>${isOpen?`<div class="details"><p><b>Local:</b> ${item.place || item.destination || item.city}</p>${ep?`<p><b>Episódio ${ep.number}:</b> ${ep.title}</p>`:""}${item.mode?`<p><b>Deslocamento:</b> ${item.origin} → ${item.destination} · ${item.time}</p>`:""}<p><b>Sequência:</b> ${item.points.join(" → ")}</p><div class="actions">${button("Abrir no Maps",mapSearch(item.place || item.destination || item.city),"small")}${item.origin&&item.destination?button("Como chegar",mapDirections(item.origin,item.destination,item.mode==="caminhada"?"walking":"driving"),"small"):""}${button("Abrir rota do dia",mapDayRoute(item.points,item.mode==="caminhada"?"walking":"driving"),"small")}${item.lodgingId?button("Voltar à hospedagem",mapSearch(lodging(item.lodgingId).place),"small"):""}</div></div>`:""}</div></div>`; };
  const todayView = () => { const date=operationalDate(); const today=routeForDate(date); const next=nextRouteChange(); const nextRecording=[...data.episodes].filter((item)=>item.recordingDate && item.recordingDate>=date).sort((a,b)=>a.recordingDate.localeCompare(b.recordingDate))[0]; const nextPublication=[...data.episodes].filter((item)=>item.publishDate && item.publishDate>=date).sort((a,b)=>a.publishDate.localeCompare(b.publishDate))[0]; const nextTask=[...data.tasks].filter((item)=>item.situation!=="CONCLUÍDA" && item.due).sort((a,b)=>a.due.localeCompare(b.due))[0]; const currentLodging=activeLodging(); const cityLabel=tripProgress().phase==="before"?"Primeira cidade":"Cidade atual"; const nextLabel=next.origin && next.destination ? `${next.origin} <span>→</span> ${next.destination}` : "Sem mudança cadastrada"; return `${pageTitle("Hoje",`<span data-trip-progress>${tripProgressText()}</span>`)}<section class="hero"><div class="eyebrow" data-trip-city-label>${cityLabel}</div><h2>${activeCity()}</h2><p>${today.dayType || "Sem atividade cadastrada"}<br />${today.activity || ""}</p></section><section class="route-card"><div class="route-top"><div><div class="eyebrow">Próxima mudança de cidade</div><div class="route-line">${nextLabel}</div><div class="subtle">${next.date?formatDate(next.date,{weekday:"long",day:"2-digit",month:"long"}):"A definir"}${next.time?` · ${next.time}`:""}${next.duration?` · ${next.duration}`:""}</div></div><span class="status warning">${next.status ? next.status.toUpperCase() : "A DEFINIR"}</span></div><div class="actions wide-actions">${next.origin&&next.destination?button("Rota",mapDirections(next.origin,next.destination),"small"):""}${button("Hospedagem",mapSearch(currentLodging.place),"small")}</div></section><div class="grid two">${metric("Próxima gravação",nextRecording?formatDate(nextRecording.recordingDate):"—",nextRecording?.title || "Sem gravação cadastrada")}${metric("Próxima publicação",nextPublication?formatDate(nextPublication.publishDate):"—",nextPublication?.title || "Sem publicação cadastrada")}${metric("Próximo prazo",nextTask?formatDate(nextTask.due):"—",nextTask?.task || "Sem prazo cadastrado")}${metric("Edição",nextRecording?.status || "A definir",nextRecording?.title || "Sem edição cadastrada")}</div><div class="content-columns"><div><section class="section"><div class="section-heading"><h2>Próximos 7 dias</h2><button class="button ghost" data-open-route="week">Ver roteiro</button></div><div class="list">${data.itinerary.filter((item)=>item.date>=date).slice(0,7).map((item)=>`<button class="list-item" data-open-route="week" data-route-item="${item.id}"><div class="item-row"><div><span class="item-title">${formatDate(item.date)} · ${item.city}</span><div class="item-meta">${item.activity}</div></div><span class="tag">${item.dayType}</span></div></button>`).join("")}</div></section></div><div><section class="section"><div class="section-heading"><h2>Alertas importantes</h2><button class="button ghost" data-view="pending">Ver tudo</button></div>${alertList()}</section><section class="section"><h2>Base atual</h2><div class="list-item"><b>${currentLodging.name}</b><div class="item-meta">${currentLodging.address || currentLodging.city}${currentLodging.checkout?` · checkout ${formatDate(currentLodging.checkout)}`:""}</div><div class="actions">${button("Voltar para hospedagem",mapSearch(currentLodging.place),"small")}</div></div></section></div></div>`; };
  const routeView = () => { let items=[...data.itinerary]; const today=operationalDate(); if(state.routeFilter==="today") items=items.filter(i=>i.date===today); if(state.routeFilter==="week") items=items.filter(i=>i.date>=today).slice(0,7); if(state.routeCity!=="all") items=items.filter(i=>i.city===state.routeCity); const cities=[...new Set(data.itinerary.map(i=>i.city))]; return `${pageTitle("Roteiro","Sequência operacional da viagem") }<div class="chip-bar"><button class="chip ${state.routeFilter==="today"?"active":""}" data-route-filter="today">Hoje</button><button class="chip ${state.routeFilter==="week"?"active":""}" data-route-filter="week">Próximos 7 dias</button><button class="chip ${state.routeFilter==="all"?"active":""}" data-route-filter="all">Viagem completa</button></div><div class="filter-row"><select id="city-filter"><option value="all">Todas as cidades</option>${cities.map(c=>`<option value="${c}" ${state.routeCity===c?"selected":""}>${c}</option>`).join("")}</select></div><div class="timeline">${items.length?items.map(routeCard).join(""):`<div class="empty">Nenhum dia corresponde a este filtro.</div>`}</div>`; };
  const pendingView = () => { const filters=["all","VENCIDA","URGENTE","VENCE HOJE","PRÓXIMA","NO PRAZO","SEM PRAZO","BLOQUEADA"]; const tasks=state.taskFilter==="all"?data.tasks:data.tasks.filter(t=>t.situation===state.taskFilter); const totals=[["Vencidas","VENCIDA","critical"],["Urgentes","URGENTE","critical"],["Vence hoje","VENCE HOJE","today"],["Próximas","PRÓXIMA","soon"],["No prazo","NO PRAZO","good"],["Sem prazo","SEM PRAZO","no-deadline"],["Bloqueadas","BLOQUEADA","blocked"]]; return `${pageTitle("Pendências","Leitura operacional, sem edição") }<div class="grid desktop-four two">${totals.map(([label,status,tone])=>{const count=data.tasks.filter(t=>t.situation===status).length; const active=state.taskFilter===status; return `<button type="button" class="metric ${tone} pending-filter-card ${active?"selected":""}" data-task-filter="${status}" aria-pressed="${active}" aria-label="Filtrar por ${label}: ${count} tarefas"><span>${label}</span><b>${count}</b></button>`;}).join("")}</div><div class="chip-bar">${filters.map(f=>`<button class="chip ${state.taskFilter===f?"active":""}" data-task-filter="${f}">${f==="all"?"Todas":f}</button>`).join("")}</div><div class="counter">${tasks.length} tarefa${tasks.length!==1?"s":""}</div><section class="section list">${tasks.map(t=>{const tone=statusTone(t.situation);return `<div class="list-item task-card ${tone}"><button class="item-toggle" data-expand="${t.id}"><span class="item-row"><span><span class="item-title">${t.task}</span><span class="item-meta">${t.area} · ${t.owner}${t.due?` · ${formatDate(t.due)}`:""}</span></span><span class="status ${tone}">${t.situation}</span></span></button>${state.expanded===t.id?`<div class="details"><p><b>Prioridade:</b> ${t.priority}</p><p><b>Dependência:</b> ${t.dependency}</p>${t.note?`<p>${t.note}</p>`:""}</div>`:""}</div>`;}).join("")}</section>`; };
  const productionStatusTone = (value="") => {
    const status=String(value).toLowerCase();
    if(/publicado/.test(status)) return "production-published";
    if(/pronto/.test(status)) return "production-ready";
    if(/conclu[ií]do/.test(status)) return "production-complete";
    if(/editando/.test(status)) return "production-editing";
    if(/gravado/.test(status)) return "production-captured";
    if(/gravando/.test(status)) return "production-recording";
    if(/a gravar/.test(status)) return "production-upcoming";
    if(/em pauta/.test(status)) return "production-in-development";
    return "production-planned";
  };
  const productionView = () => {
    const nextRecording=getNextToRecord();
    const nextPublication=getNextToPublish();
    const stock=getContentStock();
    const episodes=state.productionFilter==="stock"?stock:getAllEpisodes();
    const productionMetric = (label,value,detail,action,tone="") => `<button type="button" class="metric production-metric ${tone} ${state.productionFilter===action?"selected":""}" data-production-card="${action}" aria-pressed="${state.productionFilter===action}" aria-label="${label}: ${value}. ${detail}"><span>${label}</span><b>${value}</b><small class="tiny">${detail}</small></button>`;
    const episodeRow = (e) => `<button class="list-item production-episode" data-expand="ep${e.number}" aria-label="Abrir detalhes do episódio ${e.number}: ${e.title}">
      <span class="production-number">${String(e.number).padStart(2,"0")}</span>
      <span class="production-story"><span class="item-title">${e.title}</span><span class="production-location">${e.city}<span>Gravação ${formatDate(e.recordingDate)}</span></span></span>
      <span class="production-publication"><span class="production-column-label">Publicação</span><strong>${formatDate(e.publishDate)}</strong></span>
      <span class="production-status-group production-capture"><span class="production-column-label">Captação</span><span class="status ${productionStatusTone(e.status)}">${e.status}</span></span>
      <span class="production-status-group production-editing"><span class="production-column-label">Edição</span><span class="status ${productionStatusTone(e.editingStatus)}">${e.editingStatus}</span></span>
      <span class="production-chevron" aria-hidden="true">›</span>
    </button>`;
    return `${pageTitle("Produção","Captação, edição e publicação")}
      <div class="production-summary">
        ${productionMetric("Episódios",`${getAllEpisodes().length} definidos`,"Ver todos os episódios","all")}
        ${productionMetric("Próximo a gravar",`#${String(nextRecording.number).padStart(2,"0")} — ${nextRecording.title}`,`${formatDate(nextRecording.recordingDate)} · ${nextRecording.city}`,`episode-${nextRecording.number}`,"warning")}
        ${productionMetric("Próxima publicação",nextPublication.title,formatDate(nextPublication.publishDate),`episode-${nextPublication.number}`)}
        ${productionMetric("Estoque",`${stock.length} episódios`,"gravados e não publicados","stock","stock")}
      </div>
      ${state.productionFilter==="stock"?`<div class="production-filter-active" role="status"><span>Estoque · ${stock.length} episódios</span><button type="button" data-production-card="all">Limpar filtro</button></div>`:""}
      <section class="section production-editing-days"><div class="section-heading"><h2>Dias protegidos de edição</h2></div><div class="editing-calendar">${data.editingDays.map(day=>`<span class="date-pill">${day}</span>`).join("")}</div><div class="production-extra"><span>Extra</span><b>14/11</b><span>edição/descanso</span></div></section>
      <section class="section production-list" id="production-episodes"><div class="section-heading"><h2>Episódios</h2><span class="counter">${episodes.length} ${state.productionFilter==="stock"?"no estoque":"definidos"}</span></div><div class="production-table-head" aria-hidden="true"><span>Nº</span><span>Episódio · local / gravação</span><span>Publicação</span><span>Captação</span><span>Edição</span><span></span></div><div class="list">${episodes.map(episodeRow).join("")||`<div class="empty">Nenhum episódio no estoque.</div>`}</div></section>`;
  };
  const flightCard = (f) => `<div class="list-item"><div class="item-row"><div><b>${f.airline} · ${f.flight}</b><div class="item-meta">${f.origin} → ${f.destination} · ${formatDate(f.date)} · ${f.departure}–${f.arrival}</div></div><span class="status ${statusTone(f.status)}">${f.status}</span></div><div class="actions">${cityButton(f.destination)}${button("Ver status do voo",`onclick="openMap('${f.statusUrl}')"`,"small")}${button("Abrir companhia",`onclick="openMap('${f.companyUrl}')"`,"small")}${button("Aeroporto no Maps",mapSearch(f.terminal),"small")}</div></div>`;
  const tripSubview = () => { const view=state.tripView; const title={flights:"Voos",transports:"Transportes",lodgings:"Hospedagens",reservations:"Reservas",documents:"Documentos",contacts:"Contatos"}[view]; let content=""; if(view==="flights") content=data.flights.map((flight)=>`<div class="list-item"><b>${flight.origin} → ${flight.destination}</b><div class="item-meta">${flight.airline} · ${flight.flight} · ${formatDate(flight.date)} · ${flight.departure} → ${flight.arrival}</div><div class="item-meta">${flight.connection}</div></div>`).join(""); if(view==="transports") content=data.transports.map((item)=>`<div class="list-item"><div class="item-row"><div><b>${item.origin} → ${item.destination}</b><div class="item-meta">${item.mode}${item.date?` · ${formatDate(item.date)}`:""}${item.time?` · ${item.time}`:""}${item.duration?` · ${item.duration}`:""}</div></div><span class="status ${statusTone(item.status)}">${item.status || "A definir"}</span></div><div class="actions">${button("Abrir no Maps",mapSearch(item.place),"small")}${button("Como chegar",mapDirections(item.origin,item.destination),"small")}</div></div>`).join(""); if(view==="lodgings") content=data.lodgings.map((item)=>`<div class="list-item"><div class="item-row"><div><b>${item.city} · ${item.name}</b><div class="item-meta">${item.address || "Endereço a definir"}${item.checkout?` · check-out ${formatDate(item.checkout)}`:""}</div></div><span class="status ${statusTone(item.status)}">${item.status || "A definir"}</span></div><div class="actions">${cityButton(item.city)}${button("Ir para hospedagem",mapSearch(item.place),"small")}</div></div>`).join(""); if(view==="reservations") content=`<div class="list">${data.reservations.map((item)=>`<div class="list-item"><b>${item.item}</b><div class="item-meta">${item.type}${item.place?` · ${item.place}`:""}${item.startDate?` · ${formatDate(item.startDate)}`:""}</div><span class="status ${statusTone(item.status)}">${item.status || "A definir"}</span></div>`).join("") || `<div class="empty">Nenhum item público.</div>`}</div>`; if(view==="documents") content=`<div class="list">${data.documents.map((item)=>`<div class="list-item item-row"><b>${item.category}</b><span class="status ${statusTone(item.status)}">${item.status || "A conferir"}</span></div>`).join("") || `<div class="empty">Nenhum status público.</div>`}</div>`; if(view==="contacts") content=`<div class="empty">Contatos privados não são exibidos no app público.</div>`; return `<div class="subview-top"><button class="button ghost" data-trip-back>←</button><h1>${title}</h1></div>${content}`; };
  const tripView = () => { if(state.tripView) return tripSubview(); const current=activeLodging(); const entries=[ ["flights","Voos","itinerário de voo"],["transports","Transportes","deslocamentos e rotas"],["lodgings","Hospedagens","base atual e próximas"],["reservations","Reservas","status operacional"],["documents","Documentos","somente status seguro"],["contacts","Contatos","dados privados protegidos"] ]; return `${pageTitle("Viagem",`${data.trip.startDate.split("-").reverse().join("/")} → ${data.trip.endDate.split("-").reverse().join("/")} · ${tripProgress().label}`)}<section class="route-card"><div class="eyebrow">Hospedagem atual</div><h2>${current.name}</h2><p class="subtle">${current.address || current.city}${current.checkout?` · check-out ${formatDate(current.checkout)}`:""}</p><div class="actions">${cityButton(current.city)}${button("Ir para hospedagem",mapSearch(current.place),"small")}${button("Abrir no Maps",mapSearch(current.place),"small")}</div></section><section class="trip-menu">${entries.map(([id,title,detail])=>`<button class="menu-card" data-trip-view="${id}"><span><b>${title}</b><small>${detail}</small></span><span class="arrow">›</span></button>`).join("")}</section><section class="section"><h2>Checklist de saída</h2><ul class="checklist">${["Backup feito","Baterias carregadas","Equipamentos conferidos","Documentos offline","Transporte confirmado","Check-out","Hospedagem seguinte","Mapa offline","Internet na próxima base"].map((item,index)=>`<li><input class="check" type="checkbox" id="check-${index}" data-check-id="${index}"><label for="check-${index}">${item}</label></li>`).join("")}</ul></section><div class="subtle">${syncLabel()}</div>`; };
  const episodeDetailView = () => { const item=episode(Number(state.episodeView)); return `<div class="episode-reference"><div class="subview-top"><button class="button ghost nav-back" data-nav-back>← Voltar</button><div><div class="eyebrow">Referência do episódio</div><h1>Episódio ${String(item.number).padStart(2,"0")}</h1></div></div>${cityHeroMarkup(item.city)}<section class="reference-hero"><div class="episode-states"><span class="status ${productionStatusTone(item.status)}">${item.status}</span><span class="status ${productionStatusTone(item.editingStatus)}">${item.editingStatus}</span></div><h2>${item.title}</h2><p>${item.city} · gravação prevista em ${formatDate(item.recordingDate,{day:"2-digit",month:"long"})} · publicação em ${formatDate(item.publishDate,{day:"2-digit",month:"long"})}</p></section><section class="reference-grid"><div class="reference-card"><span>Pergunta central</span><b>${item.question}</b></div><div class="reference-card"><span>Eixos</span><b>${item.axes}</b></div><div class="reference-card"><span>Captação</span><b>${item.type} · estoque ${item.stock}</b></div><div class="reference-card"><span>Edição</span><b>${item.editingStatus}</b></div></section><section class="section source-card"><div class="eyebrow">Referência de planejamento</div><h2>Base local do protótipo</h2><p>Esta tela reúne a referência mockada do episódio. Na próxima fase, ela será substituída pela leitura somente consulta do planejamento oficial, sem edição no app.</p><p><b>Pendência atual:</b> ${item.pending}</p><div class="actions">${button("Abrir local no Maps",mapSearch(item.city),"small")}${button("Ver roteiro",'data-view=route',"small")}</div></section></div>`; };
  const routeSnapshot = () => ({ view:state.view, tripView:state.tripView, episodeView:state.episodeView, routeFilter:state.routeFilter, routeCity:state.routeCity, routeItem:state.expanded });
  const applyRoute = (route) => { state.view=route.view; state.tripView=route.tripView || null; state.episodeView=route.episodeView || null; state.routeFilter=route.routeFilter || state.routeFilter; state.routeCity=route.routeCity || state.routeCity; state.expanded=route.routeItem || null; render(); $("#app").focus(); if(route.routeItem)document.querySelector(`[data-route-card="${route.routeItem}"]`)?.scrollIntoView({block:"start"}); };
  const navigate = (route) => { if(route.view===state.view && (route.tripView || null)===(state.tripView || null) && (route.episodeView || null)===(state.episodeView || null)) return; state.navigationDepth+=1; const fragment=route.episodeView?`${route.view}/episode/${route.episodeView}`:`${route.view}${route.tripView?`/${route.tripView}`:""}`; window.history.pushState({boliviaApp:true,route,depth:state.navigationDepth},"",`#${fragment}`); applyRoute(route); };
  const goBack = () => { if(state.navigationDepth>0) window.history.back(); };
  window.history.replaceState({boliviaApp:true,route:routeSnapshot(),depth:0},"",`${window.location.pathname}#today`);
  window.addEventListener("popstate",(event)=>{ if(event.state?.boliviaApp){ state.navigationDepth=event.state.depth; applyRoute(event.state.route); } else { state.navigationDepth=0; applyRoute({view:"today",tripView:null}); } });
  document.addEventListener("click",(event)=>{ const card=event.target.closest?.("[data-production-card]"); if(card){event.preventDefault();event.stopImmediatePropagation();const action=card.dataset.productionCard;if(action==="all"){state.productionFilter=null;state.episodeView=null;state.view="production";render();document.querySelector("#production-episodes")?.scrollIntoView({behavior:"smooth",block:"start"});}else if(action==="stock"){state.productionFilter="stock";state.episodeView=null;state.view="production";render();document.querySelector("#production-episodes")?.scrollIntoView({behavior:"smooth",block:"start"});}else navigate({view:"production",episodeView:Number(action.slice(8))});return;} const target=event.target.closest?.("[data-view],[data-open-route],[data-trip-view],[data-trip-back],[data-nav-back],[data-expand]"); if(!target) return; if(target.dataset.expand?.startsWith("ep")) navigate({view:"production",episodeView:Number(target.dataset.expand.slice(2))}); else if(target.dataset.openRoute) navigate({view:"route",routeFilter:target.dataset.openRoute,routeCity:"all",routeItem:target.dataset.routeItem || null}); else if(target.dataset.view) navigate({view:target.dataset.view,tripView:null,episodeView:null}); else if(target.dataset.tripView) navigate({view:"trip",tripView:target.dataset.tripView,episodeView:null}); else if(target.hasAttribute("data-trip-back") || target.hasAttribute("data-nav-back")) goBack(); else return; event.preventDefault(); event.stopImmediatePropagation(); },true);
  document.addEventListener("click",(event)=>{ const city=event.target.closest?.("[data-city-info]"); if(city){event.preventDefault();openCityDialog(city.dataset.cityInfo);return;} if(event.target.closest?.("[data-city-close]") || event.target.classList?.contains("city-dialog"))document.querySelector(".city-dialog")?.remove(); });
  document.addEventListener("keydown",(event)=>{if(event.key==="Escape")document.querySelector(".city-dialog")?.remove();});
  const renderPlaceVisual = () => { const hero=$(".hero"); if(!hero || state.view!=="today") return; const current=routeForDate(); const city=activeCity(); const place=`${current?.place || city}, Bolívia`; const visual=cityVisual(city); if(!visual) return; hero.insertAdjacentHTML("beforeend",`<div class="place-visual"><img src="${visual.image}" alt="Vista de ${city}" /><a class="photo-source" href="${visual.source}" target="_blank" rel="noopener noreferrer">${visual.credit} <span class="external-mark" aria-hidden="true">↗</span></a><a class="map-source" href="${buildGoogleMapsSearchUrl(place)}" target="_blank" rel="noopener noreferrer">Google Maps <span class="external-mark" aria-hidden="true">↗</span></a></div>`); };
  const renderWeatherPanel = async () => {
    window.clearInterval(renderWeatherPanel.timer); $("#app > .hero > .weather-panel")?.remove(); $(".weather-forecast")?.remove();
    const hero=state.view==="today"?$("#app > .hero"):null; const city=state.weatherCity || activeCity(); const location=weatherLocations[city]; if(!hero || !location) return;
    hero.insertAdjacentHTML("beforeend",`<aside class="weather-panel"><span>Clima e horário · ${city}</span><b class="weather-now">—</b><small class="weather-local-time">Horário local: ${weatherTime(location.timezone)}</small></aside>`);
    renderWeatherPanel.timer=window.setInterval(()=>{const clock=$(".weather-local-time");if(clock)clock.textContent=`Horário local: ${weatherTime(location.timezone)}`;},60000);
    const cities=[...new Set(data.itinerary.filter(item=>item.date>=operationalDate()).map(item=>item.city))].filter(item=>weatherLocations[item]);
    hero.insertAdjacentHTML("afterend",`<section class="weather-forecast"><div class="weather-heading"><div><div class="eyebrow">Clima de referência</div><h2>Próximos 15 dias</h2><p class="weather-caption">Previsão ao vivo para <b>${city}</b>.</p></div><div class="weather-cities">${cities.map(item=>`<button class="weather-city ${city===item?"active":""}" data-weather-city="${item}">${item}</button>`).join("")}</div></div><div class="weather-days"><div class="weather-loading">Carregando previsão...</div></div><a class="weather-source" href="https://open-meteo.com/en/docs" target="_blank" rel="noopener noreferrer">Fonte climática: Open-Meteo <span class="external-mark" aria-hidden="true">↗</span></a></section>`);
    document.querySelectorAll("[data-weather-city]").forEach(element=>element.addEventListener("click",()=>{state.weatherCity=element.dataset.weatherCity;renderWeatherPanel();openCityDialog(element.dataset.weatherCity);}));
    try { const response=await fetch(weatherApiUrl(location)); if(!response.ok) throw new Error("weather"); const forecast=await response.json(); const now=weatherMeta(forecast.current.weather_code); const nowTarget=$(".weather-now"); if(nowTarget)nowTarget.innerHTML=`${now[0]} ${Math.round(forecast.current.temperature_2m)}° <small>${now[1]} · sensação ${Math.round(forecast.current.apparent_temperature)}°</small>`; const days=$(".weather-days"); if(days)days.innerHTML=forecast.daily.time.map((date,index)=>{const info=weatherMeta(forecast.daily.weather_code[index]);const day=new Intl.DateTimeFormat("pt-BR",{weekday:"short",day:"2-digit"}).format(new Date(`${date}T12:00:00`)).replace(".","");return `<article class="weather-day"><span>${day}</span><b>${info[0]}</b><strong>${Math.round(forecast.daily.temperature_2m_max[index])}°</strong><small>${Math.round(forecast.daily.temperature_2m_min[index])}° · ${forecast.daily.precipitation_probability_max[index]}%</small></article>`;}).join(""); } catch { const nowTarget=$(".weather-now"); if(nowTarget)nowTarget.textContent="Clima indisponível"; const days=$(".weather-days"); if(days)days.innerHTML=`<div class="weather-loading">Não foi possível consultar a previsão agora.</div>`; }
  };
  const renderRouteContext = () => {
    if(state.view!=="route") return;
    const timeline=$(".timeline"); if(!timeline)return;
    const selected=data.itinerary.find(item=>item.id===state.expanded);
    const details=selected?document.querySelector(`[data-route-card="${selected.id}"] .details`):null;
    const city=details?selected.city:state.routeCity==="all"?activeCity():state.routeCity;
    if(!cityVisual(city))return;
    if(details)details.insertAdjacentHTML("afterbegin",cityHeroMarkup(city));
    else timeline.insertAdjacentHTML("beforebegin",cityHeroMarkup(city));
  };
  const render = () => { document.querySelector(".city-dialog")?.remove(); $("#desktop-nav").innerHTML=navMarkup(); $("#mobile-nav").innerHTML=navMarkup(); startSidebarClock(); const views={today:todayView,route:routeView,pending:pendingView,production:state.episodeView?episodeDetailView:productionView,trip:tripView}; $("#app").innerHTML=views[state.view](); startTripProgressClock(); startLocationTracking(); renderPlaceVisual(); renderWeatherPanel(); renderRouteContext(); hydrateCityHeroes(); bind(); };
  const refreshData = async () => { try { const result=await window.appApi?.refresh(); if(!result) throw new Error("Integração indisponível."); data=result.data; showToast("Dados da planilha atualizados."); render(); } catch(error) { showToast(error.message || "Não foi possível atualizar. Dados anteriores preservados."); } };
  const bind = () => { document.querySelectorAll("[data-view]").forEach(el=>el.addEventListener("click",()=>{state.view=el.dataset.view;state.tripView=null;state.expanded=null;render();$("#app").focus();})); document.querySelectorAll("[data-open-route]").forEach(el=>el.addEventListener("click",()=>{state.view="route";state.routeFilter=el.dataset.openRoute;state.tripView=null;state.expanded=null;render();$("#app").focus();})); document.querySelectorAll("[data-route-filter]").forEach(el=>el.addEventListener("click",()=>{state.routeFilter=el.dataset.routeFilter;state.expanded=null;render();})); const city=$("#city-filter"); if(city) city.addEventListener("change",()=>{state.routeCity=city.value;state.expanded=null;render();}); document.querySelectorAll("[data-task-filter]").forEach(el=>el.addEventListener("click",()=>{state.taskFilter=el.dataset.taskFilter;state.expanded=null;render();})); document.querySelectorAll("[data-expand]").forEach(el=>el.addEventListener("click",()=>{state.expanded=state.expanded===el.dataset.expand?null:el.dataset.expand;render();})); document.querySelectorAll("[data-trip-view]").forEach(el=>el.addEventListener("click",()=>{state.tripView=el.dataset.tripView;render();})); const back=$("[data-trip-back]"); if(back)back.addEventListener("click",()=>{state.tripView=null;render();}); document.querySelectorAll("[data-action=refresh]").forEach(el=>el.addEventListener("click",refreshData)); document.querySelectorAll("[data-check-id]").forEach(el=>{ const key=`bolivia-2026.check.${el.dataset.checkId}`; el.checked=localStorage.getItem(key)==="1"; el.addEventListener("change",()=>localStorage.setItem(key,el.checked?"1":"0")); }); };
  render();
  window.setTimeout(refreshData,0);
})();
