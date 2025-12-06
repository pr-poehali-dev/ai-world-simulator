import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

type Career = 'business' | 'police' | 'politician' | 'criminal' | 'smuggler' | null;

interface Player {
  name: string;
  career: Career;
  balance: number;
  reputation: number;
  influence: number;
  level: number;
}

interface LeaderboardEntry {
  name: string;
  career: string;
  balance: number;
  influence: number;
}

const careers = [
  {
    id: 'business' as Career,
    name: 'Бизнесмен',
    icon: 'Briefcase',
    description: 'Стройте империю, создавайте компании, зарабатывайте миллионы',
    color: 'text-blue-400',
    earning: 5000,
  },
  {
    id: 'police' as Career,
    name: 'Полицейский',
    icon: 'Shield',
    description: 'Защищайте закон, ловите преступников, поддерживайте порядок',
    color: 'text-cyan-400',
    earning: 3000,
  },
  {
    id: 'politician' as Career,
    name: 'Депутат',
    icon: 'Users',
    description: 'Создавайте законы, влияйте на страну, управляйте регионами',
    color: 'text-purple-400',
    earning: 4000,
  },
  {
    id: 'criminal' as Career,
    name: 'Преступник',
    icon: 'Skull',
    description: 'Рискуйте всем, грабьте банки, стройте криминальную империю',
    color: 'text-red-400',
    earning: 7000,
  },
  {
    id: 'smuggler' as Career,
    name: 'Контрабандист',
    icon: 'Package',
    description: 'Торгуйте запрещённым товаром, обходите закон, рискуйте свободой',
    color: 'text-orange-400',
    earning: 6000,
  },
];

const aiEvents = [
  { text: 'Экономический кризис! Все теряют 10% капитала', impact: -0.1 },
  { text: 'Бум на фондовом рынке! Все получают бонус +20%', impact: 0.2 },
  { text: 'Новый закон о борьбе с преступностью принят!', impact: 0 },
  { text: 'Скандал в правительстве! Репутация политиков падает', impact: 0 },
  { text: 'Крупная полицейская операция! Преступники в бегах', impact: 0 },
];

const mockLeaderboard: LeaderboardEntry[] = [
  { name: 'Александр К.', career: 'Бизнесмен', balance: 15000000, influence: 95 },
  { name: 'Мария В.', career: 'Депутат', balance: 8500000, influence: 88 },
  { name: 'Дмитрий Р.', career: 'Преступник', balance: 12000000, influence: 76 },
  { name: 'Елена С.', career: 'Полицейский', balance: 4200000, influence: 82 },
  { name: 'Игорь М.', career: 'Контрабандист', balance: 9800000, influence: 71 },
];

const Index = () => {
  const { toast } = useToast();
  const [player, setPlayer] = useState<Player>({
    name: 'Новый Игрок',
    career: null,
    balance: 10000,
    reputation: 50,
    influence: 0,
    level: 1,
  });

  const [gameStarted, setGameStarted] = useState(false);

  const selectCareer = (career: Career) => {
    setPlayer({ ...player, career });
    setGameStarted(true);
    toast({
      title: 'Карьера выбрана!',
      description: `Добро пожаловать в мир ${careers.find(c => c.id === career)?.name.toLowerCase()}а`,
    });
  };

  const performAction = (action: string) => {
    const career = careers.find(c => c.id === player.career);
    if (!career) return;

    const earning = career.earning + Math.floor(Math.random() * 1000);
    const repChange = Math.floor(Math.random() * 10) - 3;
    const infChange = Math.floor(Math.random() * 5);

    setPlayer(prev => ({
      ...prev,
      balance: prev.balance + earning,
      reputation: Math.max(0, Math.min(100, prev.reputation + repChange)),
      influence: Math.min(100, prev.influence + infChange),
    }));

    toast({
      title: action,
      description: `+${earning.toLocaleString('ru-RU')} ₽ | Репутация ${repChange > 0 ? '+' : ''}${repChange}`,
    });
  };

  const triggerAiEvent = () => {
    const event = aiEvents[Math.floor(Math.random() * aiEvents.length)];
    
    if (event.impact !== 0) {
      const balanceChange = Math.floor(player.balance * event.impact);
      setPlayer(prev => ({
        ...prev,
        balance: Math.max(0, prev.balance + balanceChange),
      }));
    }

    toast({
      title: '🤖 ИИ-Событие',
      description: event.text,
      variant: event.impact < 0 ? 'destructive' : 'default',
    });
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              LifeRP AI
            </h1>
            <p className="text-xl text-muted-foreground">
              Симуляция реальной жизни с искусственным интеллектом
            </p>
            <p className="text-lg mt-2 text-foreground/80">
              Стройте карьеру, зарабатывайте, влияйте на мир
            </p>
          </div>

          <div className="mb-8 text-center animate-slide-up">
            <h2 className="text-3xl font-bold mb-6">Выберите свой путь</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-scale-in">
            {careers.map((career, index) => (
              <Card
                key={career.id}
                className="hover:scale-105 transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 bg-card/50 backdrop-blur"
                onClick={() => selectCareer(career.id)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-3 rounded-lg bg-slate-800/50 ${career.color}`}>
                      <Icon name={career.icon} size={32} />
                    </div>
                    <CardTitle className="text-2xl">{career.name}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {career.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="TrendingUp" size={16} className="text-green-400" />
                    <span className="text-muted-foreground">
                      Доход: ~{career.earning.toLocaleString('ru-RU')} ₽/действие
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentCareer = careers.find(c => c.id === player.career);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              LifeRP AI
            </h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <Icon name={currentCareer?.icon || 'User'} size={16} className={currentCareer?.color} />
              {currentCareer?.name}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setGameStarted(false);
              setPlayer({
                name: 'Новый Игрок',
                career: null,
                balance: 10000,
                reputation: 50,
                influence: 0,
                level: 1,
              });
            }}
          >
            <Icon name="RefreshCw" size={16} className="mr-2" />
            Новая игра
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card/50 backdrop-blur animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="User" size={24} />
                  Профиль игрока
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Баланс</span>
                      <span className="text-2xl font-bold text-green-400">
                        {player.balance.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Уровень</span>
                      <Badge variant="secondary" className="text-lg">
                        {player.level}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Репутация</span>
                        <span className="text-sm font-medium">{player.reputation}%</span>
                      </div>
                      <Progress value={player.reputation} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Влияние</span>
                        <span className="text-sm font-medium">{player.influence}%</span>
                      </div>
                      <Progress value={player.influence} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Zap" size={24} className="text-yellow-400" />
                  Действия
                </CardTitle>
                <CardDescription>
                  Совершайте действия, чтобы зарабатывать деньги и влияние
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {player.career === 'business' && (
                    <>
                      <Button onClick={() => performAction('Сделка закрыта')} className="h-20">
                        <Icon name="Handshake" size={24} className="mr-2" />
                        Закрыть сделку
                      </Button>
                      <Button onClick={() => performAction('Бизнес открыт')} variant="secondary" className="h-20">
                        <Icon name="Store" size={24} className="mr-2" />
                        Открыть бизнес
                      </Button>
                      <Button onClick={() => performAction('Инвестиция сделана')} variant="outline" className="h-20">
                        <Icon name="TrendingUp" size={24} className="mr-2" />
                        Инвестировать
                      </Button>
                      <Button onClick={() => performAction('Компания куплена')} variant="outline" className="h-20">
                        <Icon name="Building" size={24} className="mr-2" />
                        Купить компанию
                      </Button>
                    </>
                  )}
                  
                  {player.career === 'police' && (
                    <>
                      <Button onClick={() => performAction('Патруль завершён')} className="h-20">
                        <Icon name="Car" size={24} className="mr-2" />
                        Патрулировать
                      </Button>
                      <Button onClick={() => performAction('Преступник арестован')} variant="secondary" className="h-20">
                        <Icon name="Handcuffs" size={24} className="mr-2" />
                        Арестовать
                      </Button>
                      <Button onClick={() => performAction('Расследование ведётся')} variant="outline" className="h-20">
                        <Icon name="Search" size={24} className="mr-2" />
                        Расследовать
                      </Button>
                      <Button onClick={() => performAction('Порядок восстановлен')} variant="outline" className="h-20">
                        <Icon name="Shield" size={24} className="mr-2" />
                        Охранять
                      </Button>
                    </>
                  )}
                  
                  {player.career === 'politician' && (
                    <>
                      <Button onClick={() => performAction('Закон принят')} className="h-20">
                        <Icon name="ScrollText" size={24} className="mr-2" />
                        Принять закон
                      </Button>
                      <Button onClick={() => performAction('Выборы выиграны')} variant="secondary" className="h-20">
                        <Icon name="Vote" size={24} className="mr-2" />
                        Провести выборы
                      </Button>
                      <Button onClick={() => performAction('Регион управляется')} variant="outline" className="h-20">
                        <Icon name="MapPin" size={24} className="mr-2" />
                        Управлять регионом
                      </Button>
                      <Button onClick={() => performAction('Речь произнесена')} variant="outline" className="h-20">
                        <Icon name="Mic" size={24} className="mr-2" />
                        Выступить
                      </Button>
                    </>
                  )}
                  
                  {player.career === 'criminal' && (
                    <>
                      <Button onClick={() => performAction('Ограбление успешно')} className="h-20">
                        <Icon name="DollarSign" size={24} className="mr-2" />
                        Ограбить
                      </Button>
                      <Button onClick={() => performAction('Банда создана')} variant="secondary" className="h-20">
                        <Icon name="Users" size={24} className="mr-2" />
                        Создать банду
                      </Button>
                      <Button onClick={() => performAction('Территория захвачена')} variant="outline" className="h-20">
                        <Icon name="Flag" size={24} className="mr-2" />
                        Захватить район
                      </Button>
                      <Button onClick={() => performAction('Дело провёрнуто')} variant="outline" className="h-20">
                        <Icon name="Gem" size={24} className="mr-2" />
                        Тёмные дела
                      </Button>
                    </>
                  )}
                  
                  {player.career === 'smuggler' && (
                    <>
                      <Button onClick={() => performAction('Товар доставлен')} className="h-20">
                        <Icon name="Truck" size={24} className="mr-2" />
                        Перевезти товар
                      </Button>
                      <Button onClick={() => performAction('Канал открыт')} variant="secondary" className="h-20">
                        <Icon name="Route" size={24} className="mr-2" />
                        Открыть канал
                      </Button>
                      <Button onClick={() => performAction('Граница пройдена')} variant="outline" className="h-20">
                        <Icon name="Plane" size={24} className="mr-2" />
                        Пересечь границу
                      </Button>
                      <Button onClick={() => performAction('Сделка заключена')} variant="outline" className="h-20">
                        <Icon name="Package" size={24} className="mr-2" />
                        Продать груз
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Sparkles" size={24} className="text-primary" />
                  ИИ-События
                </CardTitle>
                <CardDescription>
                  Искусственный интеллект создаёт случайные события в игровом мире
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={triggerAiEvent} size="lg" className="w-full">
                  <Icon name="Wand2" size={20} className="mr-2" />
                  Запустить ИИ-событие
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-card/50 backdrop-blur animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Trophy" size={24} className="text-yellow-400" />
                  Таблица лидеров
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockLeaderboard.map((entry, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{entry.name}</p>
                        <p className="text-xs text-muted-foreground">{entry.career}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-400">
                          {(entry.balance / 1000000).toFixed(1)}M
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Влияние: {entry.influence}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Icon name="Info" size={20} />
                  Игровые механики
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Icon name="Shield" size={16} className="mt-0.5 text-cyan-400" />
                  <p>Защита новичков — первые 10 уровней</p>
                </div>
                <div className="flex items-start gap-2">
                  <Icon name="Swords" size={16} className="mt-0.5 text-red-400" />
                  <p>PvP-контроль — честная конкуренция</p>
                </div>
                <div className="flex items-start gap-2">
                  <Icon name="ShieldCheck" size={16} className="mt-0.5 text-green-400" />
                  <p>Античит-система — автоматический анализ</p>
                </div>
                <div className="flex items-start gap-2">
                  <Icon name="TrendingUp" size={16} className="mt-0.5 text-purple-400" />
                  <p>Балансировка — регулярные обновления</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
