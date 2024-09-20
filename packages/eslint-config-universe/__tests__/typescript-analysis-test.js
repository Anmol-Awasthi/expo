const path = require('node:path');

const getBaseConfig = require('./tools/getBaseConfig');
const lintAsync = require('./tools/lintAsync');

const configFile = path.resolve(__dirname, '../shared/typescript-analysis.js');

const alteredBaseConfig = {
  ...getBaseConfig(),
  root: true,
  parserOptions: {
    project: [path.resolve(__dirname, 'tsconfig.test.json')],
    tsconfigRootDir: __dirname,
  },
};

it(`lints`, async () => {
  const results = await lintAsync(
    {
      baseConfig: alteredBaseConfig,
      overrideConfigFile: configFile,
      fix: true,
      ignore: false,
      useEslintrc: false,
    },
    ['__tests__/fixtures/*typescript-analysis*'],
  );

  for (const result of results) {
    const relativeFilePath = path.relative(__dirname, result.filePath);
    delete result.filePath;
    expect(result).toMatchSnapshot(relativeFilePath);
  }
}, 20000);
