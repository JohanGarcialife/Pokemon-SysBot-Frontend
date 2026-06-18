const $ = (s, r = document) => r.querySelector(s);
const params = new URLSearchParams(location.search);
const orderId = params.get('order');
const room = $('#room');
let currentOrder = null;
let soundEnabled = false;
let audioCtx = null;

const MEMBERSHIP_PLANS = {
  free: {
    id: 'free',
    name: 'Aficionado',
    priceLabel: 'Gratis',
    dailyTrades: 3,
    className: 'plan-free',
    cta: 'Desbloquea intercambios ilimitados',
    description: '3 operaciones al día · Incluye shinys normales · Eventos y regalos shiny exclusivos bloqueados.'
  },
  gym: {
    id: 'gym',
    name: 'Líder de Gimnasio',
    priceLabel: '7 €/mes',
    dailyTrades: Infinity,
    className: 'plan-gym',
    cta: 'Plan activo',
    description: 'Intercambios ilimitados · Lotes de hasta 3 · Cola prioritaria · Eventos japoneses y especiales.'
  },
  elite: {
    id: 'elite',
    name: 'Alto Mando',
    priceLabel: '11 €/mes',
    dailyTrades: Infinity,
    className: 'plan-elite',
    cta: 'Plan destacado',
    description: 'Intercambios ilimitados · Lotes de hasta 3 · Prioridad en cola · Eventos especiales y recompensas HOME.'
  },
  champion: {
    id: 'champion',
    name: 'Campeón de Liga',
    priceLabel: '29,99 €/mes',
    dailyTrades: Infinity,
    className: 'plan-champion',
    cta: 'Máximo poder',
    description: 'Prioridad máxima · Lotes de hasta 3 · 36 Pokémon de evento HOME · Iniciales shiny reales y recompensas HOME.'
  }
};
const STORAGE_KEYS = { plan: 'pkdex.membership.plan', billing: 'pkdex.membership.billingCycle', freeUsage: 'pkdex.membership.freeUsage.v1' };

const gameTheme = {
  za: {
    className: 'theme-za',
    label: 'Pokémon Legends: Z-A',
    logo: '/assets/za-logo.png',
    instructions: [
      'Abre Pokémon Legends: Z-A.',
      'Ve al sistema de intercambio del juego y mantente en espera.',
      'Fíjate en tu posición en cola: el código no funcionará hasta que sea tu turno.',
      'Cuando la sala indique “Introduce el código ahora”, busca intercambio con el código mostrado.',
      'Acepta el intercambio y mantente atento hasta completar.'
    ]
  },
  sv: {
    className: 'theme-sv',
    label: 'Pokémon Scarlet / Violet',
    logo: '/assets/sv-logo.png',
    instructions: [
      'Abre Pokémon Scarlet/Violet.',
      'Entra en Poké Portal → Intercambio con código y mantente en espera.',
      'Fíjate en tu posición en cola: el código no funcionará hasta que sea tu turno.',
      'Cuando la sala indique “Introduce el código ahora”, busca intercambio con el código mostrado.',
      'Acepta el intercambio y mantente atento hasta completar.'
    ]
  }
};

const statusCopy = {
  submitted: ['Pedido enviado', 'Tu pedido se ha enviado correctamente. Esperando cola...'],
  queued: ['En cola', 'Tu pedido está en la cola del bot.'],
  position_update: ['Posición actualizada', 'La posición de tu pedido en la cola ha cambiado.'],
  preparing: ['Preparando intercambio', 'El bot está preparando tu pedido.'],
  searching: ['Introduce el código ahora', 'Entra al intercambio con código en tu juego.'],
  trading: ['Intercambio en curso', 'El bot ha conectado. No cierres la sala.'],
  completed: ['Intercambio completado', 'Tu pedido se ha entregado correctamente.'],
  partial_failed: ['Pedido incompleto', 'Algunos Pokémon no se entregaron.'],
  failed: ['Intercambio fallido', 'No se encontró entrenador o el intercambio se cortó.'],
  expired: ['Pedido expirado', 'Genera un pedido nuevo para continuar.']
};

const statusSpanish = {
  submitted: 'Pedido enviado. Esperando en cola...',
  queued: 'Pedido añadido a la cola.',
  position_update: 'Posición de cola actualizada.',
  preparing: 'El bot está preparando el intercambio.',
  searching: 'Introduce el código ahora y empieza el intercambio.',
  trading: 'Intercambio en curso.',
  completed: 'Intercambio completado.',
  partial_failed: 'Algunos Pokémon no se entregaron.',
  failed: 'El intercambio falló o no se encontró usuario.',
  expired: 'El pedido ha expirado.'
};

function normalizePlanId(value){
  const key = String(value || 'free').toLowerCase();
  return MEMBERSHIP_PLANS[key] ? key : 'free';
}
function currentBilling(){
  const queryBilling = params.get('billing');
  const stored = (() => { try { return localStorage.getItem(STORAGE_KEYS.billing); } catch { return 'monthly'; } })();
  return (queryBilling || stored) === 'annual' ? 'annual' : 'monthly';
}
function euro(value){
  return new Intl.NumberFormat('es-ES', { minimumFractionDigits: value % 1 ? 2 : 0, maximumFractionDigits: 2 }).format(value);
}
function planPriceLabel(plan){
  if (!plan || plan.id === 'free') return 'Gratis';
  const monthly = plan.id === 'gym' ? 7 : plan.id === 'elite' ? 11 : plan.id === 'champion' ? 29.99 : 0;
  if (currentBilling() === 'annual') return `${euro(monthly * 12 * 0.9)} €/año · -10%`;
  return plan.priceLabel;
}
function getPlanInfo(){
  const queryPlan = params.get('plan');
  const stored = (() => { try { return localStorage.getItem(STORAGE_KEYS.plan); } catch { return 'free'; } })();
  return MEMBERSHIP_PLANS[normalizePlanId(queryPlan || stored)];
}
function getFreeUsage(){
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEYS.freeUsage) || '{}');
    const today = new Date().toISOString().slice(0,10);
    if (raw.date !== today) return 0;
    return Number(raw.count || 0);
  } catch { return 0; }
}
let serverRemainingFreeTrades = null;

function remainingFreeTrades(){
  if (serverRemainingFreeTrades !== null) return serverRemainingFreeTrades;
  return Math.max(0, MEMBERSHIP_PLANS.free.dailyTrades - getFreeUsage());
}

const formArtwork = {
  '19-1': 10091, '20-1': 10092, '26-1': 10100, '27-1': 10101, '28-1': 10102,
  '37-1': 10103, '38-1': 10104, '50-1': 10105, '51-1': 10106, '52-1': 10107,
  '670-5': 10061,
  '52-2': 10161, '53-1': 10108, '58-1': 10229, '59-1': 10230, '79-1': 10164,
  '80-2': 10165, '83-1': 10166, '88-1': 10112, '89-1': 10113, '100-1': 10231,
  '101-1': 10232, '103-1': 10114, '105-1': 10115, '110-1': 10167, '122-1': 10168,
  '199-1': 10172, '211-1': 10234, '215-1': 10235, '222-1': 10173, '263-1': 10174,
  '264-1': 10175, '479-1': 10008, '479-2': 10009, '479-3': 10010, '479-4': 10011,
  '479-5': 10012, '503-1': 10236, '549-1': 10237, '550-1': 10016, '550-2': 10247,
  '562-1': 10179, '570-1': 10238, '571-1': 10239, '618-1': 10180, '628-1': 10240,
  '705-1': 10241, '706-1': 10242, '713-1': 10243, '724-1': 10244, '849-1': 10184,
  '876-1': 10186, '877-1': 10187, '901-1': 10272, '902-1': 10248, '916-1': 10254,
  '931-1': 10261, '931-2': 10262, '931-3': 10263, '978-1': 10258, '978-2': 10259,
  '999-1': 10264,
  '74-1': 10109, '75-1': 10110, '76-1': 10111,
  '77-1': 10162, '78-1': 10163, '144-1': 10169, '145-1': 10170, '146-1': 10171,
  '554-1': 10176, '555-1': 10177,
  '157-1': 10233,
  '128-1': 10250, '128-2': 10251, '128-3': 10252, '194-1': 10253,
  '422-1': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/422-east.png',
  '423-1': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/423-east.png',
  '678-1': 10026,
  '741-1': 10121, '741-2': 10122, '741-3': 10123,
  '744-1': 10148, '745-1': 10137, '745-2': 10152,
  '854-1': 10196,
  '892-1': 10191,
  '925-1': 10260, '982-1': 10255, '1012-1': 10276, '1013-1': 10277,
  '774-7': 10256, '774-9': 10257, '774-11': 10258, '774-12': 10259, '774-13': 10260, '774-31': 10261
};

function officialArtworkById(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}
function homeSpriteById(id, shiny = false) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${shiny ? 'shiny/' : ''}${id}.png`;
}
function spriteUrl(item, preferShiny = false){
  const dexId = Number(item.dexId || item.species || 1);
  const form = Number(item.form || 0);
  const key = `${dexId}-${form}`;
  const mapped = formArtwork[key];
  
  if (mapped) {
    if (typeof mapped === 'string') return mapped;
    return preferShiny && item?.shiny ? homeSpriteById(mapped, true) : officialArtworkById(mapped);
  }
  
  const baseId = isNaN(dexId) ? 1 : dexId;
  return preferShiny && item?.shiny ? homeSpriteById(baseId, true) : officialArtworkById(baseId);
}
function formatCode(code){ const c = String(code || '00000000').replace(/\D/g,'').padEnd(8,'0').slice(0,8); return `${c.slice(0,4)} ${c.slice(4)}`; }
function escapeHtml(s){ return String(s ?? '').replace(/[&<>\"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m])); }
function timeLabel(iso){ try { return new Date(iso).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit', second:'2-digit' }); } catch { return ''; } }
async function api(path, opts){ const res = await fetch(path, opts); if(!res.ok) throw new Error(`${res.status} ${res.statusText}`); return res.json(); }

function ensureAudio(){
  audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function tone(freq, start, duration, gainValue = 0.15, type = 'sine'){
  const ctx = ensureAudio();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(start); osc.stop(start + duration + 0.03);
}

function playStatusSound(status){
  if (!soundEnabled) return;
  const ctx = ensureAudio();
  const now = ctx.currentTime;
  const patterns = {
    enabled: [[660,0,0.10],[880,0.11,0.12]],
    submitted: [[520,0,0.10],[640,0.11,0.10]],
    queued: [[440,0,0.10],[560,0.12,0.10],[700,0.24,0.12]],
    position_update: [[620,0,0.08],[620,0.10,0.08]],
    preparing: [[480,0,0.08],[540,0.10,0.08],[600,0.20,0.10]],
    searching: [[880,0,0.12],[1175,0.16,0.16],[1568,0.36,0.22]],
    trading: [[740,0,0.09],[932,0.10,0.09],[740,0.22,0.09],[932,0.32,0.12]],
    completed: [[660,0,0.12],[880,0.14,0.12],[1320,0.30,0.26]],
    partial_failed: [[740,0,0.12],[370,0.16,0.22]],
    failed: [[392,0,0.18],[294,0.22,0.26]],
    expired: [[330,0,0.14],[247,0.17,0.22]]
  };
  const pattern = patterns[status] || patterns.position_update;
  pattern.forEach(([freq, offset, duration], i) => tone(freq, now + offset, duration, i === pattern.length - 1 ? 0.18 : 0.13, 'triangle'));
}
function shouldPlaySound(previousStatus, nextStatus){
  if (!nextStatus || previousStatus === nextStatus) return false;
  return ['submitted','queued','position_update','preparing','searching','trading','completed','partial_failed','failed','expired'].includes(nextStatus);
}
let countdownInterval = null;

function startSearchingCountdown(startTimeIso) {
  if (countdownInterval) clearInterval(countdownInterval);
  
  const timeoutSeconds = 60; // Standard Sysbot search timeout is 60s
  const start = new Date(startTimeIso).getTime();
  
  const updateCountdown = () => {
    const elapsed = Math.floor((Date.now() - start) / 1000);
    const remaining = Math.max(0, timeoutSeconds - elapsed);
    
    if (remaining > 0) {
      $('#statusText').textContent = `Introduce el código en tu Nintendo Switch. Tiempo restante para conectar: ${remaining}s`;
    } else {
      $('#statusText').textContent = `Tiempo de espera agotado. Si el bot no conecta, vuelve a intentarlo.`;
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  };
  
  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
}

function enableSound(){
  soundEnabled = true;
  ensureAudio();
  $('#soundBtn').classList.add('active');
  $('#soundBtn').textContent = '🔔';
  $('#beginBtn').textContent = 'Sonido activado';
  $('#beginBtn').disabled = true;
  playStatusSound('enabled');
}

function renderMembershipBanner(){
  const plan = getPlanInfo();
  const root = $('#membershipBanner');
  root.className = `membership-banner ${plan.className}`;
  if (plan.id === 'free') {
    root.innerHTML = `
      <div class="membership-copy">
        <span class="icon">↔</span>
        <div>
          <strong>${remainingFreeTrades()}/${plan.dailyTrades} intercambios disponibles</strong>
          <p>${escapeHtml(plan.description)}</p>
        </div>
      </div>
      <a href="/memberships.html">${escapeHtml(plan.cta)}</a>
    `;
  } else {
    root.innerHTML = `
      <div class="membership-copy">
        <span class="icon">👑</span>
        <div>
          <strong>${escapeHtml(plan.name)} activo · Intercambios ilimitados</strong>
          <p>${escapeHtml(plan.description)}</p>
        </div>
      </div>
      <span class="badge">${escapeHtml(planPriceLabel(plan))} <em>${escapeHtml(plan.cta)}</em></span>
    `;
  }
}

function render(order){
  const previousStatus = currentOrder?.status;
  currentOrder = order;
  const theme = gameTheme[order.game] || gameTheme.sv;
  room.className = `trade-room ${theme.className}${order.isBulk ? ' bulk-room' : ''}`;
  $('#gameLogo').src = theme.logo;
  $('#gameLabel').textContent = theme.label;
  $('#tradeCode').textContent = formatCode(order.tradeCode);
  $('#instructions').innerHTML = theme.instructions.map(x => `<li>${escapeHtml(x)}</li>`).join('');
  renderMembershipBanner();

  const items = order.items || [];
  // Si el backend marca items como delivered/completed, la sala destacará automáticamente
  // el siguiente Pokémon pendiente. Así, al terminar Charmander, puede pasar a Squirtle.
  const main = items.find(it => !['delivered','completed','done'].includes(String(it.status || '').toLowerCase())) || items[0] || { displayName:'Pokémon', species:1 };
  $('#mainSprite').src = spriteUrl(main, true);
  $('#mainSprite').onerror = () => { $('#mainSprite').src = spriteUrl(main, false); };
  $('#mainTitle').textContent = order.isBulk ? `${items.length} Pokémon listos` : main.displayName;
  $('#tagRow').innerHTML = [main.level ? `Lv. ${main.level}` : null, main.shiny ? '⭐ Shiny' : 'Regular', order.queuePosition ? `Posición ${order.queuePosition}` : null].filter(Boolean).map(t => `<span class="${t.includes('Shiny') ? 'shiny-accent' : ''}">${escapeHtml(t)}</span>`).join('');
  $('#spriteBg').innerHTML = items.slice(0,6).map((it, i) => `<img src="${spriteUrl(it, Boolean(it.shiny))}" onerror="this.onerror=null;this.src='${spriteUrl(it, false)}'" style="--i:${i}" alt="" />`).join('');

  const [title, fallback] = statusCopy[order.status] || ['Estado actualizado', 'Esperando información del bot...'];
  $('#statusTitle').textContent = title;

  if (order.status === 'searching') {
    const searchingLog = (order.logs || []).find(l => l.status === 'searching');
    const startTime = searchingLog ? searchingLog.at : new Date().toISOString();
    startSearchingCountdown(startTime);
  } else {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
    $('#statusText').textContent = order.message || statusSpanish[order.status] || order.statusLabel || fallback;
  }

  $('#timeline').innerHTML = (order.logs || []).map(log => {
    const msg = statusSpanish[log.status] || log.message || log.status;
    return `<div class="timeline-item ${log.status === order.status ? 'active' : ''}"><b>${timeLabel(log.at)}</b><span>${escapeHtml(msg)}</span></div>`;
  }).join('');
  const panelTitle = $('#pokemonPanelTitle');
  if (panelTitle) panelTitle.textContent = items.length > 1 ? 'Tus Pokémon' : 'Tu Pokémon';
  $('#pokemonList').innerHTML = items.map(it => `
    <article class="pokemon-item ${it.status || 'pending'}">
      <img src="${spriteUrl(it, Boolean(it.shiny))}" onerror="this.onerror=null;this.src='${spriteUrl(it, false)}'" alt="">
      <div>
        <strong>${escapeHtml(it.displayName)}</strong>
        <small>${it.shiny ? '⭐ Shiny' : 'Regular'}${it.level ? ` · Lv. ${it.level}` : ''}</small>
      </div>
    </article>`).join('');
  $('#warningBox').classList.toggle('hidden', order.status !== 'partial_failed' && order.status !== 'failed');

  if (shouldPlaySound(previousStatus, order.status)) playStatusSound(order.status);
}

async function loadStatus(){
  if (!orderId) throw new Error('Falta ID de orden.');
  const data = await api(`/api/orders/${encodeURIComponent(orderId)}/status`);
  if (data.remainingFreeTrades !== undefined) {
    serverRemainingFreeTrades = data.remainingFreeTrades;
  }
  render(data.order);
}

$('#beginBtn').onclick = async () => {
  enableSound();
  try {
    await loadStatus();
  } catch (err) {
    alert(err.message);
  }
};
$('#refreshBtn').onclick = () => loadStatus().catch(err => alert(err.message));
$('#soundBtn').onclick = enableSound;

(async () => {
  try {
    renderMembershipBanner();
    await loadStatus();
    setInterval(() => loadStatus().catch(console.error), 2500);
  } catch (e) {
    room.className = 'trade-room theme-error';
    $('#mainTitle').textContent = 'No se pudo cargar la sala';
    $('#statusTitle').textContent = 'Error';
    $('#statusText').textContent = e.message;
    renderMembershipBanner();
  }
})();
