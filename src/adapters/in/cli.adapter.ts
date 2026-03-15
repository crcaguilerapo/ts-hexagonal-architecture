import { Command } from 'commander';
import { GetNamesByRegexUseCase } from '../../domain/use_cases/get_name_by_regex';
import { Logger } from '../../domain/ports/out/logger.port';
import { InboundAdapter } from '../../domain/ports/in/adapter.port';

export class CliAdapter implements InboundAdapter {
    constructor(
        private readonly getNamesUseCase: GetNamesByRegexUseCase,
        private readonly logger: Logger
    ) { }

    /**
     * Starts the CLI application using commander
     */
    public start(): void {
        const program = new Command();

        program
            .name('name-searcher')
            .description('CLI to search names by regular expression in the hexagonal architecture project')
            .version('1.0.0');

        program
            .command('search')
            .description('Search for names matching a given regex pattern')
            .argument('<pattern>', 'The regular expression pattern to search for (e.g. "^Cristian")')
            .action((pattern: string) => {
                try {
                    const results = this.getNamesUseCase.execute(pattern);

                    this.logger.info(`Searching for pattern: "${pattern}"...`);

                    if (results.length === 0) {
                        this.logger.warn('No names found matching the given pattern.');
                    } else {
                        this.logger.info(`Found ${results.length} matching names:`);
                        results.forEach((name, index) => {
                            this.logger.info(`  ${index + 1}. ${name}`);
                        });
                    }
                } catch (error) {
                    this.logger.error(`Application error: ${error instanceof Error ? error.message : String(error)}`, error instanceof Error ? error : undefined);
                    process.exit(1);
                }
            });

        // Parse the arguments, falling back to help if no command is provided
        if (process.argv.length <= 2) {
            program.help();
        } else {
            program.parse(process.argv);
        }
    }
}
