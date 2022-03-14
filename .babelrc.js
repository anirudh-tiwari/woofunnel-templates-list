module.exports = {
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false,
        "targets": {
          "browsers": [
            "last 2 versions",
            "safari >= 7"
          ]
        }
      }
    ]
  ],
  plugins: [
    ['@wordpress/babel-plugin-import-jsx-pragma', {
      scopeVariable: 'createElement',
      scopeVariableFrag: 'Fragment',
      source: '@wordpress/element',
      isDefault: false,
    }],
    ['@babel/plugin-transform-react-jsx', {
      pragma: 'createElement',
      pragmaFrag: 'Fragment',
    }],
    ["@babel/plugin-syntax-dynamic-import"]
  ],
};