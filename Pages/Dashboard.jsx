import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Kanban from './Kambam';

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se existe token
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return <Kanban />;
}
