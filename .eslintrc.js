module.exports = {
    "root": true,
    "extends": "airbnb-base",
    "rules": {
        /* The default of it is alignment with 4 spaces for code and 2 spaces
            for JSX, we override it all for tabs */
        "indent": ["error", "tab"],
        "no-tabs": "off",
        /* this one doesn't allow extra lines between function definition and code, 
            we override it because it makes the code look a bit dirtier */
        "padded-blocks": "off",
        /* they don't like functions like _privateFn(), but we do, so we override it */
        "no-underscore-dangle": "off",
        /* it complains with for...of loops by default, so we override it 
            just to take the ForOfStatement out of it */
        "no-restricted-syntax": [
            "error",
            "ForInStatement",
            "LabeledStatement",
            "WithStatement"
        ],
        "no-confusing-arrow": "off",
        /* comma-dangle enforces things like [1, 2, 3,] 
            which are pretty strange, so we invert the default */
        "comma-dangle": ["error", "never"],
        /* labels have to have the for attribute in this case, 
            which reduces their utility */
    }
}
