// __tests__/index.test.js

import { render, screen } from '@testing-library/react';
import Home from '../pages/index';
import '@testing-library/jest-dom';

describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />)

    const content = screen.getByText("Main Content Here")

    expect(content).toBeInTheDocument()
  })
});