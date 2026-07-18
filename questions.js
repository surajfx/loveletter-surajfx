// All wizard questions in order.
// type: "text" | "textarea" | "choice"
const QUESTIONS = [
  {
    id: "senderName",
    type: "text",
    label: "What's your name?",
    placeholder: "e.g. Suraj"
  },
  {
    id: "relationship",
    type: "choice",
    label: "What's your relationship?",
    options: ["Girlfriend/Boyfriend", "Husband/Wife", "Crush", "Best Friend", "Fiancé(e)", "Other"]
  },
  {
    id: "howMet",
    type: "textarea",
    label: "How did you two meet? (a line or two)",
    placeholder: "e.g. We met in college during a group project..."
  },
  {
    id: "favoriteMemory",
    type: "textarea",
    label: "What's your favorite memory together?",
    placeholder: "e.g. Our first trip to Darjeeling..."
  },
  {
    id: "whatYouLove",
    type: "textarea",
    label: "What do you love most about them?",
    placeholder: "e.g. Their smile, the way they listen, their patience with me..."
  },
  {
    id: "insideJoke",
    type: "textarea",
    label: "Any inside joke or little habit only you two would get? (optional)",
    placeholder: "e.g. They always steal fries off my plate...",
    optional: true
  },
  {
    id: "occasion",
    type: "choice",
    label: "What's the occasion?",
    options: ["Just because", "Anniversary", "Birthday", "Apology", "Confession / First time saying it", "Long distance / Missing them"]
  },
  {
    id: "tone",
    type: "choice",
    label: "What tone should the letter have?",
    options: ["Romantic & Poetic", "Warm & Simple", "Playful & Fun", "Deep & Emotional"]
  },
  {
    id: "language",
    type: "choice",
    label: "Language",
    options: ["English", "Bengali", "Hindi", "Hinglish"]
  }
];
