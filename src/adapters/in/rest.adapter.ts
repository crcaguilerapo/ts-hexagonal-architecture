import express, { Request, Response, NextFunction } from 'express';
import { GetNamesByRegexUseCase } from '../../domain/use_cases/get_name_by_regex';
import { Logger } from '../../domain/ports/out/logger.port';
import { InboundAdapter } from '../../domain/ports/in/adapter.port';

export class RestAdapter implements InboundAdapter {
    private readonly app = express();

    constructor(
        private readonly getNamesUseCase: GetNamesByRegexUseCase,
        private readonly logger: Logger,
        private readonly port: number = 3000
    ) {
        this.app.get('/search', this.searchHandler.bind(this));
        this.app.get('/health', this.healthHandler.bind(this));

        // Centralized error handler for any uncaught errors in route handlers
        this.app.use(this.errorHandler.bind(this));
    }

    /**
     * Starts an Express server exposing the `/search` endpoint.
     *
     * Example:
     *   GET /search?pattern=^Crist
     */
    public start(): void {
        this.app.listen(this.port, () => {
            this.logger.info(`REST server is running at http://localhost:${this.port}`);
        });
    }

    private searchHandler(req: Request, res: Response): void {
        const rawPattern = Array.isArray(req.query.pattern) ? req.query.pattern[0] : req.query.pattern;
        const pattern = typeof rawPattern === 'string' ? rawPattern : undefined;

        if (!pattern) {
            res.status(400).json({ error: 'Missing required query parameter: pattern' });
            return;
        }

        this.logger.info(`Searching for pattern: "${pattern}" via REST`);

        const results = this.getNamesUseCase.execute(pattern);

        res.status(200).json({
            pattern,
            results,
        });
    }

    private healthHandler(_req: Request, res: Response): void {
        res.status(200).json({ status: 'ok' });
    }

    private errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
        this.logger.error('Application error handling REST request', err instanceof Error ? err : undefined);
        res.status(500).json({
            error: 'Internal server error',
            message: err instanceof Error ? err.message : String(err),
        });
    }
}
