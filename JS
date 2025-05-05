document.addEventListener('DOMContentLoaded', () => {
  // ─── Globals ─────────────────────────────────
  const quizData = [
    {
      question: "Identify the indicated structure:",
      image: "https://i.imgur.com/b3c191f9-2b05-4e3d-bd5a-8a477c97bf2b.png",
      options: ["Ala","Sacral hiatus","Posterior sacral foramina","Superior articular process"],
      answer: "Ala",
      // highlight co-ordinates as a fraction of image size:
      highlight: { x: 0.6, y: 0.0, width: 0.35, height: 0.45 }
    },
    // … add highlight for each question similarly …
  ];

  let currentQuestionIndex = 0, score = 0, userAnswers = [];
  let questionTimer, bonusTimer, bonusTime = 30;
  const questionDuration = 30;

  // ─── Dom Refs ──────────────────────────────────
  const startScreen    = document.getElementById('start-screen');
  const bonusToggle    = document.getElementById('bonus-toggle');
  const bonusTimerDisp = document.getElementById('bonus-timer');
  const startBtn       = document.getElementById('start-btn');

  const quizContainer   = document.getElementById('quiz-container');
  const questionEl      = document.getElementById('question');
  const questionImg     = document.getElementById('question-image');
  const optionsList     = document.getElementById('options-list');
  const progressBar     = document.getElementById('progress');
  const timerDisplay    = document.getElementById('timer-display');
  const highlightBox    = document.getElementById('highlight-box');

  const summaryCont   = document.getElementById('summary-container');
  const finalScoreEl  = document.getElementById('final-score');
  const summaryList   = document.getElementById('summary-list');

  // ─── Start Quiz ───────────────────────────────
  startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    quizContainer.style.display = 'block';
    loadQuestion();
  });

  // ─── Load / Highlight / Timer ─────────────────
  function loadQuestion() {
    if (currentQuestionIndex >= quizData.length) return showSummary();

    const q = quizData[currentQuestionIndex];
    questionEl.textContent = q.question;
    questionImg.src = q.image;

    // show highlight
    if (q.highlight) {
      highlightBox.style.display = 'block';
      highlightBox.style.left   = (q.highlight.x * 100) + '%';
      highlightBox.style.top    = (q.highlight.y * 100) + '%';
      highlightBox.style.width  = (q.highlight.width * 100) + '%';
      highlightBox.style.height = (q.highlight.height * 100) + '%';
    }

    // options
    optionsList.innerHTML = '';
    q.options.forEach(opt => {
      const li = document.createElement('li');
      li.textContent = opt;
      li.addEventListener('click', () => selectOption(opt));
      optionsList.appendChild(li);
    });

    // progress
    progressBar.style.width = `${(currentQuestionIndex/quizData.length)*100}%`;

    // start 30 s timer
    clearInterval(questionTimer);
    let t = questionDuration;
    timerDisplay.textContent = formatTime(t);
    questionTimer = setInterval(() => {
      t--;
      timerDisplay.textContent = formatTime(t);
      if (t<=0) {
        clearInterval(questionTimer);
        recordAnswer(null,false);
        nextQuestion();
      }
    }, 1000);
  }

  function selectOption(choice) {
    clearInterval(questionTimer);
    const q = quizData[currentQuestionIndex];
    const correct = choice === q.answer;
    if (correct) score++;
    userAnswers.push({ index: currentQuestionIndex, selected: choice, correct });
    // immediate feedback
    Array.from(optionsList.children).forEach(li => {
      if (li.textContent === choice) {
        li.classList.add(correct?'correct':'incorrect');
      }
    });
    setTimeout(nextQuestion, 800);
  }

  function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
  }

  // ─── Summary ──────────────────────────────────
  function showSummary() {
    clearInterval(questionTimer);
    quizContainer.style.display   = 'none';
    summaryCont.style.display     = 'block';
    finalScoreEl.textContent      = `You scored ${score}/${quizData.length}`;
    summaryList.innerHTML         = '';
    userAnswers.forEach(ans => {
      const q = quizData[ans.index];
      const li = document.createElement('li');
      li.textContent = `Q${ans.index+1}: ${q.question} — Your answer: ${ans.selected||'None'} (${ans.correct?'✔️':'❌'})`;
      summaryList.appendChild(li);
    });
  }

  function formatTime(sec) {
    const m = String(Math.floor(sec/60)).padStart(2,'0');
    const s = String(sec%60).padStart(2,'0');
    return `${m}:${s}`;
  }
});
