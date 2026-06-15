"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AuthErrorBoundary: () => AuthErrorBoundary,
  LightbulbContext: () => LightbulbContext,
  LightbulbProvider: () => LightbulbProvider,
  QueryProvider: () => QueryProvider,
  TagContext: () => TagContext,
  TagProvider: () => TagProvider,
  clearAuthAndReload: () => clearAuthAndReload
});
module.exports = __toCommonJS(index_exports);

// src/contexts/TagContext.tsx
var import_react = __toESM(require("react"));
var TagContext = import_react.default.createContext(void 0);

// src/contexts/LightbulbContext.tsx
var import_react2 = __toESM(require("react"));
var LightbulbContext = import_react2.default.createContext(void 0);

// src/providers/AuthErrorBoundary.tsx
var import_react3 = require("react");

// src/utils/clearAuthAndReload.ts
function clearAuthAndReload() {
  try {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + (/* @__PURE__ */ new Date()).toUTCString() + ";path=/");
    });
  } catch {
  }
  window.location.reload();
}

// src/providers/AuthErrorBoundary.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function AuthErrorBoundary({ children }) {
  (0, import_react3.useEffect)(() => {
    const origFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await origFetch(...args);
      if (response.status === 401) {
        try {
          const text = await response.clone().text();
          if (text.includes("Invalid Refresh Token")) {
            clearAuthAndReload();
          }
        } catch {
        }
      }
      return response;
    };
    return () => {
      window.fetch = origFetch;
    };
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}

// src/providers/LightbulbProvider.tsx
var import_react4 = require("react");
var import_jsx_runtime2 = require("react/jsx-runtime");
var LightbulbProvider = ({
  children,
  supabaseClient
}) => {
  const [lightbulbs, setLightbulbs] = (0, import_react4.useState)([]);
  const [loading, setLoading] = (0, import_react4.useState)(true);
  const [error, setError] = (0, import_react4.useState)(null);
  const fetchLightbulbs = (0, import_react4.useCallback)(async () => {
    setLoading(true);
    setError(null);
    const { data, error: error2 } = await supabaseClient.from("lightbulb").select("*").order("id", { ascending: true });
    if (error2 !== null && typeof error2.message === "string" && error2.message.length > 0) {
      setError(error2.message);
      setLightbulbs([]);
    } else {
      setLightbulbs(Array.isArray(data) ? data : []);
    }
    setLoading(false);
  }, [supabaseClient]);
  (0, import_react4.useEffect)(() => {
    fetchLightbulbs();
  }, [fetchLightbulbs]);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(LightbulbContext.Provider, { value: { lightbulbs, loading, error, refresh: fetchLightbulbs }, children });
};

// src/providers/QueryProvider.tsx
var import_react5 = require("react");
var import_react_query = require("@tanstack/react-query");
var import_react_query_devtools = require("@tanstack/react-query-devtools");
var import_jsx_runtime3 = require("react/jsx-runtime");
function QueryProvider({ children }) {
  const [queryClient] = (0, import_react5.useState)(
    () => new import_react_query.QueryClient({
      defaultOptions: {
        queries: {
          // Stale time - how long data is considered fresh (5 minutes)
          staleTime: 5 * 60 * 1e3,
          // Cache time - how long data stays in cache after unused (10 minutes)
          gcTime: 10 * 60 * 1e3,
          // Retry failed requests 2 times with exponential backoff
          retry: 2,
          // Don't refetch when window regains focus by default
          refetchOnWindowFocus: false,
          // Refetch on reconnect
          refetchOnReconnect: true
        },
        mutations: {
          // Retry failed mutations once
          retry: 1
        }
      }
    })
  );
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_react_query.QueryClientProvider, { client: queryClient, children: [
    children,
    process.env.NODE_ENV === "development" && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_react_query_devtools.ReactQueryDevtools, { initialIsOpen: false })
  ] });
}

// src/providers/TagProvider.tsx
var import_react6 = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
var TagProvider = ({ children, supabaseClient }) => {
  const [tags, setTags] = (0, import_react6.useState)([]);
  const [loading, setLoading] = (0, import_react6.useState)(true);
  const [error, setError] = (0, import_react6.useState)(null);
  const fetchTags = (0, import_react6.useCallback)(async () => {
    setLoading(true);
    setError(null);
    const { data, error: error2 } = await supabaseClient.from("tag").select("id, created_at, tag, brand").order("id");
    if (error2 !== null && typeof error2.message === "string" && error2.message.length > 0) {
      setError(error2.message);
      setTags([]);
    } else {
      setTags(Array.isArray(data) ? data : []);
    }
    setLoading(false);
  }, [supabaseClient]);
  (0, import_react6.useEffect)(() => {
    fetchTags();
  }, [fetchTags]);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(TagContext.Provider, { value: { tags, loading, error, refresh: fetchTags }, children });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthErrorBoundary,
  LightbulbContext,
  LightbulbProvider,
  QueryProvider,
  TagContext,
  TagProvider,
  clearAuthAndReload
});
//# sourceMappingURL=index.js.map