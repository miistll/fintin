import React from "react";

export default function Operations({
  onNavigate,
  incomeHistory = [],
  expenseHistory = [],
}) {
  const operations = [
    ...incomeHistory.map((item) => ({
      ...item,
      type: "income",
    })),
    ...expenseHistory.map((item) => ({
      ...item,
      type: "expense",
    })),
  ].sort((a, b) => b.id - a.id);

  return (
    <div className="app">
      <header style={{ padding: "20px 20px 10px" }}>
        <button
          onClick={() => onNavigate("home")}
          style={{
            background: "none",
            border: "none",
            color: "#55e5b1",
            fontSize: "16px",
            padding: 0,
            cursor: "pointer",
          }}
        >
          ← Назад
        </button>

        <h2 style={{ marginTop: "24px" }}>Все операции</h2>
        <p style={{ color: "#aab8b2", marginTop: "6px" }}>
          История твоих доходов и расходов
        </p>
      </header>

      <section style={{ padding: "10px 20px 100px" }}>
        {operations.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "50px 15px",
              color: "#aab8b2",
            }}
          >
            <h3 style={{ color: "#ffffff" }}>Пока нет операций</h3>
            <p>Добавь доход или расход, и он появится здесь</p>
          </div>
        ) : (
          operations.map((item) => {
            const isIncome = item.type === "income";

            return (
              <div
                key={`${item.type}-${item.id}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                  padding: "16px",
                  marginBottom: "12px",
                  background: "#1b2b26",
                  borderRadius: "16px",
                }}
              >
                <div>
                  <div
                    style={{
                      color: isIncome ? "#55e5b1" : "#ff7777",
                      fontWeight: "600",
                      marginBottom: "7px",
                    }}
                  >
                    {isIncome ? "Доход" : "Расход"}
                  </div>

                  <div style={{ color: "#aab8b2", fontSize: "13px" }}>
                    {item.date} · {item.time}
                  </div>
                </div>

                <strong
                  style={{
                    color: isIncome ? "#55e5b1" : "#ff7777",
                    whiteSpace: "nowrap",
                  }}
                >
                  {isIncome ? "+" : "−"}
                  {item.amount.toLocaleString("ru-RU")} ₽
                </strong>
              </div>
            );
          })
        )}
      </section>

      <nav className="bottom-nav">
        <button className="nav-item" onClick={() => onNavigate("home")}>
        <svg viewBox="0 0 24 24">
                  <path d="M3 10.5L12 3l9 7.5V21h-6v-6H9v6H3z" />
                </svg>
          <span>Главная</span>
        </button>

        <button className="nav-item" onClick={() => onNavigate("savings")}>
        
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

        <button className="nav-item" onClick={() => onNavigate("profile")}>
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