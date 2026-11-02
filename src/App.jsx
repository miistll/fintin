import React, { useState } from "react";
import piggyBank from "./assets/piggy-bank.png";
import "./App.css"
import Savings from "./Savings"
import Profile from "./Profile"

export default function App() {

  const today = new Date();
  const [activePage, setActivePage] = useState("home");

  const [selectedDate, setSelectedDate] = useState(
    today.toDateString()
  );

  const [savedAmount, setSavedAmount] = useState(0);
  const [goal, setGoal] = useState(5000);
  const [goalName, setGoalName] = useState("Моя мечта");

  const targetAmount = goal;
  const remaining = Math.max(0, targetAmount - savedAmount);
  const progress =targetAmount > 0
  ? Math.min(100, (savedAmount / targetAmount) * 100)
  : 0;


  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);

    return {
      date,
      name: date
        .toLocaleDateString("ru-RU", { weekday: "short" })
        .replace(".", ""),
      number: date.getDate(),
    };
  });

  return (
    <div className="app">
{activePage === "savings" ? (
  <Savings
    onNavigate={setActivePage}
    saved={savedAmount}
    setSaved={setSavedAmount}
    goal={goal}
    setGoal={setGoal}
    goalName={goalName}
    setGoalName={setGoalName}
  />
) : activePage === "profile" ? (
  <Profile onNavigate={setActivePage} />
) : (
  <>

      {/* ШАПКА */}

      <header className="header">
        <h1 className="logo">
          Фин<span>Тин</span>
        </h1>

        <div className="greeting">
          <h2>Привет!</h2>
          <p>Управляй деньгами с умом</p>
        </div>
      </header>

      {/* КАЛЕНДАРЬ */}

      <section className="calendar">
        <div className="calendar-days">
          {days.map((day) => (
            <button
              key={day.date.toDateString()}
              className={`calendar-day ${
                selectedDate === day.date.toDateString()
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setSelectedDate(day.date.toDateString())
              }
            >
              <span>{day.name}</span>
              <strong>{day.number}</strong>
            </button>
          ))}
        </div>
      </section>

      {/* ТВОИ ФИНАНСЫ */}

      <section className="finance-card">
        <h2 className="finance-title">Твои финансы</h2>

        <div className="finance-content">

          <div className="finance-info expense-info">
            <span>Расходы</span>
            <strong>0 ₽</strong>
          </div>

          <div className="finance-chart">
            <div className="chart-center">
              <span>Баланс</span>
              <strong>0 ₽</strong>
            </div>
          </div>

          <div className="finance-info income-info">
            <span>Доходы</span>
            <strong>0 ₽</strong>
          </div>

        </div>
      </section>

      {/* ДОХОДЫ И РАСХОДЫ */}

      <section className="operations">

        <div className="operation-card income-card">
          <div>
            <span>Доходы</span>
            <h3>0 ₽</h3>
          </div>

          <button
            className="add-button income-plus"
            onClick={() => {
              const amount = prompt("Введите сумму дохода:");
              if (amount && !isNaN(amount) && Number(amount) > 0) {
                alert("Доход добавлен: " + amount + " ₽");
              }
            }}
          >
            +
          </button>
        </div>

        <div className="operation-card expense-card">
          <div>
            <span>Расходы</span>
            <h3>0 ₽</h3>
          </div>

          <button
            className="add-button expense-plus"
            onClick={() => {
              const amount = prompt("Введите сумму расхода:");
              if (amount && !isNaN(amount) && Number(amount) > 0) {
                alert("Расход добавлен: " + amount + " ₽");
              }
            }}
          >
            +
          </button>
        </div>

      </section>

      {/* КОПИЛКА */}

      <section className="piggy-card">

        <h2 className="piggy-title">Моя копилка</h2>

        <div className="piggy-content">

          <img
            src={piggyBank}
            alt="Копилка"
            className="piggy-image"
          />

          <div className="piggy-info">

            <div className="piggy-goal">
              <span>Цель</span>
              <strong>Моя цель</strong>
            </div>

            <div className="piggy-saved">
              <span>Сколько накоплено</span>
              <strong>
                {savedAmount} ₽ из {targetAmount} ₽
              </strong>
            </div>

            <div className="piggy-progress">
              <div
                className="piggy-progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="piggy-remaining">
              <span>Осталось накопить</span>
              <strong>{remaining} ₽</strong>
            </div>

          </div>

        </div>

        <button
          className="piggy-button"
          onClick={() => {
            const amount = prompt("На сколько пополнить копилку?");

            if (amount && !isNaN(amount) && Number(amount) > 0) {
              setSavedAmount((prev) => prev + Number(amount));
            }
          }}
        >
          Пополнить копилку
        </button>

      </section>
{/* НИЖНЯЯ НАВИГАЦИЯ */}

<nav className="bottom-nav">

  <button className="nav-item active">
    <svg viewBox="0 0 24 24">
      <path d="M3 10.5L12 3l9 7.5V21h-6v-6H9v6H3z" />
    </svg>
    <span>Главная</span>
  </button>

  <button
className={`nav-item ${activePage === "savings" ? "active" : ""}`}
onClick={() => setActivePage("savings")}

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

  <button className="nav-item">
  
    <svg viewBox="0 0 24 24">
      <path d="M12 3l3 3-3 3-3-3z" />
      <path d="M12 9v3" />
      <path d="M12 12l-4 4 4 4 4-4-4-4z" />
      <path d="M5 21h14" />
    </svg>
    <span>Путь Фина</span>
  </button>

  <button
  className={`nav-item ${activePage === "profile" ? "active" : ""}`}
  onClick={() => setActivePage("profile")}
 >
    
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" />
    </svg>
    <span>Профиль</span>
    
  </button>

</nav>
   </>
)}
    </div>
  );
}