import { registerRootComponent } from 'expo'
import { LogBox } from 'react-native'

import App from './App'

// Suppress the warning about SafeAreaView deprecation as it comes from a dependency
LogBox.ignoreLogs([
  'SafeAreaView has been deprecated',
])

// the environment is set up appropriately
registerRootComponent(App)
