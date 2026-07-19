const demoStudents = [
  {name:'김서윤',school:'포산중',year:'1학년',grade:'중등',className:'포산중 1',parentPhone:'010-32**-7812',payment:'납부',status:'재원'},
  {name:'박지후',school:'유가초',year:'6학년',grade:'초등',className:'유가족 2',parentPhone:'010-84**-0921',payment:'납부',status:'재원'},
  {name:'이도윤',school:'비슬중',year:'2학년',grade:'중등',className:'비슬중 1',parentPhone:'010-51**-4430',payment:'미납',status:'재원'},
  {name:'최하린',school:'포산고',year:'1학년',grade:'고등',className:'고등부 1',parentPhone:'010-27**-9165',payment:'납부',status:'재원'},
  {name:'정민재',school:'비슬중',year:'2학년',grade:'중등',className:'비슬중 1',parentPhone:'010-63**-2884',payment:'미납',status:'재원'},
  {name:'한예린',school:'유가초',year:'6학년',grade:'초등',className:'유가족 2',parentPhone:'010-95**-3701',payment:'납부',status:'휴원'},
  {name:'윤시우',school:'포산중',year:'1학년',grade:'중등',className:'포산중 1',parentPhone:'010-18**-6247',payment:'납부',status:'재원'},
  {name:'서지안',school:'포산고',year:'1학년',grade:'고등',className:'고등부 1',parentPhone:'010-44**-1398',payment:'납부',status:'재원'}
];
let students = JSON.parse(localStorage.getItem('kye_students') || 'null') || demoStudents;
const demoClasses = [
  {name:'유가족 2',level:'초등 6학년',subject:'문법 · 독해',schedule:'월·수 16:00',count:12,max:15},
  {name:'포산중 1',level:'중등 1학년',subject:'내신 · 문법',schedule:'화·목 14:30',count:8,max:12},
  {name:'비슬중 1',level:'중등 2학년',subject:'내신 집중',schedule:'월·수 17:30',count:15,max:16},
  {name:'고등부 1',level:'고등 1학년',subject:'모의고사 · 독해',schedule:'월·수·금 19:10',count:11,max:12},
  {name:'포산중 3',level:'중등 3학년',subject:'고입 대비',schedule:'화·목 19:00',count:7,max:12},
  {name:'현풍고 1',level:'고등 1학년',subject:'내신 · 모의고사',schedule:'화·목 20:20',count:6,max:10}
];
let classes = JSON.parse(localStorage.getItem('kye_classes') || 'null') || demoClasses;
let paymentRecords = JSON.parse(localStorage.getItem('kye_payments') || 'null') || {};
const rollNames = ['박지후','한예린','강하람','이수아','정채원','김도영','송유진','문지호'];

const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove('show'),2300)}
function maskPhone(value){return value ? value.replace(/(\d{3})-(\d{2})\d{2}-(\d{2})\d{2}/,'$1-$2**-$3**') : '-'}
function saveStudents(){localStorage.setItem('kye_students',JSON.stringify(students))}
function paymentBadge(status){const cls=status==='납부'?'paid':status==='일부납'?'partial':status==='면제'?'exempt':'unpaid';const label=status==='납부'?'납부 완료':status;return `<span class="badge ${cls}">${label}</span>`}

const today = new Date();
$('#todayText').textContent = new Intl.DateTimeFormat('ko-KR',{year:'numeric',month:'long',day:'numeric',weekday:'long'}).format(today);

function goTo(view){
  $$('.view').forEach(v=>v.classList.toggle('active',v.id===view+'View'));
  $$('.nav-item[data-view]').forEach(n=>n.classList.toggle('active',n.dataset.view===view));
  const titles={dashboard:'안녕하세요, 원장님 👋',students:'학생 정보',classes:'반과 수업',attendance:'출석 체크',payments:'수납 현황',consulting:'상담 현황',reports:'AI 학습보고서',settings:'학원 설정'};
  $('#pageTitle').textContent=titles[view]||'김영은 영어학원';
  $('#sidebar').classList.remove('open'); window.scrollTo({top:0,behavior:'smooth'});
}
$$('[data-view]').forEach(btn=>btn.addEventListener('click',()=>goTo(btn.dataset.view)));
$$('[data-go]').forEach(btn=>btn.addEventListener('click',()=>goTo(btn.dataset.go)));
$('#mobileMenu').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));

function renderStudents(){
  const term=$('#studentSearch').value.trim().toLowerCase(); const grade=$('#gradeFilter').value; const status=$('#statusFilter').value;
  const filtered=students.filter(s=>(!term||`${s.name} ${s.school} ${s.className}`.toLowerCase().includes(term))&&(!grade||s.grade===grade)&&(!status||s.status===status));
  $('#studentTable').innerHTML=filtered.map(s=>`<tr><td><div class="student-cell"><div class="student-avatar">${s.name[0]}</div><div><strong>${s.name}</strong><small>학생번호 ${String(students.indexOf(s)+101).padStart(4,'0')}</small></div></div></td><td><strong>${s.school}</strong><small>${s.year}</small></td><td>${s.className}</td><td>${s.parentPhone}</td><td>${paymentBadge(s.payment)}</td><td><span class="badge ${s.status==='재원'?'active':'paused'}">${s.status}</span></td><td><button class="edit-button student-edit" data-index="${students.indexOf(s)}">수정</button></td></tr>`).join('') || '<tr><td colspan="7" style="text-align:center;padding:45px;color:#788691">검색 결과가 없습니다.</td></tr>';
  $('#tableSummary').textContent=`전체 ${students.length}명 중 ${filtered.length}명 표시`;
  $('#studentCount').innerHTML=`${86+(students.length-demoStudents.length)}<small>명</small>`;
}
['studentSearch','gradeFilter','statusFilter'].forEach(id=>$('#'+id).addEventListener('input',renderStudents));
renderStudents();

function renderClasses(){
  $('#classGrid').innerHTML=classes.map((c,i)=>`<article class="class-card"><div class="class-card-head"><span class="level">${c.level}</span><button class="edit-button class-edit" data-index="${i}">수정</button></div><h3>${c.name}</h3><p>${c.subject}</p><div class="class-meta"><span>🕘 ${c.schedule}</span><span>👤 김영은</span></div><div class="capacity"><span>수강 인원</span><strong>${c.count} / ${c.max}명</strong></div><div class="capacity-bar"><i style="width:${Math.min(100,c.count/c.max*100)}%"></i></div><div class="student-faces"><i>김</i><i>박</i><i>이</i><i>최</i><span>외 ${Math.max(0,c.count-4)}명</span></div></article>`).join('');
}
renderClasses();

function renderRoll(){
  $('#rollList').innerHTML=rollNames.map((name,i)=>`<div class="roll-student"><div class="student-avatar">${name[0]}</div><strong>${name}</strong><div class="attendance-options"><button class="present ${i<6?'active':''}">출석</button><button class="late ${i===6?'active':''}">지각</button><button class="absent ${i===7?'active':''}">결석</button></div></div>`).join('');
  $$('.attendance-options button').forEach(btn=>btn.addEventListener('click',()=>{const group=btn.parentElement;$$('button',group).forEach(b=>b.classList.remove('active'));btn.classList.add('active')}));
}
renderRoll();
$('#allPresent').addEventListener('click',()=>{$$('.attendance-options button').forEach(b=>b.classList.toggle('active',b.classList.contains('present')));toast('모든 학생을 출석 처리했습니다.')});

function renderPayments(){
  const rows=students.map((s,i)=>{const base={amount:i===3?320000:270000,payer:i===4?'아버지':'어머니',memo:i===1?'형제 합산':'',method:'카드',date:s.payment==='납부'?`2026-07-${String(i+1).padStart(2,'0')}`:'',status:s.payment};return {...s,...base,...paymentRecords[s.name]}});
  $('#paymentTable').innerHTML=rows.map((s,i)=>`<tr><td><strong>${s.name}</strong><small>${s.school}</small></td><td>${s.className}</td><td><strong>${Number(s.amount).toLocaleString()}원</strong></td><td>${[s.payer,s.memo].filter(Boolean).join(' · ')||'-'}<small>${s.method||''}</small></td><td>${s.date?s.date.replace('2026-','').replace('-','월 ')+'일':'-'}</td><td>${paymentBadge(s.status)}</td><td><button class="edit-button payment-edit" data-index="${i}">수정</button></td></tr>`).join('');
  const billed=rows.reduce((sum,r)=>sum+Number(r.amount||0),0);const paid=rows.filter(r=>r.status==='납부').reduce((sum,r)=>sum+Number(r.amount||0),0);
  $('#billedAmount').textContent=billed.toLocaleString()+'원';$('#paidAmount').textContent=paid.toLocaleString()+'원';$('#unpaidAmount').textContent=(billed-paid).toLocaleString()+'원';
}
renderPayments();

function renderReportStudents(){
  const select = $('#reportStudent');
  if(!select) return;
  select.innerHTML = students.map((s, index)=>`<option value="${index}">${s.name} · ${s.school} · ${s.className}</option>`).join('');
}
renderReportStudents();

async function generateReport(){
  const button = $('#generateReportBtn');
  const output = $('#reportOutput');
  const student = students[Number($('#reportStudent').value)] || students[0];
  const templateLabels = {growth:'성장 스토리', weekly:'주간 체크', classic:'클래식 리포트'};
  const payload = {
    academyName: '김영은 영어학원',
    student,
    template: templateLabels[$('#reportTemplate').value],
    learning: {
      vocab: $('#reportVocab').value,
      reading: $('#reportReading').value,
      listening: $('#reportListening').value,
      speaking: $('#reportSpeaking').value,
      teacherComment: $('#reportComment').value
    }
  };
  button.disabled = true;
  button.textContent = '생성 중...';
  output.textContent = 'AI가 학부모용 보고서를 작성하고 있습니다.';
  try{
    const res = await fetch('/api/report', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if(!res.ok) throw new Error(data.message || '보고서 생성에 실패했습니다.');
    output.textContent = data.report;
    toast('AI 학습보고서가 생성되었습니다.');
  }catch(error){
    output.textContent = '보고서를 만들지 못했습니다. Vercel 환경변수 OPENAI_API_KEY와 배포 상태를 확인해 주세요.';
  }finally{
    button.disabled = false;
    button.textContent = 'AI 보고서 생성';
  }
}

$('#generateReportBtn')?.addEventListener('click', generateReport);
$('#copyReportBtn')?.addEventListener('click', async()=>{
  const text = $('#reportOutput').textContent.trim();
  await navigator.clipboard.writeText(text);
  toast('보고서 내용을 복사했습니다.');
});
$('#printReportBtn')?.addEventListener('click', ()=>window.print());

const modal=$('#studentModal');
function syncClassOptions(){const select=$('[name="className"]',modal);const current=select.value;select.innerHTML=classes.map(c=>`<option>${c.name}</option>`).join('');if(classes.some(c=>c.name===current))select.value=current}
function openModal(index=null){const form=$('#studentForm');form.reset();form.dataset.editIndex=index===null?'':index;syncClassOptions();const editing=index!==null;$('#studentModalKicker').textContent=editing?'EDIT STUDENT':'NEW STUDENT';$('#studentModalTitle').textContent=editing?'학생 정보 수정':'학생 등록';$('#studentSubmitBtn').textContent=editing?'수정사항 저장':'학생 등록하기';if(editing){const s=students[index];form.elements['name'].value=s.name;form.elements.school.value=s.school;form.elements.grade.value=s.grade;form.elements.className.value=s.className;form.elements.parentPhone.value=s.parentPhone}modal.classList.add('open');modal.setAttribute('aria-hidden','false');setTimeout(()=>$('[name="name"]',modal).focus(),50)}
function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true')}
$$('[data-open-modal]').forEach(b=>b.addEventListener('click',()=>openModal()));
$$('.close-modal').forEach(b=>b.addEventListener('click',closeModal));
modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
$('#studentForm').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget);const index=e.currentTarget.dataset.editIndex===''?null:Number(e.currentTarget.dataset.editIndex);const data={name:f.get('name'),school:f.get('school'),year:f.get('grade')==='초등'?'6학년':'1학년',grade:f.get('grade'),className:f.get('className'),parentPhone:maskPhone(f.get('parentPhone'))};if(index===null){students.unshift({...data,payment:'미납',status:'재원'})}else{const oldName=students[index].name;students[index]={...students[index],...data};if(oldName!==data.name&&paymentRecords[oldName]){paymentRecords[data.name]=paymentRecords[oldName];delete paymentRecords[oldName];localStorage.setItem('kye_payments',JSON.stringify(paymentRecords))}}saveStudents();renderStudents();renderPayments();renderReportStudents();closeModal();goTo('students');toast(index===null?`${data.name} 학생이 등록되었습니다.`:`${data.name} 학생 정보가 수정되었습니다.`)});

const classModal=$('#classModal');
function openClassModal(index=null){const form=$('#classForm');form.reset();form.dataset.editIndex=index===null?'':index;const editing=index!==null;$('#classModalKicker').textContent=editing?'EDIT CLASS':'NEW CLASS';$('#classModalTitle').textContent=editing?'반 정보 수정':'새 반 만들기';$('#classSubmitBtn').textContent=editing?'수정사항 저장':'반 만들기';if(editing){const c=classes[index];Object.keys(c).forEach(key=>{if(form.elements[key])form.elements[key].value=c[key]})}classModal.classList.add('open');classModal.setAttribute('aria-hidden','false')}
function closeClassModal(){classModal.classList.remove('open');classModal.setAttribute('aria-hidden','true')}
$$('.close-class-modal').forEach(b=>b.addEventListener('click',closeClassModal));classModal.addEventListener('click',e=>{if(e.target===classModal)closeClassModal()});
$('#classForm').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget);const index=e.currentTarget.dataset.editIndex===''?null:Number(e.currentTarget.dataset.editIndex);const data={name:f.get('name'),level:f.get('level'),subject:f.get('subject'),schedule:f.get('schedule'),count:Number(f.get('count')),max:Number(f.get('max'))};if(index===null)classes.unshift(data);else classes[index]=data;localStorage.setItem('kye_classes',JSON.stringify(classes));renderClasses();closeClassModal();toast(index===null?`${data.name} 반이 만들어졌습니다.`:`${data.name} 반 정보가 수정되었습니다.`)});

const paymentModal=$('#paymentModal');
function openPaymentModal(index=null){const form=$('#paymentForm');form.reset();form.dataset.editIndex=index===null?'':index;form.elements.studentName.innerHTML=students.map(s=>`<option>${s.name}</option>`).join('');const editing=index!==null;$('#paymentModalKicker').textContent=editing?'EDIT PAYMENT':'NEW PAYMENT';$('#paymentModalTitle').textContent=editing?'납부 내역 수정':'납부 등록';$('#paymentSubmitBtn').textContent=editing?'수정사항 저장':'납부 등록하기';form.elements.studentName.disabled=editing;if(editing){const s=students[index];const base={amount:index===3?320000:270000,payer:index===4?'아버지':'어머니',memo:index===1?'형제 합산':'',method:'카드',date:s.payment==='납부'?`2026-07-${String(index+1).padStart(2,'0')}`:'',status:s.payment};const r={...base,...paymentRecords[s.name]};form.elements.studentName.value=s.name;Object.keys(r).forEach(key=>{if(form.elements[key])form.elements[key].value=r[key]})}else{form.elements.amount.value=270000;form.elements.date.value='2026-07-05'}paymentModal.classList.add('open');paymentModal.setAttribute('aria-hidden','false')}
function closePaymentModal(){paymentModal.classList.remove('open');paymentModal.setAttribute('aria-hidden','true')}
$$('.close-payment-modal').forEach(b=>b.addEventListener('click',closePaymentModal));paymentModal.addEventListener('click',e=>{if(e.target===paymentModal)closePaymentModal()});
$('#paymentForm').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget);const index=e.currentTarget.dataset.editIndex===''?students.findIndex(s=>s.name===f.get('studentName')):Number(e.currentTarget.dataset.editIndex);const student=students[index];const data={amount:Number(f.get('amount')),status:f.get('status'),date:f.get('date'),payer:f.get('payer'),method:f.get('method'),memo:f.get('memo')};paymentRecords[student.name]=data;student.payment=data.status;saveStudents();localStorage.setItem('kye_payments',JSON.stringify(paymentRecords));renderStudents();renderPayments();closePaymentModal();goTo('payments');toast(`${student.name} 학생의 납부 내역이 저장되었습니다.`)});

document.addEventListener('click',e=>{const studentBtn=e.target.closest('.student-edit');if(studentBtn)openModal(Number(studentBtn.dataset.index));const classBtn=e.target.closest('.class-edit');if(classBtn)openClassModal(Number(classBtn.dataset.index));const paymentBtn=e.target.closest('.payment-edit');if(paymentBtn)openPaymentModal(Number(paymentBtn.dataset.index))});

$('#globalSearch').addEventListener('keydown',e=>{if(e.key==='Enter'){goTo('students');$('#studentSearch').value=e.target.value;renderStudents()}});
$$('.todo-check').forEach(b=>b.addEventListener('click',()=>b.classList.toggle('checked')));
$('#addTodo').addEventListener('click',()=>toast('새 할 일을 추가할 수 있어요.'));
$('#newClassBtn').addEventListener('click',()=>openClassModal());
$('#addPayment').addEventListener('click',()=>openPaymentModal());
$('#newConsult').addEventListener('click',()=>toast('신규 상담 카드를 만들 수 있어요.'));
$('#saveSettings').addEventListener('click',()=>toast('학원 정보가 저장되었습니다.'));
$('#exportBtn').addEventListener('click',()=>{
  const header=['학생명','학교','학년','구분','수강반','학부모 연락처','수납','상태'];
  const csv='\ufeff'+[header,...students.map(s=>[s.name,s.school,s.year,s.grade,s.className,s.parentPhone,s.payment,s.status])].map(r=>r.map(v=>`"${v}"`).join(',')).join('\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download='김영은영어학원_학생명단.csv';a.click();URL.revokeObjectURL(a.href);toast('학생 명단을 저장했습니다.');
});
