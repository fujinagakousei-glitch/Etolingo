import { useState, useCallback, useEffect, useRef } from "react";

function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const utterRef = useRef(null);
  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "fr-FR";
    utter.rate = 0.85;
    utter.pitch = 1.05;
    const voices = window.speechSynthesis.getVoices();
    const frVoice = voices.find(v => v.lang.startsWith("fr"));
    if (frVoice) utter.voice = frVoice;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
  }, []);
  const stop = useCallback(() => { window.speechSynthesis?.cancel(); setSpeaking(false); }, []);
  useEffect(() => {
    const load = () => {};
    window.speechSynthesis?.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis?.removeEventListener("voiceschanged", load);
  }, []);
  return { speak, stop, speaking };
}

function SpeakButton({ text, size = "md" }) {
  const { speak, speaking } = useSpeech();
  const isLg = size === "lg";
  return (
    <button onClick={e => { e.stopPropagation(); speak(text); }} title="発音を聞く" style={{ background: speaking ? "linear-gradient(135deg, #6366f1, #4f46e5)" : "rgba(99,102,241,0.15)", border: `2px solid ${speaking ? "#6366f1" : "rgba(99,102,241,0.4)"}`, borderRadius: "50%", width: isLg ? 52 : 40, height: isLg ? 52 : 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: isLg ? 22 : 17, flexShrink: 0, transition: "all 0.2s", animation: speaking ? "pulse 0.8s infinite" : "none" }}>
      {speaking ? "🔊" : "🔈"}
    </button>
  );
}

const LESSONS = [
  { id: 1, level: 1, title: "Bonjour!", subtitle: "基本の挨拶", icon: "👋", xp: 10, unlocked: true, exercises: [
    { type: "flashcard", fr: "Bonjour", ja: "こんにちは", hint: "Bon(良い) + jour(日)" },
    { type: "flashcard", fr: "Bonsoir", ja: "こんばんは", hint: "Bon(良い) + soir(夜)" },
    { type: "flashcard", fr: "Au revoir", ja: "さようなら", hint: "また会いましょう" },
    { type: "flashcard", fr: "Salut", ja: "やあ／バイバイ（カジュアル）", hint: "親しい人同士で使う" },
    { type: "multiple_choice", question: "「こんにちは」はフランス語で？", options: ["Au revoir", "Bonjour", "Merci", "Oui"], answer: "Bonjour" },
    { type: "multiple_choice", question: "「こんばんは」はフランス語で？", options: ["Bonjour", "Bonsoir", "Bonne nuit", "Salut"], answer: "Bonsoir" },
    { type: "multiple_choice", question: "「さようなら」はフランス語で？", options: ["Bonjour", "Merci", "Au revoir", "S'il vous plaît"], answer: "Au revoir" },
    { type: "translation", prompt: "こんにちは", answer: "Bonjour", hint: "Bon = 良い, jour = 日" },
    { type: "translation", prompt: "さようなら", answer: "Au revoir" },
    { type: "translation", prompt: "こんばんは", answer: "Bonsoir" },
  ]},
  { id: 2, level: 1, title: "Merci!", subtitle: "感謝と礼儀", icon: "🙏", xp: 10, unlocked: true, exercises: [
    { type: "flashcard", fr: "Merci", ja: "ありがとう" },
    { type: "flashcard", fr: "S'il vous plaît", ja: "お願いします（丁寧）" },
    { type: "flashcard", fr: "De rien", ja: "どういたしまして" },
    { type: "flashcard", fr: "Pardon", ja: "すみません" },
    { type: "flashcard", fr: "Excusez-moi", ja: "すみません（丁寧）" },
    { type: "multiple_choice", question: "「ありがとう」はフランス語で？", options: ["Pardon", "Merci", "Bonjour", "Non"], answer: "Merci" },
    { type: "multiple_choice", question: "「どういたしまして」はフランス語で？", options: ["Merci", "De rien", "Pardon", "Oui"], answer: "De rien" },
    { type: "translation", prompt: "ありがとう", answer: "Merci" },
    { type: "translation", prompt: "どういたしまして", answer: "De rien" },
  ]},
  { id: 3, level: 1, title: "Oui / Non", subtitle: "はい・いいえ", icon: "✅", xp: 10, unlocked: false, exercises: [
    { type: "flashcard", fr: "Oui", ja: "はい" },
    { type: "flashcard", fr: "Non", ja: "いいえ" },
    { type: "flashcard", fr: "Bien sûr", ja: "もちろん" },
    { type: "flashcard", fr: "D'accord", ja: "わかりました" },
    { type: "multiple_choice", question: "「もちろん」はフランス語で？", options: ["Peut-être", "Non", "Bien sûr", "Oui"], answer: "Bien sûr" },
    { type: "multiple_choice", question: "「わかりました」はフランス語で？", options: ["Peut-être", "D'accord", "Non", "Oui"], answer: "D'accord" },
    { type: "translation", prompt: "はい", answer: "Oui" },
    { type: "translation", prompt: "いいえ", answer: "Non" },
  ]},
  { id: 4, level: 1, title: "Les nombres 1–10", subtitle: "数字 1〜10", icon: "🔢", xp: 10, unlocked: false, exercises: [
    { type: "flashcard", fr: "un / une", ja: "1" },
    { type: "flashcard", fr: "deux", ja: "2" },
    { type: "flashcard", fr: "trois", ja: "3" },
    { type: "flashcard", fr: "cinq", ja: "5" },
    { type: "flashcard", fr: "dix", ja: "10" },
    { type: "multiple_choice", question: "「5」はフランス語で？", options: ["quatre", "six", "cinq", "sept"], answer: "cinq" },
    { type: "multiple_choice", question: "「8」はフランス語で？", options: ["sept", "neuf", "huit", "dix"], answer: "huit" },
    { type: "translation", prompt: "7", answer: "sept" },
    { type: "translation", prompt: "4", answer: "quatre" },
  ]},
  { id: 5, level: 1, title: "Les couleurs", subtitle: "色の表現", icon: "🎨", xp: 10, unlocked: false, exercises: [
    { type: "flashcard", fr: "rouge", ja: "赤" },
    { type: "flashcard", fr: "bleu", ja: "青" },
    { type: "flashcard", fr: "vert", ja: "緑" },
    { type: "flashcard", fr: "jaune", ja: "黄色" },
    { type: "flashcard", fr: "blanc", ja: "白" },
    { type: "flashcard", fr: "noir", ja: "黒" },
    { type: "multiple_choice", question: "「白」はフランス語で？", options: ["noir", "vert", "blanc", "jaune"], answer: "blanc" },
    { type: "multiple_choice", question: "「黒」はフランス語で？", options: ["blanc", "rose", "noir", "orange"], answer: "noir" },
    { type: "translation", prompt: "赤", answer: "rouge" },
    { type: "translation", prompt: "青", answer: "bleu" },
  ]},
  { id: 6, level: 2, title: "Je suis...", subtitle: "être動詞と自己紹介", icon: "🙋", xp: 15, unlocked: false, exercises: [
    { type: "flashcard", fr: "Je suis", ja: "私は〜です" },
    { type: "flashcard", fr: "Tu es", ja: "あなたは〜です" },
    { type: "flashcard", fr: "Je m'appelle...", ja: "私の名前は…です" },
    { type: "flashcard", fr: "Je suis étudiant", ja: "私は学生です" },
    { type: "multiple_choice", question: "「私は〜です」のêtre活用は？", options: ["je est", "je suis", "je être", "j'ai"], answer: "je suis" },
    { type: "multiple_choice", question: "「私の名前は〜です」は？", options: ["Tu t'appelles", "Je m'appelle", "Il s'appelle", "Nous appelons"], answer: "Je m'appelle" },
    { type: "translation", prompt: "私は学生です", answer: "Je suis étudiant" },
    { type: "translation", prompt: "私の名前は〜です", answer: "Je m'appelle" },
  ]},
  { id: 7, level: 2, title: "La famille", subtitle: "家族の言葉", icon: "👨‍👩‍👧", xp: 15, unlocked: false, exercises: [
    { type: "flashcard", fr: "la mère", ja: "母" },
    { type: "flashcard", fr: "le père", ja: "父" },
    { type: "flashcard", fr: "le frère", ja: "兄・弟" },
    { type: "flashcard", fr: "la sœur", ja: "姉・妹" },
    { type: "multiple_choice", question: "「兄・弟」はフランス語で？", options: ["la sœur", "le frère", "la mère", "le père"], answer: "le frère" },
    { type: "multiple_choice", question: "「両親」はフランス語で？", options: ["les enfants", "les parents", "les amis", "les filles"], answer: "les parents" },
    { type: "translation", prompt: "私の母", answer: "ma mère" },
    { type: "translation", prompt: "私の父", answer: "mon père" },
  ]},
  { id: 8, level: 2, title: "Avoir", subtitle: "avoir動詞", icon: "🤲", xp: 15, unlocked: false, exercises: [
    { type: "flashcard", fr: "j'ai", ja: "私は持っている" },
    { type: "flashcard", fr: "J'ai faim", ja: "お腹が空いています" },
    { type: "flashcard", fr: "J'ai soif", ja: "喉が渇いています" },
    { type: "flashcard", fr: "J'ai froid", ja: "寒いです" },
    { type: "multiple_choice", question: "「お腹が空いています」は？", options: ["J'ai soif", "J'ai faim", "J'ai chaud", "J'ai froid"], answer: "J'ai faim" },
    { type: "multiple_choice", question: "avoir の2人称は？", options: ["tu avoir", "tu ai", "tu as", "tu est"], answer: "tu as" },
    { type: "translation", prompt: "お腹が空いています", answer: "J'ai faim" },
    { type: "translation", prompt: "寒いです", answer: "J'ai froid" },
  ]},
  { id: 9, level: 3, title: "Articles", subtitle: "冠詞（le/la/un/une）", icon: "📖", xp: 20, unlocked: false, exercises: [
    { type: "flashcard", fr: "le", ja: "定冠詞（男性）", hint: "le livre = その本" },
    { type: "flashcard", fr: "la", ja: "定冠詞（女性）", hint: "la table = そのテーブル" },
    { type: "flashcard", fr: "un", ja: "不定冠詞（男性）", hint: "un chat = 一匹の猫" },
    { type: "flashcard", fr: "une", ja: "不定冠詞（女性）", hint: "une fleur = 一輪の花" },
    { type: "multiple_choice", question: "「一冊の本（男性名詞）」の冠詞は？", options: ["la", "le", "un", "une"], answer: "un" },
    { type: "multiple_choice", question: "「その猫（男性名詞）」の冠詞は？", options: ["la", "le", "un", "une"], answer: "le" },
    { type: "translation", prompt: "一匹の猫", answer: "un chat" },
    { type: "translation", prompt: "その本", answer: "le livre" },
  ]},
  { id: 10, level: 3, title: "Les questions", subtitle: "疑問文の作り方", icon: "❓", xp: 20, unlocked: false, exercises: [
    { type: "flashcard", fr: "Où est...?", ja: "〜はどこですか？" },
    { type: "flashcard", fr: "Pourquoi...?", ja: "なぜ？" },
    { type: "flashcard", fr: "Comment...?", ja: "どのように？" },
    { type: "flashcard", fr: "Combien...?", ja: "いくつ？いくら？" },
    { type: "multiple_choice", question: "「どこ？」を表す疑問詞は？", options: ["Quand", "Qui", "Où", "Comment"], answer: "Où" },
    { type: "multiple_choice", question: "「なぜ？」を表す疑問詞は？", options: ["Comment", "Pourquoi", "Combien", "Quand"], answer: "Pourquoi" },
    { type: "translation", prompt: "なぜですか？", answer: "Pourquoi" },
    { type: "translation", prompt: "いくらですか？", answer: "Combien" },
  ]},
  { id: 11, level: 3, title: "La nourriture", subtitle: "食べ物・飲み物", icon: "🍽️", xp: 20, unlocked: false, exercises: [
    { type: "flashcard", fr: "le pain", ja: "パン" },
    { type: "flashcard", fr: "le fromage", ja: "チーズ" },
    { type: "flashcard", fr: "le vin", ja: "ワイン" },
    { type: "flashcard", fr: "le café", ja: "コーヒー" },
    { type: "flashcard", fr: "l'eau", ja: "水" },
    { type: "multiple_choice", question: "「ワイン」はフランス語で？", options: ["le café", "l'eau", "le vin", "le pain"], answer: "le vin" },
    { type: "multiple_choice", question: "「水」はフランス語で？", options: ["le vin", "l'eau", "le café", "le jus"], answer: "l'eau" },
    { type: "translation", prompt: "チーズ", answer: "le fromage" },
    { type: "translation", prompt: "コーヒー", answer: "le café" },
  ]},
  { id: 12, level: 4, title: "Aller & Venir", subtitle: "行く・来る", icon: "🚶", xp: 25, unlocked: false, exercises: [
    { type: "flashcard", fr: "je vais", ja: "私は行く" },
    { type: "flashcard", fr: "tu vas", ja: "あなたは行く" },
    { type: "flashcard", fr: "Je vais à Paris", ja: "私はパリへ行きます" },
    { type: "flashcard", fr: "Je viens du Japon", ja: "私は日本から来ます" },
    { type: "multiple_choice", question: "aller の「私は行く」は？", options: ["je aller", "je viens", "je vais", "j'alle"], answer: "je vais" },
    { type: "multiple_choice", question: "「私はパリへ行きます」は？", options: ["Je viens Paris", "Je vais à Paris", "Je vais de Paris", "J'aller Paris"], answer: "Je vais à Paris" },
    { type: "translation", prompt: "私たちは行く", answer: "nous allons" },
    { type: "translation", prompt: "私はパリへ行きます", answer: "Je vais à Paris" },
  ]},
  { id: 13, level: 4, title: "Le temps", subtitle: "天気・時間", icon: "⛅", xp: 25, unlocked: false, exercises: [
    { type: "flashcard", fr: "Il fait beau", ja: "天気が良い" },
    { type: "flashcard", fr: "Il pleut", ja: "雨が降っている" },
    { type: "flashcard", fr: "Il neige", ja: "雪が降っている" },
    { type: "flashcard", fr: "Il fait chaud", ja: "暑い" },
    { type: "flashcard", fr: "Il fait froid", ja: "寒い" },
    { type: "multiple_choice", question: "「天気が良い」はフランス語で？", options: ["Il pleut", "Il neige", "Il fait beau", "Il fait froid"], answer: "Il fait beau" },
    { type: "multiple_choice", question: "「雨が降っている」はフランス語で？", options: ["Il neige", "Il pleut", "Il fait froid", "Il fait mauvais"], answer: "Il pleut" },
    { type: "translation", prompt: "天気が良い", answer: "Il fait beau" },
    { type: "translation", prompt: "雪が降っている", answer: "Il neige" },
  ]},
  { id: 14, level: 4, title: "Futur proche", subtitle: "近接未来", icon: "🔮", xp: 25, unlocked: false, exercises: [
    { type: "flashcard", fr: "Je vais manger", ja: "私は食べるつもりです" },
    { type: "flashcard", fr: "Tu vas voyager", ja: "あなたは旅行するつもりです" },
    { type: "flashcard", fr: "Il va pleuvoir", ja: "雨が降りそうです" },
    { type: "multiple_choice", question: "近接未来の構造は？", options: ["avoir + inf", "être + inf", "aller + inf", "faire + inf"], answer: "aller + inf" },
    { type: "multiple_choice", question: "「私は勉強するつもりです」は？", options: ["Je vais étudier", "J'étudie", "J'ai étudié", "Je suis étudier"], answer: "Je vais étudier" },
    { type: "translation", prompt: "私は食べるつもりです", answer: "Je vais manger" },
    { type: "translation", prompt: "私たちは出発するつもりです", answer: "Nous allons partir" },
  ]},
  { id: 15, level: 5, title: "Au restaurant", subtitle: "レストランでの会話", icon: "🍴", xp: 30, unlocked: false, exercises: [
    { type: "flashcard", fr: "Je voudrais...", ja: "〜をいただけますか" },
    { type: "flashcard", fr: "L'addition, s'il vous plaît", ja: "お会計をお願いします" },
    { type: "flashcard", fr: "C'est délicieux!", ja: "おいしいです！" },
    { type: "multiple_choice", question: "「お会計をお願いします」は？", options: ["La carte s'il vous plaît", "L'addition s'il vous plaît", "Une table s'il vous plaît", "Le menu s'il vous plaît"], answer: "L'addition s'il vous plaît" },
    { type: "multiple_choice", question: "「おいしいです」は？", options: ["C'est horrible", "C'est délicieux", "C'est difficile", "C'est chaud"], answer: "C'est délicieux" },
    { type: "translation", prompt: "コーヒーをいただけますか", answer: "Je voudrais un café" },
    { type: "translation", prompt: "お会計をお願いします", answer: "L'addition s'il vous plait" },
  ]},
  { id: 16, level: 5, title: "Passé composé", subtitle: "複合過去（〜した）", icon: "⏮️", xp: 30, unlocked: false, exercises: [
    { type: "flashcard", fr: "J'ai mangé", ja: "私は食べた" },
    { type: "flashcard", fr: "Tu as parlé", ja: "あなたは話した" },
    { type: "flashcard", fr: "J'ai vu", ja: "私は見た" },
    { type: "flashcard", fr: "J'ai fait", ja: "私はした・作った" },
    { type: "multiple_choice", question: "「私は食べた」は？", options: ["J'ai manger", "Je mange", "J'ai mangé", "J'avais mangé"], answer: "J'ai mangé" },
    { type: "multiple_choice", question: "「私は見た」は？", options: ["J'ai voiré", "J'ai voir", "J'ai vu", "J'ai venu"], answer: "J'ai vu" },
    { type: "translation", prompt: "私は食べた", answer: "J'ai mangé" },
    { type: "translation", prompt: "私たちは見た", answer: "Nous avons vu" },
  ]},
];

function normalize(str) {
  return str.trim().toLowerCase()
    .replace(/[àâä]/g, "a").replace(/[éèêë]/g, "e")
    .replace(/[îï]/g, "i").replace(/[ôö]/g, "o")
    .replace(/[ùûü]/g, "u").replace(/[ç]/g, "c")
    .replace(/[?!.,]/g, "").replace(/\s+/g, " ").trim();
}

function ProgressBar({ value, max, color = "#4ade80" }) {
  return (
    <div style={{ background: "#1e293b", borderRadius: 99, height: 10, overflow: "hidden", width: "100%" }}>
      <div style={{ width: `${Math.round((value/max)*100)}%`, height: "100%", background: `linear-gradient(90deg, ${color}, ${color}cc)`, borderRadius: 99, transition: "width 0.4s cubic-bezier(.4,0,.2,1)" }} />
    </div>
  );
}

function XPBadge({ xp }) {
  return <div style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#1a1200", fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 13, borderRadius: 99, padding: "3px 12px", display: "inline-flex", alignItems: "center", gap: 4 }}>⚡ {xp} XP</div>;
}

function ResultOverlay({ correct, onNext, correctAnswer }) {
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: correct ? "linear-gradient(135deg, #064e3b, #065f46)" : "linear-gradient(135deg, #7f1d1d, #991b1b)", padding: "24px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `3px solid ${correct ? "#34d399" : "#f87171"}`, animation: "slideUp 0.3s cubic-bezier(.4,0,.2,1)", zIndex: 100 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: correct ? "#34d399" : "#f87171", fontFamily: "'Sora', sans-serif" }}>{correct ? "🎉 正解！" : "😅 不正解"}</div>
        {!correct && correctAnswer && <div style={{ color: "#fca5a5", marginTop: 4, fontFamily: "'Noto Sans JP', sans-serif", fontSize: 14 }}>正解：<strong style={{ color: "#fff" }}>{correctAnswer}</strong></div>}
      </div>
      <button onClick={onNext} style={{ background: correct ? "#34d399" : "#f87171", color: "#0a0a0a", border: "none", borderRadius: 14, padding: "12px 32px", fontWeight: 800, fontSize: 16, fontFamily: "'Sora', sans-serif", cursor: "pointer" }}>続ける →</button>
    </div>
  );
}

function FlashcardExercise({ exercise, onComplete }) {
  const [flipped, setFlipped] = useState(false);
  const { speak } = useSpeech();
  useEffect(() => { const t = setTimeout(() => speak(exercise.fr), 400); return () => clearTimeout(t); }, [exercise.fr]);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
      <p style={{ color: "#94a3b8", fontFamily: "'Noto Sans JP', sans-serif", fontSize: 15 }}>カードをタップして意味を確認しよう</p>
      <div onClick={() => setFlipped(f => !f)} style={{ width: 320, height: 210, cursor: "pointer", perspective: 1000, position: "relative" }}>
        <div style={{ width: "100%", height: "100%", position: "relative", transformStyle: "preserve-3d", transition: "transform 0.5s cubic-bezier(.4,0,.2,1)", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: "linear-gradient(135deg, #1e3a5f, #0f2447)", borderRadius: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "1px solid #2d4a7a", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
            <div style={{ fontSize: 30, fontWeight: 700, color: "#e2e8f0", fontFamily: "'Playfair Display', serif", textAlign: "center", padding: "0 20px" }}>{exercise.fr}</div>
            <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 8 }}><SpeakButton text={exercise.fr} /><span style={{ color: "#64748b", fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif" }}>タップで翻訳</span></div>
          </div>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "linear-gradient(135deg, #1a3a1a, #0f2a0f)", borderRadius: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "1px solid #2d5a2d", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#86efac", fontFamily: "'Noto Sans JP', sans-serif", textAlign: "center", padding: "0 20px" }}>{exercise.ja}</div>
            {exercise.hint && <div style={{ color: "#4ade80", marginTop: 10, fontSize: 13, fontFamily: "'Noto Sans JP', sans-serif", opacity: 0.7, textAlign: "center", padding: "0 16px" }}>💡 {exercise.hint}</div>}
            <div style={{ marginTop: 12 }} onClick={e => e.stopPropagation()}><SpeakButton text={exercise.fr} /></div>
          </div>
        </div>
      </div>
      {flipped && <button onClick={() => onComplete(true)} style={{ background: "linear-gradient(135deg, #4ade80, #22c55e)", color: "#0a1a0a", border: "none", borderRadius: 14, padding: "14px 48px", fontWeight: 800, fontSize: 16, fontFamily: "'Sora', sans-serif", cursor: "pointer", boxShadow: "0 4px 20px rgba(74,222,128,0.3)", animation: "fadeIn 0.3s ease" }}>わかった！✓</button>}
    </div>
  );
}

function MultipleChoiceExercise({ exercise, onComplete }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const { speak } = useSpeech();
  useEffect(() => { if (submitted) { const t = setTimeout(() => speak(exercise.answer), 600); return () => clearTimeout(t); } }, [submitted]);
  const handleSubmit = () => { if (!selected) return; setSubmitted(true); const correct = selected === exercise.answer; setTimeout(() => onComplete(correct, exercise.answer), 1400); };
  const getColor = o => { if (!submitted) return selected === o ? "#2563eb" : "#1e293b"; if (o === exercise.answer) return "#065f46"; if (o === selected) return "#7f1d1d"; return "#1e293b"; };
  const getBorder = o => { if (!submitted) return selected === o ? "2px solid #60a5fa" : "2px solid #334155"; if (o === exercise.answer) return "2px solid #34d399"; if (o === selected) return "2px solid #f87171"; return "2px solid #334155"; };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
      <p style={{ color: "#94a3b8", fontFamily: "'Noto Sans JP', sans-serif", fontSize: 14, textAlign: "center" }}>正しいものを選んでください</p>
      <div style={{ background: "linear-gradient(135deg, #0f172a, #1e1b4b)", borderRadius: 20, padding: "24px 28px", textAlign: "center", border: "1px solid #312e81", marginBottom: 8 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#e2e8f0", fontFamily: "'Noto Sans JP', sans-serif", lineHeight: 1.5 }}>{exercise.question}</div>
        {submitted && <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}><SpeakButton text={exercise.answer} /></div>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {exercise.options.map(opt => <button key={opt} onClick={() => !submitted && setSelected(opt)} style={{ background: getColor(opt), border: getBorder(opt), borderRadius: 14, padding: "16px 12px", color: "#e2e8f0", fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 14, cursor: submitted ? "default" : "pointer", transition: "all 0.2s", transform: selected === opt && !submitted ? "scale(1.03)" : "scale(1)" }}>{opt}</button>)}
      </div>
      {selected && !submitted && <button onClick={handleSubmit} style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", border: "none", borderRadius: 14, padding: "14px", fontWeight: 800, fontSize: 16, fontFamily: "'Sora', sans-serif", cursor: "pointer", marginTop: 8 }}>確認する</button>}
    </div>
  );
}

function TranslationExercise({ exercise, onComplete }) {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { speak } = useSpeech();
  const handleSubmit = () => { if (!input.trim()) return; setSubmitted(true); const correct = normalize(input) === normalize(exercise.answer); setTimeout(() => speak(exercise.answer), 400); setTimeout(() => onComplete(correct, exercise.answer), 1200); };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%" }}>
      <p style={{ color: "#94a3b8", fontFamily: "'Noto Sans JP', sans-serif", fontSize: 14, textAlign: "center" }}>フランス語に翻訳してください</p>
      <div style={{ background: "linear-gradient(135deg, #1e1b4b, #0f172a)", borderRadius: 20, padding: "28px 32px", textAlign: "center", border: "1px solid #312e81" }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#e2e8f0", fontFamily: "'Noto Sans JP', sans-serif" }}>{exercise.prompt}</div>
        {exercise.hint && <div style={{ color: "#818cf8", marginTop: 10, fontSize: 13, fontFamily: "'Noto Sans JP', sans-serif" }}>💡 {exercise.hint}</div>}
        {submitted && <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}><SpeakButton text={exercise.answer} /></div>}
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !submitted && handleSubmit()} disabled={submitted} placeholder="フランス語で入力…" style={{ background: "#0f172a", border: "2px solid #334155", borderRadius: 14, padding: "16px 20px", color: "#e2e8f0", fontFamily: "'Sora', sans-serif", fontSize: 20, outline: "none", width: "100%", boxSizing: "border-box" }} autoFocus />
      {!submitted && <button onClick={handleSubmit} disabled={!input.trim()} style={{ background: input.trim() ? "linear-gradient(135deg, #6366f1, #4f46e5)" : "#1e293b", color: input.trim() ? "#fff" : "#475569", border: "none", borderRadius: 14, padding: "14px", fontWeight: 800, fontSize: 16, fontFamily: "'Sora', sans-serif", cursor: input.trim() ? "pointer" : "default", transition: "all 0.2s" }}>確認する</button>}
    </div>
  );
}

function HomeScreen({ lessons, xp, streak, onStart }) {
  const level = Math.floor(xp / 50) + 1;
  const levelXp = xp % 50;
  const LEVEL_LABELS = { 1: "入門", 2: "基礎", 3: "初級", 4: "中級", 5: "上級" };
  const grouped = [1,2,3,4,5].map(lv => ({ lv, label: LEVEL_LABELS[lv], items: lessons.filter(l => l.level === lv) }));
  return (
    <div style={{ minHeight: "100vh", background: "#030712", color: "#e2e8f0", fontFamily: "'Sora', sans-serif" }}>
      <div style={{ background: "linear-gradient(180deg, #0f172a 0%, #030712 100%)", borderBottom: "1px solid #1e293b", padding: "20px 24px", position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>🇫🇷 <span style={{ background: "linear-gradient(135deg, #60a5fa, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Etolingo</span></div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2, fontFamily: "'Noto Sans JP', sans-serif" }}>フランス語を楽しく学ぼう</div>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ textAlign: "center" }}><div style={{ fontSize: 20 }}>🔥</div><div style={{ fontSize: 12, color: "#fb923c", fontWeight: 700 }}>{streak}日</div></div>
          <XPBadge xp={xp} />
        </div>
      </div>
      <div style={{ padding: "24px 24px 0" }}>
        <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #0f2447 100%)", borderRadius: 24, padding: "24px", border: "1px solid #2d4a7a" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div><div style={{ fontSize: 13, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>現在のレベル</div><div style={{ fontSize: 32, fontWeight: 800, color: "#60a5fa" }}>Lv.{level}</div></div>
            <div style={{ fontSize: 28 }}>🏅</div>
          </div>
          <ProgressBar value={levelXp} max={50} color="#60a5fa" />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 11, color: "#475569" }}>{levelXp} XP</span>
            <span style={{ fontSize: 11, color: "#475569" }}>次のレベルまで {50 - levelXp} XP</span>
          </div>
        </div>
      </div>
      <div style={{ padding: "24px" }}>
        {grouped.map(({ lv, label, items }) => (
          <div key={lv} style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ background: lv===1?"#1e3a5f":lv===2?"#1a3a1a":lv===3?"#2d1b4e":lv===4?"#3a2a0a":"#3a0a0a", color: lv===1?"#60a5fa":lv===2?"#4ade80":lv===3?"#a78bfa":lv===4?"#fbbf24":"#f87171", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99 }}>LEVEL {lv}</div>
              <div style={{ fontSize: 14, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>{label}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {items.map(lesson => (
                <div key={lesson.id} onClick={() => lesson.unlocked && onStart(lesson)} style={{ background: lesson.unlocked?"linear-gradient(135deg, #1e293b, #0f172a)":"#0a0f1a", borderRadius: 18, padding: "18px 20px", border: lesson.unlocked?"1px solid #334155":"1px solid #1e293b", opacity: lesson.unlocked?1:0.45, cursor: lesson.unlocked?"pointer":"default", display: "flex", alignItems: "center", gap: 14, transition: "transform 0.15s" }} onMouseEnter={e => lesson.unlocked&&(e.currentTarget.style.transform="translateY(-2px)")} onMouseLeave={e => (e.currentTarget.style.transform="translateY(0)")}>
                  <div style={{ fontSize: 30 }}>{lesson.unlocked?lesson.icon:"🔒"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: lesson.unlocked?"#e2e8f0":"#475569" }}>{lesson.title}</div>
                    <div style={{ fontSize: 12, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif", marginTop: 2 }}>{lesson.subtitle}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 6 }}><span style={{ fontSize: 11, color: "#64748b" }}>+{lesson.xp} XP</span><span style={{ fontSize: 11, color: "#334155" }}>·</span><span style={{ fontSize: 11, color: "#64748b" }}>{lesson.exercises.length}問</span></div>
                  </div>
                  {lesson.unlocked && <div style={{ color: "#334155", fontSize: 18 }}>›</div>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ height: 40 }} />
    </div>
  );
}

function LessonScreen({ lesson, onComplete, onExit }) {
  const [exIdx, setExIdx] = useState(0);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const exercises = lesson.exercises;
  const current = exercises[exIdx];
  const handleComplete = (correct, correctAnswer) => { setResult({ correct, correctAnswer }); if (correct) setScore(s => s+1); };
  const handleNext = () => { const ns = score+(result?.correct?1:0); setResult(null); if (exIdx+1>=exercises.length) { onComplete(ns, exercises.length); } else { setExIdx(i=>i+1); } };
  return (
    <div style={{ minHeight: "100vh", background: "#030712", color: "#e2e8f0", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, borderBottom: "1px solid #1e293b", background: "#030712", position: "sticky", top: 0, zIndex: 40 }}>
        <button onClick={onExit} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 20, padding: 4 }}>✕</button>
        <div style={{ flex: 1 }}><ProgressBar value={exIdx} max={exercises.length} color="#6366f1" /></div>
        <div style={{ fontSize: 13, color: "#64748b" }}>{exIdx}/{exercises.length}</div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", gap: 16 }}>
        <div style={{ width: "100%", maxWidth: 480, background: "#1e293b20", borderRadius: 8, padding: "6px 16px", textAlign: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: "#475569", fontFamily: "'Noto Sans JP', sans-serif" }}>{current.type==="flashcard"?"📖 フラッシュカード":current.type==="multiple_choice"?"🎯 選択問題":"✍️ 翻訳問題"}</span>
        </div>
        <div style={{ width: "100%", maxWidth: 480 }}>
          {current.type==="flashcard"&&<FlashcardExercise key={exIdx} exercise={current} onComplete={handleComplete}/>}
          {current.type==="multiple_choice"&&<MultipleChoiceExercise key={exIdx} exercise={current} onComplete={handleComplete}/>}
          {current.type==="translation"&&<TranslationExercise key={exIdx} exercise={current} onComplete={handleComplete}/>}
        </div>
      </div>
      {result&&<ResultOverlay correct={result.correct} correctAnswer={result.correctAnswer} onNext={handleNext}/>}
    </div>
  );
}

function CompletionScreen({ lesson, score, total, xpEarned, onHome }) {
  const perfect = score===total;
  return (
    <div style={{ minHeight: "100vh", background: "#030712", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
      <div style={{ fontSize: 80, marginBottom: 24, animation: "bounceIn 0.6s" }}>{perfect?"🏆":score>=total*0.6?"🎉":"💪"}</div>
      <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 32, fontWeight: 800, background: "linear-gradient(135deg, #60a5fa, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 8 }}>{perfect?"パーフェクト！":score>=total*0.6?"よくできました！":"もう少し！"}</div>
      <div style={{ color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif", fontSize: 16, marginBottom: 40 }}>{lesson.title} — {score}/{total} 正解</div>
      <div style={{ background: "#0f172a", borderRadius: 24, padding: "32px 48px", border: "1px solid #1e293b", marginBottom: 40, width: "100%", maxWidth: 320 }}>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <div><div style={{ fontSize: 36, fontWeight: 800, color: "#fbbf24" }}>⚡{xpEarned}</div><div style={{ fontSize: 12, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>獲得XP</div></div>
          <div style={{ width: 1, background: "#1e293b" }} />
          <div><div style={{ fontSize: 36, fontWeight: 800, color: "#34d399" }}>{score}/{total}</div><div style={{ fontSize: 12, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>正解数</div></div>
        </div>
      </div>
      <button onClick={onHome} style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", border: "none", borderRadius: 16, padding: "16px 48px", fontWeight: 800, fontSize: 18, fontFamily: "'Sora', sans-serif", cursor: "pointer" }}>ホームへ戻る</button>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [activeLesson, setActiveLesson] = useState(null);
  const [lessonResult, setLessonResult] = useState(null);
  const [xp, setXp] = useState(0);
  const [streak] = useState(3);
  const [lessons, setLessons] = useState(LESSONS);
  const handleStart = lesson => { setActiveLesson(lesson); setScreen("lesson"); };
  const handleLessonComplete = (score, total) => {
    const xpEarned = Math.round(activeLesson.xp*(score/total));
    setXp(prev=>prev+xpEarned);
    setLessonResult({ score, total, xpEarned });
    setLessons(prev=>prev.map((l,i)=>{ const idx=prev.findIndex(x=>x.id===activeLesson.id); if(i===idx+1) return {...l,unlocked:true}; return l; }));
    setScreen("complete");
  };
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Playfair+Display:wght@700&family=Noto+Sans+JP:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #030712; }
        @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounceIn { 0% { transform: scale(0.3); opacity: 0; } 60% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.5); } 50% { box-shadow: 0 0 0 8px rgba(99,102,241,0); } }
        input::placeholder { color: #334155; }
        input:focus { border-color: #6366f1 !important; }
      `}</style>
      {screen==="home"&&<HomeScreen lessons={lessons} xp={xp} streak={streak} onStart={handleStart}/>}
      {screen==="lesson"&&activeLesson&&<LessonScreen lesson={activeLesson} onComplete={handleLessonComplete} onExit={()=>setScreen("home")}/>}
      {screen==="complete"&&lessonResult&&<CompletionScreen lesson={activeLesson} score={lessonResult.score} total={lessonResult.total} xpEarned={lessonResult.xpEarned} onHome={()=>setScreen("home")}/>}
    </>
  );
}
