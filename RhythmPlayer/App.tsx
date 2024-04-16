import AppContainer from 'components/AppContainer';
import AppNavigator from 'navigation';
import {Provider} from 'react-redux';
import store from 'store';

const App = () => {
  return (
    <Provider store={store}>
      <AppContainer>
        <AppNavigator />
      </AppContainer>
    </Provider>
  );
};

export default App;
