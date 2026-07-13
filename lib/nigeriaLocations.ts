// Nigeria States, LGAs, and Popular Areas with default delivery fees
// Used by storefront (checkout) and admin (locations management)

export interface NigeriaArea {
  state: string;
  lga: string;
  area: string;
  defaultFee: number;
}

export interface NigeriaState {
  state: string;
  lgas: {
    name: string;
    areas: { area: string; defaultFee: number }[];
  }[];
}

export const NIGERIA_LOCATIONS: NigeriaState[] = [
  {
    state: 'Lagos',
    lgas: [
      {
        name: 'Lagos Island',
        areas: [
          { area: 'Lagos Island', defaultFee: 1500 },
          { area: 'Victoria Island (VI)', defaultFee: 1500 },
          { area: 'Ikoyi', defaultFee: 1800 },
          { area: 'Onikan', defaultFee: 1500 },
          { area: 'Marina', defaultFee: 1500 },
          { area: 'Apongbon', defaultFee: 1500 },
          { area: 'Obalende', defaultFee: 1500 },
        ],
      },
      {
        name: 'Eti-Osa',
        areas: [
          { area: 'Lekki Phase 1', defaultFee: 2000 },
          { area: 'Lekki Phase 2', defaultFee: 2500 },
          { area: 'Lekki Conservation Centre', defaultFee: 2500 },
          { area: 'Chevron / Lekki', defaultFee: 2500 },
          { area: 'Ajah', defaultFee: 3000 },
          { area: 'Abraham Adesanya', defaultFee: 3000 },
          { area: 'Sangotedo', defaultFee: 3000 },
          { area: 'Lakowe', defaultFee: 3500 },
          { area: 'Ikota / VGC', defaultFee: 2800 },
          { area: 'Ilasan', defaultFee: 2000 },
          { area: 'Idado', defaultFee: 2500 },
        ],
      },
      {
        name: 'Ikeja',
        areas: [
          { area: 'Ikeja GRA', defaultFee: 1500 },
          { area: 'Alausa / Secretariat', defaultFee: 1500 },
          { area: 'Maryland', defaultFee: 1500 },
          { area: 'Oregun', defaultFee: 1500 },
          { area: 'Ojodu Berger', defaultFee: 1800 },
          { area: 'Allen Avenue', defaultFee: 1500 },
          { area: 'Computer Village', defaultFee: 1500 },
          { area: 'Agidingbi', defaultFee: 1500 },
        ],
      },
      {
        name: 'Surulere',
        areas: [
          { area: 'Surulere', defaultFee: 1500 },
          { area: 'Ojuelegba', defaultFee: 1500 },
          { area: 'Aguda', defaultFee: 1500 },
          { area: 'Bode Thomas', defaultFee: 1500 },
          { area: 'Itire', defaultFee: 1500 },
          { area: 'National Stadium', defaultFee: 1500 },
        ],
      },
      {
        name: 'Yaba',
        areas: [
          { area: 'Yaba', defaultFee: 1200 },
          { area: 'Sabo', defaultFee: 1200 },
          { area: 'Unilag / Akoka', defaultFee: 1200 },
          { area: 'Abule Oja', defaultFee: 1200 },
          { area: 'Jibowu', defaultFee: 1200 },
        ],
      },
      {
        name: 'Mushin',
        areas: [
          { area: 'Mushin', defaultFee: 1500 },
          { area: 'Oshodi', defaultFee: 1500 },
          { area: 'Papa Ajao', defaultFee: 1500 },
          { area: 'Ladipo', defaultFee: 1500 },
        ],
      },
      {
        name: 'Alimosho',
        areas: [
          { area: 'Egbeda', defaultFee: 2000 },
          { area: 'Alimosho', defaultFee: 2000 },
          { area: 'Ipaja', defaultFee: 2000 },
          { area: 'Ayobo', defaultFee: 2500 },
          { area: 'Dopemu', defaultFee: 2000 },
          { area: 'Idimu', defaultFee: 2000 },
          { area: 'Igando', defaultFee: 2000 },
          { area: 'Ijegun', defaultFee: 2000 },
        ],
      },
      {
        name: 'Ikorodu',
        areas: [
          { area: 'Ikorodu Town', defaultFee: 4000 },
          { area: 'Benson', defaultFee: 4000 },
          { area: 'Ijede', defaultFee: 4500 },
          { area: 'Imota', defaultFee: 4500 },
          { area: 'Igbogbo', defaultFee: 4000 },
          { area: 'Owutu', defaultFee: 4000 },
        ],
      },
      {
        name: 'Ajeromi-Ifelodun',
        areas: [
          { area: 'Badagry', defaultFee: 4500 },
          { area: 'Ajegunle', defaultFee: 2000 },
          { area: 'Amukoko', defaultFee: 2000 },
          { area: 'Orile', defaultFee: 2000 },
        ],
      },
      {
        name: 'Lagos Mainland',
        areas: [
          { area: 'Ebute Metta', defaultFee: 1300 },
          { area: 'Oyingbo', defaultFee: 1300 },
          { area: 'Costain', defaultFee: 1300 },
          { area: 'Apapa', defaultFee: 2000 },
        ],
      },
      {
        name: 'Shomolu',
        areas: [
          { area: 'Shomolu', defaultFee: 1500 },
          { area: 'Bariga', defaultFee: 1500 },
          { area: 'Fadeyi', defaultFee: 1500 },
          { area: 'Onipanu', defaultFee: 1500 },
        ],
      },
      {
        name: 'Kosofe',
        areas: [
          { area: 'Ketu', defaultFee: 1800 },
          { area: 'Mile 12', defaultFee: 1800 },
          { area: 'Ojota', defaultFee: 1800 },
          { area: 'Magodo', defaultFee: 2000 },
          { area: 'Shangisha', defaultFee: 2000 },
          { area: 'Gomez / Alapere', defaultFee: 1800 },
        ],
      },
      {
        name: 'Agege',
        areas: [
          { area: 'Agege', defaultFee: 2000 },
          { area: 'Abule Egba', defaultFee: 2000 },
          { area: 'Oko Oba', defaultFee: 2000 },
          { area: 'Pen Cinema', defaultFee: 2000 },
        ],
      },
      {
        name: 'Ifako-Ijaye',
        areas: [
          { area: 'Ifako', defaultFee: 2000 },
          { area: 'Ogba', defaultFee: 1800 },
          { area: 'Iju', defaultFee: 2200 },
          { area: 'Fagba', defaultFee: 2000 },
        ],
      },
      {
        name: 'Epe',
        areas: [
          { area: 'Epe Town', defaultFee: 5000 },
          { area: 'Ijebu-Ode Road (Epe)', defaultFee: 5000 },
        ],
      },
    ],
  },
  {
    state: 'Abuja (FCT)',
    lgas: [
      {
        name: 'Municipal Area Council',
        areas: [
          { area: 'Central Business District (CBD)', defaultFee: 3000 },
          { area: 'Wuse Zone 1–7', defaultFee: 3000 },
          { area: 'Garki', defaultFee: 3000 },
          { area: 'Asokoro', defaultFee: 3200 },
          { area: 'Maitama', defaultFee: 3500 },
          { area: 'Utako', defaultFee: 3000 },
          { area: 'Jabi', defaultFee: 3000 },
          { area: 'Wuse 2', defaultFee: 3000 },
        ],
      },
      {
        name: 'Bwari',
        areas: [
          { area: 'Gwarinpa', defaultFee: 3500 },
          { area: 'Kubwa', defaultFee: 4000 },
          { area: 'Dawaki', defaultFee: 3500 },
          { area: 'Life Camp', defaultFee: 3200 },
          { area: 'Lugbe', defaultFee: 3500 },
        ],
      },
      {
        name: 'Kuje',
        areas: [
          { area: 'Kuje', defaultFee: 5000 },
          { area: 'Gudu', defaultFee: 3500 },
          { area: 'Apo', defaultFee: 3200 },
          { area: 'Lokogoma', defaultFee: 4000 },
        ],
      },
      {
        name: 'Abaji',
        areas: [
          { area: 'Nyanya', defaultFee: 3500 },
          { area: 'Mararaba', defaultFee: 4000 },
          { area: 'Karu', defaultFee: 4000 },
        ],
      },
    ],
  },
  {
    state: 'Rivers',
    lgas: [
      {
        name: 'Port Harcourt',
        areas: [
          { area: 'Port Harcourt City', defaultFee: 3000 },
          { area: 'GRA Phase 1–3', defaultFee: 3200 },
          { area: 'Trans Amadi', defaultFee: 3000 },
          { area: 'Rumuola', defaultFee: 3000 },
          { area: 'Diobu / Mile 1', defaultFee: 3000 },
          { area: 'Rumola', defaultFee: 3000 },
          { area: 'Rumuokoro', defaultFee: 3500 },
          { area: 'Owerri Road (PH)', defaultFee: 3500 },
          { area: 'Eleme', defaultFee: 4000 },
          { area: 'Obio-Akpor', defaultFee: 3500 },
        ],
      },
    ],
  },
  {
    state: 'Oyo',
    lgas: [
      {
        name: 'Ibadan North',
        areas: [
          { area: 'Bodija', defaultFee: 3000 },
          { area: 'UI / University of Ibadan', defaultFee: 3000 },
          { area: 'Agodi GRA', defaultFee: 3000 },
          { area: 'Iyaganku GRA', defaultFee: 3000 },
          { area: 'Sango', defaultFee: 3000 },
          { area: 'Mokola', defaultFee: 3000 },
          { area: 'Dugbe', defaultFee: 3000 },
          { area: 'Ring Road', defaultFee: 3000 },
          { area: 'Challenge', defaultFee: 3200 },
          { area: 'Ojoo', defaultFee: 3500 },
          { area: 'Apata', defaultFee: 3200 },
          { area: 'Oluyole', defaultFee: 3500 },
          { area: 'New Garage / Iwo Road', defaultFee: 3000 },
          { area: 'Ashi / Basorun', defaultFee: 3200 },
        ],
      },
    ],
  },
  {
    state: 'Kano',
    lgas: [
      {
        name: 'Kano Municipal',
        areas: [
          { area: 'Kano City Centre', defaultFee: 3500 },
          { area: 'Sabon Gari', defaultFee: 3500 },
          { area: 'Bompai GRA', defaultFee: 3500 },
          { area: 'Nassarawa GRA', defaultFee: 3500 },
          { area: 'Zoo Road', defaultFee: 3500 },
          { area: 'Fagge', defaultFee: 3500 },
          { area: 'Tarauni', defaultFee: 4000 },
          { area: 'Kurna', defaultFee: 4000 },
        ],
      },
    ],
  },
  {
    state: 'Delta',
    lgas: [
      {
        name: 'Oshimili South',
        areas: [
          { area: 'Asaba', defaultFee: 4000 },
          { area: 'Okpanam', defaultFee: 4000 },
        ],
      },
      {
        name: 'Warri South',
        areas: [
          { area: 'Warri', defaultFee: 4500 },
          { area: 'Effurun', defaultFee: 4500 },
          { area: 'Agbarho', defaultFee: 5000 },
        ],
      },
    ],
  },
  {
    state: 'Anambra',
    lgas: [
      {
        name: 'Awka South',
        areas: [
          { area: 'Awka', defaultFee: 4000 },
          { area: 'Amawbia', defaultFee: 4000 },
        ],
      },
      {
        name: 'Onitsha North',
        areas: [
          { area: 'Onitsha', defaultFee: 4000 },
          { area: 'Fegge', defaultFee: 4000 },
          { area: 'GRA Onitsha', defaultFee: 4000 },
        ],
      },
    ],
  },
  {
    state: 'Enugu',
    lgas: [
      {
        name: 'Enugu North',
        areas: [
          { area: 'Enugu City', defaultFee: 4500 },
          { area: 'GRA Enugu', defaultFee: 4500 },
          { area: 'Independence Layout', defaultFee: 4500 },
          { area: 'New Haven', defaultFee: 4500 },
          { area: 'Trans-Ekulu', defaultFee: 5000 },
        ],
      },
    ],
  },
  {
    state: 'Edo',
    lgas: [
      {
        name: 'Oredo',
        areas: [
          { area: 'Benin City', defaultFee: 4000 },
          { area: 'GRA Benin', defaultFee: 4000 },
          { area: 'Ugbowo', defaultFee: 4000 },
          { area: 'New Benin', defaultFee: 4000 },
          { area: 'Sapele Road', defaultFee: 4000 },
        ],
      },
    ],
  },
  {
    state: 'Imo',
    lgas: [
      {
        name: 'Owerri Municipal',
        areas: [
          { area: 'Owerri', defaultFee: 4500 },
          { area: 'New Owerri', defaultFee: 4500 },
          { area: 'Ikenegbu', defaultFee: 4500 },
          { area: 'World Bank Area', defaultFee: 4500 },
        ],
      },
    ],
  },
  {
    state: 'Ogun',
    lgas: [
      {
        name: 'Sagamu',
        areas: [
          { area: 'Sagamu', defaultFee: 3500 },
          { area: 'Redemption Camp / Mowe', defaultFee: 3000 },
          { area: 'Sagamu Interchange', defaultFee: 3500 },
        ],
      },
      {
        name: 'Abeokuta South',
        areas: [
          { area: 'Abeokuta', defaultFee: 4000 },
          { area: 'Panseke', defaultFee: 4000 },
          { area: 'Ibara GRA', defaultFee: 4000 },
          { area: 'Kemta', defaultFee: 4000 },
        ],
      },
      {
        name: 'Ifo',
        areas: [
          { area: 'Sango-Otta', defaultFee: 2500 },
          { area: 'Ifo', defaultFee: 3000 },
          { area: 'Ota', defaultFee: 2500 },
        ],
      },
    ],
  },
  {
    state: 'Kwara',
    lgas: [
      {
        name: 'Ilorin South',
        areas: [
          { area: 'Ilorin', defaultFee: 4500 },
          { area: 'GRA Ilorin', defaultFee: 4500 },
          { area: 'Oke Ose', defaultFee: 4500 },
          { area: 'Tanke', defaultFee: 4500 },
        ],
      },
    ],
  },
  {
    state: 'Cross River',
    lgas: [
      {
        name: 'Calabar Municipal',
        areas: [
          { area: 'Calabar', defaultFee: 5000 },
          { area: 'GRA Calabar', defaultFee: 5000 },
          { area: 'State Housing / Calabar South', defaultFee: 5000 },
        ],
      },
    ],
  },
  {
    state: 'Kaduna',
    lgas: [
      {
        name: 'Kaduna South',
        areas: [
          { area: 'Kaduna City', defaultFee: 4000 },
          { area: 'Barnawa', defaultFee: 4000 },
          { area: 'Ungwan Rimi GRA', defaultFee: 4000 },
          { area: 'Television (TV) Area', defaultFee: 4000 },
        ],
      },
    ],
  },
  {
    state: 'Osun',
    lgas: [
      {
        name: 'Osogbo',
        areas: [
          { area: 'Osogbo', defaultFee: 4500 },
          { area: 'Oke-Baale', defaultFee: 4500 },
          { area: 'Alekuwodo', defaultFee: 4500 },
        ],
      },
    ],
  },
  {
    state: 'Ondo',
    lgas: [
      {
        name: 'Akure South',
        areas: [
          { area: 'Akure', defaultFee: 5000 },
          { area: 'Oke-Aro', defaultFee: 5000 },
          { area: 'Alagbaka GRA', defaultFee: 5000 },
        ],
      },
    ],
  },
  {
    state: 'Abia',
    lgas: [
      {
        name: 'Aba South',
        areas: [
          { area: 'Aba', defaultFee: 5000 },
          { area: 'Ariaria Market', defaultFee: 5000 },
          { area: 'Factory Road', defaultFee: 5000 },
        ],
      },
      {
        name: 'Umuahia North',
        areas: [
          { area: 'Umuahia', defaultFee: 5000 },
        ],
      },
    ],
  },
  {
    state: 'Bayelsa',
    lgas: [
      {
        name: 'Yenagoa',
        areas: [
          { area: 'Yenagoa', defaultFee: 5500 },
          { area: 'Opolo', defaultFee: 5500 },
          { area: 'Amarata', defaultFee: 5500 },
        ],
      },
    ],
  },
  {
    state: 'Nassarawa',
    lgas: [
      {
        name: 'Lafia',
        areas: [
          { area: 'Lafia', defaultFee: 5000 },
        ],
      },
    ],
  },
  {
    state: 'Niger',
    lgas: [
      {
        name: 'Minna',
        areas: [
          { area: 'Minna', defaultFee: 5000 },
          { area: 'Bosso', defaultFee: 5000 },
          { area: 'Chanchaga', defaultFee: 5000 },
        ],
      },
    ],
  },
];

// Flat list for quick lookups
export const ALL_NIGERIA_AREAS: { state: string; lga: string; area: string; defaultFee: number }[] =
  NIGERIA_LOCATIONS.flatMap(s =>
    s.lgas.flatMap(l =>
      l.areas.map(a => ({
        state: s.state,
        lga: l.name,
        area: a.area,
        defaultFee: a.defaultFee,
      }))
    )
  );

export const NIGERIA_STATE_NAMES = NIGERIA_LOCATIONS.map(s => s.state);

export function getAreasForState(state: string) {
  return NIGERIA_LOCATIONS.find(s => s.state === state)?.lgas || [];
}
