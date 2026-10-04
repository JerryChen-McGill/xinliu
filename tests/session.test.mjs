import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../app.js',import.meta.url),'utf8');
function setup(){
 const nodes=new Map();let now=100000,interval;const storage=new Map();
 function node(){return {value:'',hidden:false,disabled:false,textContent:'',children:[],handlers:{},classList:{toggle(){}},setAttribute(){},addEventListener(k,fn){this.handlers[k]=fn;},replaceChildren(){this.children=[];},append(...items){this.children.push(...items);},querySelectorAll(){return [];},focus(){},scrollIntoView(){}};}
 function get(id){if(!nodes.has(id))nodes.set(id,node());return nodes.get(id);}
 for(const [id,value] of [['#challenge','7'],['#skill','7'],['#duration','10'],['#task','Test task'],['#feedback','Test feedback'],['#feeling','投入而顺畅']])get(id).value=value;
 get('#distraction').checked=true;get('#reflection').hidden=true;
 class Clock extends Date{static now(){return now;}}
 const context=vm.createContext({document:{querySelector:get,querySelectorAll:()=>[],createElement:node,addEventListener(){}},window:{addEventListener(){},confirm:()=>true},location:{hash:''},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},Date:Clock,setInterval:fn=>{interval=fn;},setTimeout,Blob,URL,console});
 vm.runInContext(source,context);
 return {get,storage,fire:(id,type)=>get(id).handlers[type]({preventDefault(){}}),advance:seconds=>{now+=seconds*1000;interval();}};
}
test('natural completion opens reflection and records capped elapsed duration',()=>{
 const s=setup();s.fire('#plan-form','submit');s.advance(605);assert.equal(s.get('#timer').textContent,'00:00');assert.equal(s.get('#reflection').hidden,false);assert.equal(s.get('#pause').disabled,true);s.fire('#reflection','submit');const [record]=JSON.parse(s.storage.get('flow-lab-records-v1'));assert.equal(record.seconds,600);assert.equal(record.completed,true);
});
test('paused time is excluded, then resume and finish retains actual duration',()=>{
 const s=setup();s.fire('#plan-form','submit');s.advance(20);s.fire('#pause','click');s.advance(100);assert.equal(s.get('#timer').textContent,'09:40');s.fire('#pause','click');s.advance(10);s.fire('#finish','click');s.fire('#reflection','submit');const [record]=JSON.parse(s.storage.get('flow-lab-records-v1'));assert.equal(record.seconds,30);assert.equal(record.completed,false);
});
test('blank goals and unconfirmed preparation cannot start a session',()=>{
 const s=setup();s.get('#task').value=' ';s.fire('#plan-form','submit');assert.match(s.get('#plan-message').textContent,/具体目标/);s.get('#task').value='Task';s.get('#distraction').checked=false;s.fire('#plan-form','submit');assert.match(s.get('#plan-message').textContent,/准备事项/);
});
