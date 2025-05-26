module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(js|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|expo(nent)?|@expo(nent)?|@expo/vector-icons|expo-font|expo-modules-core)/)',
  ],
  testPathIgnorePatterns: [
    './node_modules',
  ],
  setupFilesAfterEnv: ['./jest.setup.js'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)(spec|test).[jt]s?(x)'],
};