import { useMemo, useState } from "react";
import {
  Activity, ArrowDownRight, ArrowRight, Atom, Award, BookOpen, Bookmark,
  BrainCircuit, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight,
  CircleHelp, Clock3, Flame, GraduationCap, LayoutDashboard, Leaf, LogOut,
  Menu, Search, Settings2, ShieldCheck, Sparkles, Target, Trophy, X,
  Calculator, Languages, Landmark, Play, RotateCcw, CheckCircle2, XCircle
} from "lucide-react";

type Subject = { id: string; name: string; color: string; icon: typeof BookOpen; lessons: number; progress: number; detail: string };
type Question = { question: string; options: string[]; answer: number; explanation: string };

const subjects: Subject[] = [
  { id: "math", name: "Matematika", color: "#675df5", icon: Calculator, lessons: 24, progress: 72, detail: "Algebra, geometriya va mantiqiy masalalar" },
  { id: "uzbek", name: "Ona tili", color: "#f2a43a", icon: BookOpen, lessons: 18, progress: 48, detail: "Grammatika, imlo va matn tahlili" },
  { id: "english", name: "Ingliz tili", color: "#12a88a", icon: Languages, lessons: 20, progress: 64, detail: "Grammar, vocabulary va reading" },
  { id: "history", name: "O'zbekiston tarixi", color: "#e97861", icon: Landmark, lessons: 16, progress: 35, detail: "Tarixiy davrlar va muhim sanalar" },
  { id: "physics", name: "Fizika", color: "#4186f4", icon: Atom, lessons: 14, progress: 56, detail: "Mexanika, elektr va tabiat qonunlari" },
  { id: "biology", name: "Biologiya", color: "#30a66d", icon: Leaf, lessons: 15, progress: 41, detail: "Hujayra, organizmlar va ekologiya" }
];

const questions: Question[] = [
  { question: "Agar 3x + 7 = 22 bo'lsa, x ning qiymatini toping.", options: ["3", "5", "7", "9"], answer: 1, explanation: "3x = 22 − 7 = 15. Demak, x = 15 ÷ 3 = 5." },
  { question: "Uchburchak ichki burchaklari yig'indisi necha gradus?", options: ["90°", "180°", "270°", "360°"], answer: 1, explanation: "Evklid geometriyasida uchburchak ichki burchaklari yig'indisi 180° ga teng." },
  { question: "2⁴ · 2³ ifodaning qiymati qaysi?", options: ["2⁷", "2¹²", "4⁷", "2"], answer: 0, explanation: "Bir xil asosli darajalar ko'paytirilganda daraja ko'rsatkichlari qo'shiladi: 2⁴ · 2³ = 2⁷." },
  { question: "240 sonining 25 foizi nechaga teng?", options: ["40", "50", "60", "80"], answer: 2, explanation: "240 × 25 / 100 = 60." },
  { question: "5, 8, 11, 14, ... ketma-ketlikning keyingi hadi?", options: ["15", "16", "17", "18"], answer: 2, explanation: "Har bir had 3 ga ortib boradi. 14 + 3 = 17." }
];

const navItems = [
  { id: "dashboard", label: "Bosh sahifa", icon: LayoutDashboard },
  { id: "subjects", label: "Fanlar", icon: BookOpen },
  { id: "practice", label: "Test ishlash", icon: BrainCircuit },
  { id: "progress", label: "Natijalarim", icon: Activity }
];

function App() {
  const [page, setPage] = useState("dashboard");
  const [query, setQuery] = useState("");
  const [activeSubject, setActiveSubject] = useState("math");
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [doneLessons, setDoneLessons] = useState<string[]>([]);
  const [toast, setToast] = useState("");

  const filteredSubjects = useMemo(() => subjects.filter(s => s.name.toLowerCase().includes(query.toLowerCase())), [query]);
  const score = answers.reduce((sum, answer, i) => sum + (answer === questions[i]?.answer ? 1 : 0), 0);
  const active = subjects.find(s => s.id === activeSubject) ?? subjects[0];
  const go = (next: string) => { setPage(next); setMenuOpen(false); setQuery(""); };
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2600); };
  const startQuiz = () => { setQuizIndex(0); setSelected(null); setAnswers([]); setFinished(false); go("practice"); };
  const submitAnswer = () => {
    if (selected === null) return;
    const next = [...answers.slice(0, quizIndex), selected];
    setAnswers(next);
    if (quizIndex === questions.length - 1) setFinished(true);
    else { setQuizIndex(quizIndex + 1); setSelected(null); }
  };
  const resetQuiz = () => { setQuizIndex(0); setSelected(null); setAnswers([]); setFinished(false); };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <button className="brand" onClick={() => go("dashboard")} aria-label="Markazlashgan B bosh sahifa">
          <span className="brand-mark"><GraduationCap size={24} strokeWidth={2.4} /></span>
          <span className="brand-copy"><strong>markazlashgan<span>.</span></strong><small>BILIM SARI</small></span>
        </button>
        <div className="workspace-label">O'QUV MARKAZI</div>
        <div className="workspace-card"><div className="workspace-icon">8</div><div><strong>8-sinf</strong><span>O'quvchi paneli</span></div><ChevronDown size={15} /></div>
        <div className="nav-caption">MENYU</div>
        <nav className="main-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            return <button key={item.id} className={`nav-link ${page === item.id ? "active" : ""}`} onClick={() => go(item.id)}><Icon size={18} /><span>{item.label}</span>{item.id === "practice" && <span className="nav-dot" />}</button>;
          })}
        </nav>
        <div className="nav-caption tools-caption">SHAXSIY</div>
        <button className="nav-link" onClick={() => { setSaved([]); notify("Saqlangan mavzular ro'yxati yangilandi"); }}><Bookmark size={18} /><span>Saqlanganlar</span></button>
        <button className="nav-link" onClick={() => notify("Sozlamalar keyingi versiyada qo'shiladi")}><Settings2 size={18} /><span>Sozlamalar</span></button>
        <div className="sidebar-bottom">
          <div className="upgrade-card"><div className="upgrade-icon"><Sparkles size={18} /></div><strong>Bilimingni oshir!</strong><p>Har kuni ozgina mashq — katta natija.</p><button onClick={startQuiz}>Mashqni boshlash <ArrowRight size={14} /></button><div className="upgrade-orb orb-one" /><div className="upgrade-orb orb-two" /></div>
          <button className="user-mini" onClick={() => setShowProfile(!showProfile)}><div className="avatar">O</div><div><strong>O'quvchi</strong><span>8-sinf · Faol profil</span></div><ChevronDown size={15} /></button>
          {showProfile && <div className="profile-pop"><strong>O'quvchi profili</strong><p>Mahalliy demo profil. Natijalar ushbu brauzer sessiyasida hisoblanadi.</p><button onClick={() => { setShowProfile(false); notify("Profil sozlamalari tayyorlanmoqda"); }}>Profil sozlamalari</button></div>}
        </div>
      </aside>

      {menuOpen && <button className="mobile-scrim" onClick={() => setMenuOpen(false)} aria-label="Menyuni yopish" />}
      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left"><button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menyuni ochish"><Menu size={21} /></button><div className="breadcrumb">O'quv paneli <ChevronRight size={14} /> <strong>{navItems.find(n => n.id === page)?.label ?? (page === "subject" ? active.name : "Test ishlash")}</strong></div></div>
          <div className="topbar-right"><div className="today-pill"><CalendarDays size={15} /><span>O'quv rejasi</span></div><div className="streak-pill"><Flame size={16} fill="#ff9b55" color="#ff9b55" /><strong>4</strong><span>kun</span></div><button className="top-avatar" onClick={() => setShowProfile(!showProfile)}>O</button></div>
        </header>

        {page === "dashboard" && <div className="page-content">
          <section className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-line" /> 2026 / 2027 O'QUV YILI</div><h1>Assalomu alaykum! <span className="wave">✦</span></h1><p className="welcome-subtitle">Bugun ham yangi bilimlar sari bir qadam tashlaymiz.</p></div><div className="date-label"><CalendarDays size={16} /> O'quv kuningiz xayrli o'tsin!</div></section>
          <section className="hero-card"><div className="hero-text"><div className="hero-chip"><Sparkles size={13} /> SIZ UCHUN TAVSIYA</div><h2>Bilim — kelajak<br />uchun eng yaxshi <span>sarmoya.</span></h2><p>CHSB va BSB imtihonlariga puxta tayyorlaning. Har bir mashq sizni maqsadingizga yaqinlashtiradi.</p><button className="hero-cta" onClick={startQuiz}>Testni boshlash <ArrowRight size={17} /></button><div className="hero-note"><ShieldCheck size={15} /> O'z sur'atingizda o'rganing</div></div><div className="hero-art" aria-hidden="true"><div className="art-ring ring-a" /><div className="art-ring ring-b" /><div className="art-book"><BookOpen size={76} strokeWidth={1.4} /></div><div className="art-float float-star"><Sparkles size={21} /></div><div className="art-float float-check"><Check size={22} /></div><div className="art-float float-award"><Award size={25} /></div><div className="art-dots" /></div><div className="hero-index">01 <span>/ 03</span></div></section>
          <section className="stats-grid">
            <div className="stat-card"><div className="stat-icon stat-purple"><Target size={19} /></div><span className="stat-label">Umumiy progress</span><div className="stat-value">58<span>%</span></div><div className="stat-foot"><span className="trend-up"><ArrowDownRight size={14} /> +12%</span> o'tgan haftaga nisbatan</div><div className="mini-progress"><i style={{width:"58%"}} /></div></div>
            <div className="stat-card"><div className="stat-icon stat-orange"><BookOpen size={19} /></div><span className="stat-label">O'rganilgan mavzular</span><div className="stat-value">24<span className="stat-muted"> / 107</span></div><div className="stat-foot">Umumiy mavzular soni</div><div className="mini-progress orange"><i style={{width:"22%"}} /></div></div>
            <div className="stat-card"><div className="stat-icon stat-green"><CheckCircle2 size={19} /></div><span className="stat-label">Test natijalari</span><div className="stat-value">86<span className="stat-muted"> / 100</span></div><div className="stat-foot"><span className="trend-up">A'lo natija</span> — davom eting!</div><div className="mini-progress green"><i style={{width:"86%"}} /></div></div>
            <div className="stat-card"><div className="stat-icon stat-blue"><Clock3 size={19} /></div><span className="stat-label">O'qish vaqti</span><div className="stat-value">12<span className="stat-unit"> soat</span></div><div className="stat-foot">Bu haftada sarflangan vaqt</div><div className="stat-spark"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div></div>
          </section>
          <section className="section-heading"><div><h2>Fanlaringiz</h2><p>O'rganishni davom ettirish uchun fanni tanlang.</p></div><button className="text-action" onClick={() => go("subjects")}>Barcha fanlar <ArrowRight size={16} /></button></section>
          <div className="subjects-grid">{subjects.slice(0,4).map(s => <SubjectCard key={s.id} subject={s} onClick={() => {setActiveSubject(s.id); go("subject");}} saved={saved.includes(s.id)} onSave={() => setSaved(prev => prev.includes(s.id) ? prev.filter(x=>x!==s.id) : [...prev,s.id])} />)}</div>
          <section className="bottom-grid"><div className="panel weekly-panel"><div className="panel-heading"><div><h3>Haftalik faollik</h3><p>O'qish odatingizni kuzatib boring</p></div><button className="select-like" onClick={() => notify("Haftalik ko'rinish tanlangan")}>Bu hafta <ChevronDown size={14} /></button></div><div className="activity-chart"><div className="chart-y"><span>4 soat</span><span>3 soat</span><span>2 soat</span><span>1 soat</span><span>0</span></div><div className="chart-plot"><div className="chart-gridlines"><i/><i/><i/><i/><i/></div><div className="bar-group">{[{d:"Du",h:42},{d:"Se",h:68},{d:"Ch",h:48},{d:"Pa",h:83},{d:"Ju",h:58},{d:"Sh",h:94},{d:"Ya",h:27}].map((b,i)=><button key={b.d} className={`bar-col ${i===5?"bar-highlight":""}`} onClick={() => notify(`${b.d}: ${Math.round(b.h/25)} soatga yaqin faollik")}><span className="bar" style={{height:`${b.h}%`}}/><small>{b.d}</small></button>)}</div></div></div></div>
            <div className="panel goals-panel"><div className="panel-heading"><div><h3>Bugungi maqsadlar</h3><p>Kichik qadamlar, katta natijalar</p></div><span className="goal-count">{doneLessons.length}/3</span></div><div className="goal-list">{[{id:"lesson",title:"1 ta mavzuni o'rganish",sub:"Taxminan 20 daqiqa",icon:BookOpen},{id:"test",title:"Test yechish",sub:"5 ta savol",icon:BrainCircuit},{id:"review",title:"Xatolarni takrorlash",sub:"Bilimni mustahkamlash",icon:RotateCcw}].map(g=>{const Icon=g.icon;const done=doneLessons.includes(g.id);return <button key={g.id} className={`goal-item ${done?"goal-done":""}`} onClick={()=>setDoneLessons(p=>done?p.filter(x=>x!==g.id):[...p,g.id])}><span className="goal-check">{done?<Check size={15}/>:<Icon size={16}/>}</span><span className="goal-copy"><strong>{g.title}</strong><small>{g.sub}</small></span><span className="goal-toggle">{done?"Bajarildi":"Bajarish"}</span></button>})}</div></div></section>
        </div>}

        {page === "subjects" && <div className="page-content"><section className="simple-page-head"><div className="eyebrow"><span className="eyebrow-line"/> BILIMLAR OLAMI</div><h1>Barcha fanlar</h1><p className="welcome-subtitle">O'zingizga kerakli fanni tanlang va tayyorgarlikni davom ettiring.</p><div className="search-box"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Fan nomi bo'yicha qidirish..." /><span>{filteredSubjects.length} ta fan</span></div></section><div className="subjects-grid all-subjects">{filteredSubjects.map(s=><SubjectCard key={s.id} subject={s} onClick={()=>{setActiveSubject(s.id);go("subject");}} saved={saved.includes(s.id)} onSave={()=>setSaved(p=>p.includes(s.id)?p.filter(x=>x!==s.id):[...p,s.id])}/>)}</div>{filteredSubjects.length===0&&<div className="empty-state"><CircleHelp size={30}/><strong>Fan topilmadi</strong><p>Boshqa kalit so'z bilan qidirib ko'ring.</p></div>}</div>}

        {page === "subject" && <div className="page-content"><button className="back-link" onClick={()=>go("subjects")}><ChevronLeft size={17}/> Fanlarga qaytish</button><section className="subject-detail-hero"><div className="detail-icon" style={{background:active.color}}><active.icon size={32}/></div><div className="detail-title"><span className="eyebrow"><span className="eyebrow-line"/> 8-SINF · {active.lessons} TA MAVZU</span><h1>{active.name}</h1><p>{active.detail}</p></div><button className="hero-cta" onClick={startQuiz}>Mashqni boshlash <ArrowRight size={17}/></button></section><div className="detail-stats"><div className="panel detail-stat"><span>O'zlashtirish darajasi</span><strong>{active.progress}%</strong><div className="mini-progress"><i style={{width:`${active.progress}%`}}/></div></div><div className="panel detail-stat"><span>Mavzular</span><strong>{active.lessons} ta</strong><small>O'quv dasturi bo'yicha</small></div><div className="panel detail-stat"><span>Imtihon tayyorgarligi</span><strong>{Math.min(100,active.progress+14)}%</strong><small>BSB / CHSB yo'nalishi</small></div></div><section className="section-heading"><div><h2>Tavsiya etilgan mavzular</h2><p>Bilimingizni bosqichma-bosqich mustahkamlang.</p></div></section><div className="topic-list">{["Asosiy tushunchalar va nazariya","Misollar bilan mustahkamlash","Murakkab masalalar","BSB / CHSB sinov testi"].map((topic,i)=><div className="topic-row" key={topic}><div className="topic-number">{String(i+1).padStart(2,"0")}</div><div className="topic-copy"><strong>{topic}</strong><span>{i===3?"15 ta savol · Sinov testi":`${15+i*5} daqiqa · O'quv materiali`}</span></div><span className={`topic-status ${i===0?"status-ready":""}`}>{i===0?"Boshlash":"Tavsiya etiladi"}</span><button className="round-arrow" onClick={()=>i===3?startQuiz():notify("Ushbu mavzu materiali keyingi versiyada kengaytiriladi")}><ArrowRight size={17}/></button></div>)}</div></div>}

        {page === "practice" && <div className="page-content quiz-page"><button className="back-link" onClick={()=>go("dashboard")}><ChevronLeft size={17}/> Bosh sahifaga qaytish</button>{finished ? <div className="panel result-panel"><div className="result-icon">{score>=4?<Trophy size={38}/>:<Target size={38}/>}</div><div className="eyebrow"><span className="eyebrow-line"/> TEST YAKUNLANDI</div><h1>{score>=4?"Ajoyib natija!":"Harakatni davom ettiring!"}</h1><p>Matematika bo'yicha qisqa sinov natijangiz.</p><div className="score-ring"><strong>{Math.round(score/questions.length*100)}<small>%</small></strong><span>{score} / {questions.length} to'g'ri</span></div><div className="result-feedback">{questions.map((q,i)=><div className="feedback-row" key={q.question}>{answers[i]===q.answer?<CheckCircle2 size={17} color="#16a779"/>:<XCircle size={17} color="#e26b68" />}<span>{q.question}</span><strong>{answers[i]===q.answer?"To'g'ri":"Xato"}</strong></div>)}</div><div className="result-actions"><button className="hero-cta" onClick={resetQuiz}><RotateCcw size={16}/> Qayta ishlash</button><button className="secondary-btn" onClick={()=>go("dashboard")}>Bosh sahifaga</button></div></div> : <><div className="quiz-heading"><div className="eyebrow"><span className="eyebrow-line"/> BILIMINGIZNI SINAB KO'RING</div><h1>Mini sinov testi</h1><p>Matematika · 8-sinf · CHSB / BSB tayyorgarligi</p></div><div className="quiz-layout"><div className="panel quiz-main"><div className="quiz-progress-head"><span>Savol <strong>{quizIndex+1}</strong> / {questions.length}</span><span><Clock3 size={15}/> O'z sur'atingizda</span></div><div className="quiz-progress"><i style={{width:`${(quizIndex+1)/questions.length*100}%`}}/></div><div className="question-kicker">SAVOL {String(quizIndex+1).padStart(2,"0")}</div><h2 className="question-title">{questions[quizIndex].question}</h2><div className="answer-options">{questions[quizIndex].options.map((option,i)=><button key={option} onClick={()=>setSelected(i)} className={`answer-option ${selected===i?"answer-selected":""}`}><span className="option-letter">{String.fromCharCode(65+i)}</span><span>{option}</span>{selected===i&&<Check size={17} className="option-check"/>}</button>)}</div><div className="quiz-footer"><span><ShieldCheck size={15}/> Javobingizni tanlang</span><button className="hero-cta" disabled={selected===null} onClick={submitAnswer}>{quizIndex===questions.length-1?"Natijani ko'rish":"Keyingi savol"} <ArrowRight size={16}/></button></div></div><aside className="panel quiz-aside"><div className="quiz-aside-icon"><BrainCircuit size={24}/></div><h3>Maslahat</h3><p>Savolni diqqat bilan o'qing. Shoshilmasdan, o'zingiz bilgan usullar orqali yechim toping.</p><div className="aside-divider"/><div className="quiz-aside-row"><span>Jami savollar</span><strong>{questions.length}</strong></div><div className="quiz-aside-row"><span>Joriy savol</span><strong>{quizIndex+1}</strong></div><div className="quiz-aside-row"><span>Fan</span><strong>Matematika</strong></div></aside></div></>}</div>}

        {page === "progress" && <div className="page-content"><section className="simple-page-head"><div className="eyebrow"><span className="eyebrow-line"/> SHAXSIY TAHLIL</div><h1>Natijalarim</h1><p className="welcome-subtitle">O'quv jarayoningiz va maqsadlaringiz haqida umumiy ko'rinish.</p></section><div className="stats-grid progress-stats"><div className="stat-card"><div className="stat-icon stat-purple"><Target size={19}/></div><span className="stat-label">Umumiy progress</span><div className="stat-value">58<span>%</span></div><div className="mini-progress"><i style={{width:"58%"}}/></div></div><div className="stat-card"><div className="stat-icon stat-green"><Trophy size={19}/></div><span className="stat-label">Sinov ballari</span><div className="stat-value">{finished?score*20:86}<span className="stat-muted"> / 100</span></div><div className="stat-foot">Eng yaxshi natijangiz</div></div><div className="stat-card"><div className="stat-icon stat-orange"><Flame size={19}/></div><span className="stat-label">Ketma-ket kunlar</span><div className="stat-value">4<span className="stat-unit"> kun</span></div><div className="stat-foot">Muntazam o'rganishda davom eting</div></div><div className="stat-card"><div className="stat-icon stat-blue"><BookOpen size={19}/></div><span className="stat-label">Bajarilgan maqsadlar</span><div className="stat-value">{doneLessons.length}<span className="stat-muted"> / 3</span></div><div className="stat-foot">Bugungi vazifalar</div></div></div><section className="section-heading"><div><h2>Fanlar bo'yicha progress</h2><p>Har bir fandagi joriy o'zlashtirish ko'rsatkichi.</p></div></section><div className="panel progress-subjects">{subjects.map(s=><div className="progress-subject-row" key={s.id}><span className="progress-subject-dot" style={{background:s.color}}/><strong>{s.name}</strong><div className="mini-progress"><i style={{width:`${s.progress}%`,background:s.color}}/></div><span>{s.progress}%</span><button className="round-arrow" onClick={()=>{setActiveSubject(s.id);go("subject");}}><ArrowRight size={16}/></button></div>)}</div></div>}

        <footer className="footer"><span>© 2026 Markazlashgan B</span><span>Bilim sari birgalikda <span className="footer-heart">♥</span></span><button onClick={()=>notify("Yordam bo'limi keyingi versiyada qo'shiladi")}>Yordam <ArrowRight size={13}/></button></footer>
      </main>
      {toast && <div className="toast"><CheckCircle2 size={17}/>{toast}<button onClick={()=>setToast("")} aria-label="Xabarni yopish"><X size={15}/></button></div>}
    </div>
  );
}

function SubjectCard({ subject, onClick, saved, onSave }: { subject: Subject; onClick: () => void; saved: boolean; onSave: () => void }) {
  const Icon = subject.icon;
  return <article className="subject-card"><div className="subject-card-top"><div className="subject-icon" style={{background:`${subject.color}14`,color:subject.color}}><Icon size={22}/></div><button className={`save-button ${saved?"is-saved":""}`} onClick={onSave} aria-label={saved?"Saqlanganlardan olish":"Saqlash"}><Bookmark size={17} fill={saved?"currentColor":"none"}/></button></div><button className="subject-card-title" onClick={onClick}>{subject.name}<ArrowRight size={15}/></button><p>{subject.detail}</p><div className="subject-meta"><span><BookOpen size={14}/>{subject.lessons} ta mavzu</span><strong>{subject.progress}%</strong></div><div className="mini-progress subject-progress"><i style={{width:`${subject.progress}%`,background:subject.color}}/></div><button className="subject-open" onClick={onClick}>Davom ettirish <ArrowRight size={15}/></button></article>;
}

export default App;
