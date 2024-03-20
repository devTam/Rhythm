import { FC } from 'react'
import { StyleSheet, Text, SafeAreaView } from 'react-native'

interface Prop {}

const App: FC<Prop> = () => {
  return (
    <SafeAreaView>
      <Text>Hello World</Text>
    </SafeAreaView>
  )
}

export default App

const styles = StyleSheet.create({})