import {chooseAI,mirrorState} from './engine.js';
// Each AI sees itself in seat 1; histories describe only its opponent's completed turns.
export function planMatch(state,histories=[[],[]],rng=Math.random){
 const mirrored=mirrorState(state);
 return [chooseAI(mirrored,histories[0],rng),chooseAI(state,histories[1],rng)];
}
export function observeTurn(state,moves,histories){
 return histories.map((history,i)=>[...history,{id:moves[1-i].id,ownEnergy:state.p[1-i].e,enemyEnergy:state.p[i].e}].slice(-24));
}
