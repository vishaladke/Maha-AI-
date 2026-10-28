/* ===================================================
   MahaSkill AI – Complete Application
   महाराष्ट्रातील मराठी माध्यम शाळांसाठी AI शिक्षण मंच
   All 14+ pages with premium UI
   =================================================== */

// ===== UTILITIES =====
const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);
const esc=t=>String(t==null?'':t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

// ===== STORE =====
const STORE_KEY='mahaskill.v1';
const defaultData=()=>({
  lessons:[
    {id:1,subj:'गणित',title:'अपूर्णांक',grade:'७ वी',pub:1,
      notes:['अपूर्णांकात अंश आणि छेद असतात.','छेद समान असल्यास अंश एकमेकांत मिळवतात.','सममूल्य अपूर्णांकांची किंमत सारखी असते.','अपूर्णांकाचे दशांशात रूपांतर करता येते.'],
      quiz:[{q:'अपूर्णांकातील खालच्या संख्येला काय म्हणतात?',o:['अंश','छेद','बेरीज'],a:1},{q:'½ आणि ¼ यांची बेरीज किती?',o:['¾','½','⅓'],a:0}]},
    {id:2,subj:'विज्ञान',title:'सजीवांचे वर्गीकरण',grade:'७ वी',pub:1,
      notes:['सजीवांचे वनस्पती आणि प्राणी असे गट केले जातात.','पाठीचा कणा असलेल्या प्राण्यांना पृष्ठवंशीय म्हणतात.','अपृष्ठवंशीय प्राण्यांना पाठीचा कणा नसतो.'],
      quiz:[{q:'पाठीचा कणा असलेल्या प्राण्यांना काय म्हणतात?',o:['अपृष्ठवंशीय','पृष्ठवंशीय','शाकाहारी'],a:1}]},
    {id:3,subj:'इतिहास',title:'शिवरायांचे प्रशासन',grade:'७ वी',pub:1,
      notes:['महाराजांनी अष्टप्रधान मंडळ स्थापन केले.','स्वराज्याचा कारभार लोकहितासाठी चालवला जात असे.','रयतेला न्याय देणे हे प्रमुख ध्येय होते.'],
      quiz:[{q:'महाराजांनी कोणते मंडळ स्थापन केले?',o:['अष्टप्रधान मंडळ','विधान परिषद','नगर परिषद'],a:0}]},
    {id:4,subj:'मराठी',title:'कविता – माझा गाव',grade:'६ वी',pub:1,
      notes:['गावातील निसर्ग आणि शेतीचे वर्णन या कवितेत आहे.','कवी आपल्या गावाबद्दल प्रेम व्यक्त करतो.'],
      quiz:[{q:'कवितेत कशाचे वर्णन केले आहे?',o:['शहराचे','गावाचे','समुद्राचे'],a:1}]}
  ],
  results:[],
  attendance:{},
  school:{name:'जि.प. प्राथमिक शाळा, पुणे',medium:'मराठी',contact:'',district:'पुणे'},
  homework:[
    {id:1,subj:'गणित',title:'स्वाध्याय ३.२ – अपूर्णांक',due:'2026-11-05',done:0},
    {id:2,subj:'विज्ञान',title:'सजीवांचे वर्गीकरण – प्रकल्प',due:'2026-11-08',done:0},
    {id:3,subj:'मराठी',title:'निबंध – माझे स्वप्न',due:'2026-11-10',done:0}
  ],
  announcements:[
    {id:1,by:'मुख्याध्यापक',date:'2026-10-25',text:'सत्र परीक्षेचे वेळापत्रक लवकरच जाहीर होईल. सर्व विद्यार्थ्यांनी अभ्यासाला सुरुवात करावी.'},
    {id:2,by:'शिक्षक',date:'2026-10-23',text:'विज्ञान प्रदर्शनासाठी प्रकल्प सादर करण्याची अंतिम तारीख ५ नोव्हेंबर आहे.'}
  ]
});

let D;
try{D=JSON.parse(localStorage.getItem(STORE_KEY))}catch(e){}
D=D||defaultData();
const save=()=>{try{localStorage.setItem(STORE_KEY,JSON.stringify(D))}catch(e){}};
const getRole=()=>{try{return sessionStorage.getItem('ms.role')}catch(e){return null}};
const setRole=r=>{try{sessionStorage.setItem('ms.role',r)}catch(e){}};
const clearRole=()=>{try{sessionStorage.removeItem('ms.role')}catch(e){}};

// ===== TOAST =====
function toast(msg,type='info'){
  const c=$('#toast-container');
  const t=document.createElement('div');
  t.className=`toast ${type}`;
  t.innerHTML=`<i class="fa-solid fa-${type==='success'?'check-circle':type==='error'?'exclamation-circle':'info-circle'}"></i> ${esc(msg)}`;
  c.appendChild(t);
  setTimeout(()=>{t.classList.add('hide');setTimeout(()=>t.remove(),400)},3000);
}

// ===== AI (Demo) =====
const AI={
  gen(title,text){
    const sentences=text.split(/[।.\n]+/).map(x=>x.trim()).filter(x=>x.length>8).slice(0,6);
    const fillers=['हा मुद्दा या पाठात नाही.','याचा या विषयाशी संबंध नाही.'];
    return{
      notes:sentences,
      quiz:sentences.slice(0,3).map(x=>{
        const opts=[x,...fillers];
        const k=Math.floor(Math.random()*3);
        [opts[0],opts[k]]=[opts[k],opts[0]];
        return{q:`'${title}' पाठातील योग्य विधान कोणते?`,o:opts,a:k}
      })
    }
  },
  feedback(answer,notes){
    const words=[...new Set(notes.join(' ').split(/[\s,.।]+/).filter(x=>x.length>4))].slice(0,10);
    const missed=words.filter(x=>!answer.includes(x.slice(0,Math.max(3,x.length-2))));
    return{pct:words.length?Math.round(100*(words.length-missed.length)/words.length):0,missed}
  },
  answer(q){
    const ws=q.split(/[\s,?।.]+/).filter(x=>x.length>2);
    let best=null,score=0;
    D.lessons.filter(l=>l.pub).forEach(l=>l.notes.forEach(n=>{
      const s=ws.filter(x=>n.includes(x.slice(0,Math.max(3,x.length-2)))).length;
      if(s>score){score=s;best={n,l}}
    }));
    return best?`'${best.l.title}' पाठातील नोट: ${best.n}`:'हे उत्तर पाठांत सापडले नाही. कृपया शिक्षकांना विचारा.'
  }
};

// ===== HELPER COMPONENTS =====
const STUDENTS=['सई','आर्यन','प्रिया','ओम','रोहन'];
const pubLessons=()=>D.lessons.filter(l=>l.pub);
const pendingHw=()=>D.homework.filter(h=>!h.done).length;
const avgScore=()=>D.results.length?Math.round(D.results.reduce((a,r)=>a+r.score,0)/D.results.length):68;
const today=()=>new Date().toISOString().slice(0,10);

function progressBar(pct,color='saffron'){
  return `<div class="progress"><div class="progress-fill ${color}" style="width:${pct}%"></div></div>`
}
function labeledProgress(label,pct,color='saffron'){
  return `<div class="mb-2"><div class="progress-label"><span>${label}</span><span style="font-weight:700;font-family:var(--font-en)">${pct}%</span></div>${progressBar(pct,color)}</div>`
}
function statCard(value,label,icon,color){
  return `<div class="dash-stat-card"><div class="stat-icon" style="background:var(--${color}-light);color:var(--${color==='gold'?'saffron':color})"><i class="fa-solid fa-${icon}"></i></div><div><div class="stat-value">${value}</div><div class="stat-label">${label}</div></div></div>`
}
function tableWrap(headers,rows){
  return `<div class="table-wrap"><table class="table"><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`
}

// ===== NAVIGATION =====
const NAV_PUBLIC=[
  ['','मुखपृष्ठ'],['about','आमच्याबद्दल'],['courses','AI कौशल्य'],
  ['schools','शाळांसाठी'],['pricing','किंमत'],['contact','संपर्क']
];

const NAV_DASH={
  s:[['dash','डॅशबोर्ड','gauge-high'],['lessons','माझे पाठ','book-open'],['hw','गृहपाठ','clipboard-list'],
     ['progress','प्रगती','chart-line'],['ask','AI साथी','robot'],['profile','प्रोफाइल','user']],
  t:[['dash','डॅशबोर्ड','gauge-high'],['new','नवीन पाठ','plus-circle'],['lessons','माझे पाठ','book-open'],
     ['class','वर्ग प्रगती','users'],['hw','गृहपाठ','clipboard-list'],['att','उपस्थिती','calendar-check'],['ann','घोषणा','bullhorn']],
  p:[['dash','आढावा','gauge-high'],['teachers','शिक्षक','chalkboard-user'],['classes','वर्ग','users-between-lines'],
     ['reports','अहवाल','chart-pie'],['ann','घोषणा','bullhorn'],['settings','सेटिंग्ज','gear']],
  g:[['dash','प्रगती','gauge-high'],['att','उपस्थिती','calendar-check'],['ann','घोषणा','bullhorn']]
};
const ROLE_LABELS={s:'विद्यार्थी',t:'शिक्षक',p:'मुख्याध्यापक',g:'पालक'};
const ROLE_NAMES={s:'रोहन पाटील',t:'सौ. देशमुख',p:'श्री. कुलकर्णी',g:'रोहनचे पालक'};

// ===== PUBLIC PAGES =====

function pageHome(){
  return `
  <!-- HERO -->
  <section class="hero">
    <div class="container hero-grid">
      <div class="hero-content">
        <div class="hero-badge"><i class="fa-solid fa-sparkles"></i> महाराष्ट्रातील पहिला AI शिक्षण मंच</div>
        <h1 class="hero-title">प्रत्येक मराठी विद्यार्थ्याला<br><span class="highlight">AI चे कौशल्य!</span></h1>
        <p class="hero-subtitle">महाराष्ट्रातील मराठी माध्यम शाळांसाठी बनवलेला AI-आधारित शिक्षण मंच. शिक्षकांचा वेळ वाचतो, विद्यार्थ्यांना सराव मिळतो, पालकांना प्रगती दिसते.</p>
        <div class="hero-actions">
          <a class="btn btn-primary btn-lg" href="#/login"><i class="fa-solid fa-rocket"></i> मोफत डेमो पाहा</a>
          <a class="btn btn-white btn-lg" href="#/courses"><i class="fa-solid fa-play"></i> AI कौशल्य शिका</a>
        </div>
        <div class="hero-stats">
          <div class="hero-stat-item"><div class="hero-stat-num">500+</div><div class="hero-stat-label">शाळा जोडल्या</div></div>
          <div class="hero-stat-item"><div class="hero-stat-num">50K+</div><div class="hero-stat-label">विद्यार्थी</div></div>
          <div class="hero-stat-item"><div class="hero-stat-num">1,200+</div><div class="hero-stat-label">शिक्षक</div></div>
        </div>
      </div>
      <div class="hero-visual">
        <img src="hero.jpg" alt="विद्यार्थी AI शिकत आहेत" loading="eager">
        <div class="hero-float-card card-1">
          <div style="display:flex;align-items:center;gap:8px"><span style="font-size:20px">🏆</span><div><div style="font-weight:700;font-size:13px;color:var(--text)">आजचा स्टार</div><div style="font-size:12px;color:var(--text-muted)">रोहन – ९५% गुण</div></div></div>
        </div>
        <div class="hero-float-card card-2">
          <div style="display:flex;align-items:center;gap:8px"><span style="font-size:20px">🤖</span><div><div style="font-weight:700;font-size:13px;color:var(--text)">AI साथी</div><div style="font-size:12px;color:var(--text-muted)">२४/७ शंका निरसन</div></div></div>
        </div>
      </div>
    </div>
  </section>

  <!-- HOW IT WORKS -->
  <section class="section">
    <div class="container">
      <div class="text-center mb-5">
        <div class="section-label">कसे चालते</div>
        <h2 class="section-title">४ सोप्या पायऱ्या</h2>
        <p class="section-desc">MahaSkill AI वापरणे अत्यंत सोपे आहे. शिक्षक, विद्यार्थी आणि पालक सहज वापरू शकतात.</p>
      </div>
      <div class="grid grid-4">
        ${[
          ['fa-upload','शिक्षक पाठ देतात','शिक्षक पाठाचा मजकूर किंवा वर्गातील रेकॉर्डिंग अपलोड करतात.','saffron'],
          ['fa-wand-magic-sparkles','AI नोट्स तयार करतो','AI मराठीत सोप्या नोट्स आणि प्रश्न स्वयंचलितपणे तयार करतो.','blue'],
          ['fa-check-double','शिक्षक तपासतात','शिक्षक AI ने तयार केलेला मजकूर तपासून प्रकाशित करतात.','green'],
          ['fa-graduation-cap','विद्यार्थी शिकतात','विद्यार्थी पाठ वाचतात, सराव करतात; पालक प्रगती पाहतात.','purple']
        ].map((s,i)=>`
          <div class="card step-card" style="padding-top:20px">
            <div class="step-num">${i+1}</div>
            <div class="card-icon ${s[3]}"><i class="fa-solid ${s[0]}"></i></div>
            <h3>${s[1]}</h3>
            <p>${s[2]}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- FEATURES -->
  <section class="section" style="background:var(--surface)">
    <div class="container">
      <div class="text-center mb-5">
        <div class="section-label">वैशिष्ट्ये</div>
        <h2 class="section-title">MahaSkill AI चे <span class="text-gradient">विशेष वैशिष्ट्ये</span></h2>
        <p class="section-desc">प्रत्येक भूमिकेसाठी विशेष साधने – विद्यार्थी, शिक्षक, मुख्याध्यापक आणि पालक.</p>
      </div>
      <div class="grid grid-3">
        ${[
          ['🤖','AI साथी (Chatbot)','विद्यार्थ्यांच्या शंकांचे मराठीत तात्काळ निरसन. पाठ्यपुस्तकानुसार उत्तरे.','saffron'],
          ['📝','स्वयंचलित नोट्स','पाठाचा मजकूर सोप्या मराठी नोट्समध्ये बदलतो. विद्यार्थ्यांना समजेल अशा भाषेत.','blue'],
          ['📊','प्रगती ट्रॅकिंग','प्रत्येक विद्यार्थ्याची विषयनिहाय प्रगती, Bloom\'s Taxonomy नुसार.','green'],
          ['📋','प्रश्नपत्रिका जनरेटर','SSC अभ्यासक्रमानुसार प्रश्नपत्रिका आणि प्रश्नमंजुषा AI तयार करतो.','purple'],
          ['🎓','AI कौशल्य प्रशिक्षण','Scratch, Python, AI मूलतत्त्वे – सर्व मराठीतून शिकवले जाते.','gold'],
          ['👨‍👩‍👦','पालक कनेक्ट','पालकांना मुलाची प्रगती, उपस्थिती आणि शाळेच्या घोषणा दिसतात.','saffron']
        ].map(f=>`
          <div class="card">
            <div style="font-size:36px;margin-bottom:12px">${f[0]}</div>
            <h3>${f[1]}</h3>
            <p>${f[2]}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- STATS BAR -->
  <section class="stats-bar">
    <div class="container">
      <div class="stats-grid">
        ${[['500+','शाळा जोडल्या'],['50,000+','सक्रिय विद्यार्थी'],['1,200+','शिक्षक'],['35','जिल्हे'],['98%','समाधान दर']].map(s=>`
          <div class="stat-item"><div class="stat-number">${s[0]}</div><div class="stat-label">${s[1]}</div></div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- AUDIENCE SECTIONS -->
  <section class="section">
    <div class="container">
      <div class="grid" style="grid-template-columns:1fr 1fr;gap:48px;align-items:center">
        <div>
          <div class="section-label">विद्यार्थ्यांसाठी</div>
          <h2 class="section-title">स्वतःच्या भाषेत, स्वतःच्या गतीने शिका</h2>
          <p class="section-desc mb-3">मराठीत AI सोबत शंका विचारा, सराव करा, प्रगती पाहा. प्रत्येक पाठ तुमच्या गतीने.</p>
          <div style="display:flex;flex-direction:column;gap:12px">
            ${['24/7 AI शंका निरसन – "साथी" chatbot','स्वतःच्या शब्दांत सांगा – समज तपासा','गेमिफिकेशन – बॅजेस आणि स्ट्रीक्स','Scratch आणि Python शिका मराठीतून'].map(f=>`
              <div style="display:flex;align-items:center;gap:10px"><i class="fa-solid fa-check-circle" style="color:var(--green)"></i><span style="font-size:15px">${f}</span></div>
            `).join('')}
          </div>
          <a class="btn btn-primary mt-3" href="#/students"><i class="fa-solid fa-arrow-right"></i> अधिक जाणा</a>
        </div>
        <div class="card card-gradient" style="padding:32px">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px"><span style="font-size:32px">🤖</span><div><div style="font-weight:700">AI साथी</div><div class="text-muted" style="font-size:13px">तुमचा शिक्षण मित्र</div></div></div>
          <div class="chat-container" style="max-height:200px;padding:8px 0">
            <div class="chat-msg bot">नमस्कार! मी साथी. तुमची शंका विचारा. 🙏</div>
            <div class="chat-msg user">अपूर्णांक म्हणजे काय?</div>
            <div class="chat-msg bot">अपूर्णांक म्हणजे एका पूर्ण भागाचा काही भाग. उदा. ½ म्हणजे अर्धा भाग. यात वरच्या संख्येला 'अंश' आणि खालच्या संख्येला 'छेद' म्हणतात.</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FOR TEACHERS -->
  <section class="section" style="background:var(--surface)">
    <div class="container">
      <div class="grid" style="grid-template-columns:1fr 1fr;gap:48px;align-items:center">
        <div class="card card-navy" style="padding:32px">
          <h3 style="color:#fff;margin-bottom:16px">शिक्षक डॅशबोर्ड</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            ${[['12','प्रकाशित पाठ','fa-book'],['145','विद्यार्थी','fa-users'],['85%','सरासरी गुण','fa-chart-line'],['3','बाकी मसुदे','fa-file-alt']].map(s=>`
              <div style="background:rgba(255,255,255,0.08);padding:14px;border-radius:var(--radius);text-align:center">
                <i class="fa-solid ${s[2]}" style="color:var(--gold);font-size:18px;margin-bottom:6px"></i>
                <div style="font-size:1.5rem;font-weight:800;color:#fff;font-family:var(--font-en)">${s[0]}</div>
                <div style="font-size:12px;color:rgba(255,255,255,0.6)">${s[1]}</div>
              </div>
            `).join('')}
          </div>
        </div>
        <div>
          <div class="section-label">शिक्षकांसाठी</div>
          <h2 class="section-title">तुमचा वेळ वाचवा, शिक्षणावर लक्ष द्या</h2>
          <p class="section-desc mb-3">AI तुमच्यासाठी नोट्स, प्रश्नपत्रिका, गृहपाठ तयार करतो. तुम्ही फक्त तपासा आणि प्रकाशित करा.</p>
          <div style="display:flex;flex-direction:column;gap:12px">
            ${['AI प्रश्नपत्रिका जनरेटर – SSC अभ्यासक्रमानुसार','स्वयंचलित नोट्स तयार करा','वर्गाची प्रगती एका ठिकाणी','उपस्थिती आणि गृहपाठ व्यवस्थापन'].map(f=>`
              <div style="display:flex;align-items:center;gap:10px"><i class="fa-solid fa-check-circle" style="color:var(--green)"></i><span style="font-size:15px">${f}</span></div>
            `).join('')}
          </div>
          <a class="btn btn-primary mt-3" href="#/teachers"><i class="fa-solid fa-arrow-right"></i> अधिक जाणा</a>
        </div>
      </div>
    </div>
  </section>

  <!-- TESTIMONIALS -->
  <section class="section">
    <div class="container">
      <div class="text-center mb-5">
        <div class="section-label">अनुभव</div>
        <h2 class="section-title">शिक्षक आणि विद्यार्थ्यांचे अनुभव</h2>
      </div>
      <div class="grid grid-3">
        ${[
          ['AI साथी मुळे मुलांचा अभ्यास खूप सोपा झाला. मराठीत शंका विचारता येतात हे सर्वात छान वैशिष्ट्य.','सौ. पाटील','शिक्षिका, जि.प. शाळा पुणे','स'],
          ['मला गणित कठीण वाटायचे पण आता AI साथी सोबत सराव करतो. मराठीत समजावून सांगतो!','आर्यन जाधव','विद्यार्थी, इयत्ता ७ वी','आ'],
          ['मुलाची प्रगती रोज पाहता येते. कोणत्या विषयात अडचण आहे ते लगेच कळते.','श्री. देशमुख','पालक','द']
        ].map(t=>`
          <div class="card testimonial-card">
            <div class="quote-icon">"</div>
            <p class="quote-text">${t[0]}</p>
            <div class="quote-author">
              <div class="author-avatar">${t[3]}</div>
              <div><div class="author-name">${t[1]}</div><div class="author-role">${t[2]}</div></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="cta-section">
    <div class="container" style="position:relative;z-index:2">
      <h2>तुमच्या शाळेत AI शिक्षण सुरू करा</h2>
      <p class="section-desc" style="color:rgba(255,255,255,0.65);margin:0 auto 32px;max-width:500px">
        मोफत ३ महिन्यांचा पायलट. कोणतीही बांधिलकी नाही. आज संपर्क करा.
      </p>
      <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
        <a class="btn btn-primary btn-lg" href="#/contact"><i class="fa-solid fa-phone"></i> संपर्क करा</a>
        <a class="btn btn-outline btn-lg" href="#/login" style="border-color:rgba(255,255,255,0.3);color:#fff"><i class="fa-solid fa-play"></i> डेमो पाहा</a>
      </div>
    </div>
  </section>`;
}

function pageAbout(){
  return `
  <section class="section" style="padding-top:120px">
    <div class="container">
      <div class="text-center mb-5">
        <div class="section-label">आमच्याबद्दल</div>
        <h1 class="section-title">MahaSkill AI ची <span class="text-gradient">कथा</span></h1>
        <p class="section-desc">महाराष्ट्रातील मराठी माध्यम शाळांतील विद्यार्थ्यांना AI आणि तंत्रज्ञानाचे कौशल्य देण्याचे ध्येय.</p>
      </div>

      <div class="grid grid-2 mb-5">
        <div class="card card-gradient" style="padding:36px">
          <div style="font-size:40px;margin-bottom:16px">🎯</div>
          <h2>आमचे ध्येय</h2>
          <p style="font-size:16px;line-height:1.8;color:var(--text-2)">महाराष्ट्रातील प्रत्येक मराठी माध्यमाच्या विद्यार्थ्याला त्यांच्या स्वतःच्या भाषेत AI आणि तंत्रज्ञानाचे कौशल्य शिकवणे. शहरी आणि ग्रामीण शाळांमधील डिजिटल दरी मिटवणे.</p>
        </div>
        <div class="card card-navy" style="padding:36px">
          <div style="font-size:40px;margin-bottom:16px">💡</div>
          <h2 style="color:#fff">आमचे दृष्टिकोन</h2>
          <p style="font-size:16px;line-height:1.8">२०३० पर्यंत महाराष्ट्रातील प्रत्येक शाळेत AI-सक्षम शिक्षण. प्रत्येक विद्यार्थी तंत्रज्ञान-साक्षर. प्रत्येक शिक्षक AI-सहाय्यित.</p>
        </div>
      </div>

      <div class="text-center mb-4"><h2>आम्ही का वेगळे आहोत?</h2></div>
      <div class="grid grid-3 mb-5">
        ${[
          ['🗣️','मराठी-प्रथम','सर्व सामग्री मराठीत. विद्यार्थ्यांना स्वतःच्या भाषेत शिकणे सोपे जाते.'],
          ['📚','SSC अभ्यासक्रम','Maharashtra State Board (SSC) अभ्यासक्रमानुसार पूर्णपणे तयार.'],
          ['🏫','ग्रामीण शाळांसाठी','जि.प. आणि महानगरपालिका शाळांसाठी विशेष रचना. कमी बँडविड्थमध्ये चालते.'],
          ['🧠','Bloom\'s Taxonomy','विद्यार्थ्यांची प्रगती स्मरण, आकलन, विश्लेषण अशा पातळ्यांवर ट्रॅक होते.'],
          ['👨‍👩‍👧','पालक सहभाग','पालकांना WhatsApp वर मुलाची प्रगती कळते. शाळा-पालक संवाद वाढतो.'],
          ['🆓','मोफत पायलट','३ महिने मोफत. कोणतीही बांधिलकी किंवा छुपी किंमत नाही.']
        ].map(v=>`
          <div class="card"><div style="font-size:32px;margin-bottom:10px">${v[0]}</div><h3>${v[1]}</h3><p>${v[2]}</p></div>
        `).join('')}
      </div>

      <div class="text-center mb-4"><h2>आमचा संघ</h2></div>
      <div class="grid grid-4">
        ${[['विशाल','Founder & AI Lead','व'],['प्रिया','Education Expert','प्र'],['अमित','Full-Stack Developer','अ'],['सारिका','Content & Marathi Expert','सा']].map(m=>`
          <div class="card text-center" style="padding:32px">
            <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--saffron),var(--gold));display:flex;align-items:center;justify-content:center;color:#fff;font-size:24px;font-weight:700;margin:0 auto 12px">${m[2]}</div>
            <h3 style="font-size:16px">${m[0]}</h3>
            <p style="font-size:13px;margin:0">${m[1]}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>`;
}

function pageCourses(){
  const courses=[
    {icon:'🤖',title:'AI मूलतत्त्वे',desc:'AI म्हणजे काय? Machine Learning, Neural Networks – सर्व मराठीत.',level:'सुरुवात',dur:'८ आठवडे',tag:'saffron'},
    {icon:'🐍',title:'Python प्रोग्रामिंग',desc:'Python भाषा शिका. प्रोग्रामिंगचा पाया मराठीतून.',level:'सुरुवात',dur:'१२ आठवडे',tag:'blue'},
    {icon:'🧩',title:'Scratch कोडिंग',desc:'ड्रॅग-अँड-ड्रॉप करून गेम्स आणि Animation तयार करा.',level:'सर्वांसाठी',dur:'६ आठवडे',tag:'purple'},
    {icon:'🌐',title:'वेबसाइट बनवा',desc:'HTML, CSS, JavaScript शिकून स्वतःची वेबसाइट तयार करा.',level:'मध्यम',dur:'१० आठवडे',tag:'green'},
    {icon:'📊',title:'डेटा सायन्स मराठीत',desc:'डेटा विश्लेषण, चार्ट्स, आणि Pandas शिका.',level:'मध्यम',dur:'८ आठवडे',tag:'gold'},
    {icon:'🤖',title:'Chatbot बनवा',desc:'स्वतःचा AI Chatbot तयार करा! मराठीत बोलणारा.',level:'प्रगत',dur:'६ आठवडे',tag:'saffron'}
  ];
  return `
  <section class="section" style="padding-top:120px">
    <div class="container">
      <div class="text-center mb-5">
        <div class="section-label">AI कौशल्य</div>
        <h1 class="section-title"><span class="text-gradient">AI आणि तंत्रज्ञान</span> कौशल्ये शिका</h1>
        <p class="section-desc">मराठीतून AI, कोडिंग, डेटा सायन्स शिका. इयत्ता ५ वी ते १० वी साठी विशेष अभ्यासक्रम.</p>
      </div>
      <div class="grid grid-3">
        ${courses.map(c=>`
          <div class="card" style="display:flex;flex-direction:column">
            <div style="font-size:40px;margin-bottom:12px">${c.icon}</div>
            <h3>${c.title}</h3>
            <p style="flex:1">${c.desc}</p>
            <div style="display:flex;gap:8px;margin-top:16px;flex-wrap:wrap">
              <span class="tag tag-${c.tag}">${c.level}</span>
              <span class="tag tag-outline"><i class="fa-regular fa-clock"></i> ${c.dur}</span>
            </div>
            <a class="btn btn-outline btn-sm mt-3 w-full" href="#/login">प्रवेश करा</a>
          </div>
        `).join('')}
      </div>
      <div class="text-center mt-4">
        <p class="text-muted">सर्व कोर्सेस मराठीत उपलब्ध | इयत्ता ५ वी ते १० वी</p>
      </div>
    </div>
  </section>`;
}

function pageSchools(){
  return `
  <section class="hero" style="min-height:60vh;padding:140px 0 80px">
    <div class="container" style="position:relative;z-index:2;text-align:center">
      <div class="hero-badge"><i class="fa-solid fa-school"></i> शाळांसाठी</div>
      <h1 class="hero-title" style="max-width:700px;margin:0 auto 20px">तुमच्या शाळेला <span class="highlight">AI-सक्षम</span> बनवा</h1>
      <p class="hero-subtitle" style="margin:0 auto 32px;text-align:center;max-width:550px">MahaSkill AI चे School Copilot तुमच्या शाळेचे शिक्षण, प्रशासन आणि संवाद स्वयंचलित करतो.</p>
      <a class="btn btn-primary btn-lg" href="#/contact"><i class="fa-solid fa-phone"></i> डेमो बुक करा</a>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="text-center mb-5">
        <div class="section-label">शाळा सहायक</div>
        <h2>School Copilot ची वैशिष्ट्ये</h2>
      </div>
      <div class="grid grid-3">
        ${[
          ['fa-brain','AI Teacher Brain™','प्रत्येक शिक्षकाला AI सहाय्यक. नोट्स, प्रश्नपत्रिका, मूल्यमापन स्वयंचलित.','saffron'],
          ['fa-chart-bar','Mastery Tracking','विद्यार्थ्यांची संकल्पना-निहाय प्रगती ट्रॅक करा. फक्त गुण नाही, खरी समज.','blue'],
          ['fa-user-graduate','Student Copilot','प्रत्येक विद्यार्थ्याला वैयक्तिक AI मार्गदर्शक.','green'],
          ['fa-file-alt','Automated Reports','मुख्याध्यापकांसाठी स्वयंचलित अहवाल. इयत्ता, विषय, शिक्षक निहाय.','purple'],
          ['fa-mobile-alt','Parent App','पालकांना मोबाइलवर प्रगती. WhatsApp integration.','gold'],
          ['fa-shield-alt','Data Security','विद्यार्थ्यांचा डेटा सुरक्षित. भारतीय सर्व्हरवर.','navy']
        ].map(f=>`
          <div class="card">
            <div class="card-icon ${f[3]}"><i class="fa-solid ${f[0]}"></i></div>
            <h3>${f[1]}</h3>
            <p>${f[2]}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <section class="section" style="background:var(--surface)">
    <div class="container">
      <div class="text-center mb-5">
        <h2>कोणत्या शाळांसाठी?</h2>
      </div>
      <div class="grid grid-3">
        ${[
          ['🏫','जि.प. शाळा','जिल्हा परिषद शाळांसाठी विशेष पॅकेज. कमी बँडविड्थमध्येही चालते.'],
          ['🏛️','महानगरपालिका शाळा','मुंबई, पुणे, नागपूर इ. महानगरपालिका शाळांसाठी.'],
          ['📖','खाजगी मराठी शाळा','मराठी माध्यमाच्या खाजगी शाळांसाठी premium features.']
        ].map(s=>`
          <div class="card text-center"><div style="font-size:48px;margin-bottom:12px">${s[0]}</div><h3>${s[1]}</h3><p>${s[2]}</p></div>
        `).join('')}
      </div>
    </div>
  </section>`;
}

function pageStudents(){
  return `
  <section class="section" style="padding-top:120px">
    <div class="container">
      <div class="text-center mb-5">
        <div class="section-label">विद्यार्थ्यांसाठी</div>
        <h1 class="section-title">तुमचा <span class="text-gradient">AI शिक्षण मित्र</span></h1>
        <p class="section-desc">स्वतःच्या भाषेत, स्वतःच्या गतीने शिका. AI साथी तुम्हाला मदत करायला सदैव तयार.</p>
      </div>
      <div class="grid grid-3 mb-5">
        ${[
          ['🤖','AI साथी','कधीही, कुठेही शंका विचारा. मराठीत उत्तर मिळवा.'],
          ['📝','स्वतःच्या शब्दांत','पाठ स्वतःच्या शब्दांत लिहा. AI तुम्हाला सांगतो कोणते मुद्दे राहिले.'],
          ['🏆','बॅजेस आणि स्ट्रीक्स','रोज सराव करा, बॅजेस मिळवा. तुमची स्ट्रीक तोडू नका!'],
          ['📊','प्रगती ट्रॅकर','प्रत्येक विषयात किती समजले ते पाहा. कमकुवत विषयांवर लक्ष द्या.'],
          ['🎮','मजेदार क्विझ','प्रत्येक पाठावर मजेदार प्रश्नमंजुषा. खेळता-खेळता शिका.'],
          ['💻','AI कोडिंग शिका','Scratch आणि Python मराठीतून शिका. भविष्यासाठी तयार व्हा.']
        ].map(f=>`
          <div class="card text-center"><div style="font-size:36px;margin-bottom:10px">${f[0]}</div><h3>${f[1]}</h3><p>${f[2]}</p></div>
        `).join('')}
      </div>
    </div>
  </section>`;
}

function pageTeachers(){
  return `
  <section class="section" style="padding-top:120px">
    <div class="container">
      <div class="text-center mb-5">
        <div class="section-label">शिक्षकांसाठी</div>
        <h1 class="section-title">AI तुमचा <span class="text-gradient">शिक्षण सहाय्यक</span></h1>
        <p class="section-desc">प्रशासकीय कामे AI वर सोपवा. शिक्षणावर लक्ष केंद्रित करा.</p>
      </div>
      <div class="grid grid-2 mb-5">
        ${[
          ['fa-wand-magic-sparkles','AI नोट्स जनरेटर','पाठाचा मजकूर दया, AI सोप्या नोट्स तयार करतो. तुम्ही तपासा आणि प्रकाशित करा.','saffron'],
          ['fa-file-circle-question','प्रश्नपत्रिका जनरेटर','SSC अभ्यासक्रमानुसार प्रश्नपत्रिका, युनिट टेस्ट AI तयार करतो.','blue'],
          ['fa-clipboard-check','Answer Sheet Evaluation','विद्यार्थ्यांच्या उत्तरपत्रिका AI मदतीने तपासा.','green'],
          ['fa-users','वर्ग विश्लेषण','प्रत्येक विद्यार्थी कोणत्या संकल्पनेत अडकला आहे ते पाहा.','purple']
        ].map(f=>`
          <div class="card" style="display:flex;gap:16px;align-items:flex-start">
            <div class="card-icon ${f[3]}" style="flex-shrink:0"><i class="fa-solid ${f[0]}"></i></div>
            <div><h3>${f[1]}</h3><p>${f[2]}</p></div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>`;
}

function pageParents(){
  return `
  <section class="section" style="padding-top:120px">
    <div class="container">
      <div class="text-center mb-5">
        <div class="section-label">पालकांसाठी</div>
        <h1 class="section-title">मुलाची <span class="text-gradient">प्रगती पाहा</span></h1>
        <p class="section-desc">शाळेतील प्रत्येक गोष्ट तुमच्या मोबाइलवर. उपस्थिती, गुण, गृहपाठ – सर्व काही.</p>
      </div>
      <div class="grid grid-3 mb-5">
        ${[
          ['📈','प्रगती अहवाल','विषयनिहाय प्रगती रोज पाहा. कोणत्या विषयात मदत हवी ते कळा.'],
          ['📅','उपस्थिती','रोजची उपस्थिती पाहा. गैरहजेरीची लगेच सूचना.'],
          ['📢','शाळेच्या घोषणा','मुख्याध्यापक आणि शिक्षकांच्या सर्व घोषणा वाचा.'],
          ['📱','WhatsApp सूचना','महत्त्वाच्या सूचना WhatsApp वर मिळवा.'],
          ['📝','गृहपाठ ट्रॅकिंग','कोणता गृहपाठ बाकी आहे ते पाहा.'],
          ['💬','शिक्षकांशी संवाद','शिक्षकांना थेट संदेश पाठवा.']
        ].map(f=>`
          <div class="card"><div style="font-size:32px;margin-bottom:10px">${f[0]}</div><h3>${f[1]}</h3><p>${f[2]}</p></div>
        `).join('')}
      </div>
    </div>
  </section>`;
}

function pagePricing(){
  const plans=[
    {name:'पायलट',price:'मोफत',period:'३ महिने',features:['एका शाळेसाठी','५ शिक्षक खाती','२०० विद्यार्थी','मूलभूत AI वैशिष्ट्ये','ईमेल सहाय्य'],highlight:false},
    {name:'शाळा',price:'₹५,०००',period:'दरमहा',features:['एका शाळेसाठी','अमर्याद शिक्षक','अमर्याद विद्यार्थी','सर्व AI वैशिष्ट्ये','पालक ऍप','प्राधान्य सहाय्य','AI कौशल्य कोर्सेस'],highlight:true,popular:true},
    {name:'जिल्हा / तालुका',price:'संपर्क करा',period:'सानुकूल',features:['अनेक शाळा','एकत्रित डॅशबोर्ड','सानुकूल अहवाल','ऑनसाइट प्रशिक्षण','समर्पित खाते व्यवस्थापक','API integration'],highlight:false}
  ];
  return `
  <section class="section" style="padding-top:120px">
    <div class="container">
      <div class="text-center mb-5">
        <div class="section-label">किंमत</div>
        <h1 class="section-title">सोपी, पारदर्शक <span class="text-gradient">किंमत</span></h1>
        <p class="section-desc">मोफत पायलट पासून सुरुवात करा. कोणतीही छुपी किंमत नाही.</p>
      </div>
      <div class="grid grid-3" style="max-width:960px;margin:0 auto">
        ${plans.map(p=>`
          <div class="card pricing-card${p.highlight?' card-highlight':''}">
            ${p.popular?'<div class="pricing-popular">लोकप्रिय</div>':''}
            <div class="plan-name">${p.name}</div>
            <div class="plan-price">${p.price}</div>
            <div class="plan-period">${p.period}</div>
            <ul class="plan-features">
              ${p.features.map(f=>`<li><i class="fa-solid fa-check"></i>${f}</li>`).join('')}
            </ul>
            <a class="btn ${p.highlight?'btn-primary':'btn-outline'} btn-block" href="#/contact">${p.price==='मोफत'?'मोफत सुरू करा':'संपर्क करा'}</a>
          </div>
        `).join('')}
      </div>
    </div>
  </section>`;
}

function pageContact(){
  return `
  <section class="section" style="padding-top:120px">
    <div class="container">
      <div class="text-center mb-5">
        <div class="section-label">संपर्क</div>
        <h1 class="section-title">आमच्याशी <span class="text-gradient">संपर्क</span> साधा</h1>
        <p class="section-desc">तुमच्या शाळेसाठी मोफत डेमो बुक करा किंवा कोणताही प्रश्न विचारा.</p>
      </div>
      <div class="grid grid-2" style="max-width:900px;margin:0 auto;align-items:start">
        <div class="card" style="padding:32px">
          <h3 class="mb-3">संदेश पाठवा</h3>
          <div class="form-group"><label class="form-label">तुमचे नाव *</label><input class="form-input" id="c-name" placeholder="उदा. विशाल पाटील"></div>
          <div class="form-group"><label class="form-label">मोबाइल नंबर *</label><input class="form-input" id="c-phone" placeholder="उदा. 9876543210"></div>
          <div class="form-group"><label class="form-label">शाळेचे नाव</label><input class="form-input" id="c-school" placeholder="उदा. जि.प. शाळा, पुणे"></div>
          <div class="form-group"><label class="form-label">तुमची भूमिका</label>
            <select class="form-select" id="c-role"><option>शिक्षक</option><option>मुख्याध्यापक</option><option>पालक</option><option>विद्यार्थी</option><option>इतर</option></select>
          </div>
          <div class="form-group"><label class="form-label">संदेश</label><textarea class="form-textarea" id="c-msg" placeholder="तुमची शंका किंवा डेमोची विनंती लिहा..."></textarea></div>
          <button class="btn btn-primary btn-block" onclick="submitContact()"><i class="fa-solid fa-paper-plane"></i> संदेश पाठवा</button>
        </div>
        <div>
          <div class="card mb-3" style="padding:28px">
            <h3 class="mb-2"><i class="fa-solid fa-map-marker-alt text-saffron"></i> कार्यालय</h3>
            <p style="font-size:15px;color:var(--text-2)">पुणे, महाराष्ट्र, भारत</p>
          </div>
          <div class="card mb-3" style="padding:28px">
            <h3 class="mb-2"><i class="fa-solid fa-envelope text-saffron"></i> ईमेल</h3>
            <p style="font-size:15px;color:var(--text-2)">contact@mahaskillai.in</p>
          </div>
          <div class="card mb-3" style="padding:28px">
            <h3 class="mb-2"><i class="fa-solid fa-phone text-saffron"></i> फोन</h3>
            <p style="font-size:15px;color:var(--text-2)">+91 98765 43210</p>
          </div>
          <div class="card" style="padding:28px">
            <h3 class="mb-2"><i class="fa-solid fa-clock text-saffron"></i> कार्यालयीन वेळ</h3>
            <p style="font-size:15px;color:var(--text-2)">सोमवार – शनिवार: सकाळी ९ ते संध्याकाळी ६</p>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}
function submitContact(){
  const n=$('#c-name').value.trim();const p=$('#c-phone').value.trim();
  if(!n||!p)return toast('कृपया नाव आणि मोबाइल नंबर भरा.','error');
  toast('तुमचा संदेश यशस्वीरीत्या नोंदवला! आम्ही लवकरच संपर्क करू.','success');
  ['c-name','c-phone','c-school','c-msg'].forEach(i=>{const el=$('#'+i);if(el)el.value=''});
}

function pageLogin(){
  return `
  <section class="section" style="padding-top:120px">
    <div class="container">
      <div class="text-center mb-5">
        <div class="section-label">प्रवेश</div>
        <h1 class="section-title">MahaSkill AI मध्ये <span class="text-gradient">प्रवेश करा</span></h1>
        <p class="section-desc">डेमो आवृत्ती — भूमिका निवडा. पूर्ण आवृत्तीत मोबाईल OTP प्रवेश असेल.</p>
      </div>
      <div class="grid grid-4" style="max-width:960px;margin:0 auto">
        ${[
          ['s','👨‍🎓','विद्यार्थी','पाठ वाचा, सराव करा, AI साथीशी बोला','saffron'],
          ['t','👨‍🏫','शिक्षक','पाठ तयार करा, वर्गाची प्रगती पाहा','blue'],
          ['p','🏫','मुख्याध्यापक','शाळेचा आढावा, अहवाल, सेटिंग्ज','purple'],
          ['g','👨‍👩‍👦','पालक','मुलाची प्रगती, उपस्थिती, घोषणा','green']
        ].map(r=>`
          <div class="card text-center" style="padding:32px;cursor:pointer" onclick="enterDash('${r[0]}')">
            <div style="font-size:48px;margin-bottom:12px">${r[1]}</div>
            <h3>${r[2]}</h3>
            <p style="font-size:14px">${r[3]}</p>
            <button class="btn btn-primary btn-sm btn-block mt-3">प्रवेश करा</button>
          </div>
        `).join('')}
      </div>
    </div>
  </section>`;
}
function enterDash(role){setRole(role);location.hash=`#/${role}/dash`}
function exitDash(){clearRole();location.hash='#/'}

// ===== STUDENT DASHBOARD =====
function studentDash(){
  return `<h2 class="mb-1">नमस्कार रोहन! 👋</h2><p class="text-muted mb-3">इयत्ता ७ वी · जि.प. प्राथमिक शाळा, पुणे</p>
  <div class="dash-stats">${statCard(pubLessons().length,'उपलब्ध पाठ','book-open','saffron')}${statCard(pendingHw(),'बाकी गृहपाठ','clipboard-list','blue')}${statCard(avgScore()+'%','सरासरी गुण','chart-line','green')}${statCard('🔥 5','दिवसांची स्ट्रीक','fire','gold')}</div>
  <div class="grid grid-2">
    <div class="card"><h3 class="mb-2">📢 ताज्या घोषणा</h3>${D.announcements.length?D.announcements.slice(-2).reverse().map(a=>`<div class="ann-item" style="padding:10px 0"><div class="ann-by">${esc(a.by)} <span class="ann-date">${esc(a.date)}</span></div><div class="ann-text">${esc(a.text)}</div></div>`).join(''):'<p class="text-muted">अजून कोणतीही घोषणा नाही.</p>'}</div>
    <div class="card"><h3 class="mb-2">📚 बाकी गृहपाठ</h3>${D.homework.filter(h=>!h.done).slice(0,3).map(h=>`<div class="hw-item"><div><div style="font-weight:600;font-size:14px">${esc(h.title)}</div><div style="font-size:12px;color:var(--text-muted)">${esc(h.subj)} · अंतिम: ${esc(h.due)}</div></div></div>`).join('')||'<p class="text-muted">सर्व गृहपाठ पूर्ण!</p>'}</div>
  </div>`;
}

function studentLessons(id){
  if(!id){
    return `<h2 class="mb-3">माझे पाठ</h2>
    ${pubLessons().length?`<div class="grid grid-3">${pubLessons().map(l=>`
      <div class="card"><span class="tag tag-saffron">${esc(l.subj)}</span><span class="tag tag-outline" style="margin-left:4px">${esc(l.grade||'७ वी')}</span>
      <h3 style="margin-top:10px">${esc(l.title)}</h3><p>${l.notes.length} नोट्स · ${l.quiz.length} प्रश्न</p>
      <a class="btn btn-primary btn-sm mt-2" href="#/s/lessons/${l.id}">पाठ उघडा</a></div>
    `).join('')}</div>`:'<div class="card"><p class="text-muted">शिक्षकांनी पाठ प्रकाशित केल्यावर ते इथे दिसतील.</p></div>'}`;
  }
  const l=D.lessons.find(x=>x.id==id&&x.pub);
  if(!l)return '<p>पाठ सापडला नाही. <a href="#/s/lessons">← सर्व पाठ</a></p>';
  return `
  <a href="#/s/lessons" style="color:var(--saffron);font-size:14px"><i class="fa-solid fa-arrow-left"></i> सर्व पाठ</a>
  <div style="display:flex;align-items:center;gap:12px;margin:12px 0 20px;flex-wrap:wrap">
    <h2 style="margin:0">${esc(l.title)}</h2><span class="tag tag-saffron">${esc(l.subj)}</span>
  </div>
  <div class="card mb-3"><h3 class="mb-2">📖 नोट्स</h3><ul style="padding-left:20px">${l.notes.map(n=>`<li style="margin-bottom:8px;font-size:15px;line-height:1.7">${esc(n)}</li>`).join('')}</ul></div>
  <div class="card mb-3"><h3 class="mb-3">📝 सराव प्रश्नमंजुषा</h3>
    ${l.quiz.map((q,i)=>`<div class="quiz-question"><div class="q-text">${i+1}. ${esc(q.q)}</div>
      ${q.o.map((o,j)=>`<label class="quiz-option"><input type="radio" name="q${i}" value="${j}"> ${esc(o)}</label>`).join('')}
    </div>`).join('')}
    <button class="btn btn-primary mt-3" onclick="checkQuiz(${l.id})"><i class="fa-solid fa-check"></i> उत्तरे तपासा</button>
    <span id="quiz-result" style="margin-left:12px;font-weight:600"></span>
  </div>
  <div class="card"><h3 class="mb-2">✍️ स्वतःच्या शब्दांत सांगा</h3>
    <p class="text-muted" style="font-size:14px;margin-bottom:8px">या पाठात तुम्ही काय शिकलात ते स्वतःच्या शब्दांत लिहा. AI तुम्हाला सांगेल कोणते मुद्दे राहिले.</p>
    <textarea class="form-textarea" id="own-words" placeholder="या पाठात मी शिकलो की…"></textarea>
    <button class="btn btn-outline btn-sm mt-2" onclick="checkOwnWords(${l.id})"><i class="fa-solid fa-brain"></i> तपासा</button>
    <div id="own-words-result" class="mt-2"></div>
  </div>`;
}
function checkQuiz(id){
  const l=D.lessons.find(x=>x.id===id);let c=0,all=true;
  l.quiz.forEach((q,i)=>{const v=document.querySelector(`input[name=q${i}]:checked`);if(!v)all=false;else if(+v.value===q.a)c++});
  if(!all)return($('#quiz-result').innerHTML='<span class="text-danger">सर्व प्रश्नांची उत्तरे निवडा.</span>');
  const pct=Math.round(100*c/l.quiz.length);
  D.results.push({who:'रोहन',lesson:l.title,subj:l.subj,score:pct,date:today()});save();
  $('#quiz-result').innerHTML=`<span class="${pct>=60?'text-success':'text-danger'}">तुमचा गुण: ${c}/${l.quiz.length} (${pct}%)</span>`;
  toast(pct>=60?'छान! चांगले गुण!':'अजून सराव करा!',pct>=60?'success':'info');
}
function checkOwnWords(id){
  const a=$('#own-words').value.trim();
  if(a.length<10)return($('#own-words-result').innerHTML='<span class="text-danger">किमान एक-दोन वाक्ये लिहा.</span>');
  const r=AI.feedback(a,D.lessons.find(x=>x.id===id).notes);
  $('#own-words-result').innerHTML=`
    ${labeledProgress('समजलेले मुद्दे',r.pct,r.pct>=70?'green':'saffron')}
    ${r.missed.length?`<p style="font-size:14px">राहिलेले मुद्दे: <span class="text-danger">${r.missed.map(esc).join(', ')}</span></p>`:'<p class="text-success" style="font-size:14px">🎉 छान! सर्व मुख्य मुद्दे आले.</p>'}`;
}

function studentHomework(){
  return `<h2 class="mb-3">माझे गृहपाठ</h2>
  <div class="card">${D.homework.length?D.homework.map(h=>`
    <div class="hw-item${h.done?' done':''}">
      <input type="checkbox" ${h.done?'checked':''} onchange="toggleHw(${h.id})">
      <div style="flex:1"><div class="hw-title" style="font-weight:600;font-size:15px">${esc(h.title)}</div>
      <div style="font-size:13px;color:var(--text-muted)">${esc(h.subj)} · अंतिम तारीख: ${esc(h.due)}</div></div>
      <span class="tag tag-${h.done?'green':'saffron'}">${h.done?'पूर्ण':'बाकी'}</span>
    </div>
  `).join(''):'<p class="text-muted">गृहपाठ नाही.</p>'}</div>`;
}
function toggleHw(id){const h=D.homework.find(x=>x.id===id);h.done=h.done?0:1;save();toast(h.done?'गृहपाठ पूर्ण!':'गृहपाठ बाकी म्हणून चिन्हांकित','success');render()}

function studentProgress(){
  const subjects=[['गणित',72,'saffron'],['विज्ञान',64,'blue'],['इतिहास',81,'green'],['मराठी',88,'purple']];
  const myResults=D.results.filter(x=>x.who==='रोहन');
  return `<h2 class="mb-3">माझी प्रगती</h2>
  <div class="grid grid-2">
    <div class="card"><h3 class="mb-3">विषयनिहाय प्रगती</h3>${subjects.map(s=>labeledProgress(s[0],s[1],s[2])).join('')}<p class="text-muted" style="font-size:13px;margin-top:8px">* आकडे नमुना + तुमच्या प्रश्नमंजुषा गुणांवर आधारित</p></div>
    <div class="card"><h3 class="mb-3">🏆 माझे बॅजेस</h3>
      <div style="display:flex;gap:16px;flex-wrap:wrap">
        ${[['🔥','५ दिवसांची स्ट्रीक'],['⭐','पहिली प्रश्नमंजुषा'],['📚','१० पाठ पूर्ण'],['🧠','AI साथी वापरला']].map(b=>`
          <div style="text-align:center;padding:12px;background:var(--surface-2);border-radius:var(--radius);min-width:80px">
            <div style="font-size:28px">${b[0]}</div><div style="font-size:11px;color:var(--text-muted);margin-top:4px">${b[1]}</div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
  <div class="card mt-3"><h3 class="mb-2">सोडवलेल्या प्रश्नमंजुषा</h3>
  ${myResults.length?tableWrap(['पाठ','विषय','गुण','तारीख'],myResults.map(r=>[esc(r.lesson),esc(r.subj),`<span class="${r.score>=60?'text-success':'text-danger'}">${r.score}%</span>`,esc(r.date||'')])):'<p class="text-muted">अजून प्रश्नमंजुषा सोडवलेली नाही. <a href="#/s/lessons" style="color:var(--saffron)">पाठ उघडा</a>.</p>'}
  </div>`;
}

let chatHistory=[{me:false,t:'नमस्कार! मी AI साथी 🤖 तुमची पाठाबद्दलची शंका विचारा.'}];
function studentAsk(){
  return `<h2 class="mb-3">AI साथी – शंका विचारा</h2>
  <div class="card" style="padding:0;overflow:hidden">
    <div style="background:linear-gradient(135deg,var(--saffron),var(--gold));padding:16px 20px;color:#fff">
      <div style="display:flex;align-items:center;gap:10px"><span style="font-size:24px">🤖</span><div><div style="font-weight:700">AI साथी</div><div style="font-size:12px;opacity:0.8">तुमचा शिक्षण मित्र · २४/७ उपलब्ध</div></div></div>
    </div>
    <div class="chat-container" id="chat-box">${chatHistory.map(m=>`<div class="chat-msg ${m.me?'user':'bot'}">${esc(m.t)}</div>`).join('')}</div>
    <div class="chat-input-wrap">
      <input class="form-input" id="chat-input" placeholder="तुमची शंका इथे लिहा..." onkeydown="if(event.key==='Enter')sendChat()" style="margin:0;border:none;background:var(--surface-2)">
      <button class="btn btn-primary btn-sm" onclick="sendChat()"><i class="fa-solid fa-paper-plane"></i></button>
    </div>
  </div>
  <p class="text-muted mt-2" style="font-size:13px"><i class="fa-solid fa-info-circle"></i> उत्तर शिक्षकांनी प्रकाशित केलेल्या पाठांतूनच दिले जाते.</p>`;
}
function sendChat(){
  const q=$('#chat-input').value.trim();if(!q)return;
  chatHistory.push({me:true,t:q},{me:false,t:AI.answer(q)});render();
  setTimeout(()=>{const box=$('#chat-box');if(box)box.scrollTop=box.scrollHeight},100);
}

function studentProfile(){
  return `<h2 class="mb-3">माझे प्रोफाइल</h2>
  <div class="grid grid-2">
    <div class="card" style="padding:32px;text-align:center">
      <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,var(--saffron),var(--gold));display:flex;align-items:center;justify-content:center;color:#fff;font-size:32px;font-weight:700;margin:0 auto 16px">रो</div>
      <h3>रोहन पाटील</h3>
      <p class="text-muted">इयत्ता ७ वी · हजेरी क्र. १४</p>
      <div style="display:flex;gap:8px;justify-content:center;margin-top:12px">
        <span class="tag tag-saffron">विद्यार्थी</span><span class="tag tag-green">सक्रिय</span>
      </div>
    </div>
    <div class="card">
      ${tableWrap(['माहिती','तपशील'],[['नाव','रोहन पाटील'],['इयत्ता','७ वी'],['हजेरी क्रमांक','१४'],['शाळा',esc(D.school.name)],['माध्यम',esc(D.school.medium)],['जिल्हा',esc(D.school.district||'पुणे')]])}
    </div>
  </div>`;
}

// ===== TEACHER DASHBOARD =====
function teacherDash(){
  return `<h2 class="mb-1">शिक्षक डॅशबोर्ड</h2><p class="text-muted mb-3">सौ. देशमुख · गणित</p>
  <div class="dash-stats">${statCard(D.lessons.filter(l=>!l.pub).length,'तपासायचे मसुदे','file-alt','gold')}${statCard(pubLessons().length,'प्रकाशित पाठ','book-open','green')}${statCard(D.homework.length,'दिलेले गृहपाठ','clipboard-list','blue')}${statCard('82%','वर्ग सरासरी','chart-line','purple')}</div>
  <div class="grid grid-2">
    <a class="card" href="#/t/new" style="text-align:center;padding:32px;cursor:pointer;border:2px dashed var(--saffron)">
      <i class="fa-solid fa-plus-circle" style="font-size:36px;color:var(--saffron);margin-bottom:10px"></i><h3>नवीन पाठ तयार करा</h3><p>AI मदतीने नोट्स आणि प्रश्न तयार करा</p>
    </a>
    <a class="card" href="#/t/att" style="text-align:center;padding:32px;cursor:pointer">
      <i class="fa-solid fa-calendar-check" style="font-size:36px;color:var(--blue);margin-bottom:10px"></i><h3>उपस्थिती घ्या</h3><p>आजची उपस्थिती नोंदवा</p>
    </a>
  </div>`;
}

function teacherNewLesson(){
  return `<h2 class="mb-3">नवीन पाठ तयार करा</h2>
  <div class="card" style="max-width:640px;padding:32px">
    <div class="form-group"><label class="form-label">पाठाचे नाव *</label><input class="form-input" id="ln" placeholder="उदा. अपूर्णांक"></div>
    <div class="form-group"><label class="form-label">विषय *</label>
      <select class="form-select" id="ls"><option>गणित</option><option>विज्ञान</option><option>इतिहास</option><option>मराठी</option><option>भूगोल</option><option>इंग्रजी</option></select>
    </div>
    <div class="form-group"><label class="form-label">इयत्ता</label>
      <select class="form-select" id="lg"><option>५ वी</option><option>६ वी</option><option>७ वी</option><option>८ वी</option><option>९ वी</option><option>१० वी</option></select>
    </div>
    <div class="form-group"><label class="form-label">पाठाचा मजकूर *</label>
      <textarea class="form-textarea" id="lt" rows="6" placeholder="पाठातील मजकूर येथे टाका. प्रत्येक वाक्य '.' किंवा '।' ने संपवा. AI नोट्स आणि प्रश्न तयार करेल."></textarea>
    </div>
    <button class="btn btn-primary" onclick="generateLesson()"><i class="fa-solid fa-wand-magic-sparkles"></i> AI नोट्स व प्रश्न तयार करा</button>
    <p class="text-muted mt-2" style="font-size:13px">डेमो: मजकूरातून वाक्ये काढली जातात. खऱ्या AI साठी बॅकएंड पुढच्या टप्प्यात.</p>
  </div>`;
}
function generateLesson(){
  const t=$('#ln').value.trim(),x=$('#lt').value.trim();
  if(!t||x.length<20)return toast('पाठाचे नाव आणि थोडा मजकूर द्या.','error');
  const r=AI.gen(t,x);if(!r.notes.length)return toast('मजकुरात पुरेशी वाक्ये नाहीत.','error');
  D.lessons.push({id:Date.now(),subj:$('#ls').value,title:t,grade:$('#lg').value,pub:0,...r});save();
  toast('मसुदा तयार झाला! तपासून प्रकाशित करा.','success');location.hash='#/t/lessons';
}

function teacherLessons(){
  return `<h2 class="mb-3">माझे पाठ</h2>
  <div class="card">${D.lessons.length?D.lessons.map(l=>`
    <div style="padding:16px 0;border-bottom:1px solid var(--border-light);display:flex;align-items:flex-start;gap:16px;flex-wrap:wrap">
      <div style="flex:1;min-width:200px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
          <span style="font-weight:700">${esc(l.title)}</span>
          <span class="tag tag-outline">${esc(l.subj)}</span>
          <span class="tag tag-${l.pub?'green':'gold'}">${l.pub?'प्रकाशित':'मसुदा'}</span>
        </div>
        <div class="text-muted" style="font-size:13px">${l.notes.length} नोट्स · ${l.quiz.length} प्रश्न</div>
        ${!l.pub?`<div style="margin-top:8px;font-size:14px;color:var(--text-2)"><ul style="padding-left:18px">${l.notes.slice(0,3).map(n=>`<li>${esc(n)}</li>`).join('')}</ul></div>`:''}
      </div>
      <div style="display:flex;gap:8px">
        ${!l.pub?`<button class="btn btn-primary btn-sm" onclick="publishLesson(${l.id})"><i class="fa-solid fa-check"></i> प्रकाशित करा</button>`:''}
        <button class="btn btn-ghost btn-sm" onclick="deleteLesson(${l.id})" style="color:var(--red)"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>
  `).join(''):'<p class="text-muted">पाठ नाहीत. <a href="#/t/new" style="color:var(--saffron)">नवीन पाठ तयार करा</a>.</p>'}</div>`;
}
function publishLesson(id){D.lessons.find(l=>l.id===id).pub=1;save();toast('पाठ प्रकाशित झाला!','success');render()}
function deleteLesson(id){D.lessons=D.lessons.filter(l=>l.id!==id);save();toast('पाठ काढून टाकला.','info');render()}

function teacherClass(){
  const roster=[['सई',82,'—'],['आर्यन',54,'अपूर्णांक'],['प्रिया',91,'—'],['ओम',47,'सजीवांचे वर्गीकरण'],['रोहन',avgScore(),'—']];
  return `<h2 class="mb-3">वर्ग प्रगती – इयत्ता ७ वी</h2>
  <div class="card">
    ${tableWrap(['विद्यार्थी','सरासरी गुण','प्रगती','मदत हवी'],roster.map(r=>[
      `<div style="display:flex;align-items:center;gap:10px"><div style="width:32px;height:32px;border-radius:50%;background:var(--saffron-light);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:var(--saffron)">${r[0][0]}</div>${r[0]}</div>`,
      `<span style="font-weight:700;font-family:var(--font-en)">${r[1]}%</span>`,
      `<div style="width:100px">${progressBar(r[1],r[1]>=60?'green':'saffron')}</div>`,
      r[2]==='—'?'<span class="text-success">—</span>':`<span class="text-danger">${r[2]}</span>`
    ]))}
  </div>`;
}

function teacherHomework(){
  return `<h2 class="mb-3">गृहपाठ व्यवस्थापन</h2>
  <div class="grid grid-2">
    <div class="card" style="padding:28px">
      <h3 class="mb-3">नवीन गृहपाठ द्या</h3>
      <div class="form-group"><label class="form-label">गृहपाठाचे नाव</label><input class="form-input" id="hw-name" placeholder="उदा. स्वाध्याय ३.२"></div>
      <div class="form-group"><label class="form-label">विषय</label><select class="form-select" id="hw-subj"><option>गणित</option><option>विज्ञान</option><option>इतिहास</option><option>मराठी</option></select></div>
      <div class="form-group"><label class="form-label">अंतिम तारीख</label><input class="form-input" id="hw-date" type="date"></div>
      <button class="btn btn-primary btn-block" onclick="addHomework()"><i class="fa-solid fa-plus"></i> गृहपाठ द्या</button>
    </div>
    <div class="card" style="padding:28px">
      <h3 class="mb-2">दिलेले गृहपाठ</h3>
      ${D.homework.map(h=>`<div class="hw-item"><div style="flex:1"><div style="font-weight:600;font-size:14px">${esc(h.title)}</div><div style="font-size:12px;color:var(--text-muted)">${esc(h.subj)} · ${esc(h.due)}</div></div><span class="tag tag-${h.done?'green':'gold'}">${h.done?'पूर्ण':'बाकी'}</span></div>`).join('')}
    </div>
  </div>`;
}
function addHomework(){
  const t=$('#hw-name').value.trim(),d=$('#hw-date').value;
  if(!t||!d)return toast('नाव आणि तारीख भरा.','error');
  D.homework.push({id:Date.now(),subj:$('#hw-subj').value,title:t,due:d,done:0});save();
  toast('गृहपाठ दिला!','success');render();
}

function teacherAttendance(){
  const a=D.attendance[today()]||{};
  return `<h2 class="mb-3">उपस्थिती – ${today()}</h2>
  <div class="card" style="max-width:500px;padding:28px">
    ${STUDENTS.map(n=>`
      <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border-light)">
        <input type="checkbox" id="att_${n}" ${a[n]?'checked':''} style="width:20px;height:20px;accent-color:var(--saffron)">
        <div style="width:36px;height:36px;border-radius:50%;background:var(--saffron-light);display:flex;align-items:center;justify-content:center;font-weight:600;font-size:14px;color:var(--saffron)">${n[0]}</div>
        <label for="att_${n}" style="flex:1;cursor:pointer;font-weight:500">${n}</label>
      </div>
    `).join('')}
    <button class="btn btn-primary btn-block mt-3" onclick="saveAttendance()"><i class="fa-solid fa-save"></i> उपस्थिती जतन करा</button>
  </div>`;
}
function saveAttendance(){
  const a={};STUDENTS.forEach(n=>a[n]=$('#att_'+n).checked);
  D.attendance[today()]=a;save();toast('उपस्थिती जतन झाली!','success');
}

function announcementsPage(by){
  return `<h2 class="mb-3">घोषणा</h2>
  <div class="grid grid-2">
    <div class="card" style="padding:28px">
      <h3 class="mb-2">नवीन घोषणा</h3>
      <textarea class="form-textarea" id="ann-text" rows="4" placeholder="घोषणेचा मजकूर लिहा..."></textarea>
      <button class="btn btn-primary btn-block mt-2" onclick="postAnnouncement('${by}')"><i class="fa-solid fa-bullhorn"></i> घोषणा प्रकाशित करा</button>
    </div>
    <div class="card" style="padding:0">
      <div style="padding:16px 20px;border-bottom:1px solid var(--border)"><h3 style="margin:0">आतापर्यंतच्या घोषणा</h3></div>
      ${D.announcements.length?D.announcements.slice().reverse().map(a=>`
        <div class="ann-item"><div class="ann-by">${esc(a.by)} <span class="ann-date">${esc(a.date)}</span></div><div class="ann-text">${esc(a.text)}</div></div>
      `).join(''):'<p class="text-muted" style="padding:20px">अजून कोणतीही घोषणा नाही.</p>'}
    </div>
  </div>`;
}
function postAnnouncement(by){
  const t=$('#ann-text').value.trim();if(!t)return toast('घोषणेचा मजकूर लिहा.','error');
  D.announcements.push({id:Date.now(),by,date:today(),text:t});save();
  toast('घोषणा प्रकाशित झाली!','success');render();
}

// ===== PRINCIPAL DASHBOARD =====
function principalDash(){
  const classData=[['५ वी',88],['६ वी',74],['७ वी',avgScore()],['८ वी',61]];
  return `<h2 class="mb-1">शाळा आढावा</h2><p class="text-muted mb-3">${esc(D.school.name)}</p>
  <div class="dash-stats">${statCard(240+D.results.length,'नोंदणीकृत विद्यार्थी','users','saffron')}${statCard(pubLessons().length,'प्रकाशित पाठ','book-open','green')}${statCard(avgScore()+'%','सरासरी गुण','chart-line','blue')}${statCard('4','शिक्षक','chalkboard-user','purple')}</div>
  <div class="grid grid-2">
    <div class="card"><h3 class="mb-3">इयत्तानिहाय सहभाग</h3>${classData.map(c=>labeledProgress('इयत्ता '+c[0],c[1],c[1]>=70?'green':'saffron')).join('')}</div>
    <div class="card"><h3 class="mb-3">ताज्या क्रियाकलाप</h3>
      <div style="display:flex;flex-direction:column;gap:12px">
        ${[['📝','नवीन पाठ प्रकाशित – अपूर्णांक','आज'],['📊','वर्ग ७ वी प्रश्नमंजुषा पूर्ण','काल'],['👨‍🏫','सौ. देशमुख – ३ नवीन पाठ','२ दिवसांपूर्वी'],['📢','नवीन घोषणा प्रकाशित','३ दिवसांपूर्वी']].map(a=>`
          <div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid var(--border-light)">
            <span style="font-size:20px">${a[0]}</span><div style="flex:1;font-size:14px">${a[1]}</div><span class="text-muted" style="font-size:12px">${a[2]}</span>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
  <button class="btn btn-ghost btn-sm mt-3" onclick="resetData()" style="color:var(--text-muted)"><i class="fa-solid fa-rotate-left"></i> डेमो डेटा पुन्हा सुरू करा</button>`;
}
function resetData(){try{localStorage.removeItem(STORE_KEY)}catch(e){}D=defaultData();toast('डेटा पुन्हा सुरू केला.','info');render()}

function principalTeachers(){
  return `<h2 class="mb-3">शिक्षक</h2>
  <div class="card">
    ${tableWrap(['नाव','विषय','प्रकाशित पाठ','सक्रियता'],[
      ['सौ. देशमुख','गणित',D.lessons.filter(l=>l.pub&&l.subj==='गणित').length,'<span class="tag tag-green">उच्च</span>'],
      ['श्री. जाधव','विज्ञान',D.lessons.filter(l=>l.pub&&l.subj==='विज्ञान').length,'<span class="tag tag-gold">मध्यम</span>'],
      ['श्री. कुलकर्णी','इतिहास',D.lessons.filter(l=>l.pub&&l.subj==='इतिहास').length,'<span class="tag tag-gold">मध्यम</span>'],
      ['सौ. पवार','मराठी',D.lessons.filter(l=>l.pub&&l.subj==='मराठी').length,'<span class="tag tag-saffron">कमी</span>']
    ])}
  </div>`;
}

function principalClasses(){
  const classData=[['५ वी',62,88,'सौ. शिंदे'],['६ वी',58,74,'श्री. गायकवाड'],['७ वी',60,avgScore(),'सौ. देशमुख'],['८ वी',60,61,'श्री. जाधव']];
  return `<h2 class="mb-3">वर्ग</h2>
  <div class="card">${tableWrap(['इयत्ता','विद्यार्थी','सरासरी','वर्गशिक्षक'],classData.map(c=>[c[0],c[1],`<span style="font-weight:700">${c[2]}%</span> ${progressBar(c[2],c[2]>=70?'green':'saffron')}`,c[3]]))}</div>`;
}

function principalReports(){
  return `<h2 class="mb-3">अहवाल</h2>
  <div class="card mb-3">
    ${tableWrap(['निर्देशक','मूल्य'],[
      ['प्रकाशित पाठ',pubLessons().length],['सोडवलेल्या प्रश्नमंजुषा',D.results.length],
      ['सरासरी गुण',avgScore()+'%'],['मदत हवी असलेले विद्यार्थी','2'],['एकूण गृहपाठ',D.homework.length],['एकूण घोषणा',D.announcements.length]
    ])}
    <button class="btn btn-outline mt-3" onclick="window.print()"><i class="fa-solid fa-print"></i> अहवाल छापा</button>
  </div>`;
}

function principalSettings(){
  return `<h2 class="mb-3">शाळा सेटिंग्ज</h2>
  <div class="card" style="max-width:520px;padding:32px">
    <div class="form-group"><label class="form-label">शाळेचे नाव</label><input class="form-input" id="set-name" value="${esc(D.school.name)}"></div>
    <div class="form-group"><label class="form-label">जिल्हा</label><input class="form-input" id="set-dist" value="${esc(D.school.district||'')}"></div>
    <div class="form-group"><label class="form-label">संपर्क क्रमांक</label><input class="form-input" id="set-phone" value="${esc(D.school.contact||'')}"></div>
    <button class="btn btn-primary" onclick="saveSettings()"><i class="fa-solid fa-save"></i> जतन करा</button>
  </div>`;
}
function saveSettings(){
  const n=$('#set-name').value.trim();if(!n)return toast('शाळेचे नाव भरा.','error');
  D.school.name=n;D.school.district=$('#set-dist').value.trim();D.school.contact=$('#set-phone').value.trim();
  save();toast('सेटिंग्ज जतन झाली!','success');
}

// ===== PARENT DASHBOARD =====
function parentDash(){
  const attDays=Object.values(D.attendance);
  const attPct=attDays.length?Math.round(100*attDays.filter(x=>x['रोहन']).length/attDays.length):null;
  return `<h2 class="mb-1">रोहनची प्रगती</h2><p class="text-muted mb-3">इयत्ता ७ वी · ${esc(D.school.name)}</p>
  <div class="dash-stats">${statCard(avgScore()+'%','सरासरी गुण','chart-line','green')}${statCard(pendingHw(),'बाकी गृहपाठ','clipboard-list','saffron')}${statCard(attPct==null?'—':attPct+'%','उपस्थिती','calendar-check','blue')}</div>
  <div class="grid grid-2">
    <div class="card"><h3 class="mb-3">विषयनिहाय प्रगती</h3>
      ${[['गणित',72],['विज्ञान',64],['इतिहास',81],['मराठी',88]].map(s=>labeledProgress(s[0],s[1],s[1]>=70?'green':'saffron')).join('')}
    </div>
    <div class="card"><h3 class="mb-2">शिक्षकांचे निरीक्षण</h3>
      <div style="padding:16px;background:var(--surface-2);border-radius:var(--radius);margin-top:8px">
        <p style="font-size:15px">📝 गणितातील अपूर्णांक या विषयात अजून सराव हवा आहे.</p>
        <p class="text-muted" style="font-size:13px;margin-top:4px">— सौ. देशमुख, गणित शिक्षिका</p>
      </div>
    </div>
  </div>`;
}

function parentAttendance(){
  const days=Object.keys(D.attendance).sort().reverse();
  return `<h2 class="mb-3">उपस्थिती</h2>
  <div class="card">
    ${days.length?tableWrap(['तारीख','स्थिती'],days.map(k=>[k,D.attendance[k]['रोहन']?'<span class="tag tag-green"><i class="fa-solid fa-check"></i> उपस्थित</span>':'<span class="tag tag-saffron"><i class="fa-solid fa-times"></i> गैरहजर</span>'])):'<p class="text-muted" style="padding:16px">शिक्षकांनी अजून उपस्थिती नोंदवलेली नाही.</p>'}
  </div>`;
}

function parentAnnouncements(){
  return `<h2 class="mb-3">शाळेच्या घोषणा</h2>
  <div class="card" style="padding:0">${D.announcements.length?D.announcements.slice().reverse().map(a=>`
    <div class="ann-item"><div class="ann-by">${esc(a.by)} <span class="ann-date">${esc(a.date)}</span></div><div class="ann-text">${esc(a.text)}</div></div>
  `).join(''):'<p class="text-muted" style="padding:20px">अजून कोणतीही घोषणा नाही.</p>'}</div>`;
}

// ===== PAGE ROUTING =====
const PAGES={
  s:{dash:studentDash,lessons:studentLessons,hw:studentHomework,progress:studentProgress,ask:studentAsk,profile:studentProfile},
  t:{dash:teacherDash,new:teacherNewLesson,lessons:teacherLessons,class:teacherClass,hw:teacherHomework,att:teacherAttendance,ann:()=>announcementsPage('शिक्षक')},
  p:{dash:principalDash,teachers:principalTeachers,classes:principalClasses,reports:principalReports,ann:()=>announcementsPage('मुख्याध्यापक'),settings:principalSettings},
  g:{dash:parentDash,att:parentAttendance,ann:parentAnnouncements}
};

const PUBLIC_PAGES={
  '':pageHome,home:pageHome,about:pageAbout,courses:pageCourses,schools:pageSchools,
  students:pageStudents,teachers:pageTeachers,parents:pageParents,
  pricing:pagePricing,contact:pageContact,login:pageLogin
};

// ===== LAYOUT RENDERERS =====
function renderNav(activeKey,transparent=false){
  return `
  <nav class="navbar ${transparent?'transparent':'solid'}" id="navbar">
    <div class="nav-inner">
      <a class="nav-logo" href="#/">
        <div class="logo-icon">🎓</div>
        <span class="logo-text">MahaSkill AI</span>
      </a>
      <div class="nav-links" id="nav-links">
        ${NAV_PUBLIC.map(n=>`<a href="#/${n[0]}" class="${activeKey===n[0]?'active':''}">${n[1]}</a>`).join('')}
        <a class="btn btn-primary btn-sm nav-cta" href="#/login"><i class="fa-solid fa-right-to-bracket"></i> प्रवेश करा</a>
      </div>
      <button class="hamburger" id="hamburger" onclick="toggleMenu()"><span></span><span></span><span></span></button>
    </div>
  </nav>`;
}

function renderFooter(){
  return `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="footer-logo">🎓 MahaSkill AI</div>
          <p>महाराष्ट्रातील मराठी माध्यम शाळांसाठी AI-आधारित शिक्षण मंच. प्रत्येक विद्यार्थ्याला AI चे कौशल्य.</p>
          <div style="display:flex;gap:12px;margin-top:16px">
            ${['facebook','twitter','instagram','youtube','linkedin'].map(s=>`<a href="#" style="width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;transition:background .3s" onmouseover="this.style.background='var(--saffron)'" onmouseout="this.style.background='rgba(255,255,255,0.08)'"><i class="fa-brands fa-${s}" style="font-size:14px"></i></a>`).join('')}
          </div>
        </div>
        <div><h4>मंच</h4><ul>
          <li><a href="#/courses">AI कौशल्य</a></li><li><a href="#/schools">शाळांसाठी</a></li>
          <li><a href="#/students">विद्यार्थ्यांसाठी</a></li><li><a href="#/teachers">शिक्षकांसाठी</a></li><li><a href="#/parents">पालकांसाठी</a></li>
        </ul></div>
        <div><h4>कंपनी</h4><ul>
          <li><a href="#/about">आमच्याबद्दल</a></li><li><a href="#/pricing">किंमत</a></li>
          <li><a href="#/contact">संपर्क</a></li><li><a href="#">ब्लॉग</a></li><li><a href="#">करिअर</a></li>
        </ul></div>
        <div><h4>सहाय्य</h4><ul>
          <li><a href="#/contact">मदत केंद्र</a></li><li><a href="#">वापरण्याच्या अटी</a></li>
          <li><a href="#">गोपनीयता धोरण</a></li><li><a href="#">FAQ</a></li>
        </ul></div>
      </div>
      <div class="footer-bottom">
        © 2026 MahaSkill AI. सर्व हक्क राखीव. | महाराष्ट्रातील मराठी माध्यम शाळांसाठी बनवले ❤️
      </div>
    </div>
  </footer>`;
}

function renderPublicPage(key,body){
  const isHome=key===''||key==='home';
  return `${renderNav(key,isHome)}
  <main class="page-fade">${body}</main>
  ${renderFooter()}`;
}

function renderDashboard(role,page,body){
  return `
  <nav class="navbar solid" id="navbar">
    <div class="nav-inner">
      <a class="nav-logo" href="#/">
        <div class="logo-icon">🎓</div>
        <span class="logo-text">MahaSkill AI</span>
      </a>
      <div style="display:flex;align-items:center;gap:16px">
        <span class="text-muted" style="font-size:14px">${esc(D.school.name)}</span>
        <button class="btn btn-outline btn-sm" onclick="exitDash()"><i class="fa-solid fa-right-from-bracket"></i> बाहेर पडा</button>
      </div>
    </div>
  </nav>
  <div class="dashboard">
    <aside class="dash-sidebar">
      <div class="user-info">
        <div class="user-avatar">${ROLE_NAMES[role][0]}</div>
        <div class="user-name">${ROLE_NAMES[role]}</div>
        <div class="user-role">${ROLE_LABELS[role]}</div>
      </div>
      <div class="nav-menu">
        ${NAV_DASH[role].map(n=>`<a href="#/${role}/${n[0]}" class="${page===n[0]?'active':''}"><i class="fa-solid fa-${n[2]}"></i><span>${n[1]}</span></a>`).join('')}
      </div>
    </aside>
    <main class="dash-main page-fade">${body}</main>
  </div>`;
}

// ===== MAIN RENDER =====
function render(){
  const hash=(location.hash||'#/').slice(2);
  const parts=hash.split('/');
  const a=parts[0]||'';
  const b=parts[1]||'';
  const c=parts[2]||'';

  let html='';

  if(PAGES[a]){
    // Dashboard page
    if(getRole()!==a){location.hash='#/login';return}
    const page=PAGES[a][b]?b:'dash';
    const content=PAGES[a][page](c);
    html=renderDashboard(a,page,content);
  } else {
    // Public page
    const key=PUBLIC_PAGES[a]?a:'';
    const content=(PUBLIC_PAGES[key]||pageHome)();
    html=renderPublicPage(key,content);
  }

  $('#app').innerHTML=html;

  // Setup scroll behavior for navbar on home page
  if(!PAGES[a]){
    setupNavScroll(a===''||a==='home');
  }
}

function setupNavScroll(isHome){
  if(!isHome)return;
  const navbar=$('#navbar');
  if(!navbar)return;
  const onScroll=()=>{
    if(window.scrollY>50){
      navbar.classList.remove('transparent');
      navbar.classList.add('solid');
    } else {
      navbar.classList.add('transparent');
      navbar.classList.remove('solid');
    }
  };
  window.removeEventListener('scroll',onScroll);
  window.addEventListener('scroll',onScroll);
  onScroll();
}

function toggleMenu(){
  const links=$('#nav-links');
  const burger=$('#hamburger');
  if(links)links.classList.toggle('open');
  if(burger)burger.classList.toggle('open');
}

// ===== INIT =====
window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0)});

// Loading screen
window.addEventListener('load',()=>{
  setTimeout(()=>{
    const loader=$('#loader');
    if(loader)loader.classList.add('hide');
  },2000);
  render();
});

// Initial render (in case load already fired)
if(document.readyState==='complete'){
  render();
  const loader=$('#loader');
  if(loader)setTimeout(()=>loader.classList.add('hide'),2000);
}
