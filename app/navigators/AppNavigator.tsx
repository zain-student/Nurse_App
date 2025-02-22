/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  NavigatorScreenParams, // @demo remove-current-line
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import {
  AppState,
  AppStateStatus,
  ToastAndroid,
  useColorScheme,
} from 'react-native';
import * as Screens from 'app/screens';
import Config from '../config';
import {useStores} from '../models'; // @demo remove-current-line
import {DemoNavigator, DemoTabParamList} from './DemoNavigator'; // @demo remove-current-line
import {HomeNavigator, HomeTabParamList} from './HomeNavigator';
import {navigationRef, useBackButtonHandler} from './navigationUtilities';
import {colors} from 'app/theme';
import {PatientNavigator, PatientStackParamList} from './PatientNavigator';
import {UserContext} from 'app/utils/UserContext';
import {NetworkInfo} from 'react-native-network-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import KeepAwake from 'react-native-keep-awake';
import {MMKV} from 'react-native-mmkv';
var net = require('react-native-tcp');

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Welcome: undefined;
  Login: undefined; // @demo remove-current-line
  Landing: undefined;
  SitesScreen: undefined;
  Home: NavigatorScreenParams<HomeTabParamList>; // @demo remove-current-line
  Patient: NavigatorScreenParams<PatientStackParamList>;
  Demo: NavigatorScreenParams<DemoTabParamList>; // @demo remove-current-line
  // 🔥 Your screens go here
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
};

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes;

const mmkvStorage = new MMKV();
export type AppStackScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = observer(function AppStack() {
  // @demo remove-block-start
  const {
    authenticationStore: {isAuthenticated},
  } = useStores();
  const {siteStore, patientStore, vitalStore} = useStores();
  const [clientSocket, setClientSocket] = useState(null);
  const [refreshData, setRefreshData] = useState('1');

  const updateclientSocket = (socket: any) => {
    setClientSocket(socket);
  };
  useEffect(() => {
    try {
      KeepAwake.activate();
      global.successResponses = [];
      if (mmkvStorage.getString('successResponses')) {
        global.successResponses = JSON.parse(
          mmkvStorage.getString('successResponses'),
        );
      }
      console.warn('initiatings');
      global.connectionEstabished = false;
      initiateConnection();
    } catch (e) {}
  }, []);

  const initiateConnection = async () => {
    try {
      // await AsyncStorage.setItem('socketIp', '10.0.2.15');
      let data = await AsyncStorage.getItem('socketIp');
      console.warn('data', data);
      if (data) {
        global.ip = data;
        startConnectionDiscovery();
      }
    } catch (e) {}
  };
  const startConnectionDiscovery = () => {
    clearInterval(global.connectionDiscoveryInterval);

    global.connectionDiscoveryInterval = setInterval(() => {
      if (!global.connectionEstabished) {
        createClient();
      }
    }, 3000);
  };

  const createClient = async () => {
    try {
      console.warn('creating client', global.ip);
      // let ip = await NetworkInfo.getGatewayIPAddress();

      const client = net.createConnection(6666, global.ip, () => {
        console.log('opened client on ' + JSON.stringify(client.address()));
        client.write(JSON.stringify({type: 'initial', from: 'nurse'}));
        updateclientSocket(client);
        global.clientSock = client;
        //@ts-ignore
        // if (global.dataToTransfer) {
        //   //@ts-ignore
        //   client.write(global.dataToTransfer);
        // }
        global.connectionEstabished = true;
        clearInterval(global.connectionDiscoveryInterval);
        AsyncStorage.setItem('socketIp', global.ip);
        // ToastAndroid.show('Connected successfully!', ToastAndroid.LONG);
      });

      client.on('data', data => {
        try {
          console.log('Client Received: ' + data);
          let receivedData = JSON.parse(data);
          if (receivedData.receiver !== 'nurse') {
            return;
          }
          let sender = receivedData.sender;
          if (receivedData.type === 'resp_success') {
            if (receivedData.from === 'receptionist') {
              global.successResponses.push(receivedData.patientId);
              mmkvStorage.set(
                'successResponses',
                JSON.stringify(global.successResponses),
              );
              setRefreshData(Math.random().toString());
              // global.socket = socket;
              // global.isServerConnected = true;
              // updateSocket(socket);
            }
            return;
          }
          let isCheckoutSync = receivedData.isCheckoutSync;
          receivedData = receivedData.payload;
          try {
            if (sender === 'receptionist') {
              client.write(
                JSON.stringify({
                  type: 'resp_success',
                  from: 'nurse',
                  patientId: receivedData.PatientId,
                  isCheckoutSync,
                }),
              );
            }
          } catch (e) {}

          // JSON.stringify({
          //   receiver: 'nurse',
          //   sender: 'doctor',
          //   payload: {...peyload},
          // }),

          let item = patientStore.patientsForList.find(
            patient => patient.PatientId === receivedData.PatientId,
          );
          console.warn('item ::', item, sender, sender === 'doctor');
          if (item) {
            if (sender === 'doctor' || sender === 'pharmacy') {
              console.warn('updating data from doctor');
              let ind = patientStore.patientsForList.findIndex(
                patient => patient.PatientId === receivedData.PatientId,
              );
              patientStore.setPatients(
                ind,
                receivedData,
                sender,
                isCheckoutSync,
              );
              setTimeout(() => {
                setRefreshData(Math.random().toString());
              }, 1400);
            }
          } else {
            if (sender === 'pharmacy') {
              return;
            }
            if (sender === 'doctor' && !isCheckoutSync) {
              receivedData = {
                PatientId: receivedData.PatientId,
                FirstName: receivedData.FirstName,
                LastName: receivedData.LastName,
                MRNNo: receivedData.MRNNo,
                DOB: receivedData.DOB,
                CNIC: '',
                CellPhoneNumber: '',
                Gender: receivedData.Gender,
                SiteName: '',
                MartialStatus: '',
                SpouseName: '',
                ZakatEligible: false,
                Country: 'Pakistan',
                City: '',
                Province: '',
                Address: '',
                EnteredOn: '',
                Services: [],
                Status: receivedData.Status,
                PrescriptionTime: receivedData.PrescriptionTime,

                CheckInSynced: false,
                NursingNote: '',
                Vitals: [],
              };
            }
            let servicesList: any = [];
            receivedData.Services.forEach(item => {
              if (typeof item === 'object') {
                servicesList.push(item);
              }
            });
            receivedData.Services = servicesList;
            patientStore.addNewPatient(receivedData);
            setTimeout(() => {
              setRefreshData(Math.random().toString());
            }, 1400);
          }
        } catch (e) {
          console.warn('eror::', e);
        }
        // client.destroy(); // kill client after server's response
        // this.server.close();
      });

      client.on('error', error => {
        updateclientSocket(null);
        global.connectionEstabished = false;
        startConnectionDiscovery();
        console.log('client error ' + error);
      });

      client.on('close', () => {
        console.log('client close');
        updateclientSocket(null);
        global.connectionEstabished = false;
        startConnectionDiscovery();
      });
    } catch (e) {}
  };

  const resetConnection = () => {
    try {
      if (global.clientSock) {
        global.clientSock.destroy();
      }
      // updateclientSocket(null);
      // global.connectionEstabished = false;
    } catch (e) {
      console.warn('err::', e);
    }
  };

  // @demo remove-block-end
  return (
    <UserContext.Provider
      value={{
        clientSocket,
        refreshData,
        updateclientSocket,
        startConnectionDiscovery,
        resetConnection,
      }}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          navigationBarColor: colors.background,
        }}
        // initialRouteName={isAuthenticated ? "Home " : "Landing"} // @demo remove-current-line
      >
        {/* @demo remove-block-start */}
        {isAuthenticated ? (
          <>
            {/* @demo remove-block-end */}
            {/* <Stack.Screen name="Welcome" component={Screens.WelcomeScreen} /> */}
            {/* @demo remove-block-start */}
            <Stack.Screen name="Home" component={HomeNavigator} />
            <Stack.Screen name="Patient" component={PatientNavigator} />
            {/* <Stack.Screen name="Demo" component={DemoNavigator} /> */}
          </>
        ) : (
          <>
            <Stack.Screen name="Landing" component={Screens.LandingScreen} />
            <Stack.Screen name="Sites" component={Screens.SitesScreen} />
            <Stack.Screen name="Login" component={Screens.LoginScreen} />
          </>
        )}
        {/* @demo remove-block-end */}
        {/** 🔥 Your screens go here */}
        {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
      </Stack.Navigator>
    </UserContext.Provider>
  );
});

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(
  props: NavigationProps,
) {
  const colorScheme = useColorScheme();

  useBackButtonHandler(routeName => exitRoutes.includes(routeName));

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
      {...props}>
      <AppStack />
    </NavigationContainer>
  );
});
