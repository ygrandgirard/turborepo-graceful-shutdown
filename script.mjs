import { createInterface } from 'node:readline';
import { setTimeout } from 'node:timers/promises';

const input = createInterface({ input: process.stdin });
const controller = new AbortController();

async function gracefulShutdown() {
    console.log('Graceful shutdown start');
    controller.abort();

    await setTimeout(5000);

    input.close();
    console.log('Graceful shutdown end');
}

// Unix
process.on('SIGINT', gracefulShutdown);

// Windows
input.on('SIGINT', gracefulShutdown);

try {
    console.log('Ready');
    await setTimeout(2000, '', { signal: controller.signal });

    input.close();
    console.log('Done');
} catch {
    console.log('Aborted');
}
