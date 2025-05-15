import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import StudentPage from '../pages/StudentPage';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import Navbar from '../components/Navbar';
import BookPage from '../pages/BookPage';
import AuthorPage from '../pages/AuthorPage';
import IssuingPage from '../pages/IssuingPage';
import TransactionPage from '../pages/TransactionPage';
import faviconUrl from '../assets/TabBook.png?url';
import { ToastContainer } from 'react-toastify';
import { setFavicon } from '../services/favicon/service';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import { store } from '../store';
import { validateTokens } from '../store/slices/authSlice';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';

setFavicon({ href: faviconUrl });

interface AuthRouteProps {
  type: 'public' | 'protected';
}

const AuthRoute: React.FC<AuthRouteProps> = ({ type }) => {
  const dispatch = useAppDispatch();
  const { tokens } = useAppSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      await dispatch(validateTokens());
      setIsChecking(false);
    };
    verifyToken();
  }, [location, dispatch]);

  if (isChecking) return <div>Loading...</div>;

  if (type === 'protected' && !tokens) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (type === 'public' && tokens) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

const AppLayout: React.FC = () => {
  const { tokens } = useAppSelector((state) => state.auth);
  const location = useLocation();

  const showNavbar = tokens && location.pathname !== '/';

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route element={<AuthRoute type="public" />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={<AuthRoute type="protected" />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/student" element={<StudentPage />} />
          <Route path="/book" element={<BookPage />} />
          <Route path="/author" element={<AuthorPage />} />
          <Route path="/issue" element={<IssuingPage />} />
          <Route path="/transaction-view" element={<TransactionPage />} />
        </Route>
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Router>
        <AppLayout />
      </Router>
    </Provider>
  );
};

export default App;