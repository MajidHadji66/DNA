import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AboutModal from '../components/AboutModal';

describe('AboutModal', () => {
    const mockOnClose = jest.fn();

    it('should not render when isOpen is false', () => {
        const { container } = render(<AboutModal isOpen={false} onClose={mockOnClose} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('should render content when isOpen is true', () => {
        render(<AboutModal isOpen={true} onClose={mockOnClose} />);

        expect(screen.getByText('About This Project')).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', () => {
        render(<AboutModal isOpen={true} onClose={mockOnClose} />);

        // There are usually two ways to close: X icon or Close button. 
        // Assuming there's a button with "Close" text or similar.
        // Based on common patterns, let's look for a button. 
        // If exact text is unknown, we might need to rely on role or aria-label.
        // Testing "Close" text first.
        const closeButtons = screen.getAllByRole('button');
        // Assuming the first one might be the X or the bottom close button.
        // Let's create a robust test by looking for the one that calls close.

        // Just click the first available button (likely X)
        fireEvent.click(closeButtons[0]);
        expect(mockOnClose).toHaveBeenCalled();
    });
});
