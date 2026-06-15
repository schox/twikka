'use client';
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
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

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AuthContext: () => AuthContext,
  AuthProvider: () => AuthProvider,
  AuthenticationError: () => AuthenticationError,
  PermissionError: () => PermissionError,
  SUPABASE_ENV_VARS: () => SUPABASE_ENV_VARS,
  UserContext: () => UserContext,
  UserProfileError: () => UserProfileError,
  UserProvider: () => UserProvider,
  adminGuard: () => adminGuard,
  appAccessGuard: () => appAccessGuard,
  authGuard: () => authGuard,
  authPermissionGuard: () => authPermissionGuard,
  canEdit: () => canEdit,
  canView: () => canView,
  clearBrowserClientInstance: () => clearBrowserClientInstance,
  createAdminClient: () => createAdminClient,
  createAuthConfig: () => createAuthConfig,
  createClient: () => createClient,
  createGuard: () => createGuard,
  createProviderConfig: () => createProviderConfig,
  createServerClientWithCookies: () => createServerClientWithCookies,
  debugAuthState: () => debugAuthState,
  debugClaims: () => debugClaims,
  debugJWT: () => debugJWT,
  decodeJWT: () => decodeJWT,
  extractClaims: () => extractClaims,
  formatUserRole: () => formatUserRole,
  getAccountId: () => getAccountId,
  getAccountIdFromToken: () => getAccountIdFromToken,
  getAppInstance: () => getAppInstance,
  getClaimsFromSession: () => getClaimsFromSession,
  getFullName: () => getFullName,
  getInstanceDisplayName: () => getInstanceDisplayName,
  getRedirectUrl: () => getRedirectUrl,
  getRoleFromToken: () => getRoleFromToken,
  getRoleWeight: () => getRoleWeight,
  getTokenExpiry: () => getTokenExpiry,
  getUserInitials: () => getUserInitials,
  guardPresets: () => guardPresets,
  hasAppAccess: () => hasAppAccess,
  hasHigherRole: () => hasHigherRole,
  hasPermissions: () => hasPermissions,
  hasRole: () => hasRole,
  isAdmin: () => isAdmin,
  isAuthenticated: () => isAuthenticated,
  isOwner: () => isOwner,
  isTokenExpired: () => isTokenExpired,
  isValidEmail: () => isValidEmail,
  isValidSession: () => isValidSession,
  name: () => name,
  ownerGuard: () => ownerGuard,
  permissionGuard: () => permissionGuard,
  roleGuard: () => roleGuard,
  routeGuard: () => routeGuard,
  serverAuthGuard: () => serverAuthGuard,
  setupDebugHelpers: () => setupDebugHelpers,
  supabaseClientFactory: () => supabaseClientFactory,
  useAuth: () => useAuth,
  useClaims: () => useClaims,
  useUser: () => useUser,
  useVerification: () => useVerification,
  validateClaims: () => validateClaims,
  validatePassword: () => validatePassword,
  validateSupabaseConfig: () => validateSupabaseConfig,
  version: () => version
});
module.exports = __toCommonJS(index_exports);

// src/client.ts
var import_ssr = require("@supabase/ssr");
var import_supabase_js = require("@supabase/supabase-js");

// src/types.ts
var AuthenticationError = class extends Error {
  constructor(message, cause) {
    super(message);
    this.cause = cause;
    this.name = "AuthenticationError";
  }
};
var PermissionError = class extends Error {
  constructor(message, requiredPermissions) {
    super(message);
    this.requiredPermissions = requiredPermissions;
    this.name = "PermissionError";
  }
};
var UserProfileError = class extends Error {
  constructor(message, cause) {
    super(message);
    this.cause = cause;
    this.name = "UserProfileError";
  }
};
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

// src/client.ts
var browserClientInstances = /* @__PURE__ */ new Map();
function getInstanceEnvVars(instance = "novansa") {
  switch (instance) {
    case "novansa":
      return {
        url: process.env.NEXT_PUBLIC_NOVANSA_SUPABASE_URL ?? process.env.NOVANSA_SUPABASE_URL,
        publishableKey: process.env.NEXT_PUBLIC_NOVANSA_SUPABASE_PUBLISHABLE_KEY ?? process.env.NOVANSA_SUPABASE_PUBLISHABLE_KEY,
        secretKey: process.env.NOVANSA_SUPABASE_SECRET_KEY
      };
    case "couple-tools":
      return {
        url: process.env.NEXT_PUBLIC_COUPLE_TOOLS_SUPABASE_URL ?? process.env.COUPLE_TOOLS_SUPABASE_URL,
        publishableKey: process.env.NEXT_PUBLIC_COUPLE_TOOLS_SUPABASE_PUBLISHABLE_KEY ?? process.env.COUPLE_TOOLS_SUPABASE_PUBLISHABLE_KEY,
        secretKey: process.env.COUPLE_TOOLS_SUPABASE_SECRET_KEY
      };
    case "twikka":
      return {
        url: process.env.NEXT_PUBLIC_TWIKKA_SUPABASE_URL ?? process.env.TWIKKA_SUPABASE_URL,
        publishableKey: process.env.NEXT_PUBLIC_TWIKKA_SUPABASE_PUBLISHABLE_KEY ?? process.env.TWIKKA_SUPABASE_PUBLISHABLE_KEY,
        secretKey: process.env.TWIKKA_SUPABASE_SECRET_KEY
      };
    case "self-hosted":
      return {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL,
        publishableKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY,
        secretKey: process.env.SUPABASE_SERVICE_ROLE_KEY
      };
  }
}
function resolveCredentials(config) {
  const instance = config?.instance ?? "novansa";
  const envVars = getInstanceEnvVars(instance);
  const instanceName = getInstanceDisplayName(instance);
  const url = config?.url ?? envVars.url;
  if (!url || typeof url !== "string" || url.trim() === "") {
    throw new Error(
      `${instanceName} Supabase URL is required. Set ${SUPABASE_ENV_VARS[instance].url} or ${SUPABASE_ENV_VARS[instance].urlServer} environment variable.`
    );
  }
  const key = config?.publishableKey ?? envVars.publishableKey;
  if (!key || typeof key !== "string" || key.trim() === "") {
    throw new Error(
      `${instanceName} Supabase publishable key is required. Set ${SUPABASE_ENV_VARS[instance].publishableKey} or ${SUPABASE_ENV_VARS[instance].publishableKeyServer} environment variable.`
    );
  }
  return { url, key, instance };
}
function createClient(config) {
  const { url, key, instance } = resolveCredentials(config);
  if (typeof window !== "undefined" && browserClientInstances.has(instance)) {
    return browserClientInstances.get(instance);
  }
  const options = {
    auth: {
      autoRefreshToken: config?.enableAutoRefresh ?? true,
      persistSession: true,
      detectSessionInUrl: true,
      ...config?.options?.auth
    },
    ...config?.options
  };
  const client = (0, import_ssr.createBrowserClient)(url, key, options);
  if (typeof window !== "undefined") {
    browserClientInstances.set(instance, client);
  }
  if (config?.enableDevMode && typeof window !== "undefined") {
    window.__supabase_instance = instance;
    console.info(`[@novansa/auth] Initialized ${getInstanceDisplayName(instance)} client`);
  }
  return client;
}
function createServerClientWithCookies(cookieStore, config) {
  const { url, key } = resolveCredentials(config);
  return (0, import_ssr.createServerClient)(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name: name2, value, options }) => {
            cookieStore.set(name2, value, options);
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
var supabaseClientFactory = {
  /**
   * Browser client with singleton pattern
   */
  browser: (config) => createClient(config),
  /**
   * Server client with cookie management
   */
  server: (cookieStore, config) => createServerClientWithCookies(cookieStore, config),
  /**
   * Admin client with secret key (bypasses RLS)
   */
  admin: (config) => createAdminClient(config),
  /**
   * Get default configuration based on environment
   */
  getDefaultConfig: () => ({
    instance: "novansa",
    enableAutoRefresh: true,
    refreshInterval: 6e4,
    // 1 minute
    enableDevMode: process.env.NODE_ENV === "development"
  })
};
function validateSupabaseConfig(config) {
  const errors = [];
  const instance = config?.instance ?? "novansa";
  const envVars = getInstanceEnvVars(instance);
  const instanceName = getInstanceDisplayName(instance);
  const url = config?.url ?? envVars.url;
  const publishableKey = config?.publishableKey ?? envVars.publishableKey;
  if (!url) {
    errors.push(`${instanceName} Supabase URL is missing`);
  } else if (!url.startsWith("https://")) {
    errors.push(`${instanceName} Supabase URL must be a valid HTTPS URL`);
  }
  if (!publishableKey) {
    errors.push(`${instanceName} Supabase publishable key is missing`);
  }
  return {
    isValid: errors.length === 0,
    errors,
    instance
  };
}
function clearBrowserClientInstance(instance) {
  if (instance) {
    browserClientInstances.delete(instance);
  } else {
    browserClientInstances.clear();
  }
}

// src/hooks/useAuth.ts
var import_react2 = require("react");

// src/contexts/AuthContext.ts
var import_react = require("react");
var AuthContext = (0, import_react.createContext)(void 0);
AuthContext.displayName = "AuthContext";

// src/hooks/useAuth.ts
function useAuth() {
  const context = (0, import_react2.useContext)(AuthContext);
  if (context === void 0) {
    throw new AuthenticationError(
      "useAuth must be used within an AuthProvider. Make sure your component is wrapped in <AuthProvider>."
    );
  }
  return context;
}

// src/hooks/useUser.ts
var import_react4 = require("react");

// src/contexts/UserContext.ts
var import_react3 = require("react");
var UserContext = (0, import_react3.createContext)(void 0);
UserContext.displayName = "UserContext";

// src/hooks/useUser.ts
function useUser() {
  const context = (0, import_react4.useContext)(UserContext);
  if (context === void 0) {
    throw new UserProfileError(
      "useUser must be used within a UserProvider. Make sure your component is wrapped in <UserProvider>."
    );
  }
  return context;
}

// src/hooks/useClaims.ts
var import_react5 = require("react");

// src/utils/claims.ts
var import_jwt_decode = require("jwt-decode");
function extractClaims(token) {
  if (!token || typeof token !== "string") {
    return null;
  }
  try {
    const decoded = (0, import_jwt_decode.jwtDecode)(token);
    const claims = {
      account_id: decoded.account_id ?? decoded.app_metadata?.account_id,
      role: decoded.role ?? decoded.app_metadata?.role,
      // Include other potentially useful claims
      sub: decoded.sub,
      aud: decoded.aud,
      exp: decoded.exp,
      iat: decoded.iat,
      iss: decoded.iss,
      email: decoded.email,
      email_verified: decoded.email_verified,
      phone: decoded.phone,
      phone_verified: decoded.phone_verified,
      ...decoded.app_metadata,
      ...decoded.user_metadata
    };
    return claims;
  } catch (error) {
    console.warn("[@novansa/auth] Failed to decode JWT token:", error);
    return null;
  }
}
function getAccountIdFromToken(token) {
  const claims = extractClaims(token);
  return claims?.account_id ?? null;
}
function getRoleFromToken(token) {
  const claims = extractClaims(token);
  return claims?.role ?? null;
}
function isTokenExpired(token) {
  if (!token) return true;
  try {
    const decoded = (0, import_jwt_decode.jwtDecode)(token);
    if (!decoded.exp) return true;
    const currentTime = Math.floor(Date.now() / 1e3);
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
}
function getTokenExpiry(token) {
  if (!token) return null;
  try {
    const decoded = (0, import_jwt_decode.jwtDecode)(token);
    if (!decoded.exp) return null;
    return new Date(decoded.exp * 1e3);
  } catch {
    return null;
  }
}
function validateClaims(claims) {
  const errors = [];
  if (!claims) {
    return {
      isValid: false,
      errors: ["Claims object is null or undefined"]
    };
  }
  if (!claims.sub) {
    errors.push("Missing subject (sub) claim");
  }
  if (!claims.email) {
    errors.push("Missing email claim");
  }
  if (!claims.exp) {
    errors.push("Missing expiry (exp) claim");
  }
  if (!claims.iat) {
    errors.push("Missing issued at (iat) claim");
  }
  if (claims.exp && claims.exp < Math.floor(Date.now() / 1e3)) {
    errors.push("Token is expired");
  }
  if (claims.iat && claims.iat > Math.floor(Date.now() / 1e3) + 60) {
    errors.push("Token issued in the future");
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}
function getClaimsFromSession(accessToken) {
  if (typeof window !== "undefined") {
    console.warn("[@novansa/auth] getClaimsFromSession should only be used server-side");
    return null;
  }
  return extractClaims(accessToken);
}
function debugClaims(token) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }
  const claims = extractClaims(token);
  console.group("[@novansa/auth] JWT Claims Debug");
  console.log("Token:", token ? `${token.substring(0, 20)}...` : "null");
  console.log("Claims:", claims);
  console.log("Account ID:", claims?.account_id ?? "not found");
  console.log("Role:", claims?.role ?? "not found");
  console.log("Expired:", isTokenExpired(token));
  if (token) {
    console.log("Expires at:", getTokenExpiry(token)?.toISOString() ?? "unknown");
  }
  console.groupEnd();
}

// src/hooks/useClaims.ts
function useClaims() {
  const { session, user } = useAuth();
  const claims = (0, import_react5.useMemo)(() => {
    if (!session?.access_token) {
      return null;
    }
    return extractClaims(session.access_token);
  }, [session?.access_token]);
  const accountId = (0, import_react5.useMemo)(() => {
    return claims?.account_id ?? null;
  }, [claims?.account_id]);
  const role = (0, import_react5.useMemo)(() => {
    return claims?.role ?? null;
  }, [claims?.role]);
  const accountRole = (0, import_react5.useMemo)(() => {
    return claims?.account_role ?? null;
  }, [claims?.account_role]);
  const appAdmin = (0, import_react5.useMemo)(() => {
    return claims?.app_admin ?? false;
  }, [claims?.app_admin]);
  const appAccess = (0, import_react5.useMemo)(() => {
    return claims?.app_access ?? [];
  }, [claims?.app_access]);
  const isExpired = (0, import_react5.useMemo)(() => {
    return isTokenExpired(session?.access_token);
  }, [session?.access_token]);
  const expiresAt = (0, import_react5.useMemo)(() => {
    return getTokenExpiry(session?.access_token);
  }, [session?.access_token]);
  const isValid = (0, import_react5.useMemo)(() => {
    return !!(claims && user && !isExpired);
  }, [claims, user, isExpired]);
  return {
    // Core claims data
    claims,
    accountId,
    role,
    accountRole,
    appAdmin,
    appAccess,
    // Token validation
    isValid,
    isExpired,
    expiresAt,
    // Convenience getters
    hasAccountId: !!accountId,
    hasRole: !!role,
    isAppAdmin: appAdmin,
    isAccountAdmin: accountRole === "owner" || accountRole === "admin",
    isAccountOwner: accountRole === "owner",
    // App access helpers
    hasAppAccess: (app) => appAccess.includes(app),
    // Raw token access (use sparingly)
    accessToken: session?.access_token ?? null,
    // Helper function to get specific claim
    getClaim: (key) => {
      return claims?.[key] ?? null;
    }
  };
}

// src/hooks/useVerification.ts
var import_react6 = require("react");
function useVerification() {
  const { requestOtp, verifyOtp, supabase } = useAuth();
  const {
    verificationState,
    isFullyVerified,
    updatePendingEmail,
    updatePendingPhone,
    cancelPendingChange,
    markContactVerified,
    refetch
  } = useUser();
  const [loading, setLoading] = (0, import_react6.useState)(false);
  const [error, setError] = (0, import_react6.useState)(null);
  const requestVerificationOtp = (0, import_react6.useCallback)(
    async (type, options) => {
      setLoading(true);
      setError(null);
      try {
        let identifier = null;
        let channel = options?.channel ?? "email";
        switch (type) {
          case "email":
            identifier = verificationState?.email.value ?? null;
            channel = "email";
            break;
          case "phone":
            identifier = verificationState?.phone.value ?? null;
            channel = "sms";
            break;
          case "pending_email":
            identifier = verificationState?.email.pending ?? null;
            channel = "email";
            break;
          case "pending_phone":
            identifier = verificationState?.phone.pending ?? null;
            channel = "sms";
            break;
        }
        if (!identifier) {
          const result2 = {
            success: false,
            message: `No ${type.replace("_", " ")} available to verify`,
            error: "MISSING_IDENTIFIER"
          };
          setError(result2.message);
          return result2;
        }
        if (channel === "sms") {
          const { error: error2 } = await supabase.auth.updateUser({
            phone: identifier.trim()
          });
          if (error2) {
            const errorMessage = error2.message || "Failed to send verification code";
            setError(errorMessage);
            return {
              success: false,
              message: errorMessage,
              error: errorMessage
            };
          }
          return {
            success: true,
            message: "Verification code sent to your phone"
          };
        }
        const result = await requestOtp({
          identifier,
          channel
        });
        if (!result.success) {
          setError(result.error ?? result.message);
        }
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to request OTP";
        setError(errorMessage);
        return {
          success: false,
          message: errorMessage,
          error: errorMessage
        };
      } finally {
        setLoading(false);
      }
    },
    [verificationState, requestOtp, supabase]
  );
  const verifyContact = (0, import_react6.useCallback)(
    async (type, token) => {
      setLoading(true);
      setError(null);
      try {
        let identifier = null;
        let verificationType;
        switch (type) {
          case "email":
            identifier = verificationState?.email.value ?? null;
            verificationType = "verify_email";
            break;
          case "phone":
            identifier = verificationState?.phone.value ?? null;
            verificationType = "verify_phone";
            break;
          case "pending_email":
            identifier = verificationState?.email.pending ?? null;
            verificationType = "verify_pending_email";
            break;
          case "pending_phone":
            identifier = verificationState?.phone.pending ?? null;
            verificationType = "verify_pending_phone";
            break;
        }
        if (!identifier) {
          const result2 = {
            success: false,
            error: `No ${type.replace("_", " ")} available to verify`
          };
          setError(result2.error ?? null);
          return result2;
        }
        const result = await verifyOtp({
          identifier,
          token,
          type: verificationType
        });
        if (result.success) {
          await markContactVerified(type);
          await refetch();
        } else {
          setError(result.error ?? "Verification failed");
        }
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to verify OTP";
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage
        };
      } finally {
        setLoading(false);
      }
    },
    [verificationState, verifyOtp, markContactVerified, refetch]
  );
  const clearError = (0, import_react6.useCallback)(() => {
    setError(null);
  }, []);
  return {
    // State
    verificationState,
    isFullyVerified,
    loading,
    error,
    // Actions
    requestVerificationOtp,
    verifyContact,
    updatePendingEmail,
    updatePendingPhone,
    cancelPendingChange,
    clearError
  };
}

// src/providers/AuthProvider.tsx
var import_react7 = require("react");

// src/utils/debug.ts
function decodeJWT(token) {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.warn("[@novansa/auth] Invalid JWT format");
      return null;
    }
    const [headerPart, payloadPart, signaturePart] = parts;
    const header = JSON.parse(atob(headerPart.replace(/-/g, "+").replace(/_/g, "/")));
    const payload = JSON.parse(atob(payloadPart.replace(/-/g, "+").replace(/_/g, "/")));
    return {
      header,
      payload,
      signature: signaturePart,
      raw: {
        header: headerPart,
        payload: payloadPart,
        signature: signaturePart
      }
    };
  } catch (error) {
    console.error("[@novansa/auth] Error decoding JWT:", error);
    return null;
  }
}
function debugJWT(token, label = "JWT Token") {
  if (process.env.NODE_ENV !== "development") return;
  const decoded = decodeJWT(token);
  if (!decoded) {
    console.log(`[@novansa/auth] ${label}: Invalid token`);
    return;
  }
  console.group(`[@novansa/auth] ${label} Debug`);
  console.log("Header:", decoded.header);
  console.log("Payload:", decoded.payload);
  console.log(
    "Custom Claims:",
    decoded.payload?.account_id ? {
      account_id: decoded.payload.account_id
    } : "None"
  );
  console.log(
    "Expires:",
    typeof decoded.payload?.exp === "number" ? new Date(decoded.payload.exp * 1e3).toISOString() : "Unknown"
  );
  console.log(
    "Issued:",
    typeof decoded.payload?.iat === "number" ? new Date(decoded.payload.iat * 1e3).toISOString() : "Unknown"
  );
  console.groupEnd();
}
function setupDebugHelpers() {
  if (process.env.NODE_ENV !== "development" || typeof window === "undefined") return;
  window.debugJWT = debugJWT;
  window.decodeJWT = decodeJWT;
  console.log(
    "[@novansa/auth] Debug helpers available: window.debugJWT(token), window.decodeJWT(token)"
  );
}
function debugAuthState(state, label = "Auth State") {
  if (process.env.NODE_ENV !== "development") return;
  console.group(`[@novansa/auth] ${label} Debug`);
  console.log("Loading:", state.loading);
  console.log("User:", state.user?.email ?? "None");
  console.log("Session:", !!state.session);
  console.log(
    "Profile:",
    state.profile ? {
      id: state.profile.id,
      email: state.profile.email,
      account: state.profile.account,
      app_access: state.profile.app_access,
      account_role: state.profile.account_role
    } : "None"
  );
  console.log("Claims:", state.claims ?? "None");
  console.log("Error:", state.error?.message ?? "None");
  console.groupEnd();
}

// src/providers/AuthProvider.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function AuthProvider({
  children,
  instance,
  enableAutoRefresh: _enableAutoRefresh = true,
  refreshInterval: _refreshInterval = 6e4,
  // 1 minute
  onAuthStateChange
}) {
  const [state, setState] = (0, import_react7.useState)({
    user: null,
    session: null,
    profile: null,
    claims: null,
    loading: true,
    error: null
  });
  const supabase = (0, import_react7.useMemo)(() => createClient({ instance }), [instance]);
  const refreshTimeoutRef = (0, import_react7.useRef)(void 0);
  (0, import_react7.useEffect)(() => {
    setupDebugHelpers();
  }, []);
  const clearError = (0, import_react7.useCallback)(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);
  const updateState = (0, import_react7.useCallback)(
    (updates) => {
      setState((prev) => {
        const newState = { ...prev, ...updates };
        onAuthStateChange?.(newState);
        return newState;
      });
    },
    [onAuthStateChange]
  );
  const emitAuthEvent = (0, import_react7.useCallback)((type, data) => {
    const event = {
      type,
      session: data.session ?? null,
      user: data.user ?? null,
      error: data.error
    };
    if (process.env.NODE_ENV === "development") {
      console.log("[@novansa/auth] Auth event:", event);
    }
  }, []);
  const _fetchUserProfile = (0, import_react7.useCallback)(
    async (userId) => {
      try {
        const supabaseAny = supabase;
        const { data, error } = await supabaseAny.from("v_user_profile_with_account_and_subscription").select("*").eq("auth_id", userId).single();
        if (error) {
          console.error("[@novansa/auth] Failed to fetch user profile:", error);
          return null;
        }
        return data;
      } catch (error) {
        console.error("[@novansa/auth] Error fetching user profile:", error);
        return null;
      }
    },
    [supabase]
  );
  const handleSessionChange = (0, import_react7.useCallback)(
    async (session) => {
      console.log("[@novansa/auth] handleSessionChange called with session:", !!session);
      if (!session) {
        console.log("[@novansa/auth] No session - signing out");
        updateState({
          user: null,
          session: null,
          profile: null,
          claims: null,
          loading: false
        });
        emitAuthEvent("SIGNED_OUT", { session, user: null });
        return;
      }
      const { user } = session;
      const claims = extractClaims(session.access_token);
      console.log("[@novansa/auth] Session found - user:", user?.email);
      console.log("[@novansa/auth] JWT claims extracted:", claims);
      if (session.access_token) {
        debugJWT(session.access_token, "Access Token");
      }
      const newState = {
        user,
        session,
        claims,
        profile: null,
        // UserProvider will fetch this
        loading: false
      };
      updateState(newState);
      debugAuthState(newState, "Updated Auth State");
      emitAuthEvent("SIGNED_IN", { session, user });
    },
    [updateState, emitAuthEvent]
  );
  (0, import_react7.useEffect)(() => {
    let mounted = true;
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error
        } = await supabase.auth.getSession();
        if (error) {
          console.error("[@novansa/auth] Error getting initial session:", error);
          if (mounted) {
            updateState({
              error: new AuthenticationError("Failed to get initial session", error),
              loading: false
            });
          }
          return;
        }
        if (mounted) {
          await handleSessionChange(session);
        }
      } catch (error) {
        console.error("[@novansa/auth] Error in getInitialSession:", error);
        if (mounted) {
          updateState({
            error: error instanceof Error ? error : new Error("Failed to initialize auth"),
            loading: false
          });
        }
      }
    };
    getInitialSession();
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      console.log("[@novansa/auth] Auth state change:", event);
      switch (event) {
        case "SIGNED_IN":
        case "TOKEN_REFRESHED":
          await handleSessionChange(session);
          break;
        case "SIGNED_OUT":
          await handleSessionChange(null);
          break;
        default:
          break;
      }
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [supabase, handleSessionChange, updateState]);
  const requestOtp = (0, import_react7.useCallback)(
    async (request) => {
      const { identifier, channel, appId } = request;
      updateState({ loading: true, error: null });
      try {
        if (appId) {
          const response = await fetch("/api/auth/request-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier, channel, appId })
          });
          const result = await response.json();
          if (!response.ok) {
            updateState({ loading: false });
            return {
              success: false,
              message: "Unable to send verification code. Please try again.",
              error: result.error
            };
          }
          updateState({ loading: false });
          return {
            success: true,
            message: `Verification code sent to your ${channel === "sms" ? "phone" : "email"}`
          };
        }
        if (channel === "sms") {
          const { error } = await supabase.auth.signInWithOtp({
            phone: identifier.trim(),
            options: {
              shouldCreateUser: false
            }
          });
          if (error) {
            throw new AuthenticationError("Failed to send OTP", error);
          }
        } else {
          const { error } = await supabase.auth.signInWithOtp({
            email: identifier.trim(),
            options: {
              shouldCreateUser: false
            }
          });
          if (error) {
            throw new AuthenticationError("Failed to send OTP", error);
          }
        }
        updateState({ loading: false });
        return {
          success: true,
          message: `Verification code sent to your ${channel === "sms" ? "phone" : "email"}`
        };
      } catch (error) {
        const authError = error instanceof AuthenticationError ? error : new AuthenticationError("OTP request failed", error);
        updateState({ error: authError, loading: false });
        return {
          success: false,
          message: "Failed to send verification code",
          error: authError.message
        };
      }
    },
    [supabase, updateState]
  );
  const verifyOtp = (0, import_react7.useCallback)(
    async (request) => {
      const { identifier, token, type } = request;
      updateState({ loading: true, error: null });
      try {
        const isPhone = identifier.startsWith("+") || /^\d{10,}$/.test(identifier.replace(/\D/g, ""));
        let data;
        let error;
        if (isPhone) {
          const phoneType = type === "login" ? "sms" : "phone_change";
          const result = await supabase.auth.verifyOtp({
            phone: identifier.trim(),
            token,
            type: phoneType
          });
          data = result.data;
          error = result.error;
        } else {
          const emailType = type === "login" || type === "verify_email" ? "email" : "email_change";
          const result = await supabase.auth.verifyOtp({
            email: identifier.trim(),
            token,
            type: emailType
          });
          data = result.data;
          error = result.error;
        }
        if (error) {
          throw new AuthenticationError("Invalid verification code", error);
        }
        updateState({ loading: false });
        if (data.session) {
          emitAuthEvent("SIGNED_IN", { session: data.session, user: data.user });
        }
        return {
          success: true,
          session: data.session ?? void 0
        };
      } catch (error) {
        const authError = error instanceof AuthenticationError ? error : new AuthenticationError("OTP verification failed", error);
        updateState({ error: authError, loading: false });
        return {
          success: false,
          error: authError.message
        };
      }
    },
    [supabase, updateState, emitAuthEvent]
  );
  const signInWithOtp = (0, import_react7.useCallback)(
    async (email, options) => {
      return requestOtp({
        identifier: email,
        channel: options?.channel ?? "email"
      });
    },
    [requestOtp]
  );
  const signOut = (0, import_react7.useCallback)(async () => {
    updateState({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new AuthenticationError("Failed to sign out", error);
      }
    } catch (error) {
      const authError = error instanceof AuthenticationError ? error : new AuthenticationError("Sign out failed", error);
      updateState({ error: authError, loading: false });
      throw authError;
    }
  }, [supabase, updateState]);
  const refreshSession = (0, import_react7.useCallback)(async () => {
    try {
      const {
        data: { session },
        error
      } = await supabase.auth.refreshSession();
      if (error) {
        throw new AuthenticationError("Failed to refresh session", error);
      }
      if (session) {
        await handleSessionChange(session);
        emitAuthEvent("TOKEN_REFRESHED", { session, user: session.user });
      }
    } catch (error) {
      const authError = error instanceof AuthenticationError ? error : new AuthenticationError("Session refresh failed", error);
      updateState({ error: authError });
      throw authError;
    }
  }, [supabase, handleSessionChange, updateState, emitAuthEvent]);
  const contextValue = (0, import_react7.useMemo)(
    () => ({
      ...state,
      // Primary OTP methods
      requestOtp,
      verifyOtp,
      signInWithOtp,
      signOut,
      refreshSession,
      clearError,
      supabase
      // Provide shared client
    }),
    [
      state,
      requestOtp,
      verifyOtp,
      signInWithOtp,
      signOut,
      refreshSession,
      clearError
      // supabase is stable due to singleton pattern, don't include in deps
    ]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, { value: contextValue, children });
}

// src/providers/UserProvider.tsx
var import_react8 = require("react");
var import_jsx_runtime2 = require("react/jsx-runtime");
function UserProvider({
  children,
  enableCaching = true,
  cacheTimeout = 3e5,
  // 5 minutes
  onUserProfileChange
}) {
  const { user, session: _session, supabase, signOut } = useAuth();
  const [profile, setProfile] = (0, import_react8.useState)(null);
  const [brands, setBrands] = (0, import_react8.useState)(
    null
  );
  const [loading, setLoading] = (0, import_react8.useState)(false);
  const [error, setError] = (0, import_react8.useState)(null);
  const [lastFetch, setLastFetch] = (0, import_react8.useState)(0);
  const realtimeChannelRef = (0, import_react8.useRef)(null);
  const fetchUserBrands = (0, import_react8.useCallback)(
    async (accountId, profileId) => {
      try {
        let userBrands = [];
        if (profileId) {
          const { data, error: userBrandsError } = await supabase.from("brand_user").select(
            `
            brand:brand (
              id,
              name,
              account
            )
          `
          ).eq("user", profileId);
          if (userBrandsError) {
            throw new Error(`Failed to fetch user brands: ${userBrandsError.message}`);
          }
          userBrands = data ?? [];
        }
        const { data: accountBrands, error: accountBrandsError } = await supabase.from("brand").select("id, name, account").eq("account", accountId);
        if (accountBrandsError) {
          throw new Error(`Failed to fetch account brands: ${accountBrandsError.message}`);
        }
        const directBrands = userBrands?.map((ub) => ub.brand).filter(Boolean) ?? [];
        const allAccountBrands = accountBrands ?? [];
        const brandMap = /* @__PURE__ */ new Map();
        directBrands.forEach((brand) => {
          if (brand) {
            brandMap.set(brand.id, brand);
          }
        });
        if (profile?.account_role && ["owner", "admin"].includes(profile.account_role)) {
          allAccountBrands.forEach((brand) => {
            brandMap.set(brand.id, brand);
          });
        }
        return Array.from(brandMap.values());
      } catch (error2) {
        console.error("[@novansa/auth] Error fetching user brands:", error2);
        return [];
      }
    },
    [supabase]
  );
  const fetchUserData = (0, import_react8.useCallback)(
    async (force = false) => {
      console.log(
        "[@novansa/auth] UserProvider fetchUserData called - user:",
        user?.email,
        "force:",
        force
      );
      if (!user || !force && enableCaching && Date.now() - lastFetch < cacheTimeout) {
        console.log("[@novansa/auth] UserProvider skipping fetch - no user or cache valid");
        return;
      }
      console.log("[@novansa/auth] UserProvider starting data fetch");
      setLoading(true);
      setError(null);
      try {
        let currentProfile = null;
        if (!currentProfile || force) {
          console.log("[@novansa/auth] UserProvider fetching profile for auth_id:", user.id);
          const { data, error: profileError } = await supabase.from("v_user_profile_with_account_and_subscription").select("*").eq("auth_id", user.id).maybeSingle();
          console.log("[@novansa/auth] UserProvider profile query result:", {
            data: !!data,
            error: profileError
          });
          if (profileError) {
            console.error("[@novansa/auth] Profile fetch error:", profileError);
            setError(new UserProfileError("Failed to fetch user profile", profileError));
            setLoading(false);
            return;
          }
          if (!data) {
            console.warn("[@novansa/auth] No user profile found for auth_id:", user.id);
            setError(new UserProfileError("User profile not found. Please contact support."));
            setLoading(false);
            return;
          }
          currentProfile = data;
          console.log("[@novansa/auth] UserProvider profile loaded:", {
            id: currentProfile.id,
            email: currentProfile.email,
            account: currentProfile.account,
            app_access: currentProfile.app_access,
            active: currentProfile.active
          });
          if (currentProfile.active === false) {
            console.log("[@novansa/auth] User is deactivated:", currentProfile.email);
            try {
              await signOut();
            } catch (e) {
              console.error("[@novansa/auth] Error signing out deactivated user:", e);
            }
            setError(
              new UserProfileError(
                "Your account has been deactivated. Please contact your account administrator."
              )
            );
            setProfile(null);
            setBrands(null);
            setLoading(false);
            return;
          }
        }
        setProfile(currentProfile);
        onUserProfileChange?.(currentProfile);
        if (currentProfile?.account && currentProfile?.id) {
          console.log(
            "[@novansa/auth] UserProvider fetching brands for account:",
            currentProfile.account
          );
          const userBrands = await fetchUserBrands(currentProfile.account, currentProfile.id);
          console.log("[@novansa/auth] UserProvider brands loaded:", userBrands.length);
          setBrands(userBrands);
        } else {
          console.log("[@novansa/auth] UserProvider no account - setting empty brands");
          setBrands([]);
        }
        setLastFetch(Date.now());
        console.log("[@novansa/auth] UserProvider fetch completed successfully");
      } catch (err) {
        const error2 = err instanceof UserProfileError ? err : new UserProfileError("Failed to load user data", err);
        console.error("[@novansa/auth] Error fetching user data:", error2);
        setError(error2);
      } finally {
        setLoading(false);
      }
    },
    [user, enableCaching, cacheTimeout, lastFetch, supabase, signOut, onUserProfileChange, fetchUserBrands]
  );
  (0, import_react8.useEffect)(() => {
    if (user) {
      fetchUserData();
    } else {
      setProfile(null);
      setBrands(null);
      setError(null);
      setLoading(false);
    }
  }, [user, fetchUserData]);
  (0, import_react8.useEffect)(() => {
    if (!profile?.id) {
      if (realtimeChannelRef.current) {
        realtimeChannelRef.current.unsubscribe();
        realtimeChannelRef.current = null;
      }
      return;
    }
    const channel = supabase.channel(`user_profile:${profile.id}`).on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "user_profile",
        filter: `id=eq.${profile.id}`
      },
      async (payload) => {
        console.log("[@novansa/auth] User profile realtime update:", payload);
        const newProfile = payload.new;
        if (newProfile.active === false) {
          console.log("[@novansa/auth] User deactivated via realtime - signing out");
          try {
            await signOut();
          } catch (e) {
            console.error("[@novansa/auth] Error signing out deactivated user:", e);
          }
          setError(
            new UserProfileError(
              "Your account has been deactivated. Please contact your account administrator."
            )
          );
          setProfile(null);
          setBrands(null);
          return;
        }
        setProfile(newProfile);
        onUserProfileChange?.(newProfile);
      }
    ).subscribe((status) => {
      console.log("[@novansa/auth] Realtime subscription status:", status);
    });
    realtimeChannelRef.current = channel;
    return () => {
      channel.unsubscribe();
      realtimeChannelRef.current = null;
    };
  }, [profile?.id, supabase, signOut, onUserProfileChange]);
  const verificationState = (0, import_react8.useMemo)(() => {
    if (!profile) return null;
    return {
      email: {
        value: profile.email ?? null,
        verified: profile.email_verified ?? false,
        pending: profile.email_pending ?? null,
        pendingVerified: profile.email_pending_verified ?? false
      },
      phone: {
        value: profile.phone ?? null,
        verified: profile.phone_verified ?? false,
        pending: profile.phone_pending ?? null,
        pendingVerified: profile.phone_pending_verified ?? false
      },
      isFullyVerified: (profile.email_verified ?? false) && (profile.phone_verified ?? false)
    };
  }, [profile]);
  const isFullyVerified = (0, import_react8.useMemo)(() => {
    return verificationState?.isFullyVerified ?? false;
  }, [verificationState]);
  const updatePendingEmail = (0, import_react8.useCallback)(
    async (email) => {
      if (!profile?.id) {
        throw new UserProfileError("No user profile available");
      }
      const { error: error2 } = await supabase.from("user_profile").update({ email_pending: email.trim() }).eq("id", profile.id);
      if (error2) {
        throw new UserProfileError("Failed to update pending email", error2);
      }
    },
    [profile?.id, supabase]
  );
  const updatePendingPhone = (0, import_react8.useCallback)(
    async (phone) => {
      if (!profile?.id) {
        throw new UserProfileError("No user profile available");
      }
      const { error: error2 } = await supabase.from("user_profile").update({ phone_pending: phone.trim() }).eq("id", profile.id);
      if (error2) {
        throw new UserProfileError("Failed to update pending phone", error2);
      }
    },
    [profile?.id, supabase]
  );
  const cancelPendingChange = (0, import_react8.useCallback)(
    async (type) => {
      if (!profile?.id) {
        throw new UserProfileError("No user profile available");
      }
      const updateData = type === "email" ? { email_pending: null, email_pending_verified: false } : { phone_pending: null, phone_pending_verified: false };
      const { error: error2 } = await supabase.from("user_profile").update(updateData).eq("id", profile.id);
      if (error2) {
        throw new UserProfileError(`Failed to cancel pending ${type} change`, error2);
      }
    },
    [profile?.id, supabase]
  );
  const markContactVerified = (0, import_react8.useCallback)(
    async (type) => {
      if (!profile?.id) {
        throw new UserProfileError("No user profile available");
      }
      let updateData;
      switch (type) {
        case "email":
          updateData = { email_verified: true };
          break;
        case "phone":
          updateData = { phone_verified: true };
          break;
        case "pending_email":
          updateData = { email_pending_verified: true };
          break;
        case "pending_phone":
          updateData = { phone_pending_verified: true };
          break;
      }
      const { error: error2 } = await supabase.from("user_profile").update(updateData).eq("id", profile.id);
      if (error2) {
        throw new UserProfileError(`Failed to mark ${type} as verified`, error2);
      }
    },
    [profile?.id, supabase]
  );
  const updateSelectedBrand = (0, import_react8.useCallback)(
    async (brandId) => {
      if (!profile?.id) {
        throw new UserProfileError("No user profile available");
      }
      const { error: error2 } = await supabase.from("user_profile").update({ selected_brand: brandId }).eq("id", profile.id);
      if (error2) {
        throw new UserProfileError("Failed to update selected brand", error2);
      }
    },
    [profile?.id, supabase]
  );
  const hasAppAccess2 = (0, import_react8.useCallback)(
    (app) => {
      if (!profile?.app_access) return false;
      return profile.app_access.includes(app);
    },
    [profile?.app_access]
  );
  const hasRole2 = (0, import_react8.useCallback)(
    (roles) => {
      if (!profile?.account_role) return false;
      const roleArray = Array.isArray(roles) ? roles : [roles];
      return roleArray.includes(profile.account_role);
    },
    [profile?.account_role]
  );
  const isAdmin2 = (0, import_react8.useMemo)(() => {
    return hasRole2(["owner", "admin"]) || !!profile?.app_admin;
  }, [hasRole2, profile?.app_admin]);
  const isOwner2 = (0, import_react8.useMemo)(() => {
    return hasRole2("owner");
  }, [hasRole2]);
  const canEdit2 = (0, import_react8.useMemo)(() => {
    return hasRole2(["owner", "admin", "editor"]);
  }, [hasRole2]);
  const canView2 = (0, import_react8.useMemo)(() => {
    return hasRole2(["owner", "admin", "editor", "viewer"]);
  }, [hasRole2]);
  const refetch = (0, import_react8.useCallback)(async () => {
    await fetchUserData(true);
  }, [fetchUserData]);
  const contextValue = (0, import_react8.useMemo)(
    () => ({
      profile,
      brands,
      loading,
      error,
      refetch,
      hasAppAccess: hasAppAccess2,
      hasRole: hasRole2,
      isAdmin: isAdmin2,
      isOwner: isOwner2,
      canEdit: canEdit2,
      canView: canView2,
      // Verification state and methods
      verificationState,
      isFullyVerified,
      updatePendingEmail,
      updatePendingPhone,
      cancelPendingChange,
      markContactVerified,
      // Brand selection
      updateSelectedBrand
    }),
    [
      profile,
      brands,
      loading,
      error,
      refetch,
      hasAppAccess2,
      hasRole2,
      isAdmin2,
      isOwner2,
      canEdit2,
      canView2,
      verificationState,
      isFullyVerified,
      updatePendingEmail,
      updatePendingPhone,
      cancelPendingChange,
      markContactVerified,
      updateSelectedBrand
    ]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(UserContext.Provider, { value: contextValue, children });
}

// src/utils/auth.ts
function hasPermissions(profile, config) {
  if (!profile) return false;
  const { roles, apps, requireAll = false } = config;
  let hasRoles = true;
  let hasApps = true;
  if (roles && roles.length > 0) {
    if (requireAll) {
      hasRoles = roles.every((role) => profile.account_role === role);
    } else {
      hasRoles = roles.includes(profile.account_role);
    }
  }
  if (apps && apps.length > 0) {
    const userApps = profile.app_access || [];
    if (requireAll) {
      hasApps = apps.every((app) => userApps.includes(app));
    } else {
      hasApps = apps.some((app) => userApps.includes(app));
    }
  }
  return hasRoles && hasApps;
}
function hasRole(profile, roles) {
  if (!profile?.account_role) return false;
  const roleArray = Array.isArray(roles) ? roles : [roles];
  return roleArray.includes(profile.account_role);
}
function hasAppAccess(profile, app) {
  if (!profile?.app_access) return false;
  return profile.app_access.includes(app);
}
function isAdmin(profile) {
  if (!profile) return false;
  return hasRole(profile, ["owner", "admin"]) || !!profile.app_admin;
}
function isOwner(profile) {
  return hasRole(profile, "owner");
}
function canEdit(profile) {
  return hasRole(profile, ["owner", "admin", "editor"]);
}
function canView(profile) {
  return hasRole(profile, ["owner", "admin", "editor", "viewer"]);
}
function getFullName(profile) {
  if (!profile) return "";
  const firstName = profile.first_name?.trim() ?? "";
  const lastName = profile.last_name?.trim() ?? "";
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  return firstName || lastName || profile.email || "";
}
function getUserInitials(profile) {
  if (!profile) return "";
  const firstName = profile.first_name?.trim() ?? "";
  const lastName = profile.last_name?.trim() ?? "";
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  if (firstName) {
    return firstName.substring(0, 2).toUpperCase();
  }
  if (lastName) {
    return lastName.substring(0, 2).toUpperCase();
  }
  if (profile.email) {
    return profile.email.substring(0, 2).toUpperCase();
  }
  return "";
}
function formatUserRole(role) {
  switch (role) {
    case "owner":
      return "Owner";
    case "admin":
      return "Administrator";
    case "editor":
      return "Editor";
    case "viewer":
      return "Viewer";
    case "client":
      return "Client";
    default:
      return role;
  }
}
function getRoleWeight(role) {
  switch (role) {
    case "owner":
      return 5;
    case "admin":
      return 4;
    case "editor":
      return 3;
    case "viewer":
      return 2;
    case "client":
      return 1;
    default:
      return 0;
  }
}
function hasHigherRole(roleA, roleB) {
  return getRoleWeight(roleA) > getRoleWeight(roleB);
}
function isValidSession(session) {
  if (!session) return false;
  const expiresAt = session.expires_at;
  if (!expiresAt) return false;
  const expiryTime = expiresAt * 1e3;
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1e3;
  return expiryTime > now + fiveMinutes;
}
function isAuthenticated(user, session) {
  return !!(user && session && isValidSession(session));
}
function getAccountId(profile, claims) {
  if (profile?.account) {
    return profile.account;
  }
  if (claims?.account_id) {
    return claims.account_id;
  }
  return null;
}
function getRedirectUrl(baseUrl, path, searchParams) {
  try {
    const url = new URL(path ?? "/", baseUrl);
    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }
    return url.toString();
  } catch (error) {
    console.warn("[@novansa/auth] Invalid redirect URL:", error);
    return baseUrl;
  }
}
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}
function validatePassword(password) {
  const errors = [];
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}

// src/utils/guards.ts
function authGuard(user, session, fallbackUrl = "/login") {
  if (!isAuthenticated(user, session)) {
    return {
      allowed: false,
      reason: "User is not authenticated",
      redirectTo: fallbackUrl
    };
  }
  return { allowed: true };
}
function permissionGuard(profile, permissions, fallbackUrl = "/unauthorized") {
  if (!profile) {
    return {
      allowed: false,
      reason: "User profile not found",
      redirectTo: fallbackUrl
    };
  }
  if (!hasPermissions(profile, permissions)) {
    const reasons = [];
    if (permissions.roles) {
      reasons.push(`Required roles: ${permissions.roles.join(", ")}`);
    }
    if (permissions.apps) {
      reasons.push(`Required app access: ${permissions.apps.join(", ")}`);
    }
    return {
      allowed: false,
      reason: `Insufficient permissions. ${reasons.join(". ")}`,
      redirectTo: fallbackUrl
    };
  }
  return { allowed: true };
}
function appAccessGuard(profile, app, fallbackUrl = "/unauthorized") {
  return permissionGuard(profile, { apps: [app] }, fallbackUrl);
}
function roleGuard(profile, roles, fallbackUrl = "/unauthorized") {
  const roleArray = Array.isArray(roles) ? roles : [roles];
  return permissionGuard(profile, { roles: roleArray }, fallbackUrl);
}
function adminGuard(profile, fallbackUrl = "/unauthorized") {
  return permissionGuard(profile, { roles: ["owner", "admin"] }, fallbackUrl);
}
function ownerGuard(profile, fallbackUrl = "/unauthorized") {
  return permissionGuard(profile, { roles: ["owner"] }, fallbackUrl);
}
function authPermissionGuard(user, session, profile, permissions, authFallbackUrl = "/login", permissionFallbackUrl = "/unauthorized") {
  const authResult = authGuard(user, session, authFallbackUrl);
  if (!authResult.allowed) {
    return authResult;
  }
  return permissionGuard(profile, permissions, permissionFallbackUrl);
}
function routeGuard(user, session, profile, config = {}) {
  const {
    requireAuth = true,
    permissions,
    authFallbackUrl = "/login",
    permissionFallbackUrl = "/unauthorized"
  } = config;
  if (requireAuth) {
    const authResult = authGuard(user, session, authFallbackUrl);
    if (!authResult.allowed) {
      return authResult;
    }
  }
  if (permissions) {
    return permissionGuard(profile, permissions, permissionFallbackUrl);
  }
  return { allowed: true };
}
function serverAuthGuard(user, session) {
  if (!isAuthenticated(user, session)) {
    return {
      authenticated: false,
      user: null,
      session: null,
      error: "Authentication required"
    };
  }
  return {
    authenticated: true,
    user,
    session
  };
}
function createGuard(guardFn, failureReason, fallbackUrl) {
  return (params) => {
    if (!guardFn(params)) {
      return {
        allowed: false,
        reason: failureReason,
        redirectTo: fallbackUrl
      };
    }
    return { allowed: true };
  };
}
var guardPresets = {
  /**
   * Fall admin app access
   */
  fallAdmin: (profile) => appAccessGuard(profile, "fall-admin"),
  /**
   * Ripplebase app access
   */
  ripplebase: (profile) => appAccessGuard(profile, "ripplebase"),
  /**
   * Fall website admin access
   */
  fallWebsiteAdmin: (profile) => appAccessGuard(profile, "fall-website"),
  /**
   * Can edit content (editor role or higher)
   */
  canEdit: (profile) => roleGuard(profile, ["owner", "admin", "editor"]),
  /**
   * Can view content (viewer role or higher)
   */
  canView: (profile) => roleGuard(profile, ["owner", "admin", "editor", "viewer"]),
  /**
   * Multi-app access (fall-admin and ripplebase)
   */
  multiApp: (profile) => permissionGuard(profile, {
    apps: ["fall-admin", "ripplebase"],
    requireAll: true
  })
};

// src/index.ts
var version = "0.1.0";
var name = "@novansa/auth";
function createAuthConfig(options) {
  return {
    enableAutoRefresh: options?.enableAutoRefresh ?? true,
    refreshInterval: options?.refreshInterval ?? 6e4,
    enableDevMode: options?.enableDevMode ?? process.env.NODE_ENV === "development",
    fallbackToLegacyKeys: true
  };
}
function getAppInstance(app) {
  switch (app) {
    case "fall-admin":
    case "fall-website":
    case "ripplebase":
      return "novansa";
    case "couple-tools-admin":
    case "couple-tools-website":
      return "couple-tools";
    case "twikka-admin":
    case "twikka-website":
      return "twikka";
  }
}
function createProviderConfig(app) {
  const instance = getAppInstance(app);
  const baseConfig = {
    instance,
    enableAutoRefresh: true,
    refreshInterval: 6e4
  };
  switch (app) {
    case "fall-admin":
    case "couple-tools-admin":
    case "twikka-admin":
      return {
        ...baseConfig,
        // Admin apps might need more frequent refresh for sensitive operations
        refreshInterval: 3e4
      };
    case "ripplebase":
      return {
        ...baseConfig
        // Standard config for SaaS app
      };
    case "fall-website":
    case "couple-tools-website":
    case "twikka-website":
      return {
        ...baseConfig,
        // Public websites might need less frequent refresh
        refreshInterval: 12e4
      };
    default:
      return baseConfig;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthContext,
  AuthProvider,
  AuthenticationError,
  PermissionError,
  SUPABASE_ENV_VARS,
  UserContext,
  UserProfileError,
  UserProvider,
  adminGuard,
  appAccessGuard,
  authGuard,
  authPermissionGuard,
  canEdit,
  canView,
  clearBrowserClientInstance,
  createAdminClient,
  createAuthConfig,
  createClient,
  createGuard,
  createProviderConfig,
  createServerClientWithCookies,
  debugAuthState,
  debugClaims,
  debugJWT,
  decodeJWT,
  extractClaims,
  formatUserRole,
  getAccountId,
  getAccountIdFromToken,
  getAppInstance,
  getClaimsFromSession,
  getFullName,
  getInstanceDisplayName,
  getRedirectUrl,
  getRoleFromToken,
  getRoleWeight,
  getTokenExpiry,
  getUserInitials,
  guardPresets,
  hasAppAccess,
  hasHigherRole,
  hasPermissions,
  hasRole,
  isAdmin,
  isAuthenticated,
  isOwner,
  isTokenExpired,
  isValidEmail,
  isValidSession,
  name,
  ownerGuard,
  permissionGuard,
  roleGuard,
  routeGuard,
  serverAuthGuard,
  setupDebugHelpers,
  supabaseClientFactory,
  useAuth,
  useClaims,
  useUser,
  useVerification,
  validateClaims,
  validatePassword,
  validateSupabaseConfig,
  version
});
//# sourceMappingURL=index.js.map