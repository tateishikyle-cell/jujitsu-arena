import {start} from './engine.js';
// Each new pairing starts with fresh effects and zero energy; a surviving teammate keeps HP.
export function startTeam(teams){
 if(teams.length!==2||teams.some(t=>t.length!==3||new Set(t.map(p=>p.id)).size!==3))throw Error('各チームに異なる3キャラを選んでください');
 return {teams:structuredClone(teams),index:[0,0],state:start(teams[0][0].id,teams[1][0].id,teams.map(t=>t[0].vow)),finished:false,winner:null};
}
export function advanceTeam(match,state){
 const next=structuredClone(match);next.state=state;
 if(state.p.every(p=>p.hp>0))return next;
 const dead=state.p.map(p=>p.hp<=0);dead.forEach((d,i)=>{if(d)next.index[i]++;});
 const gone=next.index.map(i=>i>=3);
 if(gone.some(Boolean)){next.finished=true;next.winner=gone.every(Boolean)?-1:gone[0]?1:0;return next;}
 const pair=next.teams.map((t,i)=>t[next.index[i]]);
 next.state=start(pair[0].id,pair[1].id,pair.map(p=>p.vow));
 dead.forEach((d,i)=>{
  if(d)return;
  const fighter=state.p[i],replacement=next.state.p[i];
  replacement.hp=fighter.hp;
  if(fighter.id==='todo')Object.assign(replacement,{takada:fighter.takada,blackUsed:fighter.blackUsed});
  if(fighter.awakened)Object.assign(replacement,{awakened:true,maxHp:fighter.maxHp,honored:fighter.honored});
 });
 return next;
}
export function makeBracket(entrants){
 if(![4,8,16].includes(entrants.length))throw Error('4・8・16人から選んでください');
 return {round:1,entrants:structuredClone(entrants),cursor:0,winners:[],results:[],champion:null};
}
export function finishBout(bracket,state,rng=Math.random){
 const b=structuredClone(bracket),[a,c]=state.p;
 let winner,reason='KO';
 if((a.hp<=0&&c.hp<=0)||(a.hp>0&&c.hp>0)){
  // Bounded bouts keep a defensive mirror match from blocking the entire bracket.
  reason='規定100ターン／同時KO：HP → 呪力 → 抽選';
  winner=a.hp!==c.hp?(a.hp>c.hp?0:1):a.e!==c.e?(a.e>c.e?0:1):(rng()<.5?0:1);
 }else winner=a.hp>0?0:1;
 const pair=b.entrants.slice(b.cursor,b.cursor+2),victor=pair[winner];
 b.results.push({round:b.round,pair,winner:victor,reason});b.winners.push(victor);b.cursor+=2;
 if(b.cursor===b.entrants.length){if(b.winners.length===1)b.champion=victor;else{b.entrants=b.winners;b.winners=[];b.cursor=0;b.round++;}}
 return b;
}
