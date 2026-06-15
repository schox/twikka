// src/contexts/TagContext.tsx
import React from "react";
var TagContext = React.createContext(void 0);

// src/contexts/LightbulbContext.tsx
import React2 from "react";
var LightbulbContext = React2.createContext(void 0);

// src/providers/AuthErrorBoundary.tsx
import { useEffect } from "react";

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
import { Fragment, jsx } from "react/jsx-runtime";
function AuthErrorBoundary({ children }) {
  useEffect(() => {
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
  return /* @__PURE__ */ jsx(Fragment, { children });
}

// src/providers/LightbulbProvider.tsx
import { useState, useEffect as useEffect2, useCallback } from "react";
import { jsx as jsx2 } from "react/jsx-runtime";
var LightbulbProvider = ({
  children,
  supabaseClient
}) => {
  const [lightbulbs, setLightbulbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchLightbulbs = useCallback(async () => {
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
  useEffect2(() => {
    fetchLightbulbs();
  }, [fetchLightbulbs]);
  return /* @__PURE__ */ jsx2(LightbulbContext.Provider, { value: { lightbulbs, loading, error, refresh: fetchLightbulbs }, children });
};

// src/providers/QueryProvider.tsx
import { useState as useState2 } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { jsx as jsx3, jsxs } from "react/jsx-runtime";
function QueryProvider({ children }) {
  const [queryClient] = useState2(
    () => new QueryClient({
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
  return /* @__PURE__ */ jsxs(QueryClientProvider, { client: queryClient, children: [
    children,
    process.env.NODE_ENV === "development" && /* @__PURE__ */ jsx3(ReactQueryDevtools, { initialIsOpen: false })
  ] });
}

// src/providers/TagProvider.tsx
import { useState as useState3, useEffect as useEffect3, useCallback as useCallback2 } from "react";
import { jsx as jsx4 } from "react/jsx-runtime";
var TagProvider = ({ children, supabaseClient }) => {
  const [tags, setTags] = useState3([]);
  const [loading, setLoading] = useState3(true);
  const [error, setError] = useState3(null);
  const fetchTags = useCallback2(async () => {
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
  useEffect3(() => {
    fetchTags();
  }, [fetchTags]);
  return /* @__PURE__ */ jsx4(TagContext.Provider, { value: { tags, loading, error, refresh: fetchTags }, children });
};
export {
  AuthErrorBoundary,
  LightbulbContext,
  LightbulbProvider,
  QueryProvider,
  TagContext,
  TagProvider,
  clearAuthAndReload
};
//# sourceMappingURL=index.mjs.map