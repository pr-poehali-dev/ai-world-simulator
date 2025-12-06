import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

interface PhoneProps {
  player: any;
  friends: any[];
  messages: any[];
  news: any[];
  onClose: () => void;
  onSendMessage: (friendId: string, message: string) => void;
  onAddFriend: (email: string) => void;
}

const Phone = ({ player, friends, messages, news, onClose, onSendMessage, onAddFriend }: PhoneProps) => {
  const [activeApp, setActiveApp] = useState<string>('home');
  const [messageText, setMessageText] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [addFriendEmail, setAddFriendEmail] = useState('');

  const apps = [
    { id: 'friends', name: 'Друзья', icon: 'Users', color: 'bg-blue-500' },
    { id: 'messages', name: 'Сообщения', icon: 'MessageSquare', color: 'bg-green-500', badge: messages.length },
    { id: 'news', name: 'Новости', icon: 'Newspaper', color: 'bg-red-500', badge: news.length },
    { id: 'profile', name: 'Профиль', icon: 'User', color: 'bg-purple-500' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md h-[600px] bg-slate-900 border-2 border-slate-700 flex flex-col">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Icon name="Smartphone" size={24} />
              Телефон
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white">
              <Icon name="X" size={20} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4">
          {activeApp === 'home' && (
            <div className="grid grid-cols-2 gap-4">
              {apps.map(app => (
                <Button
                  key={app.id}
                  onClick={() => setActiveApp(app.id)}
                  variant="outline"
                  className="h-32 flex-col relative"
                >
                  <div className={`p-3 rounded-full ${app.color} mb-2`}>
                    <Icon name={app.icon} size={32} className="text-white" />
                  </div>
                  <span>{app.name}</span>
                  {app.badge && app.badge > 0 && (
                    <Badge className="absolute top-2 right-2 bg-red-500">
                      {app.badge}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          )}

          {activeApp === 'friends' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email друга"
                  value={addFriendEmail}
                  onChange={(e) => setAddFriendEmail(e.target.value)}
                  className="flex-1 p-2 rounded bg-slate-800 border border-slate-600 text-sm"
                />
                <Button
                  onClick={() => {
                    if (addFriendEmail) {
                      onAddFriend(addFriendEmail);
                      setAddFriendEmail('');
                    }
                  }}
                  size="sm"
                >
                  <Icon name="Plus" size={16} />
                </Button>
              </div>
              
              <div className="space-y-2">
                {friends.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    У вас пока нет друзей
                  </p>
                ) : (
                  friends.map((friend, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        {friend.name[0]}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{friend.name}</p>
                        <p className="text-xs text-muted-foreground">{friend.career}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedFriend(friend.email);
                          setActiveApp('messages');
                        }}
                      >
                        <Icon name="MessageCircle" size={16} />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeApp === 'messages' && (
            <div className="space-y-4">
              {selectedFriend ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedFriend(null)}
                    size="sm"
                  >
                    <Icon name="ArrowLeft" size={16} className="mr-2" />
                    Назад
                  </Button>
                  
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {messages
                      .filter(m => m.from === selectedFriend || m.to === selectedFriend)
                      .map((msg, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg ${
                            msg.from === player.email
                              ? 'bg-blue-600 ml-8'
                              : 'bg-slate-700 mr-8'
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p className="text-xs text-muted-foreground mt-1">{msg.time}</p>
                        </div>
                      ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Сообщение..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && messageText && selectedFriend) {
                          onSendMessage(selectedFriend, messageText);
                          setMessageText('');
                        }
                      }}
                      className="flex-1 p-2 rounded bg-slate-800 border border-slate-600 text-sm"
                    />
                    <Button
                      onClick={() => {
                        if (messageText && selectedFriend) {
                          onSendMessage(selectedFriend, messageText);
                          setMessageText('');
                        }
                      }}
                      size="sm"
                    >
                      <Icon name="Send" size={16} />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  {friends.map((friend, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setSelectedFriend(friend.email)}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mr-3">
                        {friend.name[0]}
                      </div>
                      {friend.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeApp === 'news' && (
            <div className="space-y-3">
              {news.map((item, idx) => (
                <Card key={idx} className="bg-slate-800/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-2">
                      <Badge variant="secondary">{item.category}</Badge>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeApp === 'profile' && (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-3xl font-bold">
                  {player.name[0]}
                </div>
                <h2 className="text-2xl font-bold">{player.name}</h2>
                <Badge variant="secondary">{player.career}</Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between p-3 bg-slate-800/50 rounded">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-semibold">{player.email}</span>
                </div>
                <div className="flex justify-between p-3 bg-slate-800/50 rounded">
                  <span className="text-muted-foreground">Баланс</span>
                  <span className="font-semibold text-green-400">
                    {player.balance.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-slate-800/50 rounded">
                  <span className="text-muted-foreground">Уровень</span>
                  <span className="font-semibold">{player.level}</span>
                </div>
                <div className="flex justify-between p-3 bg-slate-800/50 rounded">
                  <span className="text-muted-foreground">Репутация</span>
                  <span className="font-semibold">{player.reputation}%</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {activeApp !== 'home' && (
          <div className="p-4 border-t border-slate-700 flex-shrink-0">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setActiveApp('home')}
            >
              <Icon name="Home" size={16} className="mr-2" />
              На главную
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Phone;
