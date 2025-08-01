import React, {FC, useState, useEffect, useContext} from 'react';
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
  TextField,
  Button,
  ListItem,
  Screen,
  Text,
  Profile,
} from '../components';
import {HomeTabScreenProps} from '../navigators/HomeNavigator';
import {PatientStackScreenProps} from 'app/navigators';
import {spacing, colors} from '../theme';
import {openLinkInBrowser} from '../utils/openLinkInBrowser';
import {isRTL} from '../i18n';
import {useStores} from 'app/models';
import {ageCalculator, calculateFullAge} from 'app/models/helpers/dateHelpers';
import {formatDate} from 'app/utils/formatDate';
import {ScrollView} from 'react-native-gesture-handler';
import {format} from 'date-fns';
import {HeaderBackButton} from './HomeScreen/HeaderBackButton';
import {ProfileIconButton} from './HomeScreen/ProfileIconButton';
import moment from 'moment';
import {UserContext} from 'app/utils/UserContext';

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

export const EditVitalsScreen: FC<PatientStackScreenProps<'EditVitals'>> =
  function EditVitalsScreen(_props) {
    const [patient, setPatient] = useState('');
    const {navigation} = _props;
    const {patientStore, vitalStore, fieldStore, authenticationStore} =
      useStores();
    const {getSelectedPatient} = patientStore;
    const [currentPatient, setCurrentPatient] = useState(getSelectedPatient());
    const [vitals, setVitals] = useState(currentPatient[0].Vitals[0]);

    const [fields, setFields] = useState(fieldStore.fieldsForList);
    const [values, setValues] = useState({...vitals});
    const [nursingNote, setNursingNote] = useState(
      currentPatient[0].NursingNote,
    );
    const userContext = useContext(UserContext);

    // useEffect(() => {
    //   console.log("vitals.....vitals...", vitals)
    //   console.log("Values.........", values)
    //   const valObj = values
    //   const keys = Object.keys(vitals)
    //   console.log("keys.........", keys)
    //   for (let i = 0; i < keys.length; i++) {
    //     valObj[keys[i]] = vitals[keys[i]]
    //   }
    //   console.log("final object.....", valObj)
    //   setValues(valObj)
    //   console.log("values......", values)
    // }, [])

    // useEffect(() => {
    //   const valObj = values
    //   const keys = Object.keys(vitals)

    //   for (let i = 0; i < keys.length; i++) {
    //     valObj[keys[i]] = vitals[keys[i]]
    //   }

    //   setValues(valObj)
    // }, [])

    // useEffect(() => {
    //   const newValues = { ...values }
    //   const keys = Object.keys(vitals)

    //   for (let i = 0; i < keys.length; i++) {
    //     newValues[keys[i]] = vitals[keys[i]]
    //   }

    //   setValues(newValues)
    // }, [values])

    // simulate a longer refresh, if the refresh is too fast for UX
    async function manualRefresh() {
      setRefreshing(true);
      await Promise.all([siteStore.fetchSites(), delay(750)]);
      setRefreshing(false);
    }

    function onItemPress(item: any) {
      console.log('-=-=-=-=-=-=-=', item);
      // patientStore.selectAPatient(item)
      // navigation.navigate('Patient')
    }

    const PatientItem = ({title}) => (
      <TouchableOpacity
        // onPress={()=>onItemPress(title)}
        style={$patientItemView}>
        <View style={$patientItemTitleView}>
          <Text testID="login-heading" preset="bold" style={$patientTitleText}>
            {title.Name ? title.Name : ' '}
          </Text>
        </View>
        <Text
          testID="login-heading"
          preset="bold"
          style={[$patientsText, {color: colors.palette.primary600}]}>
          {'Reading: '}
          {title.Reading ? title.Reading + ' ' + title.Unit : ''}
        </Text>
        <Text
          testID="login-heading"
          preset="bold"
          style={[$patientsText, {color: colors.palette.primary600}]}>
          {'Reading By: '}
          {title.NurseName ? title.NurseName : ''}
        </Text>
        <Text
          testID="login-heading"
          preset="bold"
          style={[$patientsText, {color: colors.palette.primary600}]}>
          {'Reading On: '}
          {title.Date ? formatDate(title.Date) : ''}
        </Text>
        <Text
          testID="login-heading"
          preset="bold"
          style={[$patientsText, {color: colors.palette.primary600}]}>
          {'Reading Time: '}
          {title.Time ? title.Time : ''}
        </Text>
        {/* <Text testID="login-heading" 
          preset="bold" 
          style={$patientsText}
          >
          {
          // title.MRNNo + ' | ' +
           title.Gender + ' | ' + calculateFullAge(title.DOB)}
        </Text> */}
      </TouchableOpacity>
    );

    function patientItemPress(title: React.SetStateAction<string>) {
      console.log('-=-=-=-=-=-=-=-=-', title);
      console.log('-=-=-=-=-=-=-=-=-', patient);
      setPatient(title);
    }

    function savePressed() {
      console.log('Vitals list.....', values);
      console.log('Vitals list.....', nursingNote);

      patientStore.addVitals(values);
      patientStore.addNursingNote(nursingNote);
      const currentDateTime = moment().toISOString();

      patientStore.addVitalsTimeTime(currentDateTime);
      patientStore.addNurseName(
        authenticationStore.login
          ? authenticationStore.login[0]?.FullName
            ? authenticationStore.login[0]?.FullName
            : ''
          : '',
      );
      transferDataToReceptionist(currentDateTime);
      // console.log('-=-=-==--=-=-=-=-', patientStore.getSelectedPatient())
      patientStore.getSelectedPatient.length > 0 &&
        patientStore.deselectPatient(patientStore.getSelectedPatient[0]);

      navigation.navigate('Home');
    }

    const transferDataToReceptionist = (_currentDateTime: string) => {
      try {
        let tempPatient = JSON.parse(
          JSON.stringify(patientStore.getSelectedPatient()[0]),
        );
        var array = [];
        array.push(values);
        tempPatient.Vitals = array;
        tempPatient.NursingNote = nursingNote;
        tempPatient.VitalsTime = _currentDateTime;
        tempPatient.status = 'Vitals';
        tempPatient.isUserAdded = tempPatient.isUserAdded ?? false;

        tempPatient.nurseName = authenticationStore.login
          ? authenticationStore.login[0]?.FullName
            ? authenticationStore.login[0]?.FullName
            : ''
          : '';
        // ✅ Only apply fallback defaults for API patients
        if (!tempPatient.isUserAdded) {
          try {
            tempPatient.FirstName = tempPatient.FirstName || '';
            tempPatient.LastName = tempPatient.LastName || '';
            tempPatient.Gender = tempPatient.Gender || '';
            tempPatient.MRN ||= '';
            // tempPatient.Medications = tempPatient.Medications || [];
            // tempPatient.Services = tempPatient.Services || [];
            tempPatient.Medications = Array.isArray(tempPatient.Medications)
              ? tempPatient.Medications
              : [];
            tempPatient.Services = Array.isArray(tempPatient.Services)
              ? tempPatient.Services
              : [];
            tempPatient.NursingNote = tempPatient.NursingNote || '';
            tempPatient.CheckInSynced = tempPatient.CheckInSynced || false;
            tempPatient.Address = tempPatient.Address || '';
            tempPatient.City = tempPatient.City || '';
            tempPatient.Province = tempPatient.Province || '';
            tempPatient.Country = tempPatient.Country || 'Pakistan';
            tempPatient.CNIC = tempPatient.CNIC || '';
            tempPatient.CellPhoneNumber = tempPatient.CellPhoneNumber || '';
            tempPatient.SiteName = tempPatient.SiteName || '';
            tempPatient.MartialStatus = tempPatient.MartialStatus || '';
            tempPatient.SpouseName = tempPatient.SpouseName || '';
            // tempPatient.ZakatEligible = tempPatient.ZakatEligible || false;
            tempPatient.ZakatEligible =
              typeof tempPatient.ZakatEligible === 'boolean'
                ? tempPatient.ZakatEligible
                : false;
          } catch (e) {
            ToastAndroid.show(
              'Patient data incomplete. Some defaults skipped.',
              ToastAndroid.SHORT,
            );
          }
        }
        if (global.successResponses) {
          let sIndexToFind = global.successResponses.findIndex(
            itm => itm === tempPatient.PatientId,
          );
          if (sIndexToFind !== -1) {
            global.successResponses.splice(sIndexToFind, 1);
          }
        }
        console.warn('userContext.clientSocket', userContext.clientSocket);
        if (userContext.clientSocket) {
          userContext.clientSocket.write(
            JSON.stringify({sender: 'nurse', payload: tempPatient}),
          );
        } else {
          // global.dataToTransfer = JSON.stringify({
          //   sender: 'nurse',
          //   payload: tempPatient,
          // });
        }
      } catch (e) {}
    };

    function advanceSearchPress() {
      navigation.navigate('Patient');
    }

    const updateValues = (field, newValue) => {
      const newValues = {...values};
      newValues[field] = newValue;
      console.log('newValue.....', newValue);
      console.log('New Values...', newValues);
      setValues(newValues);
    };

    const profilePress = () => {
      // console.log('Profile pressed.......')
    };

    return (
      <>
        {/* {console.log('inside patient queue screen....', patientQueueForList())} */}
        {console.log('Vitals............', vitals)}
        <Header
          LeftActionComponent={
            <HeaderBackButton
              {...{
                title: 'editVitalsScreen.editVitals',
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
          <ScrollView style={$patientsListView}>
            {fieldStore.fieldsForList.map(item => {
              return (
                <View style={$fieldRowView}>
                  {console.log(
                    'itemmmmmm',
                    item.Name + ': ' + values[item.Name],
                  )}

                  <TextField
                    value={
                      item.Name === 'Height' && values.hasOwnProperty('Height')
                        ? values['Height']
                          ? String(
                              Math.round(parseFloat(values['Height']) * 30.48),
                            ) // feet → rounded cm
                          : ''
                        : values[item.Name] ?? ''
                    }
                    onChangeText={text => {
                      const obj = {...values};

                      if (item.Name === 'Height') {
                        const cmValue = parseFloat(text);
                        const feetValue = !isNaN(cmValue)
                          ? (cmValue / 30.48).toFixed(2)
                          : '';
                        obj['Height'] = feetValue;
                      } else if (item.Name === 'Weight') {
                        obj['Weight'] = text;
                      } else {
                        obj[item.Name] = text;
                      }

                      // --- BMI Calculation ---
                      const heightFeet = parseFloat(obj['Height']);
                      const weightKg = parseFloat(obj['Weight']);

                      if (!isNaN(heightFeet) && !isNaN(weightKg)) {
                        const heightMeters = heightFeet * 0.3048;
                        const bmi = weightKg / (heightMeters * heightMeters);
                        obj['BMI'] = bmi.toFixed(2);

                        // Classification
                        let status = '';
                        if (bmi < 18.5) status = 'Underweight';
                        else if (bmi < 25) status = 'Normal';
                        else if (bmi < 30) status = 'Overweight';
                        else status = 'Above Obese';

                        obj['BMI Status'] = status;
                      } else {
                        obj['BMI'] = '';
                        obj['BMI Status'] = '';
                      }

                      setValues(obj);
                      console.log('Updated values:', obj);
                    }}
                    inputWrapperStyle={{
                      backgroundColor: colors.inputBackground,
                    }}
                    containerStyle={$textField}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="numeric"
                    labelTx={item.Name}
                    placeholderTx={item.Name}
                  />

                  <Text
                    preset="formLabel"
                    style={{marginStart: '2%', marginTop: spacing.sm}}>
                    {item.Name === 'Height' ? 'CM' : item.Unit}
                  </Text>
                </View>
              );
            })}

            {/* <FlatList
            data={vitalStore.vitalsForList}
            // style={$patientsListView}
            extraData={vitalStore.vitalsForList}
            renderItem={({item}) => <PatientItem title={item} />}
            keyExtractor={item => item.PatientId}
          /> */}
            <View style={$fieldRowView}>
              <TextField
                multiline={true}
                value={nursingNote}
                onChangeText={setNursingNote}
                inputWrapperStyle={{backgroundColor: colors.inputBackground}}
                containerStyle={$noteTextField}
                autoCapitalize="none"
                // autoComplete="email"
                autoCorrect={false}
                // keyboardType="numeric"
                labelTx={'NursingNote'}
                placeholderTx={'NursingNote'}
                // onSubmitEditing={() => authPasswordInput.current?.focus()}
              />
            </View>
          </ScrollView>
          <View style={$buttonsView}>
            <Button
              testID="login-button"
              tx={'Save'}
              style={[$tapButton, {backgroundColor: colors.themeText}]}
              preset="reversed"
              onPress={savePressed}
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
  // flex: 1,
  // borderWidth: 1,
  width: '100%',
  alignSelf: 'center',
  marginVertical: spacing.sm,
  borderRadius: 10,
  elevation: 5,
  backgroundColor: colors.background,
  paddingTop: spacing.sm,
  paddingBottom: spacing.lg,
};

const $patientsText: TextStyle = {
  // padding: spacing.sm,
};

const $buttonsView: ViewStyle = {
  width: '100%',
  marginBottom: 60,
};

const $tapButton: ViewStyle = {
  flex: 1,
  margin: spacing.md,
};

const $patientItemView: ViewStyle = {
  flex: 2,
  elevation: 10,
  borderWidth: 1,
  margin: spacing.md,
  backgroundColor: colors.background,
  borderRadius: 20,
  padding: '4%',
  paddingVertical: '6%',
  borderColor: colors.palette.accent500,
};

const $patientItemTitleView: ViewStyle = {
  // borderWidth: 0.5,
  position: 'absolute',
  backgroundColor: colors.palette.accent500,
  top: -spacing.sm,
  start: spacing.sm,
  borderRadius: 25,
  paddingHorizontal: spacing.sm,
  alignItems: 'center',
  justifyContent: 'center',
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

const $textField: ViewStyle = {
  marginBottom: spacing.sm,
  width: '60%',
};

const $noteTextField: ViewStyle = {
  marginBottom: 80,
  width: '90%',
  height: 100,
};

const $fieldRowView: ViewStyle = {
  flexDirection: 'row',
  // width: '100%',
  marginStart: '4%',
  // justifyContent: 'space-around',
  alignItems: 'center',
};

// @home remove-file
