import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DbConnectionBanner from '../components/DbConnectionBanner';

describe('DbConnectionBanner', () => {
    it('should not render when isVisible is false', () => {
        const { container } = render(<DbConnectionBanner isVisible={false} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('should render warning message when isVisible is true', () => {
        render(<DbConnectionBanner isVisible={true} />);

        const heading = screen.getByText('Database Connection Issue');
        expect(heading).toBeInTheDocument();

        const message = screen.getByText(/Warning: The application is currently unable to connect/i);
        expect(message).toBeInTheDocument();
    });
});
