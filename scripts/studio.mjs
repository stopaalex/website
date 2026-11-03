import http from 'node:http';
import {readFile,writeFile,rename,readdir,realpath,mkdir} from 'node:fs/promises';
import {resolve,sep,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomBytes,createHash} from 'node:crypto';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const run=promisify(execFile),projectRoot=fileURLToPath(new URL('../',import.meta.url));
const digest=text=>createHash('sha256').update(text).digest('hex');
export function validateContent(value,template,path='content'){
 if(Array.isArray(template)){if(!Array.isArray(value)||!value.length)throw Error(`${path}: keep at least one entry.`);value.forEach((v,i)=>validateContent(v,template[0],`${path}[${i}]`));}
 else if(template&&typeof template==='object'){if(!value||Array.isArray(value)||Object.keys(value).sort().join()!==Object.keys(template).sort().join())throw Error(`${path}: keep the existing fields.`);for(const key of Object.keys(template))validateContent(value[key],template[key],`${path}.${key}`);}
 else if(typeof value!=='string'||!value.trim())throw Error(`${path}: enter some text.`);
}
export function validateSite(data,template){
 validateContent(data,template);
 if(data.hero.headline.length!==3)throw Error('Hero headline needs exactly three parts.');
 for(const [key,color] of Object.entries(data.theme))if(!/^#[a-f0-9]{6}$/i.test(color))throw Error(`Theme ${key}: use a six-digit hex color.`);
 const ids=data.projects.map(p=>p.id);if(new Set(ids).size!==ids.length||ids.some(id=>!/^[a-z0-9-]+$/.test(id)))throw Error('Project IDs must be unique lowercase slugs.');
 for(const url of [data.profile.linkedin,data.profile.github,...data.projects.flatMap(p=>[p.source,p.liveUrl])]){try{if(new URL(url).protocol!=='https:')throw Error();}catch{throw Error('External links must be valid HTTPS URLs.');}}
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.profile.email))throw Error('Enter a valid email address.');
 for(const p of data.projects)for(const item of p.media){if(!['app','web'].includes(item.kind)||!['pending','captured'].includes(item.status))throw Error('Media type or status is invalid.');}
 const paths=[data.profile.resume,...data.projects.flatMap(p=>[p.image,p.previewImage,...p.media.filter(m=>m.status==='captured').map(m=>m.image)])];
 for(const asset of paths)if(!/^\/(?!\/)[a-zA-Z0-9_./-]+$/.test(asset)||asset.includes('..'))throw Error('Asset paths must refer to local public files.');
 return paths;
}
async function body(req,limit){let size=0;const chunks=[];for await(const chunk of req){size+=chunk.length;if(size>limit){const e=Error('File is too large. Maximum upload is 10 MB.');e.status=413;throw e;}chunks.push(chunk);}return Buffer.concat(chunks);}
export async function createStudioServer({root=projectRoot}={}){
 const contentPath=resolve(root,'content/site.json'),publicDir=resolve(root,'public');
 const template=JSON.parse((await readFile(contentPath,'utf8')).replace(/^\uFEFF/,'')),token=randomBytes(24).toString('hex');let busy=false;
 const snapshot=async()=>{const raw=await readFile(contentPath,'utf8');return {content:JSON.parse(raw.replace(/^\uFEFF/,'')),revision:digest(raw)};};
 async function safeAsset(asset){const file=await realpath(resolve(publicDir,'.'+asset));if(!file.startsWith(publicDir+sep))throw Error('Asset must stay in public/.');return file;}
 const server=http.createServer(async(req,res)=>{
  const origin=`http://127.0.0.1:${server.address().port}`;
  const send=(status,data,type='application/json')=>{res.writeHead(status,{'Content-Type':type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(Buffer.isBuffer(data)||typeof data==='string'?data:JSON.stringify(data));};
  try{
   if(req.headers.host!==new URL(origin).host)return send(403,{error:'Open the editor using its 127.0.0.1 address.'});
   const url=new URL(req.url,origin);
   if(req.method==='GET'&&url.pathname==='/'){
    res.setHeader('Content-Security-Policy',"default-src 'self'; style-src 'self'; script-src 'self'; img-src 'self' blob:; frame-src http://127.0.0.1:5173; frame-ancestors 'none'; base-uri 'none'");
    return send(200,(await readFile(resolve(root,'studio/index.html'),'utf8')).replace('__TOKEN__',token),'text/html; charset=utf-8');
   }
   if(req.method==='GET'&&['/studio.js','/studio.css'].includes(url.pathname))return send(200,await readFile(resolve(root,'studio',url.pathname.slice(1))),url.pathname.endsWith('.js')?'text/javascript; charset=utf-8':'text/css; charset=utf-8');
   if(req.method==='GET'&&url.pathname==='/api/content')return send(200,await snapshot());
   if(req.method==='GET'&&url.pathname==='/api/assets'){
    const files=[];async function walk(dir,prefix){for(const item of await readdir(dir,{withFileTypes:true})){if(item.isDirectory())await walk(resolve(dir,item.name),prefix+'/'+item.name);else if(item.isFile()&&/\.(png|jpe?g|webp|avif|svg|pdf)$/i.test(item.name))files.push(prefix+'/'+item.name);}}await walk(publicDir,'');return send(200,{assets:files.sort()});
   }
   if(req.method==='GET'&&url.pathname.startsWith('/media/')){const asset=url.pathname.slice(6);if(!/^\/[\w./-]+$/.test(asset)||asset.includes('..'))return send(400,{error:'Invalid asset path.'});const file=await safeAsset(asset),types={'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.avif':'image/avif','.svg':'image/svg+xml','.pdf':'application/pdf'};const type=types[extname(file).toLowerCase()];if(!type)return send(404,{error:'Unsupported asset.'});res.setHeader('Content-Security-Policy',"default-src 'none'; sandbox");return send(200,await readFile(file),type);}
   if(req.method==='GET'&&url.pathname==='/api/changes'){try{const [diff,status]=await Promise.all([run('git',['diff','HEAD','--','content/site.json','public/images'],{cwd:root,maxBuffer:1024*1024}),run('git',['status','--short','--','content/site.json','public/images'],{cwd:root})]);return send(200,{diff:diff.stdout,status:status.stdout});}catch{return send(200,{diff:'Git changes are unavailable. You can still save content locally.',status:''});}}
   if(!['PUT','POST'].includes(req.method))return send(404,{error:'Not found.'});
   if(req.headers.origin!==origin||req.headers['x-studio-token']!==token)return send(403,{error:'Editor session expired or request not authorized. Reload the editor.'});
   if(url.pathname==='/api/upload'&&req.method==='POST'){
    const type=req.headers['content-type'];if(!['image/png','image/jpeg','image/webp'].includes(type))return send(400,{error:'Upload a PNG, JPEG, or WebP image.'});
    const bytes=await body(req,10*1024*1024);const png=bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),jpg=bytes[0]===255&&bytes[1]===216&&bytes[2]===255,webp=bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP';if(!(type==='image/png'&&png||type==='image/jpeg'&&jpg||type==='image/webp'&&webp))return send(400,{error:'The file does not match its image type.'});
    const name=(req.headers['x-file-name']||'image').replace(/\.[^.]+$/,'').toLowerCase().replace(/[^a-z0-9-]+/g,'-').slice(0,60)||'image';const extension=png?'png':jpg?'jpg':'webp';const asset=`/images/${name}-${randomBytes(4).toString('hex')}.${extension}`;await mkdir(resolve(publicDir,'images'),{recursive:true});await writeFile(resolve(publicDir,'.'+asset),bytes,{flag:'wx'});return send(201,{asset});
   }
   if(url.pathname!=='/api/content'||req.method!=='PUT')return send(404,{error:'Not found.'});
   if(req.headers['content-type']!=='application/json')return send(400,{error:'Expected JSON content.'});
   if(busy)return send(409,{error:'Another save is in progress. Try again.'});busy=true;
   try{const payload=JSON.parse((await body(req,512*1024)).toString());const current=await snapshot();if(payload.revision!==current.revision)return send(409,{error:'Content changed on disk since this editor loaded. Reload content before saving; copy any unsaved text first.'});const assets=validateSite(payload.content,template);for(const asset of assets)await safeAsset(asset);const temp=contentPath+'.tmp';await writeFile(temp,JSON.stringify(payload.content,null,2)+'\n');await rename(temp,contentPath);return send(200,await snapshot());}finally{busy=false;}
  }catch(error){send(error.status||400,{error:error.code==='ENOENT'?'A referenced asset is missing. Upload it or choose an existing file.':error.message});}
 });return server;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){const server=await createStudioServer();server.listen(5174,'127.0.0.1',()=>console.log('Content studio: http://127.0.0.1:5174'));server.on('error',error=>{console.error(error.message);process.exitCode=1;});}
