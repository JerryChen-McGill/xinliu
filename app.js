'use strict';
const $ = (selector) => document.querySelector(selector);
const resources = [
  {id:'book',type:'start',title:'《心流》：从原著开始',meta:'[1] Mihaly Csikszentmihalyi · 1990 · 图书',description:'Flow: The Psychology of Optimal Experience。本站核读英文原著的核心章节与结构；中文为原创概括。沿第 2–4 章理解机制，再用第 5–10 章连接生活与意义。',access:'馆藏 / 借阅信息',url:'https://openlibrary.org/books/OL7284467M/Flow'},
  {id:'concept',type:'research',title:'The Concept of Flow',meta:'[2] Nakamura & Csikszentmihalyi · 2002 / 2014 重刊 · 理论章节',description:'由理论提出者梳理心流模型、体验测量与发展方向。适合追问“心流究竟指什么”。本站核对出版页摘要；完整章节可能需要机构权限。',access:'出版方摘要 / 付费全文',url:'https://link.springer.com/chapter/10.1007/978-94-017-9088-8_16'},
  {id:'balance',type:'research',title:'挑战与能力，真的需要平衡吗？',meta:'[3] Fong, Zaleski & Leach · 2015 · 元分析',description:'The challenge–skill balance and antecedents of flow。综合 28 项研究：匹配与心流呈中等关联，且受情境与测量方式影响。量表内容的重叠也可能影响关联；不能把平衡等同于充分条件。本站依据摘要与公开综述核对。',access:'期刊摘要 / 付费全文',url:'https://doi.org/10.1080/17439760.2014.967799'},
  {id:'performance',type:'research',title:'心流与表现：相关，不等于因果',meta:'[4] Harris 等 · 2021 在线发表 · 系统综述与元分析',description:'A systematic review and meta-analysis of the relationship between flow states and performance。总体呈小到中等正向关系，但多数设计无法确定因果方向。用于校准“心流必然提高效率”的说法。',access:'期刊文章',url:'https://doi.org/10.1080/1750984X.2021.1929402'},
  {id:'review',type:'research',title:'把视野拉远：252 项研究的版图',meta:'[5] Peifer 等 · 2022 · 范围综述',description:'A Scoping Review of Flow Research。覆盖 2000–2016 年发表的 252 项研究，讨论前因、体验与结果；这是研究版图，不是 252 次同一结论的重复验证。',access:'开放获取全文',url:'https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2022.815665/full'},
  {id:'ted',type:'start',title:'听作者亲自讲述：Flow, the secret to happiness',meta:'[6] Mihaly Csikszentmihalyi · TED 2004 · 演讲',description:'从创作和日常体验理解这个概念的来由。适合先建立直觉，再回到论文核对证据；演讲不是干预效果的证明。可在播放页查看可用字幕。',access:'观看演讲 · 约 19 分钟',url:'https://www.ted.com/talks/mihaly_csikszentmihalyi_flow_the_secret_to_happiness'}
];
const resourcePreviews={book:'从体验、日常生活到意义，回到这本书的完整思路。',concept:'由理论提出者解释心流模型与测量方法。',balance:'难度匹配重要，但为什么还不能保证心流？',performance:'阅读心流与表现的关系，以及因果判断的边界。',review:'看见不同情境中的研究，也看见定义与测量的分歧。',ted:'先听作者讲述，再沿文献深入探索。'};
function renderResources(filter = 'all') {
  $('#resource-list').replaceChildren();
  resources.filter(r => filter === 'all' || r.type === filter).forEach(r => {
    const item = document.createElement('article'); item.className = 'resource'; item.id = `source-${r.id}`;
    const number = document.createElement('span'); number.className = 'resource-num'; number.textContent = String(resources.indexOf(r)+1).padStart(2,'0');
    const body = document.createElement('div');
    const title = document.createElement('h3'); title.textContent = r.title; body.append(title);
    const preview = document.createElement('p'); preview.className='resource-preview'; preview.textContent=resourcePreviews[r.id]; body.append(preview);
    const detail = document.createElement('details');
    const summary = document.createElement('summary'); summary.textContent = '了解更多';
    const icon = document.createElement('span'); icon.className = 'fold-icon'; icon.textContent = '+'; icon.setAttribute('aria-hidden','true'); summary.append(icon); detail.append(summary);
    for (const [tag, text, cls] of [['p',r.meta,'resource-meta'],['p',r.description,'']]) {
      const node = document.createElement(tag); node.textContent = text; node.className = cls; detail.append(node);
    }
    const link = document.createElement('a'); link.href = r.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.className = 'resource-action'; link.textContent = r.access + ' ↗';
    detail.append(link); body.append(detail); item.append(number,body); $('#resource-list').append(item);
  });
}
function setFilter(filter) {
  document.querySelectorAll('[data-filter]').forEach(b=>{const active=b.dataset.filter===filter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  renderResources(filter);
}
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>setFilter(b.dataset.filter)));
document.querySelectorAll('a[href^="#source-"]').forEach(a=>a.addEventListener('click',()=>setFilter('all')));
renderResources();
function revealSource() { if(location.hash.startsWith('#source-')) {setFilter('all');const source=document.getElementById(location.hash.slice(1));if(source){source.querySelector('details').open=true;source.scrollIntoView();}} }
window.addEventListener('hashchange',revealSource); revealSource();

function updateMap() {
  const challenge=Number($('#challenge').value),skill=Number($('#skill').value);
  $('#challenge-value').value=challenge;$('#skill-value').value=skill;
  $('#chart-dot').setAttribute('transform',`translate(${23+(skill-1)*46},${313.5-(challenge-1)*33})`);
  let state,advice;
  if(challenge<=4&&skill<=4){state='低投入 / 淡漠';advice='挑战和能力都较低。选一件你在意的小事，先建立最小的参与感。';}
  else if(challenge-skill>=2){state='偏向焦虑';advice='挑战超出当前能力。缩小任务、找一个示范，或先补一项基础技能。';}
  else if(skill-challenge>=2){state='偏向无聊';advice='能力超过当前挑战。增加一点复杂度，或为熟悉的任务设一个新目标。';}
  else if(challenge>=6&&skill>=6){state='接近心流';advice='挑战与能力相当。再给自己一个清晰目标和可见反馈。';}
  else{state='逐渐投入';advice='挑战和能力开始匹配。稳步提高两者，观察任务是否更有吸引力。';}
  $('#state-name').textContent=state;$('#state-advice').textContent=advice;
}
$('#challenge').addEventListener('input',updateMap);$('#skill').addEventListener('input',updateMap);updateMap();
document.querySelectorAll('[data-map]').forEach(button=>button.addEventListener('click',()=>{
  const [challenge,skill]=button.dataset.map.split(',');$('#challenge').value=challenge;$('#skill').value=skill;updateMap();
  document.querySelectorAll('[data-map]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
}));
function clearMapPreset(){document.querySelectorAll('[data-map]').forEach(b=>b.setAttribute('aria-pressed','false'));}
$('#challenge').addEventListener('input',clearMapPreset);$('#skill').addEventListener('input',clearMapPreset);
const sceneExamples={
 reading:['阅读','你不只是在读字，而是在追着一个问题。','内容稍有难度，但你能理解。你不断形成猜想、在下一段里核对，注意力逐渐留在书里。','试试看：带着一个问题读一节，再用自己的话回答。'],
 creating:['创作','你在解决眼前的表达问题，而不是评价自己。','写作、绘画或音乐练习里，你知道要调整哪个细节。一次修改带来反馈，下一步接着发生。','试试看：只处理一个段落、一个构图或一小节旋律。'],
 moving:['运动','动作、节奏与反馈，让注意力回到此刻。','你选择能掌握的动作，观察节奏和完成情况，在安全范围内逐渐调整挑战。投入来自活动的过程。','试试看：挑一个熟悉的动作，只观察一个可见细节；遵守自己的身体与安全边界。'],
 working:['工作','问题有边界，下一步也清楚。','你把复杂工作缩小成一件可完成的事，做一次尝试，检查结果，再决定如何继续。','试试看：给当前任务写下“完成条件”和“检查方式”。']
};
document.querySelectorAll('[data-scene]').forEach(button=>button.addEventListener('click',()=>{
 const example=sceneExamples[button.dataset.scene];['#scene-label','#scene-title','#scene-description','#scene-action'].forEach((id,i)=>$(id).textContent=example[i]);
 document.querySelectorAll('[data-scene]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
}));
const conditionExamples={
 goal:['模糊的愿望：今晚好好学习。','具体的目标：读一节，写下三个要点。','给这次行动一个结束边界，知道眼前要完成什么。'],
 feedback:['缺少反馈：看完就算完成，但不知道理解了多少。','可见的反馈：合上书复述，再核对遗漏。','让结果回应你的行动。反馈也可以来自材料、作品或他人，不一定是分数。'],
 challenge:['失去匹配：直接做最难的题，或反复做早已熟练的题。','调整挑战：先做一题可尝试的，再逐渐增加难度。','观察自己的体验，缩小或扩展任务。这是教学建议，不是进入心流的保证。']
};
document.querySelectorAll('[data-condition]').forEach(button=>button.addEventListener('click',()=>{
 const example=conditionExamples[button.dataset.condition];['#condition-before','#condition-after','#condition-why'].forEach((id,i)=>$(id).textContent=example[i]);
 document.querySelectorAll('[data-condition]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
}));
document.querySelectorAll('[data-answer]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-answer]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  $('#quiz-feedback').textContent=(button.dataset.answer==='no'?'判断正确。':'再想一步。')+'时间感改变只是线索。还需了解目标、挑战、反馈与投入体验；仅凭“忘记时间”无法判断。';
}));

const presets={study:['读完一节内容，用自己的话写下 3 个要点','合上书复述，再对照原文检查遗漏'],writing:['写出一个段落的初稿，清楚表达一个观点','完成后检查：观点、理由、例子是否齐全'],coding:['把一个问题缩小到可复现的例子，并尝试修复','运行相关检查，确认预期行为与实际结果一致'],music:['用舒适速度练习一小段不熟悉的旋律','每遍听一个细节：节奏是否稳定、错音在哪里'],custom:['','']};
$('#scenario').addEventListener('change',()=>{[$('#task').value,$('#feedback').value]=presets[$('#scenario').value];});
let active=null,running=false,remaining=25*60,deadline=0,elapsedBefore=0,segmentStart=0;
const storageKey='flow-lab-records-v1';let records=[];
try {const saved=JSON.parse(localStorage.getItem(storageKey)||'[]'); if(!Array.isArray(saved))throw Error('Invalid records');records=saved.filter(r=>r&&typeof r.task==='string'&&typeof r.note==='string'&&typeof r.feeling==='string'&&typeof r.date==='string'&&Number.isFinite(r.seconds)).slice(0,100);} catch {$('#storage-message').textContent='无法读取本机记录。你仍可练习并导出本次会话的新记录。';}
function paintTimer(){const secs=Math.max(0,Math.ceil(remaining));$('#timer').textContent=`${String(Math.floor(secs/60)).padStart(2,'0')}:${String(secs%60).padStart(2,'0')}`;}
function lockPlan(locked){$('#plan-form').querySelectorAll('input,select,button').forEach(el=>el.disabled=locked);}
function updateClock(){if(!running)return;remaining=Math.max(0,(deadline-Date.now())/1000);paintTimer();if(remaining<=0)finishSession(true);}
function finishSession(completed=false){
  if(!active)return;
  if(running)elapsedBefore+=Math.max(0,(Date.now()-segmentStart)/1000);
  active.seconds=Math.min(active.duration*60,Math.round(elapsedBefore));active.completed=completed;
  running=false;$('#pause').disabled=true;$('#finish').disabled=true;
  $('#timer-label').textContent=completed?'这段练习结束了':'为这次尝试留一点反馈';
  $('#session-note').textContent=completed?'时间到了。休息一下，再回看这次体验。':'提前结束也可以；观察比坚持到零更重要。';
  $('#practice-disclosure').open=true;$('#reflection').hidden=false;$('#feeling').focus();
}
$('#duration').addEventListener('change',()=>{remaining=Number($('#duration').value)*60;paintTimer();});
$('#plan-form').addEventListener('submit',event=>{
  event.preventDefault();
  if(!$('#task').value.trim()||!$('#feedback').value.trim()){$('#plan-message').textContent='请写下具体目标和反馈方式。';return;}
  if(!$('#distraction').checked){$('#plan-message').textContent='先确认准备事项，再开始这次练习。';$('#distraction').focus();return;}
  active={task:$('#task').value.trim(),feedback:$('#feedback').value.trim(),duration:Number($('#duration').value)};
  remaining=active.duration*60;deadline=Date.now()+remaining*1000;segmentStart=Date.now();elapsedBefore=0;running=true;
  $('#plan-message').textContent='任务已确定。现在只做这一件事。';$('#session-task').textContent=active.task;
  $('#timer-label').textContent='专注进行中';$('#pause').textContent='暂停';$('#pause').disabled=false;$('#finish').disabled=false;$('#reflection').hidden=true;
  $('#session-note').textContent='计时期间保持本页打开。需要时可以暂停或提前结束。';lockPlan(true);$('#plan-form').hidden=true;$('.session').hidden=false;paintTimer();$('#pause').focus();
});
$('#pause').addEventListener('click',()=>{
  if(!active)return;
  if(running){updateClock();if(!running)return;elapsedBefore+=(Date.now()-segmentStart)/1000;running=false;$('#pause').textContent='继续';$('#timer-label').textContent='已暂停，慢慢来';}
  else {segmentStart=Date.now();deadline=Date.now()+remaining*1000;running=true;$('#pause').textContent='暂停';$('#timer-label').textContent='专注进行中';}
});
$('#finish').addEventListener('click',()=>{updateClock();if(!$('#reflection').hidden)return;finishSession(false);});
setInterval(updateClock,250);document.addEventListener('visibilitychange',updateClock);
window.addEventListener('beforeunload',event=>{if(active){event.preventDefault();event.returnValue='';}});
function persist(){try{localStorage.setItem(storageKey,JSON.stringify(records));$('#storage-message').textContent='已保存在此浏览器。不上传任务或笔记；清除浏览器数据也会删除记录。';}catch{$('#storage-message').textContent='浏览器未允许保存。记录仅留在当前页面，请立即导出备份。';}}
function renderRecords(){
  $('#record-count').textContent=String(records.length);$('#export').disabled=!records.length;$('#clear').disabled=!records.length;
  $('#records').replaceChildren();
  if(!records.length){const p=document.createElement('p');p.className='empty';p.textContent='第一次尝试，还没有发生。完成后，留下一点关于自己的发现。';$('#records').append(p);return;}
  records.slice(0,5).forEach(r=>{const item=document.createElement('article');item.className='record';const h=document.createElement('h4');h.textContent=r.task;const meta=document.createElement('small');meta.textContent=`${new Date(r.date).toLocaleString('zh-CN')} · ${Math.floor(r.seconds/60)} 分 ${r.seconds%60} 秒 · ${r.feeling}`;const p=document.createElement('p');p.textContent=r.note||'这一次，没有添加笔记。';item.append(h,meta,p);$('#records').append(item);});
  if(records.length>5){const p=document.createElement('p');p.className='fineprint';p.textContent='展示最近 5 次；导出可查看全部记录（最多保留 100 次）。';$('#records').append(p);}
}
$('#reflection').addEventListener('submit',event=>{event.preventDefault();if(!active)return;records.unshift({...active,date:new Date().toISOString(),feeling:$('#feeling').value,note:$('#note').value.trim()});records=records.slice(0,100);persist();renderRecords();active=null;$('#reflection').hidden=true;$('#note').value='';$('#feeling').selectedIndex=0;lockPlan(false);$('#plan-form').hidden=false;$('.session').hidden=true;$('#journal-disclosure').open=true;$('#plan-message').textContent='复盘已记录。可以休息一下，或设计下一次练习。';$('#timer-label').textContent='一次尝试，一点发现';$('#session-note').textContent='下一次只调整一个条件，看看体验有何不同。';$('#export').focus();});
$('#export').addEventListener('click',()=>{const blob=new Blob([JSON.stringify({version:1,exportedAt:new Date().toISOString(),records},null,2)],{type:'application/json;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='flow-lab-records.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
$('#clear').addEventListener('click',()=>{if(!window.confirm('删除此浏览器内的全部练习记录？建议先导出备份。'))return;records=[];persist();renderRecords();});
renderRecords();
