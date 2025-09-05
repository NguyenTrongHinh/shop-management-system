import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function RedirectToAdmin() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  return <div className="min-h-screen flex items-center justify-center">Redirecting...</div>;
}