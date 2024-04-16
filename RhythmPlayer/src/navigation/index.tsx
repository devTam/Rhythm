import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {FC, useEffect} from 'react';
import AuthNavigator from './AuthNavigator';
import {useDispatch, useSelector} from 'react-redux';
import {
  getAuthState,
  updateLoadingState,
  updateLoggedInState,
  updateProfile,
} from 'store/auth';
import TabNavigator from './TabNavigator';
import {Keys, getFromAsyncStorage} from 'utils/asyncStorage';
import client from 'api/client';
import Loader from 'ui/Loader';
import {StyleSheet, View} from 'react-native';
import colors from 'utils/colors';

interface Props {}

const AppNavigator: FC<Props> = props => {
  const {loggedIn, loading} = useSelector(getAuthState);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAuthInfo = async () => {
      dispatch(updateLoadingState(true));
      try {
        const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
        if (!token) return dispatch(updateLoadingState(false));

        const {data} = await client.get('/auth/is-auth', {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });
        dispatch(updateProfile(data.profile));
        dispatch(updateLoggedInState(true));
      } catch (error) {
        console.log('Auth error: ', error);
      }
      dispatch(updateLoadingState(false));
    };
    fetchAuthInfo();
  }, []);

  const AppTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.PRIMARY,
      primary: colors.CONTRAST
    }
  }
  return (
    <NavigationContainer theme={AppTheme}>
      {loading ? (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: colors.OVERLAY,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
          }}>
          <Loader />
        </View>
      ) : null}
      {loggedIn ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
