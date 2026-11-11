import React, { useEffect, useMemo, useState } from "react";
import Operations from "./Operations";
import piggyBank from "./assets/piggy-bank.png";
import "./App.css";
import Savings from "./Savings";
import Profile from "./Profile";
import Auth from "./Auth";
import { supabase } from "./supabaseClient";

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function belongsToDate(item, dateKey, dateLabel) {
  if (item.dateKey) return item.dateKey === dateKey;
  return item.date === dateLabel;
}

export default function App() {
  const today = new Date();

  const [activePage, setActivePage] = useState("home");
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(today.toDateString());

  // Данные копилки
  const [savedAmount, setSavedAmount] = useState(0);
  const [goal, setGoal] = useState(0);
  const [goalName, setGoalName] = useState("Моя мечта");
  const [savingsHistory, setSavingsHistory] = useState([]);

  // История доходов и расходов — главный источник данных для статистики
  const [incomeHistory, setIncomeHistory] = useState([]);
  const [expenseHistory, setExpenseHistory] = useState([]);

  const [loadedUserId, setLoadedUserId] = useState(null);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setSession(session);
        setAuthLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) {
        setSession(nextSession);
        setAuthLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Загружаем данные из облака после входа пользователя
  useEffect(() => {
    const userId = session?.user?.id;

    if (!userId) {
      setLoadedUserId(null);
      return;
    }

    let cancelled = false;
    setLoadedUserId(null);

    async function loadData() {
      const { data, error } = await supabase
        .from("user_data")
        .select("data")
        .eq("user_id", userId)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error("Ошибка загрузки данных из Supabase:", error);
        return;
      }

      const savedData = data?.data ?? {};

      setSavedAmount(Number(savedData.savedAmount) || 0);
      setGoal(Number(savedData.goal) || 0);
      setGoalName(savedData.goalName || "Моя мечта");
      setSavingsHistory(Array.isArray(savedData.savingsHistory) ? savedData.savingsHistory : []);
      setIncomeHistory(Array.isArray(savedData.incomeHistory) ? savedData.incomeHistory : []);
      setExpenseHistory(Array.isArray(savedData.expenseHistory) ? savedData.expenseHistory : []);

      setLoadedUserId(userId);
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  // Сохраняем изменения в Supabase. Сохранение начинается только после загрузки.
  useEffect(() => {
    const userId = session?.user?.id;

    if (!userId || loadedUserId !== userId) return;

    const dataToSave = {
      savedAmount,
      goal,
      goalName,
      savingsHistory,
      incomeHistory,
      expenseHistory,
    };

    const timeoutId = setTimeout(async () => {
      const { error } = await supabase
        .from("user_data")
        .upsert(
          {
            user_id: userId,
            data: dataToSave,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

      if (error) {
        console.error("Ошибка сохранения данных в Supabase:", error);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    session?.user?.id,
    loadedUserId,
    savedAmount,
    goal,
    goalName,
    savingsHistory,
    incomeHistory,
    expenseHistory,
  ]);

  const selectedDateObject = new Date(selectedDate);
  const selectedDateKey = getDateKey(selectedDateObject);
  const selectedDateLabel = selectedDateObject.toLocaleDateString("ru-RU");

  const dailyIncomeHistory = useMemo(
    () => incomeHistory.filter((item) => belongsToDate(item, selectedDateKey, selectedDateLabel)),
    [incomeHistory, selectedDateKey, selectedDateLabel]
  );

  const dailyExpenseHistory = useMemo(
    () => expenseHistory.filter((item) => belongsToDate(item, selectedDateKey, selectedDateLabel)),
    [expenseHistory, selectedDateKey, selectedDateLabel]
  );

  const income = dailyIncomeHistory.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const expenses = dailyExpenseHistory.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const balance = income - expenses;
  const totalOperations = income + expenses;
  const incomePercent = totalOperations > 0 ? (income / totalOperations) * 100 : 0;

  const remaining = Math.max(goal - savedAmount, 0);
  const progress = goal > 0 ? Math.min(100, (savedAmount / goal) * 100) : 0;

  function addOperation(type) {
    const title = type === "income" ? "дохода" : "расхода";
    const input = prompt(`Введите сумму ${title}:`);

    if (input === null || input.trim() === "") return;

    const amount = Number(input.replace(",", "."));
    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Введите корректную сумму больше нуля.");
      return;
    }

    const now = new Date();
    const operation = {
      id: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
      amount,
      date: now.toLocaleDateString("ru-RU"),
      dateKey: getDateKey(now),
      time: now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
    };

    if (type === "income") {
      setIncomeHistory((prev) => [operation, ...prev]);
    } else {
      setExpenseHistory((prev) => [operation, ...prev]);
    }

    // Новая операция сразу отображается за сегодняшний день
    setSelectedDate(now.toDateString());
  }

  function deleteOperation(type, id) {
    if (type === "income") {
      setIncomeHistory((prev) => prev.filter((item) => item.id !== id));
    } else {
      setExpenseHistory((prev) => prev.filter((item) => item.id !== id));
    }
  }

  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return {
      date,
      name: date.toLocaleDateString("ru-RU", { weekday: "short" }).replace(".", ""),
      number: date.getDate(),
    };
  });

  if (authLoading) return <div className="app">Загрузка...</div>;
  if (!session) return <Auth />;

  return (
    <div className="app">
      {activePage === "operations" ? (
        <Operations
          onNavigate={setActivePage}
          incomeHistory={incomeHistory}
          expenseHistory={expenseHistory}
          onDeleteOperation={deleteOperation}
        />
      ) : activePage === "savings" ? (
        <Savings
          onNavigate={setActivePage}
          saved={savedAmount}
          setSaved={setSavedAmount}
          goal={goal}
          setGoal={setGoal}
          goalName={goalName}
          setGoalName={setGoalName}
          history={savingsHistory}
          setHistory={setSavingsHistory}
        />
      ) : activePage === "profile" ? (
        <Profile
          onNavigate={setActivePage}
          saved={savedAmount}
          goal={goal}
          goalName={goalName}
          progress={progress}
          income={income}
          expenses={expenses}
          balance={balance}
          incomeHistory={incomeHistory}
          expenseHistory={expenseHistory}
          savingsHistory={savingsHistory}
        />
      ) : (
        <>
          <header className="header">
            <h1 className="logo">Фин<span>Тин</span></h1>
            <div className="greeting">
              <h2>Привет!</h2>
              <p>Управляй деньгами с умом</p>
            </div>
          </header>

          <section className="calendar">
            <div className="calendar-days">
              {days.map((day) => (
                <button
                  key={day.date.toDateString()}
                  className={`calendar-day ${selectedDate === day.date.toDateString() ? "active" : ""}`}
                  onClick={() => setSelectedDate(day.date.toDateString())}
                >
                  <span>{day.name}</span>
                  <strong>{day.number}</strong>
                </button>
              ))}
            </div>
          </section>

          <section className="finance-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <h2 className="finance-title">Твои финансы</h2>
              <button
                onClick={() => setActivePage("operations")}
                style={{ background: "none", border: "none", color: "#55e5b1", fontSize: "13px", cursor: "pointer", transform: "translateY(-6px)" }}
              >
                Все операции →
              </button>
            </div>

            <div className="finance-content">
              <div className="finance-info expense-info">
                <span>Расходы</span>
                <strong>{expenses.toLocaleString("ru-RU")} ₽</strong>
              </div>

              <div
                className="finance-chart"
                style={{
                  background: totalOperations === 0
                    ? "#34413e"
                    : `conic-gradient(#55e5a5 0% ${incomePercent}%, #ff626b ${incomePercent}% 100%)`,
                }}
              >
                <div className="chart-center">
                  <span>Баланс</span>
                  <strong>{balance.toLocaleString("ru-RU")} ₽</strong>
                </div>
              </div>

              <div className="finance-info income-info">
                <span>Доходы</span>
                <strong>{income.toLocaleString("ru-RU")} ₽</strong>
              </div>
            </div>
          </section>

          <section className="operations">
            <div className="operation-card income-card">
              <div>
                <span>Доходы</span>
                <h3>{income.toLocaleString("ru-RU")} ₽</h3>
              </div>
              <button className="add-button income-plus" onClick={() => addOperation("income")}>+</button>
            </div>

            <div className="operation-card expense-card">
              <div>
                <span>Расходы</span>
                <h3>{expenses.toLocaleString("ru-RU")} ₽</h3>
              </div>
              <button className="add-button expense-plus" onClick={() => addOperation("expense")}>+</button>
            </div>
          </section>

          <section className="piggy-card">
            <h2 className="piggy-title">Моя копилка</h2>
            <div className="piggy-content">
              <img src={piggyBank} alt="Копилка" className="piggy-image" />
              <div className="piggy-info">
                <div className="piggy-goal">
                  <span>Цель</span>
                  <strong>{goalName}</strong>
                </div>
                <div className="piggy-saved">
                  <span>Сколько накоплено</span>
                  <strong>{savedAmount.toLocaleString("ru-RU")} ₽ из {goal.toLocaleString("ru-RU")} ₽</strong>
                </div>
                <div className="piggy-progress">
                  <div className="piggy-progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <div className="piggy-remaining">
                  <span>Осталось накопить</span>
                  <strong>{remaining.toLocaleString("ru-RU")} ₽</strong>
                </div>
              </div>
            </div>

            <button
              className="piggy-button"
              onClick={() => {
                const input = prompt("На сколько пополнить копилку?");
                if (input === null || input.trim() === "") return;
                const amount = Number(input.replace(",", "."));
                if (!Number.isFinite(amount) || amount <= 0) {
                  alert("Введите корректную сумму больше нуля.");
                  return;
                }
                const now = new Date();
                const operation = {
                  id: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
                  amount,
                  date: now.toLocaleDateString("ru-RU"),
                  time: now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
                };
                setSavedAmount((prev) => prev + amount);
                setSavingsHistory((prev) => [operation, ...prev]);
              }}
            >
              Пополнить копилку
            </button>
          </section>

          <nav className="bottom-nav">
            <button className="nav-item active" onClick={() => setActivePage("home")}>
              <svg viewBox="0 0 24 24"><path d="M3 10.5L12 3l9 7.5V21h-6v-6H9v6H3z" /></svg>
              <span>Главная</span>
            </button>
            <button className="nav-item" onClick={() => setActivePage("savings")}>
              <svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="14" rx="3" /><path d="M3 9h18" /><path d="M16 13h5" /><circle cx="16" cy="13" r="1" /><path d="M7 6V4h11v2" /></svg>
              <span>Копилка</span>
            </button>
            <button className="nav-item">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 7.5C10.2 5.8 7.2 5 3.5 5.5V18 C7 17.5 10 18.3 12 20 C14 18.3 17 17.5 20.5 18V5.5 C16.8 5 13.8 5.8 12 7.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 7.5V20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                <path d="M6.5 9.5C8 9.5 9.3 9.8 10.2 10.4M6.5 12.5C8 12.5 9.3 12.8 10.2 13.4M17.5 9.5C16 9.5 14.7 9.8 13.8 10.4M17.5 12.5C16 12.5 14.7 12.8 13.8 13.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <span>Курсы</span>
            </button>
            <button className="nav-item" onClick={() => setActivePage("profile")}>
              <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" /></svg>
              <span>Профиль</span>
            </button>
          </nav>
        </>
      )}
    </div>
  );
}
