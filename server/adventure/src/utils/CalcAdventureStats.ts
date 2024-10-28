class CalcAdventureStats {
  static getDistanceFromGPSData(gpsData: { lat: number; lng: number; steps: number }[]): number {
    let distance = 0;
    for (let i = 1; i < gpsData.length; i++) {
      let prev = gpsData[i - 1];
      let current = gpsData[i];
      distance += this.getDistanceFromLatLonInm(prev.lat, prev.lng, current.lat, current.lng);
    }
    return distance;
  }

  static getDistanceFromLatLonInm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    let R = 6371; // Radius of the earth in km
    let dLat = this.deg2rad(lat2 - lat1); // deg2rad below
    let dLon = this.deg2rad(lon2 - lon1);
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c * 1000; // Distance in m
    return d;
  }

  static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  static getCalorieBurned(steps: number): number {
    // 1걸음당 소모 칼로리 0.03kcal
    // reference: https://mobile.hidoc.co.kr/healthqna/view/C0000249066
    console.log(steps);
    return steps * 0.03;
  }

  static getStepsFromGPSData(gpsData: { lat: number; lng: number; steps: number }[]): number {
    let steps = 0;
    for (let i = 0; i < gpsData.length; i++) {
      steps += gpsData[i].steps;
    }
    return steps;
  }
}

export default CalcAdventureStats;