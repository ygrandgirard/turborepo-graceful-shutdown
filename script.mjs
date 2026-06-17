import { createInterface } from 'node:readline';
import { setTimeout } from 'node:timers/promises';

const input = createInterface({ input: process.stdin, terminal: true });
const controller = new AbortController();

async function gracefulShutdown() {
    if (controller.signal.aborted) return;

    console.log('Graceful shutdown start');
    controller.abort();

    await setTimeout(5000);

    input.close();
    console.log('Graceful shutdown end');
}

// Unix
process.on('SIGINT', async () => {
    console.log('process received SIGINT signal');
    await gracefulShutdown();
});

// Windows
input.on('SIGINT', async () => {
    console.log('readline.Interface received SIGINT signal');
    await gracefulShutdown();
});

try {
    console.log('Ready');
    await setTimeout(2000, '', { signal: controller.signal });

    input.close();
    console.log('Done');
} catch {
    console.log('Aborted');
}
