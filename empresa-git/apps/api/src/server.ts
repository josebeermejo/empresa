import { buildApp } from './app.js';
import env from './config/env.js';
import logger from './lib/logger.js';
import { startWorkers } from './lib/queue.js';
import { ensureStorageDir } from './lib/storage.js';

// Graceful shutdown
let server: any;
let workers: any;

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

async function gracefulShutdown() {
    logger.info('Received shutdown signal, closing gracefully...');

    try {
        if (server) {
            await server.close();
            logger.info('Server closed');
        }

        // Note: BullMQ workers close automatically when the process exits
        // but we can explicitly close them if needed
        if (workers?.ingestWorker) {
            await workers.ingestWorker.close();
            logger.info('Workers closed');
        }

        process.exit(0);
    } catch (error) {
        logger.error({ error }, 'Error during shutdown');
        process.exit(1);
    }
}

async function start() {
    try {
        // Ensure storage directory exists
        await ensureStorageDir();
        logger.info({ dir: env.storageDir }, 'Storage directory ready');

        // Build and start Fastify app
        server = await buildApp();

        await server.listen({
            port: env.port,
            host: '0.0.0.0',
        });

        // Start queue workers
        workers = startWorkers();

        // Startup banner
        logger.info(
            {
                env: env.nodeEnv,
                port: env.port,
                region: env.region,
                llmProvider: env.llmProvider,
            },
            `🚀 ${env.appName} API started`
        );

        console.log(`
╔═══════════════════════════════════════════╗
║                                           ║
║   ${env.appName.toUpperCase().padEnd(37)} ║
║                                           ║
║   Status: ✓ Running                       ║
║   Port:   ${env.port.toString().padEnd(31)} ║
║   Env:    ${env.nodeEnv.padEnd(31)} ║
║   LLM:    ${env.llmProvider.padEnd(31)} ║
║                                           ║
║   Health: http://localhost:${env.port}/health${' '.repeat(6)}║
║   Docs:   /docs/API.md                    ║
║                                           ║
╚═══════════════════════════════════════════╝
    `);
    } catch (error) {
        logger.error({ error }, 'Failed to start server');
        process.exit(1);
    }
}

start();
