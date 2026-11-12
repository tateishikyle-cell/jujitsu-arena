import {chooseAI} from './engine.js';
import {planMatch} from './match-ai.js';
self.onmessage=({data})=>{try{self.postMessage({id:data.id,plan:data.mode==='watch'?planMatch(data.state,data.histories):chooseAI(data.state,data.history)});}catch(e){self.postMessage({id:data.id,error:String(e)});}};
