/* Única fonte de dados do protótipo. Substituir apenas este objeto na futura camada de leitura. */
window.appData = {
  trip: {
    name: "Bolívia 2026", destination: "Bolívia", startDate: "2026-11-04", endDate: "2026-12-22",
    currentDate: "2026-11-07", currentCity: "La Paz", nextCity: "Coroico", period: "Dia 4 de 49",
    generalStatus: "Em viagem", lastUpdated: "Hoje, 21:42", activeLodgingId: "h1"
  },
  itinerary: [
    { id:"r1", date:"2026-11-04", city:"La Paz", region:"La Paz", activity:"Chegada e adaptação", dayType:"CHEGADA LEVE", episode:1, place:"Aeroporto Internacional de El Alto", origin:"São Paulo", destination:"La Paz", mode:"avião", time:"15:40", status:"confirmado", priority:"alta", lodgingId:"h1", points:["Aeroporto de El Alto","Hospedagem","Jantar leve"] },
    { id:"r2", date:"2026-11-05", city:"La Paz", region:"La Paz", activity:"Organização de material e edição", dayType:"EDIÇÃO PROTEGIDA", episode:null, place:"Hospedagem", time:"09:00", status:"planejado", priority:"média", lodgingId:"h1", points:["Hospedagem","Backup","Edição"] },
    { id:"r3", date:"2026-11-06", city:"La Paz", region:"La Paz", activity:"Mercado das Bruxas e Pachamama", dayType:"PRODUÇÃO", episode:3, place:"Mercado das Bruxas", time:"10:00", status:"planejado", priority:"alta", lodgingId:"h1", points:["Hospedagem","Mercado Rodríguez","Mercado das Bruxas","Mirante Killi Killi","Hospedagem"] },
    { id:"r4", date:"2026-11-07", city:"La Paz", region:"La Paz", activity:"Sem produção obrigatória", dayType:"EDIÇÃO PROTEGIDA", episode:null, place:"Hospedagem", time:"09:00", status:"em andamento", priority:"média", lodgingId:"h1", points:["Hospedagem","Edição","Café de revisão","Hospedagem"] },
    { id:"r5", date:"2026-11-08", city:"La Paz", region:"La Paz", activity:"Fiesta de las Ñatitas", dayType:"PRODUÇÃO FIXA", episode:2, place:"Cementerio General", time:"08:00", status:"confirmado", priority:"crítica", lodgingId:"h1", points:["Hospedagem","Cementerio General","Entrevista","Hospedagem"] },
    { id:"r6", date:"2026-11-09", city:"La Paz", region:"La Paz", activity:"Comida de rua em La Paz", dayType:"PRODUÇÃO LEVE", episode:4, place:"Mercado Lanza", time:"11:00", status:"planejado", priority:"alta", lodgingId:"h1", points:["Hospedagem","Mercado Lanza","Rua Jaén","Hospedagem"] },
    { id:"r7", date:"2026-11-10", city:"Coroico", region:"Yungas", activity:"La Paz para Coroico", dayType:"DESLOCAMENTO", episode:6, place:"Terminal de Minasa", origin:"La Paz", destination:"Coroico", mode:"transfer", time:"08:00", status:"pendente", priority:"crítica", lodgingId:"h2", points:["Hospedagem","Terminal de Minasa","Coroico","Hospedagem"] },
    { id:"r8", date:"2026-11-11", city:"Coroico", region:"Yungas", activity:"Edição e descanso", dayType:"EDIÇÃO PROTEGIDA", episode:null, place:"Hospedagem", time:"09:00", status:"planejado", priority:"média", lodgingId:"h2", points:["Hospedagem","Edição","Café local"] },
    { id:"r9", date:"2026-11-12", city:"Coroico", region:"Yungas", activity:"Yungas e Tocaña", dayType:"IMERSÃO", episode:6, place:"Tocaña", time:"07:30", status:"planejado", priority:"alta", lodgingId:"h2", points:["Hospedagem","Tocaña","Estrada da Morte","Hospedagem"] },
    { id:"r10", date:"2026-11-14", city:"La Paz", region:"La Paz", activity:"Retorno e edição/descanso", dayType:"SAÍDA/CHEGADA LEVE", episode:null, origin:"Coroico", destination:"La Paz", mode:"transfer", time:"10:00", status:"planejado", priority:"média", lodgingId:"h3", points:["Hospedagem","Transfer","La Paz","Hospedagem"] }
  ],
  tasks: [
    { id:"t1", task:"Confirmar transfer La Paz → Coroico", area:"Transporte", priority:"CRÍTICA", owner:"Paulo", due:"2026-11-07", situation:"VENCE HOJE", dependency:"Retorno do operador", note:"Confirmar horário e ponto de encontro.", link:"#" },
    { id:"t2", task:"Salvar mapa offline de Yungas", area:"Logística", priority:"ALTA", owner:"Andressa", due:"2026-11-08", situation:"URGENTE", dependency:"Wi-Fi da hospedagem", note:"Cobrir rota La Paz–Coroico e Tocaña.", link:"#" },
    { id:"t3", task:"Conferir seguro viagem", area:"Documentos", priority:"ALTA", owner:"Andressa", due:"2026-11-05", situation:"VENCIDA", dependency:"Apólice", note:"Dados do seguro não ficam expostos no app.", link:"#" },
    { id:"t4", task:"Reservar hospedagem em Coroico", area:"Hospedagem", priority:"CRÍTICA", owner:"Paulo", due:"2026-11-08", situation:"BLOQUEADA", dependency:"Resposta do anfitrião", note:"Manter uma opção de backup.", link:"#" },
    { id:"t5", task:"Carregar baterias e cartões", area:"Produção", priority:"ALTA", owner:"Andressa", due:"2026-11-08", situation:"URGENTE", dependency:"—", note:"Antes da Fiesta de las Ñatitas.", link:"#" },
    { id:"t6", task:"Backup do material de La Paz", area:"Pós-produção", priority:"ALTA", owner:"Paulo", due:"2026-11-09", situation:"PRÓXIMA", dependency:"SSD disponível", note:"Conferir dois destinos.", link:"#" },
    { id:"t7", task:"Revisar abertura do vídeo do domingo", area:"Edição", priority:"MÉDIA", owner:"Andressa", due:"2026-11-09", situation:"PRÓXIMA", dependency:"Corte do editor", note:"Meta de finalização: sexta.", link:"#" },
    { id:"t8", task:"Confirmar acesso para Tocaña", area:"Produção", priority:"MÉDIA", owner:"Paulo", due:"2026-11-11", situation:"NO PRAZO", dependency:"Guia local", note:"Checar personagem e permissão de captação.", link:"#" },
    { id:"t9", task:"Comprar adaptador reserva", area:"Equipamentos", priority:"BAIXA", owner:"Andressa", due:null, situation:"SEM PRAZO", dependency:"—", note:"Item não bloqueante.", link:"#" },
    { id:"t10", task:"Enviar referência de roupa para episódio 5", area:"Editorial", priority:"BAIXA", owner:"Andressa", due:"2026-11-15", situation:"NO PRAZO", dependency:"—", note:"Apoio visual para a gravação em El Alto.", link:"#" }
  ],
  episodes: [
    [1,"Primeiras impressões de La Paz","La Paz","2026-11-04","2026-11-08","GRAVADO","vlog","O que a altitude muda no primeiro contato?","Chegada, altitude, contraste","selecionar abertura","3 cenas","EDITANDO"],
    [2,"Fiesta de las Ñatitas","La Paz","2026-11-08","2026-11-15","A GRAVAR","documental","Como uma tradição íntima revela outra relação com a morte?","cultura, memória, cuidado","acesso confirmado","0 cenas","PLANEJADO"],
    [3,"Mercado das Bruxas + Pachamama + yatiris + coca","La Paz","2026-11-06","2026-11-22","EDITANDO","documental","O que esse mercado diz sobre fé e vida cotidiana?","Pachamama, coca, comércio","entrevista com yatiri","2 cenas","EM PAUTA"],
    [4,"Comida de rua em La Paz","La Paz","2026-11-09","2026-11-29","A GRAVAR","comida","O que se come nas alturas?","mercado, rua, cotidiano","definir 3 barracas","0 cenas","PLANEJADO"],
    [5,"El Alto: cholitas + cholets + mercados","El Alto","2026-11-15","2026-12-06","PRONTO","documental","Por que El Alto parece uma cidade dentro da cidade?","arquitetura, comércio, cholitas","acesso a cholet","0 cenas","PLANEJADO"],
    [6,"Estrada da Morte + Yungas + Tocaña","Coroico","2026-11-12","2026-12-13","PUBLICADO","imersão","O que existe depois da estrada mais famosa da Bolívia?","Yungas, afrobolivianos, estrada","guia pendente","0 cenas","PUBLICADO"],
    [7,"Tiwanaku","Tiwanaku","2026-11-18","2026-12-20","PLANEJADO","história","O que permanece de Tiwanaku no presente?","arqueologia, altitude, tempo","confirmar transporte","0 cenas","PLANEJADO"],
    [8,"Trekking Kallawaya","Charazani","2026-11-24","2026-12-27","PLANEJADO","aventura","Como a medicina Kallawaya atravessa a montanha?","trekking, conhecimento, comunidade","clima","0 cenas","PLANEJADO"],
    [9,"Amazônia boliviana / Madidi","Rurrenabaque","2026-12-01","2027-01-03","PLANEJADO","natureza","Que Amazônia é essa?","rio, floresta, comunidade","operador","0 cenas","PLANEJADO"],
    [10,"Potosí / Cerro Rico","Potosí","2026-12-07","2027-01-10","PLANEJADO","documental","Que preço a prata ainda cobra?","mineração, trabalho, história","acesso a mina","0 cenas","PLANEJADO"],
    [11,"Salar de Uyuni + lítio","Uyuni","2026-12-15","2027-01-17","PLANEJADO","documental","O que há por baixo do maior espelho do mundo?","salar, lítio, futuro","tour","0 cenas","PLANEJADO"],
    [12,"Santa Cruz: outra Bolívia","Santa Cruz","2026-12-19","2027-01-24","PLANEJADO","cidade","Por que Santa Cruz desafia a ideia que temos da Bolívia?","calor, economia, cidade","pauta de rua","0 cenas","PLANEJADO"],
    [13,"Trem da Morte: saindo da Bolívia","Puerto Quijarro","2026-12-22","2027-01-31","PLANEJADO","viagem","O que a saída pelo trem revela sobre a fronteira?","trem, fronteira, despedida","bilhete","0 cenas","PLANEJADO"]
  ].map(([number,title,city,recordingDate,publishDate,status,type,question,axes,pending,stock,editingStatus]) => ({number,title,city,recordingDate,publishDate,status,type,question,axes,pending,stock,editingStatus})),
  flights: [{ airline:"LATAM", flight:"LA 2400", origin:"São Paulo", destination:"La Paz", date:"2026-11-04", departure:"10:20", arrival:"15:40", terminal:"GRU T3", connection:"Direto", status:"Confirmado", baggage:"Bagagem de mão + despacho", booking:"•••• 4821", companyUrl:"https://www.latamairlines.com", statusUrl:"https://www.latamairlines.com" }],
  transports: [
    { origin:"La Paz", destination:"Coroico", mode:"transfer", supplier:"Operador Yungas", date:"2026-11-10", time:"08:00", duration:"3h30", terminalStart:"Terminal de Minasa", terminalEnd:"Centro de Coroico", status:"Pendente", booking:"A confirmar", contact:"Operador local", place:"Terminal de Minasa" },
    { origin:"Coroico", destination:"La Paz", mode:"transfer", supplier:"Operador Yungas", date:"2026-11-14", time:"10:00", duration:"3h30", terminalStart:"Centro de Coroico", terminalEnd:"La Paz", status:"Planejado", booking:"A confirmar", contact:"Operador local", place:"Coroico" }
  ],
  lodgings: [
    { id:"h1", city:"La Paz", name:"Casa Andina La Paz", address:"Sopocachi, La Paz", checkin:"2026-11-04", checkout:"2026-11-10", nights:6, contact:"Recepção (mock)", booking:"•••• LP-208", status:"Confirmada", place:"Sopocachi, La Paz" },
    { id:"h2", city:"Coroico", name:"Hospedagem em Coroico", address:"Centro de Coroico", checkin:"2026-11-10", checkout:"2026-11-14", nights:4, contact:"A confirmar", booking:"Pendente", status:"Pendente", place:"Centro de Coroico, Bolivia" },
    { id:"h3", city:"La Paz", name:"Base La Paz", address:"Miraflores, La Paz", checkin:"2026-11-14", checkout:"2026-11-18", nights:4, contact:"Recepção (mock)", booking:"•••• LP-443", status:"Confirmada", place:"Miraflores, La Paz" }
  ],
  reservations: [
    {type:"Voo", item:"São Paulo → La Paz", supplier:"LATAM", date:"2026-11-04", status:"confirmado", value:"—", currency:"", link:"#", note:"Localizador resumido."},
    {type:"Hospedagem", item:"Casa Andina La Paz", supplier:"Hospedagem", date:"2026-11-04", status:"confirmado", value:"—", currency:"", link:"#", note:"Check-out em 10/11."},
    {type:"Transfer", item:"La Paz → Coroico", supplier:"Operador Yungas", date:"2026-11-10", status:"pendente", value:"—", currency:"", link:"#", note:"Confirmar até hoje."},
    {type:"Hospedagem", item:"Base Coroico", supplier:"A definir", date:"2026-11-10", status:"a reservar", value:"—", currency:"", link:"#", note:"Ter opção de backup."}
  ],
  documents: [{name:"Passaporte Andressa",status:"OK"},{name:"Passaporte Paulo",status:"OK"},{name:"Febre amarela",status:"OK"},{name:"Seguro viagem",status:"PENDENTE"},{name:"Documentos offline",status:"PENDENTE"}],
  contacts: [{name:"Emergência local",category:"emergência",phone:"+591 000 000",whatsapp:"+591 000 000",note:"Mock"},{name:"Operador Yungas",category:"operador",phone:"+591 000 001",whatsapp:"+591 000 001",note:"Transfer La Paz–Coroico"},{name:"Casa Andina La Paz",category:"hospedagem",phone:"+591 000 002",whatsapp:"+591 000 002",note:"Recepção mock"},{name:"Seguro viagem",category:"seguro",phone:"+55 0000-0000",whatsapp:"—",note:"Número fictício"}],
  alerts: [
    {type:"Tarefa vencida",text:"Seguro viagem precisava de conferência em 05/11.",level:"critical",target:"pending"},
    {type:"Transporte",text:"Transfer para Coroico ainda não foi confirmado.",level:"critical",target:"pending"},
    {type:"Hospedagem",text:"Hospedagem em Coroico está pendente.",level:"warning",target:"trip"},
    {type:"Documento",text:"Prepare os documentos offline antes da mudança de base.",level:"warning",target:"trip"}
  ],
  editingDays: ["05/11","06/11","11/11","12/11","18/11","19/11","24/11","25/11","01/12","02/12","07/12","08/12","15/12","16/12"],
  experiences: []
};
