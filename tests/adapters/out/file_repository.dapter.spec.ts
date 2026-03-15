import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import * as fs from 'fs';
import { FileRepository } from '../../../src/adapters/out/file_repository.dapter';
import { Logger } from '../../../src/domain/ports/out/logger.port';

jest.mock('fs');

describe('FileRepository', () => {
    let repository: FileRepository;
    let mockLogger: jest.Mocked<Logger>;

    beforeEach(() => {
        mockLogger = {
            info: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
        } as unknown as jest.Mocked<Logger>;

        repository = new FileRepository(mockLogger);
        jest.clearAllMocks();
    });

    it('should return matched names', () => {
        const mockFileContent = "Cristian\nCarlos\nAna\nCristhian\r\n";
        (fs.readFileSync as jest.Mock).mockReturnValue(mockFileContent);

        const result = repository.findNames(/^Cris/);

        expect(result).toEqual(['Cristian', 'Cristhian']);
        expect(mockLogger.debug).toHaveBeenCalled();
        expect(mockLogger.info).toHaveBeenCalledWith(expect.stringContaining('Found 2 matching names'));
    });

    it('should return an empty array if file reading fails', () => {
        (fs.readFileSync as jest.Mock).mockImplementation(() => {
            throw new Error('File not found');
        });

        const result = repository.findNames(/./);

        expect(result).toEqual([]);
        expect(mockLogger.error).toHaveBeenCalled();
    });
});
