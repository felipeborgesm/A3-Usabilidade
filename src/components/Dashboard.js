import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  CreditCard, 
  Send, 
  History, 
  Settings, 
  Eye, 
  EyeOff,
  ArrowUpRight,
  Shield,
  Bell,
  User
} from 'lucide-react';
import { formatCurrency, mockTransactions } from '../mock';

const Dashboard = ({ user, onNavigate, onLogout }) => {
  const [showBalance, setShowBalance] = React.useState(true);
  
  const quickActions = [
    {
      icon: Send,
      title: 'Nova Transferência PIX',
      description: 'Enviar dinheiro instantâneo',
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => onNavigate('transfer')
    },
    {
      icon: History, 
      title: 'Histórico',
      description: 'Ver todas as operações',
      color: 'bg-green-600 hover:bg-green-700',
      action: () => onNavigate('history')
    },
    {
      icon: Settings,
      title: 'Configurações',
      description: 'Ajustes e preferências', 
      color: 'bg-gray-600 hover:bg-gray-700',
      action: () => {}
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">PIX Inteligente</h1>
                <p className="text-sm text-gray-600">Olá, {user.name.split(' ')[0]}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Balance Card */}
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-medium text-blue-100">
                  Saldo disponível
                </CardTitle>
                <div className="flex items-center space-x-3 mt-2">
                  <span className="text-3xl font-bold">
                    {showBalance ? formatCurrency(user.balance) : '••••••'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-white hover:bg-white/20"
                  >
                    {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <CreditCard className="w-12 h-12 text-blue-200" />
            </div>
          </CardHeader>
        </Card>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações rápidas</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card 
                  key={index}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                  onClick={action.action}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center transition-colors`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {action.description}
                        </p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Atividade recente</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('history')}
              className="text-blue-600 hover:text-blue-700"
            >
              Ver tudo
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {mockTransactions.sort((a, b) => b.date - a.date).map((activity, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.type === 'received' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <ArrowUpRight className={`w-4 h-4 transform ${
                            activity.type === 'received' ? 'rotate-180 text-green-600' : 'text-red-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {activity.type === 'received' ? `Recebido de ${activity.from}` : `Enviado para ${activity.recipient}`}
                          </p>
                          <p className="text-sm text-gray-600">{new Date().getHours() - activity.date.getHours()}h atrás</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          activity.type === 'received' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {activity.type === 'received' ? '+' : ''}{formatCurrency(activity.amount)}
                        </p>
                        <Badge variant="secondary" className="text-xs mt-1">
                          PIX
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Sua conta está protegida
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Sistema de detecção de fraudes ativo • Últimas 24h: {mockTransactions.filter(el => el.alertType && el.date > new Date(Date.now() - 24 * 60 * 60 * 1000)).length} alertas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;