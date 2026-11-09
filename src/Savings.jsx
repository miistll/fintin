import React from "react";
import "./Savings.css";
import piggyBank from "./assets/piggy-bank.png";

export default function Savings({
  onNavigate,
  saved,
  setSaved,
  goal,
  setGoal,
  goalName,
  setGoalName,
  history,
  setHistory
}) {
  const progress = goal > 0
    ? Math.min(100, (saved / goal) * 100)
    : 0;

  function addMoney() {
    const input = prompt("Сколько рублей добавить?");

    if (input === null || input.trim() === "") return;

    const amount = Number(input.replace(",", "."));

    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Введите корректную сумму больше нуля.");
      return;
    }

    const now = new Date();

    setSaved(prev => prev + amount);

    setHistory(prev => [
      {
        id: Date.now(),
        amount,
        date: now.toLocaleDateString("ru-RU"),
        time: now.toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit"
        })
      },
      ...prev
    ]);
  }

  function editGoal() {
    const name = prompt("Название цели:", goalName);

    if (name !== null && name.trim() !== "") {
      setGoalName(name.trim());
    }

    const input = prompt("Сумма цели:", goal);

    if (input === null || input.trim() === "") return;

    const amount = Number(input.replace(",", "."));

    if (Number.isFinite(amount) && amount >= 0) {
      setGoal(amount);
    } else {
      alert("Введите корректную сумму.");
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="logo">
          Фин<span>Тин</span>
        </h1>

        <div className="greeting">
          <h2>Моя копилка</h2>
          <p>Каждый шаг приближает к мечте</p>
        </div>
      </header>

      <section className="savings-card">
        <img src={piggyBank} alt="Копилка" />

        <p className="savings-label">Моя цель</p>
        <h2>{goalName}</h2>

        <div className="savings-amount">
          {saved.toLocaleString("ru-RU")} ₽
        </div>

        <p className="savings-muted">
          из {goal.toLocaleString("ru-RU")} ₽
        </p>

        <div className="savings-progress">
          <div style={{ width: `${progress}%` }} />
        </div>

        <p className="savings-percent">
          {Math.round(progress)}% накоплено
        </p>

        <button className="savings-add" onClick={addMoney}>
          ＋ Пополнить копилку
        </button>

        <button className="savings-edit" onClick={editGoal}>
          Изменить цель
        </button>
      </section>

      <section className="savings-info">
        <p>Осталось накопить</p>
        <h2>
          {Math.max(goal - saved, 0).toLocaleString("ru-RU")} ₽
        </h2>
      </section>

      <section className="savings-history">
        <h2>История операций</h2>

        {history.length === 0 ? (
          <p className="history-empty">
            Здесь пока нет операций. Пополни копилку!
          </p>
        ) : (
          history.map(item => (
            <div className="history-item" key={item.id}>
              <div>
                <strong>Пополнение копилки</strong>
                <p>{item.date} · {item.time}</p>
              </div>
              <strong className="history-amount">
                +{item.amount.toLocaleString("ru-RU")} ₽
              </strong>
            </div>
          ))
        )}
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

  <button className="nav-item active">
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

  <button
    className="nav-item"
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