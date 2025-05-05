document.addEventListener('DOMContentLoaded', () => {
  const quizData = [
    {
      question: "Identify the indicated structure:",
      image: "https://i.imgur.com/b3c191f9-2b05-4e3d-bd5a-8a477c97bf2b.png",
      options: ["Ala","Sacral hiatus","Posterior sacral foramina","Superior articular process"],
      answer: "Ala",
      highlight: { x:0.48, y:0.0, w:0.32, h:0.48 }
    },
    // … your other questions …
  ];

  let idx = 0, score = 0, answers = [], timerInt;

  // DOM refs
  const startScreen  = document.getElementById('start-screen');
  const startBtn     = document.getElementById('start-btn');
  const quizCont     = document.getElementById('quiz-container');
  const qElem        = document.getElementById('question');
  const imgElem      = document.getElementById('question-image');
  const optList      = document.getElementById('options-list');
  const progBar      = document.getElementById('progress');
  const tmrDisp      = document.getElementById('timer-display');
  const highlightBox = document.getElementById('highlight-box');
  const summaryCont  = document.getElementById('summary-container');
  const finalScore   = document.getElementById('final-score');
  const summaryList  = document.getElementById('summary-list');

  // Start quiz
  startBtn.onclick = () => {
    startScreen.style.display = 'none';
    quizCont.style.display    = 'block';
    loadQuestion();
  };

  function loadQuestion() {
    if (idx >= quizData.length) return showSummary();
    const q = quizData[idx];
    qElem.textContent = q.question;
    imgElem.src       = q.image;

    // Show highlight box
    const {x,y,w,h} = q.highlight;
    highlightBox.style.display = 'block';
    highlightBox.style.left    = (x*100)+'%';
    highlightBox.style.top     = (y*100)+'%';
    highlightBox.style.width   = (w*100)+'%';
    highlightBox.style.height  = (h*100)+'%';

    // Render options
    optList.innerHTML = '';
    q.options.forEach(o => {
      const li = document.createElement('li');
      li.textContent = o;
      li.onclick     = () => selectOption(o);
      optList.appendChild(li);
    });

    // Progress bar
    progBar.style.width = ((idx/quizData.length)*100)+'%';

    // 30-second timer
    clearInterval(timerInt);
    let t = 30;
    tmrDisp.textContent = formatTime(t);
    timerInt = setInterval(() => {
      t--;
      tmrDisp.textContent = formatTime(t);
      if (t <= 0) {
        clearInterval(timerInt);
        selectOption(null);
      }
    }, 1000);
  }

  function selectOption(choice) {
    clearInterval(timerInt);
    const correct = choice === quizData[idx].answer;
    if (correct) score++;
    answers.push({ idx, choice, correct });

    // Feedback highlight
    [...optList.children].forEach(li => {
      if (li.textContent === choice) {
        li.classList.add(correct ? 'correct' : 'incorrect');
      }
    });

    setTimeout(() => {
      idx++;
      loadQuestion();
    }, 600);
  }

  function showSummary() {
    quizCont.style.display    = 'none';
    summaryCont.style.display = 'block';
    finalScore.textContent    = `You scored ${score}/${quizData.length}`;
    summaryList.innerHTML     = '';
    answers.forEach(a => {
      const q = quizData[a.idx];
      const li = document.createElement('li');
      li.textContent = `Q${a.idx+1}: ${q.question} — Your answer: ${a.choice||'None'} (${a.correct?'✔️':'❌'})`;
      summaryList.appendChild(li);
    });
  }

  function formatTime(s) {
    const mm = String(Math.floor(s/60)).padStart(2,'0');
    const ss = String(s%60).padStart(2,'0');
    return mm + ':' + ss;
  }
});
