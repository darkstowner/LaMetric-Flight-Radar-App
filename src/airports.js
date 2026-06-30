// Offline ICAO → IATA → City airport database.
// Covers Amsterdam Schiphol (KLM hub) and its worldwide route network,
// so no external airport-metadata API call is ever needed.
//
// Lookups fall back gracefully:
//  - Unknown ICAO code  → iata field returns the ICAO code itself
//  - Missing city       → city field is null (caller should omit, not show "Unknown")

const AIRPORTS = {

  // ── Netherlands ──────────────────────────────────────────────────────────
  EHAM: { iata: 'AMS', city: 'Amsterdam' },
  EHRD: { iata: 'RTM', city: 'Rotterdam' },
  EHEH: { iata: 'EIN', city: 'Eindhoven' },
  EHGG: { iata: 'GRQ', city: 'Groningen' },
  EHBK: { iata: 'MST', city: 'Maastricht' },

  // ── Belgium ───────────────────────────────────────────────────────────────
  EBBR: { iata: 'BRU', city: 'Brussels' },
  EBCI: { iata: 'CRL', city: 'Charleroi' },
  EBOS: { iata: 'OST', city: 'Ostend' },
  EBLG: { iata: 'LGG', city: 'Liège' },

  // ── United Kingdom ────────────────────────────────────────────────────────
  EGLL: { iata: 'LHR', city: 'London' },
  EGKK: { iata: 'LGW', city: 'London' },
  EGGW: { iata: 'LTN', city: 'London' },
  EGSS: { iata: 'STN', city: 'London' },
  EGLC: { iata: 'LCY', city: 'London' },
  EGCC: { iata: 'MAN', city: 'Manchester' },
  EGBB: { iata: 'BHX', city: 'Birmingham' },
  EGPH: { iata: 'EDI', city: 'Edinburgh' },
  EGPF: { iata: 'GLA', city: 'Glasgow' },
  EGPD: { iata: 'ABZ', city: 'Aberdeen' },
  EGAA: { iata: 'BFS', city: 'Belfast' },
  EGAC: { iata: 'BHD', city: 'Belfast' },
  EGNX: { iata: 'EMA', city: 'Nottingham' },
  EGNT: { iata: 'NCL', city: 'Newcastle' },
  EGGD: { iata: 'BRS', city: 'Bristol' },
  EGHI: { iata: 'SOU', city: 'Southampton' },
  EGTE: { iata: 'EXT', city: 'Exeter' },
  EGPE: { iata: 'INV', city: 'Inverness' },
  EGJJ: { iata: 'JER', city: 'Jersey' },
  EGJB: { iata: 'GCI', city: 'Guernsey' },
  EGNS: { iata: 'IOM', city: 'Isle of Man' },

  // ── Ireland ───────────────────────────────────────────────────────────────
  EIDW: { iata: 'DUB', city: 'Dublin' },
  EICK: { iata: 'ORK', city: 'Cork' },
  EINN: { iata: 'SNN', city: 'Shannon' },
  EIKN: { iata: 'NOC', city: 'Knock' },

  // ── Germany ───────────────────────────────────────────────────────────────
  EDDF: { iata: 'FRA', city: 'Frankfurt' },
  EDDM: { iata: 'MUC', city: 'Munich' },
  EDDB: { iata: 'BER', city: 'Berlin' },
  EDDL: { iata: 'DUS', city: 'Düsseldorf' },
  EDDH: { iata: 'HAM', city: 'Hamburg' },
  EDDS: { iata: 'STR', city: 'Stuttgart' },
  EDDK: { iata: 'CGN', city: 'Cologne' },
  EDDP: { iata: 'LEJ', city: 'Leipzig' },
  EDDN: { iata: 'NUE', city: 'Nuremberg' },
  EDDV: { iata: 'HAJ', city: 'Hannover' },
  EDDC: { iata: 'DRS', city: 'Dresden' },
  EDDW: { iata: 'BRE', city: 'Bremen' },

  // ── France ────────────────────────────────────────────────────────────────
  LFPG: { iata: 'CDG', city: 'Paris' },
  LFPO: { iata: 'ORY', city: 'Paris' },
  LFMN: { iata: 'NCE', city: 'Nice' },
  LFLL: { iata: 'LYS', city: 'Lyon' },
  LFBO: { iata: 'TLS', city: 'Toulouse' },
  LFRS: { iata: 'NTE', city: 'Nantes' },
  LFBD: { iata: 'BOD', city: 'Bordeaux' },
  LFML: { iata: 'MRS', city: 'Marseille' },
  LFSB: { iata: 'BSL', city: 'Basel' },
  LFST: { iata: 'SXB', city: 'Strasbourg' },
  LFRB: { iata: 'BES', city: 'Brest' },
  LFRN: { iata: 'RNS', city: 'Rennes' },

  // ── Spain ─────────────────────────────────────────────────────────────────
  LEMD: { iata: 'MAD', city: 'Madrid' },
  LEBL: { iata: 'BCN', city: 'Barcelona' },
  LEPA: { iata: 'PMI', city: 'Palma de Mallorca' },
  LEZL: { iata: 'SVQ', city: 'Seville' },
  LEVC: { iata: 'VLC', city: 'Valencia' },
  LEMG: { iata: 'AGP', city: 'Málaga' },
  LEBB: { iata: 'BIO', city: 'Bilbao' },
  LEAL: { iata: 'ALC', city: 'Alicante' },
  LEIB: { iata: 'IBZ', city: 'Ibiza' },
  LEMH: { iata: 'MAH', city: 'Menorca' },
  GCXO: { iata: 'TFN', city: 'Tenerife' },
  GCTS: { iata: 'TFS', city: 'Tenerife' },
  GCRR: { iata: 'ACE', city: 'Lanzarote' },
  GCFV: { iata: 'FUE', city: 'Fuerteventura' },
  GCLP: { iata: 'LPA', city: 'Gran Canaria' },
  GCLA: { iata: 'SPC', city: 'La Palma' },

  // ── Portugal ──────────────────────────────────────────────────────────────
  LPPT: { iata: 'LIS', city: 'Lisbon' },
  LPFR: { iata: 'FAO', city: 'Faro' },
  LPPR: { iata: 'OPO', city: 'Porto' },
  LPMA: { iata: 'FNC', city: 'Madeira' },

  // ── Italy ─────────────────────────────────────────────────────────────────
  LIRF: { iata: 'FCO', city: 'Rome' },
  LIRA: { iata: 'CIA', city: 'Rome' },
  LIMC: { iata: 'MXP', city: 'Milan' },
  LIML: { iata: 'LIN', city: 'Milan' },
  LIME: { iata: 'BGY', city: 'Milan' },
  LIPZ: { iata: 'VCE', city: 'Venice' },
  LIPE: { iata: 'BLQ', city: 'Bologna' },
  LICC: { iata: 'CTA', city: 'Catania' },
  LICJ: { iata: 'PMO', city: 'Palermo' },
  LIRN: { iata: 'NAP', city: 'Naples' },
  LIBD: { iata: 'BRI', city: 'Bari' },
  LIBR: { iata: 'BDS', city: 'Brindisi' },
  LIRQ: { iata: 'FLR', city: 'Florence' },
  LIPX: { iata: 'VRN', city: 'Verona' },
  LIRP: { iata: 'PSA', city: 'Pisa' },

  // ── Switzerland ───────────────────────────────────────────────────────────
  LSZH: { iata: 'ZRH', city: 'Zurich' },
  LSGG: { iata: 'GVA', city: 'Geneva' },
  LSZB: { iata: 'BRN', city: 'Bern' },
  LSZA: { iata: 'LUG', city: 'Lugano' },

  // ── Austria ───────────────────────────────────────────────────────────────
  LOWW: { iata: 'VIE', city: 'Vienna' },
  LOWI: { iata: 'INN', city: 'Innsbruck' },
  LOWS: { iata: 'SZG', city: 'Salzburg' },
  LOWG: { iata: 'GRZ', city: 'Graz' },

  // ── Scandinavia ───────────────────────────────────────────────────────────
  EKCH: { iata: 'CPH', city: 'Copenhagen' },
  EKBI: { iata: 'BLL', city: 'Billund' },
  EKAH: { iata: 'AAR', city: 'Aarhus' },
  ESSA: { iata: 'ARN', city: 'Stockholm' },
  ESGG: { iata: 'GOT', city: 'Gothenburg' },
  ESMS: { iata: 'MMX', city: 'Malmö' },
  ESOW: { iata: 'VST', city: 'Stockholm' },
  ESSP: { iata: 'NYO', city: 'Stockholm' },
  ENGM: { iata: 'OSL', city: 'Oslo' },
  ENTO: { iata: 'TRF', city: 'Oslo' },
  ENZV: { iata: 'SVG', city: 'Stavanger' },
  ENBR: { iata: 'BGO', city: 'Bergen' },
  ENVA: { iata: 'TRD', city: 'Trondheim' },
  ENTC: { iata: 'TOS', city: 'Tromsø' },
  EFHK: { iata: 'HEL', city: 'Helsinki' },

  // ── Eastern Europe & Baltics ──────────────────────────────────────────────
  EPWA: { iata: 'WAW', city: 'Warsaw' },
  EPKK: { iata: 'KRK', city: 'Krakow' },
  EPGD: { iata: 'GDN', city: 'Gdansk' },
  EPWR: { iata: 'WRO', city: 'Wrocław' },
  EPKT: { iata: 'KTW', city: 'Katowice' },
  EPPO: { iata: 'POZ', city: 'Poznań' },
  LKPR: { iata: 'PRG', city: 'Prague' },
  LZIB: { iata: 'BTS', city: 'Bratislava' },
  LHBP: { iata: 'BUD', city: 'Budapest' },
  LROP: { iata: 'OTP', city: 'Bucharest' },
  LBSF: { iata: 'SOF', city: 'Sofia' },
  LDZA: { iata: 'ZAG', city: 'Zagreb' },
  LJLJ: { iata: 'LJU', city: 'Ljubljana' },
  LYBE: { iata: 'BEG', city: 'Belgrade' },
  LUKK: { iata: 'KIV', city: 'Chisinau' },
  UKBB: { iata: 'KBP', city: 'Kyiv' },
  EVRA: { iata: 'RIX', city: 'Riga' },
  EYVI: { iata: 'VNO', city: 'Vilnius' },
  EETN: { iata: 'TLL', city: 'Tallinn' },

  // ── Greece, Cyprus & Malta ────────────────────────────────────────────────
  LGAV: { iata: 'ATH', city: 'Athens' },
  LGTS: { iata: 'SKG', city: 'Thessaloniki' },
  LGRP: { iata: 'RHO', city: 'Rhodes' },
  LGKR: { iata: 'CFU', city: 'Corfu' },
  LGIR: { iata: 'HER', city: 'Heraklion' },
  LGMK: { iata: 'JMK', city: 'Mykonos' },
  LGSA: { iata: 'CHQ', city: 'Chania' },
  LGKO: { iata: 'KGS', city: 'Kos' },
  LCLK: { iata: 'LCA', city: 'Larnaca' },
  LCPH: { iata: 'PFO', city: 'Paphos' },
  LMML: { iata: 'MLA', city: 'Malta' },

  // ── Turkey ────────────────────────────────────────────────────────────────
  LTFM: { iata: 'IST', city: 'Istanbul' },
  LTAC: { iata: 'ESB', city: 'Ankara' },
  LTAI: { iata: 'AYT', city: 'Antalya' },
  LTBJ: { iata: 'ADB', city: 'Izmir' },
  LTBS: { iata: 'DLM', city: 'Dalaman' },

  // ── Middle East ───────────────────────────────────────────────────────────
  OMDB: { iata: 'DXB', city: 'Dubai' },
  OMAA: { iata: 'AUH', city: 'Abu Dhabi' },
  OTHH: { iata: 'DOH', city: 'Doha' },
  OBBI: { iata: 'BAH', city: 'Manama' },
  OEJN: { iata: 'JED', city: 'Jeddah' },
  OERK: { iata: 'RUH', city: 'Riyadh' },
  LLBG: { iata: 'TLV', city: 'Tel Aviv' },
  OJAM: { iata: 'AMM', city: 'Amman' },
  OKBK: { iata: 'KWI', city: 'Kuwait City' },

  // ── Asia ──────────────────────────────────────────────────────────────────
  VHHH: { iata: 'HKG', city: 'Hong Kong' },
  WSSS: { iata: 'SIN', city: 'Singapore' },
  VTBS: { iata: 'BKK', city: 'Bangkok' },
  VTBD: { iata: 'DMK', city: 'Bangkok' },
  WMKK: { iata: 'KUL', city: 'Kuala Lumpur' },
  RCTP: { iata: 'TPE', city: 'Taipei' },
  RKSI: { iata: 'ICN', city: 'Seoul' },
  RJTT: { iata: 'HND', city: 'Tokyo' },
  RJAA: { iata: 'NRT', city: 'Tokyo' },
  RJBB: { iata: 'KIX', city: 'Osaka' },
  ZBAA: { iata: 'PEK', city: 'Beijing' },
  ZBAD: { iata: 'PKX', city: 'Beijing' },
  ZSPD: { iata: 'PVG', city: 'Shanghai' },
  ZSSS: { iata: 'SHA', city: 'Shanghai' },
  ZGGG: { iata: 'CAN', city: 'Guangzhou' },
  VABB: { iata: 'BOM', city: 'Mumbai' },
  VIDP: { iata: 'DEL', city: 'Delhi' },
  VOMM: { iata: 'MAA', city: 'Chennai' },
  VOBL: { iata: 'BLR', city: 'Bangalore' },
  VECC: { iata: 'CCU', city: 'Kolkata' },
  OPKC: { iata: 'KHI', city: 'Karachi' },

  // ── North America ─────────────────────────────────────────────────────────
  KJFK: { iata: 'JFK', city: 'New York' },
  KLAX: { iata: 'LAX', city: 'Los Angeles' },
  KORD: { iata: 'ORD', city: 'Chicago' },
  KATL: { iata: 'ATL', city: 'Atlanta' },
  KDFW: { iata: 'DFW', city: 'Dallas' },
  KSFO: { iata: 'SFO', city: 'San Francisco' },
  KMIA: { iata: 'MIA', city: 'Miami' },
  KBOS: { iata: 'BOS', city: 'Boston' },
  KEWR: { iata: 'EWR', city: 'Newark' },
  KIAD: { iata: 'IAD', city: 'Washington' },
  KDCA: { iata: 'DCA', city: 'Washington' },
  KLGA: { iata: 'LGA', city: 'New York' },
  KDEN: { iata: 'DEN', city: 'Denver' },
  KPHX: { iata: 'PHX', city: 'Phoenix' },
  KLAS: { iata: 'LAS', city: 'Las Vegas' },
  KSEA: { iata: 'SEA', city: 'Seattle' },
  KMSP: { iata: 'MSP', city: 'Minneapolis' },
  KDTW: { iata: 'DTW', city: 'Detroit' },
  KIAH: { iata: 'IAH', city: 'Houston' },
  CYYZ: { iata: 'YYZ', city: 'Toronto' },
  CYVR: { iata: 'YVR', city: 'Vancouver' },
  CYUL: { iata: 'YUL', city: 'Montreal' },
  CYYC: { iata: 'YYC', city: 'Calgary' },
  MMMX: { iata: 'MEX', city: 'Mexico City' },
  MMUN: { iata: 'CUN', city: 'Cancún' },

  // ── Caribbean (Dutch Caribbean — major KLM network) ──────────────────────
  TNCC: { iata: 'CUR', city: 'Willemstad' },
  TNCB: { iata: 'BON', city: 'Kralendijk' },
  TNCA: { iata: 'AUA', city: 'Oranjestad' },

  // ── South America ─────────────────────────────────────────────────────────
  SBGR: { iata: 'GRU', city: 'São Paulo' },
  SBGL: { iata: 'GIG', city: 'Rio de Janeiro' },
  SAEZ: { iata: 'EZE', city: 'Buenos Aires' },
  SCEL: { iata: 'SCL', city: 'Santiago' },
  SKBO: { iata: 'BOG', city: 'Bogotá' },
  SPIM: { iata: 'LIM', city: 'Lima' },
  SVMI: { iata: 'CCS', city: 'Caracas' },
  SMJP: { iata: 'PBM', city: 'Paramaribo' },

  // ── Africa ────────────────────────────────────────────────────────────────
  FAOR: { iata: 'JNB', city: 'Johannesburg' },
  FACT: { iata: 'CPT', city: 'Cape Town' },
  HECA: { iata: 'CAI', city: 'Cairo' },
  GMMN: { iata: 'CMN', city: 'Casablanca' },
  DTTA: { iata: 'TUN', city: 'Tunis' },
  DAAG: { iata: 'ALG', city: 'Algiers' },
  HAAB: { iata: 'ADD', city: 'Addis Ababa' },
  DNMM: { iata: 'LOS', city: 'Lagos' },
  HKJK: { iata: 'NBO', city: 'Nairobi' },
  FNLU: { iata: 'LAD', city: 'Luanda' },
  FIMP: { iata: 'MRU', city: 'Port Louis' },

  // ── Australia / Pacific ───────────────────────────────────────────────────
  YSSY: { iata: 'SYD', city: 'Sydney' },
  YMML: { iata: 'MEL', city: 'Melbourne' },
  YBBN: { iata: 'BNE', city: 'Brisbane' },
  YPPH: { iata: 'PER', city: 'Perth' },
  NZAA: { iata: 'AKL', city: 'Auckland' },
  NZCH: { iata: 'CHC', city: 'Christchurch' },
};

/**
 * Look up an airport by ICAO code.
 *
 * Always returns an object so callers don't need null-checks on every field:
 *   - Known airport   → { icao, iata, city }
 *   - Unknown airport → { icao, iata: icao, city: null }  (ICAO used as fallback IATA)
 *   - No code given   → null
 */
function getAirport(icaoCode) {
  if (!icaoCode) return null;

  const icao = icaoCode.toUpperCase();
  const entry = AIRPORTS[icao];

  if (entry) {
    return { icao, iata: entry.iata, city: entry.city };
  }

  // Unknown airport: fall back to showing the raw ICAO code
  return { icao, iata: icao, city: null };
}

module.exports = { getAirport, AIRPORTS };
