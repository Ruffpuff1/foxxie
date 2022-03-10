import 'reflect-metadata';
import loadServer from './server';

async function main() {
    const port = process.env.PORT || 4000;
    const server = await loadServer();

    server.listen({ port: Number(port) }, () => {
        console.log(`server started: http://localhost:${port}`);
    });
}

void main();
