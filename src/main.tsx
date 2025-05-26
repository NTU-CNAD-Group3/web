import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/provider/theme-provider';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from './components/external-ui/toaster';

import ConfirmEmail from '@/routes/confirm-email';
import ErrorPage from '@/error-page';
import HomePage from '@/routes/homepage';
import LoginPage from '@/routes/login';
import ForgetPassword from '@/routes/forget-password';
import ChangePasswordPage from './routes/change-password';
import Signup from '@/routes/signup';
import ForgetPasswordConfirm from '@/routes/forget-password-confirm';
import ChangePasswordConfirm from '@/routes/change-password-confirm';
import Layout from '@/layout';

import DataCenters from '@/routes/datacenters/page';
import AddDataCenter from '@/routes/datacenters/add/page';
import Expand from '@/routes/expand/page';
import Search from '@/routes/search/page';
import Dashboard from '@/routes/dashboard/page';
import Import from '@/routes/import/page';
import BLayout from '@/layout-b';
import RoomDetail from '@/components/RoomDetail';
import UserDataPage from '@/routes/userData/page';
import RoomDetailUser from './components/RoomDetailUser';
import './index.css';

import { ApiProvider } from '@/contexts/api-context';

const pageTransition = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 },
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }}>
                <HomePage />
              </motion.div>
            }
          />
          <Route
            path="login"
            element={
              <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }}>
                <LoginPage />
              </motion.div>
            }
          />
          <Route
            path="forget_password"
            element={
              <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }}>
                <ForgetPassword />
              </motion.div>
            }
          />
          <Route
            path="change_password"
            element={
              <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }}>
                <ChangePasswordPage />
              </motion.div>
            }
          />
          <Route
            path="signup"
            element={
              <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }}>
                <Signup />
              </motion.div>
            }
          />
          <Route
            path="confirm_email"
            element={
              <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }}>
                <ConfirmEmail />
              </motion.div>
            }
          />
          <Route
            path="forget_password_confirm"
            element={
              <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }}>
                <ForgetPasswordConfirm />
              </motion.div>
            }
          />
          <Route
            path="change_password_confirm"
            element={
              <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }}>
                <ChangePasswordConfirm />
              </motion.div>
            }
          />
          <Route
            path="*"
            element={
              <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }}>
                <ErrorPage />
              </motion.div>
            }
          />
        </Route>
        <Route element={<BLayout />}>
          <Route path="/datacenters" element={<DataCenters />} />
          <Route path="/datacenters/add" element={<AddDataCenter />} />
          <Route path="/expand" element={<Expand />} />
          <Route path="/search" element={<Search />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/import" element={<Import />} />
          <Route path="/room/:fabName/:roomId" element={<RoomDetail />} />
          <Route path="/room/:fabId/:fabName/:roomId" element={<RoomDetailUser />} />
          <Route path="/user-datacenter" element={<UserDataPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <ApiProvider>
        <Router>
          <AnimatedRoutes />
        </Router>
        <Toaster />
      </ApiProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
