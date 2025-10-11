"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerDirective = void 0;
const directive_1 = require("./directive");
const vulpine_validation_1 = require("../utils/vulpine-validation");
const create_router_1 = require("../utils/create-router");
const bind_attribute_1 = require("../utils/bind-attribute");
const routerDirective = (element, directives, componentInstance) => {
    const component = componentInstance;
    const router = (0, create_router_1.createRouter)();
    for (let i = 0; i < directives.length; i++) {
        const dir = directives[i];
        switch (dir.name) {
            case 'link':
                element.addEventListener('click', event => {
                    event.preventDefault();
                    router.navigate(dir.valueCaller());
                });
                if (element.localName === 'a') {
                    (0, bind_attribute_1.bindAttribute)(component, element, { href: () => dir.valueCaller() });
                }
                break;
            default:
                (0, vulpine_validation_1.vulpineValidationΘ)(() => {
                    throw new Error(`Directive ${dir.namespace}:${dir.name} is not defined`);
                });
                break;
        }
    }
    return element;
};
exports.routerDirective = routerDirective;
(0, directive_1.directive)(exports.routerDirective, 'router');
