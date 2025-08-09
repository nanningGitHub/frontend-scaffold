# Page snapshot

```yaml
- text: '[plugin:vite:import-analysis] Failed to resolve import "virtual:pwa-register" from "src/main.tsx". Does the file exist? /Users/nanning/cli/src/main.tsx:10:27 9 | import * as Sentry from "@sentry/react"; 10 | import { onCLS, onFID, onLCP } from "web-vitals"; 11 | import { registerSW } from "virtual:pwa-register"; | ^ 12 | if (import.meta.env?.DEV && import.meta.env?.VITE_ENABLE_MSW === "true") { 13 | import("./mocks/browser").then(({ worker }) => worker.start({ onUnhandledRequest: "bypass" })); at formatError (file:///Users/nanning/cli/node_modules/vite/dist/node/chunks/dep-827b23df.js:44066:46) at TransformContext.error (file:///Users/nanning/cli/node_modules/vite/dist/node/chunks/dep-827b23df.js:44062:19) at normalizeUrl (file:///Users/nanning/cli/node_modules/vite/dist/node/chunks/dep-827b23df.js:41845:33) at process.processTicksAndRejections (node:internal/process/task_queues:105:5) at async file:///Users/nanning/cli/node_modules/vite/dist/node/chunks/dep-827b23df.js:41999:47 at async Promise.all (index 10) at async TransformContext.transform (file:///Users/nanning/cli/node_modules/vite/dist/node/chunks/dep-827b23df.js:41915:13) at async Object.transform (file:///Users/nanning/cli/node_modules/vite/dist/node/chunks/dep-827b23df.js:44356:30) at async loadAndTransform (file:///Users/nanning/cli/node_modules/vite/dist/node/chunks/dep-827b23df.js:55088:29) at async viteTransformMiddleware (file:///Users/nanning/cli/node_modules/vite/dist/node/chunks/dep-827b23df.js:64699:32 Click outside, press Esc key, or fix the code to dismiss. You can also disable this overlay by setting'
- code: server.hmr.overlay
- text: to
- code: 'false'
- text: in
- code: vite.config.js.
```
