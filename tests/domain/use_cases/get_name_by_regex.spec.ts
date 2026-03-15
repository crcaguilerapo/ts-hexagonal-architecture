import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { GetNamesByRegexUseCase } from '../../../src/domain/use_cases/get_name_by_regex';
import { NameRepository } from '../../../src/domain/ports/out/name_repository.port';

describe('GetNamesByRegexUseCase', () => {
    let useCase: GetNamesByRegexUseCase;
    let mockRepository: jest.Mocked<NameRepository>;

    beforeEach(() => {
        mockRepository = {
            findNames: jest.fn()
        };
        useCase = new GetNamesByRegexUseCase(mockRepository);
    });

    it('should return names matching the regex pattern', () => {
        const expectedPattern = new RegExp('^Cris', 'i');
        mockRepository.findNames.mockReturnValue(['Cristian', 'Cristhian']);

        const result = useCase.execute('^Cris');

        expect(result).toEqual(['Cristian', 'Cristhian']);
        expect(mockRepository.findNames).toHaveBeenCalledWith(expectedPattern);
    });

    it('should throw an error for invalid regex pattern', () => {
        expect(() => {
            useCase.execute('^Cris('); // Invalid regex: unclosed parenthesis
        }).toThrow('The entered regular expression is not valid: ^Cris(');

        expect(mockRepository.findNames).not.toHaveBeenCalled();
    });
});
