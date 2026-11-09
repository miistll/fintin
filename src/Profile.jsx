import React from "react";
import "./Profile.css";

export default function Profile({
  onNavigate,
  saved = 0,
  goal = 0,
  incomeHistory = [],
  expenseHistory = [],
  savingsHistory = [],
}) {
  const operationsCount =
    incomeHistory.length + expenseHistory.length;

  const achievements = [
    {
      id: 1,
      icon: "🐷",
      title: "Первое пополнение",
      description: "Ты впервые пополнил копилку!",
      unlocked: savingsHistory.length > 0,
    },
    {
      id: 2,
      icon: "👣",
      title: "Первые шаги",
      description: "Ты добавил свою первую операцию!",
      unlocked: operationsCount >= 1,
    },
    {
      id: 3,
      icon: "🏆",
      title: "Первая цель",
      description: "Ты накопил на свою первую цель!",
      unlocked: goal > 0 && saved >= goal,
    },
    {
      id: 4,
      icon: "⭐",
      title: "Финансовый опыт",
      description: "Ты добавил 10 доходов или расходов!",
      unlocked: operationsCount >= 10,
    },
  ];

  return (
    <div className="app profile-page">
      <header className="header">
        <h1 className="logo">
          Фин<span>Тин</span>
        </h1>
        <div className="greeting">
          <h2>Мои достижения</h2>
          <p>Собирай награды и развивай финансовые навыки!</p>
        </div>
      </header>

      <section className="achievements-section">
        <div className="achievements-count">
          <span>Открыто достижений</span>
          <strong>
            {achievements.filter((item) => item.unlocked).length}
            {" / "}
            {achievements.length}
          </strong>
        </div>

        <div className="achievements-list">
          {achievements.map((item) => (
            <div
              key={item.id}
              className={`achievement-card ${
                item.unlocked ? "unlocked" : "locked"
              }`}
            >
              <div className="achievement-icon">
                {item.unlocked ? item.icon : "🔒"}
              </div>

              <div className="achievement-info">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="achievement-status">
                  {item.unlocked ? "Получено" : "Пока не получено"}
                </span>
              </div>

              {item.unlocked && (
                <span className="achievement-check">✓</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <nav className="bottom-nav">
        <button
          className="nav-item"
          onClick={() => onNavigate("home")}
        >
          <svg viewBox="0 0 24 24">
            <path d="M3 10.5L12 3l9 7.5V21h-6v-6H9v6H3z" />
          </svg>
          <span>Главная</span>
        </button>

        <button
          className="nav-item"
          onClick={() => onNavigate("savings")}
        >
          <svg viewBox="0 0 24 24">
            <rect x="3" y="6" width="18" height="14" rx="3" />
            <path d="M3 9h18M16 13h5" />
            <circle cx="16" cy="13" r="1" />
          </svg>
          <span>Копилка</span>
        </button>

        <button
          className="nav-item"
          onClick={() => onNavigate("path")}
        >
<svg viewBox="0 0 24 24" fill="none">
  <path
    d="M12 7.5C10.2 5.8 7.2 5 3.5 5.5V18
       C7 17.5 10 18.3 12 20
       C14 18.3 17 17.5 20.5 18V5.5
       C16.8 5 13.8 5.8 12 7.5Z"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
  <path
    d="M12 7.5V20"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
  />
  <path
    d="M6.5 9.5C8 9.5 9.3 9.8 10.2 10.4M6.5 12.5C8 12.5 9.3 12.8 10.2 13.4M17.5 9.5C16 9.5 14.7 9.8 13.8 10.4M17.5 12.5C16 12.5 14.7 12.8 13.8 13.4"
    stroke="currentColor"
    strokeWidth="1.3"
    strokeLinecap="round"
  />
</svg>
          <span>Курсы</span>
        </button>

        <button
          className="nav-item active"
          onClick={() => onNavigate("profile")}
        >
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" />
          </svg>
          <span>Профиль</span>
        </button>
      </nav>
    </div>
  );
}