import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {spawn} from 'node:child_process';
const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
test('all HTML ids are unique and internal static anchors resolve',()=>{
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
 for(const [,id] of html.matchAll(/href="#([^"]+)"/g)){if(!id.startsWith('source-'))assert.ok(ids.includes(id),id);}
});
test('public assets exist and external links isolate their context',async()=>{
 for(const file of ['app.js','style.css','favicon.svg']) assert.ok((await readFile(new URL('../'+file,import.meta.url))).length>0);
 for(const [link] of html.matchAll(/<a[^>]+target="_blank"[^>]*>/g))assert.match(link,/rel="noopener noreferrer"/);
});
test('server serves the app but refuses repository files',async()=>{
 const port=18000+Math.floor(Math.random()*10000);
 const child=spawn(process.execPath,['server.mjs'],{cwd:new URL('..',import.meta.url),env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe']});
 try{await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(Error('Server startup timeout')),5000);child.stdout.once('data',()=>{clearTimeout(timeout);resolve();});child.once('error',reject);});
 const origin=`http://127.0.0.1:${port}`;const main=await fetch(origin);assert.equal(main.status,200);assert.match(await main.text(),/FLOW LAB/);
 for(const file of ['app.js','style.css','favicon.svg'])assert.equal((await fetch(`${origin}/${file}`)).status,200);
 for(const file of ['.git/config','docs/PRODUCT.md','package.json'])assert.equal((await fetch(`${origin}/${file}`)).status,404);
 }finally{child.kill();}
});
