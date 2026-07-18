// ---------- State ----------
let currentQ = 0;
const answers = {};
let selectedStyle = 'sweet'; // 'sweet' | 'romantic'
let generatedLetterText = '';

const screens = {
  intro: document.getElementById('screen-intro'),
  wizard: document.getElementById('screen-wizard'),
  loading: document.getElementById('screen-loading'),
  preview: document.getElementById('screen-preview'),
  result: document.getElementById('screen-result')
};

function showScreen(name){
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}

// ---------- On load: check for shared letter link (?id=xxx) ----------
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const sharedId = params.get('id');
  if (sharedId) {
    loadSharedLetter(sharedId);
  }
});

async function loadSharedLetter(id){
  showScreen('loading');
  document.getElementById('loadingText').textContent = "Opening your letter...";
  try{
    const doc = await db.collection('letters').doc(id).get();
    if (doc.exists){
      const data = doc.data();
      renderPostcard(data.senderName, data.recipientName, data.letterText);
      document.getElementById('postcard').classList.toggle('theme-romantic', data.style === 'romantic');
      showScreen('result');
      document.getElementById('shareBtn').dataset.id = id;
    } else {
      alert("Letter not found. It may have been removed.");
      showScreen('intro');
    }
  }catch(e){
    console.error(e);
    showScreen('intro');
  }
}

// ---------- Intro ----------
document.getElementById('startBtn').addEventListener('click', () => {
  const name = document.getElementById('introNameInput').value.trim();
  if (!name){
    document.getElementById('introNameInput').style.outline = '2px solid #ff4d6d';
    return;
  }
  answers.recipientName = name;
  currentQ = 0;
  renderQuestion();
  showScreen('wizard');
});

// ---------- Wizard rendering ----------
function renderQuestion(){
  const q = QUESTIONS[currentQ];
  const area = document.getElementById('questionArea');
  const pct = Math.round(((currentQ) / QUESTIONS.length) * 100) + 10;
  document.getElementById('progressBar').style.width = Math.min(pct,100) + '%';

  let html = `<div class="q-label">${q.label}</div>`;

  if (q.type === 'text'){
    html += `<input class="q-input" id="qInput" type="text" placeholder="${q.placeholder||''}" value="${answers[q.id]||''}">`;
  } else if (q.type === 'textarea'){
    html += `<textarea class="q-textarea" id="qInput" placeholder="${q.placeholder||''}">${answers[q.id]||''}</textarea>`;
  } else if (q.type === 'choice'){
    html += `<div class="q-choices" id="qChoices">`;
    q.options.forEach(opt => {
      const sel = answers[q.id] === opt ? 'selected' : '';
      html += `<button type="button" class="q-choice-btn ${sel}" data-val="${opt}">${opt}</button>`;
    });
    html += `</div>`;
  }
  area.innerHTML = html;

  if (q.type === 'choice'){
    document.querySelectorAll('.q-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.q-choice-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        answers[q.id] = btn.dataset.val;
      });
    });
  }

  document.getElementById('backBtn').style.visibility = currentQ === 0 ? 'hidden' : 'visible';
  document.getElementById('nextBtn').textContent = currentQ === QUESTIONS.length - 1 ? "Create Letter 💌" : "Next";
}

document.getElementById('backBtn').addEventListener('click', () => {
  saveCurrentAnswer();
  if (currentQ > 0){ currentQ--; renderQuestion(); }
});

document.getElementById('nextBtn').addEventListener('click', () => {
  const q = QUESTIONS[currentQ];
  saveCurrentAnswer();

  if (!answers[q.id] && !q.optional){
    const el = document.getElementById('qInput') || document.getElementById('qChoices');
    if (el) el.style.outline = '2px solid #ff4d6d';
    return;
  }

  if (currentQ < QUESTIONS.length - 1){
    currentQ++;
    renderQuestion();
  } else {
    generateLetter();
  }
});

function saveCurrentAnswer(){
  const q = QUESTIONS[currentQ];
  if (q.type === 'text' || q.type === 'textarea'){
    const input = document.getElementById('qInput');
    if (input) answers[q.id] = input.value.trim();
  }
  // choice answers are saved on click already
}

// ---------- AI Generation ----------
async function generateLetter(){
  showScreen('loading');
  document.getElementById('loadingText').textContent = "Crafting your letter with love...";

  const prompt = buildPrompt(answers);

  try{
    const letterText = await callGemini(prompt);
    generatedLetterText = letterText;
    renderMockupPostcard(answers.senderName, answers.recipientName, letterText);
    showScreen('preview');
  }catch(e){
    console.error(e);
    alert("DEBUG INFO — please screenshot this:\n\n" + e.message);
    showScreen('wizard');
  }
}

function renderMockupPostcard(sender, recipient, bodyText){
  document.getElementById('mpGreeting').textContent = `Dear ${recipient},`;
  document.getElementById('mpBody').textContent = bodyText;
  document.getElementById('mpSignoff').textContent = `— ${sender}`;
}

// ---------- Style picker ----------
document.querySelectorAll('.style-option').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.style-option').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedStyle = btn.dataset.style;
  });
});

document.getElementById('continueToResultBtn').addEventListener('click', async () => {
  showScreen('loading');
  document.getElementById('loadingText').textContent = "Finalizing your letter...";
  renderPostcard(answers.senderName, answers.recipientName, generatedLetterText);
  document.getElementById('postcard').classList.toggle('theme-romantic', selectedStyle === 'romantic');
  try{
    const id = await saveLetter(answers.senderName, answers.recipientName, generatedLetterText, selectedStyle);
    document.getElementById('shareBtn').dataset.id = id;
  }catch(e){
    console.error(e);
  }
  showScreen('result');
});

function buildPrompt(a){
  return `Write a heartfelt, personalized love letter with these details:
- From: ${a.senderName}
- To: ${a.recipientName}
- Relationship: ${a.relationship}
- How they met: ${a.howMet}
- Favorite memory together: ${a.favoriteMemory}
- What ${a.senderName} loves about ${a.recipientName}: ${a.whatYouLove}
- Inside joke/habit (if any): ${a.insideJoke || 'none'}
- Occasion: ${a.occasion}
- Tone: ${a.tone}
- Language: ${a.language}

Write ONLY the body of the letter (no greeting line like "Dear X," and no sign-off like "Love, X" — those are added separately). Keep it 120-180 words, warm, specific to the details given, and avoid generic clichés. Do not use markdown formatting.`;
}

async function callGemini(prompt){
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });
  const data = await res.json();
  if (!res.ok){
    const apiMsg = data?.error?.message || JSON.stringify(data);
    throw new Error(`API Error (${res.status}): ${apiMsg}`);
  }
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("No text in response: " + JSON.stringify(data));
  return text.trim();
}

// ---------- Postcard rendering ----------
function renderPostcard(sender, recipient, bodyText){
  document.getElementById('pcGreeting').textContent = `Dear ${recipient},`;
  document.getElementById('pcBody').textContent = bodyText;
  document.getElementById('pcSignoff').textContent = `— ${sender}`;
}

// ---------- Save to Firestore ----------
async function saveLetter(sender, recipient, letterText, style){
  const docRef = await db.collection('letters').add({
    senderName: sender,
    recipientName: recipient,
    letterText: letterText,
    style: style || 'sweet',
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  return docRef.id;
}

// ---------- Actions ----------
document.getElementById('shareBtn').addEventListener('click', () => {
  const id = document.getElementById('shareBtn').dataset.id;
  const link = `${window.location.origin}${window.location.pathname}?id=${id}`;
  navigator.clipboard.writeText(link).then(() => {
    alert("Link copied! Share it with them 💌");
  });
});

document.getElementById('downloadBtn').addEventListener('click', () => {
  html2canvas(document.getElementById('postcard')).then(canvas => {
    const link = document.createElement('a');
    link.download = 'love-letter.png';
    link.href = canvas.toDataURL();
    link.click();
  });
});

document.getElementById('restartBtn').addEventListener('click', () => {
  for (const k in answers) delete answers[k];
  currentQ = 0;
  selectedStyle = 'sweet';
  document.getElementById('introNameInput').value = '';
  document.getElementById('postcard').classList.remove('theme-romantic');
  document.querySelectorAll('.style-option').forEach(b => b.classList.remove('selected'));
  document.getElementById('styleSweet').classList.add('selected');
  window.history.replaceState({}, '', window.location.pathname);
  showScreen('intro');
});
      
