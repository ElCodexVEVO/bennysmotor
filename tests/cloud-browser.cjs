const {chromium}=require(process.env.PLAYWRIGHT_PATH||'C:/Users/Mateo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../dist'),preview=path.resolve(__dirname,'../preview');
fs.mkdirSync(preview,{recursive:true});
const checks=[],errors=[],pass=name=>{checks.push(name);console.log('PASS '+name);};
const money=s=>Number(s.replace(/[^\d,-]/g,'').replace(',','.'));
(async()=>{
  const {CATALOG}=await import('../dist/catalog.js'),{calculate}=await import('../dist/core.js');
  const profiles=[
    {id:'11111111-1111-4111-8111-111111111111',email:'admin@example.invalid',display_name:'Mateo',role:'admin',active:true,commission:20},
    {id:'22222222-2222-4222-8222-222222222222',email:'employee@example.invalid',display_name:'Alex',role:'employee',active:true,commission:20},
    {id:'33333333-3333-4333-8333-333333333333',email:'pending@example.invalid',display_name:'Nuevo',role:'employee',active:false,commission:0}
  ];
  const services=CATALOG.map(s=>({id:s.id,name:s.name,cost:s.cost,price:s.price,exclusive_group:s.exclusive||null}));
  const orders=[],requests=[];let loseResponse=true,hasAdmin=true;
  const session=p=>{const expires_at=Math.floor(Date.now()/1000)+3600;return {access_token:[{alg:'HS256',typ:'JWT'},{sub:p.id,role:'authenticated',aud:'authenticated',exp:expires_at},'fixture'].map((v,i)=>i<2?Buffer.from(JSON.stringify(v)).toString('base64url'):v).join('.'),token_type:'bearer',expires_in:3600,expires_at,refresh_token:'fixture-'+p.id,user:{id:p.id,email:p.email,aud:'authenticated',role:'authenticated',app_metadata:{provider:'email'},user_metadata:{display_name:p.display_name},created_at:new Date().toISOString()}};};
  const browser=await chromium.launch({executablePath:process.env.EDGE_PATH||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
  const context=await browser.newContext({viewport:{width:1440,height:1100},locale:'es-MX'});
  await context.route('**/*',async route=>{
    const req=route.request(),url=new URL(req.url());
    if(url.origin==='http://127.0.0.1:8092'){
      const file=path.resolve(root,'.'+(url.pathname==='/'?'/index.html':decodeURIComponent(url.pathname)));
      if(!file.startsWith(root+path.sep)||!fs.existsSync(file))return route.fulfill({status:404,body:'Not found'});
      const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp','.woff2':'font/woff2','.ttf':'font/ttf'};
      return route.fulfill({status:200,body:fs.readFileSync(file),contentType:types[path.extname(file)]||'application/octet-stream'});
    }
    if(url.hostname!=='ehckobsmodqjpfmnnver.supabase.co')return route.abort();
    const headers={'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'GET,POST,OPTIONS','content-type':'application/json'};
    const send=(body,status=200)=>route.fulfill({status,headers,body:JSON.stringify(body)});
    if(req.method()==='OPTIONS')return route.fulfill({status:204,headers});
    const args=req.postDataJSON()||{},token=req.headers().authorization?.split(' ')[1];let profile;
    try{profile=profiles.find(p=>p.id===JSON.parse(Buffer.from(token.split('.')[1],'base64url')).sub);}catch{}
    if(url.pathname==='/auth/v1/token'){const p=profiles.find(p=>p.email===args.email||args.refresh_token==='fixture-'+p.id);return p?send(session(p)):send({message:'Invalid login credentials'},400);}
    if(url.pathname==='/auth/v1/logout')return send({});
    if(url.pathname==='/auth/v1/user')return send(profile?session(profile).user:{},profile?200:401);
    if(url.pathname==='/auth/v1/signup')return send({user:{id:profiles[2].id,email:args.email},session:null});
    if(!profile)return send({message:'No auth'},401);
    const rpc=url.pathname.split('/rpc/')[1];
    if(rpc==='bennys_ensure_profile')return send(profile);
    if(rpc==='bennys_has_admin')return send(hasAdmin);
    if(rpc==='bennys_claim_admin'){if(args.p_code!=='fixture-initial-admin-code')return send({message:'Código inicial no válido.'},400);profile.active=true;profile.role='admin';hasAdmin=true;return send(profile);}
    if(rpc==='bennys_update_service'){assert.equal(profile.role,'admin');const s=services.find(s=>s.id===args.p_id);s.cost=args.p_cost;s.price=args.p_price;return send(s);}
    if(rpc==='bennys_manage_employee'){assert.equal(profile.role,'admin');const p=profiles.find(p=>p.id===args.p_id);Object.assign(p,{display_name:args.p_name,role:args.p_role,active:args.p_active,commission:args.p_commission});return send(p);}
    if(rpc==='bennys_create_order'){
      requests.push(args);assert.equal(profile.active,true);
      let row=orders.find(o=>o.id===args.p_id);if(row)return send(row);
      const items=args.p_items.map(i=>({...services.find(s=>s.id===i.id),qty:i.qty})),commission=profile.role==='admin'?args.p_commission:profile.commission;
      row={id:args.p_id,employee_id:profile.id,status:'active',created_at:new Date().toISOString(),payload:{id:args.p_id,folio:'#BNY-'+String(orders.length+1).padStart(3,'0'),date:new Date().toISOString(),client:args.p_client,playerId:args.p_player_id,mechanic:profile.display_name,employeeId:profile.id,payment:args.p_payment,notes:args.p_notes,items,discount:args.p_discount,commission,totals:calculate(items,args.p_discount,commission),status:'active'}};orders.push(row);
      if(loseResponse){loseResponse=false;return send({message:'Failed to fetch: simulated response lost after commit'},400);}return send(row);
    }
    if(rpc==='bennys_cancel_order'){const row=orders.find(o=>o.id===args.p_id);row.status=row.payload.status='cancelled';return send(row);}
    if(url.pathname.endsWith('/bennys_services'))return send(profile.active?services:[]);
    if(url.pathname.endsWith('/bennys_profiles'))return send(profile.role==='admin'?profiles:[profile]);
    if(url.pathname.endsWith('/bennys_orders'))return send(profile.active?orders.filter(o=>profile.role==='admin'||o.employee_id===profile.id):[]);
    return send({message:'Unmocked endpoint '+url.pathname},404);
  });
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  const click=selector=>page.locator(selector).click();
  async function signIn(email){await click('#account-button');await page.locator('[name=email]').fill(email);await page.locator('[name=password]').fill('fixture-password');await click('[form="auth-form"]');await page.locator('#account-label').filter({hasText:profiles.find(p=>p.email===email).display_name}).waitFor();await page.waitForFunction(()=>document.querySelector('#cloud-status-text').textContent.includes('Sincronizado')||document.querySelector('#pending-account'));}
  async function signOut(){await click('#account-button');await click('#account-signout');await page.waitForFunction(()=>document.querySelector('#account-label').textContent==='Acceder');}
  await page.goto('http://127.0.0.1:8092');await page.locator('.service-card').last().waitFor();await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('.service-card').count(),18);assert.equal(await page.locator('#vehicle,#plate,#player-id,[name=playerId],.rp-badge').count(),0);pass('18 tarifas; sin vehículo, matrícula ni etiqueta de la captura');
  await click('#presets-button');await click('[data-preset="reference"]');
  assert.equal(money(await page.locator('#total').innerText()),88500);assert.equal(money(await page.locator('#cost').innerText()),60000);
  await page.locator('#discount').fill('10');await page.locator('#commission').fill('20');await page.locator('#client').fill('Cliente de prueba');await page.reload();await page.locator('[data-remove="v8"]').waitFor();
  assert.equal(await page.locator('#client').inputValue(),'Cliente de prueba');assert.equal(money(await page.locator('#profit').innerText()),15720);pass('Cálculos y borrador persistente');
  await click('#checkout');assert.equal(await page.locator('#auth-form').count(),1);await click('.modal-head [data-close]');await signIn('admin@example.invalid');
  assert.equal(await page.locator('#team-nav').isVisible(),true);assert.equal(await page.locator('#commission').getAttribute('readonly'),null);pass('Acceso con SDK oficial y rol administrador');
  await click('#checkout');await click('[form="checkout-form"]');await page.locator('#checkout-message').filter({hasText:'No se pudo conectar'}).waitFor();await click('[form="checkout-form"]');await page.locator('.receipt-text').waitFor();
  assert.equal(await page.locator('[name=playerId]').count(),0);assert.equal(requests[0].p_player_id,'');assert.equal(orders.length,1);assert.equal(requests[0].p_id,requests[1].p_id);assert.equal(orders[0].payload.totals.total,79650);assert.equal('p_vehicle' in requests[0],false);assert.equal('p_plate' in requests[0],false);assert.match(await page.locator('.receipt-text').innerText(),/#BNY-001/);pass('Registro remoto y reintento sin cobro duplicado');
  await click('.modal-head [data-close]');await click('[data-view="clients"]');assert.equal(await page.locator('#clients-list [data-client]').count(),1);assert.match(await page.locator('#clients-list').innerText(),/Cliente de prueba/);await click('#clients-list [data-client]');assert.equal(await page.locator('#client').inputValue(),'Cliente de prueba');await page.reload();await page.locator('#frequent-client-picker [data-client]').waitFor();assert.equal(await page.locator('#client').inputValue(),'Cliente de prueba');pass('Clientes frecuentes persisten y se reutilizan por nombre');
  await click('[data-view="team"]');await click('[data-employee="33333333-3333-4333-8333-333333333333"]');await page.locator('[name=active]').selectOption('true');await page.locator('[name=commission]').fill('25');await click('[form="employee-form"]');await page.waitForFunction(()=>!document.querySelector('#modal').open);assert.equal(profiles[2].active,true);assert.equal(profiles[2].commission,25);pass('Activación de empleados y comisión asignada');
  await click('[data-view="catalog"]');await page.locator('#price-kit').fill('5500');await page.locator('#price-kit').blur();await page.waitForFunction(()=>document.querySelector('#toast').textContent.includes('Tarifa guardada'));assert.equal(services.find(s=>s.id==='kit').price,5500);pass('Tarifas compartidas editables por administrador');
  await signOut();await signIn('employee@example.invalid');await click('[data-view="clients"]');assert.equal(await page.locator('#clients-list [data-client]').count(),0);await click('[data-view="orders"]');assert.equal(await page.locator('[data-detail]').count(),0);assert.equal(await page.locator('#team-nav').isVisible(),false);await click('[data-view="catalog"]');assert.equal(await page.locator('#price-kit').inputValue(),'5500');assert.equal(await page.locator('#price-kit').getAttribute('readonly'),'');assert.equal(await page.locator('#restore-prices').isDisabled(),true);pass('Empleado: historial propio y tarifas de solo lectura');
  await click('[data-view="calculator"]');assert.equal(await page.locator('#commission').getAttribute('readonly'),'');await click('#new-order');if(await page.locator('#confirm-action').count())await click('#confirm-action');await click('[data-add="reparacion"]');await page.locator('#client').fill('Otro cliente');await click('#checkout');await click('[form="checkout-form"]');await page.locator('.receipt-text').waitFor();assert.equal(orders.length,2);assert.equal(orders[1].payload.totals.commission,100);await click('.modal-head [data-close]');await click('[data-view="orders"]');assert.equal(await page.locator('[data-detail]').count(),1);pass('Ventas del empleado con su comisión');await click('[data-view="clients"]');assert.equal(await page.locator('#clients-list [data-client]').count(),1);assert.match(await page.locator('#clients-list').innerText(),/Otro cliente/);assert.doesNotMatch(await page.locator('#clients-list').innerText(),/Cliente de prueba/);await page.locator('#client-search').fill('NADIE');assert.equal(await page.locator('#clients-list [data-client]').count(),0);await page.locator('#client-search').fill('OTRO');await click('#clients-list [data-client]');assert.equal(await page.locator('#client').inputValue(),'Otro cliente');await click('[data-view="orders"]');pass('Clientes respetan permisos y permiten buscar por nombre');
  await click('[data-detail]');await click('#cancel-order');await click('#confirm-action');await page.waitForFunction(()=>!document.querySelector('#modal').open);assert.equal(orders[1].status,'cancelled');await click('[data-view="summary"]');assert.match(await page.locator('#summary-content').innerText(),/Órdenes cobradas\s*0/);pass('Anulación conservada y excluida del resumen');await click('[data-view="clients"]');await page.locator('#client-search').fill('');assert.equal(await page.locator('#clients-list [data-client]').count(),0);pass('Anular una orden actualiza la lista de clientes');
  await signOut();await signIn('admin@example.invalid');await click('[data-view="orders"]');assert.equal(await page.locator('[data-detail]').count(),2);const csvDownload=page.waitForEvent('download');await click('#export-orders');const csv=await csvDownload;const csvText=fs.readFileSync(await csv.path(),'utf8');assert.doesNotMatch(csvText,/"ID"/);await click('[data-view="clients"]');await page.locator('#client-search').fill('');assert.equal(await page.locator('#clients-list [data-client]').count(),1);await signOut();
  profiles[2].active=false;hasAdmin=false;await signIn('pending@example.invalid');await page.locator('#claim-form').waitFor();await page.locator('[name=code]').fill('incorrect-code');await click('[form="claim-form"]');await page.locator('#claim-message').filter({hasText:'Código inicial no válido'}).waitFor();await page.locator('[name=code]').fill('fixture-initial-admin-code');await click('[form="claim-form"]');await page.waitForFunction(()=>!document.querySelector('#modal').open);assert.equal(profiles[2].role,'admin');pass('Activación inicial protegida por código');
  await click('[data-view="calculator"]');await click('#new-order');if(await page.locator('#confirm-action').count())await click('#confirm-action');
  for(const width of [1920,1440,1024,768,760,390,360]){await page.setViewportSize({width,height:width<760?844:1100});await page.evaluate(()=>window.scrollTo(0,0));assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'Overflow '+width);if([1440,390].includes(width))await page.screenshot({path:path.join(preview,'v3-calculadora-'+width+'.png'),fullPage:true,animations:'disabled'});}
  pass('Diseño sin desbordamientos de 360 a 1920 px');await click('[data-view="clients"]');await page.evaluate(()=>document.querySelector('#toast').classList.remove('visible'));await page.screenshot({path:path.join(preview,'v3-clientes-movil.png'),fullPage:true,animations:'disabled'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.setViewportSize({width:1440,height:1100});await page.screenshot({path:path.join(preview,'v3-clientes-escritorio.png'),fullPage:true,animations:'disabled'});
  assert.deepEqual(errors,[]);pass('Sin errores JavaScript');fs.writeFileSync(path.join(__dirname,'browser-results.json'),JSON.stringify({checks,errors},null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
