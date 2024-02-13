module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": ["airbnb-base", "airbnb-typescript/base"],
    "parser": "@typescript-eslint/parser",
    "plugins": ["@typescript-eslint/eslint-plugin"],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "project": ["./tsconfig.json"]
    },
    "ignorePatterns": [".eslintrc.js"],
    "rules": {
        "import/prefer-default-export": "off",
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "class-methods-use-this": "off",
        "import/no-cycle": "off",
        "max-classes-per-file": "off",
        "max-len": ["error", { "code": 120 }],
        "import/no-extraneous-dependencies": "off"
    }
}
