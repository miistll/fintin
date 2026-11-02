import React, { useState } from "react";
import "./Profile.css";

export default function Profile({ onNavigate }) {
  const [name, setName] = useState("Мой профиль");
  const [editing, setEditing] = useState(false);

  return (
    <div className="app profile-page">
      <header className="header">
        <h1 className="logo">Фин<span>Тин</span></h1>
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
        <p>Начинающий финансист </p>
        <button
          className="profile-edit"
          onClick={() => setEditing(!editing)}
        >
          {editing ? "Сохранить" : "Изменить имя"}
        </button>
      </section>

      <h2 className="profile-section-title">Моя статистика</h2>
      <section className="profile-stats">
        <div className="profile-stat">
          <span>💰</span>
          <strong>3 500 ₽</strong>
          <p>Накоплено</p>
        </div>
        <div className="profile-stat">
          <span>🎯</span>
          <strong>70%</strong>
          <p>Цель копилки</p>
        </div>
        <div className="profile-stat">
          <span>📅</span>
          <strong>1 день</strong>
          <p>В ФинТин</p>
        </div>
      </section>

      <h2 className="profile-section-title">Мои достижения</h2>
      <section className="profile-achievements">
        <div className="achievement">
          <span>🐷</span>
          <div>
            <strong>Первая копилка</strong>
            <p>Ты начал копить деньги!</p>
          </div>
          <span>✓</span>
        </div>
        <div className="achievement">
          <span>🌱</span>
          <div>
            <strong>Первые шаги</strong>
            <p>Ты изучаешь финансы</p>
          </div>
          <span>✓</span>
        </div>
        <div className="achievement locked">
          <span>🏆</span>
          <div>
            <strong>Большая цель</strong>
            <p>Накопи 5 000 ₽</p>
          </div>
          <span>🔒</span>
        </div>
      </section>

      <h2 className="profile-section-title">Настройки</h2>
      <section className="profile-settings">
        <button onClick={() => alert("Скоро здесь появятся настройки!")}>
          <span>🔔</span> Уведомления <span>›</span>
        </button>
        <button onClick={() => alert("ФинТин — приложение для финансовой грамотности!")}>
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
  <span>Путь Фина</span>
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