'use client';

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Brain, Trophy, ArrowRight, RotateCcw, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { sampleFacts } from '@/lib/data';
import { cn } from '@/lib/utils';
import type { Fact } from '@/types';

const Scene3D = dynamic(
  () => import('@/components/3d/Scene3D').then((mod) => mod.Scene3D),
  { ssr: false }
);

interface QuizQuestion {
  fact: Fact;
  statement: string;
  isTrue: boolean;
}

function generateQuizQuestions(facts: Fact[]): QuizQuestion[] {
  return facts.slice(0, 5).map((fact) => {
    const isTrue = Math.random() > 0.3;
    let statement = fact.shortExplanation;
    
    if (!isTrue) {
      statement = statement.replace(/[0-9]+/g, (match) => {
        const num = parseInt(match);
        const offset = Math.floor(Math.random() * 5) + 1;
        return Math.random() > 0.5 ? (num + offset).toString() : Math.max(0, num - offset).toString();
      });
    }
    
    return { fact, statement, isTrue };
  });
}

function QuizContent() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    const shuffled = [...sampleFacts].sort(() => Math.random() - 0.5);
    setQuestions(generateQuizQuestions(shuffled));
  }, []);

  const startQuiz = () => {
    const shuffled = [...sampleFacts].sort(() => Math.random() - 0.5);
    setQuestions(generateQuizQuestions(shuffled));
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setIsComplete(false);
    setQuizStarted(true);
  };

  const handleAnswer = (answer: boolean) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === questions[currentQuestion].isTrue) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsComplete(true);
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <main className="min-h-screen bg-slate-950 relative">
      <div className="fixed inset-0 -z-10 opacity-50">
        <Scene3D />
      </div>

      <Header />

      <div className="relative pt-32 pb-20 min-h-screen">
        <div className="max-w-3xl mx-auto px-6">
          {!quizStarted ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center mx-auto mb-8">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Fact or <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">Fiction</span>
              </h1>
              <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto">
                Test your knowledge! We&apos;ll show you a statement - you decide if it&apos;s true or false.
                Can you tell fact from fiction?
              </p>
              <Button size="lg" onClick={startQuiz} className="group">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Quiz
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          ) : !isComplete ? (
            <div>
              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
                  <span>Question {currentQuestion + 1} of {questions.length}</span>
                  <span>Score: {score}/{currentQuestion}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-violet-500"
                  />
                </div>
              </div>

              {/* Question Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 md:p-12"
                >
                  <span className="inline-block px-4 py-1.5 text-sm font-medium bg-cyan-500/10 text-cyan-400 rounded-full mb-6">
                    {currentQ.fact.category.replace('-', ' ')}
                  </span>
                  
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-relaxed">
                    {currentQ.statement}
                  </h2>

                  {/* Answer Buttons */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                      onClick={() => handleAnswer(true)}
                      disabled={selectedAnswer !== null}
                      className={cn(
                        'relative p-6 rounded-2xl border-2 transition-all duration-300',
                        selectedAnswer === true
                          ? currentQ.isTrue
                            ? 'border-green-500 bg-green-500/20'
                            : 'border-red-500 bg-red-500/20'
                          : selectedAnswer !== null && currentQ.isTrue && selectedAnswer !== currentQ.isTrue
                          ? 'border-green-500/50'
                          : 'border-slate-700 hover:border-green-500/50 hover:bg-green-500/5',
                        selectedAnswer === null && 'cursor-pointer',
                        selectedAnswer !== null && 'cursor-not-allowed opacity-70'
                      )}
                    >
                      <span className="text-2xl mb-2 block">✅</span>
                      <span className="text-lg font-bold text-white">TRUE</span>
                      {selectedAnswer === true && (
                        <span className="absolute top-4 right-4">
                          {currentQ.isTrue ? (
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-500" />
                          )}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => handleAnswer(false)}
                      disabled={selectedAnswer !== null}
                      className={cn(
                        'relative p-6 rounded-2xl border-2 transition-all duration-300',
                        selectedAnswer === false
                          ? !currentQ.isTrue
                            ? 'border-green-500 bg-green-500/20'
                            : 'border-red-500 bg-red-500/20'
                          : selectedAnswer !== null && !currentQ.isTrue && selectedAnswer !== false
                          ? 'border-green-500/50'
                          : 'border-slate-700 hover:border-red-500/50 hover:bg-red-500/5',
                        selectedAnswer === null && 'cursor-pointer',
                        selectedAnswer !== null && 'cursor-not-allowed opacity-70'
                      )}
                    >
                      <span className="text-2xl mb-2 block">❌</span>
                      <span className="text-lg font-bold text-white">FALSE</span>
                      {selectedAnswer === false && (
                        <span className="absolute top-4 right-4">
                          {!currentQ.isTrue ? (
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-500" />
                          )}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Result */}
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        'p-6 rounded-2xl mb-6',
                        selectedAnswer === currentQ.isTrue
                          ? 'bg-green-500/10 border border-green-500/30'
                          : 'bg-red-500/10 border border-red-500/30'
                      )}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        {selectedAnswer === currentQ.isTrue ? (
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-500" />
                        )}
                        <span className={cn('font-bold text-lg', selectedAnswer === currentQ.isTrue ? 'text-green-400' : 'text-red-400')}>
                          {selectedAnswer === currentQ.isTrue ? 'Correct!' : 'Incorrect!'}
                        </span>
                      </div>
                      <p className="text-slate-300">
                        {currentQ.isTrue ? 'This statement is indeed a fact!' : 'This statement was modified for the quiz.'}
                      </p>
                      <Link
                        href={`/facts/${currentQ.fact.slug}`}
                        className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 mt-3 text-sm"
                      >
                        Learn more about this fact <ArrowRight className="w-4 h-4" />
                      </Link>
                    </motion.div>
                  )}

                  {/* Next Button */}
                  {showResult && (
                    <Button onClick={handleNext} className="w-full group">
                      {currentQuestion < questions.length - 1 ? (
                        <>
                          Next Question
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      ) : (
                        <>
                          See Results
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            /* Results */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 md:p-12">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-10 h-10 text-white" />
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Quiz Complete!
                </h2>

                <div className="mb-8">
                  <span className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
                    {score}
                  </span>
                  <span className="text-3xl text-slate-500">/{questions.length}</span>
                </div>

                <p className="text-lg text-slate-400 mb-2">
                  {score === questions.length
                    ? 'Perfect score! You\'re a fact master!'
                    : score >= questions.length * 0.6
                    ? 'Great job! You know your facts!'
                    : 'Keep learning! Try again to improve your score.'}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                  <Button onClick={startQuiz} variant="outline" className="group">
                    <RotateCcw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform" />
                    Play Again
                  </Button>
                  <Link href="/facts">
                    <Button>
                      Explore More Facts
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <QuizContent />
    </Suspense>
  );
}
