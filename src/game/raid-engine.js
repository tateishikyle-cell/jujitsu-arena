import {roster,char,fresh,actions,chooseAI,battleInternals} from './engine.js';
import {attachVow,vowPrice,vowDuration,vowAttackBonus} from './vows.js';
import {caseFor} from './court-cases.js';
import {bossById} from './bosses.js';
const {utility,prepareMove,focusedAttack,attackTier,domainKind,domainAttack,hasAdapted,copyTarget,copiedMove,domainPrice,blockedBy,resolveCourt,recordMove,awakenStudent,mustUsePurple,forcedPurple,advancePurple,forcedBlackFlash,spendBlackFlash,absorbCompanions,lethalDomain,domainTechniqueHit,domainTechniqueSetup,summonCompanion}=battleInternals;
const wait=()=>utility('wait','待機',0,'wait');
export const raidAlive=s=>s.p.map((p,i)=>p.hp>0?i:-1).filter(i=>i>=0);
export const raidResult=s=>s.p[0].hp<=0?(s.p.slice(1).every(p=>p.hp<=0)?'draw':'team'):s.p.slice(1).every(p=>p.hp<=0)?'boss':null;
export function startRaid(bossId,team){
 const boss=bossById(bossId);if(!boss||team.length!==3||new Set(team.map(p=>p.id)).size!==3||team.some(p=>!char(p.id)))throw Error('ボスと、異なる3キャラを選んでください');
 const b={...fresh(bossId),hp:boss.hp,maxHp:boss.hp,bossForm:bossId};
 return {p:[b,...team.map(p=>attachVow(fresh(p.id),p.vow||'none'))],turn:1,court:null,clashes:[],bossTarget:1};
}
export function startFreeForAll(players){
 return {p:players.map(p=>attachVow(fresh(p.id),p.vow||'none')),freeForAll:true,turn:1,court:null,clashes:[]};
}
export function raidPair(s,i,target=1){const j=s.freeForAll||i===0?target:0;return {p:[s.p[i],s.p[j]],turn:s.turn,clash:s.clashes.some(pair=>pair.includes(i)&&pair.includes(j)),court:s.court?{judge:s.court.judge===i?0:1,defendant:s.court.defendant===i?0:1}:null};}
export function raidActions(s,i,target=1){
 if(s.p[i].hp<=0)return [wait()];
 if(s.court){if(i!==s.court.defendant)return [utility('courtWait','判決を待つ',0,'wait')];return actions(raidPair(s,i,s.court.judge),0);}
 return actions(raidPair(s,i,target),0);
}
export const freeForAllTargets=(s,i)=>raidAlive(s).filter(j=>j!==i);
const enemies=(s,i)=>s.freeForAll?freeForAllTargets(s,i):i===0?raidAlive(s).filter(j=>j>0):[0];
function wideAttack(a){
 return attackTier(a)>=4&&!['transfigure','black'].includes(a.id)&&!a.blackFlash;
}
function freeForAllClashes(state,live,moves,canceled,opened,active,rank,ps,broken,priorityLost,clashWon,log){
 const contenders=live.filter(active);
 if(contenders.length<2)return [];
 const previous=contenders.filter(i=>state.clashes.some(pair=>pair.includes(i)));
 if(!opened.some(Boolean)&&previous.length<2)return [];
 const highest=Math.max(...contenders.map(rank));
 const leaders=contenders.filter(i=>rank(i)===highest);
 for(const i of contenders.filter(i=>rank(i)<highest)){
  ps[i].domain=0;
  broken[i]=priorityLost[i]=true;
  if(domainKind(ps[i])==='hakari')ps[i].inv=0;
 }
 const attackers=leaders.filter(i=>previous.includes(i)&&moves[i].type==='attack'&&!canceled[i]);
 if(leaders.length===1||attackers.length===1){
  const winner=attackers[0]??leaders[0];
  for(const i of leaders.filter(i=>i!==winner)){ps[i].domain=0;broken[i]=true;}
  ps[winner].domain=vowDuration(ps[winner]);
  clashWon[winner]=true;
  log.push(`${char(ps[winner].id).name}の領域が押し勝った。`);
  return [];
 }
 if(attackers.length>1){
  for(const i of leaders){ps[i].domain=0;broken[i]=true;}
  log.push('押し合い中の同時攻撃で領域が崩壊した。');
  return [];
 }
 return leaders.flatMap((i,n)=>leaders.slice(n+1).map(j=>[i,j]));
}
function rawMove(s,i,a,target){const view=raidPair(s,i,target),p=s.p[i];let move={...a};
 if(p.stun)move=wait();else if(p.vow==='reveal'&&!p.vowUsed)move=utility('vowReveal','術式を開示する',0,'vowReveal');else if(p.focus&&!p.confiscated&&!(p.vow==='lastStrike'&&p.vowUsed))move=focusedAttack(p);else if(mustUsePurple(p))move=forcedPurple();else move=forcedBlackFlash(p)||move;
 if(p.confiscated&&a.type!=='reverse'&&raidActions(s,i,target).find(m=>m.id===move.id)?.disabled)return wait();
 const priced=vowPrice(p,move,move.type==='copy'?copyTarget(view.p[1])?.type:null);if(priced.disabled)return wait();
 move={...domainPrice(view,0,copiedMove(view,0,priced)),c:priced.c};
 return prepareMove(move,p);
}
export function resolveRaid(state,selected,target=1,rng=Math.random){
 if(state.freeForAll?raidAlive(state).length<2:raidResult(state))throw Error('終了した対戦です');
 const live=raidAlive(state);
 if(!state.freeForAll&&(!live.includes(target)||target===0))target=live.find(i=>i>0);
 if(state.freeForAll&&!state.court&&(!Array.isArray(target)||live.some(i=>!freeForAllTargets(state,i).includes(target[i]))))throw Error('生存している相手を選んでください');
 const targetFor=i=>state.freeForAll?(state.court?state.court.judge:target[i]):target;
 if(!Array.isArray(selected)||selected.length!==state.p.length)throw Error('全員の行動が必要です');
 selected=selected.map((a,i)=>{if(!live.includes(i))return wait();const legal=raidActions(state,i,targetFor(i)).find(m=>!m.disabled&&m.id===a?.id&&m.c===a?.c);if(!legal)throw Error('使用できない行動です');return legal;});
 if(state.court){const {judge,defendant}=state.court,pair={p:[state.p[judge],state.p[defendant]],turn:state.turn,clash:false,court:{judge:0,defendant:1}},r=resolveCourt(pair,selected[judge],selected[defendant],rng),s=structuredClone(state);s.p[judge]=r.s.p[0];s.p[defendant]=r.s.p[1];s.court=null;return {s,log:r.log,moves:selected,trial:true,target};}
 const s=structuredClone(state),old=state.p,ps=s.p,log=[],moves=selected.map((a,i)=>old[i].hp>0?rawMove(state,i,a,targetFor(i)):wait());
 const flags=()=>ps.map(()=>false),numbers=()=>ps.map(()=>0);
 const canceled=flags(),broken=flags(),priorityLost=flags(),clashWon=flags(),damage=numbers(),fatal=flags(),execution=flags(),gains=numbers();
 const attackTargets=i=>state.freeForAll?(wideAttack(moves[i])?enemies(state,i):[targetFor(i)]):i===0?(moves[0].id==='fire'?[...live.filter(j=>j>0)]:[target]):[0];
 const isAttacking=(i,j)=>moves[i].type==='attack'&&attackTargets(i).includes(j);
 const opposingMove=(i,j)=>moves[j].type==='attack'&&!isAttacking(j,i)?wait():canceled[j]?wait():moves[j];
 // Every actor's action is locked against the same starting state. Incapacitation is simultaneous.
 for(const i of live){const a=moves[i];if(a.cancel)for(const j of attackTargets(i))if(!moves[j].execution&&!old[i].stun&&!blockedBy(a,opposingMove(i,j),old[j]))canceled[j]=true;}
 for(const i of live){const p=ps[i],a=moves[i];if(p.vow)p.vowLock=Math.max(0,(p.vowLock||0)-1);p.confiscated=Math.max(0,p.confiscated-1);p.stun=Math.max(0,p.stun-1);if(!state.clashes.some(pair=>pair.includes(i)))p.domain=Math.max(0,p.domain-1);p.inv=Math.max(0,p.inv-1);p.focus=old[i].stun||old[i].confiscated?old[i].focus:0;if(p.rika){p.rika--;if(!p.rika)p.cool=5;}else p.cool=Math.max(0,p.cool-1);p.e=Math.max(0,p.e-a.c);
  if(canceled[i]){log.push(`${char(p.id).name}の行動は呪言で無効。`);continue;}
  if(p.vow==='copyLimit'&&selected[i].type==='copy')p.vowUsed=true;if(p.vow==='world'&&a.id==='world')p.vowCount++;if(p.vow==='lastStrike'&&a.type==='attack')p.vowUsed=true;if(p.vow==='swaps'&&a.id==='boogie')p.vowLock=1;if(p.vow==='stationary'&&a.type==='simple')p.vowLock=1;if(p.vow==='arm'&&a.type==='reverse')p.vowArm=false;
  switch(a.type){case'vowReveal':p.vowUsed=true;break;case'charge':gains[i]=old[i].rika&&!old[i].confiscated?2:1;p.e+=gains[i];if(old[i].seed&&!hasAdapted(old[i],{type:'attack',n:'呪いの種子'}))damage[i]+=2;break;case'summon':summonCompanion(p,'mahoragaHp',log);break;case'summonAgito':summonCompanion(p,'agitoHp',log);break;case'honored':p.honored=true;break;case'rika':p.rika=5;break;case'focus':p.focus=1;break;case'stance':p.stance=true;p.moonBonus=2;break;case'soul':p.soul++;break;case'heal':p.hp=Math.min(p.maxHp||10,p.hp+3);break;case'amplify':p.amp=true;p.domain=0;break;case'buff':p.buff=1;break;case'release':p.released=true;break;case'takada':p.takada=true;break;case'domain':p.domain=vowDuration(p);p.domainKind=a.sourceId||p.id;p.domainTechnique=a.domainTechnique||null;if(domainKind(p)==='hakari'){const hit=rng()>=5/6;if(hit)p.inv=3;log.push(`秤の領域：${hit?'大当たり！':'外れ。'}`);}break;}
 }
 const opened=moves.map((a,i)=>live.includes(i)&&a.type==='domain'&&!canceled[i]),rank=i=>domainKind(ps[i])==='higuruma'?2:domainKind(ps[i])==='megumi'?0:1;
 // Resolve all simultaneous domain opponents as a group; team order cannot decide the winner.
 const active=i=>!broken[i]&&!old[i].confiscated&&!ps[i].amp&&(ps[i].domain>0||old[i].domain>0);
 const contenders=live.filter(i=>i>0&&active(i)&&active(0)&&(opened[0]||opened[i]||state.clashes.some(pair=>pair.includes(i))));
 const superior=contenders.filter(i=>rank(i)>rank(0));
 let clashes=[];
 if(state.freeForAll){
  clashes=freeForAllClashes(state,live,moves,canceled,opened,active,rank,ps,broken,priorityLost,clashWon,log);
 }else if(superior.length){
  ps[0].domain=0;broken[0]=priorityLost[0]=true;
  for(const i of superior){ps[i].domain=vowDuration(ps[i]);clashWon[i]=true;}
  log.push('日車の領域が他の領域に先に押し勝った。');
 }else{
  for(const i of contenders.filter(i=>rank(i)<rank(0))){ps[i].domain=0;broken[i]=priorityLost[i]=true;if(domainKind(ps[i])==='hakari')ps[i].inv=0;ps[0].domain=vowDuration(ps[0]);clashWon[0]=true;log.push(`${char(ps[i].id).name}の領域はボスの領域に押し負けた。`);}
  const equal=contenders.filter(i=>rank(i)===rank(0)&&((opened[0]&&opened[i])||state.clashes.some(pair=>pair.includes(i))));
  const existing=equal.filter(i=>state.clashes.some(pair=>pair.includes(i)));
  const bossAttacks=existing.length>0&&moves[0].type==='attack'&&!canceled[0];
  const teamAttacks=existing.some(i=>moves[i].type==='attack'&&!canceled[i]);
  if(bossAttacks&&teamAttacks){for(const i of [0,...equal]){ps[i].domain=0;broken[i]=true;}log.push('押し合い中の両陣営が同時攻撃。競合する全ての領域が崩壊。');}
  else if(bossAttacks){for(const i of equal){ps[i].domain=0;broken[i]=true;}ps[0].domain=vowDuration(ps[0]);clashWon[0]=true;}
  else if(teamAttacks){ps[0].domain=0;broken[0]=true;for(const i of equal){ps[i].domain=vowDuration(ps[i]);clashWon[i]=true;}}
  else clashes=equal.map(i=>[0,i]);
 }
 // A previous clash also ends when an owner gives up its domain to amplification.
 for(const pair of state.freeForAll?[]:state.clashes){const j=pair.find(i=>i!==0);if(broken[0]||broken[j]||clashWon[0]||clashWon[j]||clashes.some(p=>p.includes(j)))continue;
  const a=ps[0].domain>0&&!ps[0].amp&&!old[0].confiscated,b=ps[j].domain>0&&!ps[j].amp&&!old[j].confiscated;
  if(a!==b){const w=a?0:j,l=a?j:0;ps[w].domain=vowDuration(ps[w]);clashWon[w]=true;ps[l].domain=0;broken[l]=true;}
 }
 s.clashes=clashes.filter(pair=>pair.every(i=>ps[i].domain>0));

 const judge=live.find(i=>(state.freeForAll||i>0)&&domainKind(ps[i])==='higuruma'&&ps[i].domain>0&&!broken[i]&&!canceled[i]&&(opened[i]||clashWon[i]));
 if(judge!==undefined&&!moves.some(a=>a.execution)){const defendant=state.freeForAll?targetFor(judge):0;s.court={judge,defendant};s.clashes=[];ps.forEach((p,i)=>p.domain=i===judge?1:0);log.push(`誅伏賜死：${caseFor(ps[defendant].id).charge}。全員の攻撃を停止して裁判へ。`);for(const i of live)recordMove(ps[i],moves[i],canceled[i]);s.turn++;return {s,log,moves,target};}
 const erasedBySimple=flags();
 // A domain is shared on the battlefield: erasing it protects the whole team.
 for(const i of live){if(canceled[i])continue;const a=moves[i];for(const j of enemies(state,i)){
  if(!state.freeForAll&&a.type==='simple'&&!erasedBySimple[j]&&(old[j].domain>0||ps[j].domain>0)){
   erasedBySimple[j]=true;
   ps[j].domain=0;broken[j]=true;clashWon[j]=false;
   if(opened[j])ps[j].inv=Math.max(0,old[j].inv-1);
   log.push('簡易領域が相手の領域を消滅させた！');
  }
  if(!state.clashes.some(pair=>pair.includes(i)&&pair.includes(j))&&a.type==='attack'&&attackTargets(i).includes(j)&&!hasAdapted(old[j],a)&&(attackTier(a)>=4||a.breaks)&&(old[j].domain||ps[j].domain)){ps[j].domain=0;broken[j]=true;if(old[j].domain&&domainKind(ps[j])==='gojo'&&!hasAdapted(old[i],domainAttack(ps[j])))ps[i].stun=Math.max(ps[i].stun,3);}
  if(['basket','falling'].includes(a.type)&&(old[j].domain||ps[j].domain)){ps[j].domain=0;broken[j]=true;clashWon[j]=false;if(domainKind(ps[j])==='hakari')ps[j].inv=0;}
  if(old[j].vow==='open'&&a.type==='dodge'&&(old[j].domain||ps[j].domain)){ps[j].domain=0;broken[j]=priorityLost[j]=true;}
 }}
 s.clashes=s.clashes.filter(pair=>pair.every(i=>ps[i].domain>0));
 const automaticTechniques=ps.map((p,i)=>domainTechniqueSetup(p,
 live.includes(i)&&!broken[i]&&!old[i].confiscated&&!s.clashes.some(pair=>pair.includes(i))&&!p.amp&&
 ((opened[i]&&p.domain>0)||clashWon[i]||(!state.clashes.some(pair=>pair.includes(i))&&old[i].domain>0)),log));
 const domainHits=flags();
 const direct=ps.map(()=>ps.map(()=>0));
 for(const i of live){if(canceled[i])continue;const p=ps[i],a=moves[i];let base=a.d||0;
  if(a.id==='punch'&&p.id==='yuji'){p.punch++;if(p.punch===4)base=99;}
  if(a.id==='ratio'){p.punch++;if(p.punch%5===0)base=5;}
  if(a.type==='attack'&&base>0&&base<99)base=Math.max(0,base+vowAttackBonus({turn:state.turn},old[i],a));
  advancePurple(p,a,log);spendBlackFlash(p,a);
  if(a.stance)p.stance=true;if(a.type==='attack'&&old[i].moonBonus){if(base>0)base+=old[i].moonBonus;p.moonBonus=0;}
  for(const j of enemies(state,i)){
   const o=ps[j],b=opposingMove(i,j),inClash=s.clashes.some(pair=>pair.includes(i));let d=base;
   const domainActive=!old[i].confiscated&&!inClash&&!broken[i]&&!p.amp&&!hasAdapted(old[j],domainAttack(p))&&(clashWon[i]||(!state.clashes.some(pair=>pair.includes(i))&&old[i].domain>0));
   const domainBlocked=['simple','basket','falling'].includes(b.type)||(old[j].inv>0&&!old[j].confiscated);
   if(domainActive&&domainKind(p)==='jogo'&&!domainBlocked){damage[j]+=4;domainHits[j]=true;}
   if(a.type!=='attack'||!attackTargets(i).includes(j))continue;
   if(a.boundary&&!['sukuna','meguna','geto','ryu','uro','kashimo','reggie'].includes(old[j].id))continue;
   if(a.execution){execution[j]=true;continue;}
   if(a.onCharge&&b.type!=='charge')d=0;
   let blocked=blockedBy(a,b,old[j])||(automaticTechniques[j]&&blockedBy(a,automaticTechniques[j],old[j]));
   if(domainActive&&!['hakari','megumi','jogo','yuta'].includes(domainKind(p))&&!lethalDomain(domainKind(p))&&d>0&&a.id!=='die'){if(domainBlocked)blocked=true;else{d=99;blocked=false;domainHits[j]=true;}}
   if(hasAdapted(old[j],a))blocked=true;
   if(blocked){log.push(`${char(o.id).name}が${a.n}を防いだ。`);continue;}
   if(d>0){d+=p.id==='blood'&&a.id!=='basicPunch'?1:(a.bloodBonus||0);d+=(old[i].confiscated?0:p.buff)+(p.amp?1:0)+(!old[i].confiscated&&p.honored?3:0)+(p.id==='nanami'&&state.turn>10?1:0);d=Math.max(0,d-(o.amp?1:0));if((old[j].stance||b.type==='stance')&&attackTier(a)<=2&&!(domainActive&&!['hakari','megumi','yuta'].includes(domainKind(p))))d=0;direct[i][j]=d;}
   if(a.stun)o.stun=Math.max(o.stun,a.stun);if(a.drain)o.e=Math.max(0,o.e-a.drain);if(a.seed)o.seed=true;
  }
 }
 for(const i of live)for(const j of enemies(state,i))if(i<j&&(moves[i].sweep||moves[j].sweep)&&isAttacking(i,j)&&isAttacking(j,i)&&!canceled[i]&&!canceled[j]){const balance=direct[i][j]-direct[j][i];direct[i][j]=Math.max(0,balance);direct[j][i]=Math.max(0,-balance);}
 for(const j of live)damage[j]+=direct.reduce((sum,row)=>sum+row[j],0);
 for(const i of live){for(const j of enemies(state,i)){
  const b=opposingMove(i,j),opening=opened[i]&&!broken[i]&&ps[i].domain>0,activating=opening||clashWon[i],kind=domainKind(activating?ps[i]:old[i]),wasClash=state.clashes.some(pair=>pair.includes(i));
  const active=(!wasClash&&old[i].domain>0)||clashWon[i]||(opening&&kind!=='mahito');
  if(kind==='yuta'&&active&&!broken[i]&&!old[i].confiscated&&!s.clashes.some(pair=>pair.includes(i))&&!ps[i].amp){
   const hit=domainTechniqueHit(ps[i],ps[j],old[j],b,log);
   damage[j]+=hit;
   if(hit)domainHits[j]=true;
  }
  if(!priorityLost[i]&&!erasedBySimple[i]&&!(kind==='mahito'&&broken[i])&&!old[i].confiscated&&!s.clashes.some(pair=>pair.includes(i))&&active&&!hasAdapted(old[j],domainAttack(activating?ps[i]:old[i]))&&lethalDomain(kind)&&!ps[i].amp&&!['simple','basket','falling'].includes(b.type)){
   if(activating&&kind!=='mahito')damage[j]+=10;fatal[j]=true;
  }
 }}
 for(const i of live){const p=ps[i],a=moves[i];
  if(a.type==='adapt'&&!canceled[i]||automaticTechniques[i]?.type==='adapt'){damage[i]=0;fatal[i]=false;}
  if(damage[i]>0&&!fatal[i]&&!execution[i]){let reduction=0;if(old[i].vow==='hardbody')reduction=1;if(old[i].vow==='compression')reduction=a.type==='attack'&&!canceled[i]?2:-1;if(old[i].vow==='arm'&&!old[i].vowUsed){reduction=5;p.vowUsed=p.vowArm=true;}damage[i]=Math.max(0,damage[i]-reduction);}
  damage[i]=absorbCompanions(p,damage[i],fatal[i],old[i].confiscated,log);
  if(!old[i].bossForm&&gains[i]&&(damage[i]>0||fatal[i]))p.e=Math.max(0,p.e-gains[i]);
  const net=p.hp-damage[i]+(a.type==='reverse'&&!canceled[i]?(a.healAmount??a.c*2):0);p.hp=fatal[i]||execution[i]?0:Math.max(0,Math.min(p.maxHp||10,net));
  if(old[i].vow==='trueLove'&&a.id==='love'&&!canceled[i])p.hp=0;
  if(a.type==='adapt'&&!canceled[i]||automaticTechniques[i]?.type==='adapt')for(const j of enemies(state,i)){const incoming=moves[j];if(!canceled[j]&&((incoming.type==='attack'&&isAttacking(j,i))||incoming.type==='domain')){const key=incoming.type==='domain'?`domain:${domainKind({id:incoming.sourceId})}:${incoming.baseName||incoming.n}`:`${incoming.type}:${incoming.baseName||incoming.n}`;if(!p.adapted.some(x=>x.key===key))p.adapted.push({key,name:incoming.baseName||incoming.n});}}
  awakenStudent(p,fatal[i]||domainHits[i],log);
  recordMove(p,a,canceled[i]);
  if(fatal[i]||execution[i])log.push(`${char(p.id).name}に${execution[i]?'処刑人の剣':'領域の即死効果'}が命中。`);else if(damage[i])log.push(`${char(p.id).name}に${damage[i]}ダメージ。`);
 }
 for(const p of ps)if(p.hp<=0)p.domain=0;
 s.clashes=s.clashes.filter(pair=>pair.every(i=>ps[i].hp>0&&ps[i].domain>0));
 s.turn++;if(!state.freeForAll)s.bossTarget=target;return {s,log,moves:state.freeForAll?moves.map((a,i)=>a.type==='attack'?{...a,targets:attackTargets(i)}:a):moves,damage,target};
}
// All policies receive only the public turn-start state. The human's pending selections never enter this worker.
export function planRaid(s,control,rng=Math.random){
 const live=raidAlive(s),plans=Array(4).fill(null);
 if(s.court){const defendant=s.court.defendant;if((control==='team'&&defendant===0)||(control==='boss'&&defendant!==0)){const view=raidPair(s,defendant,s.court.judge),mirrored={...view,p:[view.p[1],view.p[0]],court:{judge:0,defendant:1}};plans[defendant]=chooseAI(mirrored,[],rng).move;}return {moves:plans,target:live.find(i=>i>0),reason:'裁判の返答を判断。'};}
 if(control==='boss'){
  for(const i of live.filter(j=>j>0)){const view=raidPair(s,i),mirrored={...view,p:[view.p[1],view.p[0]]};plans[i]=chooseAI(mirrored,[],rng).move;}
  return {moves:plans,target:live.find(i=>i>0),reason:'3人がターン開始時の状態から独立に判断。'};
 }
 const choices=[];
 for(const target of live.filter(i=>i>0)){
  const legal=raidActions(s,0,target).filter(a=>!a.disabled),responses=raidActions(s,target).filter(a=>!a.disabled);
  for(const move of legal){let score=0;
   for(const response of responses){const ms=s.p.map((p,i)=>i===0?move:i===target?response:raidActions(s,i).find(a=>!a.disabled));const r=resolveRaid(s,ms,target,()=>.4).s;
    const boss=r.p[0],team=r.p.slice(1),before=s.p.slice(1);score+=((boss.hp-s.p[0].hp)*2.5+team.reduce((n,p,j)=>n+(before[j].hp-p.hp)*3+(p.hp<=0&&before[j].hp>0?25:0),0)+(boss.e-s.p[0].e)*3+boss.domain*7-boss.stun*9-(boss.hp<=0?150:0))/responses.length;
   }
   // Policy penalty, not a legality restriction: the human can always use free Infinity.
   if(move.type==='infinity')score-=s.p[0].lastMove?.type==='infinity'?24:3;
   if(move.type==='reverse'&&s.p[0].hp===(s.p[0].maxHp||10))score-=8;
   choices.push({move,target,score});
  }
 }
 choices.sort((a,b)=>b.score-a.score);const top=choices.slice(0,3),weights=top.map(c=>Math.exp((c.score-top[0].score)/4)),sum=weights.reduce((a,b)=>a+b,0);let pick=rng()*sum,chosen=top[0];for(let i=0;i<top.length;i++){pick-=weights[i];if(pick<=0){chosen=top[i];break;}}
 plans[0]=chosen.move;return {moves:plans,target:chosen.target,reason:'ボスが3人のHP・呪力・全体技の効果と防御の連発を評価。'};
}
