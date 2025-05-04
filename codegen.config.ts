import {defineConfig} from "@7nohe/openapi-react-query-codegen";

export default defineConfig({
    schema: "./src/backend/openapi.json",
    outputDir: "src/api",
    client: "axios",
    useInfiniteQuery: false,
});
