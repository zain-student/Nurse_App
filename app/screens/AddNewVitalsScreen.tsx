import React, {FC, useContext, useState} from 'react';
import {
  TouchableOpacity,
  Image,
  ImageStyle,
  TextStyle,
  View,
  ViewStyle,
  FlatList,
  ToastAndroid,
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
import {UserContext} from 'app/utils/UserContext';
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

export const AddNewVitalsScreen: FC<PatientStackScreenProps<'AddNewVitals'>> =
  function AddNewVitalsScreen(_props) {
    const [patient, setPatient] = useState('');
    const {navigation} = _props;
    const {patientStore, vitalStore, fieldStore, authenticationStore} =
      useStores();
    const {patientQueue, patientQueueForList, patientsForList} = patientStore;
    const [fields, setFields] = useState(fieldStore.fieldsForList);
    const [values, setValues] = useState({});
    const [nursingNote, setNursingNote] = useState('');
    const userContext = useContext(UserContext);

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
      //............................
      const selectedPatient = patientStore.getSelectedPatient()[0];
      if (!selectedPatient) {
        console.warn('No patient selected!');
        return;
      }
      console.log('hhhh'); //.....................
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
      transferDataToReceptionist(currentDateTime, selectedPatient); // ............
      // transferDataToReceptionist(currentDateTime);
      // console.log('-=-=-==--=-=-=-=-', patientStore.getSelectedPatient())
      patientStore.getSelectedPatient().length > 0 &&
        patientStore.deselectPatient(patientStore.getSelectedPatient()[0]);
      // it will reset the values to clear the fields when user save the vitals
      setValues({});
      navigation.navigate('Home');
    }

    const transferDataToReceptionist = (
      _currentDateTime: string,
      selectedPatient,
    ) => {
      //... added selected patient
      try {
        let tempPatient = JSON.parse(
          JSON.stringify(selectedPatient), //..........................
          // JSON.stringify(patientStore.getSelectedPatient()[0]),
        );
        tempPatient.MRN = selectedPatient.MRN || tempPatient.MRN || '';  // ...........................
        var array = [];
        array.push(values);
        tempPatient.Vitals = array;
        tempPatient.NursingNote = nursingNote;
        tempPatient.VitalsTime = _currentDateTime;
        tempPatient.status = 'Vitals';

        tempPatient.nurseName = authenticationStore.login
          ? authenticationStore.login[0]?.FullName
            ? authenticationStore.login[0]?.FullName
            : ''
          : '';

        tempPatient.NurseEnteredBy = {
          UserId: authenticationStore.login
            ? authenticationStore.login[0]?.UserId
            : '',
          FullName: authenticationStore.login
            ? authenticationStore.login[0]?.FullName
            : '',
        };
// ✅ Only apply fallback defaults for API patients
if (!tempPatient.isUserAdded) {
  try{
  tempPatient.FirstName = tempPatient.FirstName || '';
  tempPatient.LastName = tempPatient.LastName || '';
  tempPatient.Gender = tempPatient.Gender || '';
  tempPatient.MRN = selectedPatient.MRN || tempPatient.MRN || '';
  // tempPatient.Medications = tempPatient.Medications || [];
  // tempPatient.Services = tempPatient.Services || [];
  tempPatient.Medications = Array.isArray(tempPatient.Medications) ? tempPatient.Medications : [];
  tempPatient.Services = Array.isArray(tempPatient.Services) ? tempPatient.Services : [];
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
  tempPatient.ZakatEligible = typeof tempPatient.ZakatEligible === 'boolean' ? tempPatient.ZakatEligible : false;
}
  catch (e) {
    ToastAndroid.show('Patient data incomplete. Some defaults skipped.', ToastAndroid.SHORT);
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
        console.warn('Sending patient data to doctor:', tempPatient); //....................
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
      } catch (e) {
        console.error('Error while sending patient data to doctor:', e);
      }
    };

    function advanceSearchPress() {
      navigation.navigate('Patient');
    }
    const profilePress = () => {
      // console.log('Profile pressed.......')
    };

    return (
      <>
        {/* {console.log('inside patient queue screen....', patientQueueForList())} */}
        {console.log(
          'inside patient queue screen....',
          fieldStore.fieldsForList,
        )}
        <Header
          LeftActionComponent={
            <HeaderBackButton
              {...{
                title: 'addNewVitalsScreen.addNewVitals',
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
                <View style={$fieldRowView} key={item.Name}>
                  <TextField
                    value={
                      item.Name === 'Height'
                        ? values.hasOwnProperty(item.Name) && values[item.Name]
                          ? parseFloat(values[item.Name]) * 30.48 // feet → cm
                          : ''
                        : values.hasOwnProperty(item.Name) && values[item.Name]
                        ? values[item.Name]
                        : ''
                    }
                    onChangeText={text => {
                      var obj = {...values}; // spread to avoid mutation
                      if (item.Name === 'Height') {
                        const cmValue = parseFloat(text); // cm → feet
                        const feetValue = isNaN(cmValue)
                          ? ''
                          : (cmValue / 30.48).toFixed(2);
                        // obj[item.Name] = feetValue;
                        obj[item.Name] = isNaN(cmValue)
                          ? ''
                          : String((cmValue / 30.48).toFixed(2));
                        // console.log('Value entered in CM:', cmValue); // it will log the entered cm value
                      } else if (item.Name === 'Weight') {
                        //....
                        obj[item.Name] = text;
                      } else {
                        obj[item.Name] = text;
                      }
                      //BMI Calculation Logic
                      // checks if both the values exist or not
                      const heightFeet = parseFloat(obj['Height']);
                      const weightKg = parseFloat(obj['Weight']);

                      if (!isNaN(heightFeet) && !isNaN(weightKg)) {
                        const heightMeters = heightFeet * 0.3048; // Converting value from feet to meters
                        const bmi = weightKg / (heightMeters * heightMeters); // Formula to calculate BMI
                        obj['BMI'] = bmi.toFixed(2); // Storing BMI value in the object
                        // console.log('BMI:', bmi); // it will log the calculated BMI value
                        // console.log('Height in meters:', heightMeters); // it will log the converted height value
                        // console.log('Weight in kg:', weightKg); // it will log the entered weight value

                        // BMI Classification
                        let status = '';
                        if (bmi < 18.5) status = 'Underweight';
                        else if (bmi < 25) status = 'Normal';
                        else if (bmi < 30) status = 'Overweight';
                        else status = 'Above Obese';

                        obj['BMI Status'] = status; // passing BMI status to the object
                      } else {
                        obj['BMI'] = '';
                        obj['BMI Status'] = '';
                      }

                      setValues(obj);
                      console.log('logging. array....', obj);
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
                    // onSubmitEditing={() => authPasswordInput.current?.focus()
                  />

                  <Text
                    preset="formLabel"
                    style={{marginStart: '2%', marginTop: spacing.sm}}>
                    {/* {item.Unit} */}
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
