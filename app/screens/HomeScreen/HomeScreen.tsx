import {Link, RouteProp, useRoute} from '@react-navigation/native';
import React, {
  FC,
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ImageStyle,
  Platform,
  SectionList,
  TextStyle,
  View,
  ViewStyle,
  TouchableOpacity,
  ToastAndroid,
  PermissionsAndroid,
} from 'react-native';
import {DrawerLayout, DrawerState} from 'react-native-gesture-handler';
import {useSharedValue, withTiming} from 'react-native-reanimated';
import {Icon, ListItem, Screen, Text, Header} from '../../components';
import {isRTL} from '../../i18n';
import {
  HomeTabParamList,
  HomeTabScreenProps,
} from '../../navigators/HomeNavigator';
import {colors, spacing} from '../../theme';
import {useSafeAreaInsetsStyle} from '../../utils/useSafeAreaInsetsStyle';
// import * as Homes from "./DrawerScreens"
import {DrawerIconButton} from './DrawerIconButton';
import {ProfileIconButton} from './ProfileIconButton';
import {useStores} from '../../models';
import {fetch} from '@react-native-community/netinfo';
import {NetworkInfo} from 'react-native-network-info';
import {UserContext} from 'app/utils/UserContext';
import QrCodeScanner from 'app/components/QRCodePopup';
import {BarCodeReadEvent} from 'react-native-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const logo = require('../../../assets/images/logo.png');

const MENU = [
  {
    id: 1,
    name: "Today's Patients",
    data: [],
    icon: 'button_search',
  },
  {
    id: 2,
    name: 'Patient Status',
    data: [],
    icon: 'button_search',
  },
  {
    id: 3,
    name: 'Vitals History',
    data: [],
    icon: 'button_search',
  },
  {
    id: 4,
    name: 'Add Vitals',
    data: [],
    icon: 'button_search',
  },

  {
    id: 6,
    name: 'Scan QR Code',
    data: [],
    icon: 'button_search',
  },
  {
    id: 5,
    name: 'Signout',
    data: [],
    icon: 'button_search',
  },
];

export interface Home {
  name: string;
  description: string;
  data: ReactElement[];
}

interface HomeListItem {
  item: {name: string; useCases: string[]};
  sectionIndex: number;
  menuPressed?: (sectionIndex: number, itemIndex?: number) => void;
  drawerMenuPressed?: (item) => void;
}

const slugify = str =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const WebListItem: FC<HomeListItem> = ({item, sectionIndex}) => {
  const sectionSlug = item.name.toLowerCase();

  return (
    <View>
      <Link to={`/showroom/${sectionSlug}`} style={$menuContainer}>
        <Text preset="bold">{item.name}</Text>
      </Link>
      {item.useCases.map(u => {
        const itemSlug = slugify(u);

        return (
          <Link
            key={`section${sectionIndex}-${u}`}
            to={`/showroom/${sectionSlug}/${itemSlug}`}>
            <Text>{u}</Text>
          </Link>
        );
      })}
    </View>
  );
};

const NativeListItem: FC<HomeListItem> = ({
  item,
  sectionIndex,
  menuPressed,
}) => {
  // console.log('item............', item)
  return (
    <View>
      <Text
        onPress={() => menuPressed(sectionIndex)}
        preset="bold"
        style={$menuContainer}>
        {item.name}
      </Text>
      {item.useCases.map((u, index) => (
        <ListItem
          key={`section${sectionIndex}-${u}`}
          onPress={() => menuPressed(sectionIndex, index + 1)}
          text={u}
          rightIcon={isRTL ? 'caretLeft' : 'caretRight'}
        />
      ))}
    </View>
  );
};

const MenuButtonListItem: FC<HomeListItem> = ({
  item,
  sectionIndex,
  menuPressed,
  drawerMenuPressed,
}) => {
  if (item.name !== 'Signout') {
    return (
      <TouchableOpacity
        onPress={() => drawerMenuPressed(item)}
        style={$menuButtonContainer}>
        <Icon
          icon={
            item.name == 'Vitals History'
              ? 'button_vitals_history'
              : item.name == 'Add Vitals'
              ? 'button_add'
              : item.name == "Today's Patients"
              ? 'button_queue'
              : item.name == 'Patient Status'
              ? 'button_status'
              : 'button_logout'
          }
          // color={focused && colors.tint}
          size={90}
        />
        <Text
          numberOfLines={2}
          style={{fontSize: 10}}
          // onPress={() => menuPressed(sectionIndex)}
          onPress={() => drawerMenuPressed(item)}
          preset="bold">
          {item.name}
        </Text>
        {item.useCases.map((u, index) => (
          <ListItem
            key={`section${sectionIndex}-${u}`}
            onPress={() => menuPressed(sectionIndex, index + 1)}
            text={u}
            rightIcon={isRTL ? 'caretLeft' : 'caretRight'}
          />
        ))}
      </TouchableOpacity>
    );
  } else {
    return null;
  }
};
const ShowroomListItem = Platform.select({
  web: WebListItem,
  default: NativeListItem,
});
var net = require('react-native-tcp');
let connectionEstabished = false;
let connectionDiscoveryInterval: ReturnType<typeof setInterval>;

export const HomeScreen: FC<HomeTabScreenProps<'Home'>> = function HomeScreen(
  _props,
) {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const drawerRef = useRef<DrawerLayout>();
  const listRef = useRef<SectionList>();
  const menuRef = useRef<FlatList>();
  const progress = useSharedValue(0);
  const route = useRoute<RouteProp<HomeTabParamList, 'Home'>>();
  const params = route.params;
  // const { pickerStore} = useStores()
  const [isLoading, setIsLoading] = React.useState(false);
  const [showQrCodeScanner, setshowQrCodeScanner] = React.useState(false);
  const {siteStore, patientStore, vitalStore} = useStores();
  const userContext = useContext(UserContext);

  const {
    authenticationStore: {logout, appIsOnline},
    fieldStore,
    // patientStore,
    //  serviceStore
  } = useStores();

  useEffect(() => {
    // if(appIsOnline() == '1'){
    (async function load() {
      // setIsLoading(true)
      // await pickerStore.fetchPickers()
      // await serviceStore.fetchServices()
      if (patientStore.latestIndex() == 0) {
        await patientStore.fetchPatients(siteStore.getSelectedSite());
      }
      setIsLoading(false);
    })();
    // }
  }, [patientStore]);

  useEffect(() => {
    // startConnectionDiscovery();
    // bleManage();
    getVitalsForm();
  }, []);

  const getVitalsForm = async () => {
    try {
      setIsLoading(true);
      await fieldStore.fetchFields();
      setIsLoading(false);
    } catch (e) {}
  };

  // const bleManage = async () => {
  //   try {
  //     let granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
  //     );
  //     if (granted) {
  //       BleManager.start();
  //       BleManager.getBondedPeripherals().then(async bondedPeripheralsArray => {
  //         // Each peripheral in returned array will have id and name properties
  //         console.log(
  //           'Bonded peripherals: ',
  //           bondedPeripheralsArray,
  //           bondedPeripheralsArray[0].id,
  //           bondedPeripheralsArray.length,
  //         );

  //         BleManager.retrieveServices(bondedPeripheralsArray[0].id)
  //           .then(peripheralInfo => {
  //             // Success code
  //             console.log('Peripheral info:', peripheralInfo);
  //           })
  //           .catch(e => {
  //             console.warn('err', e);
  //           });
  //         let res = await BleManager.connect(bondedPeripheralsArray[0].id);
  //         console.warn('connect', res);
  //         const connectedPeripherals =
  //           await BleManager.getConnectedPeripherals();
  //         console.warn('connectedPeripherals', connectedPeripherals);

  //         // BleManager.read(
  //         //   'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
  //         //   'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
  //         //   'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
  //         // )
  //         //   .then(readData => {
  //         //     // Success code
  //         //     console.log('Read: ' + readData);

  //         //     // https://github.com/feross/buffer
  //         //     // https://nodejs.org/api/buffer.html#static-method-bufferfromarray
  //         //     // const buffer = Buffer.from(readData);
  //         //     // const sensorData = buffer.readUInt8(1, true);
  //         //   })
  //         //   .catch(error => {
  //         //     // Failure code
  //         //     console.log(error);
  //         //   });
  //       });
  //     }
  //   } catch (e) {
  //     console.warn('err::', e);
  //   }
  // };

  // handle Web links
  React.useEffect(() => {
    if (route.params) {
      const homeValues = Object.values(Homes);
      const findSectionIndex = homeValues.findIndex(
        x => x.name.toLowerCase() === params.queryIndex,
      );
      let findItemIndex = 0;
      if (params.itemIndex) {
        try {
          findItemIndex =
            homeValues[findSectionIndex].data.findIndex(
              u => slugify(u.props.name) === params.itemIndex,
            ) + 1;
        } catch (err) {
          console.error(err);
        }
      }
      menuPressed(findSectionIndex, findItemIndex);
    }
  }, [route]);

  const onShowQrCodeScanner = async () => {
    let granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if (granted === 'granted') {
      setshowQrCodeScanner(true);
    } else {
      ToastAndroid.show(
        'Please grant permission to access camera',
        ToastAndroid.LONG,
      );
    }
  };

  const onHideQrCodeScanner = async () => {
    setshowQrCodeScanner(false);
  };

  const onQrRead = (e: BarCodeReadEvent) => {
    let ip = e.data;
    global.ip = ip;
    userContext.startConnectionDiscovery();
    console.warn('qr data', e);
    setshowQrCodeScanner(false);
  };

  // const startConnectionDiscovery = () => {
  //   clearInterval(connectionDiscoveryInterval);

  //   connectionDiscoveryInterval = setInterval(() => {
  //     if (!connectionEstabished) {
  //       createClient();
  //     }
  //   }, 3000);
  // };

  // const createClient = async () => {
  //   try {
  //     console.warn('creating client');
  //     let ip = await NetworkInfo.getGatewayIPAddress();

  //     const client = net.createConnection(6666, '192.168.236.69', () => {
  //       console.log('opened client on ' + JSON.stringify(client.address()));
  //       userContext.updateclientSocket(client);
  //       // client.write('Hello, server! Love, Client.');
  //       connectionEstabished = true;
  //       clearInterval(connectionDiscoveryInterval);
  //     });

  //     client.on('data', data => {
  //       console.log('Client Received: ' + data);
  //       let receivedData = JSON.parse(data);

  //       let item = patientStore.patientsForList.find(
  //         patient => patient.PatientId === receivedData.PatientId,
  //       );
  //       if (item) {
  //       } else {
  //         let servicesList = [];
  //         receivedData.Services.forEach(item => {
  //           if (typeof item !== 'object') {
  //             servicesList.push(item);
  //           }
  //         });
  //         receivedData.Services = servicesList;
  //         patientStore.addNewPatient(receivedData);
  //       }

  //       // client.destroy(); // kill client after server's response
  //       // this.server.close();
  //     });

  //     client.on('error', error => {
  //       userContext.updateclientSocket(null);
  //       connectionEstabished = false;
  //       startConnectionDiscovery();
  //       console.log('client error ' + error);
  //     });

  //     client.on('close', () => {
  //       console.log('client close');
  //       userContext.updateclientSocket(null);
  //       connectionEstabished = false;
  //       startConnectionDiscovery();
  //     });
  //   } catch (e) {}
  // };

  const toggleDrawer = () => {
    if (!open) {
      setOpen(true);
      drawerRef.current?.openDrawer({speed: 2});
    } else {
      setOpen(false);
      drawerRef.current?.closeDrawer({speed: 2});
    }
  };

  const menuPressed = (sectionIndex: number, itemIndex) => {
    console.log('item.........in press button', itemIndex);
    console.log('item.........in press button', MENU[sectionIndex]);
    const item = MENU[sectionIndex];
    if (item.name == 'Signout') {
      // AsyncStorage.clear();
      _props.navigation.navigate('Landing');
      logout();
    } else if (item.name == "Today's Patients") {
      _props.navigation.navigate('TodaysPatients');
    } else if (item.name == 'Patient Status') {
      _props.navigation.navigate('PatientStatus');
    } else if (item.name == 'Vitals History') {
      _props.navigation.navigate('TodaysPatients');
    } else if (item.name == 'Add Vitals') {
      _props.navigation.navigate('TodaysPatients');
    } else if (item.name == 'Scan QR Code') {
      onShowQrCodeScanner();
      // _props.navigation.navigate('TodaysPatients');
    }
    if (open) toggleDrawer();
  };

  const drawerMenuPressed = item => {
    // fetchData();
    console.log('item.drawer menu........in press button', item);
    // _props.navigation.navigate('Patient')
    if (item.name == 'Signout') {
      logout();
      _props.navigation.navigate('Landing');
    } else if (item.name == "Today's Patients") {
      _props.navigation.navigate('TodaysPatients');
    } else if (item.name == 'Patient Status') {
      _props.navigation.navigate('PatientStatus');
    } else if (item.name == 'Vitals History') {
      _props.navigation.navigate('TodaysPatients');
    } else if (item.name == 'Add Vitals') {
      _props.navigation.navigate('TodaysPatients');
    }
    if (open) toggleDrawer();
  };

  const listItemPressed = item => {
    console.log('item.........in press button', item);
    _props.navigation.navigate(item.key);
    toggleDrawer();
  };
  const scrollToIndexFailed = (info: {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) => {
    listRef.current?.getScrollResponder()?.scrollToEnd();
    timeout.current = setTimeout(
      () =>
        listRef.current?.scrollToLocation({
          animated: true,
          itemIndex: info.index,
          sectionIndex: 0,
        }),
      50,
    );
  };

  useEffect(() => {
    return () => timeout.current && clearTimeout(timeout.current);
  }, []);

  const $drawerInsets = useSafeAreaInsetsStyle(['top']);
  const profilePress = () => {
    // console.log('Profile pressed.......')
  };

  return (
    <DrawerLayout
      ref={drawerRef}
      drawerWidth={Platform.select({
        default: 326,
        web: Dimensions.get('window').width * 0.3,
      })}
      drawerType={'slide'}
      drawerPosition={isRTL ? 'right' : 'left'}
      overlayColor={open ? colors.palette.overlay20 : 'transparent'}
      onDrawerSlide={drawerProgress => {
        progress.value = open ? 1 - drawerProgress : drawerProgress;
      }}
      onDrawerStateChanged={(
        newState: DrawerState,
        drawerWillShow: boolean,
      ) => {
        if (newState === 'Settling') {
          progress.value = withTiming(drawerWillShow ? 1 : 0, {
            duration: 250,
          });
          setOpen(drawerWillShow);
        }
      }}
      renderNavigationView={() => (
        <View style={[$drawer, $drawerInsets]}>
          <View style={$logoContainer}>
            <Image source={logo} style={$logoImage} />
          </View>
          <FlatList<{name: string; useCases: string[]}>
            ref={menuRef}
            contentContainerStyle={$flatListContentContainer}
            // data={Object.values(Homes).map((d) => ({
            //   name: d.name,
            //   useCases: d.data.map((u) => u.props.name),
            // }))}
            data={MENU.map(d => ({
              name: d.name,
              useCases: d.data.map(u => u.props.name),
            }))}
            keyExtractor={item => item.name}
            renderItem={({item, index: sectionIndex}) => (
              <ShowroomListItem {...{item, sectionIndex, menuPressed}} />
            )}
          />
        </View>
      )}>
      <QrCodeScanner
        showQrCodeScanner={showQrCodeScanner}
        onHideQrCodeScanner={onHideQrCodeScanner}
        onSuccess={onQrRead}
      />
      <Header
        LeftActionComponent={
          <DrawerIconButton onPress={toggleDrawer} {...{open, progress}} />
        }
        isHome={true}
        RightActionComponent={<ProfileIconButton onPress={profilePress} />}
      />
      <Screen
        preset="fixed"
        //  safeAreaEdges={["top"]}
        contentContainerStyle={$screenContainer}>
        <Text
          style={{
            paddingHorizontal: '5%',
            color: userContext.clientSocket ? '#0CABF0' : 'black',
          }}>
          {userContext.clientSocket ? 'Connected' : 'Not Connected'}
        </Text>
        <TouchableOpacity onPress={() => userContext.resetConnection()}>
          <Text
            style={{
              paddingHorizontal: '5%',
              color: 'red',
              fontSize: 12,
              alignSelf: 'flex-end',
            }}>
            Reset Connection
          </Text>
        </TouchableOpacity>
        {/* <DrawerIconButton onPress={toggleDrawer} {...{ open, progress }} /> */}
        <FlatList<{name: string; useCases: string[]}>
          ref={menuRef}
          contentContainerStyle={$flatListContentContainer}
          // data={Object.values(Homes).map((d) => ({
          //   name: d.name,
          //   useCases: d.data.map((u) => u.props.name),
          // }))}
          numColumns={2}
          data={MENU.map(d => ({
            name: d.name,
            useCases: d.data.map(u => u.props.name),
          }))}
          keyExtractor={item => item.name}
          renderItem={({item, index: sectionIndex}) => (
            <>
              {item.name !== 'Scan QR Code' && (
                <MenuButtonListItem
                  {...{item, sectionIndex, menuPressed, drawerMenuPressed}}
                />
              )}
            </>
          )}
        />
        {/* <SectionList
            ref={listRef}
            contentContainerStyle={$sectionListContentContainer}
            stickySectionHeadersEnabled={false}
            sections={Object.values(Homes)}
            renderItem={({ item }) => item}
            renderSectionFooter={() => <View style={$homeUseCasesSpacer} />}
            ListHeaderComponent={
              <View style={$heading}>
                <Text preset="heading" tx="HomeScreen.jumpStart" />
              </View>
            }
            onScrollToIndexFailed={scrollToIndexFailed}
            renderSectionHeader={({ section }) => {
              return (
                <View>
                  <Text preset="heading" style={$homeItemName}>
                    {section.name}
                  </Text>
                  <Text style={$homeItemDescription}>{section.description}</Text>
                </View>
              )
            }}
          /> */}
      </Screen>
    </DrawerLayout>
  );
};

const $screenContainer: ViewStyle = {
  flex: 1,
};

const $drawer: ViewStyle = {
  backgroundColor: colors.background,
  flex: 1,
};

const $flatListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.lg,
};

const $sectionListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.lg,
};

const $heading: ViewStyle = {
  marginBottom: spacing.xxxl,
};

const $logoImage: ImageStyle = {
  height: 42,
  width: 177,
};

const $logoContainer: ViewStyle = {
  alignSelf: 'flex-start',
  justifyContent: 'center',
  height: 56,
  paddingHorizontal: spacing.lg,
};

const $menuContainer: ViewStyle = {
  paddingBottom: spacing.xs,
  paddingTop: spacing.lg,
};

const $menuButtonContainer: ViewStyle = {
  flex: 1,
  margin: spacing.md,
  borderRadius: 5,
  elevation: 8,
  backgroundColor: colors.background,
  alignItems: 'center',
  justifyContent: 'center',
  padding: spacing.lg,
  width: '40%',
  minHeight: 150,
};

const $homeItemName: TextStyle = {
  fontSize: 24,
  marginBottom: spacing.md,
};

const $homeItemDescription: TextStyle = {
  marginBottom: spacing.xxl,
};

const $homeUseCasesSpacer: ViewStyle = {
  paddingBottom: spacing.xxl,
};

// @home remove-file
