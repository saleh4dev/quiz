import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { FaClock, FaCheck, FaTimes, FaTrophy, FaArrowRight } from 'react-icons/fa';
import './Quiz.css';

const Quiz = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState(null);
  const [results, setResults] = useState(null);

  useEffect(() => {
    fetchQuizData();
  }, [categoryId]);

  useEffect(() => {
    if (quizStarted && !quizCompleted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !quizCompleted) {
      handleTimeUp();
    }
  }, [timeLeft, quizStarted, quizCompleted]);

  const fetchQuizData = async () => {
    try {
      // Fetch category info
      const categoryResponse = await axios.get(`/api/categories/${categoryId}`);
      setCategory(categoryResponse.data.category);

      // Fetch questions
      const questionsResponse = await axios.get(`/api/quiz/questions/${categoryId}?limit=10`);
      setQuestions(questionsResponse.data.questions);
    } catch (error) {
      setError('حدث خطأ في تحميل المسابقة');
      console.error('Error fetching quiz data:', error);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeLeft(30);
  };

  const handleAnswerSelect = (answer) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const newAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer: selectedAnswer,
      timeTaken: 30 - timeLeft
    };

    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      // Quiz completed
      submitQuiz(newAnswers);
    }
  };

  const handleTimeUp = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const newAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer: null, // No answer selected
      timeTaken: 30
    };

    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      // Quiz completed
      submitQuiz(newAnswers);
    }
  };

  const submitQuiz = async (finalAnswers) => {
    try {
      const response = await axios.post('/api/quiz/submit', {
        categoryId: parseInt(categoryId),
        answers: finalAnswers,
        timeTaken: finalAnswers.reduce((total, answer) => total + answer.timeTaken, 0)
      });

      setResults(response.data.results);
      setQuizCompleted(true);
    } catch (error) {
      setError('حدث خطأ في إرسال النتائج');
      console.error('Error submitting quiz:', error);
    }
  };

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  };

  const getTimeColor = () => {
    if (timeLeft > 20) return '#28a745';
    if (timeLeft > 10) return '#ffc107';
    return '#dc3545';
  };

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>جاري تحميل المسابقة...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-container">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => navigate('/categories')} className="retry-button">
            العودة للأقسام
          </button>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="quiz-container">
        <div className="quiz-intro">
          <div className="intro-card">
            <h1>مسابقة {category?.name}</h1>
            <div className="quiz-info">
              <div className="info-item">
                <FaClock />
                <span>30 ثانية لكل سؤال</span>
              </div>
              <div className="info-item">
                <FaTrophy />
                <span>{questions.length} أسئلة</span>
              </div>
            </div>
            <p>تأكد من أنك جاهز للبدء!</p>
            <button onClick={startQuiz} className="start-button">
              ابدأ المسابقة
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted && results) {
    return (
      <div className="quiz-container">
        <div className="results-container">
          <div className="results-card">
            <h1>نتائج المسابقة</h1>
            
            <div className="results-summary">
              <div className="result-item">
                <span className="result-label">النقاط المكتسبة:</span>
                <span className="result-value">{results.totalScore}</span>
              </div>
              <div className="result-item">
                <span className="result-label">الإجابات الصحيحة:</span>
                <span className="result-value">{results.correctAnswers}/{results.totalQuestions}</span>
              </div>
              <div className="result-item">
                <span className="result-label">نسبة الدقة:</span>
                <span className="result-value">{results.accuracy}%</span>
              </div>
              <div className="result-item">
                <span className="result-label">الوقت المستغرق:</span>
                <span className="result-value">{Math.floor(results.timeTaken / 60)}:{(results.timeTaken % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>

            <div className="results-actions">
              <button onClick={() => navigate('/categories')} className="btn-secondary">
                العودة للأقسام
              </button>
              <button onClick={() => navigate('/leaderboard')} className="btn-primary">
                <FaTrophy />
                لوحة الصدارة
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
        <div className="quiz-info-bar">
          <div className="question-counter">
            السؤال {currentQuestionIndex + 1} من {questions.length}
          </div>
          <div className="timer" style={{ color: getTimeColor() }}>
            <FaClock />
            {timeLeft}
          </div>
        </div>
      </div>

      <div className="question-container">
        <div className="question-card">
          <h2 className="question-text" title={currentQuestion.question_text}>
            {currentQuestion.question_text}
          </h2>
          
          <div className="options-container">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`option-button ${selectedAnswer === option ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(option)}
                disabled={selectedAnswer !== null}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="option-text">{option}</span>
                {selectedAnswer === option && (
                  <FaCheck className="check-icon" />
                )}
              </button>
            ))}
          </div>

          {selectedAnswer && (
            <div className="next-button-container">
              <button onClick={handleNextQuestion} className="next-button">
                {currentQuestionIndex + 1 < questions.length ? (
                  <>
                    السؤال التالي
                    <FaArrowRight />
                  </>
                ) : (
                  <>
                    إنهاء المسابقة
                    <FaTrophy />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz; 