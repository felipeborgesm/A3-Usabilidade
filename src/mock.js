// Mock data for PIX Simulator

export const mockUser = {
  id: '1',
  name: 'João Silva',
  cpf: '123.456.789-00',
  email: 'joao.silva@email.com',
  balance: 15000,
  lastLogin: new Date(),
  usualHours: { start: 9, end: 18 },
  trustedDevice: true
};

export const mockTransactions = [
  {
    id: '1',
    date: new Date('2025-01-15T14:30:00'),
    recipient: 'Maria Santos',
    recipientKey: 'maria.santos@email.com',
    amount: 150.00,
    status: 'completed',
    alertType: null,
    alertMessage: null
  },
  {
    id: '2', 
    date: new Date('2025-01-14T03:15:00'),
    recipient: 'Pedro Costa',
    recipientKey: '11987654321',
    amount: 800.00,
    status: 'completed',
    alertType: 'unusual_hours',
    alertMessage: 'Operação fora do horário usual detectada'
  },
  {
    id: '3',
    date: new Date('2025-01-13T16:45:00'),
    recipient: 'Ana Oliveira',
    recipientKey: '987.654.321-00',
    amount: 2500.75,
    status: 'completed',
    alertType: 'full_balance',
    alertMessage: 'Transferência de 100% do saldo disponível'
  }
];

export const mockSuspiciousAccounts = [
  '11999888777',
  'suspeito@email.com',
  '999.888.777-66'
];

// Fraud detection functions
export const detectFraudAlerts = (transferData, userBalance, recentTransactions) => {
  const alerts = [];
  const currentHour = new Date().getHours();
  
  // 1. 100% balance transfer
  if (transferData.amount >= userBalance) {
    alerts.push({
      type: 'full_balance',
      level: 'critical',
      message: 'Atenção: Você está tentando transferir todo o seu saldo, o que pode indicar tentativa de esvaziar a conta rapidamente.',
      color: 'red'
    });
  }
  
  // 2. Unusual hours (outside 9-18)
  if (currentHour < 9 || currentHour > 18) {
    alerts.push({
      type: 'unusual_hours',
      level: 'warning',
      message: 'Operação fora do horário usual detectada. Confirme se você realmente deseja prosseguir.',
      color: 'orange'
    });
  }
  
  // 3. Suspicious recipient
  if (mockSuspiciousAccounts.includes(transferData.recipientKey)) {
    alerts.push({
      type: 'suspicious_account',
      level: 'critical',
      message: 'Alerta: Esta conta destinatária possui registros de suspeita ou bloqueios anteriores.',
      color: 'red'
    });
  }
  
  // 4. New device (simulated)
  if (!mockUser.trustedDevice) {
    alerts.push({
      type: 'new_device',
      level: 'critical', 
      message: 'Detectamos acesso de um novo dispositivo/localização. Essa operação pode ser arriscada.',
      color: 'red'
    });
  }
  
  // 5. Multiple small transfers
  const recentTransfersCount = recentTransactions.filter(t => {
    const timeDiff = Date.now() - new Date(t.date).getTime();
    return timeDiff < 10 * 60 * 1000; // 10 minutes
  }).length;
  
  if (recentTransfersCount >= 3 && transferData.amount < 200) {
    alerts.push({
      type: 'multiple_transfers',
      level: 'attention',
      message: 'Possível tentativa de fracionamento detectada: várias transferências seguidas em curto intervalo de tempo.',
      color: 'yellow'
    });
  }
  
  return alerts;
};

export const simulateLogin = (cpf, password) => {
  // Simple mock validation
  if (cpf === '123.456.789-00' && password === '123456') {
    return { success: true, user: mockUser };
  }
  return { success: false, message: 'CPF ou senha incorretos' };
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatCPF = (cpf) => {
  return cpf.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const formatPhone = (phone) => {
  return phone.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};