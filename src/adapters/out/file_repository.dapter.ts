import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '../../domain/ports/out/logger.port';
import { NameRepository } from '../../domain/ports/out/name_repository.port';

export class FileRepository implements NameRepository {
    private filePath: string;
    private logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
        // Define the path relative to this file's directory
        this.filePath = path.join(__dirname, '../../resources/names');
    }

    /**
     * Reads the names file and returns a list filtered by a regular expression.
     * @param pattern - Regular expression to filter the names.
     * @returns List of names that match the pattern.
     */
    public findNames(pattern: RegExp): string[] {
        try {
            this.logger.debug(`Reading names file from ${this.filePath}`);
            // Read the file using utf-8 encoding
            const content = fs.readFileSync(this.filePath, 'utf-8');

            // Split by newline (\n or \r\n), remove empty strings and apply the filter
            const names = content
                .split(/\r?\n/)
                .map(name => name.trim())
                .filter(name => name !== '')
                .filter(name => pattern.test(name));

            this.logger.info(`Found ${names.length} matching names for pattern ${pattern}`);
            return names;
        } catch (error) {
            this.logger.error('Error reading the names file:', error instanceof Error ? error : new Error(String(error)), { filePath: this.filePath });
            return [];
        }
    }
}
