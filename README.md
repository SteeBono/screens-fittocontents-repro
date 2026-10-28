# react-native-screens: fitToContents formSheet extra bottom space (iOS)

Minimal reproduction: on iOS, a `formSheet` with `sheetAllowedDetents: 'fitToContents'` is taller than its content
by the bottom safe area inset (34pt on Face ID iPhones).

- Expo SDK 58, React Native 0.88.0, react-native-screens 4.30.0, @react-navigation/native-stack 7
- All the code is in [`App.tsx`](App.tsx)

## Run

Requires a development build (react-native-screens native code), not Expo Go:

```sh
npm install
npx expo run:ios --device   # or: npx expo run:ios (simulator)
```

## What to look at

Each button opens a fitToContents form sheet with a different root view (plain view, `SafeAreaView` from
`react-native-screens/experimental` with different edges, `ScrollView`, `flex: 1` / `flex: 0`).

The sheet content is painted red, the sheet background is white, and the content shows its own measured height
(`Root view height`, from `onLayout`). Any white band below the red area is extra space: on iOS 27.0.1 (iPhone)
the sheet is taller than the content by ~33pt (about the bottom safe area inset) in every variant.

## Tried workaround (not a fix)

[`fix/react-native-screens+4.30.0.patch`](fix/react-native-screens+4.30.0.patch) subtracts the window's bottom safe area
inset from the fitToContents detent. It removes the band in some cases, but in others the sheet ends up shorter than
its content, so it doesn't address the actual cause.

To try it:

```sh
npm install --save-dev patch-package
mkdir -p patches && cp fix/react-native-screens+4.30.0.patch patches/
npx patch-package
npx expo run:ios --device
```
