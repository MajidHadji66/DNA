import { renderHook, act, waitFor } from '@testing-library/react';
import { useFileAnalysis } from '../hooks/useFileAnalysis';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

describe('useFileAnalysis', () => {
    const mockPush = jest.fn();
    const mockApiUrl = 'http://localhost:8000';
    const mockUser = { username: 'testuser', role: 'Tester', joined: '2023-01-01' };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        global.fetch = jest.fn();
    });

    it('should initialize with default states', () => {
        const { result } = renderHook(() => useFileAnalysis(mockApiUrl, mockUser));
        expect(result.current.file).toBeNull();
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('should update file state on handleFileChange', () => {
        const { result } = renderHook(() => useFileAnalysis(mockApiUrl, mockUser));
        const file = new File(['content'], 'test.txt', { type: 'text/plain' });
        const event = {
            target: { files: [file] }
        } as unknown as React.ChangeEvent<HTMLInputElement>;

        act(() => {
            result.current.handleFileChange(event);
        });

        expect(result.current.file).toBe(file);
        expect(result.current.error).toBeNull();
    });

    it('should handle successful upload and redirect', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ id: '123' }),
        });

        const { result } = renderHook(() => useFileAnalysis(mockApiUrl, mockUser));
        const file = new File(['content'], 'test.txt', { type: 'text/plain' });

        // Set file first
        const event = {
            target: { files: [file] }
        } as unknown as React.ChangeEvent<HTMLInputElement>;

        act(() => {
            result.current.handleFileChange(event);
        });

        await act(async () => {
            await result.current.handleUpload();
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(mockPush).toHaveBeenCalledWith('/results/123');
    });

    it('should handle server error during upload', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => ({ detail: 'Server Error' }),
        });

        const { result } = renderHook(() => useFileAnalysis(mockApiUrl, mockUser));
        const file = new File(['content'], 'test.txt', { type: 'text/plain' });

        // Set file first
        const event = {
            target: { files: [file] }
        } as unknown as React.ChangeEvent<HTMLInputElement>;

        act(() => {
            result.current.handleFileChange(event);
        });

        await act(async () => {
            await result.current.handleUpload();
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe('Server Error');
        expect(mockPush).not.toHaveBeenCalled();
    });

    it('should handle network error during upload', async () => {
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

        const { result } = renderHook(() => useFileAnalysis(mockApiUrl, mockUser));
        const file = new File(['content'], 'test.txt', { type: 'text/plain' });

        // Set file first
        const event = {
            target: { files: [file] }
        } as unknown as React.ChangeEvent<HTMLInputElement>;

        act(() => {
            result.current.handleFileChange(event);
        });

        await act(async () => {
            await result.current.handleUpload();
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe('Network Error');
        expect(mockPush).not.toHaveBeenCalled();
    });
});
