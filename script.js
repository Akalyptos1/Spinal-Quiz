document.addEventListener('DOMContentLoaded', () => {
  // ─── Quiz Data ───────────────────────────────────
  const quizData = [
    {
      question: "Identify the indicated structure:",
      image: "https://i.imgur.com/b3c191f9-2b05-4e3d-bd5a-8a477c97bf2b.png",
      options: ["Ala","Sacral hiatus","Posterior sacral foramina","Superior articular process"],
      answer: "Ala",
      highlight: { x:0.48, y:0.0, w:0.32, h:0.48 }
    },
    // … repeat for your other 14 questions …
  ];

  let idx=0, score=0, answers=[];
  let timerInt;

  // ─── DOM Refs ────────────────────────────────────
  const startScreen  = document.getElementById('start-screen');
  const startBtn     = document.getElementById('start-btn');
  const quizCont     = document.getElementById('quiz-container');
  const qElem        = document.getElementById('question');
  const imgElem      = document.getElementById('question-image');
  const optList      = document.getElementById('options-list');
  const progBar      = document.getElementById('progress');
  const tmrDisplay   = document.getElementById('timer-display');
  const highlightBox = document.getElementById('highlight-box');
  const summaryCont  = document.getElementById('summary-container');
  const finalScore   = document.getElementById('final-score');
  const summaryList  = document.getElementById('summary-list');

  // ─── Start ────────────────────────────────────────
  startBtn.onclick = () => {
    startScreen.style.display = 'none';
    quizCont.style.display    = 'block';
    loadQ();
  };

  // ─── Load Question ─────────────────────────────────
  function loadQ() {
    if (idx >= quizData.length) return showSummary();

    const q = quizData[idx];
    qElem.textContent = q.question;
    imgElem.src       = q.image;

    // place highlight
    const box = highlightBox;
    box.style.display = 'block';
    box.style.left    = (q.highlight.x * 100)+'%';
    box.style.top     = (q.highlight.y * 100)+'%';
    box.style.width   = (q.highlight.w * 100)+'%';
    box.style.height  = (q.highlight.h * 100)+'%';

    // options
    optList.innerHTML = '';
    q.options.forEach(o => {
      const li = document.createElement('li');
      li.textContent = o;
      li.onclick = () => select(o);
      optList.appendChild(li);
    });

    // progress bar
    progBar.style.width = ((idx/quizData.length)*100)+'%';

    // timer
    clearInterval(timerInt);
    let t=30;
    tmrDisplay.textContent = format(t);
    timerInt = setInterval(()=> {
      t--;
      tmrDisplay.textContent = format(t);
      if (t<=0) { clearInterval(timerInt); select(null); }
    },1000);
  }

  function select(choice) {
    clearInterval(timerInt);
    const correct = choice === quizData[idx].answer;
    if (correct) score++;
    answers.push({idx,choice,correct});

    // highlight feedback
    [...optList.children].forEach(li=>{
      if (li.textContent===choice) {
        li.classList.add(correct?'correct':'incorrect');
      }
    });

    setTimeout(()=>{
      idx++;
      loadQ();
    },600);
  }

  // ─── Summary ──────────────────────────────────────
  function showSummary() {
    quizCont.style.display    = 'none';
    summaryCont.style.display = 'block';
    finalScore.textContent    = `You scored ${score}/${quizData.length}`;
    summaryList.innerHTML     = '';
    answers.forEach(a=>{
      const q=quizData[a.idx];
      const li=document.createElement('li');
      li.textContent = `Q${a.idx+1}: ${q.question} — Your answer: ${a.choice||'None'} (${a.correct?'✔️':'❌'})`;
      summaryList.appendChild(li);
    });
  }

  function format(s) {
    const mm = String(Math.floor(s/60)).padStart(2,'0');
    const ss = String(s%60).padStart(2,'0');
    return mm+':'+ss;
  }
});
