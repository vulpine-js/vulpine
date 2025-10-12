module.exports = function ({ types: t }) {
  const DIRECTIVE = "Θd";
  const IF_CONDITION = "Θif";
  const LIST_RENDERING = "Θfor";
  const CREATE_ELEMENT = "Θe";
  const ROUTE = "Θr";
  const CREATE_COMPONENT = "Θc";
  const CREATE_TEXT = "Θt";
  const BIND_TEXT = "Θbt";
  const BIND_ATTRIBUTE = "Θba";
  const LOCAL_THIS = "Θ_this";

  function isFirstLetterCapitalized(str) {
    if (!str || typeof str !== "string") return false;
    const firstChar = str.charAt(0);
    return firstChar === firstChar.toUpperCase() && firstChar !== firstChar.toLowerCase();
  }

  function stringToObjectKey(str) {
    return str.indexOf("-") > 0
      ? {
          type: "StringLiteral",
          value: str
        }
      : {
          type: "Identifier",
          name: str
        };
  }

  function applyChildren(path) {
    const children = path.node.children;

    if (children.length > 0) {
      path.node.arguments.push({
        type: "ArrayExpression",
        elements: children.map((child) => {
          if (child.type === "JSXExpressionContainer") {
            return handleExpressionContainerChild(child);
          }
          return child;
        })
      });
    }
  }

  function applyForCondition(path, forLoop, forLoopItem, forLoopIndex, forLoopTrackBy) {
    if (forLoop) {
      const { node } = path;
      const originalNode = { ...node };
      let forLoopItemValue = "$item";
      let forLoopIndexValue = "$index";

      if (forLoopItem) {
        forLoopItemValue = forLoopItem.value.value;
      }
      if (forLoopIndex) {
        forLoopIndexValue = forLoopIndex.value.value;
      }

      node.type = "CallExpression";
      node.callee = {
        type: "Identifier",
        name: LIST_RENDERING
      };
      node.arguments = [
        {
          type: "Identifier",
          name: LOCAL_THIS
        },
        {
          type: "ArrowFunctionExpression",
          params: [
            {
              type: "Identifier",
              name: forLoopIndexValue
            }
          ],
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "VariableDeclaration",
                kind: "const",
                declarations: [
                  {
                    type: "VariableDeclarator",
                    id: {
                      type: "Identifier",
                      name: forLoopItemValue
                    },
                    init: {
                      type: "StringLiteral",
                      value: ""
                    }
                  }
                ]
              },
              {
                type: "ReturnStatement",
                argument: originalNode
              }
            ]
          }
        },
        {
          type: "ArrowFunctionExpression",
          params: [],
          body: forLoop.value.expression
        }
      ];

      if (forLoopTrackBy) {
        node.arguments.push(forLoopTrackBy.value.expression || forLoopTrackBy.value);
      }

      path.traverse({
        VariableDeclaration(path2) {
          if (path2.scope.bindings[forLoopItemValue]) {
            path2.scope.bindings[forLoopItemValue].referencePaths.forEach((item) => {
              item.node.type = "MemberExpression";
              item.node.object = forLoop.value.expression;
              item.node.computed = true;
              item.node.property = {
                type: "Identifier",
                name: forLoopIndexValue
              };
            });
            path2.remove();
          }
        }
      });
    }
  }

  function applyFor(path) {
    const openingElement = path.node.openingElement;
    const forDirective = openingElement.attributes.find(
      (attr) => attr.name.type === "JSXNamespacedName" && attr.name.namespace.name === "v" && attr.name.name.name === "for"
    );
    const indexDirective = openingElement.attributes.find(
      (attr) => attr.name.type === "JSXNamespacedName" && attr.name.namespace.name === "v" && attr.name.name.name === "for-index"
    );
    const itemDirective = openingElement.attributes.find(
      (attr) => attr.name.type === "JSXNamespacedName" && attr.name.namespace.name === "v" && attr.name.name.name === "for-item"
    );
    const trackByDirective = openingElement.attributes.find(
      (attr) => attr.name.type === "JSXNamespacedName" && attr.name.namespace.name === "v" && attr.name.name.name === "for-track-by"
    );
    applyForCondition(path, forDirective, itemDirective, indexDirective, trackByDirective);
  }

  function applyIf(path) {
    const openingElement = path.node.openingElement;
    const directive = openingElement.attributes.find(
      (attr) => attr.name.type === "JSXNamespacedName" && attr.name.namespace.name === "v" && attr.name.name.name === "if"
    );

    if (directive) {
      const originalNode = { ...path.node };

      path.node.type = "CallExpression";
      path.node.callee = {
        type: "Identifier",
        name: IF_CONDITION
      };
      path.node.arguments = [
        {
          type: "Identifier",
          name: LOCAL_THIS
        },
        {
          type: "ArrowFunctionExpression",
          params: [],
          body: originalNode
        },
        {
          type: "ArrowFunctionExpression",
          params: [],
          body: directive.value.expression
        }
      ];
    }
  }

  function applyDirectives(path) {
    const openingElement = path.node.openingElement;
    const directives = openingElement.attributes
      .filter((attr) => attr.name.type === "JSXNamespacedName")
      .filter((attr) => {
        return (
          !(attr.name.namespace.name === "v" && attr.name.name.name === "if") &&
          !(attr.name.namespace.name === "v" && attr.name.name.name === "for") &&
          !(attr.name.namespace.name === "v" && attr.name.name.name === "for-index") &&
          !(attr.name.namespace.name === "v" && attr.name.name.name === "for-item") &&
          !(attr.name.namespace.name === "v" && attr.name.name.name === "for-track-by") &&
          attr.name.namespace.name !== "attr"
        );
      });

    if (directives.length) {
      const originalNode = { ...path.node };

      path.node.type = "CallExpression";
      path.node.callee = {
        type: "Identifier",
        name: DIRECTIVE
      };
      path.node.arguments = [
        {
          type: "Identifier",
          name: LOCAL_THIS
        },
        originalNode,
        jsxNamespaceAttributesToObjectExpression(directives)
      ];
    }
  }

  function componentApplyAttributeBinding(path) {
    const attrBindings = componentGetAttributeBindings(path);

    if (attrBindings.length > 0) {
      const originalNode = { ...path.node };

      path.node.type = "CallExpression";
      path.node.callee = {
        type: "Identifier",
        name: BIND_ATTRIBUTE
      };
      path.node.arguments = [
        {
          type: "Identifier",
          name: LOCAL_THIS
        },
        originalNode,
        componentJsxAttributeBindingToObjectExpression(attrBindings)
      ];
    }
  }

  function applyAttributeBinding(path) {
    const attrBindings = getAttributeBindings(path);

    if (attrBindings.length > 0) {
      const originalNode = { ...path.node };

      path.node.type = "CallExpression";
      path.node.callee = {
        type: "Identifier",
        name: BIND_ATTRIBUTE
      };
      path.node.arguments = [
        {
          type: "Identifier",
          name: LOCAL_THIS
        },
        originalNode,
        jsxAttributeBindingToObjectExpression(attrBindings)
      ];
    }
  }

  function componentGetAttributeBindings(path) {
    const openingElement = path.node.openingElement;
    const attrBindings = openingElement.attributes.filter((attr) => attr.name.type === "JSXNamespacedName" && attr.name.namespace.name === "attr");
    return attrBindings;
  }

  function getAttributeBindings(path) {
    const openingElement = path.node.openingElement;
    const attrBindings = openingElement.attributes.filter(
      (attr) => attr.name.type === "JSXIdentifier" && attr.value && attr.value.type === "JSXExpressionContainer"
    );
    return attrBindings;
  }

  function routeJsxAttributesToObjectExpression(path) {
    const openingElement = path.node.openingElement;
    const attributes = openingElement.attributes.filter(
      (attr) => attr.name.type === "JSXIdentifier" && ((attr.value && attr.value.type === "StringLiteral") || !attr.value)
    );

    const properties = attributes.map((attr) => {
      return {
        type: "ObjectProperty",
        key: stringToObjectKey(attr.name.name),
        value: {
          type: "ArrowFunctionExpression",
          params: [],
          body: attr.value
            ? {
                type: attr.value.type,
                value: attr.value.value
              }
            : {
                type: "StringLiteral",
                value: ""
              }
        }
      };
    });

    const attrBindings = getAttributeBindings(path);
    if (attrBindings.length > 0) {
      attrBindings.forEach((attr) => {
        const binding = {
          type: "ObjectProperty",
          key: stringToObjectKey(attr.name.name),
          value: {
            type: "ArrowFunctionExpression",
            params: [],
            body: attr.value.expression
          }
        };
        properties.push(binding);
      });
    }

    return {
      type: "ObjectExpression",
      properties
    };
  }

  function componentJsxAttributesToObjectExpression(path) {
    const openingElement = path.node.openingElement;
    const attributes = openingElement.attributes.filter((attr) => attr.name.type === "JSXIdentifier");

    const properties = attributes.map((attr) => {
      return {
        type: "ObjectProperty",
        key: stringToObjectKey(attr.name.name),
        value: attr.value
          ? attr.value.type === "JSXExpressionContainer"
            ? attr.value.expression
            : {
                type: attr.value.type,
                value: attr.value.value
              }
          : {
              type: "StringLiteral",
              value: ""
            }
      };
    });

    return {
      type: "ObjectExpression",
      properties
    };
  }

  function jsxAttributesToObjectExpression(path) {
    const openingElement = path.node.openingElement;
    const attributes = openingElement.attributes.filter(
      (attr) => attr.name.type === "JSXIdentifier" && ((attr.value && attr.value.type === "StringLiteral") || !attr.value)
    );

    const properties = attributes.map((attr) => {
      return {
        type: "ObjectProperty",
        key: stringToObjectKey(attr.name.name),
        value: attr.value
          ? {
              type: attr.value.type,
              value: attr.value.value
            }
          : {
              type: "StringLiteral",
              value: ""
            }
      };
    });

    return {
      type: "ObjectExpression",
      properties
    };
  }

  function componentJsxAttributeBindingToObjectExpression(attributes) {
    return {
      type: "ObjectExpression",
      properties: attributes.map((attr) => {
        return {
          type: "ObjectProperty",
          key: stringToObjectKey(attr.name.name.name),
          value: {
            type: "ArrowFunctionExpression",
            params: [],
            body: attr.value
              ? attr.value.type === "StringLiteral"
                ? attr.value
                : attr.value.expression
              : {
                  type: "StringLiteral",
                  value: ""
                }
          }
        };
      })
    };
  }

  function jsxAttributeBindingToObjectExpression(attributes) {
    return {
      type: "ObjectExpression",
      properties: attributes.map((attr) => {
        return {
          type: "ObjectProperty",
          key: stringToObjectKey(attr.name.name),
          value: {
            type: "ArrowFunctionExpression",
            params: [],
            body: attr.value.expression
          }
        };
      })
    };
  }

  function jsxNamespaceAttributesToObjectExpression(directives) {
    return {
      type: "ArrayExpression",
      elements: directives.map((dir) => {
        return {
          type: "ObjectExpression",
          properties: [
            {
              type: "ObjectProperty",
              key: {
                type: "Identifier",
                name: "namespace"
              },
              value: {
                type: "StringLiteral",
                value: dir.name.namespace.name
              }
            },
            {
              type: "ObjectProperty",
              key: {
                type: "Identifier",
                name: "name"
              },
              value: {
                type: "StringLiteral",
                value: dir.name.name.name
              }
            },
            {
              type: "ObjectProperty",
              key: {
                type: "Identifier",
                name: "valueCaller"
              },
              value: {
                type: "ArrowFunctionExpression",
                params: [{ type: "Identifier", name: "$event" }],
                body: dir.value
                  ? dir.value.type === "StringLiteral"
                    ? {
                        type: "StringLiteral",
                        value: dir.value.value
                      }
                    : dir.value.expression
                  : {
                      type: "Identifier",
                      name: "undefined"
                    }
              }
            }
          ]
        };
      })
    };
  }

  function handleExpressionContainerChild(child) {
    return {
      type: "CallExpression",
      callee: {
        type: "Identifier",
        name: BIND_TEXT
      },
      arguments: [
        {
          type: "Identifier",
          name: LOCAL_THIS
        },
        {
          type: "ArrowFunctionExpression",
          params: [],
          body: child.expression
        }
      ]
    };
  }

  return {
    name: "ast-transform", // not required
    visitor: {
      Program(path, state) {
        // only run on .tsx files
        if (!state.filename || !state.filename.endsWith(".tsx")) {
          return; // skip this file entirely
        }

        // Create: import { c, e, t, bt, d } from 'vulpine';
        const importDeclaration = t.importDeclaration(
          [
            t.importSpecifier(t.identifier(CREATE_ELEMENT), t.identifier(CREATE_ELEMENT)),
            t.importSpecifier(t.identifier("c"), t.identifier("c")),
            t.importSpecifier(t.identifier(CREATE_TEXT), t.identifier(CREATE_TEXT)),
            t.importSpecifier(t.identifier(BIND_ATTRIBUTE), t.identifier(BIND_ATTRIBUTE)),
            t.importSpecifier(t.identifier(BIND_TEXT), t.identifier(BIND_TEXT)),
            t.importSpecifier(t.identifier(DIRECTIVE), t.identifier(DIRECTIVE)),
            t.importSpecifier(t.identifier(IF_CONDITION), t.identifier(IF_CONDITION)),
            t.importSpecifier(t.identifier(LIST_RENDERING), t.identifier(LIST_RENDERING)),
            t.importSpecifier(t.identifier(ROUTE), t.identifier(ROUTE)),
            t.importSpecifier(t.identifier(CREATE_COMPONENT), t.identifier(CREATE_COMPONENT))
          ],
          t.stringLiteral("vulpine/shortcuts")
        );

        // Insert at the very top of the file
        path.unshiftContainer("body", importDeclaration);
      },
      FunctionDeclaration(path) {
        // only do this if the function *returns JSX*
        const hasJSX = path.node.body.body.some((stmt) => t.isReturnStatement(stmt) && (t.isJSXElement(stmt.argument) || t.isJSXFragment(stmt.argument)));

        if (!hasJSX) return;

        // create `const _this_ = this;`
        const thisVar = t.variableDeclaration("const", [t.variableDeclarator(t.identifier(LOCAL_THIS), t.thisExpression())]);

        // Insert at the top of the function body if not already present
        if (!path.node.body.body.some((stmt) => t.isVariableDeclaration(stmt) && stmt.declarations.some((d) => d.id.name === LOCAL_THIS))) {
          path.node.body.body.unshift(thisVar);
        }
      },
      JSXText(path) {
        path.node.type = "CallExpression";
        path.node.callee = {
          type: "Identifier",
          name: CREATE_TEXT
        };
        path.node.arguments = [
          {
            type: "StringLiteral",
            value: path.node.value
          }
        ];
      },
      JSXElement(path) {
        const openingElement = path.node.openingElement;
        const tagName = openingElement.name.name;
        const isComponent = isFirstLetterCapitalized(tagName);
        const isRoute = tagName === "Route";

        if (isRoute) {
          path.node.type = "CallExpression";
          path.node.callee = {
            type: "Identifier",
            name: ROUTE
          };
          path.node.arguments = [
            {
              type: "Identifier",
              name: LOCAL_THIS
            },
            {
              type: "Identifier",
              name: tagName
            },
            routeJsxAttributesToObjectExpression(path)
          ];
          return;
        } else if (isComponent) {
          path.node.type = "CallExpression";
          path.node.callee = {
            type: "Identifier",
            name: CREATE_COMPONENT
          };
          path.node.arguments = [
            {
              type: "Identifier",
              name: LOCAL_THIS
            },
            {
              type: "Identifier",
              name: tagName
            },
            componentJsxAttributesToObjectExpression(path)
          ];

          applyChildren(path);

          componentApplyAttributeBinding(path);

          applyDirectives(path);
          applyIf(path);
          applyFor(path);
          return;
        }

        path.node.type = "CallExpression";
        path.node.callee = {
          type: "Identifier",
          name: CREATE_ELEMENT
        };
        path.node.arguments = [
          {
            type: "StringLiteral",
            value: tagName
          },
          jsxAttributesToObjectExpression(path)
        ];

        applyChildren(path);

        applyAttributeBinding(path);

        applyDirectives(path);
        applyIf(path);
        applyFor(path);
      }
    }
  };
};
