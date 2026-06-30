/**
 * LaMetric Local Push Client
 *
 * Pushes notifications directly to LaMetric device on local network.
 * Uses curl for reliable local network access (bypasses WARP/VPN issues).
 */
const { execSync } = require('child_process');
const config = require('./config');
const { getAirport } = require('./airports');

// LaMetric icon IDs — these are placeholders, swap for real IDs from
// https://developer.lametric.com/icons (search "departure" / "arrival")
const ICON_AIRCRAFT = '2933';        // existing generic aircraft icon
const ICON_DEPARTURE_AMS = '72518';  // TODO: replace with your chosen icon ID
const ICON_ARRIVAL_AMS = '72520';    // TODO: replace with your chosen icon ID
const AMS_IATA = 'AMS';

class LaMetricClient {
  constructor() {
    this.deviceIp = config.lametric.deviceIp;
    this.apiKey = config.lametric.apiKey;
    this.baseUrl = `http://${this.deviceIp}:8080/api/v2`;

    console.log(`📡 LaMetric client initialized`);
    console.log(`   Device: ${this.deviceIp}`);
  }

  /**
   * Execute a curl request to the LaMetric device
   * Works on Windows, macOS, and Linux
   */
  curlRequest(method, endpoint, data = null) {
    const url = `${this.baseUrl}${endpoint}`;
    const auth = `dev:${this.apiKey}`;

    // Use curl.exe on Windows to avoid PowerShell's Invoke-WebRequest alias
    const curlCmd = process.platform === 'win32' ? 'curl.exe' : 'curl';

    let cmd = `${curlCmd} -s -X ${method} -u "${auth}"`;

    if (data) {
      const jsonData = JSON.stringify(data);
      // Escape double quotes for shell compatibility (works on Windows + Unix)
      const escaped = jsonData.replace(/"/g, '\\"');
      cmd += ` -H "Content-Type: application/json" -d "${escaped}"`;
    }

    cmd += ` "${url}"`;

    try {
      const result = execSync(cmd, { timeout: 10000, encoding: 'utf8', shell: true });
      return { success: true, data: result ? JSON.parse(result) : {} };
    } catch (error) {
      console.error('❌ Request failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Push a simple notification
   */
  pushNotification({ text, icon = '2933', sound = null, priority = 'info' }) {
    const payload = {
      priority,
      icon_type: 'none',
      model: {
        frames: [{ icon, text }],
      },
    };

    if (sound) {
      payload.model.sound = { category: 'notifications', id: sound };
    }

    return this.pushRawNotification(payload);
  }

  /**
   * Push a raw notification payload
   */
  pushRawNotification(payload) {
    console.log('📤 Pushing notification to LaMetric...');
    const result = this.curlRequest('POST', '/device/notifications', payload);

    if (result.success) {
      console.log('✅ Notification sent');
    }

    return result;
  }

  /**
   * Push an enhanced flight notification with scrolling text
   *
   * All info in ONE frame that scrolls continuously left-to-right
   *
   * @param {Object} flight - Flight information
   * @param {string} flight.callsign - Flight callsign (e.g., "EIN123")
   * @param {number} flight.altitude - Altitude in feet
   * @param {string} [flight.typecode] - Aircraft type (e.g., "A320", "B738")
   * @param {string} [flight.origin] - Origin airport code
   * @param {string} [flight.destination] - Destination airport code
   * @param {number} [flight.distance] - Distance in miles
   */
pushFlightNotification(flight) {
    const callsign = flight.callsign || 'Aircraft';

    const origin = flight.originIcao ? getAirport(flight.originIcao) : null;
    const destination = flight.destinationIcao ? getAirport(flight.destinationIcao) : null;

    // Icon selection: highlight AMS departures/arrivals, default for everything else
    let icon = ICON_AIRCRAFT;
    if (origin && origin.iata === AMS_IATA) {
      icon = ICON_DEPARTURE_AMS;
    } else if (destination && destination.iata === AMS_IATA) {
      icon = ICON_ARRIVAL_AMS;
    }

    const frames = [];

    // Line 1: Callsign (e.g. "BA446")
    frames.push({ icon, text: callsign });

    // Line 2: Route as IATA-IATA (e.g. "DUB-AMS"). Falls back to ICAO
    // automatically via getAirport() when an airport isn't in the database.
    if (origin && destination) {
      frames.push({ icon, text: `${origin.iata}-${destination.iata}` });
    }

    // Line 3: City of the "other" airport relative to AMS — omitted entirely
    // if unknown, never shows the word "Unknown"
    let cityLine = null;
    if (origin && destination) {
      cityLine = origin.iata === AMS_IATA ? destination.city : origin.city;
    } else if (origin) {
      cityLine = origin.city;
    } else if (destination) {
      cityLine = destination.city;
    }
    if (cityLine) {
      frames.push({ icon, text: cityLine });
    }

    const payload = {
      priority: 'info',
      icon_type: 'none',
      lifetime: 12000,
      model: {
        cycles: 2,
        frames,
        sound: { category: 'notifications', id: 'notification' },
      },
    };

    return this.pushRawNotification(payload);
  }

  /**
   * Dismiss all notifications and return to clock
   */
  dismissNotifications() {
    console.log('🔄 Dismissing all notifications...');
    const result = this.curlRequest('DELETE', '/device/notifications');

    if (result.success) {
      console.log('✅ Notifications dismissed - back to clock');
    }

    return result;
  }

  /**
   * Switch to clock app
   */
  switchToClock() {
    console.log('🕐 Switching to clock...');
    const result = this.curlRequest('PUT', '/device/apps/com.lametric.clock', { activate: true });

    if (result.success) {
      console.log('✅ Switched to clock');
    }

    return result;
  }

  /**
   * Test the connection to the device
   */
  testConnection() {
    console.log(`   Connecting to: ${this.baseUrl}/device`);
    const result = this.curlRequest('GET', '/device');

    if (result.success) {
      console.log('✅ Connected to LaMetric:', result.data.name);
    } else {
      console.error('❌ Cannot connect to LaMetric');
    }

    return result;
  }
}

module.exports = LaMetricClient;
