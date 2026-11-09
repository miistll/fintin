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
          <span>Главная</span>
        </button>

        <button className="nav-item" onClick={() => onNavigate("savings")}>
          <span>Копилка</span>
        </button>

        <button className="nav-item">
          <span>Путь Фина</span>
        </button>

        <button className="nav-item" onClick={() => onNavigate("profile")}>
          <span>Профиль</span>
        </button>
      </nav>
    </div>
  );
}