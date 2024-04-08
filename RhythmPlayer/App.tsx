import {NavigationContainer} from '@react-navigation/native';
import AuthNavigator from 'navigation/AuthNavigator';
import {Provider} from 'react-redux';
import store from 'store';

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
