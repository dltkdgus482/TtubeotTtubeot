import {
  initialize,
  requestPermission,
  readRecords,
  getGrantedPermissions,
  getSdkStatus,
  revokeAllPermissions,
} from 'react-native-health-connect';

export const init = async () => {
    await initialize();
};

export const isAvailable = async () => {
  const res = await getSdkStatus();
  if (res === 1) {
    return { status: false, message: "SDK unavailable" };
  } else if (res === 2) {
    return { status: false, message: "SDK update required" };
  } else if (res === 3) {
    return { status: true, message: "Health Connect available" };
  }
};

export const getPermission = async () =>
  new Promise((resolve, reject) => {
    requestPermission([
      { accessType: 'read', recordType: 'TotalCaloriesBurned' },
      { accessType: 'read', recordType: 'Steps' },
      { accessType: 'read', recordType: 'HeartRate' },
      { accessType: 'read', recordType: 'Distance' },
      { accessType: 'read', recordType: 'SleepSession' },
    ])
      .then(permissions => {
        console.log('Requested permissions:', permissions);
        resolve(permissions.length > 0);
      })
      .catch(e => {
        reject(Error(e.message));
      });
  });