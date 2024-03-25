module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          src: './src',
          '@components': './src/components',
          '@views': './src/views',
          '@utils': './src/utils',
          '@ui': './src/ui',
        },
      },
    ],
    ['react-native-reanimated/plugin'],
  ],
};
