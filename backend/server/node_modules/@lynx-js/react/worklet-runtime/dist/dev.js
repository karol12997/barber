"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // src/api/element.ts
  var _Element = class _Element {
    constructor(element) {
      // @ts-ignore set in constructor
      __publicField(this, "element");
      Object.defineProperty(this, "element", {
        get() {
          return element;
        }
      });
    }
    setAttribute(name, value) {
      __SetAttribute(this.element, name, value);
      this.flushElementTree();
    }
    setStyleProperty(name, value) {
      __AddInlineStyle(this.element, name, value);
      this.flushElementTree();
    }
    setStyleProperties(styles) {
      for (const key in styles) {
        __AddInlineStyle(this.element, key, styles[key]);
      }
      this.flushElementTree();
    }
    getAttribute(attributeName) {
      return __GetAttributeByName(this.element, attributeName);
    }
    getAttributeNames() {
      return __GetAttributeNames(this.element);
    }
    querySelector(selector) {
      const ref = __QuerySelector(this.element, selector, {});
      return ref ? new _Element(ref) : null;
    }
    querySelectorAll(selector) {
      return __QuerySelectorAll(this.element, selector, {}).map((element) => {
        return new _Element(element);
      });
    }
    invoke(methodName, params) {
      return new Promise((resolve, reject) => {
        __InvokeUIMethod(
          this.element,
          methodName,
          params || {},
          (res) => {
            if (res.code === 0) {
              resolve(res.data);
            } else {
              reject(new Error("UI method invoke: " + JSON.stringify(res)));
            }
          }
        );
        this.flushElementTree();
      });
    }
    flushElementTree() {
      if (_Element.willFlush) {
        return;
      }
      _Element.willFlush = true;
      Promise.resolve().then(() => {
        _Element.willFlush = false;
        __FlushElementTree();
      });
    }
  };
  __publicField(_Element, "willFlush", false);
  var Element = _Element;

  // src/api/lepusQuerySelector.ts
  var _PageElement = class _PageElement {
    static get() {
      if (_PageElement.pageElement === void 0) {
        _PageElement.pageElement = __GetPageElement();
      }
      return _PageElement.pageElement;
    }
  };
  __publicField(_PageElement, "pageElement");
  var PageElement = _PageElement;
  function querySelector(cssSelector) {
    const element = __QuerySelector(PageElement.get(), cssSelector, {});
    return element ? new Element(element) : null;
  }
  function querySelectorAll(cssSelector) {
    return __QuerySelectorAll(PageElement.get(), cssSelector, {}).map(
      (element) => {
        return new Element(element);
      }
    );
  }

  // src/utils/version.ts
  function isSdkVersionGt(major, minor) {
    const lynxSdkVersion = SystemInfo.lynxSdkVersion || "1.0";
    const version = lynxSdkVersion.split(".");
    return Number(version[0]) > major || Number(version[0]) == major && Number(version[1]) > minor;
  }

  // src/api/lynxApi.ts
  function initApiEnv() {
    var _a;
    lynx.querySelector = querySelector;
    lynx.querySelectorAll = querySelectorAll;
    globalThis.setTimeout = lynx.setTimeout;
    globalThis.setInterval = lynx.setInterval;
    globalThis.clearTimeout = lynx.clearTimeout;
    globalThis.clearInterval = (_a = lynx.clearInterval) != null ? _a : lynx.clearTimeInterval;
    {
      const requestAnimationFrame = lynx.requestAnimationFrame;
      lynx.requestAnimationFrame = globalThis.requestAnimationFrame = (callback) => {
        if (!isSdkVersionGt(2, 15)) {
          throw new Error(
            "requestAnimationFrame in main thread script requires Lynx sdk version 2.16"
          );
        }
        return requestAnimationFrame(callback);
      };
    }
    globalThis.cancelAnimationFrame = lynx.cancelAnimationFrame;
  }

  // src/utils/profile.ts
  function profile(sliceName, f) {
    if (true) {
      console.profile(sliceName);
      try {
        return f();
      } finally {
        console.profileEnd();
      }
    } else {
      return f();
    }
  }

  // src/workletRef.ts
  var impl;
  function initWorkletRef() {
    return impl = {
      _workletRefMap: {},
      updateWorkletRef,
      updateWorkletRefInitValueChanges
    };
  }
  var createWorkletRef = (id, value) => {
    return {
      current: value,
      _wvid: id
    };
  };
  var getFromWorkletRefMap = (id) => {
    const value = impl._workletRefMap[id];
    if (value === void 0) {
      throw new Error("Worklet: ref is not initialized: " + id);
    }
    return value;
  };
  function removeValueFromWorkletRefMap(id) {
    delete impl._workletRefMap[id];
  }
  function updateWorkletRef(handle, element) {
    getFromWorkletRefMap(handle._wvid).current = element ? new Element(element) : null;
  }
  function updateWorkletRefInitValueChanges(patch) {
    profile("updateWorkletRefInitValueChanges", () => {
      patch.forEach(([id, value]) => {
        var _a, _b;
        (_b = (_a = impl._workletRefMap)[id]) != null ? _b : _a[id] = createWorkletRef(id, value);
      });
    });
  }

  // src/listeners.ts
  function initEventListeners() {
    const jsContext = lynx.getJSContext();
    jsContext.addEventListener(
      "Lynx.Worklet.runWorkletCtx" /* runWorkletCtx */,
      (event) => {
        const data = JSON.parse(event.data);
        const returnValue = runWorklet(data.worklet, data.params);
        jsContext.dispatchEvent({
          type: "Lynx.Worklet.FunctionCallRet" /* FunctionCallRet */,
          data: JSON.stringify({
            resolveId: data.resolveId,
            returnValue
          })
        });
      }
    );
    jsContext.addEventListener(
      "Lynx.Worklet.releaseWorkletRef" /* releaseWorkletRef */,
      (event) => {
        removeValueFromWorkletRefMap(event.data.id);
      }
    );
  }

  // src/delayWorkletEvent.ts
  var impl2;
  function initEventDelay() {
    return impl2 = {
      _delayedWorkletParamsMap: /* @__PURE__ */ new Map(),
      runDelayedWorklet,
      clearDelayedWorklets
    };
  }
  function delayExecUntilJsReady(hash, params) {
    profile("delayExecUntilJsReady: " + hash, () => {
      const map = impl2._delayedWorkletParamsMap;
      const paramVec = map.get(hash);
      if (paramVec) {
        paramVec.push(params);
      } else {
        map.set(hash, [params]);
      }
    });
  }
  function runDelayedWorklet(worklet, element) {
    profile("commitDelayedWorklet", () => {
      const paramsVec = impl2._delayedWorkletParamsMap.get(
        worklet._wkltId
      );
      if (paramsVec === void 0) {
        return;
      }
      const leftParamsVec = [];
      paramsVec.forEach((params) => {
        var _a, _b;
        if (((_b = (_a = params[0]) == null ? void 0 : _a.currentTarget) == null ? void 0 : _b.elementRefptr) === element) {
          setTimeout(() => {
            profile("runDelayedWorklet", () => {
              runWorklet(worklet, params);
            });
          }, 0);
        } else {
          leftParamsVec.push(params);
        }
      });
      impl2._delayedWorkletParamsMap.set(
        worklet._wkltId,
        leftParamsVec
      );
    });
  }
  function clearDelayedWorklets() {
    impl2._delayedWorkletParamsMap.clear();
  }

  // src/jsFunctionLifecycle.ts
  var JsFunctionLifecycleManager = class {
    constructor() {
      __publicField(this, "execIdRefCount", /* @__PURE__ */ new Map());
      __publicField(this, "execIdSetToFire", /* @__PURE__ */ new Set());
      __publicField(this, "willFire", false);
      __publicField(this, "registry");
      this.registry = new FinalizationRegistry(this.removeRef.bind(this));
    }
    addRef(execId, objToRef) {
      this.execIdRefCount.set(
        execId,
        (this.execIdRefCount.get(execId) || 0) + 1
      );
      this.registry.register(objToRef, execId);
    }
    removeRef(execId) {
      const rc = this.execIdRefCount.get(execId);
      if (rc > 1) {
        this.execIdRefCount.set(execId, rc - 1);
        return;
      }
      this.execIdRefCount.delete(execId);
      this.execIdSetToFire.add(execId);
      if (!this.willFire) {
        this.willFire = true;
        Promise.resolve().then(() => {
          this.fire();
        });
      }
    }
    fire() {
      profile("JsFunctionLifecycleManager.fire", () => {
        lynx.getJSContext().dispatchEvent({
          type: "Lynx.Worklet.releaseBackgroundWorkletCtx" /* releaseBackgroundWorkletCtx */,
          data: Array.from(this.execIdSetToFire)
        });
        this.execIdSetToFire.clear();
        this.willFire = false;
      });
    }
  };
  function isRunOnBackgroundEnabled() {
    return isSdkVersionGt(2, 15);
  }

  // src/workletRuntime.ts
  function initWorklet() {
    globalThis.lynxWorkletImpl = {
      _workletMap: {},
      _eventDelayImpl: initEventDelay(),
      _refImpl: initWorkletRef()
    };
    if (isRunOnBackgroundEnabled()) {
      globalThis.lynxWorkletImpl._jsFunctionLifecycleManager = new JsFunctionLifecycleManager();
    }
    globalThis.registerWorklet = registerWorklet;
    globalThis.registerWorkletInternal = registerWorklet;
    globalThis.runWorklet = runWorklet2;
  }
  function registerWorklet(_type, id, worklet) {
    lynxWorkletImpl._workletMap[id] = worklet;
  }
  function runWorklet2(ctx, params) {
    if (!validateWorklet(ctx)) {
      console.warn("Worklet: Invalid worklet object: " + JSON.stringify(ctx));
      return;
    }
    if ("_lepusWorkletHash" in ctx) {
      delayExecUntilJsReady(ctx._lepusWorkletHash, params);
      return;
    }
    return runWorkletImpl(ctx, params);
  }
  function runWorkletImpl(ctx, params) {
    const worklet = profile(
      "transformWorkletCtx " + ctx._wkltId,
      () => transformWorklet(ctx, true)
    );
    const params_ = profile(
      "transformWorkletParams",
      () => transformWorklet(params || [], false)
    );
    let result;
    profile("runWorklet", () => {
      result = worklet(...params_);
    });
    return result;
  }
  function validateWorklet(ctx) {
    return typeof ctx === "object" && ctx !== null && ("_wkltId" in ctx || "_lepusWorkletHash" in ctx);
  }
  var workletCache = /* @__PURE__ */ new WeakMap();
  function transformWorklet(ctx, isWorklet) {
    if (typeof ctx !== "object" || ctx === null) {
      return ctx;
    }
    if (isWorklet) {
      const res = workletCache.get(ctx);
      if (res) {
        return res;
      }
    }
    const worklet = { main: ctx };
    transformWorkletInner(worklet, 0, ctx);
    if (isWorklet) {
      workletCache.set(ctx, worklet.main);
    }
    return worklet.main;
  }
  var transformWorkletInner = (obj, depth, ctx) => {
    var _a;
    const limit = 1e3;
    if (++depth >= limit) {
      throw new Error("Depth of value exceeds limit of " + limit + ".");
    }
    if (typeof obj !== "object" || obj === null) {
      return;
    }
    for (const key in obj) {
      const subObj = obj[key];
      if (typeof subObj !== "object" || subObj === null) {
        continue;
      }
      const isEventTarget = "elementRefptr" in subObj;
      if (!isEventTarget) {
        transformWorkletInner(subObj, depth, ctx);
      }
      if (isEventTarget) {
        obj[key] = new Element(subObj["elementRefptr"]);
        continue;
      }
      const isWorkletRef = "_wvid" in subObj;
      if (isWorkletRef) {
        obj[key] = getFromWorkletRefMap(
          subObj._wvid
        );
        continue;
      }
      const isWorklet = "_wkltId" in subObj;
      if (isWorklet) {
        obj[key] = lynxWorkletImpl._workletMap[subObj._wkltId].bind({ ...subObj });
        continue;
      }
      const isJsFn = "_jsFnId" in subObj;
      if (isJsFn) {
        subObj["_execId"] = ctx._execId;
        (_a = lynxWorkletImpl._jsFunctionLifecycleManager) == null ? void 0 : _a.addRef(
          ctx._execId,
          subObj
        );
        continue;
      }
    }
  };

  // src/index.ts
  if (globalThis.lynxWorkletImpl === void 0) {
    initWorklet();
    initApiEnv();
    initEventListeners();
  }
})();
//# sourceMappingURL=dev.js.map
