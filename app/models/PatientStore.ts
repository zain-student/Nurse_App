import {Instance, SnapshotOut, types} from 'mobx-state-tree';
import {api} from '../services/api';
import { ToastAndroid } from 'react-native';
import {Patient, PatientModel} from './Patient';
import {Service, ServiceModel} from './Service';
import {withSetPropAction} from './helpers/withSetPropAction';
import moment from 'moment';
import {mmkvStorage} from '../navigators/AppNavigator';
const PATIENTS = [
  {
    PatientId: 100033,
    FirstName: 'Muhammad Ali',
    LastName: 'Ali Muhammad',
    MRNNo: '01-01-0100033',
    DOB: '1/1/2005 12:00:00 AM',
    CNIC: '41406-0270901-3',
    CellPhoneNumber: '03212055079',
    Gender: 'Male',
    SiteName: 'Gharo',
    MartialStatus: 'Single',
    SpouseName: 'Ali Muhammad',
    ZakatEligible: false,
    Country: 'Pakistan',
    City: 'Thatta',
    Province: 'Sindh',
    Address: 'Jam baranch',
    EnteredOn: '2023-10-16T18:39:17.75',
    Services: [
      {
        ServiceId: 30013,
        ServiceName: 'Consultation',
        Charges: '40',
      },
    ],
    Status: 'CheckIn',
    CheckInTime: moment('2023-10-16').toISOString(),
    VitalsTime: null,
    PrescriptionTime: null,
    PharmacyTime: null,
    CheckoutTime: null,

    CheckInSynced: false,
  },
  {
    PatientId: 100032,
    FirstName: 'Akbari Naz',
    LastName: 'Zahid',
    MRNNo: '01-01-0100032',
    DOB: '10/1/1985 12:00:00 AM',
    CNIC: '41406-9577288-8',
    CellPhoneNumber: '03133751890',
    Gender: 'Female',
    SiteName: 'Gharo',
    MartialStatus: 'Married',
    SpouseName: 'Zahid',
    ZakatEligible: false,
    Country: 'Pakistan',
    City: 'Thatta',
    Province: 'Sindh',
    Address: 'Eid Ghah Mohallah',
    EnteredOn: '2023-10-16T16:37:45.11',
    Services: [
      {
        ServiceId: 30013,
        ServiceName: 'Consultation',
        Charges: '40',
      },
    ],
    Status: 'CheckIn',

    CheckInTime: moment('2023-10-16').toISOString(),
    VitalsTime: null,
    PrescriptionTime: null,
    PharmacyTime: null,
    CheckoutTime: null,

    CheckInSynced: false,
  },
  {
    PatientId: 100031,
    FirstName: 'Zahid',
    LastName: 'Shahid',
    MRNNo: '01-01-0100031',
    DOB: '1/1/1980 12:00:00 AM',
    CNIC: '41406-9577288-8',
    CellPhoneNumber: '03133751890',
    Gender: 'Male',
    SiteName: 'Gharo',
    MartialStatus: 'Married',
    SpouseName: 'Shahid',
    ZakatEligible: false,
    Country: 'Pakistan',
    City: 'Thatta',
    Province: 'Sindh',
    Address: 'Eid Ghah Mohallah',
    EnteredOn: '2023-10-16T16:35:43.607',
    Services: [
      {
        ServiceId: 30013,
        ServiceName: 'Consultation',
        Charges: '40',
      },
    ],
    Status: 'CheckIn',

    CheckInTime: moment('2023-10-16').toISOString(),
    VitalsTime: null,
    PrescriptionTime: null,
    PharmacyTime: null,
    CheckoutTime: null,

    CheckInSynced: false,
  },
];

const PATIENTS_SELECTED = [
  {
    PatientId: 100033,
    FirstName: 'Muhammad Ali',
    LastName: 'Ali Muhammad ',
    MRNNo: '01-01-0100033',
    DOB: '1/1/2005 12:00:00 AM',
    CNIC: '41406-0270901-3',
    CellPhoneNumber: '03212055079',
    Gender: 'Male',
    SiteName: 'Gharo',
    MartialStatus: 'Single',
    SpouseName: 'Ali Muhammad',
    ZakatEligible: false,
    Country: 'Pakistan',
    City: 'Thatta',
    Province: 'Sindh',
    Address: 'Jam baranch',
    EnteredOn: '2023-10-16T18:39:17.75',
    Services: [
      {
        ServiceId: 30013,
        ServiceName: 'OPD Charges',
        Charges: '40',
      },
    ],
    Status: 'CheckIn',
    CheckInSynced: false,
    Vitals: [],
  },
  {
    PatientId: 100032,
    FirstName: 'Akbari Naz',
    LastName: 'Zahid',
    MRNNo: '01-01-0100032',
    DOB: '10/1/1985 12:00:00 AM',
    CNIC: '41406-9577288-8',
    CellPhoneNumber: '03133751890',
    Gender: 'Female',
    SiteName: 'Gharo',
    MartialStatus: 'Married',
    SpouseName: 'Zahid',
    ZakatEligible: false,
    Country: 'Pakistan',
    City: 'Thatta',
    Province: 'Sindh',
    Address: 'Eid Ghah Mohallah',
    EnteredOn: '2023-10-16T16:37:45.11',
    Services: [
      {
        ServiceId: 30013,
        ServiceName: 'OPD Charges',
        Charges: '40',
      },
    ],
    Status: 'CheckIn',
    CheckInSynced: false,
    Vitals: [],
  },
  {
    PatientId: 100031,
    FirstName: 'Zahid',
    LastName: 'Shahid',
    MRNNo: '01-01-0100031',
    DOB: '1/1/1980 12:00:00 AM',
    CNIC: '41406-9577288-8',
    CellPhoneNumber: '03133751890',
    Gender: 'Male',
    SiteName: 'Gharo',
    MartialStatus: 'Married',
    SpouseName: 'Shahid',
    ZakatEligible: false,
    Country: 'Pakistan',
    City: 'Thatta',
    Province: 'Sindh',
    Address: 'Eid Ghah Mohallah',
    EnteredOn: '2023-10-16T16:35:43.607',
    Services: [
      {
        ServiceId: 30013,
        ServiceName: 'OPD Charges',
        Charges: '40',
      },
    ],
    Status: 'CheckIn',
    CheckInSynced: false,
    Vitals: [],
  },
];
export const PatientStoreModel = types
  .model('PatientStore')
  .props({
    patients: types.array(PatientModel),
    selectedPatient: types.array(types.reference(PatientModel)),
    patientQueue: types.array(types.reference(PatientModel)),
    // favorites: types.array(types.reference(PatientModel)),
    // favoritesOnly: false,
  })
  .actions(withSetPropAction)
  .actions(store => ({
    // async
    fetchPatients(site) {
      store.setProp('patients', PATIENTS);
      // store.setProp("patientQueue", PATIENTS)

      // for (let i = 0; i < PATIENTS_SELECTED.length; i++){
      //   this.addPatientInQueue(PATIENTS_SELECTED[i])
      // }

      // const response = await api.getPatients(site)
      // if (response.kind === "ok") {
      //   store.setProp("patients", response.patients)
      //   console.log('response patients.....', response.patients)
      //   console.log('response store.....', store)
      //   console.log('response stores patients.....', store.patients)
      // } else {
      //   console.tron.error(`Error fetching patients: ${JSON.stringify(response)}`, [])
      // }
    },
    // setPatients(
    //   num: number,
    //   receivedData: any,
    //   sender: string,
    //   isCheckoutSync?: boolean,
    // ) {
    //   let temp = [...store.patients];
    //   if (sender === 'pharmacy') {
    //     temp[num].Status = 'Pharmacy';
    //     temp[num].PharmacyTime = receivedData.PharmacyTime;
    //   } else {
    //     if (isCheckoutSync) {
    //       temp[num].Status = 'CheckOut';
    //       temp[num].CheckoutTime = receivedData.CheckoutTime;
    //     } else {
    //       temp[num].Status = receivedData.Status;
    //       temp[num].PrescriptionTime = receivedData.PrescriptionTime;
    //     }
    //   }
    //   store.setProp('patients', temp);
    // },
    setPatients(
  index: number,
  receivedData: any,
  sender: string,
  isCheckoutSync?: boolean,
) {
  let temp = [...store.patients];
  let existing = temp[index];

  const updated = {
    ...existing, // keep previous fields
    ...receivedData, // overwrite with updated ones
  };

  if (sender === 'pharmacy') {
    updated.Status = 'Pharmacy';
    updated.PharmacyTime = receivedData.PharmacyTime;
  } else if (isCheckoutSync) {
    updated.Status = 'CheckOut';
    updated.CheckoutTime = receivedData.CheckoutTime;
  }

  temp[index] = updated;
  store.setProp('patients', temp);
},
    addPatientInQueue(patient: Patient) {
      store.patientQueue.push(patient);
    },
    removePatientFromQueue(patient: Patient) {
      store.patientQueue.remove(patient);
    },
    selectPatient(patient: Patient) {
      store.selectedPatient[0] = patient;
    },
    deselectPatient(patient: Patient) {
      store.selectedPatient.remove(patient);
    },
    addFavorite(patient: Patient) {
      store.favorites.push(patient);
    },
    removeFavorite(patient: Patient) {
      store.favorites.remove(patient);
    },
    patientSelected(patient: Patient) {
      return store.selectedPatient.includes(patient);
    },
    getSelectedPatient() {
      return store.selectedPatient;
    },
    addSelectedPatientStatus(status: string) {
      if (store.selectedPatient.length > 0)
        store.selectedPatient[0].Status = status;
    },
    addServicesToSelectedPatient(services: Array<Service>) {
      console.log('selected Services list.......', services);
      for (let i = 0; i < services.length; i++) {
        if (store.selectedPatient.length > 0)
          console.log('selected Services list.......1', services[i]);
        console.log('selected Services list.......2', store.selectedPatient[0]);
        console.log(
          'selected Services list.......2',
          store.selectedPatient[0].Services,
        );

        // store.selectedPatient[0].Services = services
        if (!store.selectedPatient[0].Services.includes(services[i])) {
          store.selectedPatient[0].Services.push(services[i]);
          console.log(
            'selected Services list.......3',
            store.selectedPatient[0].Services,
          );
        }
      }
    },
    addCheckedInSynced(checkedInSynced: boolean) {
      if (store.selectedPatient[0])
        store.selectedPatient[0].CheckInSynced = checkedInSynced;
    },
    // addNewPatient(patient: Patient) {
    //   console.log('patient in add new patient....', patient);
    //   store.patients.push(patient);
    // },
    addNewPatient(patient: Patient) {
  const index = store.patients.findIndex(p => p.PatientId === patient.PatientId);
  
  if (index !== -1) {
    // 👇 Replace existing patient with updated one
    store.patients[index] = patient;
    console.log('📝 Updated existing patient with ID:', patient.PatientId);
  } else {
    // 👇 Add new patient
    store.patients.push(patient);
    console.log('➕ Added new patient with ID:', patient.PatientId);
  }
},

    addAddressToNewPatient(
      address: string,
      country: string,
      province: string,
      city: string,
      index: number,
    ) {
      store.patients[index].Address = address;
      store.patients[index].Country = country;
      store.patients[index].Province = province;
      store.patients[index].City = city;
    },
    selectNewPatient(index: number) {
      console.log('index in select New Patient....', index);
      console.log('index in select New Patient....', store.patients[index]);
      store.selectedPatient[0] = store.patients[index];
    },
    emptySelectedPatient() {
      store.selectedPatient.clear();
    },
    addVitals(vitals: any) {
      console.log('vitals inside mobx....', vitals);
      var array = [];
      array.push(vitals);
      console.log('new array in vitals mobx...', array);
      if (store.selectedPatient[0]) {
        store.selectedPatient[0].Vitals = array;
        store.selectedPatient[0].Status = 'Vitals';
      }
    },
    addNursingNote(nursingNote: string) {
      if (store.selectedPatient[0])
        store.selectedPatient[0].NursingNote = nursingNote;
    },
    addNurseName(nurseName: string) {
      if (store.selectedPatient[0])
        store.selectedPatient[0].NurseName = nurseName;
    },
    addVitalsTimeTime(time: string) {
      if (store.selectedPatient.length > 0)
        store.selectedPatient[0].VitalsTime = time;
    },
  }))
  .views(store => ({
    get patientsForList() {
      // return store.favoritesOnly ? store.favorites : store.patients
      return store.patients;
    },
    patientQueueForList() {
      return store.patientQueue;
    },
    hasFavorite(patient: Patient) {
      return store.favorites.includes(patient);
    },
    selectAPatient(patient: Patient) {
      console.log('patientSelected in store....', store.selectedPatient[0]);
      if (!store.patientSelected(patient)) store.selectPatient(patient);
    },
    latestIndex() {
      return store.patients.length;
    },
  }))
  .actions(store => ({
    toggleFavorite(patient: Patient) {
      if (store.hasFavorite(patient)) {
        store.removeFavorite(patient);
      } else {
        store.addFavorite(patient);
      }
    },
  }))
  .volatile(() => ({
    midnightResetTimer: null as ReturnType<typeof setTimeout> | null,
  }))
  .actions(store => ({

setupMidnightReset() {
  const now = new Date();
  const today = now.toDateString();
  console.log("1");
  
  const lastReset = mmkvStorage.getString('lastPatientReset');

  // if (lastReset !== today) {
  //   console.log('🔁 App opened after midnight — resetting now...');
  //   store.resetPatientsAtMidnight();
  // }
if (lastReset !== today) {
  console.log('🔁 App opened after midnight — resetting now...');
  setTimeout(() => {
    store.resetPatientsAtMidnight(); // ✅ Delayed reset avoids conflicts
  }, 1000); // Delay by 1s
}
const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
const msUntilMidnight = midnight.getTime() - now.getTime();

  // const msUntilMidnight = 30000; // 30 seconds for test
  const resetTime = new Date(Date.now() + msUntilMidnight);
  console.log('⏰ Scheduled patient reset at', resetTime.toLocaleTimeString());

  // ✅ Clear any previous timer
  if (store.midnightResetTimer)
     clearTimeout(store.midnightResetTimer);

  store.midnightResetTimer = setTimeout(() => {
    console.log("🚨 Timeout triggered");
    store.resetPatientsAtMidnight();
    store.setupMidnightReset();
  }, msUntilMidnight);
},


  resetPatientsAtMidnight() {
    console.log('⏱️ Midnight reached — resetting patient queue.');
    store.patientQueue.clear();
    store.selectedPatient.clear();
        store.patientsForList.clear?.();  // This will remove the patients that are from api 
    // ✅ Save the reset date
    mmkvStorage.set('lastPatientReset', new Date().toDateString());
    ToastAndroid.show('⏱️ Midnight reached — resetting patient queue.',ToastAndroid.LONG);
  }
}));


export interface PatientStore extends Instance<typeof PatientStoreModel> {}
export interface PatientStoreSnapshot
  extends SnapshotOut<typeof PatientStoreModel> {}

// @demo remove-file
