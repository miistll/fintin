import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { supabase } from './supabaseClient';
import './Courses.css';
import Quiz from './Quiz';
import finOwl from './assets/fin.png';

export default function Courses({ onNavigate, readArticles = [], onArticleRead, passedTests = [], onTestPassed }) {
  const [tab, setTab] = useState('courses');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    async function loadArticles() {
      const { data, error } = await supabase.from('articles').select('*').order('lesson_number', { ascending: true });
      if (error) console.error('Ошибка загрузки статей:', error);
      else setArticles(data || []);
      setLoading(false);
    }
    loadArticles();
  }, []);

  function openArticle(article) {
    setSelectedArticle(article);
    if (onArticleRead) onArticleRead(article.id);
  }

  if (activeQuiz) {
    return (
      <>
        <Quiz
          quiz={activeQuiz.quiz}
          onBack={() => {
            setActiveQuiz(null);
            setShowSuccess(false);
          }}
          onComplete={(allCorrect) => {
            if (allCorrect && onTestPassed) {
              onTestPassed(activeQuiz.id);
            }
          }}
        />

        {showSuccess && (
          <div className="intro-overlay">
            <div className="intro-modal">
              <img src={finOwl} alt="Фин" className="intro-owl" />
              <h2>Молодец!</h2>
              <p>Ты прошёл тест! Фин гордится тобой.</p>
              <button
                className="intro-btn"
                onClick={() => setShowSuccess(false)}
              >
                Продолжить
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  if (selectedArticle) {
    return (
      <div className="courses-page">
        <header className="header"><h1 className="logo">Фин<span>Тин</span></h1></header>
        <button className="back-button" onClick={() => setSelectedArticle(null)}>← Назад к курсам</button>
        <h2 className="article-title">{selectedArticle.title}</h2>
        <div className="article-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{selectedArticle.content}</ReactMarkdown>
        </div>
        {selectedArticle.quiz && (
          <button className="go-quiz-btn" onClick={() => setActiveQuiz(selectedArticle)}>Перейти к тесту →</button>
        )}
        <nav className="bottom-nav">
          <button className="nav-item" onClick={() => onNavigate('home')}><svg viewBox="0 0 24 24"><path d="M3 10.5L12 3l9 7.5V21h-6v-6H9v6H3z" /></svg><span>Главная</span></button>
          <button className="nav-item" onClick={() => onNavigate('savings')}><svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="14" rx="3" /><path d="M3 9h18" /><path d="M16 13h5" /><circle cx="16" cy="13" r="1" /><path d="M7 6V4h11v2" /></svg><span>Копилка</span></button>
          <button className="nav-item active"><svg viewBox="0 0 24 24" fill="none"><path d="M12 7.5C10.2 5.8 7.2 5 3.5 5.5V18 C7 17.5 10 18.3 12 20 C14 18.3 17 17.5 20.5 18V5.5 C16.8 5 13.8 5.8 12 7.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 7.5V20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><path d="M6.5 9.5C8 9.5 9.3 9.8 10.2 10.4M6.5 12.5C8 12.5 9.3 12.8 10.2 13.4M17.5 9.5C16 9.5 14.7 9.8 13.8 10.4M17.5 12.5C16 12.5 14.7 12.8 13.8 13.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg><span>Курсы</span></button>
          <button className="nav-item" onClick={() => onNavigate('profile')}><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" /></svg><span>Профиль</span></button>
        </nav>
      </div>
    );
  }

  return (
    <div className="courses-page">
      <header className="header"><h1 className="logo">Фин<span>Тин</span></h1></header>
      <h2 className="courses-heading">Курсы</h2>
      <div className="courses-tabs">
        <button className={tab === 'courses' ? 'course-tab active' : 'course-tab'} onClick={() => setTab('courses')}><span>📖</span> Статьи</button>
        <button className={tab === 'ai' ? 'course-tab active' : 'course-tab'} onClick={() => setTab('ai')}><span>🤖</span> ИИ-агент</button>
        <button className={tab === 'path' ? 'course-tab active' : 'course-tab'} onClick={() => setTab('path')}><span>⚑</span> Путь Фина</button>
      </div>

      {tab === 'courses' && (
  <section className="courses-main">
    {/* ===== Приветственный блок с Фином ===== */}
    <div className="fin-hero">
      <div className="fin-hero-text">
        <p className="fin-hero-greeting">Привет! Я Фин </p>
        <h3 className="fin-hero-title">
          {readArticles.length === 0
            ? "Давай начнём учиться!"
            : readArticles.length === articles.length && articles.length > 0
            ? "Ты прошёл все уроки! "
            : "Продолжаем учиться!"}
        </h3>
        <p className="fin-hero-sub">
          Прочитано уроков: <strong>{readArticles.length}</strong> из <strong>{articles.length}</strong>
        </p>
        <div className="fin-hero-progress">
          <div
            className="fin-hero-progress-fill"
            style={{ width: `${articles.length ? (readArticles.length / articles.length) * 100 : 0}%` }}
          />
        </div>
      </div>
      <img src={finOwl} alt="Фин" className="fin-hero-owl" />
    </div>

    {/* ===== Следующий урок ===== */}
    {(() => {
      const nextArticle = articles.find(
        (a) => !readArticles.map(String).includes(String(a.id))
      );
      if (!nextArticle) return null;
      return (
        <div className="next-lesson">
          <p className="next-lesson-label">📌 Продолжить обучение</p>
          <button className="next-lesson-card" onClick={() => openArticle(nextArticle)}>
            <div className="next-lesson-badge">Урок {articles.indexOf(nextArticle) + 1}</div>
            <h4>{nextArticle.title}</h4>
            {nextArticle.description && <p>{nextArticle.description}</p>}
            <span className="next-lesson-arrow">Начать →</span>
          </button>
        </div>
      );
    })()}

    {/* ===== Все уроки ===== */}
    <div className="all-lessons">
      <h3 className="all-lessons-heading">Все уроки</h3>
      {loading ? (
        <p>Загрузка статей...</p>
      ) : articles.length === 0 ? (
        <p>Пока статей нет</p>
      ) : (
        <div className="lesson-grid">
          {articles.map((article, index) => {
            const isRead = readArticles.map(String).includes(String(article.id));
            return (
              <button
                className={`lesson-card ${isRead ? "read" : ""}`}
                key={article.id}
                onClick={() => openArticle(article)}
              >
                <div className="lesson-card-top">
                  <span className="lesson-card-num">{index + 1}</span>
                  {isRead && <span className="lesson-card-star">★</span>}
                </div>
                <h4 className="lesson-card-title">{article.title}</h4>
                {article.description && <p className="lesson-card-desc">{article.description}</p>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  </section>
)}

      {tab === 'ai' && <h3 className="coming-soon">ИИ-агент скоро появится</h3>}

      {tab === 'path' && (
  <section className="path-forest">
    <div className="forest-decor forest-decor--left">🌲🌳🌲</div>
    <div className="forest-decor forest-decor--right">🌲🌳🌲</div>

    {loading ? (
      <p>Загрузка...</p>
    ) : articles.length === 0 ? (
      <p>Пока уроков нет</p>
    ) : (() => {
      const firstUnpassed = articles.findIndex(
        (a) => !passedTests.map(String).includes(String(a.id))
      );
      return (
        <div className="path-trail">
          {articles.map((article, index) => {
            const isRead = readArticles.map(String).includes(String(article.id));
            const isPassed = passedTests.map(String).includes(String(article.id));
            const disabled = !isRead || !article.quiz;
            const showFin = index === firstUnpassed;
            const side = index % 2 === 0 ? "left" : "right";

            return (
              <div
                className={`trail-step trail-step--${side}`}
                key={article.id}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <button
                  className={`trail-node ${
                    isPassed ? "passed" : isRead ? "done" : "locked"
                  }`}
                  onClick={() => {
                    if (disabled) return;
                    setActiveQuiz(article);
                  }}
                  disabled={disabled}
                  title={article.title}
                >
                  {isPassed ? "✓" : index + 1}
                </button>
                {showFin && <img src={finOwl} alt="Фин" className="trail-fin" />}
                <span className="trail-label">{article.title}</span>
              </div>
            );
          })}

          {/* Хвост тропинки — намёк, что дальше будут уроки */}
          <div className="trail-tail">
            <div className="trail-tail-fog" />
            <span className="trail-tail-text"> Скоро здесь появятся новые уроки…</span>
          </div>
        </div>
      );
    })()}
  </section>
)}

      <nav className="bottom-nav">
        <button className="nav-item" onClick={() => onNavigate('home')}><svg viewBox="0 0 24 24"><path d="M3 10.5L12 3l9 7.5V21h-6v-6H9v6H3z" /></svg><span>Главная</span></button>
        <button className="nav-item" onClick={() => onNavigate('savings')}><svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="14" rx="3" /><path d="M3 9h18" /><path d="M16 13h5" /><circle cx="16" cy="13" r="1" /><path d="M7 6V4h11v2" /></svg><span>Копилка</span></button>
        <button className="nav-item active"><svg viewBox="0 0 24 24" fill="none"><path d="M12 7.5C10.2 5.8 7.2 5 3.5 5.5V18 C7 17.5 10 18.3 12 20 C14 18.3 17 17.5 20.5 18V5.5 C16.8 5 13.8 5.8 12 7.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 7.5V20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><path d="M6.5 9.5C8 9.5 9.3 9.8 10.2 10.4M6.5 12.5C8 12.5 9.3 12.8 10.2 13.4M17.5 9.5C16 9.5 14.7 9.8 13.8 10.4M17.5 12.5C16 12.5 14.7 12.8 13.8 13.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg><span>Курсы</span></button>
        <button className="nav-item" onClick={() => onNavigate('profile')}><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" /></svg><span>Профиль</span></button>
      </nav>
    </div>
  );
}