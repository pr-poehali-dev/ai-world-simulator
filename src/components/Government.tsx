import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Law {
  id: string;
  title: string;
  description: string;
  author: string;
  votes: { for: number; against: number };
  status: 'draft' | 'voting' | 'approved' | 'rejected';
  category: string;
}

interface GovernmentProps {
  player: any;
  laws: Law[];
  president: string;
  onClose: () => void;
  onProposeLaw: (title: string, description: string, category: string) => void;
  onVoteLaw: (lawId: string, vote: boolean) => void;
  onDeleteLaw: (lawId: string) => void;
}

const Government = ({ player, laws, president, onClose, onProposeLaw, onVoteLaw, onDeleteLaw }: GovernmentProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'laws' | 'create' | 'president'>('laws');
  const [newLawTitle, setNewLawTitle] = useState('');
  const [newLawDescription, setNewLawDescription] = useState('');
  const [newLawCategory, setNewLawCategory] = useState('social');

  const canVote = player.career === 'politician';
  const isPresident = player.email === president;

  const lawCategories = [
    { id: 'social', name: 'Социальная сфера', icon: 'Users' },
    { id: 'economy', name: 'Экономика', icon: 'TrendingUp' },
    { id: 'education', name: 'Образование', icon: 'GraduationCap' },
    { id: 'healthcare', name: 'Здравоохранение', icon: 'Heart' },
    { id: 'justice', name: 'Правосудие', icon: 'Scale' },
    { id: 'security', name: 'Безопасность', icon: 'Shield' },
  ];

  const handleProposeLaw = () => {
    if (!newLawTitle || !newLawDescription) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive',
      });
      return;
    }

    if (!canVote) {
      toast({
        title: 'Доступ запрещён',
        description: 'Только депутаты могут предлагать законы',
        variant: 'destructive',
      });
      return;
    }

    onProposeLaw(newLawTitle, newLawDescription, newLawCategory);
    setNewLawTitle('');
    setNewLawDescription('');
    setActiveTab('laws');
    
    toast({
      title: 'Законопроект внесён!',
      description: 'Законопроект отправлен на рассмотрение Госдумы',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border-2 border-slate-700 flex flex-col">
        <CardHeader className="bg-gradient-to-r from-blue-700 to-red-600 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2 text-2xl">
                <Icon name="Landmark" size={28} />
                Государственная Дума РФ
              </CardTitle>
              <CardDescription className="text-blue-100">
                Федеральное собрание Российской Федерации
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white">
              <Icon name="X" size={24} />
            </Button>
          </div>
        </CardHeader>

        <div className="flex border-b border-slate-700 bg-slate-800/50 flex-shrink-0">
          <Button
            variant={activeTab === 'laws' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('laws')}
            className="rounded-none"
          >
            <Icon name="ScrollText" size={16} className="mr-2" />
            Законопроекты
          </Button>
          {canVote && (
            <Button
              variant={activeTab === 'create' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('create')}
              className="rounded-none"
            >
              <Icon name="FilePlus" size={16} className="mr-2" />
              Создать законопроект
            </Button>
          )}
          <Button
            variant={activeTab === 'president' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('president')}
            className="rounded-none"
          >
            <Icon name="Crown" size={16} className="mr-2" />
            Президент
          </Button>
        </div>

        <CardContent className="flex-1 overflow-y-auto p-6">
          {activeTab === 'laws' && (
            <div className="space-y-4">
              {laws.length === 0 ? (
                <div className="text-center py-12">
                  <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Нет активных законопроектов
                  </p>
                </div>
              ) : (
                laws.map((law) => (
                  <Card key={law.id} className="bg-slate-800/50">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant={
                                law.status === 'approved'
                                  ? 'default'
                                  : law.status === 'rejected'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                            >
                              {law.status === 'draft' && 'Черновик'}
                              {law.status === 'voting' && 'Голосование'}
                              {law.status === 'approved' && 'Принят'}
                              {law.status === 'rejected' && 'Отклонён'}
                            </Badge>
                            <Badge variant="outline">
                              {lawCategories.find(c => c.id === law.category)?.name}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">{law.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            Автор: {law.author}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">{law.description}</p>
                      
                      {law.status === 'voting' && (
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-green-400">За: {law.votes.for}</span>
                              <span className="text-red-400">Против: {law.votes.against}</span>
                            </div>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden flex">
                              <div
                                className="bg-green-500"
                                style={{
                                  width: `${(law.votes.for / (law.votes.for + law.votes.against || 1)) * 100}%`,
                                }}
                              />
                              <div
                                className="bg-red-500"
                                style={{
                                  width: `${(law.votes.against / (law.votes.for + law.votes.against || 1)) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                          
                          {canVote && (
                            <div className="flex gap-2">
                              <Button
                                onClick={() => onVoteLaw(law.id, true)}
                                variant="outline"
                                size="sm"
                                className="flex-1 border-green-500 hover:bg-green-500/20"
                              >
                                <Icon name="ThumbsUp" size={16} className="mr-2" />
                                За
                              </Button>
                              <Button
                                onClick={() => onVoteLaw(law.id, false)}
                                variant="outline"
                                size="sm"
                                className="flex-1 border-red-500 hover:bg-red-500/20"
                              >
                                <Icon name="ThumbsDown" size={16} className="mr-2" />
                                Против
                              </Button>
                            </div>
                          )}
                        </div>
                      )}

                      {(law.author === player.email || isPresident) && law.status === 'draft' && (
                        <div className="flex gap-2 mt-3">
                          <Button
                            onClick={() => onDeleteLaw(law.id)}
                            variant="destructive"
                            size="sm"
                          >
                            <Icon name="Trash2" size={16} className="mr-2" />
                            Удалить
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {activeTab === 'create' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="space-y-2">
                <label className="text-sm font-medium">Название законопроекта</label>
                <input
                  type="text"
                  value={newLawTitle}
                  onChange={(e) => setNewLawTitle(e.target.value)}
                  placeholder="Например: О повышении минимальной заработной платы"
                  className="w-full p-3 rounded-lg bg-slate-800 border border-slate-600 focus:border-primary outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Категория</label>
                <div className="grid grid-cols-2 gap-2">
                  {lawCategories.map(cat => (
                    <Button
                      key={cat.id}
                      onClick={() => setNewLawCategory(cat.id)}
                      variant={newLawCategory === cat.id ? 'default' : 'outline'}
                      className="justify-start"
                    >
                      <Icon name={cat.icon} size={16} className="mr-2" />
                      {cat.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Описание законопроекта</label>
                <textarea
                  value={newLawDescription}
                  onChange={(e) => setNewLawDescription(e.target.value)}
                  placeholder="Подробное описание законопроекта, его цели и положения..."
                  rows={6}
                  className="w-full p-3 rounded-lg bg-slate-800 border border-slate-600 focus:border-primary outline-none resize-none"
                />
              </div>

              <Button onClick={handleProposeLaw} size="lg" className="w-full">
                <Icon name="Send" size={20} className="mr-2" />
                Внести законопроект на рассмотрение
              </Button>

              <Card className="bg-blue-950/30 border-blue-500/30">
                <CardContent className="pt-6">
                  <p className="text-sm text-blue-300">
                    <Icon name="Info" size={16} className="inline mr-2" />
                    Законопроект будет отправлен на голосование в Государственной Думе.
                    Для принятия требуется большинство голосов депутатов.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'president' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <Card className="bg-gradient-to-r from-blue-900/50 to-red-900/50 border-yellow-600/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Icon name="Crown" size={28} className="text-yellow-400" />
                    Президент Российской Федерации
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-red-600 flex items-center justify-center text-3xl font-bold">
                      {president ? president[0].toUpperCase() : '?'}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">
                        {president || 'Должность вакантна'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Глава государства
                      </p>
                    </div>
                  </div>

                  {isPresident && (
                    <div className="space-y-3 pt-4 border-t border-slate-700">
                      <h4 className="font-semibold">Полномочия Президента:</h4>
                      <div className="grid gap-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Icon name="Check" size={16} className="text-green-400" />
                          <span>Подписание и отклонение законов</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Icon name="Check" size={16} className="text-green-400" />
                          <span>Назначение правительства</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Icon name="Check" size={16} className="text-green-400" />
                          <span>Руководство внешней политикой</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Icon name="Check" size={16} className="text-green-400" />
                          <span>Верховное главнокомандование</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Building2" size={20} />
                    О Государственной Думе
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>
                    Государственная Дума — нижняя палата Федерального Собрания Российской Федерации.
                  </p>
                  <p>
                    Основные функции: принятие федеральных законов, утверждение бюджета,
                    контроль за деятельностью правительства.
                  </p>
                  <p className="text-muted-foreground">
                    Только депутаты могут вносить и голосовать за законопроекты.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Government;
