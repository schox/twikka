"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/server.ts
var server_exports = {};
__export(server_exports, {
  createAdminAuthMiddleware: () => createAdminAuthMiddleware,
  createAdminClient: () => createAdminClient,
  createAuthMiddleware: () => createAuthMiddleware,
  createServerClientWithCookies: () => createServerClientWithCookies,
  createWebsiteAuthMiddleware: () => createWebsiteAuthMiddleware,
  standardMiddlewareMatcher: () => standardMiddlewareMatcher
});
module.exports = __toCommonJS(server_exports);
var import_ssr2 = require("@supabase/ssr");
var import_supabase_js = require("@supabase/supabase-js");

// src/types.ts
var SUPABASE_ENV_VARS = {
  novansa: {
    url: "NEXT_PUBLIC_NOVANSA_SUPABASE_URL",
    urlServer: "NOVANSA_SUPABASE_URL",
    publishableKey: "NEXT_PUBLIC_NOVANSA_SUPABASE_PUBLISHABLE_KEY",
    publishableKeyServer: "NOVANSA_SUPABASE_PUBLISHABLE_KEY",
    secretKey: "NOVANSA_SUPABASE_SECRET_KEY"
  },
  "couple-tools": {
    url: "NEXT_PUBLIC_COUPLE_TOOLS_SUPABASE_URL",
    urlServer: "COUPLE_TOOLS_SUPABASE_URL",
    publishableKey: "NEXT_PUBLIC_COUPLE_TOOLS_SUPABASE_PUBLISHABLE_KEY",
    publishableKeyServer: "COUPLE_TOOLS_SUPABASE_PUBLISHABLE_KEY",
    secretKey: "COUPLE_TOOLS_SUPABASE_SECRET_KEY"
  },
  twikka: {
    url: "NEXT_PUBLIC_TWIKKA_SUPABASE_URL",
    urlServer: "TWIKKA_SUPABASE_URL",
    publishableKey: "NEXT_PUBLIC_TWIKKA_SUPABASE_PUBLISHABLE_KEY",
    publishableKeyServer: "TWIKKA_SUPABASE_PUBLISHABLE_KEY",
    secretKey: "TWIKKA_SUPABASE_SECRET_KEY"
  },
  "self-hosted": {
    url: "NEXT_PUBLIC_SUPABASE_URL",
    urlServer: "SUPABASE_URL",
    publishableKey: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    publishableKeyServer: "SUPABASE_ANON_KEY",
    secretKey: "SUPABASE_SERVICE_ROLE_KEY"
  }
};
function getInstanceDisplayName(instance) {
  switch (instance) {
    case "novansa":
      return "Novansa";
    case "couple-tools":
      return "Couple Tools";
    case "twikka":
      return "Twikka";
    case "self-hosted":
      return "Self-hosted Supabase";
  }
}

// src/middleware.ts
var import_ssr = require("@supabase/ssr");
var import_server = require("next/server");
var SUPABASE_PROJECT_REFS = {
  novansa: "cpgapeppncrhrfoubqvh",
  "couple-tools": "vltuinbdgrxygkluhajy",
  twikka: "twikka",
  // Update with actual twikka project ref
  // Self-hosted Supabase: cookie ref derived from URL hostname's first label
  // (e.g. https://api.supabase.novansa.com → 'api'). Apps can override via
  // `customCookieNames` in AuthMiddlewareConfig if their setup differs.
  "self-hosted": "api"
};
function getMiddlewareCredentials(instance) {
  switch (instance) {
    case "novansa":
      return {
        url: process.env.NOVANSA_SUPABASE_URL ?? process.env.NEXT_PUBLIC_NOVANSA_SUPABASE_URL ?? "",
        key: process.env.NOVANSA_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_NOVANSA_SUPABASE_PUBLISHABLE_KEY ?? ""
      };
    case "couple-tools":
      return {
        url: process.env.COUPLE_TOOLS_SUPABASE_URL ?? process.env.NEXT_PUBLIC_COUPLE_TOOLS_SUPABASE_URL ?? "",
        key: process.env.COUPLE_TOOLS_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_COUPLE_TOOLS_SUPABASE_PUBLISHABLE_KEY ?? ""
      };
    case "twikka":
      return {
        url: process.env.TWIKKA_SUPABASE_URL ?? process.env.NEXT_PUBLIC_TWIKKA_SUPABASE_URL ?? "",
        key: process.env.TWIKKA_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_TWIKKA_SUPABASE_PUBLISHABLE_KEY ?? ""
      };
    case "self-hosted":
      return {
        url: process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
        key: process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
      };
  }
}
function getAuthCookieNames(instance) {
  const projectRef = SUPABASE_PROJECT_REFS[instance];
  return [
    `sb-${projectRef}-auth-token`,
    `sb-${projectRef}-auth-token-code-verifier`
  ];
}
function createAuthMiddleware(config) {
  const {
    protectedRoutes,
    publicRoutes = [],
    enableLogoutHandler = false,
    redirects = {},
    authCookieNames: customCookieNames,
    instance = "novansa"
  } = config;
  const loginPage = redirects.loginPage ?? "/login";
  const afterLoginPage = redirects.afterLogin ?? "/home";
  const authCookieNames = customCookieNames ?? getAuthCookieNames(instance);
  return async function middleware(request) {
    let supabaseResponse = import_server.NextResponse.next({
      request
    });
    const credentials = getMiddlewareCredentials(instance);
    const supabaseUrl = credentials.url;
    const supabaseKey = credentials.key;
    if (supabaseUrl.trim() === "" || supabaseKey.trim() === "") {
      console.warn(`[auth middleware] Missing Supabase credentials for instance: ${instance}`);
      return supabaseResponse;
    }
    const supabase = (0, import_ssr.createServerClient)(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = import_server.NextResponse.next({
            request
          });
          cookiesToSet.forEach(
            ({ name, value, options }) => supabaseResponse.cookies.set(name, value, options)
          );
        }
      }
    });
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (enableLogoutHandler && request.nextUrl.pathname === "/logout") {
      const response = import_server.NextResponse.redirect(new URL(loginPage, request.url));
      authCookieNames.forEach((cookieName) => {
        response.cookies.delete(cookieName);
      });
      return response;
    }
    const isPublicRoute = publicRoutes.some(
      (route) => request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route + "/")
    );
    if (isPublicRoute) {
      return supabaseResponse;
    }
    const isProtectedRoute = protectedRoutes.some(
      (route) => request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route + "/")
    );
    if (isProtectedRoute && !user) {
      return import_server.NextResponse.redirect(new URL(loginPage, request.url));
    }
    if (request.nextUrl.pathname === loginPage && user) {
      return import_server.NextResponse.redirect(new URL(afterLoginPage, request.url));
    }
    return supabaseResponse;
  };
}
var standardMiddlewareMatcher = [
  /*
   * Match all request paths except for the ones starting with:
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   * - Static assets (svg, png, jpg, etc.)
   */
  "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
];
function createAdminAuthMiddleware(options = []) {
  const resolvedOptions = Array.isArray(options) ? { additionalRoutes: options } : options;
  const { additionalRoutes = [], instance = "novansa" } = resolvedOptions;
  return createAuthMiddleware({
    protectedRoutes: [
      "/home",
      "/content",
      "/topics",
      "/messaging",
      "/media",
      "/settings",
      "/accounts",
      ...additionalRoutes
    ],
    enableLogoutHandler: true,
    instance
  });
}
function createWebsiteAuthMiddleware(protectedRoutes = []) {
  return createAuthMiddleware({
    protectedRoutes,
    publicRoutes: [
      "/",
      "/about",
      "/services",
      "/team",
      "/contact",
      "/blog",
      "/faq",
      "/privacy-policy",
      "/terms-conditions",
      "/policies"
    ]
  });
}

// src/server.ts
function getInstanceEnvVars(instance = "novansa") {
  const envVars = SUPABASE_ENV_VARS[instance];
  return {
    url: process.env[envVars.url] ?? process.env[envVars.urlServer],
    publishableKey: process.env[envVars.publishableKey] ?? process.env[envVars.publishableKeyServer],
    secretKey: process.env[envVars.secretKey]
  };
}
function createServerClientWithCookies(cookieStore, config) {
  const instance = config?.instance ?? "novansa";
  const envVars = getInstanceEnvVars(instance);
  const instanceName = getInstanceDisplayName(instance);
  const supabaseUrl = config?.url ?? envVars.url;
  const publishableKey = config?.publishableKey ?? envVars.publishableKey;
  if (!supabaseUrl) {
    throw new Error(
      `${instanceName} Supabase URL is required. Set ${SUPABASE_ENV_VARS[instance].url} or ${SUPABASE_ENV_VARS[instance].urlServer} environment variable.`
    );
  }
  if (!publishableKey) {
    throw new Error(
      `${instanceName} Supabase publishable key is required. Set ${SUPABASE_ENV_VARS[instance].publishableKey} or ${SUPABASE_ENV_VARS[instance].publishableKeyServer} environment variable.`
    );
  }
  return (0, import_ssr2.createServerClient)(supabaseUrl, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch (_error) {
        }
      }
    },
    auth: {
      autoRefreshToken: false,
      // Server-side doesn't need auto-refresh
      persistSession: false,
      ...config?.options?.auth
    },
    ...config?.options
  });
}
function createAdminClient(config) {
  const instance = config?.instance ?? "novansa";
  const envVars = getInstanceEnvVars(instance);
  const instanceName = getInstanceDisplayName(instance);
  const url = config?.url ?? envVars.url;
  if (!url) {
    throw new Error(
      `${instanceName} Supabase URL is required for admin client. Set ${SUPABASE_ENV_VARS[instance].url} environment variable.`
    );
  }
  const secretKey = config?.secretKey ?? envVars.secretKey;
  if (!secretKey) {
    throw new Error(
      `${instanceName} Supabase secret key is required for admin client. Set ${SUPABASE_ENV_VARS[instance].secretKey} environment variable.`
    );
  }
  return (0, import_supabase_js.createClient)(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createAdminAuthMiddleware,
  createAdminClient,
  createAuthMiddleware,
  createServerClientWithCookies,
  createWebsiteAuthMiddleware,
  standardMiddlewareMatcher
});
//# sourceMappingURL=server.js.map