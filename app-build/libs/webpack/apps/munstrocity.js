const entries = {
  app: [
    "script-loader!./app/vendor/syntax/scripts/shCore",
    "script-loader!./app/vendor/syntax/scripts/shBrushCss",
    "script-loader!./app/vendor/syntax/scripts/shBrushJScript",
    "script-loader!./app/vendor/syntax/scripts/shBrushPhp",
    "script-loader!./app/vendor/syntax/scripts/shBrushSass",
    "./app/index"
  ]
};

module.exports = {
  app: "munstrocity",
  entries
};