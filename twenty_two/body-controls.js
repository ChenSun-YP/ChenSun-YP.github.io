// Per-voice background Chimera render. No oscillator/pitch-shift fallback.
export function createBodyControls({getInputs,apply,status}){
 const jobs=new Map();let scorePromise,dictionaryPromise;
 const change=async function(id,body){
  if(!['lead','harmony1','harmony2','bass'].includes(id)||!body||![body.female,body.child].every(v=>Number.isFinite(v)&&v>=0&&v<=1))return;
  jobs.get(id)?.terminate();const worker=new Worker(new URL('./body-worker.js',import.meta.url),{type:'module'});jobs.set(id,worker);
  const send=(state,message)=>status({id,body,state,message});send('working','准备合成…');
  try{
   const inputs=getInputs();if(!inputs)throw Error('音轨载入中，请稍后调整');
   scorePromise??=fetch('assets/performance/body-scores.json').then(r=>{if(!r.ok)throw Error('Score load failed');return r.json();}).catch(e=>{scorePromise=null;throw e;});
   dictionaryPromise??=fetch('native/data/cmudict.txt.gz').then(async r=>{if(!r.ok)throw Error('Dictionary load failed');return new Response(r.body.pipeThrough(new DecompressionStream('gzip'))).text();}).catch(e=>{dictionaryPromise=null;throw e;});
   const [score,dictionary]=await Promise.all([scorePromise,dictionaryPromise]);if(jobs.get(id)!==worker)return;
   worker.onmessage=({data})=>{if(jobs.get(id)!==worker)return;if(data.type==='progress')send('working',`合成 ${Math.round(data.progress*100)}%`);else if(data.type==='done'){try{apply(data);send('done','已应用');}catch(e){send('error',e.message);}finally{worker.terminate();jobs.delete(id);}}else if(data.type==='error'){send('error',data.message);worker.terminate();jobs.delete(id);}};
   worker.onerror=e=>{if(jobs.get(id)!==worker)return;send('error',e.message||'合成失败，请重试');worker.terminate();jobs.delete(id);};
   worker.postMessage({...inputs,score,dictionary,id,body});
  }catch(e){if(jobs.get(id)===worker){send('error',e.message);worker.terminate();jobs.delete(id);}}
 };
 change.cancel=id=>{jobs.get(id)?.terminate();jobs.delete(id);};
 return change;
}
