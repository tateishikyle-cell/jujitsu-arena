import {raidActions,freeForAllTargets} from './raid-engine.js';
import {fighterStatus,companionPanel} from './fighter-status.js';
import {roster,char,start,actions,resolve,chooseAI,mirrorState} from './engine.js';
import {vows,vowById,canChooseVow} from './vows.js';
import {planMatch,observeTurn} from './match-ai.js';
import {startTeam,advanceTeam,makeBracket,finishBout} from './competition.js';
import {caseFor,pleaChanceText} from './court-cases.js';
const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function createExtraModes({home,desc}){
 let mode='team',teams=[[{id:'yuji',vow:'none'},{id:'gojo',vow:'none'},{id:'yuta',vow:'none'}],[{id:'sukuna',vow:'none'},{id:'mahito',vow:'none'},{id:'higuruma',vow:'none'}]],entrants=roster.slice(0,8).map(c=>({id:c.id,vow:'none'}));
 let state=null,logs=[],match=null,bracket=null,history=[],histories=[[],[]],worker=null,plan=null,thinking=false,timer=null,running=false,speed=900,epoch=0,room=null,session=null,networkBusy=false,netError='',pollTimer=null,lastRevision=-1;
 let selected='yuji',selectedVow='none',prediction='',joinCode='',roomSize=2,onlineTarget=null;
 function stop(){epoch++;clearTimeout(timer);clearTimeout(pollTimer);timer=pollTimer=null;worker?.terminate();worker=null;thinking=false;plan=null;running=false;networkBusy=false;}
 function leave(){stop();state=null;home();}
 const options=(id,list=roster)=>list.map(c=>`<option value="${c.id}" ${id===c.id?'selected':''}>${esc(c.name)}</option>`).join('');
 function vowOptions(id,value){return `<option value="none" ${value==='none'?'selected':''}>縛りなし</option>`+vows.filter(v=>canChooseVow(v.id,id)).map(v=>`<option value="${v.id}" ${value===v.id?'selected':''}>${esc(v.name)}</option>`).join('');}
 function chooseCard(p,slot,attribute){return `<article class="lineup-card"><span class="eyebrow">${slot+1} / ${char(p.id).mark}</span><label>キャラクター<select ${attribute}="${slot}" data-field="id">${options(p.id)}</select></label><label>縛り<select ${attribute}="${slot}" data-field="vow">${vowOptions(p.id,p.vow)}</select></label><p class="small muted">${p.vow==='none'?'縛りなしで対戦。':esc(vowById(p.vow).game)}</p></article>`;}
 function header(title,note=''){return `<div class="battlebar"><div><div class="eyebrow">JUJUTSU HAND / ${mode.toUpperCase()}</div><h1>${title}</h1>${note?`<p class="muted">${note}</p>`:''}</div><button class="quiet" id="extraBack">モード選択へ</button></div>`;}
 function bindBack(){ $('#extraBack').onclick=()=>{if(!state||isOver()||confirm('この対戦画面を終了しますか？オンラインの部屋はあとで再接続できます。'))leave();};}
 function setup(next){stop();mode=next;state=null;logs=[];room=null;netError='';onlineTarget=null;if(mode==='team')teamSetup();else if(mode==='tournament')tournamentSetup();else{joinCode=new URL(location.href).searchParams.get('room')||joinCode;onlineSetup();}window.scrollTo({top:0});}
 function teamSetup(error=''){
  $('#app').innerHTML=header('3人で、勝ち抜け。','自分の3人 vs AIの3人。先鋒 → 中堅 → 大将の順で戦うチーム戦。')+`<p class="mode-note">勝者はHPを引き継ぎます。交代ごとに両者の呪力・領域・適応などの継続効果と縛りの使用回数をリセット。同時KOは双方が交代。チーム内の同キャラ重複は不可。</p>${error?`<p class="error" role="alert">${esc(error)}</p>`:''}`+teams.map((t,i)=>`<section><h2>${i?'AIチーム':'あなたのチーム'}</h2><div class="lineup">${t.map((p,j)=>chooseCard(p,j,`data-team-${i}`)).join('')}</div></section>`).join('')+`<div class="actionsrow"><button class="start" id="teamStart">この6人でチーム戦を開始 →</button><button class="quiet" id="teamRandom">両チームをランダムにする</button></div>`;
  bindBack();teams.forEach((t,i)=>document.querySelectorAll(`[data-team-${i}]`).forEach(el=>el.onchange=()=>{const p=t[+el.getAttribute(`data-team-${i}`)];p[el.dataset.field]=el.value;if(el.dataset.field==='id')p.vow='none';teamSetup();}));
  $('#teamRandom').onclick=()=>{teams=teams.map(()=>shuffle(roster).slice(0,3).map(c=>({id:c.id,vow:'none'})));teamSetup();};
  $('#teamStart').onclick=()=>{try{match=startTeam(teams);resetBout(match.state);askPlan();}catch(e){teamSetup(e.message);}};
 }
 function shuffle(list){return list.map(x=>({x,r:Math.random()})).sort((a,b)=>a.r-b.r).map(o=>o.x);}
 function tournamentSetup(error=''){
  $('#app').innerHTML=header('最強を決める、AI大会。','出場キャラと縛りを選び、AI同士の勝ち抜き戦を観戦。')+`<div class="vow-toolbar"><label>出場人数 <select id="entrantCount">${[4,8,16].map(n=>`<option ${entrants.length===n?'selected':''}>${n}</option>`).join('')}</select></label><button class="quiet" id="tournamentRandom">ランダム出場・組み合わせ</button></div><p class="mode-note">左から順に初戦の組み合わせ。全試合HP10・呪力0で開始。100戦闘ターンまたは同時KOは、残りHP → 呪力 → 抽選で勝者を決定します。</p>${error?`<p class="error">${esc(error)}</p>`:''}<div class="entrant-grid">${entrants.map((p,j)=>chooseCard(p,j,'data-entrant')).join('')}</div><label>優勝予想（任意）<select id="prediction"><option value="">予想しない</option>${options(prediction,entrants.map(p=>char(p.id)))}</select></label><button class="start" id="tournamentStart">トーナメント開幕 →</button>`;
  bindBack();document.querySelectorAll('[data-entrant]').forEach(el=>el.onchange=()=>{const p=entrants[+el.dataset.entrant];p[el.dataset.field]=el.value;if(el.dataset.field==='id'){p.vow='none';prediction='';}tournamentSetup();});
  $('#entrantCount').onchange=e=>{const n=+e.target.value;entrants=[...entrants.slice(0,n),...roster.filter(c=>!entrants.some(p=>p.id===c.id)).slice(0,Math.max(0,n-entrants.length)).map(c=>({id:c.id,vow:'none'}))];prediction='';tournamentSetup();};
  $('#tournamentRandom').onclick=()=>{entrants=shuffle(roster).slice(0,entrants.length).map(c=>({id:c.id,vow:'none'}));prediction='';tournamentSetup();};$('#prediction').onchange=e=>{prediction=e.target.value;};
  $('#tournamentStart').onclick=()=>{if(new Set(entrants.map(p=>p.id)).size!==entrants.length)return tournamentSetup('出場キャラが重複しています。別のキャラを選んでください。');bracket=makeBracket(entrants);running=true;beginBracketBout();};
 }
 function resetBout(s){state=s;logs=[];history=[];histories=[[],[]];plan=null;}
 function beginBracketBout(){const pair=bracket.entrants.slice(bracket.cursor,bracket.cursor+2);resetBout(start(pair[0].id,pair[1].id,pair.map(p=>p.vow)));askPlan();}
 function askPlan(){
  const id=++epoch,snapshot=state;thinking=true;plan=null;render();
  const finish=p=>{if(epoch!==id||state!==snapshot)return;thinking=false;plan=p;render();schedule();};
  const fallback=()=>{worker?.terminate();worker=null;setTimeout(()=>{if(epoch===id&&state===snapshot)finish(mode==='tournament'?planMatch(state,histories):chooseAI(state,history));},0);};
  try{if(!worker)worker=new Worker(new URL('./ai-worker.js',import.meta.url),{type:'module'});worker.onmessage=({data})=>{if(data.id!==id)return;if(data.error)fallback();else finish(data.plan);};worker.onerror=fallback;worker.postMessage({id,state,history,mode:mode==='tournament'?'watch':'play',histories});}catch{fallback();}
 }
 function schedule(){clearTimeout(timer);if(mode==='tournament'&&running&&plan&&!thinking&&!bracket.champion)timer=setTimeout(()=>turn(),speed);}
 function turn(index){
  if(thinking||!plan||isOver())return;
  const s=state,moves=mode==='tournament'?plan.map(p=>p.move):[actions(state,0)[index],plan.move];if(moves.some(m=>!m||m.disabled))return;
  clearTimeout(timer);const result=resolve(s,...moves);if(!s.court){if(mode==='tournament')histories=observeTurn(s,moves,histories);else history.push({id:moves[0].id,ownEnergy:s.p[0].e,enemyEnergy:s.p[1].e});}
  logs.unshift({turn:s.turn,moves:result.moves,log:result.log,trial:result.trial||false});logs=logs.slice(0,80);state=result.s;plan=null;
  if(mode==='team'){
   const before=match.index.join(',');match=advanceTeam(match,state);state=match.state;
   if(match.index.join(',')!==before&&!match.finished){history=[];logs.unshift({turn:s.turn,moves:[{n:char(state.p[0].id).name},{n:char(state.p[1].id).name}],log:['次の組み合わせへ。生存者のHPを引き継ぎ、双方の呪力・継続効果をリセットしました。']});}
   if(!match.finished)askPlan();else render();
  }else{
   if(state.p.some(p=>p.hp<=0)||state.turn>100){bracket=finishBout(bracket,state);running=false;render();}else askPlan();
  }
 }
 function isOver(){return mode==='online'?room?.phase==='finished':mode==='team'?!!match?.finished:!!bracket?.champion||state?.p.some(p=>p.hp<=0)||state?.turn>100;}
 function side(i){return mode==='tournament'?`AI ${i+1}`:mode==='online'?(i===room?.seat?'あなた':state?.freeForAll?`プレイヤー${i+1}`:'友達'):(i?'AI':'あなた');}
 function fighter(p,i){return `<section class="fighter ${i?'ai':'you'}"><div class="fighterhead"><span class="small">${side(i)}</span><span class="mark">${char(p.id).mark}</span></div><h2>${char(p.id).name}</h2><div class="stat"><span>HP <strong>${p.hp}</strong> / ${p.maxHp||10}</span><span>呪力 <b class="energy">${p.e}</b></span></div><div class="hp"><span style="width:${Math.max(0,p.hp)/(p.maxHp||10)*100}%"></span></div><div class="status" role="status">${esc(fighterStatus(p,state))}</div>${p.vow?`<details class="battle-vow"><summary>縛りの効果と代償</summary><p>${esc(vowById(p.vow).game)}</p></details>`:''}${companionPanel(p)}</section>`;}
 function court(){if(!state.court)return '';const c=state.court,record=caseFor(state.p[c.defendant].id),see=mode!=='online'||room.seat===c.judge;return `<section class="court-panel"><h2>誅伏賜死・${char(state.p[c.defendant].id).name}の裁判</h2><p>罪状：${esc(record.charge)}</p><p>日車に提出された証拠：${see?esc(record.evidence):'判決時に公開'}</p><p class="small">否認：${pleaChanceText('deny')}<br>黙秘：${pleaChanceText('silence')}<br>自白：${pleaChanceText('confess')}</p></section>`;}
 function teamBanner(){return `<section class="team-roster">${match.teams.map((t,i)=>`<div><b>${side(i)}</b><div>${t.map((p,j)=>`<span class="pill ${j<match.index[i]?'eliminated':j===match.index[i]?'active':''}">${j+1}. ${char(p.id).name}${j<match.index[i]?' KO':''}</span>`).join('')}</div></div>`).join('')}</section>`;}
 function bracketPanel(){return `<section class="bracket"><div class="labelrow"><h2>トーナメント表</h2><span class="pill">${bracket.champion?'全試合終了':`第${bracket.round}回戦`}</span></div><div class="bracket-rounds">${Array.from({length:Math.log2(entrants.length)},(_,r)=>{const results=bracket.results.filter(m=>m.round===r+1),current=bracket.round===r+1&&!bracket.champion;return `<div><h3>${r===Math.log2(entrants.length)-1?'決勝':`第${r+1}回戦`}</h3>${results.map(m=>`<article class="bracket-bout">${m.pair.map(p=>`<span class="${p.id===m.winner.id?'winner':''}">${char(p.id).name}${p.id===m.winner.id?' ✓':''}</span>`).join('')}<small>${m.reason}</small></article>`).join('')}${current?Array.from({length:(bracket.entrants.length-bracket.cursor)/2},(_,i)=>`<article class="bracket-bout ${i===0?'current':''}">${bracket.entrants.slice(bracket.cursor+i*2,bracket.cursor+i*2+2).map(p=>`<span>${char(p.id).name}</span>`).join('')}<small>${i===0&&!isOver()?'対戦中':'待機中'}</small></article>`).join(''):!results.length?'<p class="muted small">進出待ち</p>':''}</div>`;}).join('')}</div></section>`;}
 function resultText(){if(mode==='team')return match.winner===-1?'両チーム全滅・引き分け！':`${side(match.winner)}のチームが勝利！`;if(mode==='tournament')return bracket.champion?`優勝：${char(bracket.champion.id).name}！`:state.turn>100?'100ターンの規定判定':state.p.every(p=>p.hp<=0)?'同時KO・規定判定':`${char(state.p[state.p[0].hp>0?0:1].id).name}の勝利！`;return state.p.every(p=>p.hp<=0)?'引き分け！':`${side(state.p.findIndex(p=>p.hp>0))}の勝利！`;}
 function render(){
  if(!state)return;const over=isOver(),seat=mode==='online'?room.seat:0,locked=mode==='online'&&room.locked[seat];
  const ffa=mode==='online'&&state.freeForAll,eliminated=state.p[seat].hp<=0;
  const targets=ffa?freeForAllTargets(state,seat):[];
  if(ffa&&!targets.includes(onlineTarget))onlineTarget=targets[0];
  const moves=ffa?raidActions(state,seat,onlineTarget):actions(state,seat);
  const targetPicker=ffa&&!over&&!state.court&&!eliminated?`<label class="ffa-target">対象 <select id="onlineTarget" ${locked||networkBusy?'disabled':''}>${targets.map(i=>`<option value="${i}" ${i===onlineTarget?'selected':''}>${side(i)}・${char(state.p[i].id).name}</option>`).join('')}</select></label><p class="small muted">4チャージ以上の攻撃は生存中の相手全員が対象。無為転変と黒閃は選んだ相手だけ。簡易領域で必中を防げるのは使用者本人だけ。</p>`:'';
  $('#app').innerHTML=header(mode==='team'?'3人チーム戦':mode==='tournament'?'AIトーナメント':`オンライン ${ffa?"1 vs 1 vs 1":"1 vs 1"} / ${room.code}`)+(mode==='team'?teamBanner():mode==='tournament'?bracketPanel():'')+`<div class="fighters ${ffa?'ffa-fighters':''}">${state.p.map(fighter).join('<span class="vs">VS</span>')}</div><div class="arena"><section><div class="turnbox ${over?'result':''}" aria-live="polite"><div class="eyebrow">TURN ${state.turn}</div><h2>${over?resultText():mode==='online'?eliminated?'脱落しました。対戦を観戦できます。':locked?'手を確定しました。友達の選択を待っています':state.court&&seat!==state.court.defendant?'相手の陳述を待っています':'次の一手を選ぼう。':thinking?'AIが考えています…':mode==='tournament'?running?'AI同士の対戦中':'一時停止中':'次の一手を選ぼう。'}</h2><p class="small muted">${mode==='online'?'手はサーバーで同時に解決。確定後は変更できません。':mode==='team'?'AIの手が確定してから、あなたの行動を選びます。':'両AIは相手の現在の手を知らずに判断します。'}</p>${over?mode==='tournament'&&!bracket.champion?`<p>${esc(bracket.results.at(-1).reason)}</p><button id="nextBout" class="start">次の試合へ →</button>`:`${mode==='tournament'&&prediction?`<p>${prediction===bracket.champion.id?'優勝予想が的中！':'あなたの予想：'+char(prediction).name}</p>`:''}<button id="extraAgain" class="start">${mode==='online'?'部屋の作成・参加へ':'同じメンバーで再戦'}</button>`:''}</div>${!over?court():''}${!over&&mode==='tournament'?`<section class="watch-controls"><div class="watch-buttons"><button class="quiet" id="extraToggle">${running?'一時停止':'自動再生'}</button><button class="quiet" id="extraStep" ${running||thinking?'disabled':''}>1ターン進める</button><label>速度 <select id="extraSpeed">${[[1800,'ゆっくり'],[900,'標準'],[200,'速い']].map(([n,label])=>`<option value="${n}" ${n===speed?'selected':''}>${label}</option>`).join('')}</select></label></div></section>`:!over&&!eliminated?`${targetPicker}<div class="movegrid">${moves.map((a,i)=>`<button class="move" data-extra-move="${i}" ${a.disabled||thinking||locked||networkBusy||(mode==='online'&&state.court&&state.court.defendant!==seat)?'disabled':''}><span class="cost">${a.c}</span><b>${a.n}</b><small>${desc(a)}</small>${a.disabled?'<small>呪力・技・縛りの条件が不足</small>':''}</button>`).join('')}</div>`:''}${mode==='online'?`<p class="small" id="netStatus" role="status">${esc(netError)||'接続中・定期的に同期しています'}</p>${!over&&!eliminated?'<button class="quiet" id="surrender">降参して終了</button>':''}`:''}</section><aside class="side"><h2>対戦ログ</h2><div class="log">${logs.length?logs.map(l=>`<div class="logitem"><b>${l.trial?'裁判・判決':'TURN '+l.turn}</b><p>${l.moves.map((a,i)=>`${side(i)}：${esc(a.n)}${a.targets?.length?` → ${a.targets.map(side).join('・')}`:''}`).join('<br>')}</p>${l.log.map(esc).join('<br>')}</div>`).join(''):'<p class="muted">まだ手は公開されていません。</p>'}</div></aside></div>`;
  if($('#onlineTarget'))$('#onlineTarget').onchange=e=>{onlineTarget=+e.target.value;render();$('#onlineTarget')?.focus();};
  bindBack();if($('#extraAgain'))$('#extraAgain').onclick=()=>{if(mode==='team'){match=startTeam(teams);resetBout(match.state);askPlan();}else if(mode==='tournament'){bracket=makeBracket(entrants);running=true;beginBracketBout();}else setup('online');};if($('#nextBout'))$('#nextBout').onclick=()=>{running=true;beginBracketBout();};
  document.querySelectorAll('[data-extra-move]').forEach(el=>el.onclick=()=>mode==='online'?submitMove(+el.dataset.extraMove):turn(+el.dataset.extraMove));
  if($('#extraToggle')){$('#extraToggle').onclick=()=>{running=!running;render();schedule();};$('#extraStep').onclick=()=>turn();$('#extraSpeed').onchange=e=>{speed=+e.target.value;schedule();};}
  if($('#surrender'))$('#surrender').onclick=()=>{if(confirm('この対戦から降参しますか？'))mutateRoom('leave',{});};
 }
 function saveSession(){try{localStorage.setItem('jujutsu-room',JSON.stringify(session));}catch{}}
 function restoreSession(){try{const s=JSON.parse(localStorage.getItem('jujutsu-room'));return s&&/^[0-9A-F]{10}$/.test(s.code)&&/^[a-f0-9]{64}$/.test(s.token)?s:null;}catch{return null;}}
 function onlineSetup(message=''){
  session=restoreSession();const invite=joinCode;
  $('#app').innerHTML=header('離れていても、せーの。','部屋コードを友達に送って、それぞれのスマホで同時対戦。')+`<section class="online-box"><p class="mode-note">自分のキャラと縛りを選んで部屋を作成、または友達の部屋へ参加。部屋は24時間有効。手の名前・消費呪力は、全員が確定するまで相手に表示されません。</p><label>あなたのキャラ<select id="onlineChar">${options(selected)}</select></label><label>縛り<select id="onlineVow">${vowOptions(selected,selectedVow)}</select></label><p class="small">${selectedVow==='none'?'縛りなし':esc(vowById(selectedVow).game)}</p><label>部屋の対戦人数<select id="roomSize"><option value="2">2人（1 vs 1）</option><option value="3" ${roomSize===3?'selected':''}>3人（1 vs 1 vs 1）</option></select></label><button class="start" id="createRoom">部屋を作る →</button><div class="online-join"><label>友達の部屋コード<input id="roomCode" maxlength="10" autocomplete="off" autocapitalize="characters" value="${esc(invite)}" placeholder="10文字の部屋コード"></label><button class="quiet" id="joinRoom">この部屋に参加</button></div>${session?`<button class="quiet" id="resumeRoom">前の部屋 ${esc(session.code)} に再接続</button>`:''}<p id="onlineMessage" class="error" role="status">${esc(message)}</p></section>`;
  bindBack();$('#roomSize').onchange=e=>{roomSize=+e.target.value;};$('#roomCode').oninput=e=>{joinCode=e.target.value;};$('#onlineChar').onchange=e=>{selected=e.target.value;selectedVow='none';onlineSetup();};$('#onlineVow').onchange=e=>{selectedVow=e.target.value;onlineSetup();};$('#createRoom').onclick=()=>enterRoom();$('#joinRoom').onclick=()=>enterRoom($('#roomCode').value.trim().toUpperCase());if($('#resumeRoom'))$('#resumeRoom').onclick=()=>resume();
 }
 async function api(path,{method='GET',body,token}={}){
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),12000);
  try{const res=await fetch('/api/rooms'+path,{method,headers:{...(body?{'content-type':'application/json'}:{}),...(token?{authorization:'Bearer '+token}:{})},body:body?JSON.stringify(body):undefined,signal:controller.signal});let data;try{data=await res.json();}catch{throw Error('オンライン対戦に接続できません。画面を更新してお試しください。');}if(!res.ok)throw Object.assign(Error(data.error||'接続に失敗しました'),{status:res.status});return data;}finally{clearTimeout(timeout);}
 }
 async function enterRoom(code){if(networkBusy)return;if(code!==undefined&&!/^[0-9A-F]{10}$/.test(code)){$('#onlineMessage').textContent='友達の10文字の部屋コードを入力してください';return;}networkBusy=true;const id=epoch;document.querySelectorAll('#createRoom,#joinRoom').forEach(b=>b.disabled=true);try{const data=await api(code?'/'+code+'/join':'',{method:'POST',body:{character:selected,vow:selectedVow,size:roomSize}});if(id!==epoch)return;session={code:data.code,token:data.token};saveSession();lastRevision=-1;networkBusy=false;applyRoom(data);poll();}catch(e){if(id===epoch)$('#onlineMessage').textContent=e.message;}finally{if(id===epoch){networkBusy=false;document.querySelectorAll('#createRoom,#joinRoom').forEach(b=>b.disabled=false);}}}
 async function resume(){if(networkBusy)return;networkBusy=true;const id=epoch;try{const data=await api('/'+session.code,{token:session.token});if(id!==epoch)return;lastRevision=-1;networkBusy=false;applyRoom(data);poll();}catch(e){if(id===epoch)$('#onlineMessage').textContent=e.message;}finally{if(id===epoch)networkBusy=false;}}
 function applyRoom(data){if(data.revision<lastRevision){if(state)render();return;}lastRevision=data.revision;room=data;state=data.state;logs=data.logs;netError='';if(state)render();else lobby();}
 function lobby(){const link=location.origin+'/?room='+room.code;$('#app').innerHTML=header('友達の参加を待っています。')+`<section class="online-box"><p>部屋コード</p><div class="room-code">${room.code}</div><p>${char(room.players[0].id).name} ／ ${room.players[0].vow==='none'?'縛りなし':esc(vowById(room.players[0].vow).name)}</p><button class="start" id="copyInvite">招待リンクをコピー</button><label>招待リンク<input id="inviteLink" readonly value="${esc(link)}"></label><p id="copyStatus" role="status"></p><p class="muted">${room.players.filter(Boolean).length} / ${room.players.length}人が参加中。全員そろうと対戦が始まります。部屋コードだけでも参加できます。</p><p class="small" id="netStatus">接続中</p></section>`;bindBack();$('#copyInvite').onclick=async()=>{try{await navigator.clipboard.writeText(link);$('#copyStatus').textContent='コピーしました！友達に送ってね。';}catch{$('#inviteLink').select();$('#copyStatus').textContent='リンクを選択しました。コピーして友達に送ってね。';}};}
 function poll(){clearTimeout(pollTimer);if(mode!=='online'||!session||room?.phase==='finished')return;const id=epoch;pollTimer=setTimeout(async()=>{try{const data=await api('/'+session.code,{token:session.token});if(id!==epoch)return;if(data.revision!==lastRevision||netError)applyRoom(data);}catch(e){if(id!==epoch)return;netError=e.message;if($('#netStatus'))$('#netStatus').textContent=netError+'・再接続しています';}if(id===epoch)poll();},1500);}
 async function mutateRoom(action,body){
  if(networkBusy)return;networkBusy=true;netError='';const id=epoch,snapshot=JSON.stringify(room.state);render();
  try{
   let data;
   let revision=room.revision;
   for(let retries=0;;retries++){
    try{data=await api('/'+session.code+'/'+action,{method:'POST',body:{...body,revision},token:session.token});break;}
    catch(e){
     if(e.status!==409||retries>=2)throw e;
     const latest=await api('/'+session.code,{token:session.token});if(id!==epoch)return;
     if(action==='move'&&latest.phase==='battle'&&JSON.stringify(latest.state)===snapshot&&!latest.locked[latest.seat]){revision=latest.revision;continue;}
     data=latest;break;
    }
   }
   if(id!==epoch)return;networkBusy=false;applyRoom(data);poll();
  }catch(e){if(id!==epoch)return;networkBusy=false;netError=e.message;render();poll();}
 }

 function submitMove(index){if(room.locked[room.seat])return;mutateRoom('move',{index,...(state.freeForAll?{target:onlineTarget}:{})});}
 return {setup};
}
