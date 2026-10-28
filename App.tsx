import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator, type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Button, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-screens/experimental';

type RootStackParamList = {
  Home: undefined;
  PlainSheet: undefined;
  SafeAreaSheet: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.home}>
      <Text style={styles.info}>iOS {String(Platform.Version)}</Text>
      <Text style={styles.info}>
        Red = sheet content. Any white band below the red area is extra space added to the sheet.
      </Text>
      <Button
        title="Plain content (iOS 26+ case)"
        onPress={() => navigation.navigate('PlainSheet')}
      />
      <Button
        title="SafeAreaView bottom: true (iOS 16–18 case)"
        onPress={() => navigation.navigate('SafeAreaSheet')}
      />
    </View>
  );
}

function SheetBody({ title }: { title: string }) {
  return (
    <View style={styles.body}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>The sheet should end right below this red area.</Text>
    </View>
  );
}

/** No safe area handling: the content is just its own padding. */
function PlainSheet() {
  return <SheetBody title="Plain content" />;
}

/** The content applies the bottom safe area itself (painted red as well: it belongs to the content). */
function SafeAreaSheet() {
  return (
    <SafeAreaView edges={{ bottom: true }} style={styles.safeArea}>
      <SheetBody title="SafeAreaView bottom: true" />
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
            contentStyle: { backgroundColor: 'white' },
          }}
        >
          <Stack.Screen name="PlainSheet" component={PlainSheet} />
          <Stack.Screen name="SafeAreaSheet" component={SafeAreaSheet} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
    gap: 16,
    padding: 24,
  },
  info: {
    fontSize: 15,
    color: '#444',
  },
  safeArea: {
    backgroundColor: 'tomato',
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
