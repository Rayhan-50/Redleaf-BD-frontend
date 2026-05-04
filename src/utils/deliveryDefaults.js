/**
 * deliveryDefaults.js
 * Shared constants for the frontend delivery system.
 * Keep in sync with DEFAULT_ZONES in backend/deliveryEngine.js
 */

export const DEFAULT_ZONES = {
  'Dhaka': [
    { min: 0,    max: 500,  charge: 60 },
    { min: 501,  max: 1000, charge: 40 },
    { min: 1001, max: null, charge: 0  },
  ],
  'Outside Dhaka': [
    { min: 0,    max: 500,  charge: 120 },
    { min: 501,  max: 1000, charge: 80  },
    { min: 1001, max: null, charge: 50  },
  ],
};

export const ZONE_NAMES = Object.keys(DEFAULT_ZONES);
