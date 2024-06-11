import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth0 } from "@auth0/auth0-react";


jest.mock('@auth0/auth0-react');
describe('Navbar Component', () => {
  test('renders with correct content', () => {
    const mockUser = { name: 'Test User' };
    useAuth0.mockReturnValue({
      user: mockUser,
      isLoading: false,
      logout: jest.fn(),
    });
    render(
      <Router>
        <Navbar />
      </Router>
    );

    // Check if the logo is present with the alt text 'Logo'
    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();

    // Check if each category link is present
    const categoryLinks = [
      'ART',
      'SCIENCE',
      'TECHNOLOGY',
      'CINEMA',
      'DESIGN',
      'FOOD',
    ];
    categoryLinks.forEach((category) => {
      const link = screen.getByText(category);
      expect(link).toBeInTheDocument();
    });

    // Check if profile, write, logout, and welcome elements are present
    const profileLink = screen.getByText('PROFILE');
    const writeLink = screen.getByText('WRITE');
    const logoutButton = screen.getByText('LogOut');
    
    expect(profileLink).toBeInTheDocument();
    expect(writeLink).toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();
  
  });
});