"use strict";
// export { Stack } from './layouts/Stack';
// export { Tabs } from './layouts/Tabs';
// export * from './exports';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLocalSearchParams = exports.usePathname = exports.Link = void 0;
const client_1 = require("./rsc/router/client");
var client_2 = require("./rsc/router/client");
Object.defineProperty(exports, "Link", { enumerable: true, get: function () { return client_2.Link; } });
function usePathname() {
    const router = (0, client_1.useRouter_UNSTABLE)();
    return router.path;
}
exports.usePathname = usePathname;
function useLocalSearchParams() {
    const router = (0, client_1.useRouter_UNSTABLE)();
    return Object.fromEntries([...new URLSearchParams(router.query).entries()]);
}
exports.useLocalSearchParams = useLocalSearchParams;
//# sourceMappingURL=index.js.map