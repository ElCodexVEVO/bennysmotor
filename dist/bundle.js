/* Benny’s Motors · generado con node build.mjs */
(()=>{
// Clave publicable para el navegador. Los permisos se aplican mediante Auth y RLS.
const CLOUD_CONFIG = Object.freeze({
  url: 'https://ehckobsmodqjpfmnnver.supabase.co',
  publishableKey: 'sb_publishable_Rh-mkG-r08P4MGyBUGSTfA_kokbJKYL'
});

const CATEGORIES = [
  {id:'all', label:'Todos los servicios', icon:'grid'},
  {id:'taller', label:'Taller', icon:'wrench'},
  {id:'motor', label:'Motor', icon:'engine'},
  {id:'traccion', label:'Tracción', icon:'drive'},
  {id:'neumaticos', label:'Neumáticos', icon:'wheel'},
  {id:'extras', label:'Extras', icon:'bolt'}
];
// Importes transcritos del tarifario del servidor proporcionado por el usuario.
const CATALOG = [
  {id:'rendimiento', name:'Rendimiento', shop:'Piezas de Rendimiento', category:'taller', cost:7000, price:10000, icon:'gauge', detail:'Piezas para llevarlo al siguiente nivel.'},
  {id:'ruedas', name:'Juego de ruedas', shop:'Set de Rines', category:'taller', cost:7000, price:10000, icon:'wheel', detail:'El estilo empieza desde el asfalto.'},
  {id:'humo', name:'Humo de neumáticos', shop:'Kit de humo para neumáticos', category:'taller', cost:2500, price:5000, icon:'smoke', detail:'Deja tu firma en cada derrape.'},
  {id:'cosmeticos', name:'Cosméticos', shop:'Piezas Cosméticas', category:'taller', cost:2000, price:3000, icon:'car', detail:'Detalles que hacen único tu vehículo.'},
  {id:'pintura', name:'Repintar', shop:'Kit de pintura', category:'taller', cost:500, price:1500, icon:'paint', detail:'Un color nuevo. Una nueva identidad.'},
  {id:'limpieza', name:'Limpieza', shop:'Kit de limpieza', category:'taller', cost:250, price:500, icon:'sparkles', detail:'De vuelta a su mejor versión.'},
  {id:'reparacion', name:'Reparación', shop:'Kit de reparación', category:'taller', cost:500, price:1000, icon:'wrench', detail:'Listo para volver a las calles.'},
  {id:'v12', name:'Motor V12', shop:'Motor V12', category:'motor', cost:300000, price:500000, icon:'engine', detail:'Doce cilindros. Cero compromisos.', exclusive:'motor'},
  {id:'v8', name:'Motor V8', shop:'Motor V8', category:'motor', cost:40000, price:50000, icon:'engine', detail:'La esencia del músculo americano.', exclusive:'motor'},
  {id:'awd', name:'Tracción AWD', shop:'Tracción AWD', category:'traccion', cost:8000, price:12500, icon:'drive', detail:'Potencia en las cuatro ruedas.', exclusive:'traccion'},
  {id:'rwd', name:'Tracción RWD', shop:'Tracción RWD', category:'traccion', cost:7000, price:11500, icon:'drive', detail:'Toda la fuerza al eje trasero.', exclusive:'traccion'},
  {id:'fdw', name:'Tracción FDW', shop:'Tracción FDW', category:'traccion', cost:8500, price:10500, icon:'drive', detail:'Configuración del eje delantero.', exclusive:'traccion'},
  {id:'slick', name:'Slick', shop:'Slick', category:'neumaticos', cost:4000, price:6000, icon:'wheel', detail:'Máximo contacto con el asfalto.', exclusive:'neumaticos'},
  {id:'semi', name:'Semi-Slick', shop:'Semi-Slick', category:'neumaticos', cost:3500, price:6000, icon:'wheel', detail:'Equilibrio entre calle y circuito.', exclusive:'neumaticos'},
  {id:'offroad', name:'Offroad', shop:'Offroad', category:'neumaticos', cost:4500, price:6500, icon:'wheel', detail:'Prepáralo para salir del asfalto.', exclusive:'neumaticos'},
  {id:'frenos', name:'Frenos cerámicos', shop:'Frenos Ceramicos', category:'extras', cost:8000, price:20000, icon:'brake', detail:'Control a la altura de la potencia.'},
  {id:'turbo', name:'Turbo charger', shop:'Turbo charger', category:'extras', cost:25000, price:35000, icon:'turbo', detail:'Ese empuje extra que se siente.'},
  {id:'kit', name:'Kit de extras', shop:'Kit de extras', category:'extras', cost:4000, price:5000, icon:'kit', detail:'El último toque de tu preparación.'}
];
const PRESETS = [
  {id:'reference', name:'Selección de tu tabla', detail:'V8 · AWD · Slick · Frenos cerámicos', items:['v8','awd','slick','frenos'], icon:'engine'},
  {id:'maintenance', name:'Puesta a punto', detail:'Reparación · Limpieza · Repintar', items:['reparacion','limpieza','pintura'], icon:'wrench'},
  {id:'performance', name:'Street performance', detail:'Rendimiento · Rines · Turbo', items:['rendimiento','ruedas','turbo'], icon:'gauge'}
];

const euro = value => new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR',useGrouping:'always',maximumFractionDigits:2,minimumFractionDigits:Math.abs(value-Math.round(value))>0.001?2:0}).format(value);
const round = n => Math.round((n + Number.EPSILON) * 100) / 100;
function calculate(items, discountPercent=0, commissionPercent=0) {
  const subtotal=round(items.reduce((n,i)=>n+i.price*i.qty,0));
  const cost=round(items.reduce((n,i)=>n+i.cost*i.qty,0));
  const discount=round(subtotal*Math.max(0,Math.min(100,discountPercent))/100);
  const total=round(subtotal-discount);
  const gross=round(total-cost);
  // La comisión se calcula sobre la ganancia positiva, tras el descuento.
  const commission=round(Math.max(0,gross)*Math.max(0,Math.min(100,commissionPercent))/100);
  return {subtotal,cost,discount,total,gross,commission,net:round(gross-commission),units:items.reduce((n,i)=>n+i.qty,0)};
}
function addToOrder(items,service,qty=1) {
  if(!Number.isInteger(qty)||qty<1||qty>999) throw new Error('Usa una cantidad entre 1 y 999.');
  const replaced=service.exclusive ? items.filter(i=>i.id!==service.id && i.exclusive===service.exclusive) : [];
  const next=items.filter(i=>!replaced.includes(i)).map(i=>({...i}));
  const existing=next.find(i=>i.id===service.id);
  if(existing) existing.qty=service.exclusive ? 1 : Math.min(999,existing.qty+qty);
  else next.push({...service,qty:service.exclusive?1:qty});
  return {items:next,replaced};
}
function receipt(order) {
  const t=order.totals;
  return ["BENNY'S MOTORS · ORDEN DE TALLER",order.folio||'COTIZACIÓN',
    `Cliente: ${order.client||'Sin indicar'}${order.playerId?' · ID '+order.playerId:''}`,
    `Mecánico: ${order.mechanic||'Sin indicar'}`,'',
    ...order.items.map(i=>`${i.qty} × ${i.name} — ${euro(i.price*i.qty)}`),
    '',`Subtotal: ${euro(t.subtotal)}`,
    ...(t.discount?[`Descuento (${order.discount}%): −${euro(t.discount)}`]:[]),
    `TOTAL: ${euro(t.total)}`,...(order.payment?[`Pago: ${order.payment}`]:[]),
    ...(order.notes?[`Nota: ${order.notes}`]:[]),"Gracias por rodar con Benny's."
  ].join('\n');
}


const ICONS={
  grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  calculator:'<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 6h8v3H8zM8 13h1m6 0h1m-8 4h1m6 0h1"/>',
  clipboard:'<rect x="5" y="4" width="14" height="18" rx="2"/><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M9 11h6m-6 4h6m-6 3h4"/>',
  tag:'<path d="M3 3h8l10 10-8 8L3 11z"/><circle cx="7.5" cy="7.5" r="1"/>',
  chart:'<path d="M4 3v18h17M8 17v-5m5 5V7m5 10V4"/>',
  settings:'<path d="m9 3 1-1h4l1 3 3 1 3-1 2 4-2 2v3l1 2-2 4-3-1-3 2-1 2H9l-1-3-3-1-2 1-2-4 2-2v-3L1 9l2-4 3 1z" transform="translate(1 0) scale(.92)"/><circle cx="12" cy="12" r="3"/>',
  wrench:'<path d="M21 3a6 6 0 0 1-8 8L5 20a2.1 2.1 0 0 1-3-3l9-8a6 6 0 0 1 8-8l-4 4 4 2z"/><path d="m4 18 1-1"/>',
  car:'<path d="m5 8 2-5h10l2 5M3 17v3h3v-3m12 0v3h3v-3M2 10l2-2h16l2 2v7H2zM7 13H4m16 0h-3M8 8h8"/>',
  engine:'<path d="M6 7h11l3 4h2v7h-4l-2 3H6l-3-4v-7h3zM9 3h5m-3 0v4M1 12v5m2-3H1m7-3h6l3 4H8z"/>',
  wheel:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="1.5"/><path d="m12 10.5-2-5m3 5 4-3m-4 5.5 5 2m-6 0-1 4m-1-6-5 1"/>',
  drive:'<path d="M8 5h8M8 19h8M12 5v14"/><rect x="4" y="2" width="4" height="6" rx="1"/><rect x="16" y="2" width="4" height="6" rx="1"/><rect x="4" y="16" width="4" height="6" rx="1"/><rect x="16" y="16" width="4" height="6" rx="1"/><path d="m9 12 3-3 3 3-3 3z"/>',
  gauge:'<path d="M4 19a10 10 0 1 1 16 0zM12 4v2M5 8l2 1m12-1-2 1M3 14h2m14 0h2m-9 2 5-7"/><circle cx="12" cy="16" r="1.5"/>',
  smoke:'<path d="M3 19h18M5 15c-4-5 5-3 2-8M12 16c-5-5 6-5 2-12M18 16c-3-3 4-4 3-8"/>',
  paint:'<path d="M7 7h9v14H7zM9 3h5v4m-5-4V1h7m0 4h4m-1 3h2M7 12h9m-9 5h9"/>',
  sparkles:'<path d="m10 3 2 6 6 2-6 2-2 6-2-6-6-2 6-2zM19 2v4m-2-2h4M20 16v6m-3-3h6"/>',
  brake:'<circle cx="11" cy="12" r="9"/><circle cx="11" cy="12" r="3"/><path d="M17 5h4v9l-4 2zM7 7h.01m-2 5h.01m2 5h.01m6 2h.01M11 5h.01"/>',
  turbo:'<path d="M20 12a8 8 0 1 1-8-8h8V1h3v6H12a5 5 0 1 0 5 5z"/><circle cx="12" cy="12" r="2"/><path d="m10 10-2-2m6 2 2-2m-2 6 2 2m-6-2-2 2"/>',
  kit:'<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M8 7V3h8v4M2 12h20m-12-2v5h4v-5"/>',
  bolt:'<path d="m13 2-9 12h7l-1 8 10-13h-7z"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3"/>',
  search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  copy:'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M5 16H3V3h13v2"/>',
  shield:'<path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6zM8 12l3 3 5-6"/>',
  lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4m-4 4v3"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4 2c-1.5 1-1.5 1-1.5 3m0 3h.01"/>',
  download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  reset:'<path d="M3 10a9 9 0 1 1 1 8M3 4v6h6"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>',
  close:'<path d="m6 6 12 12M18 6 6 18"/>'
};
const icon=n=>`<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]||ICONS.wrench}</svg>`;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));


class BennysCloud {
  constructor(onChange){
    if(!globalThis.supabase?.createClient)throw Error('No se pudo cargar el cliente de Supabase.');
    this.client=globalThis.supabase.createClient(CLOUD_CONFIG.url,CLOUD_CONFIG.publishableKey,{auth:{storageKey:'bennys-auth-v1',persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
    this.onChange=onChange;this.user=null;this.profile=null;this.ready=false;this.loading=false;this.error=null;this.version=0;
    this.client.auth.onAuthStateChange((event,session)=>{
      if(event==='INITIAL_SESSION'||event==='SIGNED_IN'||event==='SIGNED_OUT'||event==='TOKEN_REFRESHED')setTimeout(()=>this.restore(session),0);
    });
    this.timer=setInterval(()=>{if(this.user&&document.visibilityState==='visible')this.load();},30000);
    document.addEventListener('visibilitychange',()=>{if(this.user&&document.visibilityState==='visible')this.load();});
    globalThis.addEventListener('focus',()=>{if(this.user)this.load();});
  }
  get isAdmin(){return this.ready&&this.profile?.active&&this.profile.role==='admin';}
  get isActive(){return this.ready&&this.profile?.active;}
  async rpc(name,args={}){const {data,error}=await this.client.rpc(name,args);if(error)throw error;return Array.isArray(data)&&data.length===1?data[0]:data;}
  async restore(session){
    const user=session?.user||null;
    if(this.user?.id!==user?.id){this.version++;this.profile=null;this.ready=false;}
    this.user=user;
    if(!user){this.error=null;this.loading=false;this.onChange({kind:'signedout'});return;}
    await this.load();
  }
  async pages(table,order){const rows=[];for(let start=0;;start+=1000){const {data,error}=await this.client.from(table).select('*').order(order,{ascending:false}).range(start,start+999);if(error)throw error;rows.push(...data);if(data.length<1000)break;}return rows;}
  async load(){
    if(!this.user)return;
    const version=++this.version,userId=this.user.id;this.loading=true;this.onChange({kind:'status'});
    try{
      const profile=await this.rpc('bennys_ensure_profile');
      if(version!==this.version||userId!==this.user?.id)return;
      this.profile=profile;this.error=null;
      if(!profile.active){this.ready=false;this.hasAdmin=await this.rpc('bennys_has_admin');if(version!==this.version||userId!==this.user?.id)return;this.loading=false;this.onChange({kind:'pending'});return;}
      const [services,orders,team]=await Promise.all([this.pages('bennys_services','id'),this.pages('bennys_orders','created_at'),profile.role==='admin'?this.pages('bennys_profiles','created_at'):Promise.resolve([])]);
      if(version!==this.version||userId!==this.user?.id)return;
      if(services.length!==18)throw Error('El tarifario del taller está incompleto.');
      this.ready=true;this.loading=false;this.team=team;this.onChange({kind:'data',profile,services,orders:orders.map(o=>({...o.payload,status:o.status})),team,userId});
    }catch(error){
      if(version!==this.version||userId!==this.user?.id)return;
      this.ready=false;this.loading=false;this.error=error;this.onChange({kind:'error',error});
    }
  }
  async signIn(email,password){const {error}=await this.client.auth.signInWithPassword({email,password});if(error)throw error;}
  async signUp(name,email,password){const {data,error}=await this.client.auth.signUp({email,password,options:{data:{display_name:name},emailRedirectTo:location.protocol==='https:'?location.origin+location.pathname:undefined}});if(error)throw error;return data;}
  async signOut(){const {error}=await this.client.auth.signOut({scope:'local'});if(error)throw error;}
  async claimAdmin(code){await this.rpc('bennys_claim_admin',{p_code:code});await this.load();}
  async createOrder(order){
    if(!this.isActive)throw Error('Inicia sesión con una cuenta activa para registrar el servicio.');
    const row=await this.rpc('bennys_create_order',{p_id:order.id,p_client:order.client,p_player_id:order.playerId,p_items:order.items.map(i=>({id:i.id,qty:i.qty,price:i.price,cost:i.cost})),p_discount:order.discount,p_commission:order.commission,p_payment:order.payment,p_notes:order.notes});
    return {...row.payload,status:row.status};
  }
  async cancelOrder(id){const row=await this.rpc('bennys_cancel_order',{p_id:id});return {...row.payload,status:row.status};}
  async saveService(service){return this.rpc('bennys_update_service',{p_id:service.id,p_cost:service.cost,p_price:service.price});}
  async saveEmployee(profile){return this.rpc('bennys_manage_employee',{p_id:profile.id,p_name:profile.display_name,p_role:profile.role,p_active:profile.active,p_commission:profile.commission});}
}


const $=id=>document.getElementById(id);
const GUEST_KEY='bennys-motors-v1';
const defaultState=()=>({version:1,catalog:CATALOG.map(i=>({...i})),orders:[],next:1,settings:{mechanic:'',commission:0},draft:{items:[],client:'',playerId:'',discount:0,commission:0}});
const percent=n=>Number.isFinite(n)&&n>=0&&n<=100;
const amount=n=>Number.isFinite(n)&&n>=0&&n<=100000000;
const validItem=i=>i&&CATALOG.some(s=>s.id===i.id)&&typeof i.name==='string'&&amount(i.price)&&amount(i.cost)&&Number.isInteger(i.qty)&&i.qty>=1&&i.qty<=999;
const validDraft=d=>d&&Array.isArray(d.items)&&d.items.every(validItem)&&['client','playerId'].every(k=>typeof d[k]==='string')&&percent(d.discount)&&percent(d.commission);
function validState(s){return s?.version===1&&Array.isArray(s.catalog)&&s.catalog.length===18&&CATALOG.every(original=>s.catalog.some(i=>i.id===original.id&&amount(i.price)&&amount(i.cost)))&&Array.isArray(s.orders)&&Number.isSafeInteger(s.next)&&s.next>0&&typeof s.settings?.mechanic==='string'&&percent(s.settings.commission)&&validDraft(s.draft)&&s.orders.every(o=>validDraft(o)&&typeof o.id==='string'&&typeof o.folio==='string'&&Number.isFinite(Date.parse(o.date))&&['subtotal','cost','discount','total','gross','commission','net','units'].every(k=>Number.isFinite(o.totals?.[k]))&&['active','cancelled'].includes(o.status));}
function sanitizeState(s){const clean={...s,catalog:s.catalog.map(i=>({...CATALOG.find(o=>o.id===i.id),price:i.price,cost:i.cost})),draft:{...s.draft},orders:s.orders.map(o=>({...o}))};for(const row of [clean.draft,...clean.orders]){delete row.vehicle;delete row.plate;}return clean;}
function readState(key){try{const parsed=JSON.parse(localStorage.getItem(key));return validState(parsed)?sanitizeState(parsed):defaultState();}catch{return defaultState();}}
let state=readState(GUEST_KEY),activeKey=GUEST_KEY,cloud=null,category='all',currentView='calculator',toastTimer,accountUser=null;
function toast(message){$('toast').textContent=message;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),4500);}
function errorText(error){
  const message=error?.message||String(error);
  if(/Invalid login credentials/i.test(message))return 'El correo o la contraseña no son correctos.';
  if(/Email not confirmed/i.test(message))return 'Confirma el correo de tu cuenta antes de entrar.';
  if(/rate limit|too many requests/i.test(message))return 'Hay demasiados intentos. Espera un momento y vuelve a probar.';
  if(/PGRST202|PGRST205|schema cache|Could not find the function/i.test(message)||['PGRST202','PGRST205'].includes(error?.code))return 'El taller aún no está configurado en Supabase. Contacta al administrador.';
  if(/fetch|network|Failed to/i.test(message))return 'No se pudo conectar. Conservamos tu cotización para volver a intentar.';
  return message;
}
function persist(){try{localStorage.setItem(activeKey,JSON.stringify(state));return true;}catch{toast('No se pudo guardar el borrador local. Exporta un respaldo antes de cerrar.');return false;}}
function hydrateIcons(root=document){root.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));}
function folio(){return cloud?.isActive?'POR ASIGNAR':'COTIZACIÓN';}
function snapshot(){return {...state.draft,items:state.draft.items.map(i=>({...i})),mechanic:state.settings.mechanic,totals:calculate(state.draft.items,state.draft.discount,state.draft.commission)};}
function renderServices(){
  const query=$('service-search').value.trim().toLocaleLowerCase('es');
  const list=state.catalog.filter(i=>(category==='all'||i.category===category)&&[i.name,i.shop,i.detail].join(' ').toLocaleLowerCase('es').includes(query));
  $('service-count').textContent=list.length;
  $('services-grid').innerHTML=list.length?list.map(i=>{
    const selected=state.draft.items.find(x=>x.id===i.id);
    return `<article class="service-card ${selected?'selected':''}"><div class="service-card-top"><span class="service-icon">${icon(i.icon)}</span><span class="service-category">${esc(CATEGORIES.find(c=>c.id===i.category).label)}</span></div>${selected?`<span class="selected-badge" aria-label="${selected.qty} seleccionados">${selected.qty}</span>`:''}<h3>${esc(i.name)}</h3><p class="service-description">${esc(i.detail)}</p><div class="service-card-bottom"><div class="service-price">${euro(i.price)}<small>Fábrica: ${euro(i.cost)}</small></div><button class="add-service" data-add="${i.id}" aria-label="Agregar ${esc(i.name)}">${icon('plus')}</button></div></article>`;
  }).join(''):'<div class="empty-search">No encontramos ese servicio. Prueba con otro nombre.</div>';
}
function renderOrder(){
  const t=calculate(state.draft.items,state.draft.discount,state.draft.commission);
  $('draft-folio').textContent=folio();$('order-units').textContent=t.units+' '+(t.units===1?'servicio':'servicios');
  $('order-items').innerHTML=state.draft.items.length?state.draft.items.map(i=>`<div class="order-line"><div class="line-top"><h3>${esc(i.name)}</h3><strong>${euro(i.price*i.qty)}</strong><button class="remove-line" data-remove="${i.id}" aria-label="Quitar ${esc(i.name)}">${icon('close')}</button></div><div class="line-bottom"><span>${euro(i.price)} / unidad</span><div class="qty-control"><button data-qty="${i.id}" data-delta="-1" aria-label="Reducir ${esc(i.name)}">−</button><input type="number" min="1" max="${i.exclusive?1:999}" value="${i.qty}" data-quantity="${i.id}" aria-label="Cantidad de ${esc(i.name)}" ${i.exclusive?'readonly':''}><button data-qty="${i.id}" data-delta="1" aria-label="Aumentar ${esc(i.name)}" ${i.exclusive?'disabled':''}>+</button></div></div></div>`).join(''):`<div class="empty-ticket"><span data-icon="clipboard"></span><strong>Todo empieza con una idea.</strong><p>Agrega servicios para preparar tu próximo proyecto.</p></div>`;
  hydrateIcons($('order-items'));
  for(const [id,value] of Object.entries({subtotal:t.subtotal,total:t.total,cost:t.cost,'commission-amount':t.commission,profit:t.net,'mobile-total-value':t.total}))$(id).textContent=euro(value);
  $('discount-row').hidden=!t.discount;$('discount-amount').textContent='−'+euro(t.discount);$('profit').parentElement.classList.toggle('negative',t.net<0);
  $('checkout').disabled=!state.draft.items.length;$('copy-ticket').disabled=!state.draft.items.length;
  $('commission').readOnly=Boolean(cloud?.user&&!cloud.isAdmin);
  $('commission').title=cloud?.user&&!cloud.isAdmin?'Comisión asignada por el administrador':'';
}
function renderDraftFields(){for(const [id,key] of Object.entries({'client':'client','player-id':'playerId','discount':'discount','commission':'commission'}))$(id).value=state.draft[key]||(['discount','commission'].includes(key)?0:'');}
function refresh(){renderServices();renderOrder();$('mechanic-label').textContent=state.settings.mechanic||'Mi taller';$('orders-count').textContent=state.orders.filter(o=>o.status==='active').length;renderCloudStatus();}
function add(id){const service=state.catalog.find(i=>i.id===id);if(!service)return;const old=state.draft.items.find(i=>i.id===id),result=addToOrder(state.draft.items,service);state.draft.items=result.items;persist();refresh();if(result.replaced.length)toast(`${service.name} reemplazó ${result.replaced.map(i=>i.name).join(', ')}.`);else if(service.exclusive&&old)toast('Esta configuración ya está en la orden.');}
function setView(view){
  if(view==='team'&&!cloud?.isAdmin){openAccount();return;}
  currentView=view;document.querySelectorAll('.view').forEach(el=>el.classList.toggle('active',el.id==='view-'+view));document.querySelectorAll('[data-view]').forEach(el=>el.classList.toggle('active',el.dataset.view===view));
  $('breadcrumb-current').textContent=({calculator:'Calculadora',orders:cloud?.isAdmin?'Órdenes del taller':'Mis órdenes',catalog:'Tarifario',summary:'Resumen',team:'Equipo'})[view];$('mobile-total').classList.toggle('no-mobile-total',view!=='calculator');
  if(view==='orders')renderOrders();if(view==='catalog')renderPrices();if(view==='summary')renderSummary();if(view==='team')renderTeam();history.replaceState(null,'','#'+view);window.scrollTo({top:0,behavior:'instant'});
}
function modal(title,body,footer=''){if($('modal').open)$('modal').close();$('modal-content').innerHTML=`<div class="modal-head"><h2>${title}</h2><button class="icon-button" data-close aria-label="Cerrar">${icon('close')}</button></div><div class="modal-body">${body}</div>${footer?`<div class="modal-footer">${footer}</div>`:''}`;$('modal').showModal();}
function confirmAction(title,description,action,label='Continuar'){
  modal(title,`<p>${description}</p>`,`<button class="button secondary" data-close>Cancelar</button><button class="button primary" id="confirm-action">${label}</button>`);
  $('confirm-action').onclick=async e=>{const button=e.currentTarget;button.disabled=true;try{await action();if($('modal').open)$('modal').close();}catch(error){toast(errorText(error));button.disabled=false;}};
}
function clearDraft(){state.draft={items:[],client:'',playerId:'',discount:0,commission:Number(state.settings.commission)||0};persist();renderDraftFields();refresh();}
async function copyText(text){try{await navigator.clipboard.writeText(text);toast('Ticket copiado. Listo para pegar en FiveM.');}catch{modal('Tu ticket de servicio',`<p>Copia el texto para pegarlo en el chat.</p><textarea class="receipt-text" id="manual-copy" style="width:100%;height:310px" readonly>${esc(text)}</textarea>`,`<button class="button secondary" data-close>Cerrar</button>`);$('manual-copy').select();}}
function openCheckout(){
  if(!state.draft.items.length)return;
  if(!cloud?.isActive){openAccount();return;}
  const t=snapshot().totals;
  modal('Listo para salir a las calles.',`<div class="checkout-summary"><span>${t.units} servicios · Total a cobrar</span><strong>${euro(t.total)}</strong></div>${t.net<0?'<div class="notice">El descuento deja esta orden con pérdida. Revisa el importe antes de registrar.</div>':''}<form id="checkout-form"><div class="form-grid"><label>Cliente *<input name="client" maxlength="80" value="${esc(state.draft.client)}" required placeholder="Nombre del cliente"></label><label>ID del jugador<input name="playerId" maxlength="20" value="${esc(state.draft.playerId)}" placeholder="Opcional"></label></div><label>Método de pago<select name="payment"><option>Efectivo</option><option>Transferencia</option><option>Tarjeta</option></select></label><label>Notas del trabajo<textarea name="notes" maxlength="500" rows="2" placeholder="Piezas instaladas, observaciones…"></textarea></label><p class="modal-hint">El servicio quedará guardado en el taller. Verifica el pago dentro del juego antes de confirmar.</p><div class="form-message" id="checkout-message" role="alert"></div></form>`,`<button class="button secondary" data-close>Volver</button><button class="button primary" type="submit" form="checkout-form">${icon('check')}Confirmar y registrar</button>`);
  const requestId=crypto.randomUUID();
  $('checkout-form').onsubmit=async e=>{
    e.preventDefault();const form=e.currentTarget;if(form.dataset.saving)return;const data=new FormData(form),client=String(data.get('client')).trim();if(!client){toast('Indica el nombre del cliente.');return;}
    form.dataset.saving='true';const button=document.querySelector('[form="checkout-form"]');button.disabled=true;$('checkout-message').textContent='Guardando servicio…';
    try{
      const order=await cloud.createOrder({...snapshot(),id:requestId,client,playerId:String(data.get('playerId')).trim(),payment:String(data.get('payment')),notes:String(data.get('notes')).trim()});
      state.orders=state.orders.filter(o=>o.id!==order.id);state.orders.unshift(order);clearDraft();$('modal').close();toast(`Servicio ${order.folio} registrado. ${euro(order.totals.total)}.`);openDetail(order.id);cloud.load();
    }catch(error){
      if(/TARIFA_CAMBIADA/.test(error?.message||'')){await cloud.load();state.draft.items=state.draft.items.map(i=>({...state.catalog.find(s=>s.id===i.id),qty:i.qty}));persist();renderOrder();$('modal').close();toast('Las tarifas cambiaron. Revisa el total actualizado antes de cobrar.');}
      else if(form.isConnected){$('checkout-message').textContent=errorText(error);delete form.dataset.saving;button.disabled=false;}
    }
  };
}
function periodMatches(order,period){if(period==='all')return true;const now=new Date(),date=new Date(order.date),start=new Date(now.getFullYear(),now.getMonth(),now.getDate());if(period==='week')start.setDate(start.getDate()-((start.getDay()+6)%7));if(period==='month')start.setDate(1);return date>=start&&date<=now;}
function filteredOrders(){const query=$('order-search').value.toLocaleLowerCase('es').trim();return state.orders.filter(o=>periodMatches(o,$('order-period').value)&&[o.folio,o.client,o.playerId,o.mechanic].join(' ').toLocaleLowerCase('es').includes(query));}
function shortDate(date){return new Intl.DateTimeFormat('es-MX',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}).format(new Date(date));}
function renderOrders(){
  const orders=filteredOrders();$('export-orders').disabled=!orders.length;
  $('orders-list').innerHTML=orders.length?`<div class="table-panel"><table><thead><tr><th>Folio / Fecha</th><th>Cliente / ID</th><th>Mecánico</th><th>Total</th><th>Ganancia</th><th>Estado</th><th></th></tr></thead><tbody>${orders.map(o=>`<tr><td><strong>${esc(o.folio)}</strong><small>${shortDate(o.date)}</small></td><td>${esc(o.client)}<small>${o.playerId?'ID '+esc(o.playerId):''}</small></td><td>${esc(o.mechanic||'Sin indicar')}</td><td>${euro(o.totals.total)}</td><td class="margin-price">${euro(o.totals.net)}</td><td><span class="status-pill ${o.status==='cancelled'?'cancelled':''}">${o.status==='active'?'Cobrado':'Anulado'}</span></td><td><button class="row-button" data-detail="${esc(o.id)}">Ver orden ↗</button></td></tr>`).join('')}</tbody></table></div>`:`<div class="empty-state"><span>${icon('clipboard')}</span><h2>${state.orders.length?'Sin resultados para este filtro.':'El próximo proyecto empieza aquí.'}</h2><p>${state.orders.length?'Prueba otro nombre, ID o período.':cloud?.isActive?'Registra tu primer servicio desde la calculadora.':'Accede con tu cuenta para consultar tus órdenes del taller.'}</p><button class="button primary" ${cloud?.isActive?'data-go-calculator':'data-open-account'}>${cloud?.isActive?'Abrir calculadora':'Acceder al taller'} ↗</button></div>`;
}
function openDetail(id){
  const order=state.orders.find(o=>o.id===id);if(!order)return;
  modal(`Orden ${esc(order.folio)}`,`<div class="detail-data"><span>${shortDate(order.date)} · ${esc(order.mechanic||'Sin mecánico asignado')}</span><strong>${order.status==='active'?'COBRADO':'ANULADO'}</strong></div><pre class="receipt-text">${esc(receipt(order))}</pre><div class="summary-row"><span>Costo de fábrica</span><strong>${euro(order.totals.cost)}</strong></div><div class="summary-row"><span>Comisión (${order.commission}%)</span><strong>${euro(order.totals.commission)}</strong></div><div class="summary-row"><span>Ganancia del taller</span><strong>${euro(order.totals.net)}</strong></div>`,`<button class="button secondary" id="detail-copy">${icon('copy')}Copiar ticket</button>${order.status==='active'&&cloud?.isActive?'<button class="button danger" id="cancel-order">Anular orden</button>':''}`);
  $('detail-copy').onclick=()=>copyText(receipt(order));
  if($('cancel-order'))$('cancel-order').onclick=()=>confirmAction('Anular esta orden',`La orden <strong>${esc(order.folio)}</strong> se conservará en el historial y dejará de sumar en el resumen.`,async()=>{const saved=await cloud.cancelOrder(id);state.orders=state.orders.map(o=>o.id===id?saved:o);persist();refresh();if(currentView==='orders')renderOrders();if(currentView==='summary')renderSummary();toast('Orden anulada.');},'Anular orden');
}
function renderPrices(){
  const writable=Boolean(cloud?.isAdmin);$('restore-prices').disabled=!writable;
  $('price-table').innerHTML=`<table><thead><tr><th>Servicio en tablet / Tienda</th><th>Costo fábrica (€)</th><th>Precio venta (€)</th><th>Ganancia base</th></tr></thead><tbody>${CATEGORIES.filter(c=>c.id!=='all').map(c=>`<tr class="table-category"><td colspan="4">${esc(c.label)}</td></tr>${state.catalog.filter(i=>i.category===c.id).map(i=>`<tr><td><strong>${esc(i.name)}</strong><small>${esc(i.shop)}</small></td><td><label class="sr-only" for="cost-${i.id}">Costo de ${esc(i.name)}</label><input class="price-input" id="cost-${i.id}" type="number" min="0" max="100000000" step="0.01" value="${i.cost}" data-price="${i.id}" data-field="cost" ${writable?'':'readonly'}></td><td><label class="sr-only" for="price-${i.id}">Precio de ${esc(i.name)}</label><input class="price-input" id="price-${i.id}" type="number" min="0" max="100000000" step="0.01" value="${i.price}" data-price="${i.id}" data-field="price" ${writable?'':'readonly'}></td><td class="margin-price" id="margin-${i.id}">${euro(i.price-i.cost)}</td></tr>`).join('')}`).join('')}</tbody></table>`;
}
function renderSummary(){
  const orders=state.orders.filter(o=>o.status==='active'&&periodMatches(o,$('summary-period').value)),sum=key=>orders.reduce((n,o)=>n+o.totals[key],0),services={};
  for(const order of orders)for(const item of order.items)services[item.name]=(services[item.name]||0)+item.qty;
  const popular=Object.entries(services).sort((a,b)=>b[1]-a[1]).slice(0,5),units=Object.values(services).reduce((a,b)=>a+b,0);
  $('summary-content').innerHTML=`<div class="summary-grid"><article class="stat"><span>${cloud?.isAdmin?'Ingresos del taller':'Mis ventas'}</span><strong>${euro(sum('total'))}</strong><small>Ventas después del descuento</small></article><article class="stat"><span>Órdenes cobradas</span><strong>${orders.length}</strong><small>${units} servicios realizados</small></article><article class="stat"><span>Comisiones</span><strong>${euro(sum('commission'))}</strong><small>Generadas para el mecánico</small></article><article class="stat"><span>Ganancia del taller</span><strong>${euro(sum('net'))}</strong><small>Después de costos y comisiones</small></article></div><div class="summary-panels"><section class="summary-panel"><h2>Los más pedidos</h2>${popular.length?popular.map(([name,n])=>`<div class="bar-row"><div><span>${esc(name)}</span><small>${n} ${n===1?'servicio':'servicios'}</small></div><div class="bar-track"><div class="bar-fill" style="width:${n/popular[0][1]*100}%"></div></div></div>`).join(''):'<p class="muted">Tus servicios más frecuentes aparecerán cuando registres órdenes.</p>'}</section><section class="summary-panel"><h2>Las cuentas del taller</h2><div class="summary-row"><span>Venta antes de descuentos</span><strong>${euro(sum('subtotal'))}</strong></div><div class="summary-row"><span>Descuentos aplicados</span><strong>${euro(sum('discount'))}</strong></div><div class="summary-row"><span>Costo de fábrica</span><strong>${euro(sum('cost'))}</strong></div><div class="summary-row"><span>Ticket promedio</span><strong>${euro(orders.length?sum('total')/orders.length:0)}</strong></div></section></div>`;
}
function download(name,body,type){const blob=new Blob([body],{type}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function csvCell(value){const text=String(value??'');return '"'+(/^[\s]*[=+@-]/.test(text)?"'"+text:text).replace(/"/g,'""')+'"';}
function exportCsv(){const rows=[['Folio','Fecha UTC','Cliente','ID','Mecánico','Pago','Subtotal EUR','Descuento EUR','Total EUR','Costo EUR','Comisión EUR','Ganancia EUR','Estado'],...filteredOrders().map(o=>[o.folio,o.date,o.client,o.playerId,o.mechanic,o.payment,o.totals.subtotal,o.totals.discount,o.totals.total,o.totals.cost,o.totals.commission,o.totals.net,o.status==='active'?'Cobrado':'Anulado'])];download('bennys-ordenes.csv','\uFEFF'+rows.map(row=>row.map(csvCell).join(';')).join('\r\n'),'text/csv;charset=utf-8');toast('Historial exportado con los filtros actuales.');}
function openSettings(){
  const locked=Boolean(cloud?.user&&!cloud.isAdmin);
  modal('Tu taller, a tu manera.',`<form id="settings-form"><label>Nombre del mecánico<input name="mechanic" maxlength="80" value="${esc(state.settings.mechanic)}" placeholder="Tu nombre dentro del taller" ${locked?'readonly':''}></label><label>Comisión predeterminada (%)<input name="commission" type="number" min="0" max="100" step="0.1" value="${state.settings.commission||0}" required ${locked?'readonly':''}></label><p class="modal-hint">La comisión se calcula sobre la ganancia positiva después del descuento.${locked?' Tu administrador gestiona el nombre y el porcentaje de tu cuenta.':''}</p><div class="form-message" id="settings-message" role="alert"></div></form><div class="sidebar-rule" style="margin:20px 0"></div><p><strong>Respaldo de tu taller</strong><br>${cloud?.isActive?'Las ventas y tarifas están en Supabase. Puedes exportar un respaldo de los datos a los que tienes acceso.':'La cotización se conserva en este navegador. Accede al taller para guardar tus servicios en Supabase.'}</p><div class="backup-buttons"><button class="button secondary" id="backup-export">${icon('download')}Exportar respaldo</button><button class="button secondary" id="backup-import" ${cloud?.user?'disabled title="Cierra sesión para importar un respaldo local"':''}>Importar respaldo local</button><input id="backup-file" type="file" accept=".json,application/json" hidden></div>${cloud?.user?'<p class="modal-hint" style="margin-top:15px">Los respaldos locales no reemplazan las órdenes guardadas en Supabase.</p>':''}`,`<button class="button secondary" data-close>Cerrar</button><button type="submit" form="settings-form" class="button primary">Guardar configuración</button>`);
  $('settings-form').onsubmit=async e=>{
    e.preventDefault();const form=e.currentTarget,button=document.querySelector('[form="settings-form"]'),data=new FormData(form);button.disabled=true;
    try{
      if(cloud?.user){if(!cloud.isAdmin){$('modal').close();return;}await cloud.saveEmployee({...cloud.profile,display_name:String(data.get('mechanic')).trim(),commission:Number(data.get('commission'))});await cloud.load();}
      else{state.settings.mechanic=String(data.get('mechanic')).trim();state.settings.commission=Number(data.get('commission'));}
      if(!state.draft.items.length){state.draft.commission=state.settings.commission;renderDraftFields();}persist();refresh();$('modal').close();toast('Configuración guardada.');
    }catch(error){if(form.isConnected){$('settings-message').textContent=errorText(error);button.disabled=false;}}
  };
  $('backup-export').onclick=()=>download('bennys-respaldo-'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify(state,null,2),'application/json');
  $('backup-import').onclick=()=>$('backup-file').click();
  $('backup-file').onchange=async e=>{const file=e.target.files?.[0];if(!file||cloud?.user)return;try{if(file.size>10000000)throw Error();const parsed=JSON.parse(await file.text());if(!validState(parsed))throw Error();confirmAction('Importar respaldo local',`Este respaldo contiene <strong>${parsed.orders.length} órdenes locales</strong>. Reemplazará el guardado local de este navegador.`,()=>{const old=state;state=sanitizeState(parsed);if(!persist()){state=old;throw Error('No se pudo guardar el respaldo.');}renderDraftFields();refresh();setView(currentView);toast('Respaldo local importado.');},'Importar y reemplazar');}catch{toast('El archivo no es un respaldo válido de Benny’s.');}};
}
function showHelp(){modal('Bienvenido a Benny’s.',`<p>Una calculadora de taller para las calles de Los Santos.</p><ol class="help-list"><li>Indica el cliente y su ID, o empieza a cotizar directamente.</li><li>Agrega servicios. Motor, tracción y neumáticos admiten una sola configuración.</li><li>Revisa total, costo y ganancia. La comisión se aplica a la ganancia positiva tras descuentos.</li><li>Copia el ticket para FiveM o registra el servicio cuando hayas verificado el pago.</li></ol><p><strong>Tu cuenta del taller:</strong> el administrador activa empleados, asigna comisiones y gestiona tarifas. Cada mecánico consulta sus ventas; el administrador ve las de todo el taller.</p><p class="modal-hint">Pulsa / para buscar servicios. Las cotizaciones se guardan localmente; los servicios registrados se guardan en Supabase.</p>`,`<button class="button secondary" data-close>Cerrar</button><button class="button primary" id="help-account">Mi cuenta ↗</button>`);$('help-account').onclick=openAccount;}

function renderCloudStatus(){
  const status=cloud?.loading?'Sincronizando…':cloud?.error?'Conexión pendiente':cloud?.isActive?'Sincronizado con el taller':cloud?.user?'Cuenta pendiente de activación':'Cotización local';
  $('cloud-status-text').textContent=status;$('cloud-indicator').classList.toggle('offline',!cloud?.isActive);
  $('account-label').textContent=cloud?.user?(cloud.profile?.display_name||'Mi cuenta'):'Acceder';
  $('team-nav').hidden=!cloud?.isAdmin;$('sync-button').hidden=!cloud?.user;
  $('account-role').textContent=cloud?.isActive?(cloud.isAdmin?'Administrador':'Mecánico'):'Perfil del mecánico';
  $('ticket-storage-text').textContent=cloud?.isActive?'Servicios en Supabase · Borrador local':'Cotización guardada en este navegador';
}
function cloudChanged(event){
  if(event.kind==='data'){
    if(accountUser!==event.userId){const guestDraft={...state.draft,items:state.draft.items.map(i=>({...i}))};accountUser=event.userId;activeKey='bennys-motors-v2:'+event.userId;state=readState(activeKey);if(!state.draft.items.length)state.draft=guestDraft;}
    state.catalog=CATALOG.map(original=>{const service=event.services.find(i=>i.id===original.id);return {...original,price:Number(service.price),cost:Number(service.cost)};});
    state.orders=event.orders;state.settings={mechanic:event.profile.display_name,commission:Number(event.profile.commission)};
    if(!cloud.isAdmin||!state.draft.items.length)state.draft.commission=Number(event.profile.commission);
    persist();renderDraftFields();refresh();
    if(currentView==='orders')renderOrders();if(currentView==='catalog')renderPrices();if(currentView==='summary')renderSummary();if(currentView==='team')renderTeam();
    if($('auth-form')||$('claim-form')||$('pending-account')){$('modal').close();toast('Ya estás dentro del taller.');}
  }else if(event.kind==='signedout'){
    if(accountUser){localStorage.removeItem(activeKey);accountUser=null;activeKey=GUEST_KEY;state=readState(GUEST_KEY);renderDraftFields();refresh();if(currentView==='team')setView('calculator');if(currentView==='orders')renderOrders();if(currentView==='summary')renderSummary();if(currentView==='catalog')renderPrices();}
  }else if(event.kind==='pending'){
    if(accountUser){state.orders=[];state.settings={mechanic:cloud.profile?.display_name||'',commission:0};persist();refresh();if(currentView==='orders')renderOrders();if(currentView==='summary')renderSummary();if(currentView==='catalog')renderPrices();if(currentView==='team')setView('calculator');}
    if($('auth-form')||$('pending-account'))openAccount();
  }else if(event.kind==='error'){
    if($('auth-form')){$('auth-message').textContent=errorText(event.error);document.querySelector('[form="auth-form"]').disabled=false;}
    if(currentView==='catalog')renderPrices();if(currentView==='team')setView('calculator');
  }
  renderCloudStatus();
}
function openAuth(mode='login'){
  const signup=mode==='signup';
  modal(signup?'Tu lugar en el taller.':'De vuelta al taller.',`<div class="auth-brand"><span>Benny’s</span><small>MOTORS & CUSTOMS</small></div><div class="auth-tabs"><button id="auth-login-tab" class="${signup?'':'active'}">Iniciar sesión</button><button id="auth-signup-tab" class="${signup?'active':''}">Crear cuenta</button></div><form id="auth-form">${signup?'<label>Nombre del mecánico<input name="name" maxlength="80" autocomplete="name" required placeholder="Tu nombre en el taller"></label>':''}<label>Correo electrónico<input name="email" type="email" maxlength="254" autocomplete="email" required placeholder="tu@correo.com"></label><label>Contraseña<input name="password" type="password" minlength="8" maxlength="128" autocomplete="${signup?'new-password':'current-password'}" required placeholder="Al menos 8 caracteres"></label><div class="form-message" id="auth-message" role="alert"></div></form><p class="modal-hint" style="margin-top:16px">${signup?'El administrador debe activar tu cuenta antes de que puedas registrar servicios.':'Accede para registrar servicios y consultar tus ventas desde cualquier dispositivo.'}</p>`,`<button class="button secondary" data-close>Cotizar sin entrar</button><button class="button primary" form="auth-form" type="submit">${signup?'Crear cuenta':'Entrar al taller'} ↗</button>`);
  $('auth-login-tab').onclick=()=>openAuth('login');$('auth-signup-tab').onclick=()=>openAuth('signup');
  $('auth-form').onsubmit=async e=>{e.preventDefault();const form=e.currentTarget,button=document.querySelector('[form="auth-form"]');if(button.disabled)return;button.disabled=true;const data=new FormData(form);$('auth-message').textContent=signup?'Creando tu cuenta…':'Comprobando acceso…';try{if(!cloud)throw Error('La conexión no está disponible. Vuelve a cargar la página.');if(signup){const result=await cloud.signUp(String(data.get('name')).trim(),String(data.get('email')).trim(),String(data.get('password')));if(!result.session&&form.isConnected){$('auth-message').textContent='Cuenta creada. Revisa tu correo y confirma la cuenta antes de iniciar sesión.';form.querySelector('[name="password"]').value='';button.disabled=false;return;}}else await cloud.signIn(String(data.get('email')).trim(),String(data.get('password')));if(form.isConnected){$('auth-message').textContent='Cargando tu taller…';setTimeout(()=>{if(form.isConnected&&cloud?.error){$('auth-message').textContent=errorText(cloud.error);button.disabled=false;}},1500);}}catch(error){if(form.isConnected){$('auth-message').textContent=errorText(error);button.disabled=false;}}};
}
function openAccount(){
  if(!cloud?.user){openAuth();return;}
  if(!cloud.isActive){
    const setup=!cloud.hasAdmin&&!cloud.error&&!cloud.loading;
    modal(setup?'Activa la administración.':'Tu acceso al taller.',`<div id="pending-account"><p><strong>${esc(cloud.profile?.display_name||cloud.user.email||'Tu cuenta')}</strong></p><p>${cloud.error?esc(errorText(cloud.error)):cloud.loading?'Estamos comprobando tu acceso…':setup?'Introduce el código inicial que obtuviste al instalar el taller en Supabase. Se utiliza una sola vez.':'Tu cuenta está pendiente. El administrador debe activarla desde Equipo.'}</p>${setup?'<form id="claim-form"><label>Código inicial de administrador<input name="code" type="password" maxlength="128" autocomplete="off" required placeholder="Código de activación"></label><div class="form-message" id="claim-message" role="alert"></div></form>':''}</div>`,`<button class="button secondary" id="account-signout">Cerrar sesión</button>${setup?'<button class="button primary" form="claim-form" type="submit">Activar administrador</button>':'<button class="button primary" id="account-retry">Volver a comprobar</button>'}`);
    if($('claim-form'))$('claim-form').onsubmit=async e=>{e.preventDefault();const form=e.currentTarget,button=document.querySelector('[form="claim-form"]');button.disabled=true;try{await cloud.claimAdmin(String(new FormData(form).get('code')).trim());}catch(error){if(form.isConnected){$('claim-message').textContent=errorText(error);button.disabled=false;}}};
    if($('account-retry'))$('account-retry').onclick=async()=>{await cloud.load();if(!cloud.isActive)openAccount();};
  }else modal('Tu cuenta del taller.',`<p><strong>${esc(cloud.profile.display_name)}</strong><br>${esc(cloud.user.email||'')}</p><div class="summary-row"><span>Acceso</span><strong>${cloud.isAdmin?'Administrador':'Mecánico'}</strong></div><div class="summary-row"><span>Comisión asignada</span><strong>${Number(cloud.profile.commission)} %</strong></div><p class="modal-hint" style="margin-top:18px">Las órdenes y tarifas se guardan en Supabase. Tu cotización actual se conserva en este navegador.</p>`,`<button class="button secondary" id="account-signout">Cerrar sesión</button><button class="button primary" id="account-settings">Configuración</button>`);
  if($('account-settings'))$('account-settings').onclick=openSettings;
  $('account-signout').onclick=async()=>{try{await cloud.signOut();$('modal').close();toast('Sesión cerrada.');}catch(error){toast(errorText(error));}};
}
function renderTeam(){
  if(!cloud?.isAdmin){$('team-list').innerHTML='';return;}
  const team=cloud.team||[];$('team-list').innerHTML=`<div class="notice">Cada empleado crea su cuenta desde Acceder → Crear cuenta. Actívalo aquí y asigna su comisión.</div><div class="table-panel"><table><thead><tr><th>Mecánico / Correo</th><th>Rol</th><th>Comisión</th><th>Acceso</th><th></th></tr></thead><tbody>${team.map(profile=>`<tr><td><strong>${esc(profile.display_name)}</strong><small>${esc(profile.email)}</small></td><td>${profile.role==='admin'?'Administrador':'Mecánico'}</td><td>${Number(profile.commission)} %</td><td><span class="status-pill ${profile.active?'':'cancelled'}">${profile.active?'Activo':'Pendiente / Inactivo'}</span></td><td><button class="row-button" data-employee="${esc(profile.id)}">Gestionar ↗</button></td></tr>`).join('')}</tbody></table></div>`;
}
function editEmployee(id){
  const profile=cloud?.team?.find(p=>p.id===id);if(!profile||!cloud.isAdmin)return;const self=id===cloud.user.id;
  modal('Una pieza clave del taller.',`<form id="employee-form"><label>Nombre del mecánico<input name="name" maxlength="80" required value="${esc(profile.display_name)}"></label><div class="form-grid"><label>Rol<select name="role" ${self?'disabled':''}><option value="employee" ${profile.role==='employee'?'selected':''}>Mecánico</option><option value="admin" ${profile.role==='admin'?'selected':''}>Administrador</option></select></label><label>Comisión (%)<input name="commission" type="number" min="0" max="100" step="0.01" required value="${Number(profile.commission)}"></label></div><label>Acceso<select name="active" ${self?'disabled':''}><option value="true" ${profile.active?'selected':''}>Activo</option><option value="false" ${profile.active?'':'selected'}>Inactivo / Pendiente</option></select></label><p class="modal-hint">${self?'Tu propia cuenta conserva el acceso de administrador.':'Una cuenta inactiva no puede consultar ni registrar servicios.'}</p><div class="form-message" id="employee-message" role="alert"></div></form>`,`<button class="button secondary" data-close>Cancelar</button><button class="button primary" type="submit" form="employee-form">Guardar empleado</button>`);
  $('employee-form').onsubmit=async e=>{e.preventDefault();const form=e.currentTarget,button=document.querySelector('[form="employee-form"]'),data=new FormData(form);button.disabled=true;try{await cloud.saveEmployee({...profile,display_name:String(data.get('name')).trim(),commission:Number(data.get('commission')),role:self?'admin':String(data.get('role')),active:self?true:data.get('active')==='true'});await cloud.load();if(form.isConnected)$('modal').close();toast('Empleado actualizado.');}catch(error){if(form.isConnected){$('employee-message').textContent=errorText(error);button.disabled=false;}}};
}

hydrateIcons();$('top-date').textContent=new Intl.DateTimeFormat('es-MX',{day:'numeric',month:'long',year:'numeric'}).format(new Date());
$('categories').innerHTML=CATEGORIES.map(c=>`<button class="category-button ${c.id==='all'?'active':''}" data-category="${c.id}" aria-pressed="${c.id==='all'}">${icon(c.icon)}${esc(c.label)}</button>`).join('');
renderDraftFields();refresh();
document.querySelectorAll('[data-view]').forEach(button=>button.onclick=()=>setView(button.dataset.view));
$('services-grid').onclick=e=>{const button=e.target.closest('[data-add]');if(button)add(button.dataset.add);};
$('categories').onclick=e=>{const button=e.target.closest('[data-category]');if(!button)return;category=button.dataset.category;document.querySelectorAll('[data-category]').forEach(c=>{c.classList.toggle('active',c===button);c.setAttribute('aria-pressed',String(c===button));});renderServices();};
$('service-search').oninput=renderServices;
for(const [id,key] of Object.entries({'client':'client','player-id':'playerId'}))$(id).oninput=e=>{state.draft[key]=e.target.value;persist();};
for(const key of ['discount','commission']){$(key).oninput=e=>{if(key==='commission'&&cloud?.user&&!cloud.isAdmin){e.target.value=state.draft.commission;return;}const value=Number(e.target.value);state.draft[key]=Math.max(0,Math.min(100,Number.isFinite(value)?value:0));persist();renderOrder();};$(key).onblur=()=>$(key).value=state.draft[key];}
$('order-items').onclick=e=>{const remove=e.target.closest('[data-remove]'),quantity=e.target.closest('[data-qty]');if(remove)state.draft.items=state.draft.items.filter(i=>i.id!==remove.dataset.remove);else if(quantity){const item=state.draft.items.find(i=>i.id===quantity.dataset.qty);if(!item)return;const value=item.qty+Number(quantity.dataset.delta);if(value<1)state.draft.items=state.draft.items.filter(i=>i.id!==item.id);else item.qty=Math.min(item.exclusive?1:999,value);}else return;persist();refresh();};
$('order-items').onchange=e=>{const input=e.target.closest('[data-quantity]');if(!input)return;const item=state.draft.items.find(i=>i.id===input.dataset.quantity),value=Number(input.value);if(!item)return;if(!Number.isInteger(value)||value<1||value>999){toast('La cantidad debe ser un entero entre 1 y 999.');renderOrder();return;}item.qty=item.exclusive?1:value;persist();refresh();};
$('new-order').onclick=()=>{if(state.draft.items.length||state.draft.client)confirmAction('Empezar una nueva orden','Se vaciará la cotización actual. Las órdenes registradas seguirán en el historial.',clearDraft,'Nueva orden');else{clearDraft();$('client').focus();}};
$('copy-ticket').onclick=()=>copyText(receipt(snapshot()));$('checkout').onclick=openCheckout;
$('presets-button').onclick=()=>{modal('Un buen punto de partida.',`<p>Agrega una selección de servicios con las tarifas actuales. Puedes personalizarla después.</p>${PRESETS.map(p=>`<button class="preset" data-preset="${p.id}"><span>${icon(p.icon)}</span><span><strong>${esc(p.name)}</strong><small>${esc(p.detail)}</small></span><b>${euro(p.items.reduce((n,id)=>n+state.catalog.find(i=>i.id===id).price,0))}</b></button>`).join('')}<p class="modal-hint">Las selecciones suman los precios individuales, sin descuentos de paquete.</p>`);document.querySelectorAll('[data-preset]').forEach(button=>button.onclick=()=>{const preset=PRESETS.find(p=>p.id===button.dataset.preset);for(const id of preset.items)state.draft.items=addToOrder(state.draft.items,state.catalog.find(i=>i.id===id)).items;persist();refresh();$('modal').close();toast('Selección agregada a la orden.');});};
$('settings-button').onclick=openSettings;$('profile-button').onclick=openAccount;$('top-settings').onclick=openSettings;$('help-button').onclick=showHelp;$('account-button').onclick=openAccount;
$('sync-button').onclick=async()=>{if(cloud){await cloud.load();toast(cloud.error?errorText(cloud.error):'Datos del taller actualizados.');}};
$('team-refresh').onclick=()=>cloud?.load();
$('modal').onclick=e=>{if(e.target.closest('[data-close]'))$('modal').close();else if(e.target===$('modal')){const rect=$('modal').getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)$('modal').close();}};
document.addEventListener('click',e=>{const detail=e.target.closest('[data-detail]'),employee=e.target.closest('[data-employee]');if(detail)openDetail(detail.dataset.detail);if(employee)editEmployee(employee.dataset.employee);if(e.target.closest('[data-go-calculator]'))setView('calculator');if(e.target.closest('[data-open-account]'))openAccount();});
$('order-search').oninput=renderOrders;$('order-period').onchange=renderOrders;$('summary-period').onchange=renderSummary;$('export-orders').onclick=exportCsv;
$('price-table').onchange=async e=>{const input=e.target.closest('[data-price]');if(!input)return;const item=state.catalog.find(i=>i.id===input.dataset.price),value=Number(input.value);if(!cloud?.isAdmin||!input.value.trim()||!Number.isFinite(value)||value<0||value>100000000){input.value=item[input.dataset.field];toast('Solo el administrador puede guardar tarifas válidas.');return;}input.disabled=true;try{const saved=await cloud.saveService({...item,[input.dataset.field]:Math.round(value*100)/100});item.cost=Number(saved.cost);item.price=Number(saved.price);persist();$('margin-'+item.id).textContent=euro(item.price-item.cost);renderServices();toast('Tarifa guardada para todo el taller.');}catch(error){input.value=item[input.dataset.field];toast(errorText(error));}finally{if(input.isConnected)input.disabled=false;}};
$('restore-prices').onclick=()=>{if(!cloud?.isAdmin)return;confirmAction('Restaurar el tarifario original','Se recuperarán los 18 precios de tu tabla. Las órdenes registradas conservarán sus importes.',async()=>{let saved=0;try{for(const service of CATALOG){await cloud.saveService(service);saved++;}await cloud.load();renderPrices();toast('Tarifario original restaurado.');}catch(error){await cloud.load();renderPrices();throw Error(`${saved} tarifas restauradas. ${errorText(error)}`);}},'Restaurar tarifas');};
$('mobile-ticket').onclick=()=>document.querySelector('.order-panel').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!$('modal').open&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){e.preventDefault();setView('calculator');$('service-search').focus();}});
const hash=location.hash.slice(1);if(['calculator','orders','catalog','summary'].includes(hash))setView(hash);
try{cloud=new BennysCloud(cloudChanged);renderCloudStatus();}catch(error){$('cloud-status-text').textContent='Conexión no disponible';toast(errorText(error));}

})();
