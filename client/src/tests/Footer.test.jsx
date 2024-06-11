import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer';

describe('Footer Component', () => {
  test('renders with correct content', () => {
    render(<Footer />);

    // Check if the logo is present with the alt text 'Logo'
    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();

    // Check if the footer content is present
       // Check if the footer content is present
       const footerContentPart1 = screen.getByText(/Simple Blog/i);
    
       expect(footerContentPart1).toBeInTheDocument();
  });
});