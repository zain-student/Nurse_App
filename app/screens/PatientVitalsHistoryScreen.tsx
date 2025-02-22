import React, {FC, useState} from 'react';
import {
  TouchableOpacity,
  Image,
  ImageStyle,
  TextStyle,
  View,
  ViewStyle,
  FlatList,
} from 'react-native';
import {
  Header,
  Button,
  ListItem,
  Screen,
  Text,
  Profile,
  Icon,
} from '../components';
import {HomeTabScreenProps} from '../navigators/HomeNavigator';
import {PatientStackScreenProps} from 'app/navigators';
import {spacing, colors} from '../theme';
import {openLinkInBrowser} from '../utils/openLinkInBrowser';
import {isRTL} from '../i18n';
import {useStores} from 'app/models';
import {ageCalculator, calculateFullAge} from 'app/models/helpers/dateHelpers';
import {formatDate} from 'app/utils/formatDate';
import {ProfileIconButton} from './HomeScreen/ProfileIconButton';
import {HeaderBackButton} from './HomeScreen/HeaderBackButton';
import moment from 'moment';

const chainReactLogo = require('../../assets/images/cr-logo.png');
const reactNativeLiveLogo = require('../../assets/images/rnl-logo.png');
const reactNativeRadioLogo = require('../../assets/images/rnr-logo.png');
const reactNativeNewsletterLogo = require('../../assets/images/rnn-logo.png');

const PATIENTS = [
  {
    patientId: 1,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
  },
  {
    patientId: 2,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
  },
  {
    patientId: 3,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
  },
  {
    patientId: 4,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
  },
  {
    patientId: 5,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
  },
  {
    patientId: 6,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
  },
  {
    patientId: 7,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
  },
  {
    patientId: 8,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
  },
  {
    patientId: 9,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
  },
  {
    patientId: 10,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
  },
];

export const PatientVitalsHistoryScreen: FC<
  PatientStackScreenProps<'PatientVitalsHistory'>
> = function PatientVitalsHistoryScreen(_props) {
  const [patient, setPatient] = useState('');
  const {navigation} = _props;
  const {patientStore, vitalStore, fieldStore, authenticationStore} =
    useStores();
  const {
    patientQueue,
    patientQueueForList,
    patientsForList,
    getSelectedPatient,
  } = patientStore;
  const [currentPatient, setCurrentPatient] = useState(getSelectedPatient());
  const [user, setUser] = useState(authenticationStore.login);
  function onItemPress(item: any) {
    console.log('-=-=-=-=-=-=-=', item);
    // patientStore.selectAPatient(item)
    // navigation.navigate('Patient')
  }

  const VitalsHistoryItem = ({title}) => (
    <TouchableOpacity
      onPress={() => onVitalHistoryPress(title)}
      style={$patientItemView}>
      {console.log('-=-=-=-=-=-=-=-', Object.keys(title))}

      <View
        style={[
          $patientItemTitleView,
          {flexDirection: 'row', justifyContent: 'space-between'},
        ]}>
        <Text testID="login-heading" preset="bold" style={$patientTitleText}>
          {currentPatient[0].VitalsTime
            ? moment(currentPatient[0].VitalsTime)
              ? moment(currentPatient[0].VitalsTime).format(
                  'YYYY-MM-DD hh:mm a',
                )
              : currentPatient[0].VitalsTime
            : ''}
        </Text>
        <Icon icon="new_icon" size={30} />
      </View>
      {currentPatient[0].NurseName && (
        <View
          style={[
            $patientItemGrayViewStyle,
            // {padding: spacing.xs}
          ]}>
          <Text
            testID="login-heading"
            preset="bold"
            style={$grayBackgroundText}>
            {'Taken by: '}
            {currentPatient[0].NurseName}
          </Text>
        </View>
      )}
      {Object.keys(title).map(item => {
        if (title[item]) {
          return (
            <View style={[$patientItemDetailView, {padding: spacing.sm}]}>
              {console.log('-=-=-=-=-=-=-=  item', item)}
              {console.log('-=-=-=-=-=-=-=  item2', title[item])}
              <Text testID="login-heading" preset="bold" style={$patientsText}>
                {item}
              </Text>
              <Text testID="login-heading" preset="bold" style={$patientsText}>
                {title[item] ? title[item] : ''}
              </Text>
            </View>
          );
        } else return null;
      })}
    </TouchableOpacity>
  );

  const PatientItem = ({title}) => (
    <TouchableOpacity
      // onPress={()=>onItemPress(title)}
      style={$patientItemView}>
      <View style={$patientItemTitleView}>
        <Text testID="login-heading" preset="bold" style={$patientTitleText}>
          {title.EnteredOn ? formatDate(title.EnteredOn) : ' '}
        </Text>
      </View>
      <View
        style={[
          $patientItemGrayViewStyle,
          // {padding: spacing.xs}
        ]}>
        <Text testID="login-heading" preset="bold" style={$grayBackgroundText}>
          {'Taken by: ' + title.NurseName}
        </Text>
      </View>
      <View style={[$patientItemDetailView, {padding: spacing.sm}]}>
        <Text testID="login-heading" preset="bold" style={$patientsText}>
          {title.Name}
        </Text>
        <Text testID="login-heading" preset="bold" style={$patientsText}>
          {title.Readings + ' ' + title.Unit}
        </Text>
      </View>
    </TouchableOpacity>
  );

  function patientItemPress(title: React.SetStateAction<string>) {
    console.log('-=-=-=-=-=-=-=-=-', title);
    console.log('-=-=-=-=-=-=-=-=-', patient);
    setPatient(title);
  }

  function addNewPress() {
    // fieldStore.fetchFields()
    navigation.navigate('AddNewVitals');
  }

  function onVitalHistoryPress() {
    // fieldStore.fetchFields()
    navigation.navigate('EditVitals');
  }

  const profilePress = () => {
    // console.log('Profile pressed.......')
  };

  return (
    <>
      {/* {console.log("inside patient queue screen....", patientQueueForList())}
        {console.log("inside patient queue screen....", patientStore.patientsForList)} */}
      {console.log(
        '..........User...',
        user.length > 0 ? user[0].FullName : '',
      )}
      <Header
        LeftActionComponent={
          <HeaderBackButton
            {...{
              title: 'vitalsHistoryScreen.vitalsHistoryScreen',
              navigation: navigation,
            }}
          />
        }
        RightActionComponent={<ProfileIconButton onPress={profilePress} />}
      />
      <Screen
        preset="fixed"
        contentContainerStyle={$container}
        // safeAreaEdges={["top"]}
      >
        <Profile />
        {/* <Text preset="heading" tx="vitalsHistoryScreen.vitalsHistoryScreen" style={$title} /> */}
        <View style={$patientsListView}>
          {/* <FlatList
            data={vitalStore.vitalsForList}
            style={{flex: 1}}
            extraData={vitalStore.vitalsForList}
            renderItem={({item}) => <PatientItem title={item} />}
            keyExtractor={item => item.PatientId}
          /> */}
          {currentPatient.length > 0 &&
          currentPatient[0].Vitals &&
          currentPatient[0].Vitals.length > 0 ? (
            <FlatList
              data={currentPatient[0].Vitals}
              style={{flex: 1}}
              extraData={currentPatient[0].Vitals}
              renderItem={({item}) => <VitalsHistoryItem title={item} />}
              // keyExtractor={item => item.PatientId}
            />
          ) : null}
        </View>
        <View style={$buttonsView}>
          <Button
            testID="login-button"
            tx={'vitalsHistoryScreen.addNewVitals'}
            style={[$tapButton, {backgroundColor: colors.themeText}]}
            preset="reversed"
            onPress={addNewPress}
          />
        </View>
      </Screen>
    </>
  );
};

const $container: ViewStyle = {
  // paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
  flex: 1,
};

const $title: TextStyle = {
  flex: 0.5,
  marginBottom: spacing.sm,
};

const $patientsListView: ViewStyle = {
  flex: 6,
  // borderWidth: 1,
  width: '100%',
  alignSelf: 'center',
  // marginVertical: spacing.sm,
};

const $patientsText: TextStyle = {
  // padding: spacing.sm,
};

const $grayBackgroundText: TextStyle = {
  flex: 1,
  borderRadius: 5,
  width: '100%',
  backgroundColor: colors.themeLightGray,
  textAlignVertical: 'center',
  margin: spacing.xs,
  paddingStart: spacing.xs,
};

const $buttonsView: ViewStyle = {
  flex: 1,
  width: '100%',
  marginBottom: 60,
};

const $tapButton: ViewStyle = {
  flex: 1,
  margin: spacing.md,
};

const $patientItemView: ViewStyle = {
  elevation: 8,
  marginVertical: spacing.md,
  backgroundColor: colors.background,
  borderRadius: 10,
  // flex: 2,
  // elevation: 10,
  // borderWidth: 1,
  // margin: spacing.md,
  // backgroundColor: colors.background,
  // borderRadius: 20,
  // padding: '4%',
  // paddingVertical: '6%',
  // borderColor: colors.palette.accent500
};

const $patientItemTitleView: ViewStyle = {
  flex: 1,
  // backgroundColor: colors.themeColorLight,
  borderTopRightRadius: 6,
  borderTopLeftRadius: 6,
  padding: spacing.sm,
  borderWidth: 0.25,
  elevation: 0,
};

const $patientTitleText: TextStyle = {
  // paddingHorizontal: spacing.sm
};

const $serviceItem: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  backgroundColor: colors.palette.accent200,
  margin: '2%',
  paddingHorizontal: '4%',
  borderRadius: 5,
};

const $patientItemDetailView: ViewStyle = {
  height: 50,
  backgroundColor: colors.background,
  // borderBottomRightRadius: 6,
  borderWidth: 0.25,
  // borderBottomLeftRadius: 6,
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: spacing.sm,
  alignItems: 'center',
};

const $patientItemGrayViewStyle: ViewStyle = {
  height: 50,
  backgroundColor: colors.background,
  // borderBottomRightRadius: 6,
  borderWidth: 0.25,
  // borderBottomLeftRadius: 6,
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: spacing.xxxs,
  // alignItems: 'center'
};

// @home remove-file
