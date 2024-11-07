// Import utils
const Utils = require("../utils");

class Handler {
  constructor(path, method, middlewares, fn) {
    this.path = path;
    this.core = fn ? (fn = fn.bind(this)) : null;
    this.middlewares = middlewares;
    this.method = method;
  }

  set(fn) {
    this.core = fn;
  }

  get() {
    if (this.core === null) throw new Error("This handler require a function");
    return this.core;
  }

  get [Symbol.toStringTag]() {
    return "Handler";
  }
}

class Controller {
  constructor(path, router) {
    this.path = path;
    this.router = router;
    this.handlers = [];
  }

  setRouter(router) {
    this.router = router;
  }

  setPath(path) {
    this.path = path;
  }

  appendHandler(handler) {
    if (!(handler instanceof Handler)) return;
    this.handlers.push(handler);
  }

  build() {
    for (const handler of this.handlers) {
      const path = this.utils.String.getPath(this.path, handler.path);
      console.log(`Path: ${path} --- Method: ${handler.method.toUpperCase()}`);
      const final = handler.middlewares
        ? handler.middlewares.concat(handler.get())
        : handler.get();
      this.router[handler.method](path, final);
    }

    return true;
  }

  get [Symbol.toStringTag]() {
    return "Controller";
  }
}

Handler.prototype.utils = Utils;
Controller.prototype.utils = Utils;

module.exports = {
  Handler,
  Controller,
};
