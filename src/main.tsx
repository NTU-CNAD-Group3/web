import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/provider/theme-provider';
import { AnimatePresence, motion } from 'framer-motion';

import ConfirmEmail from '@/routes/confirm-email';
import ErrorPage from '@/error-page';
import HomePage from '@/routes/homepage';
import LoginPage from '@/routes/login';
import ForgetPassword from '@/routes/forget-password';
import ChangePasswordPage from './routes/change-password';
import Signup from '@/routes/signup';
import ForgetPasswordConfirm from '@/routes/forget-password-confirm';
import ChangePasswordConfirm from '@/routes/change-password-confirm';
import LoginStat from '@/routes/login-stat';
import Layout from '@/layout';
import InteractiveTable from './components/InteractiveTable';

import './index.css';

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
            path="main"
            element={
              <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }}>
                <LoginStat />
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
      </Routes>
    </AnimatePresence>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <AnimatedRoutes />
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
);
