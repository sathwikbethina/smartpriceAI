export interface PincodeInfo {
  pincode: string;
  city: string;
  state: string;
  area: string;
  lat: number;
  lon: number;
  darkstores: {
    blinkit: boolean;
    zepto: boolean;
    instamart: boolean;
    cromaExpress: boolean;
  };
}

export const POPULAR_PINCODES: Record<string, PincodeInfo> = {
  // Chennai
  '600028': { pincode: '600028', city: 'Chennai', state: 'Tamil Nadu', area: 'R.A. Puram / Mandaveli', lat: 13.0232, lon: 80.2543, darkstores: { blinkit: true, zepto: true, instamart: true, cromaExpress: true } },
  '600001': { pincode: '600001', city: 'Chennai', state: 'Tamil Nadu', area: 'George Town / Parrys', lat: 13.0900, lon: 80.2900, darkstores: { blinkit: true, zepto: true, instamart: true, cromaExpress: true } },
  '600034': { pincode: '600034', city: 'Chennai', state: 'Tamil Nadu', area: 'Nungambakkam', lat: 13.0600, lon: 80.2400, darkstores: { blinkit: true, zepto: true, instamart: true, cromaExpress: true } },
  '600096': { pincode: '600096', city: 'Chennai', state: 'Tamil Nadu', area: 'Perungudi / OMR Tech Corridor', lat: 12.9654, lon: 80.2461, darkstores: { blinkit: true, zepto: true, instamart: true, cromaExpress: true } },

  // Hyderabad
  '500081': { pincode: '500081', city: 'Hyderabad', state: 'Telangana', area: 'HITEC City / Madhapur', lat: 17.4483, lon: 78.3915, darkstores: { blinkit: true, zepto: true, instamart: true, cromaExpress: true } },
  '500032': { pincode: '500032', city: 'Hyderabad', state: 'Telangana', area: 'Gachibowli / Financial District', lat: 17.4401, lon: 78.3489, darkstores: { blinkit: true, zepto: true, instamart: true, cromaExpress: true } },
  '500034': { pincode: '500034', city: 'Hyderabad', state: 'Telangana', area: 'Banjara Hills', lat: 17.4156, lon: 78.4357, darkstores: { blinkit: true, zepto: true, instamart: true, cromaExpress: true } },
  '500001': { pincode: '500001', city: 'Hyderabad', state: 'Telangana', area: 'Abids / Koti', lat: 17.3850, lon: 78.4867, darkstores: { blinkit: true, zepto: true, instamart: true, cromaExpress: true } },

  // Bangalore
  '560001': { pincode: '560001', city: 'Bangalore', state: 'Karnataka', area: 'MG Road / Brigade Road', lat: 12.9716, lon: 77.5946, darkstores: { blinkit: true, zepto: true, instamart: true, cromaExpress: true } },
  '560034': { pincode: '560034', city: 'Bangalore', state: 'Karnataka', area: 'Koramangala', lat: 12.9352, lon: 77.6245, darkstores: { blinkit: true, zepto: true, instamart: true, cromaExpress: true } },
  '560100': { pincode: '560100', city: 'Bangalore', state: 'Karnataka', area: 'Electronic City', lat: 12.8452, lon: 77.6602, darkstores: { blinkit: true, zepto: true, instamart: true, cromaExpress: true } },
  '560066': { pincode: '560066', city: 'Bangalore', state: 'Karnataka', area: 'Whitefield / ITPL', lat: 12.9698, lon: 77.7500, darkstores: { blinkit: true, zepto: true, instamart: true, cromaExpress: true } },

  // Mumbai
  '400001': { pincode: '400001', city: 'Mumbai', state: 'Maharashtra', area: 'Fort / Marine Lines', lat: 18.9333, lon: 72.8333, darkstores: { blinkit: true, zepto: true, instamart: true, cromaExpress: true } },
  '400050': { pincode: '400050', city: 'Mumbai', state: 'Maharashtra', area: 'Bandra West', lat: 19.0596, lon: 72.8295, darkstores: { blinkit: true, zepto: true, instamart: true, cromaExpress: true } },
  '400053': { pincode: '400053', city: 'Mumbai', state: 'Maharashtra', area: 'Andheri West / Lokhandwala', lat: 19.1363, lon: 72.8277, darkstores: { blinkit: true, zepto: true, instamart: true, cromaExpress: true } },

  // Delhi / NCR
  '110001': { pincode: '110001', city: 'Delhi', state: 'Delhi', area: 'Connaught Place / Central Delhi', lat: 28.6304, lon: 77.2177, darkstores: { blinkit: true, zepto: true, instamart: true, cromaExpress: true } },
  '122002': { pincode: '122002', city: 'Delhi', state: 'Haryana', area: 'Gurugram / Cyber City', lat: 28.4817, lon: 77.0878, darkstores: { blinkit: true, zepto: true, instamart: true, cromaExpress: true } },
  '201301': { pincode: '201301', city: 'Delhi', state: 'Uttar Pradesh', area: 'Noida Sector 18', lat: 28.5700, lon: 77.3200, darkstores: { blinkit: true, zepto: true, instamart: true, cromaExpress: true } },

  // Pune
  '411001': { pincode: '411001', city: 'Pune', state: 'Maharashtra', area: 'Pune Station / Camp', lat: 18.5204, lon: 73.8567, darkstores: { blinkit: true, zepto: true, instamart: true, cromaExpress: true } },
  '411057': { pincode: '411057', city: 'Pune', state: 'Maharashtra', area: 'Hinjawadi IT Park', lat: 18.5913, lon: 73.7389, darkstores: { blinkit: true, zepto: true, instamart: true, cromaExpress: true } },

  // Kolkata
  '700001': { pincode: '700001', city: 'Kolkata', state: 'West Bengal', area: 'BBD Bagh / Esplanade', lat: 22.5726, lon: 88.3639, darkstores: { blinkit: true, zepto: true, instamart: true, cromaExpress: true } },
  '700091': { pincode: '700091', city: 'Kolkata', state: 'West Bengal', area: 'Salt Lake / Sector V', lat: 22.5800, lon: 88.4300, darkstores: { blinkit: true, zepto: true, instamart: true, cromaExpress: true } },

  // Ahmedabad
  '380001': { pincode: '380001', city: 'Ahmedabad', state: 'Gujarat', area: 'Old City / Bhadra', lat: 23.0225, lon: 72.5714, darkstores: { blinkit: true, zepto: true, instamart: true, cromaExpress: true } },
  '380015': { pincode: '380015', city: 'Ahmedabad', state: 'Gujarat', area: 'Satellite / SG Highway', lat: 23.0300, lon: 72.5100, darkstores: { blinkit: true, zepto: true, instamart: true, cromaExpress: true } },

  // Jaipur
  '302001': { pincode: '302001', city: 'Jaipur', state: 'Rajasthan', area: 'Pink City / MI Road', lat: 26.9124, lon: 75.7873, darkstores: { blinkit: true, zepto: true, instamart: true, cromaExpress: true } },

  // Visakhapatnam & Vijayawada
  '530001': { pincode: '530001', city: 'Visakhapatnam', state: 'Andhra Pradesh', area: 'One Town / Port Area', lat: 17.6868, lon: 83.2185, darkstores: { blinkit: true, zepto: true, instamart: true, cromaExpress: true } },
  '520001': { pincode: '520001', city: 'Vijayawada', state: 'Andhra Pradesh', area: 'Governorpet / Besant Road', lat: 16.5062, lon: 80.6480, darkstores: { blinkit: true, zepto: true, instamart: true, cromaExpress: true } },
};

export function lookupPincode(input: string): PincodeInfo {
  const clean = input.trim();
  if (POPULAR_PINCODES[clean]) {
    return POPULAR_PINCODES[clean];
  }

  // Check by city name match
  const cityMatch = Object.values(POPULAR_PINCODES).find(
    (p) => p.city.toLowerCase() === clean.toLowerCase() || p.area.toLowerCase().includes(clean.toLowerCase())
  );
  if (cityMatch) return cityMatch;

  // Fallback for custom valid 6-digit PIN code
  if (/^\d{6}$/.test(clean)) {
    const prefix = clean.substring(0, 2);
    let inferredCity = 'Chennai';
    let inferredState = 'Tamil Nadu';
    let lat = 13.0827;
    let lon = 80.2707;

    if (prefix.startsWith('50')) { inferredCity = 'Hyderabad'; inferredState = 'Telangana'; lat = 17.3850; lon = 78.4867; }
    else if (prefix.startsWith('56')) { inferredCity = 'Bangalore'; inferredState = 'Karnataka'; lat = 12.9716; lon = 77.5946; }
    else if (prefix.startsWith('40')) { inferredCity = 'Mumbai'; inferredState = 'Maharashtra'; lat = 19.0760; lon = 72.8777; }
    else if (prefix.startsWith('11') || prefix.startsWith('12') || prefix.startsWith('20')) { inferredCity = 'Delhi'; inferredState = 'Delhi NCR'; lat = 28.6139; lon = 77.2090; }
    else if (prefix.startsWith('41')) { inferredCity = 'Pune'; inferredState = 'Maharashtra'; lat = 18.5204; lon = 73.8567; }
    else if (prefix.startsWith('70')) { inferredCity = 'Kolkata'; inferredState = 'West Bengal'; lat = 22.5726; lon = 88.3639; }
    else if (prefix.startsWith('38')) { inferredCity = 'Ahmedabad'; inferredState = 'Gujarat'; lat = 23.0225; lon = 72.5714; }
    else if (prefix.startsWith('53')) { inferredCity = 'Visakhapatnam'; inferredState = 'Andhra Pradesh'; lat = 17.6868; lon = 83.2185; }
    else if (prefix.startsWith('52')) { inferredCity = 'Vijayawada'; inferredState = 'Andhra Pradesh'; lat = 16.5062; lon = 80.6480; }

    return {
      pincode: clean,
      city: inferredCity,
      state: inferredState,
      area: `PIN ${clean}`,
      lat,
      lon,
      darkstores: { blinkit: true, zepto: true, instamart: true, cromaExpress: true },
    };
  }

  return POPULAR_PINCODES['600028'];
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function findClosestPincode(lat: number, lon: number): PincodeInfo {
  let closest: PincodeInfo = POPULAR_PINCODES['600028'];
  let minDistance = Infinity;

  for (const info of Object.values(POPULAR_PINCODES)) {
    const dist = calculateDistance(lat, lon, info.lat, info.lon);
    if (dist < minDistance) {
      minDistance = dist;
      closest = info;
    }
  }

  return closest;
}

