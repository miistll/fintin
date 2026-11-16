import React, { useState } from "react";
import "./Quiz.css";

export default function Quiz({ quiz, onBack, onComplete }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [pairs, setPairs] = useState({});
  const [bucketChoices, setBucketChoices] = useState({});
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!quiz || quiz.length === 0) {
    return (
      <div className="quiz-page">
        <p>Тест пока не добавлен.</p>
        <button className="quiz-back" onClick={onBack}>← Назад</button>
      </div>
    );
  }

  const q = quiz[current];

  function resetState() {
    setSelected(null);
    setPairs({});
    setBucketChoices({});
    setAnswered(false);
  }

  function isAnswerCorrect() {
    if (q.type === "multiple") {
      return (
        Array.isArray(selected) &&
        selected.length === q.correct.length &&
        selected.every((i) => q.correct.includes(i))
      );
    }
    if (q.type === "match") {
      return q.correct.every((rightIndex, leftIndex) => pairs[leftIndex] === rightIndex);
    }
    if (q.type === "buckets") {
      return q.items.every((item, i) => bucketChoices[i] === item.correct);
    }
    return selected === q.correct;
  }

  function handleCheck() {
    setAnswered(true);
    if (isAnswerCorrect()) setCorrectCount((c) => c + 1);
  }

  function handleNext() {
    if (current + 1 < quiz.length) {
      setCurrent((c) => c + 1);
      resetState();
    } else {
      setFinished(true);
      if (onComplete) onComplete();
    }
  }

  if (finished) {
    const percent = Math.round((correctCount / quiz.length) * 100);
    return (
      <div className="quiz-page">
        <div className="quiz-result">
          <div className="quiz-result-emoji">{percent >= 70 ? "🎉" : "💪"}</div>
          <h2>{percent >= 70 ? "Молодец!" : "Попробуй ещё!"}</h2>
          <p>Правильных ответов: <strong>{correctCount} из {quiz.length}</strong></p>
          <p className="quiz-percent">{percent}%</p>
          <button className="quiz-back" onClick={onBack}>← К статьям</button>
        </div>
      </div>
    );
  }

  const progress = (current / quiz.length) * 100;

  return (
    <div className="quiz-page">
      <div className="quiz-progress-bar">
        <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="quiz-header">
        <button className="quiz-back" onClick={onBack}>← Назад</button>
        <span className="quiz-progress">{current + 1} / {quiz.length}</span>
      </div>

      <h2 className="quiz-question">{q.question}</h2>

      {q.type === "multiple" && <p className="quiz-hint">Выбери несколько вариантов</p>}

      {/* SINGLE / MULTIPLE */}
      {(q.type === "single" || q.type === "multiple") && (
        <div className={`quiz-options ${q.type === "multiple" ? "multiple" : ""}`}>
          {q.options.map((option, index) => {
            const isMultiple = q.type === "multiple";
            const isSelected = isMultiple
              ? Array.isArray(selected) && selected.includes(index)
              : selected === index;

            let className = "quiz-option";
            if (answered) {
              if (isMultiple) {
                if (q.correct.includes(index)) className += " correct";
                else if (isSelected) className += " wrong";
              } else {
                if (index === q.correct) className += " correct";
                else if (isSelected) className += " wrong";
              }
            } else if (isSelected) {
              className += " selected";
            }

            return (
              <button
                key={index}
                className={className}
                onClick={() => {
                  if (answered) return;
                  if (isMultiple) {
                    setSelected((prev) =>
                      Array.isArray(prev)
                        ? prev.includes(index)
                          ? prev.filter((i) => i !== index)
                          : [...prev, index]
                        : [index]
                    );
                  } else {
                    setSelected(index);
                  }
                }}
                disabled={answered}
              >
                <span className="quiz-option-marker">
                  {isMultiple ? (isSelected ? "☑" : "☐") : isSelected ? "●" : "○"}
                </span>
                <span className="quiz-option-text">{option}</span>
              </button>
            );
          })}
        </div>
      )}

{q.type === "match" && (
  <div className="quiz-match">
    <div className="match-column">
      {q.left.map((item, i) => {
        const pairedRight = pairs[i];
        const colorClass = pairedRight !== undefined ? `pair-color-${i % 5}` : "";
        return (
          <button
            key={i}
            className={`match-item ${selected === i ? "active" : ""} ${pairedRight !== undefined ? "paired" : ""} ${colorClass}`}
            onClick={() => {
              if (answered) return;
              if (pairs[i] !== undefined) {
                setPairs((p) => {
                  const copy = { ...p };
                  delete copy[i];
                  return copy;
                });
                return;
              }
              setSelected(i);
            }}
            disabled={answered}
          >
            {item}
          </button>
        );
      })}
    </div>
    <div className="match-column">
      {q.right.map((item, j) => {
        const pairedLeft = Object.keys(pairs).find((k) => pairs[k] === j);
        const colorClass = pairedLeft !== undefined ? `pair-color-${Number(pairedLeft) % 5}` : "";
        const isCorrectPair = answered && pairedLeft !== undefined && q.correct[Number(pairedLeft)] === j;
        const isWrongPair = answered && pairedLeft !== undefined && q.correct[Number(pairedLeft)] !== j;
        return (
          <button
            key={j}
            className={`match-item ${pairedLeft !== undefined ? "paired" : ""} ${colorClass} ${isCorrectPair ? "correct" : ""} ${isWrongPair ? "wrong" : ""}`}
            onClick={() => {
              if (answered) return;
              if (pairedLeft !== undefined) return;
              if (selected === null) return;
              setPairs((p) => ({ ...p, [selected]: j }));
              setSelected(null);
            }}
            disabled={answered}
          >
            {item}
          </button>
        );
      })}
    </div>
  </div>
)}

      {/* BUCKETS */}
      {q.type === "buckets" && (
        <div className="quiz-buckets">
          {q.items.map((item, i) => {
            const choice = bucketChoices[i];
            let className = "bucket-item";
            if (answered) {
              if (choice === item.correct) className += " correct";
              else if (choice !== undefined) className += " wrong";
            }
            return (
              <div key={i} className={className}>
                <p className="bucket-text">{item.text}</p>
                <div className="bucket-buttons">
                  {item.buckets.map((bucket, bi) => (
                    <button
                      key={bi}
                      className={`bucket-btn ${choice === bi ? "selected" : ""}`}
                      onClick={() => {
                        if (answered) return;
                        setBucketChoices((p) => ({ ...p, [i]: bi }));
                      }}
                      disabled={answered}
                    >
                      {bucket}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {answered && (
        <div className={`quiz-feedback ${isAnswerCorrect() ? "ok" : "bad"}`}>
          {isAnswerCorrect() ? "✅ Правильно! Молодец!" : "❌ Неправильно. Смотри подсветку выше."}
        </div>
      )}

      {!answered ? (
        <button className="quiz-action" onClick={handleCheck}>
          Проверить
        </button>
      ) : (
        <button className="quiz-action" onClick={handleNext}>
          {current + 1 < quiz.length ? "Дальше →" : "Завершить"}
        </button>
      )}
    </div>
  );
}