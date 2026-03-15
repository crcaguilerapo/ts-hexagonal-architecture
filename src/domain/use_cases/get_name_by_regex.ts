import { NameRepository } from '../ports/out/name_repository.port';

export class GetNamesByRegexUseCase {
    /**
     * Inject the output port (NameRepository) to invert the dependency.
     * The use case does not know if the data comes from a file, a DB, or an API.
     */
    constructor(private readonly nameRepository: NameRepository) { }

    /**
     * Executes the use case
     * @param regexPattern The text pattern we want to search for (e.g., "^Cristian")
     * @returns The list of names that match the pattern
     */
    public execute(regexPattern: string): string[] {
        try {
            // Business rule: we create the regular expression ignoring case ('i')
            const pattern = new RegExp(regexPattern, 'i');

            // Call the port (interface)
            return this.nameRepository.findNames(pattern);
        } catch (error) {
            // Business rule: validate that the regular expression submitted by the user is valid
            throw new Error(`The entered regular expression is not valid: ${regexPattern}`);
        }
    }
}
