import pino from 'pino';
import { Logger } from '../../domain/ports/out/logger.port';

const pinoLogger = pino({
    // Use pretty print in development, standard JSON in production
    ...(process.env.NODE_ENV !== 'production' && {
        transport: { target: 'pino-pretty', options: { colorize: true } }
    }),
    level: process.env.LOG_LEVEL || 'info',
});

export class PinoLoggerAdapter implements Logger {
    info(message: string, context?: Record<string, any>): void {
        if (context) {
            pinoLogger.info(context, message);
        } else {
            pinoLogger.info(message);
        }
    }

    error(message: string, error?: Error, context?: Record<string, any>): void {
        const logData = { ...context, err: error };
        pinoLogger.error(logData, message);
    }

    warn(message: string, context?: Record<string, any>): void {
        if (context) {
            pinoLogger.warn(context, message);
        } else {
            pinoLogger.warn(message);
        }
    }

    debug(message: string, context?: Record<string, any>): void {
        if (context) {
            pinoLogger.debug(context, message);
        } else {
            pinoLogger.debug(message);
        }
    }
}

// Export a singleton instance that can be injected where needed
export const loggerConfigured = new PinoLoggerAdapter();
