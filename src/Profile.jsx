import React, { useState } from "react";
import "./Profile.css";

function getDaysInApp() {
  const storageKey = "fintin_first_open";
  let firstOpen = localStorage.getItem(storageKey);

  if (!firstOpen) {
    firstOpen = new Date().toISOString();
    localStorage.setItem(storageKey, firstOpen);
  }

  const startDate = new Date(firstOpen);
  const today = new Date();

  const startDay = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );

  const todayDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  return Math.max(
    1,
    Math.floor((todayDay - startDay) / 86400000) + 1
  );
}

export default function Profile({
  onNavigate,
  saved = 0,
  goal = 0,
  goalName = "Моя мечта",
  progress = 0,
  income = 0,
  expenses = 0,
  balance = 0,
  incomeHistory = [],
  expenseHistory = [],
  savingsHistory = []
}) {
  const [name, setName] = useState(
    localStorage.getItem("fintin_profile_name") || "Мой профиль"
  );
  const [editing, setEditing] = useState(false);

  const daysInApp = getDaysInApp();

  const operationsCount =
    incomeHistory.length + expenseHistory.length;

  const achievements = [
    {
      icon: "🐷",
      title: "Первое пополнение",
      description: "Ты впервые пополнил копилку",
      unlocked: saved > 0
    },
    {
      icon: "🌱",
      title: "Первые шаги",
      description: "Ты добавил свою первую операцию",
      unlocked: operationsCount > 0
    },
    {
      icon: "🏆",
      title: "Большая цель",
      description: `Накопи ${goal.toLocaleString("ru-RU")} ₽`,
      unlocked: goal > 0 && saved >= goal
    },
    {
      icon: "⭐",
      title: "Финансовый опыт",
      description: "Добавь 10 финансовых операций",
      unlocked: operationsCount >= 10
    }
  ];

  function saveName() {
    localStorage.setItem("fintin_profile_name", name);
    setEditing(false);
  }

  return (
    <div className="app profile-page">
      <header className="header">
        <h1 className="logo">
          Фин<span>Тин</span>
        </h1>

        <div className="greeting">
          <h2>Мой профиль</h2>
          <p>Твой личный финансовый кабинет</p>
        </div>
      </header>

      <section className="profile-user">
        <div className="profile-avatar"></div>

        {editing ? (
          <input
            className="profile-name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={25}
          />
        ) : (
          <h2>{name}</h2>
        )}

        <p>Начинающий финансист</p>

        <button
          className="profile-edit"
          onClick={editing ? saveName : () => setEditing(true)}
        >
          {editing ? "Сохранить" : "Изменить имя"}
        </button>
      </section>

      <h2 className="profile-section-title">Моя статистика</h2>

      <section className="profile-stats">
        <div className="profile-stat">
          <span>💰</span>
          <strong>{saved.toLocaleString("ru-RU")} ₽</strong>
          <p>Накоплено</p>
        </div>

        <div className="profile-stat">
          <span>🎯</span>
          <strong>{Math.round(progress)}%</strong>
          <p>
            {goalName}
          </p>
        </div>

        <div className="profile-stat">
          <span>📅</span>
          <strong>
            {daysInApp}{" "}
            {daysInApp === 1
              ? "день"
              : daysInApp >= 2 && daysInApp <= 4
              ? "дня"
              : "дней"}
          </strong>
          <p>В ФинТин</p>
        </div>
      </section>

      <h2 className="profile-section-title">Моя цель</h2>

      <section className="profile-stats">
        <div className="profile-stat">
          <span>🎯</span>
          <strong>{goal.toLocaleString("ru-RU")} ₽</strong>
          <p>Нужно накопить</p>
        </div>

        <div className="profile-stat">
          <span>💵</span>
          <strong>{saved.toLocaleString("ru-RU")} ₽</strong>
          <p>Уже накоплено</p>
        </div>

        <div className="profile-stat">
          <span>📊</span>
          <strong>
            {Math.max(goal - saved, 0).toLocaleString("ru-RU")} ₽
          </strong>
          <p>Осталось</p>
        </div>
      </section>

      <h2 className="profile-section-title">Мои достижения</h2>

      <section className="profile-achievements">
        {achievements.map((achievement, index) => (
          <div
            className={`achievement ${
              achievement.unlocked ? "" : "locked"
            }`}
            key={index}
          >
            <span>{achievement.icon}</span>

            <div>
              <strong>{achievement.title}</strong>
              <p>{achievement.description}</p>
            </div>

            <span>
              {achievement.unlocked ? "✓" : "🔒"}
            </span>
          </div>
        ))}
      </section>

      <h2 className="profile-section-title">Настройки</h2>

      <section className="profile-settings">
        <button
          onClick={() => alert("Скоро здесь появятся настройки!")}
        >
          <span>🔔</span> Уведомления <span>›</span>
        </button>

        <button
          onClick={() =>
            alert("ФинТин — приложение для финансовой грамотности!")
          }
        >
          <span>ℹ️</span> О приложении <span>›</span>
        </button>
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
            <path d="M3 9h18" />
            <path d="M16 13h5" />
            <circle cx="16" cy="13" r="1" />
            <path d="M7 6V4h11v2" />
          </svg>
          <span>Копилка</span>
        </button>

        <button
          className="nav-item"
          onClick={() => onNavigate("path")}
        >
          <svg viewBox="0 0 24 24">
            <path d="M12 3l3 3-3 3-3-3z" />
            <path d="M12 9v3" />
            <path d="M12 12l-4 4 4 4 4-4-4-4z" />
            <path d="M5 21h14" />
          </svg>
          <span>Курсы</span>
        </button>

        <button className="nav-item active">
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