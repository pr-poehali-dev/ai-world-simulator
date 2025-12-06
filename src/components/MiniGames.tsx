import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';

interface MiniGameProps {
  career: string;
  difficulty: number;
  onComplete: (success: boolean) => void;
  onCancel: () => void;
}

const MiniGames = ({ career, difficulty, onComplete, onCancel }: MiniGameProps) => {
  const [gameType, setGameType] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(10);
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const [memoryCards, setMemoryCards] = useState<number[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);

  const [mathQuestion, setMathQuestion] = useState({ a: 0, b: 0, op: '+', answer: 0 });
  const [mathInput, setMathInput] = useState('');

  const [reactionStart, setReactionStart] = useState(0);
  const [reactionWaiting, setReactionWaiting] = useState(false);
  const [reactionClicked, setReactionClicked] = useState(false);

  const [clickCount, setClickCount] = useState(0);

  const [sequencePattern, setSequencePattern] = useState<number[]>([]);
  const [sequenceInput, setSequenceInput] = useState<number[]>([]);
  const [showingSequence, setShowingSequence] = useState(false);

  const [codeLines, setCodeLines] = useState<string[]>([]);
  const [currentCodeLine, setCurrentCodeLine] = useState(0);
  const [codeInput, setCodeInput] = useState('');
  const [correctCodeLines, setCorrectCodeLines] = useState(0);

  useEffect(() => {
    const games = ['memory', 'math', 'reaction', 'clicking', 'sequence', 'typing'];
    const selectedGame = games[Math.floor(Math.random() * games.length)];
    setGameType(selectedGame);
    
    const baseTime = Math.max(5, 15 - Math.floor(difficulty / 1000));
    setTimeLeft(baseTime);
    
    const baseTarget = Math.max(3, Math.floor(difficulty / 1500));
    setTarget(baseTarget);
    
    initializeGame(selectedGame, baseTarget);
  }, [difficulty]);

  useEffect(() => {
    if (!gameStarted || timeLeft <= 0) {
      if (gameStarted && timeLeft <= 0) {
        checkGameCompletion();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, timeLeft]);

  const initializeGame = (type: string, targetScore: number) => {
    switch (type) {
      case 'memory':
        const pairs = Math.min(8, targetScore + 2);
        const cards = [...Array(pairs)].flatMap((_, i) => [i, i]);
        setMemoryCards(cards.sort(() => Math.random() - 0.5));
        break;
      
      case 'math':
        generateMathQuestion();
        break;
      
      case 'reaction':
        break;
      
      case 'clicking':
        break;
      
      case 'sequence':
        const length = Math.min(10, targetScore + 3);
        const pattern = Array.from({ length }, () => Math.floor(Math.random() * 4));
        setSequencePattern(pattern);
        break;
      
      case 'typing':
        const codeExamples = [
          'function hello() {',
          'const x = 10;',
          'return x + 5;',
          'if (x > 0) {',
          'console.log("test");',
          'for (let i = 0; i < 10; i++) {',
          'const arr = [1, 2, 3];',
          'async function getData() {',
          'try { fetch(url) }',
          'import React from "react";',
        ];
        const selectedLines = codeExamples.sort(() => Math.random() - 0.5).slice(0, targetScore + 2);
        setCodeLines(selectedLines);
        break;
    }
  };

  const startGame = () => {
    setGameStarted(true);
    if (gameType === 'sequence') {
      showSequence();
    }
    if (gameType === 'reaction') {
      startReactionGame();
    }
  };

  const generateMathQuestion = () => {
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    const a = Math.floor(Math.random() * (difficulty > 5000 ? 100 : 50)) + 1;
    const b = Math.floor(Math.random() * (difficulty > 5000 ? 50 : 20)) + 1;
    
    let answer = 0;
    switch (op) {
      case '+': answer = a + b; break;
      case '-': answer = a - b; break;
      case '*': answer = a * b; break;
    }
    
    setMathQuestion({ a, b, op, answer });
  };

  const checkMathAnswer = () => {
    if (parseInt(mathInput) === mathQuestion.answer) {
      setScore(prev => prev + 1);
      setMathInput('');
      generateMathQuestion();
    } else {
      setMathInput('');
    }
  };

  const startReactionGame = () => {
    setReactionClicked(false);
    const delay = Math.random() * 3000 + 1000;
    setTimeout(() => {
      setReactionWaiting(true);
      setReactionStart(Date.now());
    }, delay);
  };

  const handleReactionClick = () => {
    if (!reactionWaiting) {
      onComplete(false);
      return;
    }
    
    const time = Date.now() - reactionStart;
    if (time < 500) {
      setScore(prev => prev + 1);
      setReactionClicked(true);
      
      if (score + 1 < target) {
        setReactionWaiting(false);
        setTimeout(() => startReactionGame(), 1000);
      }
    }
  };

  const showSequence = () => {
    setShowingSequence(true);
    let index = 0;
    
    const interval = setInterval(() => {
      if (index >= sequencePattern.length) {
        clearInterval(interval);
        setShowingSequence(false);
        return;
      }
      
      const btn = document.getElementById(`seq-btn-${sequencePattern[index]}`);
      if (btn) {
        btn.classList.add('ring-4', 'ring-primary');
        setTimeout(() => {
          btn.classList.remove('ring-4', 'ring-primary');
        }, 400);
      }
      
      index++;
    }, 600);
  };

  const handleSequenceClick = (num: number) => {
    if (showingSequence) return;
    
    const newInput = [...sequenceInput, num];
    setSequenceInput(newInput);
    
    if (newInput[newInput.length - 1] !== sequencePattern[newInput.length - 1]) {
      onComplete(false);
      return;
    }
    
    if (newInput.length === sequencePattern.length) {
      setScore(target);
    }
  };

  const handleMemoryClick = (index: number) => {
    if (flippedCards.length === 2 || matchedCards.includes(index) || flippedCards.includes(index)) {
      return;
    }
    
    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);
    
    if (newFlipped.length === 2) {
      if (memoryCards[newFlipped[0]] === memoryCards[newFlipped[1]]) {
        setMatchedCards(prev => [...prev, ...newFlipped]);
        setScore(prev => prev + 1);
        setFlippedCards([]);
      } else {
        setTimeout(() => setFlippedCards([]), 800);
      }
    }
  };

  const handleCodeType = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (codeInput === codeLines[currentCodeLine]) {
        setCorrectCodeLines(prev => prev + 1);
        setScore(prev => prev + 1);
        setCodeInput('');
        setCurrentCodeLine(prev => prev + 1);
      } else {
        setCodeInput('');
      }
    }
  };

  const checkGameCompletion = () => {
    let success = false;
    
    switch (gameType) {
      case 'memory':
        success = matchedCards.length >= memoryCards.length / 2;
        break;
      case 'math':
        success = score >= target;
        break;
      case 'reaction':
        success = score >= target;
        break;
      case 'clicking':
        success = clickCount >= target * 10;
        break;
      case 'sequence':
        success = sequenceInput.length === sequencePattern.length;
        break;
      case 'typing':
        success = correctCodeLines >= target;
        break;
    }
    
    onComplete(success);
  };

  const getGameTitle = () => {
    const titles: Record<string, string> = {
      memory: '🧠 Память',
      math: '🔢 Математика',
      reaction: '⚡ Реакция',
      clicking: '👆 Кликер',
      sequence: '🎯 Последовательность',
      typing: '⌨️ Быстрая печать',
    };
    return titles[gameType] || 'Мини-игра';
  };

  const getGameDescription = () => {
    const descriptions: Record<string, string> = {
      memory: `Найдите ${target} пар карт`,
      math: `Решите ${target} примеров`,
      reaction: `Нажмите ${target} раз быстрее 500мс`,
      clicking: `Кликните ${target * 10} раз`,
      sequence: `Повторите последовательность из ${sequencePattern.length} шагов`,
      typing: `Наберите ${target} строк кода`,
    };
    return descriptions[gameType] || '';
  };

  if (!gameStarted) {
    return (
      <Card className="bg-gradient-to-br from-purple-950/80 to-blue-950/80 border-primary/50">
        <CardHeader>
          <CardTitle className="text-2xl">{getGameTitle()}</CardTitle>
          <CardDescription className="text-base">{getGameDescription()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Сложность:</span>
              <span className="font-bold text-red-400">
                {difficulty > 7000 ? 'ЭКСТРЕМАЛЬНАЯ' : difficulty > 5000 ? 'ОЧЕНЬ ВЫСОКАЯ' : difficulty > 3000 ? 'ВЫСОКАЯ' : 'СРЕДНЯЯ'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Время:</span>
              <span className="font-bold text-yellow-400">{timeLeft} секунд</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Цель:</span>
              <span className="font-bold text-green-400">{getGameDescription()}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={startGame} className="flex-1" size="lg">
              <Icon name="Play" size={20} className="mr-2" />
              Начать
            </Button>
            <Button onClick={onCancel} variant="outline">
              Отмена
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-purple-950/80 to-blue-950/80 border-primary/50">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{getGameTitle()}</CardTitle>
          <div className="flex gap-4 items-center">
            <div className="text-sm">
              <span className="text-muted-foreground">Прогресс: </span>
              <span className="font-bold text-green-400">{score}/{target}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Время: </span>
              <span className="font-bold text-red-400">{timeLeft}с</span>
            </div>
          </div>
        </div>
        <Progress value={(score / target) * 100} className="h-2" />
      </CardHeader>
      <CardContent>
        {gameType === 'memory' && (
          <div className="grid grid-cols-4 gap-2">
            {memoryCards.map((card, index) => (
              <Button
                key={index}
                onClick={() => handleMemoryClick(index)}
                variant={matchedCards.includes(index) ? 'default' : 'outline'}
                className="h-20 text-2xl"
                disabled={matchedCards.includes(index)}
              >
                {flippedCards.includes(index) || matchedCards.includes(index) ? card : '?'}
              </Button>
            ))}
          </div>
        )}

        {gameType === 'math' && (
          <div className="space-y-4">
            <div className="text-center text-4xl font-bold py-8">
              {mathQuestion.a} {mathQuestion.op} {mathQuestion.b} = ?
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={mathInput}
                onChange={(e) => setMathInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && checkMathAnswer()}
                placeholder="Ответ"
                className="flex-1 p-3 rounded-lg bg-slate-800/50 border border-border focus:border-primary outline-none text-center text-2xl"
                autoFocus
              />
              <Button onClick={checkMathAnswer} size="lg">
                Проверить
              </Button>
            </div>
          </div>
        )}

        {gameType === 'reaction' && (
          <div className="py-12">
            {!reactionWaiting && !reactionClicked && (
              <div className="text-center text-xl text-muted-foreground">
                Ждите зелёный сигнал...
              </div>
            )}
            {reactionWaiting && (
              <Button
                onClick={handleReactionClick}
                className="w-full h-32 text-2xl bg-green-600 hover:bg-green-700"
                size="lg"
              >
                НАЖМИ СЕЙЧАС!
              </Button>
            )}
            {reactionClicked && (
              <div className="text-center text-xl text-green-400">
                Отлично! Приготовьтесь к следующему раунду...
              </div>
            )}
          </div>
        )}

        {gameType === 'clicking' && (
          <div className="py-8">
            <Button
              onClick={() => setClickCount(prev => prev + 1)}
              className="w-full h-40 text-4xl"
              size="lg"
            >
              КЛИК! ({clickCount}/{target * 10})
            </Button>
          </div>
        )}

        {gameType === 'sequence' && (
          <div className="space-y-4">
            <div className="text-center text-sm text-muted-foreground mb-4">
              {showingSequence ? 'Запоминайте последовательность...' : 'Повторите последовательность!'}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[0, 1, 2, 3].map((num) => (
                <Button
                  key={num}
                  id={`seq-btn-${num}`}
                  onClick={() => handleSequenceClick(num)}
                  disabled={showingSequence}
                  className="h-24 text-2xl transition-all"
                  variant="outline"
                >
                  {num + 1}
                </Button>
              ))}
            </div>
            <div className="text-center text-sm">
              Введено: {sequenceInput.length}/{sequencePattern.length}
            </div>
          </div>
        )}

        {gameType === 'typing' && (
          <div className="space-y-4">
            {currentCodeLine < codeLines.length ? (
              <>
                <div className="bg-slate-900 p-4 rounded-lg font-mono text-sm border border-primary/30">
                  <div className="text-muted-foreground mb-2">Наберите эту строку:</div>
                  <div className="text-lg text-green-400">{codeLines[currentCodeLine]}</div>
                </div>
                <input
                  type="text"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  onKeyPress={handleCodeType}
                  placeholder="Начните печатать..."
                  className="w-full p-3 rounded-lg bg-slate-800/50 border border-border focus:border-primary outline-none font-mono"
                  autoFocus
                />
                <div className="text-sm text-center text-muted-foreground">
                  Нажмите Enter для проверки
                </div>
              </>
            ) : (
              <div className="text-center text-xl text-green-400 py-8">
                Все строки набраны! 🎉
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MiniGames;
