module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
    '@babel/preset-flow',
    '@babel/preset-typescript',
  ],
  plugins: ['@babel/plugin-transform-flow-strip-types'],
};