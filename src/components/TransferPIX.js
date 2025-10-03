import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  ArrowLeft, 
  Send, 
  AlertTriangle, 
  Lock,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { formatCurrency, detectFraudAlerts, mockTransactions } from '../mock';

const TransferPIX = ({ user, onBack, onTransferComplete }) => {
  const [step, setStep] = useState(1); // 1: form, 2: alerts, 3: auth, 4: success
  const [formData, setFormData] = useState({
    recipientName: '',
    keyType: 'cpf',
    recipientKey: '', 
    amount: ''
  });
  const [alerts, setAlerts] = useState([]);
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const keyTypes = [
    { value: 'cpf', label: 'CPF' },
    { value: 'email', label: 'E-mail' },
    { value: 'phone', label: 'Telefone' },
    { value: 'random', label: 'Chave aleatória' }
  ];

  const formatKey = (value, type) => {
    const numbers = value.replace(/\D/g, '');
    switch(type) {
      case 'cpf':
        return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      case 'phone':
        return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      default:
        return value;
    }
  };

  const handleKeyChange = (e) => {
    const formatted = formatKey(e.target.value, formData.keyType);
    setFormData({ ...formData, recipientKey: formatted });
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = (parseFloat(value) / 100).toFixed(2);
    setFormData({ ...formData, amount: formatted });
  };

  const validateForm = () => {
    if (!formData.recipientName.trim()) return 'Nome do destinatário é obrigatório';
    if (!formData.recipientKey.trim()) return 'Chave PIX é obrigatória';
    if (!formData.amount || parseFloat(formData.amount) <= 0) return 'Valor deve ser maior que zero';
    if (parseFloat(formData.amount) > user.balance) return 'Saldo insuficiente';
    return null;
  };

  const handleContinue = () => {
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    // Check for fraud alerts
    const transferData = {
      amount: parseFloat(formData.amount),
      recipientKey: formData.recipientKey
    };
    
    const detectedAlerts = detectFraudAlerts(transferData, user.balance, mockTransactions);
    
    if (detectedAlerts.length > 0) {
      setAlerts(detectedAlerts);
      setStep(2);
    } else {
      // No alerts, proceed to auth
      setStep(3);
    }
  };

  const handleProceedWithAlerts = () => {
    setStep(3);
  };

  const handleAuth = async () => {
    if (!authPassword) {
      setAuthError('Digite sua senha');
      return;
    }

    setIsProcessing(true);
    setAuthError('');
    
    // Simulate auth
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (authPassword === '123456') {
      setStep(4);
      // Add to mock transactions
      const newTransaction = {
        id: Date.now().toString(),
        date: new Date(),
        recipient: formData.recipientName,
        recipientKey: formData.recipientKey, 
        amount: parseFloat(formData.amount),
        status: 'completed',
        alertType: alerts.length > 0 ? alerts[0].type : null,
        alertMessage: alerts.length > 0 ? alerts[0].message : null
      };
      mockTransactions.unshift(newTransaction);

      setTimeout(() => {
        onTransferComplete && onTransferComplete(newTransaction);
      }, 3000);
    } else {
      setAuthError('Senha incorreta');
    }
    
    setIsProcessing(false);
  };

  const getAlertIcon = (level) => {
    switch(level) {
      case 'critical': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'attention': return <Clock className="w-5 h-5 text-yellow-500" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getAlertBgColor = (level) => {
    switch(level) {
      case 'critical': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-orange-50 border-orange-200';
      case 'attention': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  if (step === 4) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Transferência realizada!</h2>
            <p className="text-gray-600 mb-6">
              {formatCurrency(parseFloat(formData.amount))} foi enviado para {formData.recipientName}
            </p>
            <Button onClick={onBack} className="w-full">
              Voltar ao início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Nova Transferência PIX</h1>
              <p className="text-sm text-gray-600">Envio rápido e seguro</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Dados da transferência</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="recipientName">Nome do destinatário</Label>
                <Input
                  id="recipientName"
                  placeholder="Digite o nome completo"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                  className="h-12"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de chave</Label>
                  <Select value={formData.keyType} onValueChange={(value) => setFormData({...formData, keyType: value, recipientKey: ''})}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {keyTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipientKey">Chave PIX</Label>
                  <Input
                    id="recipientKey"
                    placeholder={formData.keyType === 'email' ? 'email@exemplo.com' : 
                               formData.keyType === 'cpf' ? '000.000.000-00' :
                               formData.keyType === 'phone' ? '(11) 99999-9999' :
                               'Chave aleatória'}
                    value={formData.recipientKey}
                    onChange={handleKeyChange}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Valor</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                  <Input
                    id="amount"
                    placeholder="0,00"
                    value={formData.amount}
                    onChange={handleAmountChange}
                    className="h-12 pl-12 text-right"
                  />
                </div>
                <p className="text-sm text-gray-600">
                  Saldo disponível: {formatCurrency(user.balance)}
                </p>
              </div>

              <Button onClick={handleContinue} className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                <Send className="w-4 h-4 mr-2" />
                Continuar
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <span>Atenção - Alertas detectados</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {alerts.map((alert, index) => (
                  <Alert key={index} className={getAlertBgColor(alert.level)}>
                    <div className="flex items-start space-x-3">
                      {getAlertIcon(alert.level)}
                      <AlertDescription className="flex-1">
                        {alert.message}
                      </AlertDescription>
                    </div>
                  </Alert>
                ))}
                
                <div className="pt-4 space-y-3">
                  <Button 
                    onClick={handleProceedWithAlerts} 
                    className="w-full bg-orange-600 hover:bg-orange-700"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Confirmar mesmo assim
                  </Button>
                  <Button variant="outline" onClick={() => setStep(1)} className="w-full">
                    Revisar dados
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-blue-600" />
                <span>Confirme a transação</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Destinatário:</span>
                  <span className="font-medium">{formData.recipientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valor:</span>
                  <span className="font-bold text-lg">{formatCurrency(parseFloat(formData.amount))}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="authPassword">Digite sua senha para confirmar</Label>
                <Input
                  id="authPassword"
                  type="password"
                  placeholder="Senha de 6 dígitos"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="h-12"
                  maxLength={6}
                />
                {authError && (
                  <p className="text-sm text-red-600">{authError}</p>
                )}
              </div>

              <Button 
                onClick={handleAuth}
                disabled={isProcessing}
                className="w-full h-12 bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processando...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirmar transferência</span>
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TransferPIX;