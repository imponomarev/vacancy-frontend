import {defineConfig} from 'orval';

export default defineConfig({
    vacancyAggregator: {
        input: './src/backend/openapi.json',
        output: {
            mode: 'tags-split',
            target: './src/api',
            schemas: './src/api/model',
            client: 'react-query',                     // генерация хуков
            clean: true,                               // очищаем каталог перед записью
            override: {
                mutator: {
                    path: './src/lib/axios-fetcher.ts',
                    name: 'axiosFetcher',
                },
            },
        },
        hooks: {
            afterAllFilesWrite: ['prettier --write ./src/api/**/*.{ts,tsx}'],
        },
    },
});
