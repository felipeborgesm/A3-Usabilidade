import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  AlertTriangle, 
  CheckCircle,
  Filter,
  Calendar,
  Search
} from 'lucide-react';
import { formatCurrency, mockTransactions } from '../mock';

const History = ({ onBack }) => {
  const [filter, setFilter] = useState('all'); // all, alerts, normal
  const [transactions] = useState(mockTransactions);

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'alerts') return transaction.alertType !== null;
    if (filter === 'normal') return transaction.alertType === null;
    return true;
  });

  const getStatusIcon = (transaction) => {
    if (transaction.alertType) {
      return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    }
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  const getStatusBadge = (transaction) => {
    if (transaction.alertType) {
      return (
        <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
          ⚠ Suspeito
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
        ✓ Normal
      </Badge>
    );
  };

  const getAlertTypeLabel = (alertType) => {
    const labels = {
      full_balance: 'Transferência total do saldo',
      unusual_hours: 'Horário incomum',
      suspicious_account: 'Conta suspeita',
      new_device: 'Novo dispositivo',
      multiple_transfers: 'Múltiplas transferências'
    };
    return labels[alertType] || alertType;
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getTransactionIcon = (amount) => {
    return amount > 0 ? (
      <ArrowUpRight className="w-4 h-4 text-green-600 transform rotate-180" />
    ) : (
      <ArrowUpRight className="w-4 h-4 text-red-600" />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Histórico de Operações</h1>
                <p className="text-sm text-gray-600">Todas as suas transferências PIX</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Filtrar por:</span>
                </div>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as operações</SelectItem>
                    <SelectItem value="alerts">Apenas suspeitas</SelectItem>
                    <SelectItem value="normal">Apenas normais</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="text-sm text-gray-600">
                {filteredTransactions.length} operação(ões) encontrada(s)
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Normais</p>
                  <p className="text-xl font-bold text-gray-900">
                    {transactions.filter(t => !t.alertType).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">Suspeitas</p>
                  <p className="text-xl font-bold text-gray-900">
                    {transactions.filter(t => t.alertType).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Últimos 7 dias</p>
                  <p className="text-xl font-bold text-gray-900">{transactions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle>Extrato de operações</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredTransactions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhuma operação encontrada com os filtros selecionados.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          {getTransactionIcon(transaction.amount)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="font-medium text-gray-900">
                              Enviado para {transaction.recipient}
                            </p>
                            {getStatusIcon(transaction)}
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600">
                              Chave: {transaction.recipientKey}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(transaction.date)}
                            </p>
                            
                            {transaction.alertType && (
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs text-orange-600 border-orange-200 bg-orange-50">
                                  {getAlertTypeLabel(transaction.alertType)}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-1">
                        <p className="font-bold text-lg text-red-600">
                          -{formatCurrency(transaction.amount)}
                        </p>
                        {getStatusBadge(transaction)}
                      </div>
                    </div>
                    
                    {transaction.alertMessage && (
                      <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-sm text-orange-800">
                          <strong>Motivo do alerta:</strong> {transaction.alertMessage}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default History;