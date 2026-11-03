import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const children=[];
for(const [port,script] of [[5173,'../node_modules/vite/bin/vite.js'],[5174,'./studio.mjs']]){
 let running=false;
 try{running=(await fetch(`http://127.0.0.1:${port}`)).ok;}catch{}
 if(!running){const child=spawn(process.execPath,[fileURLToPath(new URL(script,import.meta.url))],{stdio:'inherit'});children.push(child);child.on('error',console.error);}
}
console.log('Edit content: http://127.0.0.1:5174 | Website: http://127.0.0.1:5173');
const close=()=>{for(const child of children)child.kill();process.exit();};
process.on('SIGINT',close);process.on('SIGTERM',close);
if(children.length)process.stdin.resume();
