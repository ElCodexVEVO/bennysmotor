import {CLOUD_CONFIG} from './config.js';

export class BennysCloud {
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
