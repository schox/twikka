'use client';
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
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

// ../../node_modules/@swc/helpers/cjs/_interop_require_default.cjs
var require_interop_require_default = __commonJS({
  "../../node_modules/@swc/helpers/cjs/_interop_require_default.cjs"(exports2) {
    "use strict";
    function _interop_require_default(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    exports2._ = _interop_require_default;
  }
});

// ../../node_modules/next/dist/shared/lib/utils/warn-once.js
var require_warn_once = __commonJS({
  "../../node_modules/next/dist/shared/lib/utils/warn-once.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    Object.defineProperty(exports2, "warnOnce", {
      enumerable: true,
      get: function() {
        return warnOnce;
      }
    });
    var warnOnce = (_) => {
    };
    if (process.env.NODE_ENV !== "production") {
      const warnings = /* @__PURE__ */ new Set();
      warnOnce = (msg) => {
        if (!warnings.has(msg)) {
          console.warn(msg);
        }
        warnings.add(msg);
      };
    }
  }
});

// ../../node_modules/next/dist/shared/lib/deployment-id.js
var require_deployment_id = __commonJS({
  "../../node_modules/next/dist/shared/lib/deployment-id.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    function _export(target, all) {
      for (var name in all) Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
      });
    }
    _export(exports2, {
      getDeploymentId: function() {
        return getDeploymentId;
      },
      getDeploymentIdQueryOrEmptyString: function() {
        return getDeploymentIdQueryOrEmptyString;
      }
    });
    function getDeploymentId() {
      return process.env.NEXT_DEPLOYMENT_ID;
    }
    function getDeploymentIdQueryOrEmptyString() {
      let deploymentId = getDeploymentId();
      if (deploymentId) {
        return `?dpl=${deploymentId}`;
      }
      return "";
    }
  }
});

// ../../node_modules/next/dist/shared/lib/image-blur-svg.js
var require_image_blur_svg = __commonJS({
  "../../node_modules/next/dist/shared/lib/image-blur-svg.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    Object.defineProperty(exports2, "getImageBlurSvg", {
      enumerable: true,
      get: function() {
        return getImageBlurSvg;
      }
    });
    function getImageBlurSvg({ widthInt, heightInt, blurWidth, blurHeight, blurDataURL, objectFit }) {
      const std = 20;
      const svgWidth = blurWidth ? blurWidth * 40 : widthInt;
      const svgHeight = blurHeight ? blurHeight * 40 : heightInt;
      const viewBox = svgWidth && svgHeight ? `viewBox='0 0 ${svgWidth} ${svgHeight}'` : "";
      const preserveAspectRatio = viewBox ? "none" : objectFit === "contain" ? "xMidYMid" : objectFit === "cover" ? "xMidYMid slice" : "none";
      return `%3Csvg xmlns='http://www.w3.org/2000/svg' ${viewBox}%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='${std}'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='${std}'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='${preserveAspectRatio}' style='filter: url(%23b);' href='${blurDataURL}'/%3E%3C/svg%3E`;
    }
  }
});

// ../../node_modules/next/dist/shared/lib/image-config.js
var require_image_config = __commonJS({
  "../../node_modules/next/dist/shared/lib/image-config.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    function _export(target, all) {
      for (var name in all) Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
      });
    }
    _export(exports2, {
      VALID_LOADERS: function() {
        return VALID_LOADERS;
      },
      imageConfigDefault: function() {
        return imageConfigDefault;
      }
    });
    var VALID_LOADERS = [
      "default",
      "imgix",
      "cloudinary",
      "akamai",
      "custom"
    ];
    var imageConfigDefault = {
      deviceSizes: [
        640,
        750,
        828,
        1080,
        1200,
        1920,
        2048,
        3840
      ],
      imageSizes: [
        32,
        48,
        64,
        96,
        128,
        256,
        384
      ],
      path: "/_next/image",
      loader: "default",
      loaderFile: "",
      /**
      * @deprecated Use `remotePatterns` instead to protect your application from malicious users.
      */
      domains: [],
      disableStaticImages: false,
      minimumCacheTTL: 14400,
      formats: [
        "image/webp"
      ],
      maximumRedirects: 3,
      dangerouslyAllowLocalIP: false,
      dangerouslyAllowSVG: false,
      contentSecurityPolicy: `script-src 'none'; frame-src 'none'; sandbox;`,
      contentDispositionType: "attachment",
      localPatterns: void 0,
      remotePatterns: [],
      qualities: [
        75
      ],
      unoptimized: false
    };
  }
});

// ../../node_modules/next/dist/shared/lib/get-img-props.js
var require_get_img_props = __commonJS({
  "../../node_modules/next/dist/shared/lib/get-img-props.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    Object.defineProperty(exports2, "getImgProps", {
      enumerable: true,
      get: function() {
        return getImgProps;
      }
    });
    var _warnonce = require_warn_once();
    var _deploymentid = require_deployment_id();
    var _imageblursvg = require_image_blur_svg();
    var _imageconfig = require_image_config();
    var VALID_LOADING_VALUES = [
      "lazy",
      "eager",
      void 0
    ];
    var INVALID_BACKGROUND_SIZE_VALUES = [
      "-moz-initial",
      "fill",
      "none",
      "scale-down",
      void 0
    ];
    function isStaticRequire(src) {
      return src.default !== void 0;
    }
    function isStaticImageData(src) {
      return src.src !== void 0;
    }
    function isStaticImport(src) {
      return !!src && typeof src === "object" && (isStaticRequire(src) || isStaticImageData(src));
    }
    var allImgs = /* @__PURE__ */ new Map();
    var perfObserver;
    function getInt(x) {
      if (typeof x === "undefined") {
        return x;
      }
      if (typeof x === "number") {
        return Number.isFinite(x) ? x : NaN;
      }
      if (typeof x === "string" && /^[0-9]+$/.test(x)) {
        return parseInt(x, 10);
      }
      return NaN;
    }
    function getWidths({ deviceSizes, allSizes }, width, sizes) {
      if (sizes) {
        const viewportWidthRe = /(^|\s)(1?\d?\d)vw/g;
        const percentSizes = [];
        for (let match; match = viewportWidthRe.exec(sizes); match) {
          percentSizes.push(parseInt(match[2]));
        }
        if (percentSizes.length) {
          const smallestRatio = Math.min(...percentSizes) * 0.01;
          return {
            widths: allSizes.filter((s) => s >= deviceSizes[0] * smallestRatio),
            kind: "w"
          };
        }
        return {
          widths: allSizes,
          kind: "w"
        };
      }
      if (typeof width !== "number") {
        return {
          widths: deviceSizes,
          kind: "w"
        };
      }
      const widths = [
        ...new Set(
          // > This means that most OLED screens that say they are 3x resolution,
          // > are actually 3x in the green color, but only 1.5x in the red and
          // > blue colors. Showing a 3x resolution image in the app vs a 2x
          // > resolution image will be visually the same, though the 3x image
          // > takes significantly more data. Even true 3x resolution screens are
          // > wasteful as the human eye cannot see that level of detail without
          // > something like a magnifying glass.
          // https://blog.twitter.com/engineering/en_us/topics/infrastructure/2019/capping-image-fidelity-on-ultra-high-resolution-devices.html
          [
            width,
            width * 2
            /*, width * 3*/
          ].map((w) => allSizes.find((p) => p >= w) || allSizes[allSizes.length - 1])
        )
      ];
      return {
        widths,
        kind: "x"
      };
    }
    function generateImgAttrs({ config, src, unoptimized, width, quality, sizes, loader }) {
      if (unoptimized) {
        const deploymentId = (0, _deploymentid.getDeploymentId)();
        if (src.startsWith("/") && !src.startsWith("//") && deploymentId) {
          const sep = src.includes("?") ? "&" : "?";
          src = `${src}${sep}dpl=${deploymentId}`;
        }
        return {
          src,
          srcSet: void 0,
          sizes: void 0
        };
      }
      const { widths, kind } = getWidths(config, width, sizes);
      const last = widths.length - 1;
      return {
        sizes: !sizes && kind === "w" ? "100vw" : sizes,
        srcSet: widths.map((w, i) => `${loader({
          config,
          src,
          quality,
          width: w
        })} ${kind === "w" ? w : i + 1}${kind}`).join(", "),
        // It's intended to keep `src` the last attribute because React updates
        // attributes in order. If we keep `src` the first one, Safari will
        // immediately start to fetch `src`, before `sizes` and `srcSet` are even
        // updated by React. That causes multiple unnecessary requests if `srcSet`
        // and `sizes` are defined.
        // This bug cannot be reproduced in Chrome or Firefox.
        src: loader({
          config,
          src,
          quality,
          width: widths[last]
        })
      };
    }
    function getImgProps({ src, sizes, unoptimized = false, priority = false, preload = false, loading, className, quality, width, height, fill = false, style, overrideSrc, onLoad, onLoadingComplete, placeholder = "empty", blurDataURL, fetchPriority, decoding = "async", layout, objectFit, objectPosition, lazyBoundary, lazyRoot, ...rest }, _state) {
      const { imgConf, showAltText, blurComplete, defaultLoader } = _state;
      let config;
      let c = imgConf || _imageconfig.imageConfigDefault;
      if ("allSizes" in c) {
        config = c;
      } else {
        const allSizes = [
          ...c.deviceSizes,
          ...c.imageSizes
        ].sort((a, b) => a - b);
        const deviceSizes = c.deviceSizes.sort((a, b) => a - b);
        const qualities = c.qualities?.sort((a, b) => a - b);
        config = {
          ...c,
          allSizes,
          deviceSizes,
          qualities
        };
      }
      if (typeof defaultLoader === "undefined") {
        throw Object.defineProperty(new Error("images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config"), "__NEXT_ERROR_CODE", {
          value: "E163",
          enumerable: false,
          configurable: true
        });
      }
      let loader = rest.loader || defaultLoader;
      delete rest.loader;
      delete rest.srcSet;
      const isDefaultLoader = "__next_img_default" in loader;
      if (isDefaultLoader) {
        if (config.loader === "custom") {
          throw Object.defineProperty(new Error(`Image with src "${src}" is missing "loader" prop.
Read more: https://nextjs.org/docs/messages/next-image-missing-loader`), "__NEXT_ERROR_CODE", {
            value: "E252",
            enumerable: false,
            configurable: true
          });
        }
      } else {
        const customImageLoader = loader;
        loader = (obj) => {
          const { config: _, ...opts } = obj;
          return customImageLoader(opts);
        };
      }
      if (layout) {
        if (layout === "fill") {
          fill = true;
        }
        const layoutToStyle = {
          intrinsic: {
            maxWidth: "100%",
            height: "auto"
          },
          responsive: {
            width: "100%",
            height: "auto"
          }
        };
        const layoutToSizes = {
          responsive: "100vw",
          fill: "100vw"
        };
        const layoutStyle = layoutToStyle[layout];
        if (layoutStyle) {
          style = {
            ...style,
            ...layoutStyle
          };
        }
        const layoutSizes = layoutToSizes[layout];
        if (layoutSizes && !sizes) {
          sizes = layoutSizes;
        }
      }
      let staticSrc = "";
      let widthInt = getInt(width);
      let heightInt = getInt(height);
      let blurWidth;
      let blurHeight;
      if (isStaticImport(src)) {
        const staticImageData = isStaticRequire(src) ? src.default : src;
        if (!staticImageData.src) {
          throw Object.defineProperty(new Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ${JSON.stringify(staticImageData)}`), "__NEXT_ERROR_CODE", {
            value: "E460",
            enumerable: false,
            configurable: true
          });
        }
        if (!staticImageData.height || !staticImageData.width) {
          throw Object.defineProperty(new Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ${JSON.stringify(staticImageData)}`), "__NEXT_ERROR_CODE", {
            value: "E48",
            enumerable: false,
            configurable: true
          });
        }
        blurWidth = staticImageData.blurWidth;
        blurHeight = staticImageData.blurHeight;
        blurDataURL = blurDataURL || staticImageData.blurDataURL;
        staticSrc = staticImageData.src;
        if (!fill) {
          if (!widthInt && !heightInt) {
            widthInt = staticImageData.width;
            heightInt = staticImageData.height;
          } else if (widthInt && !heightInt) {
            const ratio = widthInt / staticImageData.width;
            heightInt = Math.round(staticImageData.height * ratio);
          } else if (!widthInt && heightInt) {
            const ratio = heightInt / staticImageData.height;
            widthInt = Math.round(staticImageData.width * ratio);
          }
        }
      }
      src = typeof src === "string" ? src : staticSrc;
      let isLazy = !priority && !preload && (loading === "lazy" || typeof loading === "undefined");
      if (!src || src.startsWith("data:") || src.startsWith("blob:")) {
        unoptimized = true;
        isLazy = false;
      }
      if (config.unoptimized) {
        unoptimized = true;
      }
      if (isDefaultLoader && !config.dangerouslyAllowSVG && src.split("?", 1)[0].endsWith(".svg")) {
        unoptimized = true;
      }
      const qualityInt = getInt(quality);
      if (process.env.NODE_ENV !== "production") {
        if (config.output === "export" && isDefaultLoader && !unoptimized) {
          throw Object.defineProperty(new Error(`Image Optimization using the default loader is not compatible with \`{ output: 'export' }\`.
  Possible solutions:
    - Remove \`{ output: 'export' }\` and run "next start" to run server mode including the Image Optimization API.
    - Configure \`{ images: { unoptimized: true } }\` in \`next.config.js\` to disable the Image Optimization API.
  Read more: https://nextjs.org/docs/messages/export-image-api`), "__NEXT_ERROR_CODE", {
            value: "E500",
            enumerable: false,
            configurable: true
          });
        }
        if (!src) {
          unoptimized = true;
        } else {
          if (fill) {
            if (width) {
              throw Object.defineProperty(new Error(`Image with src "${src}" has both "width" and "fill" properties. Only one should be used.`), "__NEXT_ERROR_CODE", {
                value: "E96",
                enumerable: false,
                configurable: true
              });
            }
            if (height) {
              throw Object.defineProperty(new Error(`Image with src "${src}" has both "height" and "fill" properties. Only one should be used.`), "__NEXT_ERROR_CODE", {
                value: "E115",
                enumerable: false,
                configurable: true
              });
            }
            if (style?.position && style.position !== "absolute") {
              throw Object.defineProperty(new Error(`Image with src "${src}" has both "fill" and "style.position" properties. Images with "fill" always use position absolute - it cannot be modified.`), "__NEXT_ERROR_CODE", {
                value: "E216",
                enumerable: false,
                configurable: true
              });
            }
            if (style?.width && style.width !== "100%") {
              throw Object.defineProperty(new Error(`Image with src "${src}" has both "fill" and "style.width" properties. Images with "fill" always use width 100% - it cannot be modified.`), "__NEXT_ERROR_CODE", {
                value: "E73",
                enumerable: false,
                configurable: true
              });
            }
            if (style?.height && style.height !== "100%") {
              throw Object.defineProperty(new Error(`Image with src "${src}" has both "fill" and "style.height" properties. Images with "fill" always use height 100% - it cannot be modified.`), "__NEXT_ERROR_CODE", {
                value: "E404",
                enumerable: false,
                configurable: true
              });
            }
          } else {
            if (typeof widthInt === "undefined") {
              throw Object.defineProperty(new Error(`Image with src "${src}" is missing required "width" property.`), "__NEXT_ERROR_CODE", {
                value: "E451",
                enumerable: false,
                configurable: true
              });
            } else if (isNaN(widthInt)) {
              throw Object.defineProperty(new Error(`Image with src "${src}" has invalid "width" property. Expected a numeric value in pixels but received "${width}".`), "__NEXT_ERROR_CODE", {
                value: "E66",
                enumerable: false,
                configurable: true
              });
            }
            if (typeof heightInt === "undefined") {
              throw Object.defineProperty(new Error(`Image with src "${src}" is missing required "height" property.`), "__NEXT_ERROR_CODE", {
                value: "E397",
                enumerable: false,
                configurable: true
              });
            } else if (isNaN(heightInt)) {
              throw Object.defineProperty(new Error(`Image with src "${src}" has invalid "height" property. Expected a numeric value in pixels but received "${height}".`), "__NEXT_ERROR_CODE", {
                value: "E444",
                enumerable: false,
                configurable: true
              });
            }
            if (/^[\x00-\x20]/.test(src)) {
              throw Object.defineProperty(new Error(`Image with src "${src}" cannot start with a space or control character. Use src.trimStart() to remove it or encodeURIComponent(src) to keep it.`), "__NEXT_ERROR_CODE", {
                value: "E176",
                enumerable: false,
                configurable: true
              });
            }
            if (/[\x00-\x20]$/.test(src)) {
              throw Object.defineProperty(new Error(`Image with src "${src}" cannot end with a space or control character. Use src.trimEnd() to remove it or encodeURIComponent(src) to keep it.`), "__NEXT_ERROR_CODE", {
                value: "E21",
                enumerable: false,
                configurable: true
              });
            }
          }
        }
        if (!VALID_LOADING_VALUES.includes(loading)) {
          throw Object.defineProperty(new Error(`Image with src "${src}" has invalid "loading" property. Provided "${loading}" should be one of ${VALID_LOADING_VALUES.map(String).join(",")}.`), "__NEXT_ERROR_CODE", {
            value: "E357",
            enumerable: false,
            configurable: true
          });
        }
        if (priority && loading === "lazy") {
          throw Object.defineProperty(new Error(`Image with src "${src}" has both "priority" and "loading='lazy'" properties. Only one should be used.`), "__NEXT_ERROR_CODE", {
            value: "E218",
            enumerable: false,
            configurable: true
          });
        }
        if (preload && loading === "lazy") {
          throw Object.defineProperty(new Error(`Image with src "${src}" has both "preload" and "loading='lazy'" properties. Only one should be used.`), "__NEXT_ERROR_CODE", {
            value: "E803",
            enumerable: false,
            configurable: true
          });
        }
        if (preload && priority) {
          throw Object.defineProperty(new Error(`Image with src "${src}" has both "preload" and "priority" properties. Only "preload" should be used.`), "__NEXT_ERROR_CODE", {
            value: "E802",
            enumerable: false,
            configurable: true
          });
        }
        if (placeholder !== "empty" && placeholder !== "blur" && !placeholder.startsWith("data:image/")) {
          throw Object.defineProperty(new Error(`Image with src "${src}" has invalid "placeholder" property "${placeholder}".`), "__NEXT_ERROR_CODE", {
            value: "E431",
            enumerable: false,
            configurable: true
          });
        }
        if (placeholder !== "empty") {
          if (widthInt && heightInt && widthInt * heightInt < 1600) {
            (0, _warnonce.warnOnce)(`Image with src "${src}" is smaller than 40x40. Consider removing the "placeholder" property to improve performance.`);
          }
        }
        if (qualityInt && config.qualities && !config.qualities.includes(qualityInt)) {
          (0, _warnonce.warnOnce)(`Image with src "${src}" is using quality "${qualityInt}" which is not configured in images.qualities [${config.qualities.join(", ")}]. Please update your config to [${[
            ...config.qualities,
            qualityInt
          ].sort().join(", ")}].
Read more: https://nextjs.org/docs/messages/next-image-unconfigured-qualities`);
        }
        if (placeholder === "blur" && !blurDataURL) {
          const VALID_BLUR_EXT = [
            "jpeg",
            "png",
            "webp",
            "avif"
          ];
          throw Object.defineProperty(new Error(`Image with src "${src}" has "placeholder='blur'" property but is missing the "blurDataURL" property.
        Possible solutions:
          - Add a "blurDataURL" property, the contents should be a small Data URL to represent the image
          - Change the "src" property to a static import with one of the supported file types: ${VALID_BLUR_EXT.join(",")} (animated images not supported)
          - Remove the "placeholder" property, effectively no blur effect
        Read more: https://nextjs.org/docs/messages/placeholder-blur-data-url`), "__NEXT_ERROR_CODE", {
            value: "E371",
            enumerable: false,
            configurable: true
          });
        }
        if ("ref" in rest) {
          (0, _warnonce.warnOnce)(`Image with src "${src}" is using unsupported "ref" property. Consider using the "onLoad" property instead.`);
        }
        if (!unoptimized && !isDefaultLoader) {
          const urlStr = loader({
            config,
            src,
            width: widthInt || 400,
            quality: qualityInt || 75
          });
          let url;
          try {
            url = new URL(urlStr);
          } catch (err) {
          }
          if (urlStr === src || url && url.pathname === src && !url.search) {
            (0, _warnonce.warnOnce)(`Image with src "${src}" has a "loader" property that does not implement width. Please implement it or use the "unoptimized" property instead.
Read more: https://nextjs.org/docs/messages/next-image-missing-loader-width`);
          }
        }
        if (onLoadingComplete) {
          (0, _warnonce.warnOnce)(`Image with src "${src}" is using deprecated "onLoadingComplete" property. Please use the "onLoad" property instead.`);
        }
        for (const [legacyKey, legacyValue] of Object.entries({
          layout,
          objectFit,
          objectPosition,
          lazyBoundary,
          lazyRoot
        })) {
          if (legacyValue) {
            (0, _warnonce.warnOnce)(`Image with src "${src}" has legacy prop "${legacyKey}". Did you forget to run the codemod?
Read more: https://nextjs.org/docs/messages/next-image-upgrade-to-13`);
          }
        }
        if (typeof window !== "undefined" && !perfObserver && window.PerformanceObserver) {
          perfObserver = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              const imgSrc = entry?.element?.src || "";
              const lcpImage = allImgs.get(imgSrc);
              if (lcpImage && lcpImage.loading === "lazy" && lcpImage.placeholder === "empty" && !lcpImage.src.startsWith("data:") && !lcpImage.src.startsWith("blob:")) {
                (0, _warnonce.warnOnce)(`Image with src "${lcpImage.src}" was detected as the Largest Contentful Paint (LCP). Please add the \`loading="eager"\` property if this image is above the fold.
Read more: https://nextjs.org/docs/app/api-reference/components/image#loading`);
              }
            }
          });
          try {
            perfObserver.observe({
              type: "largest-contentful-paint",
              buffered: true
            });
          } catch (err) {
            console.error(err);
          }
        }
      }
      const imgStyle = Object.assign(fill ? {
        position: "absolute",
        height: "100%",
        width: "100%",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        objectFit,
        objectPosition
      } : {}, showAltText ? {} : {
        color: "transparent"
      }, style);
      const backgroundImage = !blurComplete && placeholder !== "empty" ? placeholder === "blur" ? `url("data:image/svg+xml;charset=utf-8,${(0, _imageblursvg.getImageBlurSvg)({
        widthInt,
        heightInt,
        blurWidth,
        blurHeight,
        blurDataURL: blurDataURL || "",
        objectFit: imgStyle.objectFit
      })}")` : `url("${placeholder}")` : null;
      const backgroundSize = !INVALID_BACKGROUND_SIZE_VALUES.includes(imgStyle.objectFit) ? imgStyle.objectFit : imgStyle.objectFit === "fill" ? "100% 100%" : "cover";
      let placeholderStyle = backgroundImage ? {
        backgroundSize,
        backgroundPosition: imgStyle.objectPosition || "50% 50%",
        backgroundRepeat: "no-repeat",
        backgroundImage
      } : {};
      if (process.env.NODE_ENV === "development") {
        if (placeholderStyle.backgroundImage && placeholder === "blur" && blurDataURL?.startsWith("/")) {
          placeholderStyle.backgroundImage = `url("${blurDataURL}")`;
        }
      }
      const imgAttributes = generateImgAttrs({
        config,
        src,
        unoptimized,
        width: widthInt,
        quality: qualityInt,
        sizes,
        loader
      });
      const loadingFinal = isLazy ? "lazy" : loading;
      if (process.env.NODE_ENV !== "production") {
        if (typeof window !== "undefined") {
          let fullUrl;
          try {
            fullUrl = new URL(imgAttributes.src);
          } catch (e) {
            fullUrl = new URL(imgAttributes.src, window.location.href);
          }
          allImgs.set(fullUrl.href, {
            src,
            loading: loadingFinal,
            placeholder
          });
        }
      }
      const props = {
        ...rest,
        loading: loadingFinal,
        fetchPriority,
        width: widthInt,
        height: heightInt,
        decoding,
        className,
        style: {
          ...imgStyle,
          ...placeholderStyle
        },
        sizes: imgAttributes.sizes,
        srcSet: imgAttributes.srcSet,
        src: overrideSrc || imgAttributes.src
      };
      const meta = {
        unoptimized,
        preload: preload || priority,
        placeholder,
        fill
      };
      return {
        props,
        meta
      };
    }
  }
});

// ../../node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs
var require_interop_require_wildcard = __commonJS({
  "../../node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs"(exports2) {
    "use strict";
    function _getRequireWildcardCache(nodeInterop) {
      if (typeof WeakMap !== "function") return null;
      var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
      var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
      return (_getRequireWildcardCache = function(nodeInterop2) {
        return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
      })(nodeInterop);
    }
    function _interop_require_wildcard(obj, nodeInterop) {
      if (!nodeInterop && obj && obj.__esModule) return obj;
      if (obj === null || typeof obj !== "object" && typeof obj !== "function") return { default: obj };
      var cache = _getRequireWildcardCache(nodeInterop);
      if (cache && cache.has(obj)) return cache.get(obj);
      var newObj = { __proto__: null };
      var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var key in obj) {
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
          if (desc && (desc.get || desc.set)) Object.defineProperty(newObj, key, desc);
          else newObj[key] = obj[key];
        }
      }
      newObj.default = obj;
      if (cache) cache.set(obj, newObj);
      return newObj;
    }
    exports2._ = _interop_require_wildcard;
  }
});

// ../../node_modules/next/dist/shared/lib/side-effect.js
var require_side_effect = __commonJS({
  "../../node_modules/next/dist/shared/lib/side-effect.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    Object.defineProperty(exports2, "default", {
      enumerable: true,
      get: function() {
        return SideEffect;
      }
    });
    var _react = require("react");
    var isServer = typeof window === "undefined";
    var useClientOnlyLayoutEffect = isServer ? () => {
    } : _react.useLayoutEffect;
    var useClientOnlyEffect = isServer ? () => {
    } : _react.useEffect;
    function SideEffect(props) {
      const { headManager, reduceComponentsToState } = props;
      function emitChange() {
        if (headManager && headManager.mountedInstances) {
          const headElements = _react.Children.toArray(Array.from(headManager.mountedInstances).filter(Boolean));
          headManager.updateHead(reduceComponentsToState(headElements));
        }
      }
      if (isServer) {
        headManager?.mountedInstances?.add(props.children);
        emitChange();
      }
      useClientOnlyLayoutEffect(() => {
        headManager?.mountedInstances?.add(props.children);
        return () => {
          headManager?.mountedInstances?.delete(props.children);
        };
      });
      useClientOnlyLayoutEffect(() => {
        if (headManager) {
          headManager._pendingUpdate = emitChange;
        }
        return () => {
          if (headManager) {
            headManager._pendingUpdate = emitChange;
          }
        };
      });
      useClientOnlyEffect(() => {
        if (headManager && headManager._pendingUpdate) {
          headManager._pendingUpdate();
          headManager._pendingUpdate = null;
        }
        return () => {
          if (headManager && headManager._pendingUpdate) {
            headManager._pendingUpdate();
            headManager._pendingUpdate = null;
          }
        };
      });
      return null;
    }
  }
});

// ../../node_modules/next/dist/shared/lib/head-manager-context.shared-runtime.js
var require_head_manager_context_shared_runtime = __commonJS({
  "../../node_modules/next/dist/shared/lib/head-manager-context.shared-runtime.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    Object.defineProperty(exports2, "HeadManagerContext", {
      enumerable: true,
      get: function() {
        return HeadManagerContext;
      }
    });
    var _interop_require_default = require_interop_require_default();
    var _react = /* @__PURE__ */ _interop_require_default._(require("react"));
    var HeadManagerContext = _react.default.createContext({});
    if (process.env.NODE_ENV !== "production") {
      HeadManagerContext.displayName = "HeadManagerContext";
    }
  }
});

// ../../node_modules/next/dist/shared/lib/head.js
var require_head = __commonJS({
  "../../node_modules/next/dist/shared/lib/head.js"(exports2, module2) {
    "use strict";
    "use client";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    function _export(target, all) {
      for (var name in all) Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
      });
    }
    _export(exports2, {
      default: function() {
        return _default;
      },
      defaultHead: function() {
        return defaultHead;
      }
    });
    var _interop_require_default = require_interop_require_default();
    var _interop_require_wildcard = require_interop_require_wildcard();
    var _jsxruntime = require("react/jsx-runtime");
    var _react = /* @__PURE__ */ _interop_require_wildcard._(require("react"));
    var _sideeffect = /* @__PURE__ */ _interop_require_default._(require_side_effect());
    var _headmanagercontextsharedruntime = require_head_manager_context_shared_runtime();
    var _warnonce = require_warn_once();
    function defaultHead() {
      const head = [
        /* @__PURE__ */ (0, _jsxruntime.jsx)("meta", {
          charSet: "utf-8"
        }, "charset"),
        /* @__PURE__ */ (0, _jsxruntime.jsx)("meta", {
          name: "viewport",
          content: "width=device-width"
        }, "viewport")
      ];
      return head;
    }
    function onlyReactElement(list, child) {
      if (typeof child === "string" || typeof child === "number") {
        return list;
      }
      if (child.type === _react.default.Fragment) {
        return list.concat(
          // @ts-expect-error @types/react does not remove fragments but this could also return ReactPortal[]
          _react.default.Children.toArray(child.props.children).reduce(
            // @ts-expect-error @types/react does not remove fragments but this could also return ReactPortal[]
            (fragmentList, fragmentChild) => {
              if (typeof fragmentChild === "string" || typeof fragmentChild === "number") {
                return fragmentList;
              }
              return fragmentList.concat(fragmentChild);
            },
            []
          )
        );
      }
      return list.concat(child);
    }
    var METATYPES = [
      "name",
      "httpEquiv",
      "charSet",
      "itemProp"
    ];
    function unique() {
      const keys = /* @__PURE__ */ new Set();
      const tags = /* @__PURE__ */ new Set();
      const metaTypes = /* @__PURE__ */ new Set();
      const metaCategories = {};
      return (h) => {
        let isUnique = true;
        let hasKey = false;
        if (h.key && typeof h.key !== "number" && h.key.indexOf("$") > 0) {
          hasKey = true;
          const key = h.key.slice(h.key.indexOf("$") + 1);
          if (keys.has(key)) {
            isUnique = false;
          } else {
            keys.add(key);
          }
        }
        switch (h.type) {
          case "title":
          case "base":
            if (tags.has(h.type)) {
              isUnique = false;
            } else {
              tags.add(h.type);
            }
            break;
          case "meta":
            for (let i = 0, len = METATYPES.length; i < len; i++) {
              const metatype = METATYPES[i];
              if (!h.props.hasOwnProperty(metatype)) continue;
              if (metatype === "charSet") {
                if (metaTypes.has(metatype)) {
                  isUnique = false;
                } else {
                  metaTypes.add(metatype);
                }
              } else {
                const category = h.props[metatype];
                const categories = metaCategories[metatype] || /* @__PURE__ */ new Set();
                if ((metatype !== "name" || !hasKey) && categories.has(category)) {
                  isUnique = false;
                } else {
                  categories.add(category);
                  metaCategories[metatype] = categories;
                }
              }
            }
            break;
        }
        return isUnique;
      };
    }
    function reduceComponents(headChildrenElements) {
      return headChildrenElements.reduce(onlyReactElement, []).reverse().concat(defaultHead().reverse()).filter(unique()).reverse().map((c, i) => {
        const key = c.key || i;
        if (process.env.NODE_ENV === "development") {
          if (c.type === "script" && c.props["type"] !== "application/ld+json") {
            const srcMessage = c.props["src"] ? `<script> tag with src="${c.props["src"]}"` : `inline <script>`;
            (0, _warnonce.warnOnce)(`Do not add <script> tags using next/head (see ${srcMessage}). Use next/script instead. 
See more info here: https://nextjs.org/docs/messages/no-script-tags-in-head-component`);
          } else if (c.type === "link" && c.props["rel"] === "stylesheet") {
            (0, _warnonce.warnOnce)(`Do not add stylesheets using next/head (see <link rel="stylesheet"> tag with href="${c.props["href"]}"). Use Document instead. 
See more info here: https://nextjs.org/docs/messages/no-stylesheets-in-head-component`);
          }
        }
        return /* @__PURE__ */ _react.default.cloneElement(c, {
          key
        });
      });
    }
    function Head({ children }) {
      const headManager = (0, _react.useContext)(_headmanagercontextsharedruntime.HeadManagerContext);
      return /* @__PURE__ */ (0, _jsxruntime.jsx)(_sideeffect.default, {
        reduceComponentsToState: reduceComponents,
        headManager,
        children
      });
    }
    var _default = Head;
    if ((typeof exports2.default === "function" || typeof exports2.default === "object" && exports2.default !== null) && typeof exports2.default.__esModule === "undefined") {
      Object.defineProperty(exports2.default, "__esModule", { value: true });
      Object.assign(exports2.default, exports2);
      module2.exports = exports2.default;
    }
  }
});

// ../../node_modules/next/dist/shared/lib/image-config-context.shared-runtime.js
var require_image_config_context_shared_runtime = __commonJS({
  "../../node_modules/next/dist/shared/lib/image-config-context.shared-runtime.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    Object.defineProperty(exports2, "ImageConfigContext", {
      enumerable: true,
      get: function() {
        return ImageConfigContext;
      }
    });
    var _interop_require_default = require_interop_require_default();
    var _react = /* @__PURE__ */ _interop_require_default._(require("react"));
    var _imageconfig = require_image_config();
    var ImageConfigContext = _react.default.createContext(_imageconfig.imageConfigDefault);
    if (process.env.NODE_ENV !== "production") {
      ImageConfigContext.displayName = "ImageConfigContext";
    }
  }
});

// ../../node_modules/next/dist/shared/lib/router-context.shared-runtime.js
var require_router_context_shared_runtime = __commonJS({
  "../../node_modules/next/dist/shared/lib/router-context.shared-runtime.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    Object.defineProperty(exports2, "RouterContext", {
      enumerable: true,
      get: function() {
        return RouterContext;
      }
    });
    var _interop_require_default = require_interop_require_default();
    var _react = /* @__PURE__ */ _interop_require_default._(require("react"));
    var RouterContext = _react.default.createContext(null);
    if (process.env.NODE_ENV !== "production") {
      RouterContext.displayName = "RouterContext";
    }
  }
});

// ../../node_modules/next/dist/shared/lib/find-closest-quality.js
var require_find_closest_quality = __commonJS({
  "../../node_modules/next/dist/shared/lib/find-closest-quality.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    Object.defineProperty(exports2, "findClosestQuality", {
      enumerable: true,
      get: function() {
        return findClosestQuality;
      }
    });
    function findClosestQuality(quality, config) {
      const q = quality || 75;
      if (!config?.qualities?.length) {
        return q;
      }
      return config.qualities.reduce((prev, cur) => Math.abs(cur - q) < Math.abs(prev - q) ? cur : prev, 0);
    }
  }
});

// ../../node_modules/next/dist/compiled/picomatch/index.js
var require_picomatch = __commonJS({
  "../../node_modules/next/dist/compiled/picomatch/index.js"(exports2, module2) {
    "use strict";
    (() => {
      "use strict";
      var t = { 170: (t2, e2, u2) => {
        const n = u2(510);
        const isWindows = () => {
          if (typeof navigator !== "undefined" && navigator.platform) {
            const t3 = navigator.platform.toLowerCase();
            return t3 === "win32" || t3 === "windows";
          }
          if (typeof process !== "undefined" && process.platform) {
            return process.platform === "win32";
          }
          return false;
        };
        function picomatch(t3, e3, u3 = false) {
          if (e3 && (e3.windows === null || e3.windows === void 0)) {
            e3 = { ...e3, windows: isWindows() };
          }
          return n(t3, e3, u3);
        }
        Object.assign(picomatch, n);
        t2.exports = picomatch;
      }, 154: (t2) => {
        const e2 = "\\\\/";
        const u2 = `[^${e2}]`;
        const n = "\\.";
        const o = "\\+";
        const s = "\\?";
        const r = "\\/";
        const a = "(?=.)";
        const i = "[^/]";
        const c = `(?:${r}|$)`;
        const p = `(?:^|${r})`;
        const l = `${n}{1,2}${c}`;
        const f = `(?!${n})`;
        const A = `(?!${p}${l})`;
        const _ = `(?!${n}{0,1}${c})`;
        const R = `(?!${l})`;
        const E = `[^.${r}]`;
        const h = `${i}*?`;
        const g = "/";
        const b = { DOT_LITERAL: n, PLUS_LITERAL: o, QMARK_LITERAL: s, SLASH_LITERAL: r, ONE_CHAR: a, QMARK: i, END_ANCHOR: c, DOTS_SLASH: l, NO_DOT: f, NO_DOTS: A, NO_DOT_SLASH: _, NO_DOTS_SLASH: R, QMARK_NO_DOT: E, STAR: h, START_ANCHOR: p, SEP: g };
        const C = { ...b, SLASH_LITERAL: `[${e2}]`, QMARK: u2, STAR: `${u2}*?`, DOTS_SLASH: `${n}{1,2}(?:[${e2}]|$)`, NO_DOT: `(?!${n})`, NO_DOTS: `(?!(?:^|[${e2}])${n}{1,2}(?:[${e2}]|$))`, NO_DOT_SLASH: `(?!${n}{0,1}(?:[${e2}]|$))`, NO_DOTS_SLASH: `(?!${n}{1,2}(?:[${e2}]|$))`, QMARK_NO_DOT: `[^.${e2}]`, START_ANCHOR: `(?:^|[${e2}])`, END_ANCHOR: `(?:[${e2}]|$)`, SEP: "\\" };
        const y = { alnum: "a-zA-Z0-9", alpha: "a-zA-Z", ascii: "\\x00-\\x7F", blank: " \\t", cntrl: "\\x00-\\x1F\\x7F", digit: "0-9", graph: "\\x21-\\x7E", lower: "a-z", print: "\\x20-\\x7E ", punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~", space: " \\t\\r\\n\\v\\f", upper: "A-Z", word: "A-Za-z0-9_", xdigit: "A-Fa-f0-9" };
        t2.exports = { MAX_LENGTH: 1024 * 64, POSIX_REGEX_SOURCE: y, REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g, REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/, REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/, REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g, REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g, REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g, REPLACEMENTS: { "***": "*", "**/**": "**", "**/**/**": "**" }, CHAR_0: 48, CHAR_9: 57, CHAR_UPPERCASE_A: 65, CHAR_LOWERCASE_A: 97, CHAR_UPPERCASE_Z: 90, CHAR_LOWERCASE_Z: 122, CHAR_LEFT_PARENTHESES: 40, CHAR_RIGHT_PARENTHESES: 41, CHAR_ASTERISK: 42, CHAR_AMPERSAND: 38, CHAR_AT: 64, CHAR_BACKWARD_SLASH: 92, CHAR_CARRIAGE_RETURN: 13, CHAR_CIRCUMFLEX_ACCENT: 94, CHAR_COLON: 58, CHAR_COMMA: 44, CHAR_DOT: 46, CHAR_DOUBLE_QUOTE: 34, CHAR_EQUAL: 61, CHAR_EXCLAMATION_MARK: 33, CHAR_FORM_FEED: 12, CHAR_FORWARD_SLASH: 47, CHAR_GRAVE_ACCENT: 96, CHAR_HASH: 35, CHAR_HYPHEN_MINUS: 45, CHAR_LEFT_ANGLE_BRACKET: 60, CHAR_LEFT_CURLY_BRACE: 123, CHAR_LEFT_SQUARE_BRACKET: 91, CHAR_LINE_FEED: 10, CHAR_NO_BREAK_SPACE: 160, CHAR_PERCENT: 37, CHAR_PLUS: 43, CHAR_QUESTION_MARK: 63, CHAR_RIGHT_ANGLE_BRACKET: 62, CHAR_RIGHT_CURLY_BRACE: 125, CHAR_RIGHT_SQUARE_BRACKET: 93, CHAR_SEMICOLON: 59, CHAR_SINGLE_QUOTE: 39, CHAR_SPACE: 32, CHAR_TAB: 9, CHAR_UNDERSCORE: 95, CHAR_VERTICAL_LINE: 124, CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279, extglobChars(t3) {
          return { "!": { type: "negate", open: "(?:(?!(?:", close: `))${t3.STAR})` }, "?": { type: "qmark", open: "(?:", close: ")?" }, "+": { type: "plus", open: "(?:", close: ")+" }, "*": { type: "star", open: "(?:", close: ")*" }, "@": { type: "at", open: "(?:", close: ")" } };
        }, globChars(t3) {
          return t3 === true ? C : b;
        } };
      }, 697: (t2, e2, u2) => {
        const n = u2(154);
        const o = u2(96);
        const { MAX_LENGTH: s, POSIX_REGEX_SOURCE: r, REGEX_NON_SPECIAL_CHARS: a, REGEX_SPECIAL_CHARS_BACKREF: i, REPLACEMENTS: c } = n;
        const expandRange = (t3, e3) => {
          if (typeof e3.expandRange === "function") {
            return e3.expandRange(...t3, e3);
          }
          t3.sort();
          const u3 = `[${t3.join("-")}]`;
          try {
            new RegExp(u3);
          } catch (e4) {
            return t3.map(((t4) => o.escapeRegex(t4))).join("..");
          }
          return u3;
        };
        const syntaxError = (t3, e3) => `Missing ${t3}: "${e3}" - use "\\\\${e3}" to match literal characters`;
        const parse = (t3, e3) => {
          if (typeof t3 !== "string") {
            throw new TypeError("Expected a string");
          }
          t3 = c[t3] || t3;
          const u3 = { ...e3 };
          const p = typeof u3.maxLength === "number" ? Math.min(s, u3.maxLength) : s;
          let l = t3.length;
          if (l > p) {
            throw new SyntaxError(`Input length: ${l}, exceeds maximum allowed length: ${p}`);
          }
          const f = { type: "bos", value: "", output: u3.prepend || "" };
          const A = [f];
          const _ = u3.capture ? "" : "?:";
          const R = n.globChars(u3.windows);
          const E = n.extglobChars(R);
          const { DOT_LITERAL: h, PLUS_LITERAL: g, SLASH_LITERAL: b, ONE_CHAR: C, DOTS_SLASH: y, NO_DOT: $, NO_DOT_SLASH: x, NO_DOTS_SLASH: S, QMARK: H, QMARK_NO_DOT: v, STAR: d, START_ANCHOR: L } = R;
          const globstar = (t4) => `(${_}(?:(?!${L}${t4.dot ? y : h}).)*?)`;
          const T = u3.dot ? "" : $;
          const O = u3.dot ? H : v;
          let k = u3.bash === true ? globstar(u3) : d;
          if (u3.capture) {
            k = `(${k})`;
          }
          if (typeof u3.noext === "boolean") {
            u3.noextglob = u3.noext;
          }
          const m = { input: t3, index: -1, start: 0, dot: u3.dot === true, consumed: "", output: "", prefix: "", backtrack: false, negated: false, brackets: 0, braces: 0, parens: 0, quotes: 0, globstar: false, tokens: A };
          t3 = o.removePrefix(t3, m);
          l = t3.length;
          const w = [];
          const N = [];
          const I = [];
          let B = f;
          let G;
          const eos = () => m.index === l - 1;
          const D = m.peek = (e4 = 1) => t3[m.index + e4];
          const M = m.advance = () => t3[++m.index] || "";
          const remaining = () => t3.slice(m.index + 1);
          const consume = (t4 = "", e4 = 0) => {
            m.consumed += t4;
            m.index += e4;
          };
          const append = (t4) => {
            m.output += t4.output != null ? t4.output : t4.value;
            consume(t4.value);
          };
          const negate = () => {
            let t4 = 1;
            while (D() === "!" && (D(2) !== "(" || D(3) === "?")) {
              M();
              m.start++;
              t4++;
            }
            if (t4 % 2 === 0) {
              return false;
            }
            m.negated = true;
            m.start++;
            return true;
          };
          const increment = (t4) => {
            m[t4]++;
            I.push(t4);
          };
          const decrement = (t4) => {
            m[t4]--;
            I.pop();
          };
          const push = (t4) => {
            if (B.type === "globstar") {
              const e4 = m.braces > 0 && (t4.type === "comma" || t4.type === "brace");
              const u4 = t4.extglob === true || w.length && (t4.type === "pipe" || t4.type === "paren");
              if (t4.type !== "slash" && t4.type !== "paren" && !e4 && !u4) {
                m.output = m.output.slice(0, -B.output.length);
                B.type = "star";
                B.value = "*";
                B.output = k;
                m.output += B.output;
              }
            }
            if (w.length && t4.type !== "paren") {
              w[w.length - 1].inner += t4.value;
            }
            if (t4.value || t4.output) append(t4);
            if (B && B.type === "text" && t4.type === "text") {
              B.output = (B.output || B.value) + t4.value;
              B.value += t4.value;
              return;
            }
            t4.prev = B;
            A.push(t4);
            B = t4;
          };
          const extglobOpen = (t4, e4) => {
            const n2 = { ...E[e4], conditions: 1, inner: "" };
            n2.prev = B;
            n2.parens = m.parens;
            n2.output = m.output;
            const o2 = (u3.capture ? "(" : "") + n2.open;
            increment("parens");
            push({ type: t4, value: e4, output: m.output ? "" : C });
            push({ type: "paren", extglob: true, value: M(), output: o2 });
            w.push(n2);
          };
          const extglobClose = (t4) => {
            let n2 = t4.close + (u3.capture ? ")" : "");
            let o2;
            if (t4.type === "negate") {
              let s2 = k;
              if (t4.inner && t4.inner.length > 1 && t4.inner.includes("/")) {
                s2 = globstar(u3);
              }
              if (s2 !== k || eos() || /^\)+$/.test(remaining())) {
                n2 = t4.close = `)$))${s2}`;
              }
              if (t4.inner.includes("*") && (o2 = remaining()) && /^\.[^\\/.]+$/.test(o2)) {
                const u4 = parse(o2, { ...e3, fastpaths: false }).output;
                n2 = t4.close = `)${u4})${s2})`;
              }
              if (t4.prev.type === "bos") {
                m.negatedExtglob = true;
              }
            }
            push({ type: "paren", extglob: true, value: G, output: n2 });
            decrement("parens");
          };
          if (u3.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(t3)) {
            let n2 = false;
            let s2 = t3.replace(i, ((t4, e4, u4, o2, s3, r2) => {
              if (o2 === "\\") {
                n2 = true;
                return t4;
              }
              if (o2 === "?") {
                if (e4) {
                  return e4 + o2 + (s3 ? H.repeat(s3.length) : "");
                }
                if (r2 === 0) {
                  return O + (s3 ? H.repeat(s3.length) : "");
                }
                return H.repeat(u4.length);
              }
              if (o2 === ".") {
                return h.repeat(u4.length);
              }
              if (o2 === "*") {
                if (e4) {
                  return e4 + o2 + (s3 ? k : "");
                }
                return k;
              }
              return e4 ? t4 : `\\${t4}`;
            }));
            if (n2 === true) {
              if (u3.unescape === true) {
                s2 = s2.replace(/\\/g, "");
              } else {
                s2 = s2.replace(/\\+/g, ((t4) => t4.length % 2 === 0 ? "\\\\" : t4 ? "\\" : ""));
              }
            }
            if (s2 === t3 && u3.contains === true) {
              m.output = t3;
              return m;
            }
            m.output = o.wrapOutput(s2, m, e3);
            return m;
          }
          while (!eos()) {
            G = M();
            if (G === "\0") {
              continue;
            }
            if (G === "\\") {
              const t4 = D();
              if (t4 === "/" && u3.bash !== true) {
                continue;
              }
              if (t4 === "." || t4 === ";") {
                continue;
              }
              if (!t4) {
                G += "\\";
                push({ type: "text", value: G });
                continue;
              }
              const e5 = /^\\+/.exec(remaining());
              let n3 = 0;
              if (e5 && e5[0].length > 2) {
                n3 = e5[0].length;
                m.index += n3;
                if (n3 % 2 !== 0) {
                  G += "\\";
                }
              }
              if (u3.unescape === true) {
                G = M();
              } else {
                G += M();
              }
              if (m.brackets === 0) {
                push({ type: "text", value: G });
                continue;
              }
            }
            if (m.brackets > 0 && (G !== "]" || B.value === "[" || B.value === "[^")) {
              if (u3.posix !== false && G === ":") {
                const t4 = B.value.slice(1);
                if (t4.includes("[")) {
                  B.posix = true;
                  if (t4.includes(":")) {
                    const t5 = B.value.lastIndexOf("[");
                    const e5 = B.value.slice(0, t5);
                    const u4 = B.value.slice(t5 + 2);
                    const n3 = r[u4];
                    if (n3) {
                      B.value = e5 + n3;
                      m.backtrack = true;
                      M();
                      if (!f.output && A.indexOf(B) === 1) {
                        f.output = C;
                      }
                      continue;
                    }
                  }
                }
              }
              if (G === "[" && D() !== ":" || G === "-" && D() === "]") {
                G = `\\${G}`;
              }
              if (G === "]" && (B.value === "[" || B.value === "[^")) {
                G = `\\${G}`;
              }
              if (u3.posix === true && G === "!" && B.value === "[") {
                G = "^";
              }
              B.value += G;
              append({ value: G });
              continue;
            }
            if (m.quotes === 1 && G !== '"') {
              G = o.escapeRegex(G);
              B.value += G;
              append({ value: G });
              continue;
            }
            if (G === '"') {
              m.quotes = m.quotes === 1 ? 0 : 1;
              if (u3.keepQuotes === true) {
                push({ type: "text", value: G });
              }
              continue;
            }
            if (G === "(") {
              increment("parens");
              push({ type: "paren", value: G });
              continue;
            }
            if (G === ")") {
              if (m.parens === 0 && u3.strictBrackets === true) {
                throw new SyntaxError(syntaxError("opening", "("));
              }
              const t4 = w[w.length - 1];
              if (t4 && m.parens === t4.parens + 1) {
                extglobClose(w.pop());
                continue;
              }
              push({ type: "paren", value: G, output: m.parens ? ")" : "\\)" });
              decrement("parens");
              continue;
            }
            if (G === "[") {
              if (u3.nobracket === true || !remaining().includes("]")) {
                if (u3.nobracket !== true && u3.strictBrackets === true) {
                  throw new SyntaxError(syntaxError("closing", "]"));
                }
                G = `\\${G}`;
              } else {
                increment("brackets");
              }
              push({ type: "bracket", value: G });
              continue;
            }
            if (G === "]") {
              if (u3.nobracket === true || B && B.type === "bracket" && B.value.length === 1) {
                push({ type: "text", value: G, output: `\\${G}` });
                continue;
              }
              if (m.brackets === 0) {
                if (u3.strictBrackets === true) {
                  throw new SyntaxError(syntaxError("opening", "["));
                }
                push({ type: "text", value: G, output: `\\${G}` });
                continue;
              }
              decrement("brackets");
              const t4 = B.value.slice(1);
              if (B.posix !== true && t4[0] === "^" && !t4.includes("/")) {
                G = `/${G}`;
              }
              B.value += G;
              append({ value: G });
              if (u3.literalBrackets === false || o.hasRegexChars(t4)) {
                continue;
              }
              const e5 = o.escapeRegex(B.value);
              m.output = m.output.slice(0, -B.value.length);
              if (u3.literalBrackets === true) {
                m.output += e5;
                B.value = e5;
                continue;
              }
              B.value = `(${_}${e5}|${B.value})`;
              m.output += B.value;
              continue;
            }
            if (G === "{" && u3.nobrace !== true) {
              increment("braces");
              const t4 = { type: "brace", value: G, output: "(", outputIndex: m.output.length, tokensIndex: m.tokens.length };
              N.push(t4);
              push(t4);
              continue;
            }
            if (G === "}") {
              const t4 = N[N.length - 1];
              if (u3.nobrace === true || !t4) {
                push({ type: "text", value: G, output: G });
                continue;
              }
              let e5 = ")";
              if (t4.dots === true) {
                const t5 = A.slice();
                const n3 = [];
                for (let e6 = t5.length - 1; e6 >= 0; e6--) {
                  A.pop();
                  if (t5[e6].type === "brace") {
                    break;
                  }
                  if (t5[e6].type !== "dots") {
                    n3.unshift(t5[e6].value);
                  }
                }
                e5 = expandRange(n3, u3);
                m.backtrack = true;
              }
              if (t4.comma !== true && t4.dots !== true) {
                const u4 = m.output.slice(0, t4.outputIndex);
                const n3 = m.tokens.slice(t4.tokensIndex);
                t4.value = t4.output = "\\{";
                G = e5 = "\\}";
                m.output = u4;
                for (const t5 of n3) {
                  m.output += t5.output || t5.value;
                }
              }
              push({ type: "brace", value: G, output: e5 });
              decrement("braces");
              N.pop();
              continue;
            }
            if (G === "|") {
              if (w.length > 0) {
                w[w.length - 1].conditions++;
              }
              push({ type: "text", value: G });
              continue;
            }
            if (G === ",") {
              let t4 = G;
              const e5 = N[N.length - 1];
              if (e5 && I[I.length - 1] === "braces") {
                e5.comma = true;
                t4 = "|";
              }
              push({ type: "comma", value: G, output: t4 });
              continue;
            }
            if (G === "/") {
              if (B.type === "dot" && m.index === m.start + 1) {
                m.start = m.index + 1;
                m.consumed = "";
                m.output = "";
                A.pop();
                B = f;
                continue;
              }
              push({ type: "slash", value: G, output: b });
              continue;
            }
            if (G === ".") {
              if (m.braces > 0 && B.type === "dot") {
                if (B.value === ".") B.output = h;
                const t4 = N[N.length - 1];
                B.type = "dots";
                B.output += G;
                B.value += G;
                t4.dots = true;
                continue;
              }
              if (m.braces + m.parens === 0 && B.type !== "bos" && B.type !== "slash") {
                push({ type: "text", value: G, output: h });
                continue;
              }
              push({ type: "dot", value: G, output: h });
              continue;
            }
            if (G === "?") {
              const t4 = B && B.value === "(";
              if (!t4 && u3.noextglob !== true && D() === "(" && D(2) !== "?") {
                extglobOpen("qmark", G);
                continue;
              }
              if (B && B.type === "paren") {
                const t5 = D();
                let e5 = G;
                if (B.value === "(" && !/[!=<:]/.test(t5) || t5 === "<" && !/<([!=]|\w+>)/.test(remaining())) {
                  e5 = `\\${G}`;
                }
                push({ type: "text", value: G, output: e5 });
                continue;
              }
              if (u3.dot !== true && (B.type === "slash" || B.type === "bos")) {
                push({ type: "qmark", value: G, output: v });
                continue;
              }
              push({ type: "qmark", value: G, output: H });
              continue;
            }
            if (G === "!") {
              if (u3.noextglob !== true && D() === "(") {
                if (D(2) !== "?" || !/[!=<:]/.test(D(3))) {
                  extglobOpen("negate", G);
                  continue;
                }
              }
              if (u3.nonegate !== true && m.index === 0) {
                negate();
                continue;
              }
            }
            if (G === "+") {
              if (u3.noextglob !== true && D() === "(" && D(2) !== "?") {
                extglobOpen("plus", G);
                continue;
              }
              if (B && B.value === "(" || u3.regex === false) {
                push({ type: "plus", value: G, output: g });
                continue;
              }
              if (B && (B.type === "bracket" || B.type === "paren" || B.type === "brace") || m.parens > 0) {
                push({ type: "plus", value: G });
                continue;
              }
              push({ type: "plus", value: g });
              continue;
            }
            if (G === "@") {
              if (u3.noextglob !== true && D() === "(" && D(2) !== "?") {
                push({ type: "at", extglob: true, value: G, output: "" });
                continue;
              }
              push({ type: "text", value: G });
              continue;
            }
            if (G !== "*") {
              if (G === "$" || G === "^") {
                G = `\\${G}`;
              }
              const t4 = a.exec(remaining());
              if (t4) {
                G += t4[0];
                m.index += t4[0].length;
              }
              push({ type: "text", value: G });
              continue;
            }
            if (B && (B.type === "globstar" || B.star === true)) {
              B.type = "star";
              B.star = true;
              B.value += G;
              B.output = k;
              m.backtrack = true;
              m.globstar = true;
              consume(G);
              continue;
            }
            let e4 = remaining();
            if (u3.noextglob !== true && /^\([^?]/.test(e4)) {
              extglobOpen("star", G);
              continue;
            }
            if (B.type === "star") {
              if (u3.noglobstar === true) {
                consume(G);
                continue;
              }
              const n3 = B.prev;
              const o2 = n3.prev;
              const s2 = n3.type === "slash" || n3.type === "bos";
              const r2 = o2 && (o2.type === "star" || o2.type === "globstar");
              if (u3.bash === true && (!s2 || e4[0] && e4[0] !== "/")) {
                push({ type: "star", value: G, output: "" });
                continue;
              }
              const a2 = m.braces > 0 && (n3.type === "comma" || n3.type === "brace");
              const i2 = w.length && (n3.type === "pipe" || n3.type === "paren");
              if (!s2 && n3.type !== "paren" && !a2 && !i2) {
                push({ type: "star", value: G, output: "" });
                continue;
              }
              while (e4.slice(0, 3) === "/**") {
                const u4 = t3[m.index + 4];
                if (u4 && u4 !== "/") {
                  break;
                }
                e4 = e4.slice(3);
                consume("/**", 3);
              }
              if (n3.type === "bos" && eos()) {
                B.type = "globstar";
                B.value += G;
                B.output = globstar(u3);
                m.output = B.output;
                m.globstar = true;
                consume(G);
                continue;
              }
              if (n3.type === "slash" && n3.prev.type !== "bos" && !r2 && eos()) {
                m.output = m.output.slice(0, -(n3.output + B.output).length);
                n3.output = `(?:${n3.output}`;
                B.type = "globstar";
                B.output = globstar(u3) + (u3.strictSlashes ? ")" : "|$)");
                B.value += G;
                m.globstar = true;
                m.output += n3.output + B.output;
                consume(G);
                continue;
              }
              if (n3.type === "slash" && n3.prev.type !== "bos" && e4[0] === "/") {
                const t4 = e4[1] !== void 0 ? "|$" : "";
                m.output = m.output.slice(0, -(n3.output + B.output).length);
                n3.output = `(?:${n3.output}`;
                B.type = "globstar";
                B.output = `${globstar(u3)}${b}|${b}${t4})`;
                B.value += G;
                m.output += n3.output + B.output;
                m.globstar = true;
                consume(G + M());
                push({ type: "slash", value: "/", output: "" });
                continue;
              }
              if (n3.type === "bos" && e4[0] === "/") {
                B.type = "globstar";
                B.value += G;
                B.output = `(?:^|${b}|${globstar(u3)}${b})`;
                m.output = B.output;
                m.globstar = true;
                consume(G + M());
                push({ type: "slash", value: "/", output: "" });
                continue;
              }
              m.output = m.output.slice(0, -B.output.length);
              B.type = "globstar";
              B.output = globstar(u3);
              B.value += G;
              m.output += B.output;
              m.globstar = true;
              consume(G);
              continue;
            }
            const n2 = { type: "star", value: G, output: k };
            if (u3.bash === true) {
              n2.output = ".*?";
              if (B.type === "bos" || B.type === "slash") {
                n2.output = T + n2.output;
              }
              push(n2);
              continue;
            }
            if (B && (B.type === "bracket" || B.type === "paren") && u3.regex === true) {
              n2.output = G;
              push(n2);
              continue;
            }
            if (m.index === m.start || B.type === "slash" || B.type === "dot") {
              if (B.type === "dot") {
                m.output += x;
                B.output += x;
              } else if (u3.dot === true) {
                m.output += S;
                B.output += S;
              } else {
                m.output += T;
                B.output += T;
              }
              if (D() !== "*") {
                m.output += C;
                B.output += C;
              }
            }
            push(n2);
          }
          while (m.brackets > 0) {
            if (u3.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "]"));
            m.output = o.escapeLast(m.output, "[");
            decrement("brackets");
          }
          while (m.parens > 0) {
            if (u3.strictBrackets === true) throw new SyntaxError(syntaxError("closing", ")"));
            m.output = o.escapeLast(m.output, "(");
            decrement("parens");
          }
          while (m.braces > 0) {
            if (u3.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "}"));
            m.output = o.escapeLast(m.output, "{");
            decrement("braces");
          }
          if (u3.strictSlashes !== true && (B.type === "star" || B.type === "bracket")) {
            push({ type: "maybe_slash", value: "", output: `${b}?` });
          }
          if (m.backtrack === true) {
            m.output = "";
            for (const t4 of m.tokens) {
              m.output += t4.output != null ? t4.output : t4.value;
              if (t4.suffix) {
                m.output += t4.suffix;
              }
            }
          }
          return m;
        };
        parse.fastpaths = (t3, e3) => {
          const u3 = { ...e3 };
          const r2 = typeof u3.maxLength === "number" ? Math.min(s, u3.maxLength) : s;
          const a2 = t3.length;
          if (a2 > r2) {
            throw new SyntaxError(`Input length: ${a2}, exceeds maximum allowed length: ${r2}`);
          }
          t3 = c[t3] || t3;
          const { DOT_LITERAL: i2, SLASH_LITERAL: p, ONE_CHAR: l, DOTS_SLASH: f, NO_DOT: A, NO_DOTS: _, NO_DOTS_SLASH: R, STAR: E, START_ANCHOR: h } = n.globChars(u3.windows);
          const g = u3.dot ? _ : A;
          const b = u3.dot ? R : A;
          const C = u3.capture ? "" : "?:";
          const y = { negated: false, prefix: "" };
          let $ = u3.bash === true ? ".*?" : E;
          if (u3.capture) {
            $ = `(${$})`;
          }
          const globstar = (t4) => {
            if (t4.noglobstar === true) return $;
            return `(${C}(?:(?!${h}${t4.dot ? f : i2}).)*?)`;
          };
          const create = (t4) => {
            switch (t4) {
              case "*":
                return `${g}${l}${$}`;
              case ".*":
                return `${i2}${l}${$}`;
              case "*.*":
                return `${g}${$}${i2}${l}${$}`;
              case "*/*":
                return `${g}${$}${p}${l}${b}${$}`;
              case "**":
                return g + globstar(u3);
              case "**/*":
                return `(?:${g}${globstar(u3)}${p})?${b}${l}${$}`;
              case "**/*.*":
                return `(?:${g}${globstar(u3)}${p})?${b}${$}${i2}${l}${$}`;
              case "**/.*":
                return `(?:${g}${globstar(u3)}${p})?${i2}${l}${$}`;
              default: {
                const e4 = /^(.*?)\.(\w+)$/.exec(t4);
                if (!e4) return;
                const u4 = create(e4[1]);
                if (!u4) return;
                return u4 + i2 + e4[2];
              }
            }
          };
          const x = o.removePrefix(t3, y);
          let S = create(x);
          if (S && u3.strictSlashes !== true) {
            S += `${p}?`;
          }
          return S;
        };
        t2.exports = parse;
      }, 510: (t2, e2, u2) => {
        const n = u2(716);
        const o = u2(697);
        const s = u2(96);
        const r = u2(154);
        const isObject = (t3) => t3 && typeof t3 === "object" && !Array.isArray(t3);
        const picomatch = (t3, e3, u3 = false) => {
          if (Array.isArray(t3)) {
            const n3 = t3.map(((t4) => picomatch(t4, e3, u3)));
            const arrayMatcher = (t4) => {
              for (const e4 of n3) {
                const u4 = e4(t4);
                if (u4) return u4;
              }
              return false;
            };
            return arrayMatcher;
          }
          const n2 = isObject(t3) && t3.tokens && t3.input;
          if (t3 === "" || typeof t3 !== "string" && !n2) {
            throw new TypeError("Expected pattern to be a non-empty string");
          }
          const o2 = e3 || {};
          const s2 = o2.windows;
          const r2 = n2 ? picomatch.compileRe(t3, e3) : picomatch.makeRe(t3, e3, false, true);
          const a = r2.state;
          delete r2.state;
          let isIgnored = () => false;
          if (o2.ignore) {
            const t4 = { ...e3, ignore: null, onMatch: null, onResult: null };
            isIgnored = picomatch(o2.ignore, t4, u3);
          }
          const matcher = (u4, n3 = false) => {
            const { isMatch: i, match: c, output: p } = picomatch.test(u4, r2, e3, { glob: t3, posix: s2 });
            const l = { glob: t3, state: a, regex: r2, posix: s2, input: u4, output: p, match: c, isMatch: i };
            if (typeof o2.onResult === "function") {
              o2.onResult(l);
            }
            if (i === false) {
              l.isMatch = false;
              return n3 ? l : false;
            }
            if (isIgnored(u4)) {
              if (typeof o2.onIgnore === "function") {
                o2.onIgnore(l);
              }
              l.isMatch = false;
              return n3 ? l : false;
            }
            if (typeof o2.onMatch === "function") {
              o2.onMatch(l);
            }
            return n3 ? l : true;
          };
          if (u3) {
            matcher.state = a;
          }
          return matcher;
        };
        picomatch.test = (t3, e3, u3, { glob: n2, posix: o2 } = {}) => {
          if (typeof t3 !== "string") {
            throw new TypeError("Expected input to be a string");
          }
          if (t3 === "") {
            return { isMatch: false, output: "" };
          }
          const r2 = u3 || {};
          const a = r2.format || (o2 ? s.toPosixSlashes : null);
          let i = t3 === n2;
          let c = i && a ? a(t3) : t3;
          if (i === false) {
            c = a ? a(t3) : t3;
            i = c === n2;
          }
          if (i === false || r2.capture === true) {
            if (r2.matchBase === true || r2.basename === true) {
              i = picomatch.matchBase(t3, e3, u3, o2);
            } else {
              i = e3.exec(c);
            }
          }
          return { isMatch: Boolean(i), match: i, output: c };
        };
        picomatch.matchBase = (t3, e3, u3) => {
          const n2 = e3 instanceof RegExp ? e3 : picomatch.makeRe(e3, u3);
          return n2.test(s.basename(t3));
        };
        picomatch.isMatch = (t3, e3, u3) => picomatch(e3, u3)(t3);
        picomatch.parse = (t3, e3) => {
          if (Array.isArray(t3)) return t3.map(((t4) => picomatch.parse(t4, e3)));
          return o(t3, { ...e3, fastpaths: false });
        };
        picomatch.scan = (t3, e3) => n(t3, e3);
        picomatch.compileRe = (t3, e3, u3 = false, n2 = false) => {
          if (u3 === true) {
            return t3.output;
          }
          const o2 = e3 || {};
          const s2 = o2.contains ? "" : "^";
          const r2 = o2.contains ? "" : "$";
          let a = `${s2}(?:${t3.output})${r2}`;
          if (t3 && t3.negated === true) {
            a = `^(?!${a}).*$`;
          }
          const i = picomatch.toRegex(a, e3);
          if (n2 === true) {
            i.state = t3;
          }
          return i;
        };
        picomatch.makeRe = (t3, e3 = {}, u3 = false, n2 = false) => {
          if (!t3 || typeof t3 !== "string") {
            throw new TypeError("Expected a non-empty string");
          }
          let s2 = { negated: false, fastpaths: true };
          if (e3.fastpaths !== false && (t3[0] === "." || t3[0] === "*")) {
            s2.output = o.fastpaths(t3, e3);
          }
          if (!s2.output) {
            s2 = o(t3, e3);
          }
          return picomatch.compileRe(s2, e3, u3, n2);
        };
        picomatch.toRegex = (t3, e3) => {
          try {
            const u3 = e3 || {};
            return new RegExp(t3, u3.flags || (u3.nocase ? "i" : ""));
          } catch (t4) {
            if (e3 && e3.debug === true) throw t4;
            return /$^/;
          }
        };
        picomatch.constants = r;
        t2.exports = picomatch;
      }, 716: (t2, e2, u2) => {
        const n = u2(96);
        const { CHAR_ASTERISK: o, CHAR_AT: s, CHAR_BACKWARD_SLASH: r, CHAR_COMMA: a, CHAR_DOT: i, CHAR_EXCLAMATION_MARK: c, CHAR_FORWARD_SLASH: p, CHAR_LEFT_CURLY_BRACE: l, CHAR_LEFT_PARENTHESES: f, CHAR_LEFT_SQUARE_BRACKET: A, CHAR_PLUS: _, CHAR_QUESTION_MARK: R, CHAR_RIGHT_CURLY_BRACE: E, CHAR_RIGHT_PARENTHESES: h, CHAR_RIGHT_SQUARE_BRACKET: g } = u2(154);
        const isPathSeparator = (t3) => t3 === p || t3 === r;
        const depth = (t3) => {
          if (t3.isPrefix !== true) {
            t3.depth = t3.isGlobstar ? Infinity : 1;
          }
        };
        const scan = (t3, e3) => {
          const u3 = e3 || {};
          const b = t3.length - 1;
          const C = u3.parts === true || u3.scanToEnd === true;
          const y = [];
          const $ = [];
          const x = [];
          let S = t3;
          let H = -1;
          let v = 0;
          let d = 0;
          let L = false;
          let T = false;
          let O = false;
          let k = false;
          let m = false;
          let w = false;
          let N = false;
          let I = false;
          let B = false;
          let G = false;
          let D = 0;
          let M;
          let P2;
          let K = { value: "", depth: 0, isGlob: false };
          const eos = () => H >= b;
          const peek = () => S.charCodeAt(H + 1);
          const advance = () => {
            M = P2;
            return S.charCodeAt(++H);
          };
          while (H < b) {
            P2 = advance();
            let t4;
            if (P2 === r) {
              N = K.backslashes = true;
              P2 = advance();
              if (P2 === l) {
                w = true;
              }
              continue;
            }
            if (w === true || P2 === l) {
              D++;
              while (eos() !== true && (P2 = advance())) {
                if (P2 === r) {
                  N = K.backslashes = true;
                  advance();
                  continue;
                }
                if (P2 === l) {
                  D++;
                  continue;
                }
                if (w !== true && P2 === i && (P2 = advance()) === i) {
                  L = K.isBrace = true;
                  O = K.isGlob = true;
                  G = true;
                  if (C === true) {
                    continue;
                  }
                  break;
                }
                if (w !== true && P2 === a) {
                  L = K.isBrace = true;
                  O = K.isGlob = true;
                  G = true;
                  if (C === true) {
                    continue;
                  }
                  break;
                }
                if (P2 === E) {
                  D--;
                  if (D === 0) {
                    w = false;
                    L = K.isBrace = true;
                    G = true;
                    break;
                  }
                }
              }
              if (C === true) {
                continue;
              }
              break;
            }
            if (P2 === p) {
              y.push(H);
              $.push(K);
              K = { value: "", depth: 0, isGlob: false };
              if (G === true) continue;
              if (M === i && H === v + 1) {
                v += 2;
                continue;
              }
              d = H + 1;
              continue;
            }
            if (u3.noext !== true) {
              const t5 = P2 === _ || P2 === s || P2 === o || P2 === R || P2 === c;
              if (t5 === true && peek() === f) {
                O = K.isGlob = true;
                k = K.isExtglob = true;
                G = true;
                if (P2 === c && H === v) {
                  B = true;
                }
                if (C === true) {
                  while (eos() !== true && (P2 = advance())) {
                    if (P2 === r) {
                      N = K.backslashes = true;
                      P2 = advance();
                      continue;
                    }
                    if (P2 === h) {
                      O = K.isGlob = true;
                      G = true;
                      break;
                    }
                  }
                  continue;
                }
                break;
              }
            }
            if (P2 === o) {
              if (M === o) m = K.isGlobstar = true;
              O = K.isGlob = true;
              G = true;
              if (C === true) {
                continue;
              }
              break;
            }
            if (P2 === R) {
              O = K.isGlob = true;
              G = true;
              if (C === true) {
                continue;
              }
              break;
            }
            if (P2 === A) {
              while (eos() !== true && (t4 = advance())) {
                if (t4 === r) {
                  N = K.backslashes = true;
                  advance();
                  continue;
                }
                if (t4 === g) {
                  T = K.isBracket = true;
                  O = K.isGlob = true;
                  G = true;
                  break;
                }
              }
              if (C === true) {
                continue;
              }
              break;
            }
            if (u3.nonegate !== true && P2 === c && H === v) {
              I = K.negated = true;
              v++;
              continue;
            }
            if (u3.noparen !== true && P2 === f) {
              O = K.isGlob = true;
              if (C === true) {
                while (eos() !== true && (P2 = advance())) {
                  if (P2 === f) {
                    N = K.backslashes = true;
                    P2 = advance();
                    continue;
                  }
                  if (P2 === h) {
                    G = true;
                    break;
                  }
                }
                continue;
              }
              break;
            }
            if (O === true) {
              G = true;
              if (C === true) {
                continue;
              }
              break;
            }
          }
          if (u3.noext === true) {
            k = false;
            O = false;
          }
          let U = S;
          let X2 = "";
          let F = "";
          if (v > 0) {
            X2 = S.slice(0, v);
            S = S.slice(v);
            d -= v;
          }
          if (U && O === true && d > 0) {
            U = S.slice(0, d);
            F = S.slice(d);
          } else if (O === true) {
            U = "";
            F = S;
          } else {
            U = S;
          }
          if (U && U !== "" && U !== "/" && U !== S) {
            if (isPathSeparator(U.charCodeAt(U.length - 1))) {
              U = U.slice(0, -1);
            }
          }
          if (u3.unescape === true) {
            if (F) F = n.removeBackslashes(F);
            if (U && N === true) {
              U = n.removeBackslashes(U);
            }
          }
          const Q = { prefix: X2, input: t3, start: v, base: U, glob: F, isBrace: L, isBracket: T, isGlob: O, isExtglob: k, isGlobstar: m, negated: I, negatedExtglob: B };
          if (u3.tokens === true) {
            Q.maxDepth = 0;
            if (!isPathSeparator(P2)) {
              $.push(K);
            }
            Q.tokens = $;
          }
          if (u3.parts === true || u3.tokens === true) {
            let e4;
            for (let n2 = 0; n2 < y.length; n2++) {
              const o2 = e4 ? e4 + 1 : v;
              const s2 = y[n2];
              const r2 = t3.slice(o2, s2);
              if (u3.tokens) {
                if (n2 === 0 && v !== 0) {
                  $[n2].isPrefix = true;
                  $[n2].value = X2;
                } else {
                  $[n2].value = r2;
                }
                depth($[n2]);
                Q.maxDepth += $[n2].depth;
              }
              if (n2 !== 0 || r2 !== "") {
                x.push(r2);
              }
              e4 = s2;
            }
            if (e4 && e4 + 1 < t3.length) {
              const n2 = t3.slice(e4 + 1);
              x.push(n2);
              if (u3.tokens) {
                $[$.length - 1].value = n2;
                depth($[$.length - 1]);
                Q.maxDepth += $[$.length - 1].depth;
              }
            }
            Q.slashes = y;
            Q.parts = x;
          }
          return Q;
        };
        t2.exports = scan;
      }, 96: (t2, e2, u2) => {
        const { REGEX_BACKSLASH: n, REGEX_REMOVE_BACKSLASH: o, REGEX_SPECIAL_CHARS: s, REGEX_SPECIAL_CHARS_GLOBAL: r } = u2(154);
        e2.isObject = (t3) => t3 !== null && typeof t3 === "object" && !Array.isArray(t3);
        e2.hasRegexChars = (t3) => s.test(t3);
        e2.isRegexChar = (t3) => t3.length === 1 && e2.hasRegexChars(t3);
        e2.escapeRegex = (t3) => t3.replace(r, "\\$1");
        e2.toPosixSlashes = (t3) => t3.replace(n, "/");
        e2.removeBackslashes = (t3) => t3.replace(o, ((t4) => t4 === "\\" ? "" : t4));
        e2.escapeLast = (t3, u3, n2) => {
          const o2 = t3.lastIndexOf(u3, n2);
          if (o2 === -1) return t3;
          if (t3[o2 - 1] === "\\") return e2.escapeLast(t3, u3, o2 - 1);
          return `${t3.slice(0, o2)}\\${t3.slice(o2)}`;
        };
        e2.removePrefix = (t3, e3 = {}) => {
          let u3 = t3;
          if (u3.startsWith("./")) {
            u3 = u3.slice(2);
            e3.prefix = "./";
          }
          return u3;
        };
        e2.wrapOutput = (t3, e3 = {}, u3 = {}) => {
          const n2 = u3.contains ? "" : "^";
          const o2 = u3.contains ? "" : "$";
          let s2 = `${n2}(?:${t3})${o2}`;
          if (e3.negated === true) {
            s2 = `(?:^(?!${s2}).*$)`;
          }
          return s2;
        };
        e2.basename = (t3, { windows: e3 } = {}) => {
          const u3 = t3.split(e3 ? /[\\/]/ : "/");
          const n2 = u3[u3.length - 1];
          if (n2 === "") {
            return u3[u3.length - 2];
          }
          return n2;
        };
      } };
      var e = {};
      function __nccwpck_require__(u2) {
        var n = e[u2];
        if (n !== void 0) {
          return n.exports;
        }
        var o = e[u2] = { exports: {} };
        var s = true;
        try {
          t[u2](o, o.exports, __nccwpck_require__);
          s = false;
        } finally {
          if (s) delete e[u2];
        }
        return o.exports;
      }
      if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = __dirname + "/";
      var u = __nccwpck_require__(170);
      module2.exports = u;
    })();
  }
});

// ../../node_modules/next/dist/shared/lib/match-local-pattern.js
var require_match_local_pattern = __commonJS({
  "../../node_modules/next/dist/shared/lib/match-local-pattern.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    function _export(target, all) {
      for (var name in all) Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
      });
    }
    _export(exports2, {
      hasLocalMatch: function() {
        return hasLocalMatch;
      },
      matchLocalPattern: function() {
        return matchLocalPattern;
      }
    });
    var _picomatch = require_picomatch();
    function matchLocalPattern(pattern, url) {
      if (pattern.search !== void 0) {
        if (pattern.search !== url.search) {
          return false;
        }
      }
      if (!(0, _picomatch.makeRe)(pattern.pathname ?? "**", {
        dot: true
      }).test(url.pathname)) {
        return false;
      }
      return true;
    }
    function hasLocalMatch(localPatterns, urlPathAndQuery) {
      if (!localPatterns) {
        return true;
      }
      const url = new URL(urlPathAndQuery, "http://n");
      return localPatterns.some((p) => matchLocalPattern(p, url));
    }
  }
});

// ../../node_modules/next/dist/shared/lib/match-remote-pattern.js
var require_match_remote_pattern = __commonJS({
  "../../node_modules/next/dist/shared/lib/match-remote-pattern.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    function _export(target, all) {
      for (var name in all) Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
      });
    }
    _export(exports2, {
      hasRemoteMatch: function() {
        return hasRemoteMatch;
      },
      matchRemotePattern: function() {
        return matchRemotePattern;
      }
    });
    var _picomatch = require_picomatch();
    function matchRemotePattern(pattern, url) {
      if (pattern.protocol !== void 0) {
        if (pattern.protocol.replace(/:$/, "") !== url.protocol.replace(/:$/, "")) {
          return false;
        }
      }
      if (pattern.port !== void 0) {
        if (pattern.port !== url.port) {
          return false;
        }
      }
      if (pattern.hostname === void 0) {
        throw Object.defineProperty(new Error(`Pattern should define hostname but found
${JSON.stringify(pattern)}`), "__NEXT_ERROR_CODE", {
          value: "E410",
          enumerable: false,
          configurable: true
        });
      } else {
        if (!(0, _picomatch.makeRe)(pattern.hostname).test(url.hostname)) {
          return false;
        }
      }
      if (pattern.search !== void 0) {
        if (pattern.search !== url.search) {
          return false;
        }
      }
      if (!(0, _picomatch.makeRe)(pattern.pathname ?? "**", {
        dot: true
      }).test(url.pathname)) {
        return false;
      }
      return true;
    }
    function hasRemoteMatch(domains, remotePatterns, url) {
      return domains.some((domain) => url.hostname === domain) || remotePatterns.some((p) => matchRemotePattern(p, url));
    }
  }
});

// ../../node_modules/next/dist/shared/lib/image-loader.js
var require_image_loader = __commonJS({
  "../../node_modules/next/dist/shared/lib/image-loader.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    Object.defineProperty(exports2, "default", {
      enumerable: true,
      get: function() {
        return _default;
      }
    });
    var _findclosestquality = require_find_closest_quality();
    var _deploymentid = require_deployment_id();
    function defaultLoader({ config, src, width, quality }) {
      if (src.startsWith("/") && src.includes("?") && config.localPatterns?.length === 1 && config.localPatterns[0].pathname === "**" && config.localPatterns[0].search === "") {
        throw Object.defineProperty(new Error(`Image with src "${src}" is using a query string which is not configured in images.localPatterns.
Read more: https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns`), "__NEXT_ERROR_CODE", {
          value: "E871",
          enumerable: false,
          configurable: true
        });
      }
      if (process.env.NODE_ENV !== "production") {
        const missingValues = [];
        if (!src) missingValues.push("src");
        if (!width) missingValues.push("width");
        if (missingValues.length > 0) {
          throw Object.defineProperty(new Error(`Next Image Optimization requires ${missingValues.join(", ")} to be provided. Make sure you pass them as props to the \`next/image\` component. Received: ${JSON.stringify({
            src,
            width,
            quality
          })}`), "__NEXT_ERROR_CODE", {
            value: "E188",
            enumerable: false,
            configurable: true
          });
        }
        if (src.startsWith("//")) {
          throw Object.defineProperty(new Error(`Failed to parse src "${src}" on \`next/image\`, protocol-relative URL (//) must be changed to an absolute URL (http:// or https://)`), "__NEXT_ERROR_CODE", {
            value: "E360",
            enumerable: false,
            configurable: true
          });
        }
        if (src.startsWith("/") && config.localPatterns) {
          if (process.env.NODE_ENV !== "test" && // micromatch isn't compatible with edge runtime
          process.env.NEXT_RUNTIME !== "edge") {
            const { hasLocalMatch } = require_match_local_pattern();
            if (!hasLocalMatch(config.localPatterns, src)) {
              throw Object.defineProperty(new Error(`Invalid src prop (${src}) on \`next/image\` does not match \`images.localPatterns\` configured in your \`next.config.js\`
See more info: https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns`), "__NEXT_ERROR_CODE", {
                value: "E426",
                enumerable: false,
                configurable: true
              });
            }
          }
        }
        if (!src.startsWith("/") && (config.domains || config.remotePatterns)) {
          let parsedSrc;
          try {
            parsedSrc = new URL(src);
          } catch (err) {
            console.error(err);
            throw Object.defineProperty(new Error(`Failed to parse src "${src}" on \`next/image\`, if using relative image it must start with a leading slash "/" or be an absolute URL (http:// or https://)`), "__NEXT_ERROR_CODE", {
              value: "E63",
              enumerable: false,
              configurable: true
            });
          }
          if (process.env.NODE_ENV !== "test" && // micromatch isn't compatible with edge runtime
          process.env.NEXT_RUNTIME !== "edge") {
            const { hasRemoteMatch } = require_match_remote_pattern();
            if (!hasRemoteMatch(config.domains, config.remotePatterns, parsedSrc)) {
              throw Object.defineProperty(new Error(`Invalid src prop (${src}) on \`next/image\`, hostname "${parsedSrc.hostname}" is not configured under images in your \`next.config.js\`
See more info: https://nextjs.org/docs/messages/next-image-unconfigured-host`), "__NEXT_ERROR_CODE", {
                value: "E231",
                enumerable: false,
                configurable: true
              });
            }
          }
        }
      }
      const q = (0, _findclosestquality.findClosestQuality)(quality, config);
      let deploymentId = (0, _deploymentid.getDeploymentId)();
      return `${config.path}?url=${encodeURIComponent(src)}&w=${width}&q=${q}${src.startsWith("/") && deploymentId ? `&dpl=${deploymentId}` : ""}`;
    }
    defaultLoader.__next_img_default = true;
    var _default = defaultLoader;
  }
});

// ../../node_modules/next/dist/client/use-merged-ref.js
var require_use_merged_ref = __commonJS({
  "../../node_modules/next/dist/client/use-merged-ref.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    Object.defineProperty(exports2, "useMergedRef", {
      enumerable: true,
      get: function() {
        return useMergedRef;
      }
    });
    var _react = require("react");
    function useMergedRef(refA, refB) {
      const cleanupA = (0, _react.useRef)(null);
      const cleanupB = (0, _react.useRef)(null);
      return (0, _react.useCallback)((current) => {
        if (current === null) {
          const cleanupFnA = cleanupA.current;
          if (cleanupFnA) {
            cleanupA.current = null;
            cleanupFnA();
          }
          const cleanupFnB = cleanupB.current;
          if (cleanupFnB) {
            cleanupB.current = null;
            cleanupFnB();
          }
        } else {
          if (refA) {
            cleanupA.current = applyRef(refA, current);
          }
          if (refB) {
            cleanupB.current = applyRef(refB, current);
          }
        }
      }, [
        refA,
        refB
      ]);
    }
    function applyRef(refA, current) {
      if (typeof refA === "function") {
        const cleanup = refA(current);
        if (typeof cleanup === "function") {
          return cleanup;
        } else {
          return () => refA(null);
        }
      } else {
        refA.current = current;
        return () => {
          refA.current = null;
        };
      }
    }
    if ((typeof exports2.default === "function" || typeof exports2.default === "object" && exports2.default !== null) && typeof exports2.default.__esModule === "undefined") {
      Object.defineProperty(exports2.default, "__esModule", { value: true });
      Object.assign(exports2.default, exports2);
      module2.exports = exports2.default;
    }
  }
});

// ../../node_modules/next/dist/client/image-component.js
var require_image_component = __commonJS({
  "../../node_modules/next/dist/client/image-component.js"(exports2, module2) {
    "use strict";
    "use client";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    Object.defineProperty(exports2, "Image", {
      enumerable: true,
      get: function() {
        return Image2;
      }
    });
    var _interop_require_default = require_interop_require_default();
    var _interop_require_wildcard = require_interop_require_wildcard();
    var _jsxruntime = require("react/jsx-runtime");
    var _react = /* @__PURE__ */ _interop_require_wildcard._(require("react"));
    var _reactdom = /* @__PURE__ */ _interop_require_default._(require("react-dom"));
    var _head = /* @__PURE__ */ _interop_require_default._(require_head());
    var _getimgprops = require_get_img_props();
    var _imageconfig = require_image_config();
    var _imageconfigcontextsharedruntime = require_image_config_context_shared_runtime();
    var _warnonce = require_warn_once();
    var _routercontextsharedruntime = require_router_context_shared_runtime();
    var _imageloader = /* @__PURE__ */ _interop_require_default._(require_image_loader());
    var _usemergedref = require_use_merged_ref();
    var configEnv = process.env.__NEXT_IMAGE_OPTS;
    if (typeof window === "undefined") {
      ;
      globalThis.__NEXT_IMAGE_IMPORTED = true;
    }
    function handleLoading(img, placeholder, onLoadRef, onLoadingCompleteRef, setBlurComplete, unoptimized, sizesInput) {
      const src = img?.src;
      if (!img || img["data-loaded-src"] === src) {
        return;
      }
      img["data-loaded-src"] = src;
      const p = "decode" in img ? img.decode() : Promise.resolve();
      p.catch(() => {
      }).then(() => {
        if (!img.parentElement || !img.isConnected) {
          return;
        }
        if (placeholder !== "empty") {
          setBlurComplete(true);
        }
        if (onLoadRef?.current) {
          const event = new Event("load");
          Object.defineProperty(event, "target", {
            writable: false,
            value: img
          });
          let prevented = false;
          let stopped = false;
          onLoadRef.current({
            ...event,
            nativeEvent: event,
            currentTarget: img,
            target: img,
            isDefaultPrevented: () => prevented,
            isPropagationStopped: () => stopped,
            persist: () => {
            },
            preventDefault: () => {
              prevented = true;
              event.preventDefault();
            },
            stopPropagation: () => {
              stopped = true;
              event.stopPropagation();
            }
          });
        }
        if (onLoadingCompleteRef?.current) {
          onLoadingCompleteRef.current(img);
        }
        if (process.env.NODE_ENV !== "production") {
          const origSrc = new URL(src, "http://n").searchParams.get("url") || src;
          if (img.getAttribute("data-nimg") === "fill") {
            if (!unoptimized && (!sizesInput || sizesInput === "100vw")) {
              let widthViewportRatio = img.getBoundingClientRect().width / window.innerWidth;
              if (widthViewportRatio < 0.6) {
                if (sizesInput === "100vw") {
                  (0, _warnonce.warnOnce)(`Image with src "${origSrc}" has "fill" prop and "sizes" prop of "100vw", but image is not rendered at full viewport width. Please adjust "sizes" to improve page performance. Read more: https://nextjs.org/docs/api-reference/next/image#sizes`);
                } else {
                  (0, _warnonce.warnOnce)(`Image with src "${origSrc}" has "fill" but is missing "sizes" prop. Please add it to improve page performance. Read more: https://nextjs.org/docs/api-reference/next/image#sizes`);
                }
              }
            }
            if (img.parentElement) {
              const { position } = window.getComputedStyle(img.parentElement);
              const valid = [
                "absolute",
                "fixed",
                "relative"
              ];
              if (!valid.includes(position)) {
                (0, _warnonce.warnOnce)(`Image with src "${origSrc}" has "fill" and parent element with invalid "position". Provided "${position}" should be one of ${valid.map(String).join(",")}.`);
              }
            }
            if (img.height === 0) {
              (0, _warnonce.warnOnce)(`Image with src "${origSrc}" has "fill" and a height value of 0. This is likely because the parent element of the image has not been styled to have a set height.`);
            }
          }
          const heightModified = img.height.toString() !== img.getAttribute("height");
          const widthModified = img.width.toString() !== img.getAttribute("width");
          if (heightModified && !widthModified || !heightModified && widthModified) {
            (0, _warnonce.warnOnce)(`Image with src "${origSrc}" has either width or height modified, but not the other. If you use CSS to change the size of your image, also include the styles 'width: "auto"' or 'height: "auto"' to maintain the aspect ratio.`);
          }
        }
      });
    }
    function getDynamicProps(fetchPriority) {
      if (Boolean(_react.use)) {
        return {
          fetchPriority
        };
      }
      return {
        fetchpriority: fetchPriority
      };
    }
    var ImageElement = /* @__PURE__ */ (0, _react.forwardRef)(({ src, srcSet, sizes, height, width, decoding, className, style, fetchPriority, placeholder, loading, unoptimized, fill, onLoadRef, onLoadingCompleteRef, setBlurComplete, setShowAltText, sizesInput, onLoad, onError, ...rest }, forwardedRef) => {
      const ownRef = (0, _react.useCallback)((img) => {
        if (!img) {
          return;
        }
        if (onError) {
          img.src = img.src;
        }
        if (process.env.NODE_ENV !== "production") {
          if (!src) {
            console.error(`Image is missing required "src" property:`, img);
          }
          if (img.getAttribute("alt") === null) {
            console.error(`Image is missing required "alt" property. Please add Alternative Text to describe the image for screen readers and search engines.`);
          }
        }
        if (img.complete) {
          handleLoading(img, placeholder, onLoadRef, onLoadingCompleteRef, setBlurComplete, unoptimized, sizesInput);
        }
      }, [
        src,
        placeholder,
        onLoadRef,
        onLoadingCompleteRef,
        setBlurComplete,
        onError,
        unoptimized,
        sizesInput
      ]);
      const ref = (0, _usemergedref.useMergedRef)(forwardedRef, ownRef);
      return /* @__PURE__ */ (0, _jsxruntime.jsx)("img", {
        ...rest,
        ...getDynamicProps(fetchPriority),
        // It's intended to keep `loading` before `src` because React updates
        // props in order which causes Safari/Firefox to not lazy load properly.
        // See https://github.com/facebook/react/issues/25883
        loading,
        width,
        height,
        decoding,
        "data-nimg": fill ? "fill" : "1",
        className,
        style,
        // It's intended to keep `src` the last attribute because React updates
        // attributes in order. If we keep `src` the first one, Safari will
        // immediately start to fetch `src`, before `sizes` and `srcSet` are even
        // updated by React. That causes multiple unnecessary requests if `srcSet`
        // and `sizes` are defined.
        // This bug cannot be reproduced in Chrome or Firefox.
        sizes,
        srcSet,
        src,
        ref,
        onLoad: (event) => {
          const img = event.currentTarget;
          handleLoading(img, placeholder, onLoadRef, onLoadingCompleteRef, setBlurComplete, unoptimized, sizesInput);
        },
        onError: (event) => {
          setShowAltText(true);
          if (placeholder !== "empty") {
            setBlurComplete(true);
          }
          if (onError) {
            onError(event);
          }
        }
      });
    });
    function ImagePreload({ isAppRouter, imgAttributes }) {
      const opts = {
        as: "image",
        imageSrcSet: imgAttributes.srcSet,
        imageSizes: imgAttributes.sizes,
        crossOrigin: imgAttributes.crossOrigin,
        referrerPolicy: imgAttributes.referrerPolicy,
        ...getDynamicProps(imgAttributes.fetchPriority)
      };
      if (isAppRouter && _reactdom.default.preload) {
        _reactdom.default.preload(imgAttributes.src, opts);
        return null;
      }
      return /* @__PURE__ */ (0, _jsxruntime.jsx)(_head.default, {
        children: /* @__PURE__ */ (0, _jsxruntime.jsx)("link", {
          rel: "preload",
          // Note how we omit the `href` attribute, as it would only be relevant
          // for browsers that do not support `imagesrcset`, and in those cases
          // it would cause the incorrect image to be preloaded.
          //
          // https://html.spec.whatwg.org/multipage/semantics.html#attr-link-imagesrcset
          href: imgAttributes.srcSet ? void 0 : imgAttributes.src,
          ...opts
        }, "__nimg-" + imgAttributes.src + imgAttributes.srcSet + imgAttributes.sizes)
      });
    }
    var Image2 = /* @__PURE__ */ (0, _react.forwardRef)((props, forwardedRef) => {
      const pagesRouter = (0, _react.useContext)(_routercontextsharedruntime.RouterContext);
      const isAppRouter = !pagesRouter;
      const configContext = (0, _react.useContext)(_imageconfigcontextsharedruntime.ImageConfigContext);
      const config = (0, _react.useMemo)(() => {
        const c = configEnv || configContext || _imageconfig.imageConfigDefault;
        const allSizes = [
          ...c.deviceSizes,
          ...c.imageSizes
        ].sort((a, b) => a - b);
        const deviceSizes = c.deviceSizes.sort((a, b) => a - b);
        const qualities = c.qualities?.sort((a, b) => a - b);
        return {
          ...c,
          allSizes,
          deviceSizes,
          qualities,
          // During the SSR, configEnv (__NEXT_IMAGE_OPTS) does not include
          // security sensitive configs like `localPatterns`, which is needed
          // during the server render to ensure it's validated. Therefore use
          // configContext, which holds the config from the server for validation.
          localPatterns: typeof window === "undefined" ? configContext?.localPatterns : c.localPatterns
        };
      }, [
        configContext
      ]);
      const { onLoad, onLoadingComplete } = props;
      const onLoadRef = (0, _react.useRef)(onLoad);
      (0, _react.useEffect)(() => {
        onLoadRef.current = onLoad;
      }, [
        onLoad
      ]);
      const onLoadingCompleteRef = (0, _react.useRef)(onLoadingComplete);
      (0, _react.useEffect)(() => {
        onLoadingCompleteRef.current = onLoadingComplete;
      }, [
        onLoadingComplete
      ]);
      const [blurComplete, setBlurComplete] = (0, _react.useState)(false);
      const [showAltText, setShowAltText] = (0, _react.useState)(false);
      const { props: imgAttributes, meta: imgMeta } = (0, _getimgprops.getImgProps)(props, {
        defaultLoader: _imageloader.default,
        imgConf: config,
        blurComplete,
        showAltText
      });
      return /* @__PURE__ */ (0, _jsxruntime.jsxs)(_jsxruntime.Fragment, {
        children: [
          /* @__PURE__ */ (0, _jsxruntime.jsx)(ImageElement, {
            ...imgAttributes,
            unoptimized: imgMeta.unoptimized,
            placeholder: imgMeta.placeholder,
            fill: imgMeta.fill,
            onLoadRef,
            onLoadingCompleteRef,
            setBlurComplete,
            setShowAltText,
            sizesInput: props.sizes,
            ref: forwardedRef
          }),
          imgMeta.preload ? /* @__PURE__ */ (0, _jsxruntime.jsx)(ImagePreload, {
            isAppRouter,
            imgAttributes
          }) : null
        ]
      });
    });
    if ((typeof exports2.default === "function" || typeof exports2.default === "object" && exports2.default !== null) && typeof exports2.default.__esModule === "undefined") {
      Object.defineProperty(exports2.default, "__esModule", { value: true });
      Object.assign(exports2.default, exports2);
      module2.exports = exports2.default;
    }
  }
});

// ../../node_modules/next/dist/shared/lib/image-external.js
var require_image_external = __commonJS({
  "../../node_modules/next/dist/shared/lib/image-external.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    function _export(target, all) {
      for (var name in all) Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
      });
    }
    _export(exports2, {
      default: function() {
        return _default;
      },
      getImageProps: function() {
        return getImageProps;
      }
    });
    var _interop_require_default = require_interop_require_default();
    var _getimgprops = require_get_img_props();
    var _imagecomponent = require_image_component();
    var _imageloader = /* @__PURE__ */ _interop_require_default._(require_image_loader());
    function getImageProps(imgProps) {
      const { props } = (0, _getimgprops.getImgProps)(imgProps, {
        defaultLoader: _imageloader.default,
        // This is replaced by webpack define plugin
        imgConf: process.env.__NEXT_IMAGE_OPTS
      });
      for (const [key, value] of Object.entries(props)) {
        if (value === void 0) {
          delete props[key];
        }
      }
      return {
        props
      };
    }
    var _default = _imagecomponent.Image;
  }
});

// ../../node_modules/next/image.js
var require_image = __commonJS({
  "../../node_modules/next/image.js"(exports2, module2) {
    "use strict";
    module2.exports = require_image_external();
  }
});

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Accordion: () => Accordion,
  AccordionContent: () => AccordionContent,
  AccordionItem: () => AccordionItem,
  AccordionTrigger: () => AccordionTrigger,
  AdminLoginCard: () => AdminLoginCard,
  Alert: () => Alert,
  AlertDescription: () => AlertDescription,
  AlertDialog: () => AlertDialog,
  AlertDialogAction: () => AlertDialogAction,
  AlertDialogCancel: () => AlertDialogCancel,
  AlertDialogContent: () => AlertDialogContent,
  AlertDialogDescription: () => AlertDialogDescription,
  AlertDialogFooter: () => AlertDialogFooter,
  AlertDialogHeader: () => AlertDialogHeader,
  AlertDialogOverlay: () => AlertDialogOverlay,
  AlertDialogPortal: () => AlertDialogPortal,
  AlertDialogTitle: () => AlertDialogTitle,
  AlertDialogTrigger: () => AlertDialogTrigger,
  AlertTitle: () => AlertTitle,
  Badge: () => Badge,
  Button: () => Button,
  Card: () => Card,
  CardAction: () => CardAction,
  CardContent: () => CardContent,
  CardDescription: () => CardDescription,
  CardFooter: () => CardFooter,
  CardHeader: () => CardHeader,
  CardTitle: () => CardTitle,
  ComingSoonState: () => ComingSoonState,
  Dialog: () => Dialog,
  DialogClose: () => DialogClose,
  DialogContent: () => DialogContent,
  DialogDescription: () => DialogDescription,
  DialogFooter: () => DialogFooter,
  DialogHeader: () => DialogHeader,
  DialogOverlay: () => DialogOverlay,
  DialogPortal: () => DialogPortal,
  DialogTitle: () => DialogTitle,
  DialogTrigger: () => DialogTrigger,
  DropdownMenu: () => DropdownMenu,
  DropdownMenuCheckboxItem: () => DropdownMenuCheckboxItem,
  DropdownMenuContent: () => DropdownMenuContent,
  DropdownMenuGroup: () => DropdownMenuGroup,
  DropdownMenuItem: () => DropdownMenuItem,
  DropdownMenuLabel: () => DropdownMenuLabel,
  DropdownMenuPortal: () => DropdownMenuPortal,
  DropdownMenuRadioGroup: () => DropdownMenuRadioGroup,
  DropdownMenuRadioItem: () => DropdownMenuRadioItem,
  DropdownMenuSeparator: () => DropdownMenuSeparator,
  DropdownMenuShortcut: () => DropdownMenuShortcut,
  DropdownMenuSub: () => DropdownMenuSub,
  DropdownMenuSubContent: () => DropdownMenuSubContent,
  DropdownMenuSubTrigger: () => DropdownMenuSubTrigger,
  DropdownMenuTrigger: () => DropdownMenuTrigger,
  EmptyState: () => EmptyState,
  EnhancedTabs: () => Tabs2,
  EnhancedTabsContent: () => TabsContent2,
  EnhancedTabsList: () => TabsList2,
  EnhancedTabsTrigger: () => TabsTrigger2,
  ErrorBoundaryFallback: () => ErrorBoundaryFallback,
  ErrorState: () => ErrorState,
  H1: () => H1,
  H2: () => H2,
  H3: () => H3,
  H4: () => H4,
  IconTabGroup: () => IconTabGroup,
  ImageUpload: () => ImageUpload,
  ImageWithFallback: () => ImageWithFallback,
  InlineError: () => InlineError,
  Input: () => Input,
  Label: () => Label,
  Lead: () => Lead,
  LexicalEditor: () => LexicalEditor,
  LexicalRenderer: () => LexicalRenderer,
  LoadingContent: () => LoadingContent,
  LoadingOverlay: () => LoadingOverlay,
  LoadingSpinner: () => LoadingSpinner,
  MobileCardView: () => MobileCardView,
  MobileField: () => MobileField,
  NoAccessState: () => NoAccessState,
  NoContentState: () => NoContentState,
  NoResultsState: () => NoResultsState,
  OtpInput: () => OtpInput,
  P: () => P,
  Pagination: () => Pagination,
  PhoneInput: () => PhoneInput,
  Popover: () => Popover,
  PopoverAnchor: () => PopoverAnchor,
  PopoverContent: () => PopoverContent,
  PopoverTrigger: () => PopoverTrigger,
  PrivateAppScreen: () => PrivateAppScreen,
  ReferenceTable: () => ReferenceTable,
  ResponsiveTable: () => ResponsiveTable,
  ResponsiveTableBody: () => ResponsiveTableBody,
  ResponsiveTableCell: () => ResponsiveTableCell,
  ResponsiveTableContainer: () => ResponsiveTableContainer,
  ResponsiveTableHead: () => ResponsiveTableHead,
  ResponsiveTableHeader: () => ResponsiveTableHeader,
  ResponsiveTableRow: () => ResponsiveTableRow,
  ScrollArea: () => ScrollArea,
  ScrollBar: () => ScrollBar,
  Select: () => Select,
  SelectContent: () => SelectContent,
  SelectGroup: () => SelectGroup,
  SelectItem: () => SelectItem,
  SelectLabel: () => SelectLabel,
  SelectScrollDownButton: () => SelectScrollDownButton,
  SelectScrollUpButton: () => SelectScrollUpButton,
  SelectSeparator: () => SelectSeparator,
  SelectTrigger: () => SelectTrigger,
  SelectValue: () => SelectValue,
  Separator: () => Separator3,
  Sheet: () => Sheet,
  SheetClose: () => SheetClose,
  SheetContent: () => SheetContent,
  SheetDescription: () => SheetDescription,
  SheetFooter: () => SheetFooter,
  SheetHeader: () => SheetHeader,
  SheetTitle: () => SheetTitle,
  SheetTrigger: () => SheetTrigger,
  SimpleLexicalRenderer: () => SimpleLexicalRenderer,
  Small: () => Small,
  Switch: () => Switch,
  Table: () => Table,
  TableBody: () => TableBody,
  TableCaption: () => TableCaption,
  TableCell: () => TableCell,
  TableFooter: () => TableFooter,
  TableHead: () => TableHead,
  TableHeader: () => TableHeader,
  TableRow: () => TableRow,
  Tabs: () => Tabs,
  TabsContent: () => TabsContent,
  TabsList: () => TabsList,
  TabsTrigger: () => TabsTrigger,
  Textarea: () => Textarea,
  ThemeProvider: () => ThemeProvider,
  ThemeSettings: () => ThemeSettings,
  ThemeToggle: () => ThemeToggle,
  VerifyContactRow: () => VerifyContactRow,
  badgeVariants: () => badgeVariants,
  buttonVariants: () => buttonVariants,
  cn: () => cn,
  toE164: () => toE164,
  useTheme: () => useTheme
});
module.exports = __toCommonJS(index_exports);

// src/utils.ts
var import_clsx = require("clsx");
var import_tailwind_merge = require("tailwind-merge");
function cn(...inputs) {
  return (0, import_tailwind_merge.twMerge)((0, import_clsx.clsx)(inputs));
}

// src/components/button.tsx
var import_react_slot = require("@radix-ui/react-slot");
var import_class_variance_authority = require("class-variance-authority");
var import_jsx_runtime = require("react/jsx-runtime");
var buttonVariants = (0, import_class_variance_authority.cva)(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        // Primary button using theme variables
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        // Destructive button
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        // Secondary button
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        // Outline button with proper theme colors
        outline: "border border-border bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground",
        // Ghost button with proper theme colors
        ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
        // Link button
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 px-6 has-[>svg]:px-4",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? import_react_slot.Slot : "button";
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}

// src/components/card.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function Card({ className = "", ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className = "", ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "div",
    {
      "data-slot": "card-header",
      className: cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      ),
      ...props
    }
  );
}
function CardTitle({ className = "", ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "div",
    {
      "data-slot": "card-title",
      className: cn("leading-none font-semibold", className),
      ...props
    }
  );
}
function CardDescription({ className = "", ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "div",
    {
      "data-slot": "card-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function CardAction({ className = "", ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "div",
    {
      "data-slot": "card-action",
      className: cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className),
      ...props
    }
  );
}
function CardContent({ className = "", ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { "data-slot": "card-content", className: cn("px-6", className), ...props });
}
function CardFooter({ className = "", ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "div",
    {
      "data-slot": "card-footer",
      className: cn("flex items-center px-6 [.border-t]:pt-6", className),
      ...props
    }
  );
}

// src/components/input.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      ),
      ...props
    }
  );
}

// src/components/label.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
function Label({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    "label",
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none",
        className
      ),
      ...props
    }
  );
}

// src/components/select.tsx
var SelectPrimitive = __toESM(require("@radix-ui/react-select"));
var import_lucide_react = require("lucide-react");
var import_jsx_runtime5 = require("react/jsx-runtime");
function Select({ ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(SelectPrimitive.Root, { "data-slot": "select", ...props });
}
function SelectGroup({ ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(SelectPrimitive.Group, { "data-slot": "select-group", ...props });
}
function SelectValue({ ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(SelectPrimitive.Value, { "data-slot": "select-value", ...props });
}
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
    SelectPrimitive.Trigger,
    {
      "data-slot": "select-trigger",
      "data-size": size,
      className: cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_lucide_react.ChevronDownIcon, { className: "size-4 opacity-50" }) })
      ]
    }
  );
}
function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(SelectPrimitive.Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
    SelectPrimitive.Content,
    {
      "data-slot": "select-content",
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      ),
      position,
      ...props,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(SelectScrollUpButton, {}),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          SelectPrimitive.Viewport,
          {
            className: cn(
              "p-1",
              position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
            ),
            children
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(SelectScrollDownButton, {})
      ]
    }
  ) });
}
function SelectLabel({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    SelectPrimitive.Label,
    {
      "data-slot": "select-label",
      className: cn("text-muted-foreground px-2 py-1.5 text-xs", className),
      ...props
    }
  );
}
function SelectItem({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
    SelectPrimitive.Item,
    {
      "data-slot": "select-item",
      className: cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center justify-between rounded-sm py-1.5 px-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(SelectPrimitive.ItemText, { className: "flex-1 truncate", children }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "flex-shrink-0 ml-2 flex size-4 items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_lucide_react.CheckIcon, { className: "size-4" }) }) })
      ]
    }
  );
}
function SelectSeparator({
  className,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    SelectPrimitive.Separator,
    {
      "data-slot": "select-separator",
      className: cn("bg-border pointer-events-none -mx-1 my-1 h-px", className),
      ...props
    }
  );
}
function SelectScrollUpButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    SelectPrimitive.ScrollUpButton,
    {
      "data-slot": "select-scroll-up-button",
      className: cn("flex cursor-default items-center justify-center py-1", className),
      ...props,
      children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_lucide_react.ChevronUpIcon, { className: "size-4" })
    }
  );
}
function SelectScrollDownButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    SelectPrimitive.ScrollDownButton,
    {
      "data-slot": "select-scroll-down-button",
      className: cn("flex cursor-default items-center justify-center py-1", className),
      ...props,
      children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_lucide_react.ChevronDownIcon, { className: "size-4" })
    }
  );
}

// src/components/textarea.tsx
var React = __toESM(require("react"));
var import_jsx_runtime6 = require("react/jsx-runtime");
var Textarea = React.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      "textarea",
      {
        className: cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";

// src/components/switch.tsx
var React2 = __toESM(require("react"));
var SwitchPrimitives = __toESM(require("@radix-ui/react-switch"));
var import_jsx_runtime7 = require("react/jsx-runtime");
var Switch = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
  SwitchPrimitives.Root,
  {
    className: cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] focus-visible:border-ring focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-foreground/30",
      className
    ),
    ...props,
    ref,
    children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      SwitchPrimitives.Thumb,
      {
        className: cn(
          "pointer-events-none block size-5 rounded-full bg-white shadow-md ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        )
      }
    )
  }
));
Switch.displayName = SwitchPrimitives.Root.displayName;

// src/components/otp-input.tsx
var React3 = __toESM(require("react"));
var import_jsx_runtime8 = require("react/jsx-runtime");
function OtpInput({
  length = 6,
  onComplete,
  onChange,
  disabled = false,
  error = false,
  autoFocus = true,
  className
}) {
  const [values, setValues] = React3.useState(Array(length).fill(""));
  const inputRefs = React3.useRef([]);
  React3.useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);
  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newValues = [...values];
    newValues[index] = digit;
    setValues(newValues);
    const code = newValues.join("");
    onChange?.(code);
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (newValues.every((v) => v !== "")) {
      onComplete?.(newValues.join(""));
    }
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (pastedData.length > 0) {
      const newValues = [...values];
      for (let i = 0; i < pastedData.length; i++) {
        newValues[i] = pastedData[i];
      }
      setValues(newValues);
      const code = newValues.join("");
      onChange?.(code);
      const focusIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[focusIndex]?.focus();
      if (newValues.every((v) => v !== "")) {
        onComplete?.(newValues.join(""));
      }
    }
  };
  const handleKeyDown = (index, e) => {
    switch (e.key) {
      case "Backspace":
        if (!values[index] && index > 0) {
          inputRefs.current[index - 1]?.focus();
        } else {
          const newValues = [...values];
          newValues[index] = "";
          setValues(newValues);
          onChange?.(newValues.join(""));
        }
        break;
      case "ArrowLeft":
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
        break;
      case "ArrowRight":
        if (index < length - 1) {
          inputRefs.current[index + 1]?.focus();
        }
        break;
      default:
        break;
    }
  };
  const handleFocus = (e) => {
    e.target.select();
  };
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: cn("flex gap-2 justify-center", className), children: Array.from({ length }).map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
    "input",
    {
      ref: (el) => {
        inputRefs.current[index] = el;
      },
      type: "text",
      inputMode: "numeric",
      autoComplete: index === 0 ? "one-time-code" : "off",
      maxLength: 1,
      value: values[index],
      onChange: (e) => handleChange(index, e.target.value),
      onKeyDown: (e) => handleKeyDown(index, e),
      onPaste: handlePaste,
      onFocus: handleFocus,
      disabled,
      "aria-label": `Digit ${index + 1} of ${length}`,
      className: cn(
        "w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-semibold",
        "border rounded-lg bg-background",
        "transition-all duration-150",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        error ? "border-destructive ring-destructive/20 focus:ring-destructive focus:border-destructive" : "border-input hover:border-primary/50"
      )
    },
    index
  )) });
}

// src/components/verify-contact-row.tsx
var React4 = __toESM(require("react"));

// src/components/badge.tsx
var import_class_variance_authority2 = require("class-variance-authority");
var import_jsx_runtime9 = require("react/jsx-runtime");
var badgeVariants = (0, import_class_variance_authority2.cva)(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: cn(badgeVariants({ variant }), className), ...props });
}

// src/components/verify-contact-row.tsx
var import_jsx_runtime10 = require("react/jsx-runtime");
function maskEmail(email) {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const maskedLocal = local.length > 2 ? `${local[0]}***${local[local.length - 1]}` : `${local[0]}***`;
  return `${maskedLocal}@${domain}`;
}
function maskPhone(phone) {
  if (phone.length < 6) return phone;
  return `${phone.slice(0, 3)}***${phone.slice(-2)}`;
}
function VerifyContactRow({
  type,
  value,
  verified,
  pendingValue,
  pendingVerified = false,
  onRequestOtp,
  onVerifyOtp,
  onCancelPending,
  masked = false,
  disabled = false,
  className
}) {
  const [state, setState] = React4.useState(
    verified ? "verified" : "idle"
  );
  const [error, setError] = React4.useState(null);
  const [resendTimer, setResendTimer] = React4.useState(0);
  React4.useEffect(() => {
    if (verified) {
      setState("verified");
    } else if (state === "verified") {
      setState("idle");
    }
  }, [verified, state]);
  React4.useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1e3);
      return () => clearTimeout(timer);
    }
    return void 0;
  }, [resendTimer]);
  const displayValue = React4.useMemo(() => {
    if (!value) return null;
    if (!masked) return value;
    return type === "email" ? maskEmail(value) : maskPhone(value);
  }, [value, masked, type]);
  const handleSendCode = async () => {
    setState("sending");
    setError(null);
    try {
      const result = await onRequestOtp();
      if (result.success) {
        setState("awaiting_code");
        setResendTimer(60);
      } else {
        setError(result.error ?? "Failed to send code");
        setState("error");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send code");
      setState("error");
    }
  };
  const handleVerifyCode = async (code) => {
    setState("verifying");
    setError(null);
    try {
      const result = await onVerifyOtp(code);
      if (result.success) {
        setState("verified");
      } else {
        setError(result.error ?? "Invalid code");
        setState("awaiting_code");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
      setState("awaiting_code");
    }
  };
  const handleCancel = () => {
    setState("idle");
    setError(null);
  };
  const handleCancelPending = async () => {
    if (onCancelPending) {
      await onCancelPending();
    }
  };
  if (!value) {
    return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: cn("flex items-center justify-between py-3", className), children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "text-sm font-medium capitalize", children: type }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "text-sm text-muted-foreground", children: "Not set" })
    ] }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: cn("py-3", className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "text-sm font-medium capitalize", children: type }),
          verified && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Badge, { variant: "default", className: "bg-green-500/10 text-green-600 hover:bg-green-500/20", children: "Verified" }),
          !verified && state !== "verified" && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Badge, { variant: "secondary", className: "text-muted-foreground", children: "Not verified" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "text-sm text-foreground truncate", children: displayValue })
      ] }),
      !verified && state === "idle" && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: handleSendCode,
          disabled,
          children: "Verify"
        }
      ),
      state === "sending" && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Button, { variant: "outline", size: "sm", disabled: true, children: "Sending..." }),
      state === "verified" && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "text-green-600 text-sm flex items-center gap-1", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 20 20",
          fill: "currentColor",
          className: "w-5 h-5",
          children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            "path",
            {
              fillRule: "evenodd",
              d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",
              clipRule: "evenodd"
            }
          )
        }
      ) })
    ] }),
    (state === "awaiting_code" || state === "verifying") && /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "mt-4 p-4 bg-muted/50 rounded-lg", children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("p", { className: "text-sm text-muted-foreground mb-3", children: [
        "Enter the 6-digit code sent to your ",
        type
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
        OtpInput,
        {
          onComplete: handleVerifyCode,
          disabled: state === "verifying" || disabled,
          error: !!error,
          autoFocus: true
        }
      ),
      error && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "text-sm text-destructive mt-2 text-center", children: error }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "flex items-center justify-between mt-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Button, { variant: "ghost", size: "sm", onClick: handleCancel, disabled: state === "verifying", children: "Cancel" }),
        resendTimer > 0 ? /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("span", { className: "text-sm text-muted-foreground", children: [
          "Resend in ",
          resendTimer,
          "s"
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: handleSendCode,
            disabled: state === "verifying" || disabled,
            children: "Resend code"
          }
        )
      ] })
    ] }),
    state === "error" && /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "mt-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "text-sm text-destructive", children: error }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Button, { variant: "outline", size: "sm", onClick: () => setState("idle"), className: "mt-2", children: "Try again" })
    ] }),
    pendingValue && !pendingVerified && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "mt-3 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "text-sm font-medium text-amber-800 dark:text-amber-200", children: "Pending change" }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "text-sm text-amber-700 dark:text-amber-300", children: masked ? type === "email" ? maskEmail(pendingValue) : maskPhone(pendingValue) : pendingValue })
      ] }),
      onCancelPending && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: handleCancelPending,
          className: "text-amber-700 hover:text-amber-900",
          children: "Cancel"
        }
      )
    ] }) })
  ] });
}

// src/components/accordion.tsx
var AccordionPrimitive = __toESM(require("@radix-ui/react-accordion"));
var import_lucide_react2 = require("lucide-react");
var import_jsx_runtime11 = require("react/jsx-runtime");
function Accordion({ ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(AccordionPrimitive.Root, { "data-slot": "accordion", ...props });
}
function AccordionItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
    AccordionPrimitive.Item,
    {
      "data-slot": "accordion-item",
      className: cn("border-b last:border-b-0", className),
      ...props
    }
  );
}
function AccordionTrigger({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(AccordionPrimitive.Header, { className: "flex", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
    AccordionPrimitive.Trigger,
    {
      "data-slot": "accordion-trigger",
      className: cn(
        "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(import_lucide_react2.ChevronDownIcon, { className: "text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" })
      ]
    }
  ) });
}
function AccordionContent({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
    AccordionPrimitive.Content,
    {
      "data-slot": "accordion-content",
      className: "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm",
      ...props,
      children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: cn("pt-0 pb-4", className), children })
    }
  );
}

// src/components/tabs.tsx
var TabsPrimitive = __toESM(require("@radix-ui/react-tabs"));
var import_jsx_runtime12 = require("react/jsx-runtime");
function Tabs({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
    TabsPrimitive.Root,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
    TabsPrimitive.List,
    {
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-10 w-fit items-center justify-center rounded-lg p-1",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
    TabsPrimitive.Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        // Inactive state
        "text-muted-foreground hover:text-foreground",
        // Active state - much more prominent
        "data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800",
        "data-[state=active]:text-primary data-[state=active]:font-semibold",
        "data-[state=active]:shadow-md",
        "data-[state=active]:border-b-2 data-[state=active]:border-b-primary",
        className
      ),
      ...props
    }
  );
}
function TabsContent({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
    TabsPrimitive.Content,
    {
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className),
      ...props
    }
  );
}

// src/components/enhanced-tabs.tsx
var TabsPrimitive2 = __toESM(require("@radix-ui/react-tabs"));
var import_jsx_runtime13 = require("react/jsx-runtime");
function Tabs2({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(TabsPrimitive2.Root, { className: cn("flex flex-col gap-2", className), ...props });
}
function TabsList2({ className, variant = "default", ...props }) {
  const variantStyles = {
    default: "bg-muted text-muted-foreground inline-flex h-10 w-fit items-center justify-center rounded-lg p-1",
    segmented: "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
    pills: "inline-flex h-10 w-fit items-center justify-center gap-1 p-1"
  };
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(TabsPrimitive2.List, { className: cn(variantStyles[variant], className), ...props });
}
function TabsTrigger2({
  className,
  icon: Icon2,
  showIconOnly = false,
  variant = "default",
  children,
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variantStyles = {
    default: {
      base: "px-3 py-1.5 text-sm font-medium",
      inactive: "text-muted-foreground hover:text-foreground",
      active: "data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:shadow-md"
    },
    segmented: {
      base: "h-[calc(100%-1px)] flex-1 gap-1.5 border border-transparent px-3 py-1 text-sm font-medium",
      inactive: "text-muted-foreground hover:text-foreground",
      active: "data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:font-semibold"
    },
    pills: {
      base: "px-3 py-1.5 text-sm font-medium rounded-full",
      inactive: "text-muted-foreground hover:text-foreground hover:bg-muted/50",
      active: "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
    }
  };
  const styles = variantStyles[variant];
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
    TabsPrimitive2.Trigger,
    {
      className: cn(baseStyles, styles.base, styles.inactive, styles.active, className),
      ...props,
      children: [
        Icon2 && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Icon2, { className: cn("h-4 w-4", !showIconOnly && children && "mr-1.5") }),
        !showIconOnly && children
      ]
    }
  );
}
function TabsContent2({
  className,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(TabsPrimitive2.Content, { className: cn("flex-1 outline-none", className), ...props });
}
function IconTabGroup({
  value,
  onValueChange,
  options,
  showLabels = false,
  variant = "segmented",
  className
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Tabs2, { value, onValueChange, className, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(TabsList2, { variant, children: options.map(({ value: optionValue, label, icon }) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
    TabsTrigger2,
    {
      value: optionValue,
      icon,
      showIconOnly: !showLabels,
      variant,
      children: showLabels && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: "hidden sm:inline", children: label })
    },
    optionValue
  )) }) });
}

// src/components/table.tsx
var import_jsx_runtime14 = require("react/jsx-runtime");
function Table({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { "data-slot": "table-container", className: "relative w-full overflow-x-auto", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    "table",
    {
      "data-slot": "table",
      className: cn("w-full caption-bottom text-sm", className),
      ...props
    }
  ) });
}
function TableHeader({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("thead", { "data-slot": "table-header", className: cn("[&_tr]:border-b", className), ...props });
}
function TableBody({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    "tbody",
    {
      "data-slot": "table-body",
      className: cn("[&_tr:last-child]:border-0", className),
      ...props
    }
  );
}
function TableFooter({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    "tfoot",
    {
      "data-slot": "table-footer",
      className: cn("bg-muted/50 border-t font-medium [&>tr]:last:border-b-0", className),
      ...props
    }
  );
}
function TableRow({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    "tr",
    {
      "data-slot": "table-row",
      className: cn(
        "hover:bg-accent/50 data-[state=selected]:bg-accent border-b transition-colors",
        className
      ),
      ...props
    }
  );
}
function TableHead({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    "th",
    {
      "data-slot": "table-head",
      className: cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
function TableCell({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    "td",
    {
      "data-slot": "table-cell",
      className: cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
function TableCaption({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    "caption",
    {
      "data-slot": "table-caption",
      className: cn("text-muted-foreground mt-4 text-sm", className),
      ...props
    }
  );
}

// src/components/alert.tsx
var React5 = __toESM(require("react"));
var import_class_variance_authority3 = require("class-variance-authority");
var import_jsx_runtime15 = require("react/jsx-runtime");
var alertVariants = (0, import_class_variance_authority3.cva)(
  "relative w-full rounded-lg border border-border/50 px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
var Alert = React5.forwardRef(({ className, variant, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", { ref, role: "alert", className: cn(alertVariants({ variant }), className), ...props }));
Alert.displayName = "Alert";
var AlertTitle = React5.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
    "h5",
    {
      ref,
      className: cn("mb-1 font-medium leading-none tracking-tight", className),
      ...props
    }
  )
);
AlertTitle.displayName = "AlertTitle";
var AlertDescription = React5.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", { ref, className: cn("text-sm [&_p]:leading-relaxed", className), ...props }));
AlertDescription.displayName = "AlertDescription";

// src/components/popover.tsx
var React6 = __toESM(require("react"));
var PopoverPrimitive = __toESM(require("@radix-ui/react-popover"));
var import_jsx_runtime16 = require("react/jsx-runtime");
var Popover = PopoverPrimitive.Root;
var PopoverTrigger = PopoverPrimitive.Trigger;
var PopoverAnchor = PopoverPrimitive.Anchor;
var PopoverContent = React6.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(PopoverPrimitive.Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
  PopoverPrimitive.Content,
  {
    ref,
    align,
    sideOffset,
    className: cn(
      "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 rounded-md border p-4 shadow-md outline-none",
      className
    ),
    ...props
  }
) }));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

// src/components/scroll-area.tsx
var React7 = __toESM(require("react"));
var ScrollAreaPrimitive = __toESM(require("@radix-ui/react-scroll-area"));
var import_jsx_runtime17 = require("react/jsx-runtime");
var ScrollArea = React7.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(
  ScrollAreaPrimitive.Root,
  {
    ref,
    className: cn("relative overflow-hidden", className),
    ...props,
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(ScrollAreaPrimitive.Viewport, { className: "h-full w-full rounded-[inherit]", children }),
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(ScrollBar, {}),
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(ScrollAreaPrimitive.Corner, {})
    ]
  }
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;
var ScrollBar = React7.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
  ScrollAreaPrimitive.ScrollAreaScrollbar,
  {
    ref,
    orientation,
    className: cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    ),
    ...props,
    children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(ScrollAreaPrimitive.ScrollAreaThumb, { className: "bg-border relative flex-1 rounded-full" })
  }
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

// src/components/phone-input.tsx
var import_react = require("react");
var import_libphonenumber_js = require("libphonenumber-js");
var import_lucide_react3 = require("lucide-react");
var import_jsx_runtime18 = require("react/jsx-runtime");
var countryNames = new Intl.DisplayNames(["en"], { type: "region" });
function getCountryName(code) {
  try {
    return countryNames.of(code) ?? code;
  } catch {
    return code;
  }
}
function getFlag(code) {
  return code.toUpperCase().split("").map((c) => String.fromCodePoint(127462 + c.charCodeAt(0) - 65)).join("");
}
var PRIORITY_COUNTRIES = [
  "AU",
  "US",
  "GB",
  "CA",
  "NZ",
  "IN",
  "SG",
  "DE",
  "FR",
  "JP"
];
function buildCountryList() {
  const all = (0, import_libphonenumber_js.getCountries)();
  const entries = all.map((code) => ({
    code,
    name: getCountryName(code),
    dial: "+" + (0, import_libphonenumber_js.getCountryCallingCode)(code),
    flag: getFlag(code)
  }));
  entries.sort((a, b) => a.name.localeCompare(b.name));
  const prioritySet = new Set(PRIORITY_COUNTRIES);
  const priority = PRIORITY_COUNTRIES.map(
    (c) => entries.find((e) => e.code === c)
  ).filter(Boolean);
  const rest = entries.filter((e) => !prioritySet.has(e.code));
  return [...priority, ...rest];
}
var COUNTRIES = buildCountryList();
function detectDefaultCountry() {
  if (typeof navigator === "undefined") return "US";
  const lang = navigator.language;
  const parts = lang.split("-");
  if (parts.length >= 2) {
    const region = parts[parts.length - 1].toUpperCase();
    if ((0, import_libphonenumber_js.getCountries)().includes(region)) return region;
  }
  return "US";
}
function PhoneInput({
  value,
  onChange,
  onE164Change,
  country: controlledCountry,
  onCountryChange,
  placeholder,
  autoFocus,
  className,
  id
}) {
  const [internalCountry, setInternalCountry] = (0, import_react.useState)(detectDefaultCountry);
  const country = controlledCountry ?? internalCountry;
  const setCountry = onCountryChange ?? setInternalCountry;
  const [open, setOpen] = (0, import_react.useState)(false);
  const [search, setSearch] = (0, import_react.useState)("");
  const searchRef = (0, import_react.useRef)(null);
  const filtered = (0, import_react.useMemo)(() => {
    if (!search) return COUNTRIES;
    const q = search.toLowerCase();
    return COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.dial.includes(q)
    );
  }, [search]);
  (0, import_react.useEffect)(() => {
    if (!value.startsWith("+")) return;
    const parsed = (0, import_libphonenumber_js.parsePhoneNumberFromString)(value);
    if (parsed?.country && parsed.country !== country) {
      setCountry(parsed.country);
    }
  }, [value]);
  (0, import_react.useEffect)(() => {
    if (!value.trim()) {
      onE164Change?.("");
      return;
    }
    const parsed = (0, import_libphonenumber_js.parsePhoneNumberFromString)(value, country);
    onE164Change?.(parsed?.isValid() ? parsed.format("E.164") : "");
  }, [value, country]);
  const dialCode = "+" + (0, import_libphonenumber_js.getCountryCallingCode)(country);
  const flag = getFlag(country);
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: cn("flex", className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(Popover, { open, onOpenChange: (v) => {
      setOpen(v);
      if (!v) setSearch("");
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(
        "button",
        {
          type: "button",
          className: cn(
            "border-input bg-transparent flex h-9 shrink-0 items-center gap-1 rounded-l-md border border-r-0 px-2 text-sm transition-colors",
            "hover:bg-accent focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
          ),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "text-base leading-none", children: flag }),
            /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "text-muted-foreground text-xs", children: dialCode }),
            /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_lucide_react3.ChevronDown, { className: "text-muted-foreground h-3 w-3" })
          ]
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(PopoverContent, { className: "w-64 p-0", align: "start", children: [
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "p-2", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
          Input,
          {
            ref: searchRef,
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "Search countries...",
            className: "h-8 text-sm",
            autoFocus: true
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(ScrollArea, { className: "h-56", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "px-1 pb-1", children: [
          filtered.map((c, i) => {
            const showSep = !search && i === PRIORITY_COUNTRIES.length && i < filtered.length;
            return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { children: [
              showSep && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "border-border mx-2 my-1 border-t" }),
              /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(
                "button",
                {
                  type: "button",
                  className: cn(
                    "flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors",
                    "hover:bg-accent",
                    c.code === country && "bg-accent"
                  ),
                  onClick: () => {
                    setCountry(c.code);
                    setOpen(false);
                    setSearch("");
                  },
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "text-base leading-none", children: c.flag }),
                    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "flex-1 truncate text-left", children: c.name }),
                    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "text-muted-foreground text-xs", children: c.dial })
                  ]
                }
              )
            ] }, c.code);
          }),
          filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("p", { className: "text-muted-foreground px-2 py-3 text-center text-sm", children: "No countries found" })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
      Input,
      {
        id,
        type: "tel",
        value,
        onChange: (e) => onChange(e.target.value),
        placeholder: placeholder ?? "Phone number",
        autoFocus,
        className: "rounded-l-none"
      }
    )
  ] });
}
function toE164(raw, country) {
  const parsed = (0, import_libphonenumber_js.parsePhoneNumberFromString)(raw, country);
  return parsed?.isValid() ? parsed.format("E.164") : null;
}

// src/components/admin-login-card.tsx
var import_react2 = require("react");
var import_lucide_react4 = require("lucide-react");
var import_jsx_runtime19 = require("react/jsx-runtime");
function AdminLoginCard({
  appName,
  subtitle,
  heroTitle,
  heroDescription,
  onRequestOtp,
  onVerifyOtp,
  footerText,
  defaultPhoneCountry,
  alreadyAuthenticated,
  privacyUrl,
  termsUrl
}) {
  const [step, setStep] = (0, import_react2.useState)("identifier");
  const [inputMode, setInputMode] = (0, import_react2.useState)("email");
  const [email, setEmail] = (0, import_react2.useState)("");
  const [phoneRaw, setPhoneRaw] = (0, import_react2.useState)("");
  const [phoneE164, setPhoneE164] = (0, import_react2.useState)("");
  const [phoneCountry, setPhoneCountry] = (0, import_react2.useState)(
    defaultPhoneCountry
  );
  const [loading, setLoading] = (0, import_react2.useState)(false);
  const [error, setError] = (0, import_react2.useState)(null);
  const [resendTimer, setResendTimer] = (0, import_react2.useState)(0);
  const displayIdentifier = inputMode === "email" ? email : phoneRaw;
  (0, import_react2.useEffect)(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1e3);
      return () => clearTimeout(timer);
    }
    return void 0;
  }, [resendTimer]);
  if (alreadyAuthenticated) {
    return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: "flex items-center justify-center min-h-screen bg-background", children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(import_lucide_react4.Loader2, { className: "w-8 h-8 animate-spin text-primary" }) });
  }
  const handleRequestOtp = async () => {
    const identifier = inputMode === "email" ? email.trim() : phoneE164 || phoneRaw.trim();
    const channel = inputMode === "email" ? "email" : "sms";
    if (!identifier) {
      setError(
        inputMode === "email" ? "Please enter your email address" : "Please enter a valid phone number"
      );
      return;
    }
    if (inputMode === "phone" && !phoneE164) {
      setError("Please enter a valid phone number");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await onRequestOtp(
        identifier,
        channel,
        inputMode === "phone" ? phoneE164 : void 0
      );
      if (result.success) {
        setStep("otp");
        setResendTimer(60);
      } else {
        setError(result.error ?? "Failed to send verification code");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyOtp = async (code) => {
    setLoading(true);
    setError(null);
    try {
      const verifyIdentifier = inputMode === "email" ? email.trim() : phoneE164;
      const verifyChannel = inputMode === "email" ? "email" : "sms";
      const result = await onVerifyOtp(code, verifyIdentifier, verifyChannel);
      if (!result.success) {
        setError(result.error ?? "Invalid verification code");
      }
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleBack = () => {
    setStep("identifier");
    setError(null);
  };
  const handleResend = () => {
    if (resendTimer === 0) {
      handleRequestOtp();
    }
  };
  const toggleInputMode = () => {
    setInputMode((prev) => prev === "email" ? "phone" : "email");
    setError(null);
  };
  const authCard = /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "bg-card border rounded-xl shadow-lg p-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("h1", { className: "text-2xl font-bold text-foreground lg:hidden", children: appName }),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("h2", { className: "text-xl font-semibold text-foreground hidden lg:block", children: "Sign in" }),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("p", { className: "text-muted-foreground mt-2", children: step === "identifier" ? subtitle ?? "Sign in with your work credentials" : "Enter verification code" })
      ] }),
      step === "identifier" ? /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(
        "form",
        {
          onSubmit: (e) => {
            e.preventDefault();
            handleRequestOtp();
          },
          className: "space-y-6",
          children: [
            inputMode === "email" ? /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
                "label",
                {
                  htmlFor: "login-email",
                  className: "block text-sm font-medium text-foreground mb-2",
                  children: "Email"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
                "input",
                {
                  id: "login-email",
                  type: "email",
                  autoComplete: "email",
                  required: true,
                  placeholder: "you@example.com",
                  className: "w-full px-4 py-3 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors",
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                  disabled: loading
                }
              )
            ] }) : /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
                "label",
                {
                  htmlFor: "login-phone",
                  className: "block text-sm font-medium text-foreground mb-2",
                  children: "Phone number"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
                PhoneInput,
                {
                  id: "login-phone",
                  value: phoneRaw,
                  onChange: setPhoneRaw,
                  onE164Change: setPhoneE164,
                  country: phoneCountry,
                  onCountryChange: setPhoneCountry,
                  autoFocus: true
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
              "button",
              {
                type: "button",
                onClick: toggleInputMode,
                className: "flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors",
                disabled: loading,
                children: inputMode === "email" ? /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(import_jsx_runtime19.Fragment, { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(import_lucide_react4.Phone, { className: "w-3.5 h-3.5" }),
                  "Use mobile instead"
                ] }) : /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(import_jsx_runtime19.Fragment, { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(import_lucide_react4.Mail, { className: "w-3.5 h-3.5" }),
                  "Use email instead"
                ] })
              }
            ),
            error && /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: "p-3 bg-destructive/10 border border-destructive/20 rounded-lg", children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("p", { className: "text-sm text-destructive", children: error }) }),
            /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
              "button",
              {
                type: "submit",
                disabled: loading,
                className: "w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-lg shadow hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                children: loading ? /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(import_jsx_runtime19.Fragment, { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(import_lucide_react4.Loader2, { className: "w-4 h-4 animate-spin" }),
                  "Sending..."
                ] }) : "Send Code"
              }
            ),
            footerText && /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("p", { className: "text-xs text-center text-muted-foreground", children: footerText })
          ]
        }
      ) : (
        /* Step 2: Enter OTP */
        /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "space-y-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(
            "button",
            {
              type: "button",
              onClick: handleBack,
              className: "flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors",
              disabled: loading,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(import_lucide_react4.ArrowLeft, { className: "w-4 h-4" }),
                "Back"
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "text-center", children: [
            /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("p", { className: "text-sm text-muted-foreground", children: "Enter the 6-digit code sent to" }),
            /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("p", { className: "font-medium text-foreground mt-1", children: displayIdentifier })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
            OtpInput,
            {
              onComplete: handleVerifyOtp,
              disabled: loading,
              error: !!error,
              autoFocus: true
            }
          ),
          error && /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: "p-3 bg-destructive/10 border border-destructive/20 rounded-lg", children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("p", { className: "text-sm text-destructive text-center", children: error }) }),
          loading && /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "flex items-center justify-center gap-2 text-muted-foreground", children: [
            /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(import_lucide_react4.Loader2, { className: "w-4 h-4 animate-spin" }),
            /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: "text-sm", children: "Verifying..." })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: "text-center", children: resendTimer > 0 ? /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("p", { className: "text-sm text-muted-foreground", children: [
            "Resend code in ",
            resendTimer,
            "s"
          ] }) : /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
            "button",
            {
              type: "button",
              onClick: handleResend,
              disabled: loading,
              className: "text-sm text-primary hover:underline disabled:opacity-50",
              children: "Resend code"
            }
          ) })
        ] })
      )
    ] }),
    (privacyUrl || termsUrl) && /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "flex items-center justify-center gap-4 mt-6 text-xs text-muted-foreground", children: [
      privacyUrl && /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
        "a",
        {
          href: privacyUrl,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "hover:text-foreground transition-colors",
          children: "Privacy Policy"
        }
      ),
      privacyUrl && termsUrl && /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { children: "\xB7" }),
      termsUrl && /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
        "a",
        {
          href: termsUrl,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "hover:text-foreground transition-colors",
          children: "Terms of Service"
        }
      )
    ] })
  ] });
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("nav", { className: "border-b bg-card/50 backdrop-blur-sm", children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center", children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: "text-lg font-semibold text-foreground", children: appName }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "flex min-h-[calc(100vh-3.5rem)]", children: [
      /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: "hidden lg:flex lg:w-1/2 bg-primary/5 items-center justify-center p-12", children: /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "max-w-md space-y-6", children: [
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("h2", { className: "text-4xl font-bold text-foreground tracking-tight", children: heroTitle ?? `Welcome to ${appName}` }),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("p", { className: "text-lg text-muted-foreground leading-relaxed", children: heroDescription ?? "Sign in to access your dashboard and manage your platform." })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: "flex flex-1 items-center justify-center p-6 sm:p-12", children: authCard })
    ] })
  ] });
}

// src/components/dialog.tsx
var DialogPrimitive = __toESM(require("@radix-ui/react-dialog"));
var import_lucide_react5 = require("lucide-react");
var import_jsx_runtime20 = require("react/jsx-runtime");
function Dialog({ ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(DialogPrimitive.Root, { "data-slot": "dialog", ...props });
}
function DialogTrigger({ ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(DialogPrimitive.Trigger, { "data-slot": "dialog-trigger", ...props });
}
function DialogPortal({ ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(DialogPrimitive.Portal, { "data-slot": "dialog-portal", ...props });
}
function DialogClose({ ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(DialogPrimitive.Close, { "data-slot": "dialog-close", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
    DialogPrimitive.Overlay,
    {
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 flex items-center justify-center",
        className
      ),
      ...props
    }
  );
}
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(DialogPortal, { "data-slot": "dialog-portal", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(DialogOverlay, { children: /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(
    DialogPrimitive.Content,
    {
      "data-slot": "dialog-content",
      className: cn(
        "relative z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg sm:rounded-lg transition-opacity duration-200 data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
        className
      ),
      style: props.style,
      ...props,
      children: [
        children,
        showCloseButton && /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(
          DialogPrimitive.Close,
          {
            "data-slot": "dialog-close",
            className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(import_lucide_react5.XIcon, {}),
              /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { className: "sr-only", children: "Close" })
            ]
          }
        )
      ]
    }
  ) }) });
}
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function DialogFooter({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
    "div",
    {
      "data-slot": "dialog-footer",
      className: cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
      ...props
    }
  );
}
function DialogTitle({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
    DialogPrimitive.Title,
    {
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className),
      ...props
    }
  );
}
function DialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
    DialogPrimitive.Description,
    {
      "data-slot": "dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}

// src/components/alert-dialog.tsx
var React8 = __toESM(require("react"));
var AlertDialogPrimitive = __toESM(require("@radix-ui/react-alert-dialog"));
var import_jsx_runtime21 = require("react/jsx-runtime");
var AlertDialog = AlertDialogPrimitive.Root;
var AlertDialogTrigger = AlertDialogPrimitive.Trigger;
var AlertDialogPortal = AlertDialogPrimitive.Portal;
var AlertDialogOverlay = React8.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
  AlertDialogPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;
var AlertDialogContent = React8.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(AlertDialogPortal, { children: [
  /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(AlertDialogOverlay, {}),
  /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
    AlertDialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = React8.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
  AlertDialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props
  }
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;
var AlertDialogDescription = React8.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
  AlertDialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;
var AlertDialogAction = React8.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(AlertDialogPrimitive.Action, { ref, className: cn(buttonVariants(), className), ...props }));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;
var AlertDialogCancel = React8.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
  AlertDialogPrimitive.Cancel,
  {
    ref,
    className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
    ...props
  }
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

// src/components/sheet.tsx
var SheetPrimitive = __toESM(require("@radix-ui/react-dialog"));
var import_lucide_react6 = require("lucide-react");
var import_jsx_runtime22 = require("react/jsx-runtime");
function Sheet({ ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(SheetPrimitive.Root, { "data-slot": "sheet", ...props });
}
function SheetTrigger({ ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(SheetPrimitive.Trigger, { "data-slot": "sheet-trigger", ...props });
}
function SheetClose({ ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(SheetPrimitive.Close, { "data-slot": "sheet-close", ...props });
}
function SheetPortal({ ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(SheetPrimitive.Portal, { "data-slot": "sheet-portal", ...props });
}
function SheetOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
    SheetPrimitive.Overlay,
    {
      "data-slot": "sheet-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function SheetContent({
  className,
  children,
  side = "right",
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(SheetPortal, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(SheetOverlay, {}),
    /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(
      SheetPrimitive.Content,
      {
        "data-slot": "sheet-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        ),
        ...props,
        children: [
          children,
          /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(SheetPrimitive.Close, { className: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none", children: [
            /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(import_lucide_react6.XIcon, { className: "size-4" }),
            /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
function SheetHeader({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
    "div",
    {
      "data-slot": "sheet-header",
      className: cn("flex flex-col gap-1.5 p-4 border-b", className),
      ...props
    }
  );
}
function SheetFooter({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
    "div",
    {
      "data-slot": "sheet-footer",
      className: cn("mt-auto flex flex-col gap-2 p-4", className),
      ...props
    }
  );
}
function SheetTitle({ className, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
    SheetPrimitive.Title,
    {
      "data-slot": "sheet-title",
      className: cn("text-foreground font-semibold", className),
      ...props
    }
  );
}
function SheetDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
    SheetPrimitive.Description,
    {
      "data-slot": "sheet-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}

// src/components/dropdown-menu.tsx
var React9 = __toESM(require("react"));
var DropdownMenuPrimitive = __toESM(require("@radix-ui/react-dropdown-menu"));
var import_lucide_react7 = require("lucide-react");
var import_jsx_runtime23 = require("react/jsx-runtime");
var DropdownMenu = DropdownMenuPrimitive.Root;
var DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
var DropdownMenuGroup = DropdownMenuPrimitive.Group;
var DropdownMenuPortal = DropdownMenuPrimitive.Portal;
var DropdownMenuSub = DropdownMenuPrimitive.Sub;
var DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
var DropdownMenuSubTrigger = React9.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)(
  DropdownMenuPrimitive.SubTrigger,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
      inset === true && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(import_lucide_react7.ChevronRight, { className: "ml-auto h-4 w-4" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
var DropdownMenuSubContent = React9.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
  DropdownMenuPrimitive.SubContent,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
var DropdownMenuContent = React9.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
  DropdownMenuPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
var DropdownMenuItem = React9.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
  DropdownMenuPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset === true && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
var DropdownMenuCheckboxItem = React9.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)(
  DropdownMenuPrimitive.CheckboxItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked: checked === true,
    ...props,
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(import_lucide_react7.Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
var DropdownMenuRadioItem = React9.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)(
  DropdownMenuPrimitive.RadioItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(import_lucide_react7.Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
var DropdownMenuLabel = React9.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
  DropdownMenuPrimitive.Label,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", inset === true && "pl-8", className),
    ...props
  }
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
var DropdownMenuSeparator = React9.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
  DropdownMenuPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { className: cn("ml-auto text-xs tracking-widest opacity-60", className), ...props });
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

// src/components/pagination.tsx
var import_lucide_react8 = require("lucide-react");
var import_jsx_runtime24 = require("react/jsx-runtime");
function Pagination({
  pagination,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  showPageSizeSelector = true,
  className = ""
}) {
  const { currentPage, pageSize, totalCount, totalPages } = pagination;
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }
    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }
    rangeWithDots.push(...range);
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }
    return rangeWithDots;
  };
  const visiblePages = totalPages > 1 ? getVisiblePages() : [];
  if (totalCount === 0) {
    return null;
  }
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(
    "div",
    {
      className: `flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("p", { className: "text-sm text-muted-foreground", children: [
            "Showing ",
            startItem.toLocaleString(),
            " to ",
            endItem.toLocaleString(),
            " of",
            " ",
            totalCount.toLocaleString(),
            " results"
          ] }),
          showPageSizeSelector && /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("span", { className: "text-sm text-muted-foreground", children: "Rows per page:" }),
            /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(
              Select,
              {
                value: pageSize.toString(),
                onValueChange: (value) => onPageSizeChange(Number(value)),
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(SelectTrigger, { className: "w-20", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(SelectValue, {}) }),
                  /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(SelectContent, { children: pageSizeOptions.map((size) => /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(SelectItem, { value: size.toString(), children: size }, size)) })
                ]
              }
            )
          ] })
        ] }),
        totalPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => onPageChange(currentPage - 1),
              disabled: currentPage === 1,
              className: "h-8 w-8 p-0",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(import_lucide_react8.ChevronLeft, { className: "h-4 w-4" }),
                /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("span", { className: "sr-only", children: "Previous page" })
              ]
            }
          ),
          visiblePages.map((page, index) => /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { children: page === "..." ? /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className: "flex h-8 w-8 items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(import_lucide_react8.MoreHorizontal, { className: "h-4 w-4" }) }) : /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
            Button,
            {
              variant: page === currentPage ? "default" : "outline",
              size: "sm",
              onClick: () => onPageChange(page),
              className: "h-8 w-8 p-0",
              children: page
            }
          ) }, index)),
          /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => onPageChange(currentPage + 1),
              disabled: currentPage === totalPages,
              className: "h-8 w-8 p-0",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(import_lucide_react8.ChevronRight, { className: "h-4 w-4" }),
                /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("span", { className: "sr-only", children: "Next page" })
              ]
            }
          )
        ] })
      ]
    }
  );
}

// src/components/responsive-table.tsx
var import_jsx_runtime25 = require("react/jsx-runtime");
function ResponsiveTable({ children, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: cn("w-full overflow-x-auto", className), children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("table", { className: "w-full text-sm", children }) });
}
function MobileCardView({
  items,
  renderCard,
  keyExtractor,
  className
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: cn("space-y-4", className), children: items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "bg-card rounded-lg border p-4 space-y-3", children: renderCard(item, index) }, keyExtractor(item, index))) });
}
function ResponsiveTableContainer({
  children,
  className,
  mobileBreakpoint = "md"
}) {
  const breakpointClass = {
    sm: "sm:block",
    md: "md:block",
    lg: "lg:block"
  }[mobileBreakpoint];
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: cn("bg-background rounded-lg shadow-sm border", className), children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: cn("hidden", breakpointClass), children }) });
}
function ResponsiveTableHeader({
  children,
  className
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("thead", { className: cn("bg-muted", className), children });
}
function ResponsiveTableBody({
  children,
  className
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("tbody", { className, children });
}
function ResponsiveTableRow({
  children,
  className,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("tr", { className: cn("border-t transition-colors hover:bg-muted/50", className), ...props, children });
}
function ResponsiveTableHead({
  children,
  className,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("th", { className: cn("p-3 text-left font-medium", className), ...props, children });
}
function ResponsiveTableCell({
  children,
  className,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("td", { className: cn("p-3", className), ...props, children });
}
function MobileField({
  label,
  value,
  className
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: cn("flex flex-col gap-1", className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("span", { className: "text-xs font-medium text-muted-foreground", children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("span", { className: "text-sm", children: value })
  ] });
}

// src/components/reference-table.tsx
var import_react3 = require("react");
var import_lucide_react9 = require("lucide-react");
var import_jsx_runtime26 = require("react/jsx-runtime");
function ReferenceTable({
  references,
  onView,
  onEdit,
  onDelete,
  loading = false
}) {
  const [searchQuery, setSearchQuery] = (0, import_react3.useState)("");
  const [deleteConfirm, setDeleteConfirm] = (0, import_react3.useState)(null);
  const filteredReferences = references.filter((ref) => {
    const query = searchQuery.toLowerCase();
    return (ref.title?.toLowerCase() ?? "").includes(query) || (ref.description?.toLowerCase() ?? "").includes(query) || (ref.reference_url?.toLowerCase() ?? "").includes(query) || (ref.keywords?.some((k) => k.toLowerCase().includes(query)) ?? false);
  });
  const formatDate = (dateString) => {
    if (dateString === null) return "\u2014";
    return new Date(dateString).toLocaleDateString();
  };
  const handleDeleteConfirm = async () => {
    if (deleteConfirm && onDelete) {
      onDelete(deleteConfirm);
      setDeleteConfirm(null);
    }
  };
  const ReferenceCard = ({ reference }) => /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: "p-4 border rounded-lg space-y-3", children: [
    /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: "flex justify-between items-start", children: [
      /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: "flex-1 space-y-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("h3", { className: "font-medium line-clamp-2", children: reference.title ?? "Untitled" }),
        reference.reference_url !== null && /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(
          "a",
          {
            href: reference.reference_url,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-sm text-blue-600 hover:underline flex items-center gap-1",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react9.ExternalLink, { className: "h-3 w-3" }),
              new URL(reference.reference_url).hostname
            ]
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(DropdownMenu, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(Button, { variant: "ghost", size: "icon", children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react9.MoreHorizontal, { className: "h-4 w-4" }) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(DropdownMenuContent, { align: "end", children: [
          onView && /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(DropdownMenuItem, { onClick: () => onView(reference), children: [
            /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react9.Eye, { className: "mr-2 h-4 w-4" }),
            "View Details"
          ] }),
          onEdit && /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(DropdownMenuItem, { onClick: () => onEdit(reference), children: [
            /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react9.Edit, { className: "mr-2 h-4 w-4" }),
            "Edit"
          ] }),
          onDelete && /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(
            DropdownMenuItem,
            {
              onClick: () => setDeleteConfirm(reference),
              className: "text-destructive",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react9.Trash2, { className: "mr-2 h-4 w-4" }),
                "Delete"
              ]
            }
          )
        ] })
      ] })
    ] }),
    reference.description !== null && /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("p", { className: "text-sm text-muted-foreground line-clamp-2", children: reference.description }),
    /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: "flex flex-wrap gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(Badge, { variant: reference.canonical ? "default" : "secondary", children: reference.canonical ? "Canonical" : "Secondary" }),
      reference.reference_type !== null && /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(Badge, { variant: "outline", children: reference.reference_type }),
      reference.reference_count > 0 && /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(Badge, { variant: "outline", className: "gap-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react9.Link2, { className: "h-3 w-3" }),
        reference.reference_count
      ] }),
      reference.enrichment_status === "completed" && /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(Badge, { variant: "success", children: [
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react9.Database, { className: "h-3 w-3 mr-1" }),
        "Enriched"
      ] }),
      reference.enrichment_status === "processing" && /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(Badge, { variant: "secondary", children: "Processing" }),
      reference.enrichment_status === "failed" && /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(Badge, { variant: "destructive", children: "Failed" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: "text-xs text-muted-foreground", children: [
      reference.year !== null && /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("span", { children: [
        "Year: ",
        reference.year,
        " \u2022 "
      ] }),
      "Created: ",
      formatDate(reference.created_at)
    ] })
  ] });
  return /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: "space-y-4", children: [
    /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: "relative", children: [
      /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react9.Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
      /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
        Input,
        {
          placeholder: "Search references...",
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          className: "pl-9"
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { className: "hidden md:block rounded-md border", children: /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(Table, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(TableRow, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(TableHead, { children: "Title" }),
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(TableHead, { children: "Type" }),
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(TableHead, { children: "Status" }),
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(TableHead, { children: "References" }),
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(TableHead, { children: "Year" }),
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(TableHead, { children: "Created" }),
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(TableHead, { className: "text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(TableBody, { children: [
        loading && /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(TableCell, { colSpan: 7, className: "text-center py-8", children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { className: "text-muted-foreground", children: "Loading..." }) }) }),
        !loading && filteredReferences.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(TableCell, { colSpan: 7, className: "text-center py-8", children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { className: "text-muted-foreground", children: searchQuery ? "No references found matching your search." : "No references found. Add your first reference to get started." }) }) }),
        !loading && filteredReferences.map((reference) => /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(TableRow, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: "space-y-1", children: [
            /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { className: "font-medium line-clamp-1", children: reference.title ?? "Untitled" }),
            reference.reference_url !== null && /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(
              "a",
              {
                href: reference.reference_url,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-xs text-blue-600 hover:underline flex items-center gap-1",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react9.ExternalLink, { className: "h-3 w-3" }),
                  new URL(reference.reference_url).hostname
                ]
              }
            )
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(TableCell, { children: reference.reference_type !== null ? /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(Badge, { variant: "outline", children: reference.reference_type }) : "\u2014" }),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(Badge, { variant: reference.canonical ? "default" : "secondary", children: reference.canonical ? "Canonical" : "Secondary" }),
            reference.enrichment_status === "completed" && /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(Badge, { variant: "success", className: "gap-1", children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react9.Database, { className: "h-3 w-3" }) }),
            reference.enrichment_status === "processing" && /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(Badge, { variant: "secondary", children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react9.Loader2, { className: "h-3 w-3 animate-spin" }) }),
            reference.enrichment_status === "failed" && /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(Badge, { variant: "destructive", children: "!" })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(Badge, { variant: "outline", className: "gap-1", children: [
            /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react9.Link2, { className: "h-3 w-3" }),
            reference.reference_count
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(TableCell, { children: reference.year ?? "\u2014" }),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(TableCell, { children: formatDate(reference.created_at) }),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(TableCell, { className: "text-right", children: /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(DropdownMenu, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(Button, { variant: "ghost", size: "icon", children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react9.MoreHorizontal, { className: "h-4 w-4" }) }) }),
            /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(DropdownMenuContent, { align: "end", children: [
              onView && /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(DropdownMenuItem, { onClick: () => onView(reference), children: [
                /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react9.Eye, { className: "mr-2 h-4 w-4" }),
                "View Details"
              ] }),
              onEdit && /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(DropdownMenuItem, { onClick: () => onEdit(reference), children: [
                /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react9.Edit, { className: "mr-2 h-4 w-4" }),
                "Edit"
              ] }),
              onDelete && /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(
                DropdownMenuItem,
                {
                  onClick: () => setDeleteConfirm(reference),
                  className: "text-destructive",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_lucide_react9.Trash2, { className: "mr-2 h-4 w-4" }),
                    "Delete"
                  ]
                }
              )
            ] })
          ] }) })
        ] }, reference.id))
      ] })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: "md:hidden space-y-4", children: [
      loading && /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { className: "text-center py-8 text-muted-foreground", children: "Loading..." }),
      !loading && filteredReferences.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { className: "text-center py-8 text-muted-foreground", children: searchQuery ? "No references found matching your search." : "No references found. Add your first reference to get started." }),
      !loading && filteredReferences.map((reference) => /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(ReferenceCard, { reference }, reference.id))
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(AlertDialog, { open: !!deleteConfirm, onOpenChange: (open) => !open && setDeleteConfirm(null), children: /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(AlertDialogContent, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(AlertDialogHeader, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(AlertDialogTitle, { children: "Delete Reference?" }),
        /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(AlertDialogDescription, { children: [
          'Are you sure you want to delete "',
          deleteConfirm?.title ?? "this reference",
          '"?',
          deleteConfirm !== null && deleteConfirm.reference_count > 0 && /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("span", { className: "block mt-2 font-medium text-amber-600", children: [
            "Warning: This reference is cited by ",
            deleteConfirm.reference_count,
            " other reference",
            deleteConfirm.reference_count > 1 ? "s" : "",
            "."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(AlertDialogFooter, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
          AlertDialogAction,
          {
            onClick: handleDeleteConfirm,
            className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            children: "Delete"
          }
        )
      ] })
    ] }) })
  ] });
}

// src/components/separator.tsx
var React10 = __toESM(require("react"));
var SeparatorPrimitive = __toESM(require("@radix-ui/react-separator"));
var import_jsx_runtime27 = require("react/jsx-runtime");
var Separator3 = React10.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
  SeparatorPrimitive.Root,
  {
    ref,
    decorative,
    orientation,
    className: cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    ),
    ...props
  }
));
Separator3.displayName = SeparatorPrimitive.Root.displayName;

// src/components/image-with-fallback.tsx
var import_react4 = require("react");
var import_image = __toESM(require_image());
var import_lucide_react10 = require("lucide-react");
var import_jsx_runtime28 = require("react/jsx-runtime");
function ImageWithFallback({
  src,
  alt,
  fill = false,
  width,
  height,
  className = "",
  sizes
}) {
  const [isLoading, setIsLoading] = (0, import_react4.useState)(true);
  const [hasError, setHasError] = (0, import_react4.useState)(false);
  const handleLoad = () => {
    setIsLoading(false);
  };
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };
  if (hasError) {
    return /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
      "div",
      {
        className: `absolute inset-0 flex items-center justify-center bg-muted ${fill ? "" : "relative"}`,
        children: /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(import_lucide_react10.ImageIcon, { className: "h-8 w-8 text-muted-foreground" })
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)(import_jsx_runtime28.Fragment, { children: [
    isLoading && /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
      "div",
      {
        className: `absolute inset-0 flex items-center justify-center bg-muted z-10 ${fill ? "" : "relative"}`,
        children: /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(import_lucide_react10.Loader2, { className: "h-6 w-6 text-muted-foreground animate-spin" })
      }
    ),
    fill ? /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
      import_image.default,
      {
        src,
        alt,
        fill: true,
        className,
        sizes,
        onLoad: handleLoad,
        onError: handleError
      }
    ) : /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
      import_image.default,
      {
        src,
        alt,
        width,
        height,
        className,
        sizes,
        onLoad: handleLoad,
        onError: handleError
      }
    )
  ] });
}

// src/components/typography.tsx
var import_jsx_runtime29 = require("react/jsx-runtime");
function H1({ children, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("h1", { className: cn("text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight", className), children });
}
function H2({ children, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("h2", { className: cn("text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight", className), children });
}
function H3({ children, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("h3", { className: cn("text-lg md:text-xl lg:text-2xl font-semibold", className), children });
}
function H4({ children, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("h4", { className: cn("text-base md:text-lg font-semibold", className), children });
}
function P({ children, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { className: cn("text-sm md:text-base leading-relaxed", className), children });
}
function Small({ children, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("small", { className: cn("text-xs md:text-sm text-muted-foreground", className), children });
}
function Lead({ children, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { className: cn("text-base md:text-lg lg:text-xl text-muted-foreground", className), children });
}

// src/components/loading-spinner.tsx
var import_react5 = require("react");
var import_jsx_runtime30 = (
  // @ts-expect-error - ldrs web component
  require("react/jsx-runtime")
);
var sizeMap = {
  sm: 18,
  md: 24,
  lg: 32
};
function LoadingSpinner({ size = "md", className, color }) {
  const [isClient, setIsClient] = (0, import_react5.useState)(false);
  const pixelSize = sizeMap[size];
  (0, import_react5.useEffect)(() => {
    import("ldrs/ring2").then(() => {
      setIsClient(true);
    });
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: cn("flex items-center justify-center", className), role: "status", "aria-label": "Loading", children: isClient ? /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
    "l-ring-2",
    {
      size: pixelSize,
      stroke: Math.max(2, pixelSize / 8),
      "stroke-length": "0.25",
      "bg-opacity": "0.1",
      speed: "0.8",
      color: color ?? "currentColor"
    }
  ) : (
    // Fallback for SSR - simple CSS spinner
    /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
      "div",
      {
        className: "animate-spin rounded-full border-2 border-current border-t-transparent",
        style: { width: pixelSize, height: pixelSize }
      }
    )
  ) });
}
function LoadingOverlay({ message }) {
  return /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("div", { className: "fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: "flex flex-col items-center gap-4", children: [
    /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(LoadingSpinner, { size: "lg" }),
    message && /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("p", { className: "text-sm text-muted-foreground", children: message })
  ] }) });
}
function LoadingContent({ message, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("div", { className: cn("flex flex-col items-center justify-center py-16", className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(LoadingSpinner, { size: "lg" }),
    message && /* @__PURE__ */ (0, import_jsx_runtime30.jsx)("p", { className: "text-sm text-muted-foreground mt-4", children: message })
  ] });
}

// src/components/empty-state.tsx
var import_lucide_react11 = require("lucide-react");
var import_jsx_runtime31 = require("react/jsx-runtime");
function EmptyState({ icon, title, message, action, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("div", { className: cn("flex flex-col items-center justify-center p-8 text-center", className), children: [
    icon !== void 0 && icon !== null ? /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("div", { className: "mb-4 text-muted-foreground", children: icon }) : null,
    /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("h3", { className: "text-lg font-semibold mb-2", children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("p", { className: "text-muted-foreground mb-6 max-w-md", children: message }),
    action !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)(Button, { onClick: action.onClick, children: [
      action.icon !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { className: "mr-2", children: action.icon }) : null,
      action.label
    ] }) : null
  ] });
}
function NoResultsState({
  onClear,
  searchTerm
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
    EmptyState,
    {
      icon: /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(import_lucide_react11.Search, { className: "h-12 w-12" }),
      title: "No results found",
      message: typeof searchTerm === "string" && searchTerm.length > 0 ? `We couldn't find anything matching "${searchTerm}"` : "Try adjusting your search or filters",
      action: onClear !== void 0 ? {
        label: "Clear search",
        onClick: onClear
      } : void 0
    }
  );
}
function NoContentState({
  onCreate,
  contentType = "items"
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
    EmptyState,
    {
      icon: /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(import_lucide_react11.Inbox, { className: "h-12 w-12" }),
      title: `No ${contentType} yet`,
      message: `Get started by creating your first ${contentType.slice(0, -1)}`,
      action: onCreate !== void 0 ? {
        label: `Create ${contentType.slice(0, -1)}`,
        onClick: onCreate,
        icon: /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(import_lucide_react11.Plus, { className: "h-4 w-4" })
      } : void 0
    }
  );
}
function NoAccessState() {
  return /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
    EmptyState,
    {
      icon: /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(import_lucide_react11.Users, { className: "h-12 w-12" }),
      title: "No access",
      message: "You don't have permission to view this content. Please contact your administrator."
    }
  );
}
function ComingSoonState({ feature }) {
  return /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
    EmptyState,
    {
      icon: /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(import_lucide_react11.FileText, { className: "h-12 w-12" }),
      title: "Coming soon",
      message: `${feature} is currently under development and will be available soon.`
    }
  );
}

// src/components/error-state.tsx
var import_lucide_react12 = require("lucide-react");
var import_jsx_runtime32 = require("react/jsx-runtime");
function ErrorState({
  title = "Something went wrong",
  message,
  action,
  className
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: cn("flex flex-col items-center justify-center p-8 text-center", className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(import_lucide_react12.AlertCircle, { className: "h-12 w-12 text-destructive mb-4" }),
    /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("h3", { className: "text-lg font-semibold mb-2", children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("p", { className: "text-muted-foreground mb-6 max-w-md", children: message }),
    action && /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(Button, { onClick: action.onClick, variant: "outline", children: action.label })
  ] });
}
function ErrorBoundaryFallback({ error, resetErrorBoundary }) {
  return /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "flex flex-col items-center justify-center min-h-[400px] p-8 text-center", children: [
    /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(import_lucide_react12.AlertCircle, { className: "h-16 w-16 text-destructive mb-4" }),
    /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("h2", { className: "text-2xl font-bold mb-2", children: "Oops! Something went wrong" }),
    /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("p", { className: "text-muted-foreground mb-4 max-w-md", children: "We encountered an unexpected error. The error has been logged and we'll look into it." }),
    /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("details", { className: "mb-6 max-w-lg", children: [
      /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("summary", { className: "cursor-pointer text-sm text-muted-foreground hover:text-foreground", children: "Show error details" }),
      /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("pre", { className: "mt-2 p-4 bg-muted rounded-md text-left text-xs overflow-auto", children: error.message })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)(Button, { onClick: resetErrorBoundary, variant: "outline", children: [
      /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(import_lucide_react12.RefreshCw, { className: "h-4 w-4 mr-2" }),
      "Try again"
    ] })
  ] });
}
function InlineError({ message, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: cn("flex items-center gap-2 text-sm text-destructive", className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(import_lucide_react12.AlertCircle, { className: "h-4 w-4 flex-shrink-0" }),
    /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("span", { children: message })
  ] });
}

// src/components/private-app-screen.tsx
var import_jsx_runtime33 = require("react/jsx-runtime");
function PrivateAppScreen({
  appName = "Application",
  companyName,
  title = "This is a private application",
  description = "Access to this application is restricted to authorized users only.",
  loginUrl = "/login",
  contactEmail,
  contactUrl,
  onLogin,
  onContact,
  showLoginButton = true,
  showContactButton = true,
  logo,
  className,
  children
}) {
  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    } else if (loginUrl) {
      window.location.href = loginUrl;
    }
  };
  const handleContact = () => {
    if (onContact) {
      onContact();
    } else if (contactEmail) {
      window.location.href = `mailto:${contactEmail}?subject=Access Request for ${appName}`;
    } else if (contactUrl) {
      window.location.href = contactUrl;
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
    "div",
    {
      className: cn(
        "min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30",
        className
      ),
      children: /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(Card, { className: "w-full max-w-md", children: [
        /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(CardHeader, { className: "text-center space-y-4", children: [
          logo ?? /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("div", { className: "mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              className: "w-8 h-8 text-muted-foreground",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2" }),
                /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })
              ]
            }
          ) }),
          /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(CardTitle, { className: "text-xl", children: title }),
            companyName && /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("p", { className: "text-sm text-muted-foreground mt-1", children: companyName })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(CardDescription, { className: "text-base", children: description })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)("div", { className: "flex flex-col gap-3", children: [
            showLoginButton && /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(Button, { onClick: handleLogin, className: "w-full", children: "Go to Login" }),
            showContactButton && (contactEmail || contactUrl || onContact) && /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(Button, { variant: "outline", onClick: handleContact, className: "w-full", children: "Request Access" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("p", { className: "text-xs text-center text-muted-foreground pt-2", children: "If you believe you should have access, please contact your administrator." }),
          children
        ] })
      ] })
    }
  );
}

// src/components/lexical-renderer.tsx
var import_react6 = require("react");
var import_markdown = require("@lexical/markdown");
var import_LexicalComposer = require("@lexical/react/LexicalComposer");
var import_LexicalRichTextPlugin = require("@lexical/react/LexicalRichTextPlugin");
var import_LexicalContentEditable = require("@lexical/react/LexicalContentEditable");
var import_LexicalHistoryPlugin = require("@lexical/react/LexicalHistoryPlugin");
var import_LexicalErrorBoundary = require("@lexical/react/LexicalErrorBoundary");
var import_LexicalComposerContext = require("@lexical/react/LexicalComposerContext");
var import_rich_text = require("@lexical/rich-text");
var import_list = require("@lexical/list");
var import_code = require("@lexical/code");
var import_link = require("@lexical/link");
var import_jsx_runtime34 = require("react/jsx-runtime");
var theme = {
  // Headings
  heading: {
    h1: "text-3xl font-bold font-heading text-gray-900 mt-8 mb-6 first:mt-0",
    h2: "text-2xl font-bold font-heading text-gray-900 mt-8 mb-5",
    h3: "text-xl font-bold font-heading text-gray-900 mt-6 mb-4",
    h4: "text-lg font-bold font-heading text-gray-900 mt-6 mb-3",
    h5: "text-base font-bold font-heading text-gray-900 mt-4 mb-2",
    h6: "text-sm font-bold font-heading text-gray-900 mt-4 mb-2"
  },
  // Paragraphs
  paragraph: "text-gray-800 mb-5 leading-relaxed",
  // Lists
  list: {
    nested: {
      listitem: "list-none"
    },
    ol: "list-decimal ml-6 mb-6 space-y-2",
    ul: "list-none mb-6 space-y-2"
  },
  listitem: "text-gray-800 leading-relaxed relative pl-6",
  // Text formatting
  text: {
    bold: "font-bold text-gray-900",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    code: "bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800"
  },
  // Code blocks
  code: "bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto my-6 text-sm font-mono",
  codeHighlight: {
    atrule: "text-purple-400",
    attr: "text-blue-400",
    boolean: "text-purple-400",
    builtin: "text-yellow-400",
    cdata: "text-gray-400",
    char: "text-green-400",
    class: "text-yellow-400",
    "class-name": "text-yellow-400",
    comment: "text-gray-400",
    constant: "text-purple-400",
    deleted: "text-red-400",
    doctype: "text-gray-400",
    entity: "text-yellow-400",
    function: "text-blue-400",
    important: "text-purple-400",
    inserted: "text-green-400",
    keyword: "text-purple-400",
    namespace: "text-yellow-400",
    number: "text-purple-400",
    operator: "text-red-400",
    prolog: "text-gray-400",
    property: "text-blue-400",
    punctuation: "text-gray-300",
    regex: "text-green-400",
    selector: "text-yellow-400",
    string: "text-green-400",
    symbol: "text-purple-400",
    tag: "text-red-400",
    url: "text-blue-400",
    variable: "text-yellow-400"
  },
  // Links
  link: "text-blue-600 hover:text-blue-800 transition-colors cursor-pointer",
  // Quotes
  quote: "border-l-4 border-blue-500 pl-6 italic my-6 text-gray-700 bg-gray-50 py-4"
};
var nodes = [
  import_rich_text.HeadingNode,
  import_list.ListNode,
  import_list.ListItemNode,
  import_rich_text.QuoteNode,
  import_code.CodeNode,
  import_code.CodeHighlightNode,
  import_link.LinkNode
];
function MarkdownPlugin({ markdown }) {
  const [editor] = (0, import_LexicalComposerContext.useLexicalComposerContext)();
  (0, import_react6.useEffect)(() => {
    editor.update(() => {
      (0, import_markdown.$convertFromMarkdownString)(markdown, import_markdown.TRANSFORMERS);
    });
  }, [markdown, editor]);
  return null;
}
function LexicalRenderer({ markdown, className = "" }) {
  const initialConfig = {
    namespace: "BlogRenderer",
    theme,
    onError: () => {
    },
    nodes,
    editable: false
  };
  return /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", { className: `prose-lexical ${className}`, children: /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(import_LexicalComposer.LexicalComposer, { initialConfig, children: /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { className: "relative", children: [
    /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
      import_LexicalRichTextPlugin.RichTextPlugin,
      {
        contentEditable: /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
          import_LexicalContentEditable.ContentEditable,
          {
            className: "outline-none resize-none text-base text-gray-800 leading-relaxed",
            style: { minHeight: "200px" }
          }
        ),
        placeholder: /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", {}),
        ErrorBoundary: import_LexicalErrorBoundary.LexicalErrorBoundary
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(MarkdownPlugin, { markdown }),
    /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(import_LexicalHistoryPlugin.HistoryPlugin, {})
  ] }) }) });
}

// src/components/simple-lexical-renderer.tsx
var import_react7 = require("react");
var import_markdown2 = require("@lexical/markdown");
var import_LexicalComposer2 = require("@lexical/react/LexicalComposer");
var import_LexicalRichTextPlugin2 = require("@lexical/react/LexicalRichTextPlugin");
var import_LexicalContentEditable2 = require("@lexical/react/LexicalContentEditable");
var import_LexicalErrorBoundary2 = require("@lexical/react/LexicalErrorBoundary");
var import_LexicalComposerContext2 = require("@lexical/react/LexicalComposerContext");
var import_rich_text2 = require("@lexical/rich-text");
var import_list2 = require("@lexical/list");
var import_code2 = require("@lexical/code");
var import_link2 = require("@lexical/link");
var import_jsx_runtime35 = require("react/jsx-runtime");
var theme2 = {
  heading: {
    h1: "text-3xl font-bold text-gray-900 mt-8 mb-6 first:mt-0 font-heading",
    h2: "text-2xl font-bold text-gray-900 mt-8 mb-5 font-heading",
    h3: "text-xl font-bold text-gray-900 mt-6 mb-4 font-heading",
    h4: "text-lg font-bold text-gray-900 mt-6 mb-3 font-heading"
  },
  paragraph: "text-gray-800 mb-5 leading-relaxed",
  list: {
    ol: "list-decimal ml-8 mb-6 space-y-2",
    ul: "list-disc ml-8 mb-6 space-y-2"
  },
  listitem: "text-gray-800 leading-relaxed",
  text: {
    bold: "font-bold text-gray-900",
    italic: "italic",
    code: "bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800"
  },
  code: "bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto my-6 text-sm font-mono",
  quote: "border-l-4 border-blue-500 pl-6 italic my-6 text-gray-700 bg-gray-50 py-4",
  link: "text-blue-600 hover:text-blue-800 underline"
};
var nodes2 = [
  import_rich_text2.HeadingNode,
  import_list2.ListNode,
  import_list2.ListItemNode,
  import_rich_text2.QuoteNode,
  import_code2.CodeNode,
  import_code2.CodeHighlightNode,
  import_link2.LinkNode
];
function MarkdownPlugin2({ markdown }) {
  const [editor] = (0, import_LexicalComposerContext2.useLexicalComposerContext)();
  (0, import_react7.useEffect)(() => {
    if (markdown) {
      editor.update(() => {
        try {
          (0, import_markdown2.$convertFromMarkdownString)(markdown, import_markdown2.TRANSFORMERS);
        } catch {
        }
      });
    }
  }, [markdown, editor]);
  return null;
}
function SimpleLexicalRenderer({ markdown, className = "" }) {
  const initialConfig = (0, import_react7.useMemo)(
    () => ({
      namespace: "BlogRenderer",
      theme: theme2,
      onError: () => {
      },
      nodes: nodes2,
      editable: false
    }),
    []
  );
  if (!markdown) {
    return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: "text-gray-600", children: "No content available." });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: `lexical-renderer ${className}`, children: /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(import_LexicalComposer2.LexicalComposer, { initialConfig, children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
      import_LexicalRichTextPlugin2.RichTextPlugin,
      {
        contentEditable: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_LexicalContentEditable2.ContentEditable, { className: "outline-none text-base text-gray-800 leading-relaxed min-h-0" }),
        placeholder: null,
        ErrorBoundary: import_LexicalErrorBoundary2.LexicalErrorBoundary
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(MarkdownPlugin2, { markdown })
  ] }) });
}

// src/components/lexical-editor.tsx
var import_react8 = require("react");
var import_LexicalComposer3 = require("@lexical/react/LexicalComposer");
var import_LexicalRichTextPlugin3 = require("@lexical/react/LexicalRichTextPlugin");
var import_LexicalContentEditable3 = require("@lexical/react/LexicalContentEditable");
var import_LexicalHistoryPlugin2 = require("@lexical/react/LexicalHistoryPlugin");
var import_LexicalOnChangePlugin = require("@lexical/react/LexicalOnChangePlugin");
var import_LexicalListPlugin = require("@lexical/react/LexicalListPlugin");
var import_LexicalLinkPlugin = require("@lexical/react/LexicalLinkPlugin");
var import_LexicalErrorBoundary3 = require("@lexical/react/LexicalErrorBoundary");
var import_LexicalComposerContext3 = require("@lexical/react/LexicalComposerContext");
var import_html = require("@lexical/html");
var import_markdown3 = require("@lexical/markdown");
var import_list3 = require("@lexical/list");
var import_rich_text3 = require("@lexical/rich-text");
var import_code3 = require("@lexical/code");
var import_link3 = require("@lexical/link");
var import_lexical = require("lexical");
var import_list4 = require("@lexical/list");
var import_selection = require("@lexical/selection");
var import_utils30 = require("@lexical/utils");
var import_lucide_react13 = require("lucide-react");
var import_jsx_runtime36 = require("react/jsx-runtime");
var editorTheme = {
  ltr: "ltr",
  rtl: "rtl",
  paragraph: "editor-paragraph",
  quote: "editor-quote",
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
    h4: "editor-heading-h4",
    h5: "editor-heading-h5"
  },
  list: {
    nested: { listitem: "editor-nested-listitem" },
    ol: "editor-list-ol",
    ul: "editor-list-ul",
    listitem: "editor-listitem"
  },
  link: "editor-link",
  text: {
    bold: "editor-text-bold",
    italic: "editor-text-italic",
    underline: "editor-text-underline",
    strikethrough: "editor-text-strikethrough",
    underlineStrikethrough: "editor-text-underlineStrikethrough",
    code: "editor-text-code"
  },
  code: "editor-code",
  codeHighlight: {
    atrule: "editor-tokenAttr",
    attr: "editor-tokenAttr",
    boolean: "editor-tokenProperty",
    builtin: "editor-tokenSelector",
    cdata: "editor-tokenComment",
    char: "editor-tokenSelector",
    class: "editor-tokenFunction",
    "class-name": "editor-tokenFunction",
    comment: "editor-tokenComment",
    constant: "editor-tokenProperty",
    deleted: "editor-tokenProperty",
    doctype: "editor-tokenComment",
    entity: "editor-tokenOperator",
    function: "editor-tokenFunction",
    important: "editor-tokenVariable",
    inserted: "editor-tokenSelector",
    keyword: "editor-tokenAttr",
    namespace: "editor-tokenVariable",
    number: "editor-tokenProperty",
    operator: "editor-tokenOperator",
    prolog: "editor-tokenComment",
    property: "editor-tokenProperty",
    punctuation: "editor-tokenPunctuation",
    regex: "editor-tokenVariable",
    selector: "editor-tokenSelector",
    string: "editor-tokenSelector",
    symbol: "editor-tokenProperty",
    tag: "editor-tokenProperty",
    url: "editor-tokenOperator",
    variable: "editor-tokenVariable"
  }
};
var editorNodes = [
  import_rich_text3.HeadingNode,
  import_list3.ListNode,
  import_list3.ListItemNode,
  import_rich_text3.QuoteNode,
  import_code3.CodeNode,
  import_code3.CodeHighlightNode,
  import_link3.LinkNode,
  import_link3.AutoLinkNode
];
function ToolbarButton({
  active,
  disabled,
  onClick,
  children,
  title
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
    "button",
    {
      type: "button",
      onClick,
      disabled,
      title,
      className: cn(
        "inline-flex items-center justify-center h-8 w-8 rounded-md transition-colors",
        active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
        disabled && "opacity-50 cursor-not-allowed"
      ),
      children
    }
  );
}
function ToolbarPlugin({ disabled }) {
  const [editor] = (0, import_LexicalComposerContext3.useLexicalComposerContext)();
  const [isBold, setIsBold] = (0, import_react8.useState)(false);
  const [isItalic, setIsItalic] = (0, import_react8.useState)(false);
  const [isUnderline, setIsUnderline] = (0, import_react8.useState)(false);
  const [isLink, setIsLink] = (0, import_react8.useState)(false);
  const [blockType, setBlockType] = (0, import_react8.useState)("paragraph");
  const updateToolbar = (0, import_react8.useCallback)(() => {
    const selection = (0, import_lexical.$getSelection)();
    if ((0, import_lexical.$isRangeSelection)(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      const anchorNode = selection.anchor.getNode();
      let element = anchorNode.getKey() === "root" ? anchorNode : (0, import_utils30.$findMatchingParent)(anchorNode, (e) => {
        const parent = e.getParent();
        return parent !== null && (0, import_lexical.$isRootOrShadowRoot)(parent);
      });
      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      const node = anchorNode.getParent();
      setIsLink((0, import_link3.$isLinkNode)(node) || (0, import_link3.$isLinkNode)(anchorNode));
      if (elementDOM !== null) {
        if ((0, import_list4.$isListNode)(element)) {
          const parentList = (0, import_utils30.$findMatchingParent)(anchorNode, (node2) => (0, import_list4.$isListNode)(node2));
          const type = parentList ? parentList.getListType() : element.getListType();
          setBlockType(type === "number" ? "number" : "bullet");
        } else {
          const type = element.getType();
          if (type === "heading") {
            const tag = element.getTag();
            setBlockType(tag);
          } else if (type === "quote") {
            setBlockType("quote");
          } else if (type === "code") {
            setBlockType("code");
          } else {
            setBlockType("paragraph");
          }
        }
      }
    }
  }, [editor]);
  (0, import_react8.useEffect)(() => {
    return editor.registerCommand(
      import_lexical.SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      import_lexical.COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, updateToolbar]);
  (0, import_react8.useEffect)(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);
  const formatHeading = (headingTag) => {
    editor.update(() => {
      const selection = (0, import_lexical.$getSelection)();
      if ((0, import_lexical.$isRangeSelection)(selection)) {
        if (blockType === headingTag) {
          (0, import_selection.$setBlocksType)(selection, () => (0, import_lexical.$createParagraphNode)());
        } else {
          (0, import_selection.$setBlocksType)(selection, () => (0, import_rich_text3.$createHeadingNode)(headingTag));
        }
      }
    });
  };
  const formatQuote = () => {
    editor.update(() => {
      const selection = (0, import_lexical.$getSelection)();
      if ((0, import_lexical.$isRangeSelection)(selection)) {
        if (blockType === "quote") {
          (0, import_selection.$setBlocksType)(selection, () => (0, import_lexical.$createParagraphNode)());
        } else {
          const { $createQuoteNode } = require("@lexical/rich-text");
          (0, import_selection.$setBlocksType)(selection, () => $createQuoteNode());
        }
      }
    });
  };
  const formatCode = () => {
    editor.update(() => {
      const selection = (0, import_lexical.$getSelection)();
      if ((0, import_lexical.$isRangeSelection)(selection)) {
        if (blockType === "code") {
          (0, import_selection.$setBlocksType)(selection, () => (0, import_lexical.$createParagraphNode)());
        } else {
          const { $createCodeNode } = require("@lexical/code");
          (0, import_selection.$setBlocksType)(selection, () => $createCodeNode());
        }
      }
    });
  };
  const insertLink = () => {
    if (isLink) {
      editor.dispatchCommand(import_link3.TOGGLE_LINK_COMMAND, null);
    } else {
      const url = prompt("Enter URL:");
      if (url) {
        editor.dispatchCommand(import_link3.TOGGLE_LINK_COMMAND, url);
      }
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex items-center gap-0.5 p-1.5 border-b bg-muted/30 flex-wrap", children: [
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
      ToolbarButton,
      {
        active: isBold,
        disabled,
        onClick: () => editor.dispatchCommand(import_lexical.FORMAT_TEXT_COMMAND, "bold"),
        title: "Bold",
        children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(import_lucide_react13.Bold, { className: "h-4 w-4" })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
      ToolbarButton,
      {
        active: isItalic,
        disabled,
        onClick: () => editor.dispatchCommand(import_lexical.FORMAT_TEXT_COMMAND, "italic"),
        title: "Italic",
        children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(import_lucide_react13.Italic, { className: "h-4 w-4" })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
      ToolbarButton,
      {
        active: isUnderline,
        disabled,
        onClick: () => editor.dispatchCommand(import_lexical.FORMAT_TEXT_COMMAND, "underline"),
        title: "Underline",
        children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(import_lucide_react13.Underline, { className: "h-4 w-4" })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "w-px h-6 bg-border mx-1" }),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
      ToolbarButton,
      {
        active: blockType === "h2",
        disabled,
        onClick: () => formatHeading("h2"),
        title: "Heading 2",
        children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(import_lucide_react13.Heading2, { className: "h-4 w-4" })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
      ToolbarButton,
      {
        active: blockType === "h3",
        disabled,
        onClick: () => formatHeading("h3"),
        title: "Heading 3",
        children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(import_lucide_react13.Heading3, { className: "h-4 w-4" })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
      ToolbarButton,
      {
        active: blockType === "h4",
        disabled,
        onClick: () => formatHeading("h4"),
        title: "Heading 4",
        children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(import_lucide_react13.Heading4, { className: "h-4 w-4" })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "w-px h-6 bg-border mx-1" }),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
      ToolbarButton,
      {
        active: blockType === "bullet",
        disabled,
        onClick: () => editor.dispatchCommand(import_list4.INSERT_UNORDERED_LIST_COMMAND, void 0),
        title: "Bullet List",
        children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(import_lucide_react13.List, { className: "h-4 w-4" })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
      ToolbarButton,
      {
        active: blockType === "number",
        disabled,
        onClick: () => editor.dispatchCommand(import_list4.INSERT_ORDERED_LIST_COMMAND, void 0),
        title: "Numbered List",
        children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(import_lucide_react13.ListOrdered, { className: "h-4 w-4" })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "w-px h-6 bg-border mx-1" }),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
      ToolbarButton,
      {
        active: blockType === "quote",
        disabled,
        onClick: formatQuote,
        title: "Block Quote",
        children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(import_lucide_react13.Quote, { className: "h-4 w-4" })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(ToolbarButton, { active: isLink, disabled, onClick: insertLink, title: "Link", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(import_lucide_react13.Link, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
      ToolbarButton,
      {
        active: blockType === "code",
        disabled,
        onClick: formatCode,
        title: "Code Block",
        children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(import_lucide_react13.Code, { className: "h-4 w-4" })
      }
    )
  ] });
}
function LoadInitialStatePlugin({
  initialState,
  initialMarkdown,
  initialPlainText
}) {
  const [editor] = (0, import_LexicalComposerContext3.useLexicalComposerContext)();
  const [loaded, setLoaded] = (0, import_react8.useState)(false);
  (0, import_react8.useEffect)(() => {
    if (loaded) return;
    if (initialState) {
      try {
        const parsed = JSON.parse(initialState);
        const hasContent = parsed?.root?.children && parsed.root.children.length > 0;
        if (hasContent) {
          const state = editor.parseEditorState(parsed);
          editor.setEditorState(state);
          setLoaded(true);
          return;
        }
      } catch {
      }
    }
    if (initialMarkdown) {
      editor.update(() => {
        const root = (0, import_lexical.$getRoot)();
        root.clear();
        (0, import_markdown3.$convertFromMarkdownString)(initialMarkdown, import_markdown3.TRANSFORMERS);
      });
      setLoaded(true);
      return;
    }
    if (initialPlainText) {
      editor.update(() => {
        const root = (0, import_lexical.$getRoot)();
        root.clear();
        const lines = initialPlainText.split(/\n/);
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed) {
            const paragraph = (0, import_lexical.$createParagraphNode)();
            paragraph.append((0, import_lexical.$createTextNode)(trimmed));
            root.append(paragraph);
          }
        }
      });
      setLoaded(true);
    }
  }, [editor, initialState, initialMarkdown, initialPlainText, loaded]);
  return null;
}
function LexicalEditor({
  initialState,
  initialMarkdown,
  initialPlainText,
  onChange,
  placeholder = "Start writing...",
  minHeight = "200px",
  disabled = false,
  className
}) {
  const initialConfig = {
    namespace: "LexicalEditor",
    theme: editorTheme,
    onError: (error) => {
      console.error("Lexical error:", error);
    },
    nodes: editorNodes,
    editable: !disabled
  };
  const handleChange = (0, import_react8.useCallback)(
    (editorState, editor) => {
      if (!onChange) return;
      editor.update(() => {
        const html = (0, import_html.$generateHtmlFromNodes)(editor, null);
        const markdown = (0, import_markdown3.$convertToMarkdownString)(import_markdown3.TRANSFORMERS);
        const editorStateJson = JSON.stringify(editorState.toJSON());
        const root = editorState._nodeMap;
        let plainText = "";
        root.forEach((node) => {
          if ("__text" in node) {
            plainText += node.__text + " ";
          }
        });
        onChange({
          editorState: editorStateJson,
          html,
          markdown,
          plainText: plainText.trim()
        });
      });
    },
    [onChange]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: cn("lexical-editor-container border rounded-md overflow-hidden", className), children: /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)(import_LexicalComposer3.LexicalComposer, { initialConfig, children: [
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(ToolbarPlugin, { disabled }),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "relative", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
      import_LexicalRichTextPlugin3.RichTextPlugin,
      {
        contentEditable: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
          import_LexicalContentEditable3.ContentEditable,
          {
            className: "lexical-editor p-3 focus:outline-none",
            style: { minHeight }
          }
        ),
        placeholder: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
          "div",
          {
            className: "lexical-placeholder p-3 text-muted-foreground pointer-events-none",
            style: { minHeight },
            children: placeholder
          }
        ),
        ErrorBoundary: import_LexicalErrorBoundary3.LexicalErrorBoundary
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(import_LexicalOnChangePlugin.OnChangePlugin, { onChange: handleChange }),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(import_LexicalHistoryPlugin2.HistoryPlugin, {}),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(import_LexicalListPlugin.ListPlugin, {}),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(import_LexicalLinkPlugin.LinkPlugin, {}),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
      LoadInitialStatePlugin,
      {
        initialState,
        initialMarkdown,
        initialPlainText
      }
    )
  ] }) });
}

// src/components/image-upload.tsx
var import_react9 = require("react");
var import_lucide_react14 = require("lucide-react");
var import_jsx_runtime37 = require("react/jsx-runtime");
function ImageUpload({
  value,
  altText,
  onChange,
  onAltTextChange,
  bucket,
  pathPrefix = "",
  supabaseClient,
  supabaseUrl,
  showAltText = false,
  accept = "image/*",
  label,
  className
}) {
  const [activeTab, setActiveTab] = (0, import_react9.useState)("upload");
  const [urlInput, setUrlInput] = (0, import_react9.useState)("");
  const [uploading, setUploading] = (0, import_react9.useState)(false);
  const [dragOver, setDragOver] = (0, import_react9.useState)(false);
  const fileInputRef = (0, import_react9.useRef)(null);
  const uploadFile = (0, import_react9.useCallback)(
    async (file) => {
      setUploading(true);
      try {
        const ext = file.name.split(".").pop();
        const fileName = `${pathPrefix}${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
        const { error } = await supabaseClient.storage.from(bucket).upload(fileName, file, {
          cacheControl: "3600",
          upsert: false
        });
        if (error) throw error;
        const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${fileName}`;
        onChange(publicUrl);
      } catch (err) {
        console.error("Upload error:", err);
      } finally {
        setUploading(false);
      }
    },
    [bucket, pathPrefix, supabaseClient, supabaseUrl, onChange]
  );
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };
  const handleDrop = (0, import_react9.useCallback)(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        uploadFile(file);
      }
    },
    [uploadFile]
  );
  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput("");
    }
  };
  const handleRemove = () => {
    onChange("");
    if (onAltTextChange) onAltTextChange("");
  };
  const displayUrl = value || "";
  return /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: cn("space-y-2", className), children: [
    label && /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("label", { className: "text-sm font-medium leading-none", children: label }),
    displayUrl && /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "relative group", children: [
      /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "relative w-full h-32 rounded-md overflow-hidden border bg-muted", children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
        "img",
        {
          src: displayUrl,
          alt: altText ?? "",
          className: "w-full h-full object-cover",
          onError: (e) => {
            e.target.style.display = "none";
          }
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
        "button",
        {
          type: "button",
          onClick: handleRemove,
          className: "absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity",
          children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(import_lucide_react14.X, { className: "h-3 w-3" })
        }
      )
    ] }),
    showAltText && displayUrl && /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "space-y-1", children: [
      /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("label", { className: "text-sm font-medium leading-none", children: "Alt Text" }),
      /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
        "input",
        {
          type: "text",
          value: altText ?? "",
          onChange: (e) => onAltTextChange?.(e.target.value),
          placeholder: "Alt text for accessibility",
          className: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        }
      )
    ] }),
    !displayUrl && /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(import_jsx_runtime37.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "flex border-b", children: [
        /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(
          "button",
          {
            type: "button",
            onClick: () => setActiveTab("upload"),
            className: cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border-b-2 transition-colors",
              activeTab === "upload" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            ),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(import_lucide_react14.Upload, { className: "h-3.5 w-3.5" }),
              "Upload"
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(
          "button",
          {
            type: "button",
            onClick: () => setActiveTab("url"),
            className: cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border-b-2 transition-colors",
              activeTab === "url" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            ),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(import_lucide_react14.Link, { className: "h-3.5 w-3.5" }),
              "URL"
            ]
          }
        )
      ] }),
      activeTab === "upload" && /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(
        "div",
        {
          onClick: () => fileInputRef.current?.click(),
          onDrop: handleDrop,
          onDragOver: (e) => {
            e.preventDefault();
            setDragOver(true);
          },
          onDragLeave: () => setDragOver(false),
          className: cn(
            "flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-md cursor-pointer transition-colors",
            dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
            uploading && "opacity-50 pointer-events-none"
          ),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
              "input",
              {
                ref: fileInputRef,
                type: "file",
                accept,
                onChange: handleFileChange,
                className: "hidden"
              }
            ),
            uploading ? /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "text-sm text-muted-foreground", children: "Uploading..." }) : /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(import_jsx_runtime37.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(import_lucide_react14.Image, { className: "h-8 w-8 text-muted-foreground" }),
              /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "text-sm text-muted-foreground text-center", children: "Drop an image here or click to browse" })
            ] })
          ]
        }
      ),
      activeTab === "url" && /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
          "input",
          {
            type: "url",
            value: urlInput,
            onChange: (e) => setUrlInput(e.target.value),
            placeholder: "https://example.com/image.jpg",
            onKeyDown: (e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleUrlSubmit();
              }
            },
            className: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
          "button",
          {
            type: "button",
            onClick: handleUrlSubmit,
            disabled: !urlInput.trim(),
            className: "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-3 bg-primary text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50",
            children: "Add"
          }
        )
      ] })
    ] })
  ] });
}

// src/providers/ThemeProvider.tsx
var import_react10 = require("react");
var import_jsx_runtime38 = require("react/jsx-runtime");
var ThemeContext = (0, import_react10.createContext)(void 0);
function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultVariant = "default",
  storageKey = "novansa-theme"
}) {
  const [theme3, setTheme] = (0, import_react10.useState)(defaultTheme);
  const [variant, setVariant] = (0, import_react10.useState)(defaultVariant);
  const [actualTheme, setActualTheme] = (0, import_react10.useState)("light");
  (0, import_react10.useEffect)(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored !== null && stored.trim() !== "") {
        const parsed = JSON.parse(stored);
        if (typeof parsed === "object" && parsed !== null) {
          const data = parsed;
          const storedTheme = data.theme;
          const storedVariant = data.variant;
          if (typeof storedTheme === "string" && (storedTheme === "light" || storedTheme === "dark" || storedTheme === "system")) {
            setTheme(storedTheme);
          }
          if (typeof storedVariant === "string" && (storedVariant === "default" || storedVariant === "high-contrast")) {
            setVariant(storedVariant);
          }
        }
      }
    } catch {
    }
  }, [storageKey]);
  (0, import_react10.useEffect)(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark", "high-contrast");
    let resolvedTheme = "light";
    if (theme3 === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      resolvedTheme = systemTheme;
    } else {
      resolvedTheme = theme3;
    }
    root.classList.add(resolvedTheme);
    if (variant === "high-contrast") {
      root.classList.add("high-contrast");
    }
    root.style.colorScheme = resolvedTheme;
    setActualTheme(resolvedTheme);
    try {
      localStorage.setItem(storageKey, JSON.stringify({ theme: theme3, variant }));
    } catch {
    }
  }, [theme3, variant, storageKey]);
  (0, import_react10.useEffect)(() => {
    if (theme3 !== "system") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      setActualTheme(e.matches ? "dark" : "light");
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(e.matches ? "dark" : "light");
      root.style.colorScheme = e.matches ? "dark" : "light";
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme3]);
  const value = {
    theme: theme3,
    variant,
    setTheme,
    setVariant,
    actualTheme
  };
  return /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(ThemeContext.Provider, { value, children });
}
function useTheme() {
  const context = (0, import_react10.useContext)(ThemeContext);
  if (context === void 0) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// src/components/ThemeSettings.tsx
var import_lucide_react15 = require("lucide-react");
var import_jsx_runtime39 = require("react/jsx-runtime");
function ThemeSettings({ showLabels = true, orientation = "vertical" }) {
  const { theme: theme3, variant, setTheme, setVariant } = useTheme();
  const themeOptions = [
    { value: "light", label: "Light", icon: import_lucide_react15.Sun },
    { value: "dark", label: "Dark", icon: import_lucide_react15.Moon },
    { value: "system", label: "System", icon: import_lucide_react15.Monitor }
  ];
  const variantOptions = [
    { value: "default", label: "Default", icon: import_lucide_react15.Eye },
    { value: "high-contrast", label: "High Contrast", icon: import_lucide_react15.Eye }
  ];
  const containerClass = orientation === "horizontal" ? "flex items-center gap-4" : "space-y-4";
  return /* @__PURE__ */ (0, import_jsx_runtime39.jsxs)("div", { className: containerClass, children: [
    /* @__PURE__ */ (0, import_jsx_runtime39.jsxs)("div", { className: "space-y-2", children: [
      showLabels && /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("label", { className: "text-sm font-medium text-foreground block mb-2", children: "Theme Mode" }),
      /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("div", { className: "flex rounded-md border border-border p-1 gap-1", children: themeOptions.map(({ value, label, icon: Icon2 }) => /* @__PURE__ */ (0, import_jsx_runtime39.jsxs)(
        Button,
        {
          variant: theme3 === value ? "default" : "ghost",
          size: "sm",
          onClick: () => setTheme(value),
          className: "flex items-center gap-2 flex-1",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(Icon2, { className: "h-4 w-4" }),
            showLabels && /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("span", { className: "hidden sm:inline", children: label })
          ]
        },
        value
      )) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime39.jsxs)("div", { className: "space-y-2", children: [
      showLabels && /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("label", { className: "text-sm font-medium text-foreground block mb-2", children: "Accessibility" }),
      /* @__PURE__ */ (0, import_jsx_runtime39.jsxs)(
        Select,
        {
          value: variant,
          onValueChange: (value) => setVariant(value),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(SelectTrigger, { className: "w-[150px]", children: /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(SelectValue, {}) }),
            /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(SelectContent, { children: variantOptions.map(({ value, label }) => /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(SelectItem, { value, children: label }, value)) })
          ]
        }
      )
    ] })
  ] });
}
function ThemeToggle() {
  const { theme: theme3, setTheme } = useTheme();
  const cycleTheme = () => {
    if (theme3 === "light") setTheme("dark");
    else if (theme3 === "dark") setTheme("system");
    else setTheme("light");
  };
  const getIcon = () => {
    switch (theme3) {
      case "light":
        return import_lucide_react15.Sun;
      case "dark":
        return import_lucide_react15.Moon;
      case "system":
        return import_lucide_react15.Monitor;
      default:
        return import_lucide_react15.Sun;
    }
  };
  const Icon2 = getIcon();
  return /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(
    Button,
    {
      variant: "ghost",
      size: "sm",
      onClick: cycleTheme,
      "aria-label": "Toggle theme",
      className: "h-8 w-8 p-0",
      children: /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(Icon2, { className: "h-4 w-4" })
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AdminLoginCard,
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ComingSoonState,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  EmptyState,
  EnhancedTabs,
  EnhancedTabsContent,
  EnhancedTabsList,
  EnhancedTabsTrigger,
  ErrorBoundaryFallback,
  ErrorState,
  H1,
  H2,
  H3,
  H4,
  IconTabGroup,
  ImageUpload,
  ImageWithFallback,
  InlineError,
  Input,
  Label,
  Lead,
  LexicalEditor,
  LexicalRenderer,
  LoadingContent,
  LoadingOverlay,
  LoadingSpinner,
  MobileCardView,
  MobileField,
  NoAccessState,
  NoContentState,
  NoResultsState,
  OtpInput,
  P,
  Pagination,
  PhoneInput,
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
  PrivateAppScreen,
  ReferenceTable,
  ResponsiveTable,
  ResponsiveTableBody,
  ResponsiveTableCell,
  ResponsiveTableContainer,
  ResponsiveTableHead,
  ResponsiveTableHeader,
  ResponsiveTableRow,
  ScrollArea,
  ScrollBar,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Separator,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SimpleLexicalRenderer,
  Small,
  Switch,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  ThemeProvider,
  ThemeSettings,
  ThemeToggle,
  VerifyContactRow,
  badgeVariants,
  buttonVariants,
  cn,
  toE164,
  useTheme
});
//# sourceMappingURL=index.js.map