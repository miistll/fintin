import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { supabase } from "./supabaseClient";
import "./Courses.css";

export default function Courses({ onNavigate }) {
  const [tab, setTab] = useState("courses");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    async function loadArticles() {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("lesson_number", { ascending: true });

      if (error) {
        console.error("Ошибка загрузки статей:", error);
      } else {
        setArticles(data || []);
      }

      setLoading(false);
    }

    loadArticles();
  }, []);

  // Если статья открыта — показываем её текст
  if (selectedArticle) {
    return (
      <div className="courses-page">
        <header className="header">
          <h1 className="logo">Фин<span>Тин</span></h1>
        </header>

        <button className="back-button" onClick={() => setSelectedArticle(null)}>
          ← Назад к курсам
        </button>

        <h2 className="article-title">{selectedArticle.title}</h2>

        <div className="article-content">
          <ReactMarkdown>{selectedArticle.content}</ReactMarkdown>
        </div>

        <nav className="bottom-nav">
          <button className="nav-item" onClick={() => onNavigate("home")}> <svg viewBox="0 0 24 24"><path d="M3 10.5L12 3l9 7.5V21h-6v-6H9v6H3z" /></svg><span>Главная</span></button>
          <button className="nav-item" onClick={() => onNavigate("savings")}> <svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="14" rx="3" /><path d="M3 9h18" /><path d="M16 13h5" /><circle cx="16" cy="13" r="1" /><path d="M7 6V4h11v2" /></svg><span>Копилка</span></button>
          <button className="nav-item active"><svg viewBox="0 0 24 24" fill="none">
                <path d="M12 7.5C10.2 5.8 7.2 5 3.5 5.5V18 C7 17.5 10 18.3 12 20 C14 18.3 17 17.5 20.5 18V5.5 C16.8 5 13.8 5.8 12 7.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 7.5V20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                <path d="M6.5 9.5C8 9.5 9.3 9.8 10.2 10.4M6.5 12.5C8 12.5 9.3 12.8 10.2 13.4M17.5 9.5C16 9.5 14.7 9.8 13.8 10.4M17.5 12.5C16 12.5 14.7 12.8 13.8 13.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg><span>Курсы</span></button>
          <button className="nav-item" onClick={() => onNavigate("profile")}><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" /></svg><span>Профиль</span></button>
        </nav>
      </div>
    );
  }

  return (
    <div className="courses-page">
      <header className="header">
        <h1 className="logo">Фин<span>Тин</span></h1>
      </header>

      <h2 className="courses-heading">Курсы</h2>

      <div className="courses-tabs">
        <button className={tab === "courses" ? "course-tab active" : "course-tab"} onClick={() => setTab("courses")}>
          <span>📖</span> Курсы
        </button>
        <button className={tab === "ai" ? "course-tab active" : "course-tab"} onClick={() => setTab("ai")}>
          <span>🤖</span> ИИ-агент
        </button>
        <button className={tab === "path" ? "course-tab active" : "course-tab"} onClick={() => setTab("path")}>
          <span>⚑</span> Путь Фина
        </button>
      </div>

      {tab === "courses" && (
        <section className="articles-list">
          <h3>Статьи</h3>

          {loading ? (
            <p>Загрузка статей...</p>
          ) : articles.length === 0 ? (
            <p>Пока статей нет</p>
          ) : (
            articles.map((article) => (
              <button
                className="article-card"
                key={article.id}
                onClick={() => setSelectedArticle(article)}
              >
                <div>
                  <h4>{article.title}</h4>
                  {article.description && <p>{article.description}</p>}
                </div>
                <span className="article-arrow">→</span>
              </button>
            ))
          )}
        </section>
      )}

      {tab === "ai" && (
        <h3 className="coming-soon">ИИ-агент скоро появится</h3>
      )}

      {tab === "path" && (
        <h3 className="coming-soon">Путь Фина скоро появится</h3>
      )}

      <nav className="bottom-nav">
        <button className="nav-item" onClick={() => onNavigate("home")}>
        <svg viewBox="0 0 24 24"><path d="M3 10.5L12 3l9 7.5V21h-6v-6H9v6H3z" /></svg>
        <span>Главная</span></button>
        <button className="nav-item" onClick={() => onNavigate("savings")}>
        <svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="14" rx="3" /><path d="M3 9h18" /><path d="M16 13h5" /><circle cx="16" cy="13" r="1" /><path d="M7 6V4h11v2" /></svg>
        <span>Копилка</span></button>
        <button className="nav-item active">
        <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 7.5C10.2 5.8 7.2 5 3.5 5.5V18 C7 17.5 10 18.3 12 20 C14 18.3 17 17.5 20.5 18V5.5 C16.8 5 13.8 5.8 12 7.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 7.5V20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                <path d="M6.5 9.5C8 9.5 9.3 9.8 10.2 10.4M6.5 12.5C8 12.5 9.3 12.8 10.2 13.4M17.5 9.5C16 9.5 14.7 9.8 13.8 10.4M17.5 12.5C16 12.5 14.7 12.8 13.8 13.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg> 
        <span>Курсы</span></button>
        <button className="nav-item" onClick={() => onNavigate("profile")}>
        <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" /></svg> 
        <span>Профиль</span></button>
      </nav>
    </div>
  );
}