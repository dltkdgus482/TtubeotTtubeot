class CalcAdventureStats {
  static getDistanceFromGPSData(gpsData: { lat: number; lng: number; steps: number }[]): number {
    let distance = 0;
    for (let i = 1; i < gpsData.length; i++) {
      let prev = gpsData[i - 1];
      let current = gpsData[i];
      distance += this.getDistanceFromLatLonInKm(prev.lat, prev.lng, current.lat, current.lng);
    }
    return distance;
  }

  static getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  }

  static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  static getCalorieBurned(steps: number): number {
    // 1걸음당 소모 칼로리 0.03kcal
    // reference: https://mobile.hidoc.co.kr/healthqna/view/C0000249066
    return steps * 0.03;
  }
}

export default CalcAdventureStats;