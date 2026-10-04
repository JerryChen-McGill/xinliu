import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const allowed=new Set(['index.html','style.css','app.js','favicon.svg']);
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml'};
http.createServer(async(req,res)=>{try{const pathname=new URL(req.url,'http://localhost').pathname;const file=pathname==='/'?'index.html':pathname.slice(1);if(!allowed.has(file)){res.writeHead(404);res.end('Not found');return;}const body=await readFile(path.join(root,file));res.writeHead(200,{'Content-Type':mime[path.extname(file)],'Cache-Control':'no-cache'});res.end(body);}catch{res.writeHead(500);res.end('Server error');}}).listen(Number(process.env.PORT||4173),'127.0.0.1',()=>console.log('Flow Lab ready at http://127.0.0.1:'+ (process.env.PORT||4173)));
