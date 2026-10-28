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

The sheet content is painted red, the sheet background is white. Any white band below the red area is the extra space.

| Button | Content | Expected | Actual |
| --- | --- | --- | --- |
| **Plain content** | padding only, no safe area handling | sheet ends right below the red area | white band as tall as the bottom safe area (iOS 26+) |
| **SafeAreaView bottom: true** | `SafeAreaView` from `react-native-screens/experimental` with `edges={{ bottom: true }}` (the inset is painted red, as it belongs to the content) | sheet ends right below the red area | white band as tall as the bottom safe area, on top of the inset the content already applies (iOS 16–18) |

## Proposed fix

[`fix/react-native-screens+4.30.0.patch`](fix/react-native-screens+4.30.0.patch) subtracts the window's bottom safe area
inset from the fitToContents detent, since UIKit adds it on top of custom detent values.

To try it:

```sh
npm install --save-dev patch-package
mkdir -p patches && cp fix/react-native-screens+4.30.0.patch patches/
npx patch-package
npx expo run:ios --device
```
