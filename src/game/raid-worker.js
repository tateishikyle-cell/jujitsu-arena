import {planRaid} from './raid-engine.js';
self.onmessage=({data})=>{try{self.postMessage({id:data.id,plan:planRaid(data.state,data.control)});}catch(e){self.postMessage({id:data.id,error:String(e)});}};
