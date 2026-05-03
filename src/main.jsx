import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  RouterProvider,
} from "react-router-dom";
import { router } from './Routes/Routes';


import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthProvider from './Providers/AuthProvider';
import LoadingScreen from './components/Loading/LoadingScreen';
import SmoothCursor from './components/ui/SmoothCursor';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,    // 5 min — data is fresh, no refetch on navigation
      gcTime:    1000 * 60 * 15,   // 15 min — keep unused data in memory
      refetchOnWindowFocus: false,  // Don't refetch when switching tabs
      retry: 1,                    // Only retry failed requests once
    },
  },
});

const App = () => {
  return (
    <AuthProvider>
      <div>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ToastContainer position="top-center" autoClose={3000} />
        </QueryClientProvider>
      </div>
    </AuthProvider>
  );
};


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);