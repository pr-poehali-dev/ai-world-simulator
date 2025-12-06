import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import CareerActions from '@/components/CareerActions';

type Career = 'business' | 'police' | 'politician' | 'criminal' | 'smuggler' | 'doctor' | 'teacher' | 'programmer' | 'lawyer' | 'journalist' | 'chef' | 'architect' | 'scientist' | 'artist' | 'musician' | 'athlete' | 'driver' | 'pilot' | 'farmer' | 'trader' | null;

interface Player {
  name: string;
  email: string;
  career: Career;
  balance: number;
  reputation: number;
  influence: number;
  level: number;
  donateCoins: number;
  isAdmin: boolean;
  countryId: string | null;
}

interface LeaderboardEntry {
  name: string;
  career: string;
  balance: number;
  influence: number;
}

interface Country {
  id: string;
  name: string;
  flag: string;
  founderId: string;
  population: number;
  budget: number;
  laws: string[];
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
    id: 'doctor' as Career,
    name: 'Врач',
    icon: 'Heart',
    description: 'Спасайте жизни, лечите людей, развивайте медицину',
    color: 'text-red-300',
    earning: 4500,
  },
  {
    id: 'teacher' as Career,
    name: 'Учитель',
    icon: 'GraduationCap',
    description: 'Обучайте детей, делитесь знаниями, формируйте будущее',
    color: 'text-yellow-400',
    earning: 2800,
  },
  {
    id: 'programmer' as Career,
    name: 'Программист',
    icon: 'Code',
    description: 'Создавайте приложения, пишите код, меняйте мир технологий',
    color: 'text-green-400',
    earning: 6500,
  },
  {
    id: 'lawyer' as Career,
    name: 'Адвокат',
    icon: 'Scale',
    description: 'Защищайте права, выигрывайте дела, работайте с законом',
    color: 'text-indigo-400',
    earning: 5500,
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
    id: 'journalist' as Career,
    name: 'Журналист',
    icon: 'Newspaper',
    description: 'Ищите правду, пишите статьи, влияйте на общественное мнение',
    color: 'text-slate-300',
    earning: 3200,
  },
  {
    id: 'chef' as Career,
    name: 'Шеф-повар',
    icon: 'ChefHat',
    description: 'Готовьте шедевры, открывайте рестораны, получайте звёзды Мишлен',
    color: 'text-orange-300',
    earning: 3800,
  },
  {
    id: 'architect' as Career,
    name: 'Архитектор',
    icon: 'Building2',
    description: 'Проектируйте здания, создавайте городской ландшафт',
    color: 'text-teal-400',
    earning: 4800,
  },
  {
    id: 'scientist' as Career,
    name: 'Учёный',
    icon: 'FlaskConical',
    description: 'Исследуйте мир, делайте открытия, получайте Нобелевские премии',
    color: 'text-violet-400',
    earning: 4200,
  },
  {
    id: 'artist' as Career,
    name: 'Художник',
    icon: 'Palette',
    description: 'Создавайте искусство, выставляйтесь в галереях, продавайте картины',
    color: 'text-pink-400',
    earning: 3500,
  },
  {
    id: 'musician' as Career,
    name: 'Музыкант',
    icon: 'Music',
    description: 'Пишите хиты, выступайте на концертах, получайте премии',
    color: 'text-fuchsia-400',
    earning: 4500,
  },
  {
    id: 'athlete' as Career,
    name: 'Спортсмен',
    icon: 'Trophy',
    description: 'Тренируйтесь, побеждайте на соревнованиях, становитесь чемпионом',
    color: 'text-amber-400',
    earning: 5800,
  },
  {
    id: 'driver' as Career,
    name: 'Водитель',
    icon: 'Car',
    description: 'Перевозите людей и грузы, работайте в такси или на дальних рейсах',
    color: 'text-gray-400',
    earning: 2500,
  },
  {
    id: 'pilot' as Career,
    name: 'Пилот',
    icon: 'Plane',
    description: 'Управляйте самолётами, летайте по всему миру, зарабатывайте высокие зарплаты',
    color: 'text-sky-400',
    earning: 7500,
  },
  {
    id: 'farmer' as Career,
    name: 'Фермер',
    icon: 'Sprout',
    description: 'Выращивайте урожай, разводите скот, поставляйте продукты',
    color: 'text-lime-400',
    earning: 3000,
  },
  {
    id: 'trader' as Career,
    name: 'Трейдер',
    icon: 'TrendingUp',
    description: 'Торгуйте на бирже, инвестируйте, зарабатывайте на рынках',
    color: 'text-emerald-400',
    earning: 6800,
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
  { name: 'Дмитрий Р.', career: 'Преступник', balance: 12000000, influence: 76 },
  { name: 'Игорь М.', career: 'Контрабандист', balance: 9800000, influence: 71 },
  { name: 'Мария В.', career: 'Депутат', balance: 8500000, influence: 88 },
  { name: 'Анна П.', career: 'Пилот', balance: 7200000, influence: 65 },
  { name: 'Сергей Б.', career: 'Программист', balance: 6800000, influence: 58 },
  { name: 'Ольга К.', career: 'Трейдер', balance: 6500000, influence: 62 },
  { name: 'Владимир Т.', career: 'Адвокат', balance: 5900000, influence: 72 },
  { name: 'Екатерина Л.', career: 'Врач', balance: 5100000, influence: 81 },
  { name: 'Николай Ш.', career: 'Спортсмен', balance: 4800000, influence: 68 },
];

const Index = () => {
  const { toast } = useToast();
  const [player, setPlayer] = useState<Player>({
    name: '',
    email: '',
    career: null,
    balance: 10000,
    reputation: 50,
    influence: 0,
    level: 1,
    donateCoins: 0,
    isAdmin: false,
    countryId: null,
  });

  const [gameStarted, setGameStarted] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [countries, setCountries] = useState<Country[]>([]);
  const [showCountryCreation, setShowCountryCreation] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const selectCareer = (career: Career) => {
    setPlayer({ ...player, career });
    setGameStarted(true);
    toast({
      title: 'Карьера выбрана!',
      description: `Добро пожаловать в мир ${careers.find(c => c.id === career)?.name.toLowerCase()}а`,
    });
  };

  const performAction = (action: string, earning: number) => {
    const repChange = Math.floor(Math.random() * 10) - 3;
    const infChange = Math.floor(Math.random() * 5);

    setPlayer(prev => ({
      ...prev,
      balance: prev.balance + earning,
      reputation: Math.max(0, Math.min(100, prev.reputation + repChange)),
      influence: Math.min(100, prev.influence + infChange),
    }));

    if (earning > 0) {
      toast({
        title: action,
        description: `+${earning.toLocaleString('ru-RU')} ₽ | Репутация ${repChange > 0 ? '+' : ''}${repChange}`,
      });
    } else {
      toast({
        title: action,
        description: 'Попробуйте снова!',
        variant: 'destructive',
      });
    }
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

  const handleRegister = (name: string, email: string, password: string) => {
    if (!name || !email || !password) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive',
      });
      return;
    }
    
    setPlayer(prev => ({ ...prev, name, email }));
    setIsRegistered(true);
    toast({
      title: 'Добро пожаловать!',
      description: `Аккаунт ${name} успешно создан`,
    });
  };

  const handleLogin = (email: string, password: string) => {
    if (!email || !password) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive',
      });
      return;
    }
    
    setPlayer(prev => ({ ...prev, name: 'Игрок', email, isAdmin: email === 'admin@liferp.com' }));
    setIsRegistered(true);
    toast({
      title: 'Вход выполнен',
      description: 'Добро пожаловать в LifeRP AI',
    });
  };

  const buyDonateCoins = (amount: number, price: number) => {
    if (player.balance < price) {
      toast({
        title: 'Недостаточно средств',
        description: 'Пополните баланс',
        variant: 'destructive',
      });
      return;
    }
    
    setPlayer(prev => ({
      ...prev,
      balance: prev.balance - price,
      donateCoins: prev.donateCoins + amount,
    }));
    
    toast({
      title: 'Покупка успешна!',
      description: `+${amount} донат-монет`,
    });
  };

  const createCountry = (name: string, flag: string) => {
    const COUNTRY_COST = 1000;
    
    if (player.donateCoins < COUNTRY_COST) {
      toast({
        title: 'Недостаточно донат-монет',
        description: `Требуется ${COUNTRY_COST} донат-монет`,
        variant: 'destructive',
      });
      return;
    }
    
    const newCountry: Country = {
      id: Date.now().toString(),
      name,
      flag,
      founderId: player.email,
      population: 1,
      budget: 100000,
      laws: [],
    };
    
    setCountries(prev => [...prev, newCountry]);
    setPlayer(prev => ({
      ...prev,
      donateCoins: prev.donateCoins - COUNTRY_COST,
      countryId: newCountry.id,
    }));
    setShowCountryCreation(false);
    
    toast({
      title: 'Страна создана!',
      description: `${name} теперь на карте мира`,
    });
  };

  const passLaw = (law: string) => {
    if (player.career !== 'politician') {
      toast({
        title: 'Доступ запрещён',
        description: 'Только депутаты могут принимать законы',
        variant: 'destructive',
      });
      return;
    }
    
    const country = countries.find(c => c.id === player.countryId);
    if (!country) {
      toast({
        title: 'Ошибка',
        description: 'Вы не состоите в стране',
        variant: 'destructive',
      });
      return;
    }
    
    setCountries(prev => prev.map(c => 
      c.id === player.countryId 
        ? { ...c, laws: [...c.laws, law] }
        : c
    ));
    
    toast({
      title: 'Закон принят!',
      description: law,
    });
  };

  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-900 p-6 flex items-center justify-center">
        <Card className="w-full max-w-md bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-3xl text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              LifeRP AI
            </CardTitle>
            <CardDescription className="text-center">
              Симуляция реальной жизни с ИИ
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {showLogin ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Email</label>
                  <input
                    type="email"
                    id="login-email"
                    placeholder="example@mail.com"
                    className="w-full p-3 rounded-lg bg-slate-800/50 border border-border focus:border-primary outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Пароль</label>
                  <input
                    type="password"
                    id="login-password"
                    placeholder="••••••••"
                    className="w-full p-3 rounded-lg bg-slate-800/50 border border-border focus:border-primary outline-none"
                  />
                </div>
                <Button
                  onClick={() => {
                    const email = (document.getElementById('login-email') as HTMLInputElement).value;
                    const password = (document.getElementById('login-password') as HTMLInputElement).value;
                    handleLogin(email, password);
                  }}
                  className="w-full"
                  size="lg"
                >
                  Войти
                </Button>
                <div className="text-center">
                  <button
                    onClick={() => setShowLogin(false)}
                    className="text-sm text-primary hover:underline"
                  >
                    Нет аккаунта? Зарегистрироваться
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Имя персонажа</label>
                  <input
                    type="text"
                    id="reg-name"
                    placeholder="Иван Иванов"
                    className="w-full p-3 rounded-lg bg-slate-800/50 border border-border focus:border-primary outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Email</label>
                  <input
                    type="email"
                    id="reg-email"
                    placeholder="example@mail.com"
                    className="w-full p-3 rounded-lg bg-slate-800/50 border border-border focus:border-primary outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Пароль</label>
                  <input
                    type="password"
                    id="reg-password"
                    placeholder="••••••••"
                    className="w-full p-3 rounded-lg bg-slate-800/50 border border-border focus:border-primary outline-none"
                  />
                </div>
                <Button
                  onClick={() => {
                    const name = (document.getElementById('reg-name') as HTMLInputElement).value;
                    const email = (document.getElementById('reg-email') as HTMLInputElement).value;
                    const password = (document.getElementById('reg-password') as HTMLInputElement).value;
                    handleRegister(name, email, password);
                  }}
                  className="w-full"
                  size="lg"
                >
                  Зарегистрироваться
                </Button>
                <div className="text-center">
                  <button
                    onClick={() => setShowLogin(true)}
                    className="text-sm text-primary hover:underline"
                  >
                    Уже есть аккаунт? Войти
                  </button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <p className="text-muted-foreground">20 уникальных профессий из реальной жизни</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-scale-in">
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
          <div className="flex gap-2">
            {player.isAdmin && (
              <Button
                variant="secondary"
                onClick={() => setShowAdminPanel(!showAdminPanel)}
              >
                <Icon name="ShieldCheck" size={16} className="mr-2" />
                Админ-панель
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => {
                setGameStarted(false);
              }}
            >
              <Icon name="RefreshCw" size={16} className="mr-2" />
              Сменить карьеру
            </Button>
          </div>
        </div>

        {showAdminPanel && player.isAdmin && (
          <Card className="bg-gradient-to-br from-red-950/50 to-orange-950/50 border-red-500/50 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="ShieldAlert" size={24} className="text-red-400" />
                Админ-панель
              </CardTitle>
              <CardDescription>Управление игровым миром</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => {
                    setPlayer(prev => ({ ...prev, balance: prev.balance + 1000000 }));
                    toast({ title: 'Выдано', description: '+1,000,000 ₽' });
                  }}
                  variant="secondary"
                  size="sm"
                >
                  <Icon name="DollarSign" size={16} className="mr-1" />
                  +1M денег
                </Button>
                <Button
                  onClick={() => {
                    setPlayer(prev => ({ ...prev, donateCoins: prev.donateCoins + 500 }));
                    toast({ title: 'Выдано', description: '+500 донат-монет' });
                  }}
                  variant="secondary"
                  size="sm"
                >
                  <Icon name="Coins" size={16} className="mr-1" />
                  +500 монет
                </Button>
                <Button
                  onClick={() => {
                    setPlayer(prev => ({ ...prev, level: prev.level + 10 }));
                    toast({ title: 'Выдано', description: '+10 уровней' });
                  }}
                  variant="secondary"
                  size="sm"
                >
                  <Icon name="TrendingUp" size={16} className="mr-1" />
                  +10 уровней
                </Button>
                <Button
                  onClick={triggerAiEvent}
                  variant="destructive"
                  size="sm"
                >
                  <Icon name="Zap" size={16} className="mr-1" />
                  Событие
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
                      <span className="text-xl font-bold text-green-400">
                        {player.balance.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Донат-монеты</span>
                      <span className="text-xl font-bold text-yellow-400">
                        {player.donateCoins}
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
                {player.career && (
                  <CareerActions 
                    career={player.career}
                    difficulty={careers.find(c => c.id === player.career)?.earning || 3000}
                    onAction={performAction} 
                  />
                )}
              </CardContent>
            </Card>

            {player.career === 'politician' && (
              <Card className="bg-gradient-to-br from-purple-950/50 to-indigo-950/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Landmark" size={24} className="text-purple-400" />
                    Законодательство
                  </CardTitle>
                  <CardDescription>
                    Принимайте законы для вашей страны
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    onClick={() => passLaw('Закон о снижении налогов на 5%')}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Icon name="Percent" size={16} className="mr-2" />
                    Снизить налоги
                  </Button>
                  <Button
                    onClick={() => passLaw('Закон об увеличении минимальной зарплаты')}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Icon name="Wallet" size={16} className="mr-2" />
                    Повысить зарплаты
                  </Button>
                  <Button
                    onClick={() => passLaw('Закон о бесплатном образовании')}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Icon name="GraduationCap" size={16} className="mr-2" />
                    Бесплатное образование
                  </Button>
                  <Button
                    onClick={() => passLaw('Закон об ужесточении наказаний за преступления')}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Icon name="Gavel" size={16} className="mr-2" />
                    Ужесточить наказания
                  </Button>
                </CardContent>
              </Card>
            )}

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
            <Card className="bg-gradient-to-br from-yellow-950/50 to-amber-950/50 border-yellow-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Coins" size={24} className="text-yellow-400" />
                  Донат-магазин
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => buyDonateCoins(100, 50000)}
                    variant="outline"
                    size="sm"
                  >
                    100 монет
                    <span className="text-xs text-muted-foreground ml-1">50K ₽</span>
                  </Button>
                  <Button
                    onClick={() => buyDonateCoins(500, 200000)}
                    variant="outline"
                    size="sm"
                  >
                    500 монет
                    <span className="text-xs text-muted-foreground ml-1">200K ₽</span>
                  </Button>
                  <Button
                    onClick={() => buyDonateCoins(1000, 350000)}
                    variant="outline"
                    size="sm"
                  >
                    1000 монет
                    <span className="text-xs text-muted-foreground ml-1">350K ₽</span>
                  </Button>
                  <Button
                    onClick={() => buyDonateCoins(5000, 1500000)}
                    variant="outline"
                    size="sm"
                  >
                    5000 монет
                    <span className="text-xs text-muted-foreground ml-1">1.5M ₽</span>
                  </Button>
                </div>
                {!player.countryId && (
                  <div className="pt-3 border-t border-border">
                    <Button
                      onClick={() => setShowCountryCreation(true)}
                      variant="default"
                      className="w-full"
                    >
                      <Icon name="Flag" size={16} className="mr-2" />
                      Создать страну (1000 монет)
                    </Button>
                  </div>
                )}
                {player.countryId && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-sm text-center text-green-400">
                      <Icon name="Check" size={16} className="inline mr-1" />
                      Вы владелец страны
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {showCountryCreation && (
              <Card className="bg-gradient-to-br from-blue-950/50 to-purple-950/50 border-blue-500/30 animate-scale-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Globe" size={24} className="text-blue-400" />
                    Создание страны
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Название страны</label>
                    <input
                      type="text"
                      id="country-name"
                      placeholder="Российская Федерация"
                      className="w-full p-2 rounded-lg bg-slate-800/50 border border-border focus:border-primary outline-none text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Флаг (эмодзи)</label>
                    <input
                      type="text"
                      id="country-flag"
                      placeholder="🇷🇺"
                      maxLength={2}
                      className="w-full p-2 rounded-lg bg-slate-800/50 border border-border focus:border-primary outline-none text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        const name = (document.getElementById('country-name') as HTMLInputElement).value;
                        const flag = (document.getElementById('country-flag') as HTMLInputElement).value;
                        if (name && flag) createCountry(name, flag);
                      }}
                      className="flex-1"
                    >
                      Создать
                    </Button>
                    <Button
                      onClick={() => setShowCountryCreation(false)}
                      variant="outline"
                    >
                      Отмена
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
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