import { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NetworkErrorFallback } from './components/NetworkErrorFallback';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { POSTerminal } from './pages/POSTerminal';
import { Inventory } from './pages/Inventory';
import { Transfers } from './pages/Transfers';
import { Reports } from './pages/Reports';
import { Users } from './pages/Users';
import { Settings } from './pages/Settings';
import { SetupPage } from './pages/SetupPage';
import { Expenses } from './pages/Expenses';
import { ShortDated } from './pages/ShortDated';
import { Returns } from './pages/Returns';
import { ReturnHistory } from './pages/ReturnHistory';
import { Warehouses } from './pages/Warehouses';
import { WarehouseInventory } from './pages/WarehouseInventory';
import { Suppliers } from './pages/Suppliers';
import AdminPanel from './pages/AdminPanel';
import SuperAdminPanel from './pages/SuperAdminPanel';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { BillingCycle } from './pages/BillingCycle';
import { SubscriptionPlans } from './pages/SubscriptionPlans';
import ProductHistory from './pages/ProductHistory';
import { PaymentVerification } from './pages/PaymentVerification';
import { SubscriptionExpiredOverlay } from './components/SubscriptionExpiredOverlay';
import { getBranches, getWarehouses } from './lib/api-supabase';

export type Page = 
  | 'login' 
  | 'setup' 
  | 'dashboard'
  | 'pos' 
  | 'inventory' 
  | 'transfers' 
  | 'reports' 
  | 'users' 
  | 'settings'
  | 'expenses'
  | 'short-dated'
  | 'returns'
  | 'return-history'
  | 'warehouses'
  | 'warehouse-inventory'
  | 'suppliers'
  | 'admin'
  | 'super-admin'
  | 'forgot-password'
  | 'reset-password'
  | 'billing-cycle'
  | 'subscription-plans'
  | 'product-history'
  | 'payment-verification';

export interface AppState {
  userId: string | null;
  orgId: string | null;
  userRole: string | null;
  userEmail: string | null;
  userName: string | null;
  branchId: string | null;
  warehouseId: string | null;
  contextType: 'branch' | 'warehouse' | null;
  contextId: string | null;
  isSubscriptionExpired?: boolean;
  subscriptionPlan?: string | null;
  subscriptionStatus?: 'trial' | 'active' | 'expired' | null;
  trialStartDate?: string | null;
  currentBranchId?: string | null;
  currentWarehouseId?: string | null;
  companyName?: string;
  user?: { name: string; email: string };
  branches?: any[];
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [appState, setAppState] = useState<AppState>({
    userId: null,
    orgId: null,
    userRole: null,
    userEmail: null,
    userName: null,
    branchId: null,
    warehouseId: null,
    contextType: null,
    contextId: null,
    isSubscriptionExpired: false,
    subscriptionPlan: null,
    subscriptionStatus: null,
    trialStartDate: null,
  });
  const [networkError, setNetworkError] = useState(false);

  // Check URL for reset password token
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const accessToken = urlParams.get('access_token');
    
    if (type === 'recovery' && accessToken) {
      setCurrentPage('reset-password');
    }
  }, []);

  // Load session from localStorage
  useEffect(() => {
    const savedSession = localStorage.getItem('shopEasySession');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        
        // Check if session has required subscription fields
        // If not, it's an old session - clear it and require re-login
        if (session.subscriptionPlan === undefined || session.subscriptionStatus === undefined) {
          console.log('⚠️ Old session detected, clearing...');
          localStorage.removeItem('shopEasySession');
          return;
        }
        
        setAppState(session);
        setCurrentPage('dashboard');
      } catch (error) {
        console.error('Failed to parse saved session:', error);
        localStorage.removeItem('shopEasySession');
      }
    }
  }, []);

  const handleLoginSuccess = async (
    userId: string,
    orgId: string,
    userRole: string,
    userEmail: string,
    userName: string,
    userBranchId: string | null,
    userWarehouseId?: string | null,
    subscriptionPlan?: string | null,
    subscriptionStatus?: 'trial' | 'active' | 'expired' | null,
    trialStartDate?: string | null
  ) => {
    const newAppState: AppState = {
      userId,
      orgId,
      userRole,
      userEmail,
      userName,
      branchId: userBranchId,
      warehouseId: userWarehouseId || null,
      contextType: userBranchId ? 'branch' : (userWarehouseId ? 'warehouse' : null),
      contextId: userBranchId || userWarehouseId || null,
      isSubscriptionExpired: subscriptionStatus === 'expired',
      subscriptionPlan,
      subscriptionStatus,
      trialStartDate,
    };
    
    setAppState(newAppState);
    localStorage.setItem('shopEasySession', JSON.stringify(newAppState));
    
    // Check if organization needs setup (only for owners without branches)
    if (userRole === 'owner' && !userBranchId && !userWarehouseId) {
      try {
        // Check if organization has any branches or warehouses
        const [branches, warehouses] = await Promise.all([
          getBranches(orgId),
          getWarehouses(orgId)
        ]);
        
        if (branches.length === 0 && warehouses.length === 0) {
          // No branches or warehouses exist, go to setup
          setCurrentPage('setup');
        } else {
          // Organization has branches/warehouses, owner just isn't assigned to one
          // This is OK for owners who manage multiple locations
          setCurrentPage('dashboard');
        }
      } catch (error) {
        console.error('Error checking organization setup:', error);
        // On error, assume setup is needed
        setCurrentPage('setup');
      }
    } else {
      setCurrentPage('dashboard');
    }
  };

  const handleSignUp = () => {
    // In a real app, navigate to signup page
    console.log('Navigate to signup');
  };

  const handleForgotPassword = () => {
    setCurrentPage('forgot-password');
  };

  const handleLogout = () => {
    localStorage.removeItem('shopEasySession');
    setAppState({
      userId: null,
      orgId: null,
      userRole: null,
      userEmail: null,
      userName: null,
      branchId: null,
      warehouseId: null,
      contextType: null,
      contextId: null,
      isSubscriptionExpired: false,
    });
    setCurrentPage('login');
  };

  const updateAppState = (updates: Partial<AppState>) => {
    const newAppState = { ...appState, ...updates };
    setAppState(newAppState);
    localStorage.setItem('shopEasySession', JSON.stringify(newAppState));
  };

  const handleNavigate = (page: Page) => {
    if (page === 'login') {
      handleLogout();
    } else {
      setCurrentPage(page);
    }
  };

  // Handle network errors
  const handleRetry = () => {
    setNetworkError(false);
    window.location.reload();
  };

  if (networkError) {
    return <NetworkErrorFallback onRetry={handleRetry} />;
  }

  let content;

  switch (currentPage) {
    case 'login':
      content = (
        <LoginPage
          onSuccess={handleLoginSuccess}
          onSignUp={handleSignUp}
          onForgotPassword={handleForgotPassword}
        />
      );
      break;

    case 'forgot-password':
      content = (
        <ForgotPassword
          onBack={() => setCurrentPage('login')}
        />
      );
      break;

    case 'reset-password':
      content = (
        <ResetPassword
          onSuccess={() => setCurrentPage('login')}
        />
      );
      break;

    case 'setup':
      content = (
        <SetupPage
          appState={appState}
          updateAppState={updateAppState}
          onComplete={() => setCurrentPage('dashboard')}
        />
      );
      break;

    case 'dashboard':
      content = (
        <Dashboard
          appState={appState}
          onNavigate={handleNavigate}
          updateAppState={updateAppState}
        />
      );
      break;

    case 'pos':
      content = (
        <POSTerminal
          appState={appState}
          onBack={() => setCurrentPage('dashboard')}
        />
      );
      break;

    case 'inventory':
      content = (
        <Inventory
          appState={appState}
          onBack={() => setCurrentPage('dashboard')}
        />
      );
      break;

    case 'transfers':
      content = (
        <Transfers
          appState={appState}
          onBack={() => setCurrentPage('dashboard')}
        />
      );
      break;

    case 'reports':
      content = (
        <Reports
          appState={appState}
          onBack={() => setCurrentPage('dashboard')}
        />
      );
      break;

    case 'users':
      content = (
        <Users
          appState={appState}
          onBack={() => setCurrentPage('dashboard')}
        />
      );
      break;

    case 'settings':
      content = (
        <Settings
          appState={appState}
          onBack={() => setCurrentPage('dashboard')}
          onNavigate={handleNavigate}
        />
      );
      break;

    case 'expenses':
      content = (
        <Expenses
          appState={appState}
          onBack={() => setCurrentPage('dashboard')}
        />
      );
      break;

    case 'short-dated':
      content = (
        <ShortDated
          appState={appState}
          onBack={() => setCurrentPage('dashboard')}
        />
      );
      break;

    case 'returns':
      content = (
        <Returns
          appState={appState}
          onBack={() => setCurrentPage('dashboard')}
        />
      );
      break;

    case 'return-history':
      content = (
        <ReturnHistory
          appState={appState}
          onBack={() => setCurrentPage('dashboard')}
        />
      );
      break;

    case 'warehouses':
      content = (
        <Warehouses
          appState={appState}
          onBack={() => setCurrentPage('dashboard')}
        />
      );
      break;

    case 'warehouse-inventory':
      content = (
        <WarehouseInventory
          appState={appState}
          onBack={() => setCurrentPage('dashboard')}
        />
      );
      break;

    case 'suppliers':
      content = (
        <Suppliers
          appState={appState}
          onBack={() => setCurrentPage('dashboard')}
        />
      );
      break;

    case 'admin':
      content = (
        <AdminPanel
          appState={appState}
          onBack={() => setCurrentPage('dashboard')}
        />
      );
      break;

    case 'super-admin':
      content = (
        <SuperAdminPanel
          onBack={() => setCurrentPage('dashboard')}
        />
      );
      break;

    case 'billing-cycle':
      content = (
        <BillingCycle
          appState={appState}
          onBack={() => setCurrentPage('dashboard')}
        />
      );
      break;

    case 'subscription-plans':
      content = (
        <SubscriptionPlans
          appState={appState}
          onBack={() => setCurrentPage('settings')}
        />
      );
      break;

    case 'product-history':
      content = (
        <ProductHistory
          appState={appState}
          onBack={() => setCurrentPage('dashboard')}
        />
      );
      break;

    case 'payment-verification':
      content = (
        <PaymentVerification
          appState={appState}
          onBack={() => setCurrentPage('dashboard')}
        />
      );
      break;

    default:
      content = <div>Page not found</div>;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground">
        {content}
        {appState.isSubscriptionExpired && (
          <SubscriptionExpiredOverlay
            userRole={appState.userRole || ''}
            onNavigate={handleNavigate}
          />
        )}
        <Toaster />
      </div>
    </ErrorBoundary>
  );
}

export default App;