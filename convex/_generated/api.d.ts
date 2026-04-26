/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as activityClassifier from "../activityClassifier.js";
import type * as activityKinds from "../activityKinds.js";
import type * as audit from "../audit.js";
import type * as auth from "../auth.js";
import type * as cities from "../cities.js";
import type * as coachPersonas from "../coachPersonas.js";
import type * as http from "../http.js";
import type * as lib_openrouter from "../lib/openrouter.js";
import type * as lib_recordedCall from "../lib/recordedCall.js";
import type * as lib_scope from "../lib/scope.js";
import type * as seed_activityKindEmbeddings from "../seed/activityKindEmbeddings.js";
import type * as seed_coachPersonas from "../seed/coachPersonas.js";
import type * as seed_modelPricing from "../seed/modelPricing.js";
import type * as seed_systemConfig from "../seed/systemConfig.js";
import type * as systemConfig from "../systemConfig.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  activityClassifier: typeof activityClassifier;
  activityKinds: typeof activityKinds;
  audit: typeof audit;
  auth: typeof auth;
  cities: typeof cities;
  coachPersonas: typeof coachPersonas;
  http: typeof http;
  "lib/openrouter": typeof lib_openrouter;
  "lib/recordedCall": typeof lib_recordedCall;
  "lib/scope": typeof lib_scope;
  "seed/activityKindEmbeddings": typeof seed_activityKindEmbeddings;
  "seed/coachPersonas": typeof seed_coachPersonas;
  "seed/modelPricing": typeof seed_modelPricing;
  "seed/systemConfig": typeof seed_systemConfig;
  systemConfig: typeof systemConfig;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
