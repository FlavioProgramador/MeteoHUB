import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { PrivateRoute } from '../Components/PrivateRoute/PrivateRoute';
import { AuthContext } from '../Contexts/AuthContext';

function renderWithAuth(contextValue: any) {
  return render(
    <AuthContext.Provider value={contextValue}>
      <BrowserRouter>
        <PrivateRoute>
          <div>Protected Content</div>
        </PrivateRoute>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

describe('PrivateRoute', () => {
  it('redirects to /login when not authenticated', () => {
    renderWithAuth({ isAuthenticated: false, loading: false });
    expect(window.location.pathname).toBe('/login');
  });

  it('renders children when authenticated', () => {
    renderWithAuth({ isAuthenticated: true, loading: false });
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('shows loading state while checking auth', () => {
    renderWithAuth({ isAuthenticated: false, loading: true });
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });
});
