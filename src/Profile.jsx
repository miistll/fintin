import React, { useMemo, useState } from "react";
import { supabase } from "./supabaseClient";
import "./Profile.css";

const ACHIEVEMENTS = [
  { id: "first_saving", icon: "🐷", title: "Первая копейка", desc: "Первое пополнение копилки" },
  { id: "first_goal", icon: "🎯", title: "Первая цель", desc: "Создана первая финансовая цель" },
  { id: "dream_done", icon: "🎉", title: "Мечта сбылась", desc: "Накоплено на цель" },
  { id: "ten_ops", icon: "📊", title: "Финансовый детектив", desc: "Добавлено 10 операций" },
  { id: "first_expense", icon: "🧾", title: "Экономист", desc: "Добавлен первый расход" },
  { id: "first_article", icon: "📖", title: "Инвестор в себя", desc: "Прочитана первая статья" },
  { id: "five_articles", icon: "📚", title: "Книжный червь", desc: "Прочитано 5 статей" },
  { id: "five_savings", icon: "💚", title: "Щедрая душа", desc: "Пополнено 5 раз" },
  { id: "rich", icon: "💎", title: "Богач", desc: "Накоплено 10 000 ₽" },
];

export default function Profile({
  onNavigate,
  displayName,
  setDisplayName,
  saved,
  goal,
  goalName,
  progress,
  income,
  expenses,
  balance,
  incomeHistory,
  expenseHistory,
  savingsHistory,
  readArticles,
  achievements,
  setAchievements,
}) {
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(displayName || "");

  const email = supabase.auth.getUser ? "" : ""; // fallback
  const userName = displayName || "Друг";

  // XP: операции + пополнения + статьи + достижения
  const xp =
    (incomeHistory.length + expenseHistory.length) * 10 +
    savingsHistory.length * 20 +
    readArticles.length * 15 +
    achievements.length * 50;

  // Уровни
  const levels = [
    { min: 0, name: "Новичок" },
    { min: 100, name: "Копилкин" },
    { min: 250, name: "Финансовый ниндзя" },
    { min: 500, name: "Маг денег" },
    { min: 1000, name: "Гуру финансов" },
  ];
  const currentLevel = [...levels].reverse().find((l) => xp >= l.min) || levels[0];
  const nextLevel = levels.find((l) => l.min > xp);
  const xpToNext = nextLevel ? nextLevel.min - xp : 0;
  const levelProgress = nextLevel
    ? ((xp - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100
    : 100;

  // Автовыдача достижений
  const computed = useMemo(() => {
    const have = new Set(achievements);
    const add = [];
    if (savingsHistory.length >= 1) add.push("first_saving");
    if (goal > 0) add.push("first_goal");
    if (goal > 0 && saved >= goal) add.push("dream_done");
    if (incomeHistory.length + expenseHistory.length >= 10) add.push("ten_ops");
    if (expenseHistory.length >= 1) add.push("first_expense");
    if (readArticles.length >= 1) add.push("first_article");
    if (readArticles.length >= 5) add.push("five_articles");
    if (savingsHistory.length >= 5) add.push("five_savings");
    if (saved >= 10000) add.push("rich");
    add.forEach((id) => have.add(id));
    return Array.from(have);
  }, [achievements, savingsHistory, goal, saved, incomeHistory, expenseHistory, readArticles]);

  React.useEffect(() => {
    if (computed.length !== achievements.length) {
      setAchievements(computed);
    }
  }, [computed, achievements.length, setAchievements]);

  // Финансовый характер
  const character = useMemo(() => {
    if (saved > 0 && saved >= expenses) return { emoji: "🐿️", title: "Копитель", desc: "Ты умеешь откладывать — так держать!" };
    if (expenses > income) return { emoji: "🛍️", title: "Транжира", desc: "Расходы больше доходов. Попробуй сократить лишнее." };
    if (readArticles.length > 0) return { emoji: "📚", title: "Инвестор в себя", desc: "Ты вкладываешь в знания — это лучшая инвестиция." };
    return { emoji: "⚖️", title: "Сбалансированный", desc: "Доходы и расходы под контролем." };
  }, [saved, expenses, income, readArticles]);

  function saveName() {
    if (tempName.trim()) setDisplayName(tempName.trim());
    setEditingName(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="logo">Фин<span>Тин</span></h1>
      </header>

      {/* Карточка пользователя */}
      <section className="profile-card">
        <div className="profile-avatar">{userName[0]?.toUpperCase() || "Ф"}</div>
        <div className="profile-info">
          {editingName ? (
            <div className="name-edit">
              <input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Твоё имя"
                maxLength={20}
              />
              <button onClick={saveName}>✓</button>
            </div>
          ) : (
            <h2 onClick={() => { setTempName(userName); setEditingName(true); }}>
              {userName} <span className="edit-pencil">✎</span>
            </h2>
          )}
          <p className="profile-char">{character.emoji} {character.title}</p>
        </div>
      </section>

      {/* Уровень и опыт */}
      <section className="level-card">
        <div className="level-top">
          <span className="level-name">{currentLevel.name}</span>
          <span className="level-xp">{xp} XP</span>
        </div>
        <div className="level-bar">
          <div className="level-fill" style={{ width: `${levelProgress}%` }} />
        </div>
        <p className="level-hint">
          {nextLevel ? `До «${nextLevel.name}» осталось ${xpToNext} XP` : "Максимальный уровень! 🏆"}
        </p>
      </section>

      {/* Финансовый характер */}
      <section className="character-card">
        <div className="character-emoji">{character.emoji}</div>
        <div>
          <h3>{character.title}</h3>
          <p>{character.desc}</p>
        </div>
      </section>

      {/* Достижения */}
      <section className="achievements-section">
        <h2>Достижения <span className="ach-count">{computed.length}/{ACHIEVEMENTS.length}</span></h2>
        <div className="achievements-grid">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = computed.includes(a.id);
            return (
              <div key={a.id} className={`achievement ${unlocked ? "unlocked" : "locked"}`}>
                <div className="ach-icon">{a.icon}</div>
                <p className="ach-title">{a.title}</p>
                <p className="ach-desc">{a.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Прогресс курсов */}
      <section className="courses-progress">
        <h2>Мои статьи</h2>
        <p className="courses-count">
          Прочитано <strong>{readArticles.length}</strong> статей
        </p>
        <button className="go-courses" onClick={() => onNavigate("courses")}>
          Перейти к курсам →
        </button>
      </section>

      {/* Настройки */}
      <section className="settings">
        <h2>Настройки</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Выйти из аккаунта
        </button>
      </section>

      <nav className="bottom-nav">
        <button className="nav-item" onClick={() => onNavigate("home")}>
          <svg viewBox="0 0 24 24"><path d="M3 10.5L12 3l9 7.5V21h-6v-6H9v6H3z" /></svg>
          <span>Главная</span>
        </button>
        <button className="nav-item" onClick={() => onNavigate("savings")}>
          <svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="14" rx="3" /><path d="M3 9h18" /><path d="M16 13h5" /><circle cx="16" cy="13" r="1" /><path d="M7 6V4h11v2" /></svg>
          <span>Копилка</span>
        </button>
        <button className="nav-item" onClick={() => onNavigate("courses")}>
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 7.5C10.2 5.8 7.2 5 3.5 5.5V18 C7 17.5 10 18.3 12 20 C14 18.3 17 17.5 20.5 18V5.5 C16.8 5 13.8 5.8 12 7.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 7.5V20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            <path d="M6.5 9.5C8 9.5 9.3 9.8 10.2 10.4M6.5 12.5C8 12.5 9.3 12.8 10.2 13.4M17.5 9.5C16 9.5 14.7 9.8 13.8 10.4M17.5 12.5C16 12.5 14.7 12.8 13.8 13.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <span>Курсы</span>
        </button>
        <button className="nav-item active">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" /></svg>
          <span>Профиль</span>
        </button>
      </nav>
    </div>
  );
}