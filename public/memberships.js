const STORAGE_KEYS = {
  plan: 'pkdex.membership.plan',
  billing: 'pkdex.membership.billingCycle'
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const toast = $('#toast');

const PLAN_NAMES = {
  free: 'Aficionado',
  gym: 'Líder de Gimnasio',
  elite: 'Alto Mando',
  champion: 'Campeón de Liga'
};

const PLAN_PRICES = {
  free: 0,
  gym: 7,
  elite: 11,
  champion: 29.99
};

function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove('hidden');
  clearTimeout(showToast.t);
  showToast.t = setTimeout(() => toast.classList.add('hidden'), 2600);
}

function currentPlan(){
  try { return localStorage.getItem(STORAGE_KEYS.plan) || 'free'; } catch { return 'free'; }
}

function normalizeBilling(value){
  const v = String(value || 'monthly').toLowerCase();
  return (v === 'annual' || v === 'yearly') ? 'annual' : 'monthly';
}

function currentBilling(){
  try { return normalizeBilling(localStorage.getItem(STORAGE_KEYS.billing)); } catch { return 'monthly'; }
}

function setPlan(planId){
  try { localStorage.setItem(STORAGE_KEYS.plan, planId); } catch {}
}

function setBilling(billing){
  try { localStorage.setItem(STORAGE_KEYS.billing, normalizeBilling(billing)); } catch {}
}

function euro(value){
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: value % 1 ? 2 : 0,
    maximumFractionDigits: 2
  }).format(value);
}

function monthlyPriceForCard(card){
  const priceNode = $('.price', card);
  const raw = priceNode?.dataset.monthlyPrice ?? priceNode?.dataset.monthly ?? PLAN_PRICES[card.dataset.plan];
  return Number(raw || 0);
}

function paintPrices(){
  const billing = currentBilling();

  $$('.billing-btn').forEach(btn => {
    const btnBilling = normalizeBilling(btn.dataset.billing);
    btn.classList.toggle('active', btnBilling === billing);
    btn.setAttribute('aria-pressed', btnBilling === billing ? 'true' : 'false');
  });

  $$('.plan-card').forEach(card => {
    const planId = card.dataset.plan || 'free';
    const priceNode = $('.price', card);
    const noteNode = $('[data-annual-note]', card) || $('.annual-note', card);
    if (!priceNode) return;

    card.classList.toggle('billing-annual', billing === 'annual');
    card.classList.toggle('billing-monthly', billing === 'monthly');

    if (planId === 'free') {
      priceNode.innerHTML = 'Gratis';
      if (noteNode) noteNode.textContent = 'Sin cambios en anual';
      return;
    }

    const monthly = monthlyPriceForCard(card);
    const yearWithoutDiscount = monthly * 12;
    const annual = yearWithoutDiscount * 0.9;
    const saving = yearWithoutDiscount - annual;

    if (billing === 'annual') {
      priceNode.innerHTML = `
        ${euro(annual)} €<small>/año</small>
        <span class="old-price">Antes ${euro(yearWithoutDiscount)} €/año</span>
      `;
      if (noteNode) noteNode.innerHTML = `Ahorras ${euro(saving)} € al año · 10% DTO`;
    } else {
      priceNode.innerHTML = `${euro(monthly)} €<small>/mes</small>`;
      if (noteNode) noteNode.innerHTML = `O ${euro(annual)} €/año con 10% de descuento`;
    }
  });

  const help = $('#billingHelp');
  if (help) {
    help.textContent = billing === 'annual'
      ? 'Pago anual seleccionado: todos los planes de pago muestran el total anual con un 10% de descuento aplicado.'
      : 'Pago mensual seleccionado: cambia a anual para ver el total con 10% de descuento automático.';
  }
}

function paintActive(){
  const active = currentPlan();
  $$('.plan-card').forEach(card => {
    const isActive = card.dataset.plan === active;
    card.classList.toggle('active-plan', isActive);
    card.style.outline = isActive ? '2px solid rgba(83,240,255,.45)' : 'none';
    const btn = $('[data-select-plan]', card);
    if (btn) btn.textContent = isActive ? `Plan activo: ${PLAN_NAMES[active]}` : btn.dataset.originalLabel || btn.textContent;
  });
}

function getSupabaseUserId() {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
      try {
        const data = JSON.parse(localStorage.getItem(key));
        return data?.user?.id;
      } catch (e) {
        console.error('Error parsing supabase storage token:', e);
      }
    }
  }
  return null;
}

$$('.billing-btn').forEach(btn => {
  btn.onclick = () => {
    const billing = normalizeBilling(btn.dataset.billing);
    setBilling(billing);
    paintPrices();
    showToast(billing === 'annual' ? 'Pago anual activado: 10% de descuento aplicado.' : 'Pago mensual activado.');
  };
});

$$('[data-select-plan]').forEach(btn => {
  btn.dataset.originalLabel = btn.textContent;
  btn.onclick = async () => {
    const planId = btn.dataset.selectPlan;
    
    // Free plan selection
    if (planId === 'free') {
      setPlan(planId);
      paintActive();
      showToast('Plan cambiado a Aficionado (Gratis).');
      return;
    }

    const userId = getSupabaseUserId();
    if (!userId) {
      showToast('Inicia sesión en la página de inicio para suscribirte.');
      setTimeout(() => {
        window.location.href = '/?login=true';
      }, 2000);
      return;
    }

    const billing = currentBilling();
    const billingText = billing === 'annual' ? 'anual con 10% de descuento' : 'mensual';

    try {
      btn.disabled = true;
      btn.textContent = 'Procesando...';

      console.log('Requesting checkout session for plan:', planId, 'billing:', billing);
      const response = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          planId: planId,
          billing: billing,
          userId: userId,
          successUrl: window.location.origin + '/memberships.html?success=true&plan=' + planId,
          cancelUrl: window.location.href
        })
      });

      const data = await response.json();
      
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Error al iniciar sesión de pago');
      }

      if (data.url) {
        showToast(`Redirigiendo a la pasarela de pago para plan ${PLAN_NAMES[planId]}...`);
        setTimeout(() => {
          window.location.href = data.url;
        }, 800);
      } else {
        throw new Error('No se recibió la URL de pago.');
      }
    } catch (err) {
      console.error(err);
      showToast(`Error: ${err.message}`);
      btn.disabled = false;
      btn.textContent = btn.dataset.originalLabel;
    }
  };
});

// Check if page loaded from successful purchase redirect
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('success') === 'true') {
    const purchasedPlan = params.get('plan') || 'elite';
    setPlan(purchasedPlan);
    paintActive();
    showToast(`¡Gracias! Tu pago fue procesado. Cuenta actualizada a ${PLAN_NAMES[purchasedPlan] || 'Premium'}.`);
    // Clean URL query params without reloading page
    window.history.replaceState({}, document.title, window.location.pathname);
  }
});

paintPrices();
paintActive();

