import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import MiniGames from './MiniGames';

interface CareerAction {
  label: string;
  action: string;
  icon: string;
  variant?: 'default' | 'secondary' | 'outline';
}

interface CareerActionsProps {
  career: string;
  difficulty: number;
  onAction: (action: string, earning: number) => void;
}

const careerActionsMap: Record<string, CareerAction[]> = {
  business: [
    { label: 'Закрыть сделку', action: 'Сделка закрыта', icon: 'Handshake' },
    { label: 'Открыть бизнес', action: 'Бизнес открыт', icon: 'Store', variant: 'secondary' },
    { label: 'Инвестировать', action: 'Инвестиция сделана', icon: 'TrendingUp', variant: 'outline' },
    { label: 'Купить компанию', action: 'Компания куплена', icon: 'Building', variant: 'outline' },
  ],
  doctor: [
    { label: 'Принять пациента', action: 'Пациент принят', icon: 'Stethoscope' },
    { label: 'Провести операцию', action: 'Операция проведена', icon: 'HeartPulse', variant: 'secondary' },
    { label: 'Выписать рецепт', action: 'Рецепт выписан', icon: 'Pill', variant: 'outline' },
    { label: 'Сделать обход', action: 'Обход завершён', icon: 'ClipboardCheck', variant: 'outline' },
  ],
  teacher: [
    { label: 'Провести урок', action: 'Урок проведён', icon: 'BookOpen' },
    { label: 'Проверить работы', action: 'Работы проверены', icon: 'FileCheck', variant: 'secondary' },
    { label: 'Подготовить план', action: 'План готов', icon: 'ClipboardList', variant: 'outline' },
    { label: 'Провести экзамен', action: 'Экзамен проведён', icon: 'Award', variant: 'outline' },
  ],
  programmer: [
    { label: 'Написать код', action: 'Код написан', icon: 'Code' },
    { label: 'Исправить баги', action: 'Баги исправлены', icon: 'Bug', variant: 'secondary' },
    { label: 'Деплой проекта', action: 'Проект задеплоен', icon: 'Rocket', variant: 'outline' },
    { label: 'Code Review', action: 'Ревью завершено', icon: 'GitPullRequest', variant: 'outline' },
  ],
  lawyer: [
    { label: 'Консультация', action: 'Консультация проведена', icon: 'MessageSquare' },
    { label: 'Выиграть дело', action: 'Дело выиграно', icon: 'Gavel', variant: 'secondary' },
    { label: 'Составить договор', action: 'Договор составлен', icon: 'FileText', variant: 'outline' },
    { label: 'Судебное заседание', action: 'Заседание проведено', icon: 'Building', variant: 'outline' },
  ],
  police: [
    { label: 'Патрулировать', action: 'Патруль завершён', icon: 'Car' },
    { label: 'Арестовать', action: 'Преступник арестован', icon: 'Handcuffs', variant: 'secondary' },
    { label: 'Расследовать', action: 'Расследование ведётся', icon: 'Search', variant: 'outline' },
    { label: 'Охранять', action: 'Порядок восстановлен', icon: 'Shield', variant: 'outline' },
  ],
  politician: [
    { label: 'Принять закон', action: 'Закон принят', icon: 'ScrollText' },
    { label: 'Провести выборы', action: 'Выборы выиграны', icon: 'Vote', variant: 'secondary' },
    { label: 'Управлять регионом', action: 'Регион управляется', icon: 'MapPin', variant: 'outline' },
    { label: 'Выступить', action: 'Речь произнесена', icon: 'Mic', variant: 'outline' },
  ],
  journalist: [
    { label: 'Написать статью', action: 'Статья опубликована', icon: 'PenTool' },
    { label: 'Взять интервью', action: 'Интервью взято', icon: 'Mic2', variant: 'secondary' },
    { label: 'Расследовать', action: 'Расследование завершено', icon: 'FileSearch', variant: 'outline' },
    { label: 'Репортаж', action: 'Репортаж готов', icon: 'Camera', variant: 'outline' },
  ],
  chef: [
    { label: 'Приготовить блюдо', action: 'Блюдо готово', icon: 'UtensilsCrossed' },
    { label: 'Создать меню', action: 'Меню создано', icon: 'BookMarked', variant: 'secondary' },
    { label: 'Обучить помощника', action: 'Помощник обучен', icon: 'Users', variant: 'outline' },
    { label: 'Кулинарное шоу', action: 'Шоу проведено', icon: 'Tv', variant: 'outline' },
  ],
  architect: [
    { label: 'Создать проект', action: 'Проект создан', icon: 'Ruler' },
    { label: 'Согласовать план', action: 'План согласован', icon: 'Check', variant: 'secondary' },
    { label: 'Надзор стройки', action: 'Надзор проведён', icon: 'HardHat', variant: 'outline' },
    { label: '3D визуализация', action: 'Визуализация готова', icon: 'Box', variant: 'outline' },
  ],
  scientist: [
    { label: 'Провести эксперимент', action: 'Эксперимент проведён', icon: 'FlaskConical' },
    { label: 'Написать статью', action: 'Статья опубликована', icon: 'BookOpen', variant: 'secondary' },
    { label: 'Анализ данных', action: 'Анализ завершён', icon: 'BarChart3', variant: 'outline' },
    { label: 'Защитить тезис', action: 'Тезис защищён', icon: 'GraduationCap', variant: 'outline' },
  ],
  artist: [
    { label: 'Написать картину', action: 'Картина написана', icon: 'Paintbrush' },
    { label: 'Провести выставку', action: 'Выставка открыта', icon: 'Frame', variant: 'secondary' },
    { label: 'Продать работу', action: 'Работа продана', icon: 'DollarSign', variant: 'outline' },
    { label: 'Мастер-класс', action: 'Мастер-класс проведён', icon: 'Users', variant: 'outline' },
  ],
  musician: [
    { label: 'Записать трек', action: 'Трек записан', icon: 'Music' },
    { label: 'Дать концерт', action: 'Концерт прошёл', icon: 'Mic2', variant: 'secondary' },
    { label: 'Написать песню', action: 'Песня написана', icon: 'FileMusic', variant: 'outline' },
    { label: 'Студийная сессия', action: 'Сессия завершена', icon: 'Radio', variant: 'outline' },
  ],
  athlete: [
    { label: 'Тренировка', action: 'Тренировка завершена', icon: 'Dumbbell' },
    { label: 'Соревнование', action: 'Соревнование выиграно', icon: 'Medal', variant: 'secondary' },
    { label: 'Спонсорский контракт', action: 'Контракт подписан', icon: 'FileSignature', variant: 'outline' },
    { label: 'Интервью', action: 'Интервью дано', icon: 'Video', variant: 'outline' },
  ],
  driver: [
    { label: 'Выполнить заказ', action: 'Заказ выполнен', icon: 'Navigation' },
    { label: 'Дальний рейс', action: 'Рейс завершён', icon: 'Truck', variant: 'secondary' },
    { label: 'Обслуживание авто', action: 'Авто обслужено', icon: 'Wrench', variant: 'outline' },
    { label: 'Заправка', action: 'Авто заправлено', icon: 'Fuel', variant: 'outline' },
  ],
  pilot: [
    { label: 'Выполнить рейс', action: 'Рейс выполнен', icon: 'PlaneTakeoff' },
    { label: 'Международный перелёт', action: 'Перелёт завершён', icon: 'Globe', variant: 'secondary' },
    { label: 'Проверка самолёта', action: 'Проверка завершена', icon: 'ListChecks', variant: 'outline' },
    { label: 'Тренировка на симуляторе', action: 'Тренировка пройдена', icon: 'Gamepad2', variant: 'outline' },
  ],
  farmer: [
    { label: 'Посадить урожай', action: 'Урожай посажен', icon: 'Shovel' },
    { label: 'Собрать урожай', action: 'Урожай собран', icon: 'Apple', variant: 'secondary' },
    { label: 'Ухаживать за скотом', action: 'Скот накормлен', icon: 'Beef', variant: 'outline' },
    { label: 'Продать продукцию', action: 'Продукция продана', icon: 'ShoppingCart', variant: 'outline' },
  ],
  trader: [
    { label: 'Купить акции', action: 'Акции куплены', icon: 'ArrowUpCircle' },
    { label: 'Продать активы', action: 'Активы проданы', icon: 'ArrowDownCircle', variant: 'secondary' },
    { label: 'Анализ рынка', action: 'Анализ проведён', icon: 'LineChart', variant: 'outline' },
    { label: 'Торговая сессия', action: 'Сессия завершена', icon: 'Activity', variant: 'outline' },
  ],
};

const CareerActions = ({ career, difficulty, onAction }: CareerActionsProps) => {
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  const actions = careerActionsMap[career] || [];

  const handleActionClick = (action: string) => {
    setSelectedAction(action);
    setShowMiniGame(true);
  };

  const handleGameComplete = (success: boolean) => {
    setShowMiniGame(false);
    if (success) {
      const baseEarning = difficulty + Math.floor(Math.random() * 1000);
      onAction(selectedAction, baseEarning);
    } else {
      onAction('Провал! Попробуйте ещё раз', 0);
    }
  };

  const handleGameCancel = () => {
    setShowMiniGame(false);
  };

  if (actions.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Действия для этой профессии находятся в разработке
      </div>
    );
  }

  if (showMiniGame) {
    return (
      <MiniGames
        career={career}
        difficulty={difficulty}
        onComplete={handleGameComplete}
        onCancel={handleGameCancel}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((actionItem, index) => (
        <Button
          key={index}
          onClick={() => handleActionClick(actionItem.action)}
          variant={actionItem.variant || 'default'}
          className="h-20 flex-col"
        >
          <Icon name={actionItem.icon} size={24} className="mb-1" />
          <span className="text-sm">{actionItem.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default CareerActions;