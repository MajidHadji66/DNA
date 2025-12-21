import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SequenceViewer from '../components/SequenceViewer';

describe('SequenceViewer', () => {
    const mockOnClose = jest.fn();

    beforeAll(() => {
        // Mock URL.createObjectURL and URL.revokeObjectURL
        global.URL.createObjectURL = jest.fn(() => 'mock-url');
        global.URL.revokeObjectURL = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should not render when sequence is null', () => {
        const { container } = render(
            <SequenceViewer sequence={null} onClose={mockOnClose} />
        );
        expect(container).toBeEmptyDOMElement();
    });

    it('should render sequence content', () => {
        const sequence = 'ATCGATCG';
        render(<SequenceViewer sequence={sequence} onClose={mockOnClose} />);

        expect(screen.getByText('Full Sequence Content')).toBeInTheDocument();
        expect(screen.getByText(sequence)).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', () => {
        render(<SequenceViewer sequence="ATCG" onClose={mockOnClose} />);

        const closeButton = screen.getByText('Close');
        fireEvent.click(closeButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should handle download', () => {
        render(<SequenceViewer sequence="ATCG" onClose={mockOnClose} Filename="test.txt" />);

        const downloadButton = screen.getByText('Download .txt');

        // Mock anchor click
        const mockClick = jest.fn();
        const mockAnchor = {
            href: '',
            download: '',
            click: mockClick,
            style: {}
        };
        // @ts-ignore
        jest.spyOn(document, 'createElement').mockReturnValue(mockAnchor);
        // @ts-ignore
        jest.spyOn(document.body, 'appendChild').mockImplementation(() => { });
        // @ts-ignore
        jest.spyOn(document.body, 'removeChild').mockImplementation(() => { });

        fireEvent.click(downloadButton);

        expect(global.URL.createObjectURL).toHaveBeenCalled();
        expect(mockClick).toHaveBeenCalled();
    });
});
