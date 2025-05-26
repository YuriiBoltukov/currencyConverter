jest.mock('expo-modules-core', () => {
  return {
    NativeModulesProxy: {},
  };
});

jest.mock('@expo/vector-icons', () => {
  return {
    Feather: () => null,
  };
});
