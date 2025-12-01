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
  '111.111.111-11', 
  '999.888.777-66',
  '123.456.789-00',

  '11999888777',
  '21996665544',

  'suspeito@email.com',
  'ganhe_dinheiro@tempmail.com',
  'urubudopix@gmail.com',
  'suporte.seguranca@bancofalso.com',

  'a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890'
];

// Fraud detection functions
export const detectFraudAlerts = (transferData, userBalance, recentTransactions) => {
  const alerts = [];
  const amount = parseFloat(transferData.amount);
  const currentHour = new Date().getHours();
    
  // Calcula média de transações passadas (se houver histórico)
  const averageTransaction = recentTransactions.length > 0
    ? recentTransactions.reduce((acc, curr) => acc + curr.amount, 0) / recentTransactions.length
    : 0;

  const isRoundNumber = amount > 500 && amount % 50 === 0;


  if (amount >= userBalance * 0.95) {
    alerts.push({
      alertType: 'full_balance',
      level: 'critical',
      message: 'Atenção: Transferência de quase a totalidade do saldo. Confirme se é você mesmo.',
      color: 'red'
    });
  }

  const isNightTime = currentHour >= 20 || currentHour <= 6;
  if (isNightTime && amount > 1000) {
    alerts.push({
      alertType: 'night_limit',
      level: 'warning',
      message: 'Segurança: Transações de alto valor fora do horário comercial (20h às 06h) estão sujeitas a limites reduzidos.',
      color: 'orange'
    });
  }

  const cleanKey = transferData.recipientKey.replace(/[^\w@.]/g, ''); 
  const isBlacklisted = mockSuspiciousAccounts.some(acc => 
    acc.replace(/[^\w@.]/g, '') === cleanKey
  );

  if (isBlacklisted) {
    alerts.push({
      alertType: 'suspicious_account',
      level: 'critical',
      message: 'ALERTA DE SEGURANÇA: Esta chave Pix foi associada a denúncias de fraude anteriormente.',
      color: 'red'
    });
  }

  if (averageTransaction > 0 && amount > averageTransaction * 5) {
    alerts.push({
      alertType: 'profile_deviation',
      level: 'attention',
      message: `Valor atípico detectado. Esta transferência é muito superior à sua média habitual (R$ ${averageTransaction.toFixed(2)}).`,
      color: 'yellow'
    });
  }

  const recentTransfers = recentTransactions.filter(t => {
    const timeDiff = Date.now() - new Date(t.date).getTime();
    return timeDiff < 15 * 60 * 1000;
  });

  if (recentTransfers.length >= 1) {
    const sameRecipient = recentTransfers.filter(t => t.recipientKey === transferData.recipientKey);
    if (sameRecipient.length >= 1) {
       alerts.push({
        alertType: 'duplicate_transfer',
        level: 'warning',
        message: 'Possível duplicidade: Você já enviou dinheiro para este destinatário nos últimos minutos.',
        color: 'orange'
      });
    } else {
       alerts.push({
        alertType: 'high_frequency',
        level: 'attention',
        message: 'Alta frequência de transações detectada em curto intervalo.',
        color: 'yellow'
      });
    }
  }

  if (isRoundNumber && recentTransactions.length < 5) {
     alerts.push({
      alertType: 'social_engineering',
      level: 'attention',
      message: 'Dica de segurança: Golpistas costumam solicitar valores "fechados". Confirme a veracidade do destinatário.',
      color: 'blue'
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