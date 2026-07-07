const babel = require('@babel/core');

module.exports = {
  process(src, filename) {
    const result = babel.transformSync(src, {
      filename,
      configFile: './babel.config.js',
      babelrc: false,
    });

    return {
      code: result?.code || src,
    };
  },
};
