"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultDirectives = void 0;
const on_prevent_directive_1 = require("../directives/on-prevent.directive");
const on_directive_1 = require("../directives/on.directive");
const view_directive_1 = require("../directives/view.directive");
exports.defaultDirectives = [on_directive_1.onDirective, on_prevent_directive_1.onPreventDirective, view_directive_1.viewDirective];
