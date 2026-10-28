import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator, type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, Platform, type LayoutChangeEvent, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-screens/experimental';

type RootStackParamList = {
  Home: undefined;
  Plain: undefined;
  SafeAreaBottom: undefined;
  SafeAreaAll: undefined;
  Scroll: undefined;
  SafeAreaAllScroll: undefined;
  SafeAreaSides: undefined;
  SafeAreaNoEdges: undefined;
  SafeAreaSidesNoFlex: undefined;
  FlexView: undefined;
  SafeAreaSidesFlex0: undefined;
};

const VARIANTS: { route: Exclude<keyof RootStackParamList, 'Home'>; title: string }[] = [
  { route: 'Plain', title: '1. Plain content' },
  { route: 'SafeAreaBottom', title: '2. SafeAreaView bottom' },
  { route: 'SafeAreaAll', title: '3. SafeAreaView left/right, insetType all' },
  { route: 'Scroll', title: '4. ScrollView with maxHeight' },
  { route: 'SafeAreaAllScroll', title: '5. SafeAreaView (3) + ScrollView (4)' },
  { route: 'SafeAreaSides', title: '6. SafeAreaView left/right (no insetType)' },
  { route: 'SafeAreaNoEdges', title: '7. SafeAreaView with no edges' },
  { route: 'SafeAreaSidesNoFlex', title: '8. SafeAreaView left/right, flexGrow 0' },
  { route: 'FlexView', title: '9. Plain View with flex: 1' },
  { route: 'SafeAreaSidesFlex0', title: '10. SafeAreaView left/right, flex: 0' },
];

const Stack = createNativeStackNavigator<RootStackParamList>();

function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.home}>
      <Text style={styles.info}>iOS {String(Platform.Version)}</Text>
      <Text style={styles.info}>
        Red = sheet content. Any white band below the red area is extra space added to the sheet.
      </Text>
      {VARIANTS.map(({ route, title }) => (
        <Button key={route} title={title} onPress={() => navigation.navigate(route)} />
      ))}
    </View>
  );
}

/** Height of the sheet's root view (onLayout), shown in the sheet to compare it with the sheet height. */
function useRootHeight() {
  const [height, setHeight] = useState(0);
  const onLayout = (event: LayoutChangeEvent) => setHeight(Math.round(event.nativeEvent.layout.height));
  return { height, onLayout };
}

function SheetBody({ title, rootHeight }: { title: string; rootHeight: number }) {
  return (
    <View style={styles.body}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>Root view height: {rootHeight}pt</Text>
      <Text style={styles.text}>The sheet should end right below this red area.</Text>
    </View>
  );
}

/** Scroll view as tall as its content, up to the window height (as in fitToContents sheets that may scroll). */
function SheetScrollView({ children }: { children: React.ReactNode }) {
  const { height } = useWindowDimensions();

  return (
    <ScrollView bounces={false} style={{ maxHeight: height - 100 }}>
      {children}
    </ScrollView>
  );
}

/** No safe area handling: the content is just its own padding. */
function Plain() {
  const { height, onLayout } = useRootHeight();
  return (
    <View onLayout={onLayout}>
      <SheetBody title="1. Plain content" rootHeight={height} />
    </View>
  );
}

/** The content applies the bottom safe area itself (painted red as well: it belongs to the content). */
function SafeAreaBottom() {
  const { height, onLayout } = useRootHeight();
  return (
    <SafeAreaView edges={{ bottom: true }} style={styles.red} onLayout={onLayout}>
      <SheetBody title="2. SafeAreaView bottom" rootHeight={height} />
    </SafeAreaView>
  );
}

function SafeAreaAll() {
  const { height, onLayout } = useRootHeight();
  return (
    <SafeAreaView edges={{ left: true, right: true }} insetType="all" style={styles.red} onLayout={onLayout}>
      <SheetBody title="3. SafeAreaView left/right, insetType all" rootHeight={height} />
    </SafeAreaView>
  );
}

function Scroll() {
  const { height, onLayout } = useRootHeight();
  return (
    <View onLayout={onLayout}>
      <SheetScrollView>
        <SheetBody title="4. ScrollView with maxHeight" rootHeight={height} />
      </SheetScrollView>
    </View>
  );
}

function SafeAreaAllScroll() {
  const { height, onLayout } = useRootHeight();
  return (
    <SafeAreaView edges={{ left: true, right: true }} insetType="all" style={styles.red} onLayout={onLayout}>
      <SheetScrollView>
        <SheetBody title="5. SafeAreaView (3) + ScrollView (4)" rootHeight={height} />
      </SheetScrollView>
    </SafeAreaView>
  );
}

function SafeAreaSides() {
  const { height, onLayout } = useRootHeight();
  return (
    <SafeAreaView edges={{ left: true, right: true }} style={styles.red} onLayout={onLayout}>
      <SheetBody title="6. SafeAreaView left/right (no insetType)" rootHeight={height} />
    </SafeAreaView>
  );
}

function SafeAreaNoEdges() {
  const { height, onLayout } = useRootHeight();
  return (
    <SafeAreaView style={styles.red} onLayout={onLayout}>
      <SheetBody title="7. SafeAreaView with no edges" rootHeight={height} />
    </SafeAreaView>
  );
}

/** SafeAreaView applies flex: 1 by default: here it is turned off. */
function SafeAreaSidesNoFlex() {
  const { height, onLayout } = useRootHeight();
  return (
    <SafeAreaView edges={{ left: true, right: true }} style={[styles.red, styles.noFlexGrow]} onLayout={onLayout}>
      <SheetBody title="8. SafeAreaView left/right, flexGrow 0" rootHeight={height} />
    </SafeAreaView>
  );
}

/** Same flex: 1 as the SafeAreaView default, without SafeAreaView. */
function FlexView() {
  const { height, onLayout } = useRootHeight();
  return (
    <View style={[styles.red, styles.flex]} onLayout={onLayout}>
      <SheetBody title="9. Plain View with flex: 1" rootHeight={height} />
    </View>
  );
}

/** flex: 0 resets the whole flex: 1 default (grow, shrink and basis 0), not just the grow. */
function SafeAreaSidesFlex0() {
  const { height, onLayout } = useRootHeight();
  return (
    <SafeAreaView edges={{ left: true, right: true }} style={[styles.red, styles.flex0]} onLayout={onLayout}>
      <SheetBody title="10. SafeAreaView left/right, flex: 0" rootHeight={height} />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'fitToContents repro' }} />
        <Stack.Group
          screenOptions={{
            presentation: 'formSheet',
            sheetAllowedDetents: 'fitToContents',
            sheetGrabberVisible: true,
            headerShown: false,
            headerTransparent: true,
            contentStyle: { backgroundColor: 'white' },
          }}
        >
          <Stack.Screen name="Plain" component={Plain} />
          <Stack.Screen name="SafeAreaBottom" component={SafeAreaBottom} />
          <Stack.Screen name="SafeAreaAll" component={SafeAreaAll} />
          <Stack.Screen name="Scroll" component={Scroll} />
          <Stack.Screen name="SafeAreaAllScroll" component={SafeAreaAllScroll} />
          <Stack.Screen name="SafeAreaSides" component={SafeAreaSides} />
          <Stack.Screen name="SafeAreaNoEdges" component={SafeAreaNoEdges} />
          <Stack.Screen name="SafeAreaSidesNoFlex" component={SafeAreaSidesNoFlex} />
          <Stack.Screen name="FlexView" component={FlexView} />
          <Stack.Screen name="SafeAreaSidesFlex0" component={SafeAreaSidesFlex0} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
    gap: 4,
    padding: 24,
  },
  info: {
    fontSize: 15,
    color: '#444',
  },
  red: {
    backgroundColor: 'tomato',
  },
  flex: {
    flex: 1,
  },
  flex0: {
    flex: 0,
  },
  noFlexGrow: {
    flexGrow: 0,
  },
  body: {
    gap: 8,
    padding: 24,
    backgroundColor: 'tomato',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  text: {
    fontSize: 15,
    color: 'white',
  },
});
