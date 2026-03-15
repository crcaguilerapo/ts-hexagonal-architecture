import { FileRepository } from '../adapters/out/file_repository.dapter';
import { loggerConfigured } from '../adapters/out/logger.adapter';
import { GetNamesByRegexUseCase } from '../domain/use_cases/get_name_by_regex';
import { InboundAdapter } from '../domain/ports/in/adapter.port';
import { CliAdapter } from '../adapters/in/cli.adapter';
import { RestAdapter } from '../adapters/in/rest.adapter';

// 1. Instantiate secondary adapters (Driven)
const repository = new FileRepository(loggerConfigured);

// 2. Instantiate Use Cases (Application Core) injecting the required ports
const getNamesUseCase = new GetNamesByRegexUseCase(repository);

// 3. Instantiate primary adapters (Driving) injecting the use cases and logger
const cliAdapter: InboundAdapter = new CliAdapter(getNamesUseCase, loggerConfigured);
const restAdapter: InboundAdapter = new RestAdapter(getNamesUseCase, loggerConfigured, Number(process.env.PORT ?? 3000));

// 4. Start the application
// Use `ADAPTER=rest` to run the REST API, otherwise the CLI adapter is used.
if ((process.env.ADAPTER ?? '').toLowerCase() === 'rest') {
    restAdapter.start();
} else {
    cliAdapter.start();
}
