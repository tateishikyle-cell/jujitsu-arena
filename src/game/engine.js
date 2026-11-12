import {attachVow,vowById,vowPrice,vowDuration,vowAttackBonus} from './vows.js';
import {caseFor,courtVerdict,verdictName,courtDistribution,pleaChanceText} from './court-cases.js';
export const atk=(id,n,c,d,x={})=>({id,n,c,d,type:'attack',...x});
const utility=(id,n,c,type,x={})=>({id,n,c,type,...x});
export const roster=[
['yuji','虎杖悠仁','拳で、切り拓く。','拳',[atk('punch','通常パンチ',1,2),atk('double','逕庭拳',2,4)]],
['yuta','乙骨憂太','繋がる呪力、純愛の一撃。','愛',[utility('rika','来い、リカ',0,'rika'),atk('beam','呪力砲',2,3,{rika:true}),atk('sweep','呪力薙ぎ払い',1,2,{sweep:true}),atk('love','純愛砲',4,8,{rika:true}),utility('copy','模倣',3,'copy')]],
['gojo','五条悟','無限の、その先へ。','無',[atk('blue','蒼',2,3),atk('red','赫',2,3),atk('maxblue','蒼・出力最大',3,5),atk('void','無量空処（0.2秒）',4,0,{stun:2}),atk('purple','虚式・紫',0,10,{purple:true}),utility('falling','落花の情',2,'falling'),utility('infinity','無限',2,'infinity')]],
['sukuna','両面宿儺','一閃で、世界を断つ。','斬',[atk('dismantle','解',2,3),atk('cleave','捌',2,3),atk('world','世界を断つ斬撃',3,5,{breaks:true}),atk('fire','竈開',4,8),utility('basket','彌虚葛籠',2,'basket')]],
['megumi','伏黒恵','影より、式神を放て。','影',[atk('dog','玉犬',1,2,{shikigami:true}),utility('nuedodge','鵺（回避）',2,'dodge',{shikigami:true}),atk('nue','鵺（攻撃）',2,4,{shikigami:true}),atk('elephant','満象',4,9,{shikigami:true})]],
['inumaki','狗巻棘','その一言が、勝負を決める。','言',[atk('die','死ね',6,99,{speech:true}),atk('stop','動くな',2,0,{speech:true,cancel:true,stun:1}),atk('fly','ぶっ飛べ',2,0,{speech:true,cancel:true,stun:1})]],
['blood','赤血操術','圧縮した血が、勝機を穿つ。','血',[utility('focus','百斂',2,'focus'),atk('pierce','穿血（弱）',3,5),atk('strong','穿血（強）',0,10,{focus:true})]],
['mahito','真人','魂の形を、変えてみよう。','魂',[utility('soul','人貯め',1,'soul'),atk('transfigure','無為転変',4,99,{onCharge:true}),atk('souls','多重魂・撥体',0,3,{souls:true})]],
['hakari','秤金次','熱を、賭けろ。','賭',[atk('punch','パンチ',1,2),atk('door','ドア',2,3)]],
['kusakabe','日下部篤也','守りを極め、機を斬る。','刀',[atk('draw','抜刀',2,3),utility('moon','居合「夕月」',2,'stance'),atk('haze','朧月',3,5)]],
['jogo','漏瑚','灼熱の一撃を。','炎',[atk('insect','火礫蟲',2,3),atk('meteor','極ノ番・隕',4,8)]],
['naoya','禪院直哉','速さで、置き去りに。','速',[atk('heart','人の心とかないんか',2,3,{stun:1}),atk('speed','最高速度',4,7,{stun:1})]],
['geto','夏油傑（羂索）','呪霊を束ね、戦局を操る。','群',[atk('grade3','3級呪霊',1,1),atk('grade2','2級呪霊',2,3),atk('grade1','準1級呪霊',3,4),atk('pox','特級呪霊・疱瘡神',4,6,{guard:true}),atk('gravity','反転重力',4,8)]],
['ryu','石流龍','出力で、圧倒する。','砲',[atk('weak','グラニテブラスト（弱）',2,3),atk('multi','グラニテブラスト（複）',3,5),atk('strong','グラニテブラスト（強）',4,8)]],
['nanami','七海建人','急所を、見極める。','比',[atk('ratio','7：3',1,2),atk('collapse','十劃呪法・瓦落瓦落',3,5)]],
['reggie','レジィ・スター','契約から、逆転へ。','契',[utility('heal','再契象（回復）',2,'heal'),atk('receipt','再契象（攻撃）',2,3),atk('house','再契象（家）',4,8),utility('basket','彌虚葛籠',2,'basket')]],
['higuruma','日車寛見','この一戦を、裁く。','裁',[atk('smash','スマッシュ',2,3),atk('gavel','ガベル',3,5),utility('amplify','領域展延',3,'amplify'),atk('execution','処刑人の剣',0,0,{execution:true}),atk('gavelWeak','ガベル（弱）',1,2)]],
['kashimo','鹿紫雲一','雷鳴のような一撃。','雷',[atk('electricp','電気パンチ',2,2,{drain:1}),atk('electric','電気',3,5),atk('amber','幻獣琥珀',4,8),utility('basket','彌虚葛籠',2,'basket')]],
['hanami','花御','静かに、戦場を覆う。','花',[atk('roots','木の根',2,2,{guard:true}),atk('ball','木の毬',2,3),atk('seed','呪いの種子',3,0,{seed:true}),atk('flowers','お花畑',3,3,{stun:1}),utility('amplify','領域展延',3,'amplify'),atk('light','朶頤光海',4,8)]],
['dagon','陀艮','深海から、押し寄せる。','海',[atk('water','水攻め',2,3),utility('release','術式解放・死累累湧軍',4,'release'),atk('shark','鮫',1,3,{released:true})]],
['uraume','裏梅','凍てつく戦場を支配する。','氷',[atk('sword','氷剣',1,2),atk('frost','霜凪',2,3,{stun:1}),atk('icefall','直瀑',4,8,{stun:1})]],
['uro','烏鷺享子','空間を、手繰る。','空',[atk('air','空気割り',2,4),atk('sky','宇守羅彈',3,5),utility('deflect','空間の受け流し',2,'dodge')]],
['miguel','ミゲル','軽やかに、かわす。','舞',[atk('rope','黒縄',2,3),utility('prayer','祈祷の歌',2,'dodge'),atk('punch','パンチ',1,2)]],
['ino','猪野琢真','瑞獣の力を、その手に。','獣',[atk('kaichi','獬豸',2,3),utility('turtle','霊亀',3,'buff'),atk('dragon','竜',4,8)]],
['todo','東堂葵','不意を突き、黒閃へ。','換',[utility('boogie','ブギウギ',1,'dodge'),atk('suplex','スープレックス',2,2),utility('takada','高田ちゃん',3,'takada'),atk('cpunch','呪力パンチ',2,4),atk('black','一撃必殺黒閃',0,99,{takada:true})]]
].map(([id,name,tag,mark,moves])=>({id,name,tag,mark,moves}));
const gojoMoves=roster.find(c=>c.id==='gojo').moves;
roster.push({id:'studentGojo',name:'学生五条悟',tag:'蒼から、覚醒へ。',mark:'蒼',moves:gojoMoves.filter(a=>['blue','maxblue','falling'].includes(a.id))});
// This form combines the existing move sets; their costs and effects stay shared.
roster.splice(roster.findIndex(c=>c.id==='sukuna')+1,0,{id:'meguna',name:'両面宿儺（伏黒恵の肉体）',tag:'斬撃・赤血・影、そして適応。',mark:'宿',moves:[...['sukuna','megumi','blood'].flatMap(id=>roster.find(c=>c.id===id).moves.filter(a=>a.id!=='elephant').map(a=>({...a,...(id==='blood'&&a.type==='attack'?{bloodBonus:1}:{})}))),utility('mahoraga','魔虚羅',4,'summon',{shikigami:true}),atk('mahoPunch','通常パンチ',1,3,{requiresCompanion:true}),utility('adapt','適応',1,'adapt',{requiresMahoraga:true}),utility('agito','嵌合獣 顎吐',3,'summonAgito',{shikigami:true})]});
export const char=id=>roster.find(c=>c.id===id);
export const fresh=id=>({id,hp:10,e:0,rika:0,cool:0,domain:0,domainKind:null,lastMove:null,lastTechnique:null,techniqueHistory:[],stun:0,punch:0,soul:0,focus:0,blue:false,red:false,purpleReady:false,stance:false,moonBonus:0,amp:false,buff:0,released:false,takada:false,blackUsed:false,seed:false,inv:0,mahoragaHp:0,agitoHp:0,adapted:[],confiscated:0,executioner:false});
export const start=(a,b,vows=['none','none'])=>({p:[attachVow(fresh(a),vows[0]),attachVow(fresh(b),vows[1])],turn:1,clash:false,court:null});
function prepareMove(a,p){
 if(a.id==='mahoPunch'&&p.id==='meguna')return {...a,d:p.mahoragaHp&&p.agitoHp?6:3};
 return p.id==='yuji'&&a.id==='punch'&&p.punch===3?{...a,n:'黒閃（4回目の通常パンチ）',d:99,attackTier:4,blackFlash:true}:a;}
const focusedAttack=p=>({... (char(p.id).moves.find(a=>a.focus)||atk('strong','穿血（強）',0,10,{focus:true,bloodBonus:1})),forced:true,disabled:false});
const attackTier=a=>a.attackTier??a.c;
const domainKind=p=>{const id=p.domainKind||p.id;return id==='meguna'?'sukuna':id;};
const DOMAIN_NAMES={gojo:'無量空処',sukuna:'伏魔御厨子',meguna:'伏魔御厨子',yuta:'真贋相愛',mahito:'自閉円頓裹',megumi:'嵌合暗翳庭',hakari:'坐殺博徒',jogo:'蓋棺鉄囲山',naoya:'時胞月宮殿',geto:'胎蔵遍野',higuruma:'誅伏賜死'};
const domainAttack=p=>({id:'domain',type:'domain',n:DOMAIN_NAMES[domainKind(p)]||'領域展開',sourceId:domainKind(p)});
const techniqueKey=a=>a.type==='domain'?`domain:${domainKind({id:a.sourceId})}:${a.baseName||a.n}`:`${a.type}:${a.baseName||a.n}`;
const hasAdapted=(p,a)=>!p.confiscated&&p.adapted?.some(x=>x.key===techniqueKey(a))||false;
const lethalDomain=id=>['gojo','sukuna','mahito','naoya'].includes(id);
const copyable=a=>a&&isTechnique(a)&&!['domain','copy','vowReveal','takada','honored'].includes(a.type)&&!a.execution&&a.id!=='void';
const copyTarget=p=>p.lastTechnique??(copyable(p.lastMove)?p.lastMove:null);
function recordMove(p,a,canceled){
 const known=copyTarget(p);
 if(known&&!p.lastTechnique){
  p.lastTechnique=known;
  if(!p.techniqueHistory?.length)p.techniqueHistory=[known];
 }
 p.lastMove=canceled||['charge','wait'].includes(a.type)?null:{...a};
 if(canceled||!copyable(a))return;
 const {disabled,forced,copyName,vowBaseCost,...move}=a;
 move.n=a.baseName||a.n;
 const previous=(p.techniqueHistory||[]).filter(x=>x.sourceId!==move.sourceId||x.id!==move.id);
 p.techniqueHistory=[...previous,move];
 p.lastTechnique=move;
}
function forcedBlackFlash(p){
 if(p.id!=='todo'||!p.takada||p.blackUsed||(p.vow==='lastStrike'&&p.vowUsed))return null;
 return {...char(p.id).moves.find(a=>a.id==='black'),forced:true};
}
function spendBlackFlash(p,a){
 if(p.id==='todo'&&a.id==='black'){p.takada=false;p.blackUsed=true;}
}
function canPreparePurple(p){
 return !p.bossForm&&(p.id==='gojo'||(p.id==='studentGojo'&&p.awakened));
}
function mustUsePurple(p){
 return canPreparePurple(p)&&p.purpleReady&&!p.confiscated&&!(p.vow==='lastStrike'&&p.vowUsed);
}
const forcedPurple=()=>atk('purple','虚式・紫',0,10,{purple:true,forced:true});
function advancePurple(p,a,log){
 if(!canPreparePurple(p))return;
 if(a.id==='blue')p.blue=true;
 if(a.id==='red')p.red=true;
 if(a.id==='purple'){
  p.blue=p.red=p.purpleReady=false;
  log.push('虚式・紫！ 蒼と赫の準備を消費。');
 }else if(p.blue&&p.red&&!p.purpleReady){
  p.purpleReady=true;
  log.push('蒼と赫がそろった！ 次の行動は必ず虚式・紫。');
 }
}
function awakenStudent(p,killedByDomain,log){
 if(p.id!=='studentGojo'||p.hp>0||p.awakened||killedByDomain)return;
 p.awakened=true;
 p.maxHp=p.hp=5;
 p.e=0;
 log.push('学生五条悟が覚醒。呪力0、HP5／5で復活。');
}
function absorbCompanions(p,damage,fatal,confiscated,log){
 if(confiscated)return damage;
 const companions=[['mahoragaHp','魔虚羅'],['agitoHp','顎吐']];
 if(p.newestCompanion==='agitoHp')companions.reverse();
 for(const [field,name] of companions){
  if(!p[field]||(!damage&&!fatal))continue;
  const absorbed=Math.min(p[field],damage);
  p[field]=fatal?0:p[field]-absorbed;
  damage-=absorbed;
  log.push(`${name}が${absorbed}ダメージを引き受けた（残りHP${p[field]}）。`);
 }
 return damage;
}
function summonCompanion(p,field,log){
 if(p[field]>0)return;
 const agito=field==='agitoHp';
 p[field]=agito?3:5;
 p.newestCompanion=field;
 log.push(agito?'嵌合獣 顎吐を召喚（HP3）。':'魔虚羅を召喚（HP5・自傷なし）。');
}
function domainTechniqueSetup(p,active,log){
 if(!active||domainKind(p)!=='yuta'||!p.domainTechnique)return null;
 const technique=p.domainTechnique;
 if(technique.type==='attack')return technique;
 log.push(`真贋相愛：${technique.n}が発動。`);
 switch(technique.type){
  case 'summon':summonCompanion(p,'mahoragaHp',log);break;
  case 'summonAgito':summonCompanion(p,'agitoHp',log);break;
  case 'rika':p.rika=5;break;
  case 'focus':p.focus=1;break;
  case 'soul':p.soul++;break;
  case 'heal':p.hp=Math.min(p.maxHp||10,p.hp+3);break;
  case 'release':p.released=true;break;
  case 'buff':p.buff=1;break;
 }
 return technique;
}
function domainTechniqueHit(p,target,defender,move,log){
 const technique=p.domainTechnique;
 if(technique?.type!=='attack'||['simple','basket','falling'].includes(move.type)||(defender.inv>0&&!defender.confiscated)||hasAdapted(defender,domainAttack(p))||hasAdapted(defender,technique))return 0;
 const damage=(technique.d||0)+(technique.bloodBonus||0)+(technique.sourceId==='blood'&&technique.d>0?1:0);
 // Automatic techniques resolve after chosen actions, so stun applies on the next turn.
 if(technique.stun)target.stun=Math.max(target.stun,technique.stun);
 if(technique.drain)target.e=Math.max(0,target.e-technique.drain);
 if(technique.seed)target.seed=true;
 log.push(`真贋相愛の必中：${technique.n}${damage?`（${damage}ダメージ）`:''}。`);
 return damage;
}
function copiedMove(s,i,a){if(a.type!=='copy')return {...a,sourceId:a.sourceId||s.p[i].id};const last=copyTarget(s.p[1-i]);if(!last)return utility('wait','模倣対象なし',0,'wait');return {...last,c:3,attackTier:attackTier(last),healAmount:last.healAmount??last.c*2,vowBaseCost:3,n:`模倣：${last.baseName||last.n}`,baseName:last.baseName||last.n,copied:true};}
export function isTechnique(a){
if(['charge','barrier','simple','reverse','falling','basket','amplify','stance','wait','plea'].includes(a.type))return false;
if(a.type==='attack'&&['basicPunch','punch','double','sweep','beam','love','draw','haze','suplex','cpunch','black','mahoPunch'].includes(a.id))return false;
return true;
}
export function mirrorState(s){return {...s,p:[s.p[1],s.p[0]],court:s.court?{...s.court,judge:1-s.court.judge,defendant:1-s.court.defendant}:null};}
function trialActions(s,i){if(i!==s.court.defendant)return [utility('courtWait','判決を待つ',0,'wait')];
if(!caseFor(s.p[i].id).severity)return [utility('acquit','罪状未登録・処罰なしで続ける',0,'plea')];
return [utility('deny','否認',0,'plea'),utility('silence','黙秘',0,'plea'),utility('confess','自白',0,'plea')];}
function resolveCourt(state,aa,bb,rng){
const s=structuredClone(state),{judge,defendant}=s.court,record=caseFor(s.p[defendant].id),selected=[aa,bb][defendant];
const legal=trialActions(s,defendant);if(!legal.some(a=>a.id===selected?.id))throw new Error('裁判では否認・黙秘・自白を選んでください');
const moves=[utility('courtWait','判決を待つ',0,'wait'),utility('courtWait','判決を待つ',0,'wait')];moves[defendant]=selected;
const severity=courtVerdict(record.severity,selected.id,record.severity?rng():0),log=[`証拠開示：${record.evidence}`,`${char(s.p[defendant].id).name}の陳述：${selected.n}。判決：${verdictName(severity)}。`];
if(selected.id==='deny')log.push(severity===0?'否認成功（20%）：今回は処罰なし。':'否認失敗（80%）：罪を一段加重。');
if(['silence','confess'].includes(selected.id))log.push(`${selected.n}の判決確率：${pleaChanceText(selected.id)}。`);
if(severity){s.p[defendant].confiscated=5;s.p[defendant].domain=0;log.push('没収：次の戦闘ターンから5ターン、術式の使用と継続効果を停止。パンチ・反転術式などは使用可能。');}
if(severity>=2){s.p[judge].executioner=true;log.push('処刑人の剣を付与。0チャージ・防御不能の即死。反転・適応・魔虚羅でも防げない。');}
s.p[judge].domain=0;s.clash=false;s.court=null;
// Pleadings are a separate phase: they consume no combat turn, charge or buff duration.
return {s,log,moves,damage:[0,0],trial:true,verdict:verdictName(severity),case:record};
}
function domainPrice(s,i,a){const p=s.p[i],effective=a.type==='copy'?copyTarget(s.p[1-i]):a;return p.domain>0&&!s.clash&&!p.confiscated&&!p.amp&&domainKind(p)==='megumi'&&effective?.shikigami?{...a,c:1,shadowDiscount:true}:a;}
export function actions(s,i){const p=s.p[i],op=s.p[1-i];if(s.court)return trialActions(s,i);if(p.stun)return [utility('wait','行動不能',0,'wait')];if(p.vow==='reveal'&&!p.vowUsed)return [utility('vowReveal','術式を開示する',0,'vowReveal')];if(p.focus&&!p.confiscated&&!(p.vow==='lastStrike'&&p.vowUsed))return [vowPrice(p,focusedAttack(p))].map(a=>({...a,disabled:!!a.disabled||p.e<a.c}));if(mustUsePurple(p))return [vowPrice(p,forcedPurple())].map(a=>({...a,disabled:!!a.disabled||p.e<a.c}));const black=forcedBlackFlash(p);if(black)return [vowPrice(p,black)].map(a=>({...a,disabled:!!a.disabled||p.e<a.c}));let m=[utility('charge','チャージ',0,'charge'),utility('barrier','バリヤ',0,'barrier'),utility('simple','シン陰流・簡易領域',p.id==='kusakabe'?2:3,'simple'),...char(p.id).moves.filter(a=>!['agito','gavelWeak'].includes(a.id)&&(p.id!=='studentGojo'||a.id!=='falling')),...Array.from({length:Math.max(1,p.e)},(_,k)=>utility('reverse'+(k+1),'反転術式（'+(k+1)+'チャージ）',k+1,'reverse'))];
if(p.confiscated&&!m.some(a=>a.id==='punch'))m.push(atk('basicPunch','通常パンチ',1,2));
if(p.vow==='boundary')m.push(atk('soulBoundary','魂の境界への解',2,0,{boundary:true,drain:3,stun:1}));
if(p.executioner&&!m.some(a=>a.execution))m.push(atk('execution','処刑人の剣',0,0,{execution:true}));
if(p.id==='studentGojo'&&p.awakened){
 m=m.map(a=>a.id==='blue'?{...a,c:1}:a);
 m.push({...gojoMoves.find(a=>a.id==='red'),c:1},utility('honored','天上天下唯我独尊',1,'honored',{disabled:!!p.honored}));
}
if(!p.amp&&p.id!=='studentGojo'){
 if(p.id==='yuta'){
  const history=op.techniqueHistory||[];
  const techniques=history.length?history:[copyTarget(op)].filter(Boolean);
  m.push(utility('domain','真贋相愛',5,'domain',{disabled:true}));
  m.push(...techniques.filter(copyable).map((a,i)=>utility('domain:'+i,`真贋相愛：${a.n}`,5,'domain',{domainTechnique:a})));
 }else m.push(utility('domain',DOMAIN_NAMES[p.id]||'領域展開',p.id==='hakari'?3:p.id==='megumi'?4:5,'domain'));
}
if(p.id==='higuruma')m.push(char(p.id).moves.find(a=>a.id==='gavelWeak'));
if(p.id==='meguna')m.push(char(p.id).moves.find(a=>a.id==='agito'));
// Keep existing online move indices when adding a move to a character.
if(p.id==='studentGojo')m.push(char(p.id).moves.find(a=>a.id==='falling'));
if(p.bossForm==='sukuna')m=m.map(a=>a.type==='domain'?{...a,c:3}:a.id==='world'?{...a,c:2}:a);
if(p.bossForm==='gojo')m=m.filter(a=>a.id!=='purple').map(a=>a.type==='infinity'?{...a,c:0}:a).concat(atk('purple200','200％虚式・紫',4,15));
return m.map(a=>vowPrice(p,domainPrice(s,i,a),a.type==='copy'?copyTarget(op)?.type:null)).map(a=>a.type==='copy'?{...a,copyName:copyTarget(op)?.baseName||copyTarget(op)?.n||null}:prepareMove(a,p)).map(a=>({...a,disabled:!!a.disabled||p.e<a.c||!!(p.confiscated&&isTechnique(a))||!!(a.execution&&!p.executioner)||!!(a.requiresMahoraga&&(!p.mahoragaHp||p.confiscated))||!!(a.requiresCompanion&&(!(p.mahoragaHp||p.agitoHp)||p.confiscated))||!!(a.type==='summonAgito'&&p.agitoHp>0)||!!(a.type==='summon'&&p.mahoragaHp>0)||!!(a.purple&&!p.purpleReady)||!!(a.rika&&(!p.rika||p.confiscated))||!!(a.focus&&!p.focus)||!!(a.souls&&p.soul<3)||!!(a.released&&!p.released)||!!(a.takada&&(!p.takada||p.blackUsed))||!!(a.type==='takada'&&(p.blackUsed||p.takada||(p.vow==='lastStrike'&&p.vowUsed)))||!!(a.id==='rika'&&(p.rika||p.cool))||!!(a.type==='domain'&&p.domain>0)||!!(a.type==='amplify'&&p.amp)||!!(a.type==='copy'&&(!copyTarget(op)||(copyTarget(op).rika&&!p.rika)||(copyTarget(op).type==='summon'&&p.mahoragaHp)||(copyTarget(op).type==='summonAgito'&&p.agitoHp)))}));}
function blockedBy(a,b,defender){
if(a.execution)return false;
if(hasAdapted(defender,a))return true;
if(a.sweep&&['barrier','simple','basket','falling','infinity','dodge','stance'].includes(b.type))return true;
if(b.type==='infinity'&&a.id!=='world')return true;
if(a.id==='die')return false; // Explicitly unblockable in the source rules.
if(defender.inv>0&&!defender.confiscated)return true;
if(a.speech)return b.type==='dodge'&&['boogie','prayer'].includes(b.id);
if(b.type==='simple')return true;
if((b.type==='barrier'||b.guard)&&attackTier(a)>=1&&attackTier(a)<=2)return true;
return b.type==='dodge'&&!(b.id==='nuedodge'&&a.id==='love');
}
export function resolve(state,aa,bb,rng=Math.random){if(state.court)return resolveCourt(state,aa,bb,rng);const s=structuredClone(state),old=state.p,ps=s.p;let moves=[aa,bb].map(a=>({...a})),log=[];const canceled=[false,false],broken=[false,false],chargeGains=[0,0],chargeDamage=[0,0],fatal=[false,false],executionFatal=[false,false],priorityLost=[false,false],clashWon=[false,false];
for(let i=0;i<2;i++){if(old[i].stun)moves[i]=utility('wait','行動不能',0,'wait');else if(old[i].vow==='reveal'&&!old[i].vowUsed)moves[i]=utility('vowReveal','術式を開示する',0,'vowReveal');else if(old[i].focus&&!old[i].confiscated&&!(old[i].vow==='lastStrike'&&old[i].vowUsed))moves[i]=focusedAttack(old[i]);else if(mustUsePurple(old[i]))moves[i]=forcedPurple();else moves[i]=forcedBlackFlash(old[i])||moves[i];}
moves=moves.map((a,i)=>old[i].confiscated&&isTechnique(a)?utility('wait','術式は没収中',0,'wait'):a);
moves=moves.map((a,i)=>{const priced=vowPrice(old[i],a,a.type==='copy'?copyTarget(old[1-i])?.type:null);return priced.disabled?utility('wait','縛りにより使用不可',0,'wait'):priced;});
// Resolve copied move identities before simultaneous cancellation and defense.
moves=moves.map((a,i)=>([aa,bb][i].type==='copy'&&moves[i].type==='copy'?{...domainPrice(state,i,copiedMove(state,i,a)),c:moves[i].c}:domainPrice(state,i,copiedMove(state,i,a))));
moves=moves.map((a,i)=>a.execution&&!old[i].executioner?utility('wait','死刑判決が必要',0,'wait'):a);
moves=moves.map((a,i)=>a.rika&&(!old[i].rika||old[i].confiscated)?utility('wait','リカ不在のため使用不可',0,'wait'):prepareMove(a,old[i]));
for(let i=0;i<2;i++){const a=moves[i],b=moves[1-i];if(a.cancel&&!b.execution&&!old[i].stun&&!blockedBy(a,b,old[1-i]))canceled[1-i]=true;}
for(let i=0;i<2;i++){const p=ps[i];if(p.vow)p.vowLock=Math.max(0,(p.vowLock||0)-1);p.confiscated=Math.max(0,(p.confiscated||0)-1);p.stun=Math.max(0,p.stun-1);p.domain=state.clash?p.domain:Math.max(0,p.domain-1);p.inv=Math.max(0,p.inv-1);p.focus=(old[i].stun||old[i].confiscated)?old[i].focus:0;if(p.rika){p.rika--;if(!p.rika)p.cool=5;}else p.cool=Math.max(0,p.cool-1);p.e-=moves[i].c;}
for(let i=0;i<2;i++){const p=ps[i],a=moves[i];if(canceled[i]){log.push(`${char(p.id).name}の行動は呪言で無効！`);continue;}if(p.vow==='copyLimit'&&[aa,bb][i].type==='copy')p.vowUsed=true;if(p.vow==='world'&&a.id==='world')p.vowCount++;if(p.vow==='lastStrike'&&a.type==='attack')p.vowUsed=true;if(p.vow==='swaps'&&a.id==='boogie')p.vowLock=1;if(p.vow==='stationary'&&a.type==='simple')p.vowLock=1;if(p.vow==='arm'&&a.type==='reverse')p.vowArm=false;switch(a.type){case'vowReveal':p.vowUsed=true;log.push(`${char(p.id).name}が術式を開示。次ターンから攻撃＋1。`);break;case'charge':chargeGains[i]=old[i].rika&&!old[i].confiscated?2:1;p.e+=chargeGains[i];if(old[i].seed&&!hasAdapted(old[i],{type:'attack',n:'呪いの種子'}))chargeDamage[i]=2;break;case'summon':summonCompanion(p,'mahoragaHp',log);break;case'summonAgito':summonCompanion(p,'agitoHp',log);break;case'honored':p.honored=true;break;case'rika':p.rika=5;break;case'focus':p.focus=1;break;case'stance':p.stance=true;p.moonBonus=2;break;case'soul':p.soul++;break;case'heal':p.hp=Math.min(p.maxHp||10,p.hp+3);break;case'amplify':p.amp=true;p.domain=0;break;case'buff':p.buff=1;break;case'release':p.released=true;break;case'takada':p.takada=true;break;case'domain':p.domain=vowDuration(p);p.domainKind=a.sourceId||p.id;p.domainTechnique=a.domainTechnique||null;if(domainKind(p)==='hakari'){const roll=1+Math.floor(rng()*6);log.push(`坐殺博徒：サイコロ ${roll}。${roll===6?'大当たり！次の3ターン無敵。':'大当たりならず。'}`);if(roll===6)p.inv=3;}break;}
}
// Simultaneous expansion suppresses sure-hit until one side attacks.
const opened=moves.map((a,i)=>a.type==='domain'&&!canceled[i]);
// Resolve the explicit domain hierarchy before either side attacks.
const activeDomains=ps.map((p,i)=>!old[i].confiscated&&!p.amp&&(p.domain>0||old[i].domain>0));
const ranks=ps.map(p=>domainKind(p)==='higuruma'?2:domainKind(p)==='megumi'?0:1);
const priorityClash=activeDomains.every(Boolean)&&(opened.some(Boolean)||state.clash)&&ranks[0]!==ranks[1];
if(priorityClash){
 const winner=ranks[0]>ranks[1]?0:1,loser=1-winner;
 s.clash=false;ps[winner].domain=vowDuration(ps[winner]);ps[loser].domain=0;broken[loser]=true;priorityLost[loser]=true;clashWon[winner]=true;
 if(domainKind(ps[loser])==='hakari')ps[loser].inv=0;
 log.push(`${char(ps[winner].id).name}が技の前に領域の押し合いに勝利。${domainKind(ps[winner])==='higuruma'?'日車の領域は最優先で勝つ。':'伏黒の領域は他の領域に押し負ける。'}敗者の領域効果はこのターンから消滅。`);
}else if(opened.every(Boolean)){
 s.clash=true;log.push('領域の押し合いが発生！ 必中効果は停止。先に攻撃した側が勝利、同時攻撃なら両方崩壊。');
}else if(state.clash){
 const attacks=moves.map((a,i)=>a.type==='attack'&&!canceled[i]);
 if(attacks.every(Boolean)){
  s.clash=false;for(let i=0;i<2;i++){ps[i].domain=0;broken[i]=true;}
  log.push('押し合い中に同時攻撃！ 両方の領域が崩壊し、このターンの必中効果はなし。');
 }else if(attacks.some(Boolean)||ps.some(p=>!p.domain)){
  const winner=attacks.some(Boolean)?attacks.indexOf(true):ps.findIndex(p=>p.domain>0);
  s.clash=false;
  for(let i=0;i<2;i++){ps[i].domain=i===winner?vowDuration(ps[i]):0;broken[i]=i!==winner;}
  if(winner>=0){clashWon[winner]=true;log.push(`${char(ps[winner].id).name}が領域の押し合いに勝利！ このターンを含め${ps[winner].domain+1}ターン必中効果。`);}
 }else log.push('領域の押し合い継続。必中効果は停止中。');
}
// The nonviolent trial cannot be erased by defensive skills or strong attacks.
const judge=ps.findIndex((p,i)=>!s.clash&&!canceled[i]&&!broken[i]&&p.domain>0&&domainKind(p)==='higuruma'&&(opened[i]||clashWon[i]));
if(judge>=0&&!moves.some(a=>a.execution)){
 s.court={judge,defendant:1-judge};ps[judge].domain=1;
 const record=caseFor(ps[1-judge].id);
 log.push(`誅伏賜死：${char(ps[1-judge].id).name}を「${record.charge}」で審理。証拠は${char(ps[judge].id).name}へ提出。`, '裁判開始。このターンの攻撃は停止。簡易領域・彌虚葛籠・落花の情・強攻撃では壊せない。');
 for(let i=0;i<2;i++)recordMove(ps[i],moves[i],canceled[i]);
 s.turn++;return {s,log,moves,damage:[0,0],courtOpened:true};
}
// Break domains before domain effects; defense is effective this turn only.
for(let i=0;i<2;i++){const a=moves[i],j=1-i;if(canceled[i])continue;if(a.type==='simple'&&(old[j].domain>0||ps[j].domain>0)){
 ps[j].domain=0;broken[j]=true;clashWon[j]=false;
 if(opened[j])ps[j].inv=Math.max(0,old[j].inv-1);
 log.push('簡易領域が相手の領域を消滅させた！');
}if(!state.clash&&a.type==='attack'&&!hasAdapted(old[j],a)&&(attackTier(a)>=4||a.breaks)&&(old[j].domain>0||ps[j].domain>0)){ps[j].domain=0;broken[j]=true;log.push('強攻撃が領域を破壊！');if(old[j].domain>0&&domainKind(ps[j])==='gojo'&&!hasAdapted(old[i],domainAttack(ps[j])))ps[i].stun=Math.max(ps[i].stun,3);}}
for(let i=0;i<2;i++){const j=1-i;if(old[i].vow==='open'&&!canceled[j]&&moves[j].type==='dodge'&&(old[i].domain>0||ps[i].domain>0)){ps[i].domain=0;broken[i]=true;priorityLost[i]=true;clashWon[i]=false;log.push('閉じない領域の逃げ道：回避技で離脱され、領域が消滅。');}}
// These two defenses erase an opposing domain, including an ongoing domain or clash winner.
for(let i=0;i<2;i++){
 const j=1-i,a=moves[i];
 if(!canceled[i]&&['basket','falling'].includes(a.type)&&(old[j].domain>0||ps[j].domain>0)){
  ps[j].domain=0;broken[j]=true;clashWon[j]=false;
  if(domainKind(ps[j])==='hakari')ps[j].inv=0;
  log.push(`${a.n}が相手の領域を無効化し、消滅させた！`);
 }
}
if(s.clash&&ps.some(p=>p.domain===0)){s.clash=false;log.push('領域の無効化により押し合いが終了。');}
const automaticTechniques=ps.map((p,i)=>domainTechniqueSetup(p,
 !broken[i]&&!old[i].confiscated&&!s.clash&&!p.amp&&
 ((opened[i]&&p.domain>0)||clashWon[i]||(!state.clash&&old[i].domain>0)),log));
const domainHits=[false,false];
const damage=[...chargeDamage],direct=[0,0];
for(let i=0;i<2;i++){if(canceled[i])continue;const p=ps[i],j=1-i,o=ps[j],a=moves[i],b=canceled[j]?{type:'wait'}:moves[j];let d=a.d||0;if(a.boundary&&!['sukuna','meguna','geto','ryu','uro','kashimo','reggie'].includes(old[j].id)){log.push('魂の境界への解：この相手はゲーム内の受肉対象ではないため効果なし。');continue;}
if(a.execution){executionFatal[j]=true;continue;}
if(a.id==='punch'&&p.id==='yuji'){p.punch++;if(p.punch===4){d=99;log.push('4回目の通常パンチ――黒閃！ 消費1・4チャージ攻撃扱い。');}}
if(a.id==='ratio'){p.punch++;if(p.punch%5===0)d=5;}
if(a.type==='attack'&&d>0&&d<99){const bonus=vowAttackBonus(state,old[i],a);d=Math.max(0,d+bonus);if(bonus)log.push(`${char(p.id).name}の縛り：攻撃${bonus>0?'＋':''}${bonus}。`);}
advancePurple(p,a,log);spendBlackFlash(p,a);
if(a.onCharge&&b.type!=='charge')d=0;if(a.stance)p.stance=true;
if(a.type==='attack'&&old[i].moonBonus){if(d>0)d+=old[i].moonBonus;p.moonBonus=0;log.push(`${char(p.id).name}の夕月：この攻撃だけ＋2ダメージ。`);}
let blocked=blockedBy(a,b,old[j])||(automaticTechniques[j]&&blockedBy(a,automaticTechniques[j],old[j]));
const domainActive=!old[i].confiscated&&!s.clash&&(clashWon[i]||(!state.clash&&old[i].domain>0))&&!broken[i]&&!p.amp&&!hasAdapted(old[j],domainAttack(p));
const domainBlocked=['simple','basket','falling'].includes(b.type)||(old[j].inv>0&&!old[j].confiscated);
if(domainActive&&!['hakari','megumi'].includes(domainKind(p))){
if(domainKind(p)==='jogo'){if(!domainBlocked){damage[j]+=4;domainHits[j]=true;}}
else if(lethalDomain(domainKind(p))||domainKind(p)==='yuta'){/* Guaranteed kill is resolved independently below. */}
else if(a.type==='attack'&&d>0&&a.id!=='die'){if(domainBlocked)blocked=true;else {d=99;blocked=false;domainHits[j]=true;}}
}
// Learned immunity outranks domain sure-hit and prevents all attached effects.
if(hasAdapted(old[j],a))blocked=true;
if(a.type==='attack'&&!blocked){if(d>0){d+=p.id==='blood'&&a.id!=='basicPunch'?1:(a.bloodBonus||0);d+=(old[i].confiscated?0:p.buff)+(p.amp?1:0)+(!old[i].confiscated&&p.honored?3:0)+(p.id==='nanami'&&state.turn>10?1:0);d=Math.max(0,d-(o.amp?1:0));if((old[j].stance||b.type==='stance')&&attackTier(a)<=2&&!(domainActive&&!['hakari','megumi','yuta'].includes(domainKind(p)))){d=0;log.push(`${char(o.id).name}が夕月で2チャージ以下の攻撃ダメージを無効化。`);}direct[j]+=d;}if(a.stun)o.stun=Math.max(o.stun,a.stun);if(a.drain)o.e=Math.max(0,o.e-a.drain);if(a.seed)o.seed=true;}
if(a.type==='attack'&&blocked)log.push(`${char(o.id).name}が「${a.n}」を${hasAdapted(old[j],a)?'適応で無効にした':'防いだ'}。`);
}
// Sweep offsets simultaneous attack damage; periodic domain/seed damage is separate.
const sweeps=moves.map((a,i)=>a.sweep&&!canceled[i]);
if(sweeps.some(Boolean)&&moves.every((a,i)=>a.type==='attack'&&!canceled[i])){
 const i=sweeps.indexOf(true),j=1-i;
 // A blocked sweep contributes no power. Both sweeps resolve together once.
 const balance=direct[i]-direct[j];
 direct[i]=Math.max(0,balance);direct[j]=Math.max(0,-balance);
 log.push(`呪力薙ぎ払いで攻撃を相殺：${char(ps[i].id).name}に${direct[i]}、${char(ps[j].id).name}に${direct[j]}ダメージ。`);
}
for(let i=0;i<2;i++)damage[i]+=direct[i];
// Ongoing lethal domains apply even if their owner cannot act. Only domain defense saves the target.
for(let i=0;i<2;i++){
const j=1-i,b=canceled[j]?{type:'wait'}:moves[j];
const opening=opened[i]&&!broken[i]&&ps[i].domain>0;
const activating=opening||clashWon[i];
// Mahito retains the normal next-turn start; an immediate clash win starts sure-hit now.
const lethalKind=domainKind(activating?ps[i]:old[i]);
const lethalActive=(!state.clash&&old[i].domain>0)||clashWon[i]||(opening&&lethalKind!=='mahito');
if(lethalKind==='yuta'&&lethalActive&&!broken[i]&&!old[i].confiscated&&!s.clash&&!ps[i].amp){
 const hit=domainTechniqueHit(ps[i],ps[j],old[j],b,log);
 damage[j]+=hit;
 if(hit)domainHits[j]=true;
}
if(!priorityLost[i]&&!(lethalKind==='mahito'&&broken[i])&&!old[i].confiscated&&!s.clash&&lethalActive&&!hasAdapted(old[j],domainAttack(activating?ps[i]:old[i]))&&lethalDomain(lethalKind)&&!ps[i].amp&&!['simple','basket','falling'].includes(b.type)){
if(activating&&lethalKind!=='mahito')damage[j]+=10;fatal[j]=true;log.push(`${char(old[i].id).name}の領域が命中――${activating&&lethalKind!=='mahito'?'必中開始ターンに10ダメージ':'確定即死'}（反転術式で復活不可）。`);
}}
for(let i=0;i<2;i++){
// Successful adaptation nullifies this turn's damage before either HP pool is touched.
if((moves[i].type==='adapt'&&!canceled[i]||automaticTechniques[i]?.type==='adapt')&&(damage[i]>0||fatal[i])){
 log.push(`${char(ps[i].id).name}は適応でこのターンの${damage[i]}ダメージ${fatal[i]?'と領域の即死効果':''}を無効化（本体・魔虚羅ともHP減少なし）。`);
 damage[i]=0;fatal[i]=false;
}
if(damage[i]>0&&!fatal[i]&&!executionFatal[i]){let reduction=0;if(old[i].vow==='hardbody')reduction=1;if(old[i].vow==='compression')reduction=moves[i].type==='attack'&&!canceled[i]?2:-1;if(old[i].vow==='arm'&&!old[i].vowUsed){reduction=5;ps[i].vowUsed=true;ps[i].vowArm=true;log.push('左腕を代償に通常ダメージを5軽減。反転で治療するまで領域不可。');}if(reduction){damage[i]=Math.max(0,damage[i]-reduction);log.push(`縛りによる被ダメージ補正：${reduction>0?'−':'＋'}${Math.abs(reduction)}。`);}}
// The companion absorbs damage up to its remaining HP, including on its summon turn.
damage[i]=absorbCompanions(ps[i],damage[i],fatal[i],old[i].confiscated,log);
if(!old[i].bossForm&&chargeGains[i]>0&&(damage[i]>0||fatal[i])){ps[i].e=Math.max(0,ps[i].e-chargeGains[i]);log.push(`${char(ps[i].id).name}は被ダメージでチャージ無効（＋${chargeGains[i]}を取り消し）。`);}
const hpAfterDamage=ps[i].hp-damage[i];
ps[i].hp=fatal[i]?0:Math.max(0,hpAfterDamage);
if(damage[i])log.push(`${char(ps[i].id).name}に ${Math.min(damage[i],99)} ダメージ。`);
if(moves[i].type==='reverse'&&!canceled[i]){
if(executionFatal[i])log.push(`${char(ps[i].id).name}の反転術式では、処刑人の剣の即死を覆せない。`);
else if(fatal[i])log.push(`${char(ps[i].id).name}の反転術式では、この領域の即死を覆せない。`);
else{const healed=moves[i].healAmount??moves[i].c*2,net=hpAfterDamage+healed;ps[i].hp=Math.max(0,Math.min(ps[i].maxHp||10,net));log.push(`${char(ps[i].id).name}の反転術式：HP ${old[i].hp} − ${damage[i]}ダメージ ＋ ${healed}回復 ＝ ${net}。${net>0?`HP ${ps[i].hp}で生存`:'回復してもHP0以下のため死亡'}（${moves[i].c}チャージ消費）。`);}
}}
for(let i=0;i<2;i++)if(old[i].vow==='trueLove'&&moves[i].id==='love'&&!canceled[i]){ps[i].hp=0;log.push('命を懸けた純愛の代償：発射ターン末に自身も死亡（ゲーム用再現）。');}
for(let i=0;i<2;i++)if(executionFatal[i]){ps[i].hp=0;log.push(`${char(ps[i].id).name}に処刑人の剣が命中。防御・相殺・反転・適応・魔虚羅を無視して即死。`);}
for(let i=0;i<2;i++)awakenStudent(ps[i],fatal[i]||domainHits[i],log);
// Learn the selected technique after resolution; immediate damage immunity was applied above.
for(let i=0;i<2;i++)if((moves[i].type==='adapt'&&!canceled[i]||automaticTechniques[i]?.type==='adapt')){
 const incoming=moves[1-i];
 if(!canceled[1-i]&&['attack','domain'].includes(incoming.type)){
  const key=techniqueKey(incoming),name=incoming.baseName||incoming.n;
  if(!hasAdapted(ps[i],incoming)){ps[i].adapted.push({key,name});ps[i].adapted.sort((a,b)=>a.key.localeCompare(b.key));}
  log.push(`${char(ps[i].id).name}が「${name}」に適応。次ターン以降は無効（魔虚羅が倒れても持続）。`);
 }else log.push(`${char(ps[i].id).name}の適応：相手が攻撃・領域を使わなかったため、習得なし。`);
}
for(let i=0;i<2;i++){recordMove(ps[i],moves[i],canceled[i]);}
s.turn++;return {s,log,moves,damage};}
export function value(s,i){
const p=s.p[i],o=s.p[1-i];if(p.hp<=0&&o.hp<=0)return 0;if(p.hp<=0)return -1000;if(o.hp<=0)return 1000;
const score=x=>(x.mahoragaHp+(x.agitoHp||0))*7+(x.honored?12:0)+x.adapted.length*6+x.hp*9+x.e*2.8+x.rika*1.7+(x.id==='hakari'||s.clash?0:x.domain*4)-x.stun*8+Math.min(x.soul,3)*2+(x.focus?7:0)+(x.takada?9:0)+(x.stance?5:0)+(x.moonBonus||0)*2+x.inv*8+(x.blue?3:0)+(x.red?3:0)+(x.purpleReady?10:0)+x.buff*3+(x.amp?3:0)+(x.released?4:0)-(x.seed?5:0)+(x.id==='yuji'?Math.min(x.punch,3)*2:0);
return score(p)-score(o);
}
// Enumerate independent jackpot/miss branches, including simultaneous Hakari domains.
export function outcomes(s,a,b){
if(s.court){const m=[a,b][s.court.defendant],probabilities=courtDistribution(caseFor(s.p[s.court.defendant].id).severity,m.id);let cumulative=0;const branches=[];
for(const prob of probabilities){if(prob>0){const roll=cumulative+prob/2;branches.push({s:resolve(s,a,b,()=>roll).s,prob});}cumulative+=prob;}return branches;}

const count=[a,b].map((m,i)=>copiedMove(s,i,m)).filter((m,i)=>m.type==='domain'&&m.sourceId==='hakari'&&!s.p[i].stun).length;
if(!count)return [{s:resolve(s,a,b,()=>0).s,prob:1}];
const out=[];
for(let bits=0;bits<(1<<count);bits++){let cursor=0,prob=1;const rolls=[];for(let i=0;i<count;i++){const hit=!!(bits&(1<<i));prob*=hit?1/6:5/6;rolls.push(hit?.99:0);}out.push({s:resolve(s,a,b,()=>rolls[cursor++]).s,prob});}return out;
}
// Solve a simultaneous-turn payoff matrix with averaged best responses.
export function solveMatrix(matrix,iterations=100){
const nr=matrix.length,nc=matrix[0].length,rows=Array(nr).fill(.1),cols=Array(nc).fill(.1);
for(let k=0;k<iterations;k++){
let best=-Infinity,ri=0,worst=Infinity,ci=0;
for(let r=0;r<nr;r++){let v=0;for(let c=0;c<nc;c++)v+=matrix[r][c]*cols[c];if(v>best){best=v;ri=r;}}
for(let c=0;c<nc;c++){let v=0;for(let r=0;r<nr;r++)v+=matrix[r][c]*rows[r];if(v<worst){worst=v;ci=c;}}
rows[ri]++;cols[ci]++;
}
const rt=rows.reduce((a,b)=>a+b),ct=cols.reduce((a,b)=>a+b),p=rows.map(x=>x/rt),q=cols.map(x=>x/ct);let score=0;for(let r=0;r<nr;r++)for(let c=0;c<nc;c++)score+=p[r]*q[c]*matrix[r][c];return {p,q,score};
}
function strategicValue(s){
if(s.p.some(x=>x.hp<=0))return value(s,1);
const score=(p,o)=>{
let v=(p.vow==='lastStrike'&&!p.vowUsed?18:0)+(p.vow==='arm'&&!p.vowUsed?15:0)+(p.executioner?180:0)-(p.confiscated||0)*18+p.hp*7+Math.min(p.e,6)*10+Math.max(0,Math.min(p.e-6,4))*4;
v+=p.rika*4-Math.min(p.cool,3)+Math.min(p.soul,3)*5+p.inv*15-p.stun*22;
v+=(p.focus?16:0)+(p.takada?23:0)+(p.stance?(char(o.id).moves.some(a=>a.type==='attack'&&a.c<=2&&a.d>0)?28:6):0)+(p.moonBonus||0)*4+(p.amp?9:0)+p.buff*6+(p.released?12:0)-(p.seed?9:0);
v+=(p.agitoHp||0)*8+(p.honored?12:0)+p.mahoragaHp*8+(p.mahoragaHp?5:0);
const threats=[...char(o.id).moves.map(a=>prepareMove(a,o)),domainAttack(o)];
v+=Math.min(50,p.adapted.reduce((sum,learned)=>sum+(threats.some(a=>techniqueKey(a)===learned.key)?(learned.key.startsWith('domain:')?24:10):0),0));
v+=(p.blue?8:0)+(p.red?8:0)+(p.purpleReady?27:0);
if(p.id==='yuji')v+=p.punch<4?[0,6,16,34][p.punch]:0;
if(p.domain&&!s.clash&&p.id!=='hakari')v+=p.domain*(lethalDomain(domainKind(p))?24:domainKind(p)==='megumi'?7:10);
// Losing access to an affordable defense is worse against a prepared attack.
if(o.e>=3&&p.e===0)v-=8;
return v;
};return score(s.p[1],s.p[0])-score(s.p[0],s.p[1]);
}
function opponentPrior(s,enemy,history){
const matches=history.slice(-24).filter(h=>typeof h==='string'||(Math.min(3,h.ownEnergy)===Math.min(3,s.p[0].e)&&Math.min(3,h.enemyEnergy)===Math.min(3,s.p[1].e)));
const weights=enemy.map(a=>.5+matches.filter(h=>(typeof h==='string'?h:h.id)===a.id).length),sum=weights.reduce((a,b)=>a+b,0);return {p:weights.map(x=>x/sum),strength:Math.min(.3,matches.length*.035)};
}
// Courtroom choices deliberately trade some optimality for varied responses.
// Half-ish of the policy follows utility; each of the three pleas keeps >=15%.
export function courtPolicy(scores){
 const best=Math.max(...scores),weights=scores.map(v=>Math.exp((v-best)/120)),sum=weights.reduce((a,b)=>a+b,0);
 return weights.map(w=>.45/scores.length+.55*w/sum);
}
// Healing above this conservative incoming-damage bound cannot change HP, only waste energy.
// Prune those dominated AI choices so very large energy pools cannot exhaust the budget before depth 1.
function aiChoices(s){
 const legal=[0,1].map(i=>actions(s,i).filter(a=>!a.disabled));
 return legal.map((list,i)=>{const p=s.p[i],op=s.p[1-i];
  const maximum=Math.max(10,...legal[1-i].map(a=>{const m=copiedMove(s,1-i,a);return (m.d||0)+(m.bloodBonus||0)+Math.max(0,vowAttackBonus(s,op,m));}))+(op.moonBonus||0)+(op.buff||0)+(op.honored?3:0)+(op.domain>0&&op.domainTechnique?.type==='attack'?(op.domainTechnique.d||0)+(op.domainTechnique.bloodBonus||0)+1:0)+(op.amp?1:0)+(op.id==='blood'?1:0)+(op.id==='nanami'&&s.turn>10?1:0)+7;
  const useful=Math.max(1,Math.ceil(((p.maxHp||10)-p.hp+maximum)/2));
  return list.filter(a=>a.type!=='reverse'||a.c<=useful);
 });
}
// Iterative deepening with canonical transpositions and a bounded work budget.
// Only public state and previously completed actions enter this function.
export function chooseAI(s,history=[],rng=Math.random){
const [enemy,own]=aiChoices(s),memo=new Map(),transitions=new Map();let nodes=0,depthDone=1;
if(s.court&&own.length===1)return {move:own[0],score:0,candidates:[{name:own[0].n,score:0,probability:100}],depth:0,nodes:0,reason:'裁判の陳述・判決を待ちます（戦闘ターンは進みません）。'};
const budget=60000,exhausted=Symbol('budget');
// Move descriptions/disabled UI fields are not game state. A previous move only
// matters when the opponent can copy it; the turn only matters for Nanami's bonus.
const stateKey=n=>JSON.stringify({court:n.court||null,turn:Math.min(n.turn,11),clash:n.clash,p:n.p.map((p,i)=>({...p,lastMove:null,lastTechnique:n.p[1-i].id==='yuta'?copyTarget(p):null,techniqueHistory:n.p[1-i].id==='yuta'?p.techniqueHistory:null}))});
function children(n,b,a){const key=stateKey(n)+'/'+b.id+'/'+a.id;if(transitions.has(key))return transitions.get(key);if(++nodes>budget)throw exhausted;const result=outcomes(n,b,a);transitions.set(key,result);return result;}
function continuation(n,depth){if(n.p.some(p=>p.hp<=0))return value(n,1);if(!depth)return strategicValue(n);const key=depth+stateKey(n);if(memo.has(key))return memo.get(key);
const [bb,aa]=aiChoices(n);
const matrix=aa.map(a=>bb.map(b=>children(n,b,a).reduce((v,o)=>v+o.prob*continuation(o.s,depth-1)*.98,0)));
const v=solveMatrix(matrix,60).score;memo.set(key,v);return v;}
let matrix;
for(let depth=1;depth<=4;depth++){
try{const complete=own.map(a=>enemy.map(b=>children(s,b,a).reduce((v,o)=>v+o.prob*continuation(o.s,depth-1),0)));matrix=complete;depthDone=depth;}catch(e){if(e!==exhausted)throw e;break;}}
const prior=opponentPrior(s,enemy,history);const adjusted=matrix.map(row=>{const expected=row.reduce((v,x,i)=>v+x*prior.p[i],0);return row.map(x=>x*(1-prior.strength)+expected*prior.strength);});
const solved=solveMatrix(adjusted,1000);
// Strictly dominated moves and guaranteed losing moves get no exploration weight.
let probs=solved.p.map((p,i)=>own.some((_,j)=>j!==i&&matrix[j].every((x,k)=>x>=matrix[i][k]-1e-8)&&matrix[j].some((x,k)=>x>matrix[i][k]+1e-8))?0:p);
const floors=matrix.map(row=>Math.min(...row)),topFloor=Math.max(...floors);
// Never sample an unavoidable loss if another action guarantees survival/draw.
if(topFloor>=0)probs=probs.map((p,i)=>Math.max(...matrix[i]) < -900?0:p);const win=topFloor>900?floors.indexOf(topFloor):-1;if(win>=0)probs=probs.map((_,i)=>i===win?1:0);
if(s.court)probs=courtPolicy(matrix.map(row=>row.reduce((sum,v,k)=>sum+v*solved.q[k],0)));
let total=probs.reduce((a,b)=>a+b,0);if(total===0){probs=solved.p;total=1;}probs=probs.map(p=>p/total);
let draw=rng(),chosen=probs.length-1;for(let i=0;i<probs.length;i++){draw-=probs[i];if(draw<0){chosen=i;break;}}
const candidates=own.map((move,i)=>({name:move.n,score:Math.round(matrix[i].reduce((v,x,k)=>v+x*solved.q[k],0)*10)/10,probability:Math.round(probs[i]*100)})).sort((a,b)=>b.probability-a.probability);
return {move:own[chosen],score:matrix[chosen].reduce((v,x,k)=>v+x*solved.q[k],0),candidates,depth:depthDone,nodes,reason:`${s.court?'否認は無罪20%・死刑80%、黙秘は無罪10%・没収50%・死刑40%、自白は没収60%・死刑40%として期待値を比較。':''}${depthDone}手先まで、相手の全${enemy.length}候補と反撃を比較。${prior.strength>0?'過去の同じ状況での癖も考慮。':''}${s.court?'裁判では有利さを考慮しながら、各返答を最低15%の確率で選びます。':win>=0?'どの手に対しても勝てる手を選択。':'読み切られないよう有利な手の配分も計算。'}${own[chosen].type==='reverse'?'反転後に生き残れるHPまで計算。':''}`};
}

// Shared primitives let the 3-v-1 mode use the same technique, defense and vow rules.
export function restoreTechniqueHistory(state){
 for(const player of state.p){
  const known=copyTarget(player);
  player.lastTechnique=known;
  player.techniqueHistory=known?[known]:[];
 }
}
export const battleInternals={utility,prepareMove,focusedAttack,attackTier,domainKind,domainAttack,hasAdapted,copyTarget,copiedMove,domainPrice,blockedBy,resolveCourt,recordMove,awakenStudent,mustUsePurple,forcedPurple,advancePurple,forcedBlackFlash,spendBlackFlash,absorbCompanions,lethalDomain,domainTechniqueHit,domainTechniqueSetup,summonCompanion};
