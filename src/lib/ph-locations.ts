// Philippine provinces and cities data (PSGC-based)
// Used for location dropdowns throughout the platform

export interface Province {
  code: string;
  name: string;
  region: string;
}

export interface City {
  code: string;
  name: string;
  provinceCode: string;
}

export const PROVINCES: Province[] = [
  { code: "PH-ABR", name: "Abra", region: "CAR" },
  { code: "PH-AGN", name: "Agusan del Norte", region: "XIII" },
  { code: "PH-AGS", name: "Agusan del Sur", region: "XIII" },
  { code: "PH-AKL", name: "Aklan", region: "VI" },
  { code: "PH-ALB", name: "Albay", region: "V" },
  { code: "PH-ANT", name: "Antique", region: "VI" },
  { code: "PH-APY", name: "Apayao", region: "CAR" },
  { code: "PH-AUR", name: "Aurora", region: "III" },
  { code: "PH-BAS", name: "Basilan", region: "IX" },
  { code: "PH-BAN", name: "Bataan", region: "III" },
  { code: "PH-BTN", name: "Batanes", region: "II" },
  { code: "PH-BTG", name: "Batangas", region: "IV-A" },
  { code: "PH-BEN", name: "Benguet", region: "CAR" },
  { code: "PH-BIL", name: "Biliran", region: "VIII" },
  { code: "PH-BOH", name: "Bohol", region: "VII" },
  { code: "PH-BUK", name: "Bukidnon", region: "X" },
  { code: "PH-BUL", name: "Bulacan", region: "III" },
  { code: "PH-CAG", name: "Cagayan", region: "II" },
  { code: "PH-CAN", name: "Camarines Norte", region: "V" },
  { code: "PH-CAS", name: "Camarines Sur", region: "V" },
  { code: "PH-CAM", name: "Camiguin", region: "X" },
  { code: "PH-CAP", name: "Capiz", region: "VI" },
  { code: "PH-CAT", name: "Catanduanes", region: "V" },
  { code: "PH-CAV", name: "Cavite", region: "IV-A" },
  { code: "PH-CEB", name: "Cebu", region: "VII" },
  { code: "PH-COM", name: "Compostela Valley (Davao de Oro)", region: "XI" },
  { code: "PH-DAO", name: "Davao del Norte", region: "XI" },
  { code: "PH-DAS", name: "Davao del Sur", region: "XI" },
  { code: "PH-DAC", name: "Davao de Oro", region: "XI" },
  { code: "PH-DAO2", name: "Davao Occidental", region: "XI" },
  { code: "PH-DAO3", name: "Davao Oriental", region: "XI" },
  { code: "PH-DIN", name: "Dinagat Islands", region: "XIII" },
  { code: "PH-EAS", name: "Eastern Samar", region: "VIII" },
  { code: "PH-GUI", name: "Guimaras", region: "VI" },
  { code: "PH-IFU", name: "Ifugao", region: "CAR" },
  { code: "PH-ILN", name: "Ilocos Norte", region: "I" },
  { code: "PH-ILS", name: "Ilocos Sur", region: "I" },
  { code: "PH-ILI", name: "Iloilo", region: "VI" },
  { code: "PH-ISA", name: "Isabela", region: "II" },
  { code: "PH-KAL", name: "Kalinga", region: "CAR" },
  { code: "PH-LAN", name: "La Union", region: "I" },
  { code: "PH-LAG", name: "Laguna", region: "IV-A" },
  { code: "PH-LDS", name: "Lanao del Sur", region: "XII" },
  { code: "PH-LDN", name: "Lanao del Norte", region: "X" },
  { code: "PH-LEY", name: "Leyte", region: "VIII" },
  { code: "PH-MAG", name: "Maguindanao", region: "BARMM" },
  { code: "PH-MAD", name: "Marinduque", region: "IV-B" },
  { code: "PH-MAS", name: "Masbate", region: "V" },
  { code: "PH-MDN", name: "Misamis Occidental", region: "X" },
  { code: "PH-MDR", name: "Misamis Oriental", region: "X" },
  { code: "PH-MNT", name: "Mountain Province", region: "CAR" },
  { code: "PH-NCO", name: "Cotabato (North)", region: "XII" },
  { code: "PH-NEC", name: "Negros Occidental", region: "VI" },
  { code: "PH-NER", name: "Negros Oriental", region: "VII" },
  { code: "PH-NSA", name: "Northern Samar", region: "VIII" },
  { code: "PH-NUE", name: "Nueva Ecija", region: "III" },
  { code: "PH-NUV", name: "Nueva Vizcaya", region: "II" },
  { code: "PH-MDC", name: "Occidental Mindoro", region: "IV-B" },
  { code: "PH-MOR", name: "Oriental Mindoro", region: "IV-B" },
  { code: "PH-PAL", name: "Palawan", region: "IV-B" },
  { code: "PH-PAM", name: "Pampanga", region: "III" },
  { code: "PH-PAN", name: "Pangasinan", region: "I" },
  { code: "PH-QUE", name: "Quezon", region: "IV-A" },
  { code: "PH-QUI", name: "Quirino", region: "II" },
  { code: "PH-RIZ", name: "Rizal", region: "IV-A" },
  { code: "PH-ROM", name: "Romblon", region: "IV-B" },
  { code: "PH-WSA", name: "Samar (Western)", region: "VIII" },
  { code: "PH-SAR", name: "Sarangani", region: "XII" },
  { code: "PH-SIG", name: "Siquijor", region: "VII" },
  { code: "PH-SOR", name: "Sorsogon", region: "V" },
  { code: "PH-SCO", name: "South Cotabato", region: "XII" },
  { code: "PH-SLE", name: "Southern Leyte", region: "VIII" },
  { code: "PH-SUK", name: "Sultan Kudarat", region: "XII" },
  { code: "PH-SLU", name: "Sulu", region: "BARMM" },
  { code: "PH-SUN", name: "Surigao del Norte", region: "XIII" },
  { code: "PH-SUS", name: "Surigao del Sur", region: "XIII" },
  { code: "PH-TAR", name: "Tarlac", region: "III" },
  { code: "PH-TAW", name: "Tawi-Tawi", region: "BARMM" },
  { code: "PH-ZMB", name: "Zambales", region: "III" },
  { code: "PH-ZAN", name: "Zamboanga del Norte", region: "IX" },
  { code: "PH-ZAS", name: "Zamboanga del Sur", region: "IX" },
  { code: "PH-ZSI", name: "Zamboanga Sibugay", region: "IX" },
  // Metro Manila (NCR)
  { code: "PH-NCR", name: "Metro Manila (NCR)", region: "NCR" },
];

// Major cities per province (representative list)
export const CITIES: City[] = [
  // Metro Manila
  { code: "QC", name: "Quezon City", provinceCode: "PH-NCR" },
  { code: "MNL", name: "Manila", provinceCode: "PH-NCR" },
  { code: "MKT", name: "Makati", provinceCode: "PH-NCR" },
  { code: "TGG", name: "Taguig", provinceCode: "PH-NCR" },
  { code: "PSY", name: "Pasay", provinceCode: "PH-NCR" },
  { code: "PSG", name: "Pasig", provinceCode: "PH-NCR" },
  { code: "MND", name: "Mandaluyong", provinceCode: "PH-NCR" },
  { code: "MRK", name: "Marikina", provinceCode: "PH-NCR" },
  { code: "PRQ", name: "Parañaque", provinceCode: "PH-NCR" },
  { code: "LPA", name: "Las Piñas", provinceCode: "PH-NCR" },
  { code: "VLZ", name: "Valenzuela", provinceCode: "PH-NCR" },
  { code: "CLK", name: "Caloocan", provinceCode: "PH-NCR" },
  { code: "MRW", name: "Malabon", provinceCode: "PH-NCR" },
  { code: "NBT", name: "Navotas", provinceCode: "PH-NCR" },
  { code: "MTG", name: "Muntinlupa", provinceCode: "PH-NCR" },
  { code: "SJD", name: "San Juan", provinceCode: "PH-NCR" },
  // Cebu
  { code: "CEB", name: "Cebu City", provinceCode: "PH-CEB" },
  { code: "LPC", name: "Lapu-Lapu City", provinceCode: "PH-CEB" },
  { code: "MDB", name: "Mandaue City", provinceCode: "PH-CEB" },
  { code: "TLO", name: "Toledo", provinceCode: "PH-CEB" },
  // Davao
  { code: "DVO", name: "Davao City", provinceCode: "PH-DAO" },
  // Cavite
  { code: "DAS", name: "Dasmariñas", provinceCode: "PH-CAV" },
  { code: "BCC", name: "Bacoor", provinceCode: "PH-CAV" },
  { code: "GEN", name: "General Trias", provinceCode: "PH-CAV" },
  { code: "IMC", name: "Imus", provinceCode: "PH-CAV" },
  { code: "CVT", name: "Cavite City", provinceCode: "PH-CAV" },
  // Laguna
  { code: "SCB", name: "Santa Rosa", provinceCode: "PH-LAG" },
  { code: "CGY", name: "Calamba", provinceCode: "PH-LAG" },
  { code: "SPC", name: "San Pedro", provinceCode: "PH-LAG" },
  // Bulacan
  { code: "MLD", name: "Malolos", provinceCode: "PH-BUL" },
  { code: "MDZ", name: "Meycauayan", provinceCode: "PH-BUL" },
  { code: "MAL", name: "Marilao", provinceCode: "PH-BUL" },
  // Pampanga
  { code: "SAF", name: "San Fernando", provinceCode: "PH-PAM" },
  { code: "ANG", name: "Angeles City", provinceCode: "PH-PAM" },
  { code: "MCR", name: "Mabalacat", provinceCode: "PH-PAM" },
  // Iloilo
  { code: "ILO", name: "Iloilo City", provinceCode: "PH-ILI" },
  // Batangas
  { code: "BAT", name: "Batangas City", provinceCode: "PH-BTG" },
  { code: "LPA2", name: "Lipa", provinceCode: "PH-BTG" },
  { code: "TAG", name: "Tanauan", provinceCode: "PH-BTG" },
  // Rizal
  { code: "ANT2", name: "Antipolo", provinceCode: "PH-RIZ" },
  // Cagayan de Oro
  { code: "CDO", name: "Cagayan de Oro", provinceCode: "PH-MDR" },
  // Zamboanga
  { code: "ZAM", name: "Zamboanga City", provinceCode: "PH-ZAS" },
  // Baguio
  { code: "BAG", name: "Baguio City", provinceCode: "PH-BEN" },
];

export function getCitiesForProvince(provinceCode: string): City[] {
  return CITIES.filter((c) => c.provinceCode === provinceCode);
}

export function getProvinceName(code: string): string {
  return PROVINCES.find((p) => p.code === code)?.name ?? code;
}

export function getCityName(code: string): string {
  return CITIES.find((c) => c.code === code)?.name ?? code;
}
