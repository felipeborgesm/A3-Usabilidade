import React, { useState, useEffect } from "react";
import "./App.css";
import { Toaster } from "./components/ui/toaster";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import TransferPIX from "./components/TransferPIX";
import History from "./components/History";

function App() {
  const [currentView, setCurrentView] = useState('login'); // login, dashboard, transfer, history
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('login');
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const handleTransferComplete = (transaction) => {
    // Update user balance (mock)
    if (user) {
      setUser({
        ...user,
        balance: user.balance - transaction.amount
      });
    }
    // Redirect to dashboard after delay
    setTimeout(() => {
      setCurrentView('dashboard');
    }, 2000);
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        return <Login onLogin={handleLogin} />;
      case 'dashboard':
        return (
          <Dashboard 
            user={user} 
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case 'transfer':
        return (
          <TransferPIX 
            user={user}
            onBack={handleBackToDashboard}
            onTransferComplete={handleTransferComplete}
          />
        );
      case 'history':
        return (
          <History 
            onBack={handleBackToDashboard}
          />
        );
      default:
        return <Login onLogin={handleLogin} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentView()}
      <Toaster />
    </div>
  );
}

export default App;
