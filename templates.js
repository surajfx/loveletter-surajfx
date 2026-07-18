// Template-based letter composer — no external API required.
// Builds a personalized letter from the wizard answers using
// pre-written sentence templates, similar to MyHeartCraft's editable-message pattern.

const OPENERS = {
  "Romantic & Poetic": [
    "From the moment {howMet}, I knew something in my life had quietly shifted.",
    "I don't know if I ever told you this properly, but the day {howMet}, everything felt a little more like a story worth telling.",
    "Some people walk into your life and rearrange it without even trying — that's exactly what happened when {howMet}."
  ],
  "Warm & Simple": [
    "I've been meaning to write this for a while now — just a few honest words about how much you mean to me.",
    "I still think about the day {howMet}, and how glad I am that it happened.",
    "This isn't anything fancy, just something from the heart."
  ],
  "Playful & Fun": [
    "Okay, so I tried to write something serious and mushy, but honestly — {howMet} — and my life has been more fun ever since. So let's just go with that.",
    "Fair warning: this letter has zero chill, because that's what you do to me.",
    "I was going to write a normal letter, but then I remembered how {howMet}, and decided normal wasn't an option."
  ],
  "Deep & Emotional": [
    "There are things I carry quietly, and one of them is how much {howMet} changed the shape of my days.",
    "I've sat with this letter for longer than I'd like to admit, because some feelings are hard to put into words.",
    "I don't say this enough, so let me say it here: {howMet}, and I haven't been the same since — in the best way."
  ]
};

const MEMORY_LINES = {
  "Romantic & Poetic": "I still hold onto {favoriteMemory} — it's one of those memories that feels warmer every time I return to it.",
  "Warm & Simple": "One memory I keep coming back to is {favoriteMemory}. It still makes me smile.",
  "Playful & Fun": "Remember {favoriteMemory}? Honestly, ten out of ten, no notes.",
  "Deep & Emotional": "I think about {favoriteMemory} more often than I probably should — it reminds me why you matter so much to me."
};

const LOVE_LINES = {
  "Romantic & Poetic": "What I love most is {whatYouLove} — it's the kind of thing that makes ordinary days feel like they were made for us.",
  "Warm & Simple": "Honestly, {whatYouLove} — that's what I love most about you.",
  "Playful & Fun": "Also — {whatYouLove}. Just wanted that on record.",
  "Deep & Emotional": "{whatYouLove}. I don't think I've ever told you how much that means to me, so I'm telling you now."
};

const JOKE_LINES = {
  "Romantic & Poetic": "And of course — {insideJoke} — a little secret that belongs only to us.",
  "Warm & Simple": "Also, {insideJoke}. Never gets old.",
  "Playful & Fun": "P.S. {insideJoke}. I will never let this go.",
  "Deep & Emotional": "Even now, {insideJoke} — it's a small thing, but it's ours."
};

const OCCASION_CLOSERS = {
  "Just because": "I just wanted you to know all this, today, for no reason other than you deserve to hear it.",
  "Anniversary": "Here's to everything we've built together, and everything still ahead of us.",
  "Birthday": "So today, of all days, I wanted to remind you how loved you are.",
  "Apology": "I'm sorry for what happened between us — and I hope this letter says what I couldn't find the words for in person.",
  "Confession / First time saying it": "I've wanted to say this for a while now, so here it is, in writing: I really, really like you.",
  "Long distance / Missing them": "Distance is hard, but this letter is my way of closing the gap, even just a little."
};

const SIGNOFFS = {
  "Romantic & Poetic": "Forever yours,",
  "Warm & Simple": "With all my love,",
  "Playful & Fun": "Yours (unofficially, officially),",
  "Deep & Emotional": "With everything I have,"
};

function fillTemplate(str, answers){
  return str
    .replace(/{howMet}/g, answers.howMet || "we first met")
    .replace(/{favoriteMemory}/g, answers.favoriteMemory || "our time together")
    .replace(/{whatYouLove}/g, answers.whatYouLove || "everything about you")
    .replace(/{insideJoke}/g, answers.insideJoke || "our little thing");
}

function pick(arr){
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateTemplateLetter(answers){
  const tone = answers.tone || "Warm & Simple";
  const parts = [];

  parts.push(fillTemplate(pick(OPENERS[tone] || OPENERS["Warm & Simple"]), answers));
  parts.push(fillTemplate(MEMORY_LINES[tone] || MEMORY_LINES["Warm & Simple"], answers));
  parts.push(fillTemplate(LOVE_LINES[tone] || LOVE_LINES["Warm & Simple"], answers));

  if (answers.insideJoke && answers.insideJoke.trim()){
    parts.push(fillTemplate(JOKE_LINES[tone] || JOKE_LINES["Warm & Simple"], answers));
  }

  parts.push(OCCASION_CLOSERS[answers.occasion] || OCCASION_CLOSERS["Just because"]);

  return parts.join("\n\n");
}
