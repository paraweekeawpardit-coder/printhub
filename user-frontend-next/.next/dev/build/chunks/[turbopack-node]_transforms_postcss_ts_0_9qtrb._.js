module.exports = [
"[turbopack-node]/transforms/postcss.ts?config=[project]/user-frontend-next/postcss.config.mjs { CONFIG => \"[project]/user-frontend-next/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "chunks/0ztj_0ydqo-1._.js",
  "chunks/[root-of-the-server]__052n9vl._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[turbopack-node]/transforms/postcss.ts?config=[project]/user-frontend-next/postcss.config.mjs { CONFIG => \"[project]/user-frontend-next/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript)");
    });
});
}),
];