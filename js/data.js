// ============================================================
// REISEDATA — Devon & Cornwall 2026
// Rediger her for å oppdatere innhold på nettsiden
// ============================================================

const TRIP = {
  meta: {
    title: "Devon & Cornwall 2026",
    travelers: ["Eirin", "Stig", "Pia", "Thomas"],
    // Avreise: 5. juli kl 08:00 norsk tid (CEST = UTC+2)
    departure: new Date("2026-07-05T06:00:00Z"),
    // Hjemkomst: 12. juli kl 18:00 Gatwick-levering
    returnDate: new Date("2026-07-12T16:00:00Z"),

    flightOut: {
      airline: "SAS",
      flightNumber: "SK803",
      departureTime: "08:00",
      departureAirport: "Oslo (OSL)",
      arrivalTime: "09:35",
      arrivalAirport: "London Heathrow (LHR)",
      date: "2026-07-05"
    },

    flightHome: {
      airline: "Norwegian",
      flightNumber: "DY1313",
      departureTime: "20:50",
      departureAirport: "London Gatwick (LGW)",
      arrivalTime: "23:55",
      arrivalAirport: "Oslo (OSL)",
      date: "2026-07-12"
    },

    car: {
      company: "Enterprise",
      confirmation: "1596547572",
      pickup: {
        location: "London Heathrow Airport (LHR)",
        time: "10:30",
        address: "Northern Perimeter Road, Heathrow, Outer London TW6 2RY",
        phone: "+44 20 8150 1809",
        mapsUrl: "https://maps.google.com/?q=Enterprise+Car+Hire+Heathrow+Airport"
      },
      dropoff: {
        location: "London Gatwick Airport (LGW)",
        time: "18:00",
        address: "Gatwick Airport South Terminal, Lower Forecourt Road, Gatwick RH6 0NP",
        phone: "+44 1293 221659",
        mapsUrl: "https://maps.google.com/?q=Enterprise+Car+Hire+Gatwick+Airport"
      }
    }
  },

  hotels: [
    {
      id: "housel-bay",
      name: "Housel Bay Hotel",
      location: "Lizard Peninsula",
      address: "Housel Bay Road, Helston, Cornwall TR12 7PG",
      phone: null,
      checkIn: "2026-07-05",
      checkOut: "2026-07-07",
      nights: 2,
      coords: [49.9985, -5.2065],
      mapsUrl: "https://maps.google.com/?q=Housel+Bay+Hotel+Lizard+Cornwall",
      description: "Historisk hotell på selve Lizard-halvøya, med utsikt over Housel Bay og havet. Englands sørligste hotell.",
      bookedBy: "Pia"
    },
    {
      id: "alfred-wallis",
      name: "Alfred Wallis — Flat 4",
      location: "St. Ives",
      address: "Tate Reach Barn A, Woon Barnoon, St Ives, Cornwall TR26 1JD",
      phone: null,
      checkIn: "2026-07-07",
      checkOut: "2026-07-10",
      nights: 3,
      coords: [50.2127, -5.4806],
      mapsUrl: "https://maps.google.com/?q=Woon+Barnoon+St+Ives+TR26+1JD",
      description: "Leilighet i St. Ives, oppkalt etter den berømte primitive maleren Alfred Wallis. Rett ved Tate St. Ives.",
      bookedBy: "Eirin Dolonen"
    },
    {
      id: "red-lion",
      name: "Red Lion Hotel",
      location: "Clovelly",
      address: "The Quay, Clovelly, Devon EX39 5TF",
      phone: "+44 1237 431237",
      checkIn: "2026-07-10",
      checkOut: "2026-07-11",
      nights: 1,
      coords: [50.9985, -4.3978],
      mapsUrl: "https://maps.google.com/?q=Red+Lion+Hotel+Clovelly+Devon",
      description: "Sjarmerende pub-hotell rett på kaia i det bilfrie fiskelandsbyen Clovelly. Unik beliggenhet.",
      bookedBy: "Thomas"
    },
    {
      id: "fieldhead",
      name: "Fieldhead Hotel",
      location: "Looe",
      address: "Portuan Road, Hannafore, Looe, Cornwall PL13 2DR",
      phone: "+44 1503 661005",
      checkIn: "2026-07-11",
      checkOut: "2026-07-12",
      nights: 1,
      coords: [50.3480, -4.4620],
      mapsUrl: "https://maps.google.com/?q=Fieldhead+Hotel+Looe+Cornwall",
      description: "Hotell med havutsikt i Looe. Kontinental frokost tilgjengelig (£10/pers). Innsjekk kl 15:00.",
      bookedBy: "Thomas",
      notes: "Check-in 15:00, check-out 11:00. Begrenset parkering — kom tidlig for beste sjanse."
    }
  ],

  days: [
    {
      day: 1,
      date: "2026-07-05",
      title: "London & Cornwall",
      subtitle: "Heathrow · Eden Project · Lizard",
      location: "London & Cornwall",
      hotelId: "housel-bay",
      coords: [49.9985, -5.2065],
      weatherCoords: { lat: 49.9985, lon: -5.2065 },
      tideCoords: { lat: 49.9985, lon: -5.2065, name: "Lizard / Coverack" },
      driving: { from: "London Heathrow", to: "Lizard", approx: "~360 km · ~4,5 t" },
      timeline: [
        { time: "08:00", icon: "✈️", label: "Avgang Oslo (SAS)" },
        { time: "09:35", icon: "🛬", label: "Ankomst London Heathrow (LHR)" },
        { time: "10:30", icon: "🚗", label: "Hent leiebil – Enterprise, Heathrow" },
        { time: "~13:00", icon: "🌿", label: "Stopp: The Eden Project" },
        { time: "~18:00", icon: "🏨", label: "Innsjekk Housel Bay Hotel, Lizard" }
      ],
      activities: ["eden-project"]
    },
    {
      day: 2,
      date: "2026-07-06",
      title: "Lizard Peninsula",
      subtitle: "Kynance Cove og havkanten",
      location: "Lizard Peninsula",
      hotelId: "housel-bay",
      coords: [49.9985, -5.2065],
      weatherCoords: { lat: 49.9985, lon: -5.2065 },
      tideCoords: { lat: 49.9985, lon: -5.2065, name: "Lizard / Coverack" },
      driving: null,
      timeline: [],
      activities: ["kynance-cove", "lizard-point", "helston", "cadgwith-cove", "mullion-cove"]
    },
    {
      day: 3,
      date: "2026-07-07",
      title: "Mot St. Ives",
      subtitle: "St. Michael's Mount underveis",
      location: "St. Ives",
      hotelId: "alfred-wallis",
      coords: [50.2127, -5.4806],
      weatherCoords: { lat: 50.2127, lon: -5.4806 },
      tideCoords: { lat: 50.2127, lon: -5.4806, name: "St. Ives" },
      driving: { from: "Lizard", to: "St. Ives", approx: "~50 km · ~1,5 t (m/stopp)" },
      timeline: [
        { time: "~10:00", icon: "🚗", label: "Avreise fra Housel Bay Hotel" },
        { time: "~11:00", icon: "🏰", label: "Stopp: St. Michael's Mount, Marazion" },
        { time: "~14:00", icon: "🏠", label: "Innsjekk Alfred Wallis-leiligheten, St. Ives" }
      ],
      activities: ["st-michaels-mount", "st-ives-harbour", "tate-st-ives"]
    },
    {
      day: 4,
      date: "2026-07-08",
      title: "St. Ives",
      subtitle: "Polgoon Vineyard & Penzance",
      location: "St. Ives",
      hotelId: "alfred-wallis",
      coords: [50.2127, -5.4806],
      weatherCoords: { lat: 50.2127, lon: -5.4806 },
      tideCoords: { lat: 50.2127, lon: -5.4806, name: "St. Ives" },
      driving: null,
      timeline: [],
      activities: ["polgoon-vineyard", "mousehole", "barbara-hepworth", "carbis-bay", "zennor", "godrevy"]
    },
    {
      day: 5,
      date: "2026-07-09",
      title: "St. Ives",
      subtitle: "Mousehole · Land's End-vandring",
      location: "St. Ives",
      hotelId: "alfred-wallis",
      coords: [50.2127, -5.4806],
      weatherCoords: { lat: 50.2127, lon: -5.4806 },
      tideCoords: { lat: 50.2127, lon: -5.4806, name: "St. Ives" },
      driving: null,
      timeline: [],
      activities: ["lands-end-walk", "lands-end", "port-isaac", "minack-theatre", "porthcurno-beach"]
    },
    {
      day: 6,
      date: "2026-07-10",
      title: "Mot Clovelly",
      subtitle: "Tintagel Castle · Middagen på Red Lion",
      location: "Clovelly",
      hotelId: "red-lion",
      coords: [50.9985, -4.3978],
      weatherCoords: { lat: 50.9985, lon: -4.3978 },
      tideCoords: { lat: 50.9985, lon: -4.3978, name: "Bideford / Clovelly" },
      driving: { from: "St. Ives", to: "Clovelly", approx: "~190 km · ~2,5 t (m/stopp)" },
      timeline: [
        { time: "~09:30", icon: "🚗", label: "Avreise fra St. Ives" },
        { time: "~12:00", icon: "🏰", label: "Stopp: Tintagel Castle" },
        { time: "~15:00", icon: "⚓", label: "Ankomst Clovelly — innsjekk Red Lion Hotel" },
        { time: "20:00", icon: "🍽️", label: "Middag: Harbour Restaurant, Red Lion Hotel" }
      ],
      activities: ["tintagel-castle", "clovelly-village", "harbour-restaurant", "hartland-abbey", "hartland-quay", "bucks-mills"],
      restaurant: {
        name: "Harbour Restaurant",
        hotel: "Red Lion Hotel",
        time: "20:00",
        note: "Forhåndsbestilt bord"
      }
    },
    {
      day: 7,
      date: "2026-07-11",
      title: "Looe",
      subtitle: "Polperro-tur langs kysten",
      location: "Looe",
      hotelId: "fieldhead",
      coords: [50.3533, -4.4567],
      weatherCoords: { lat: 50.3533, lon: -4.4567 },
      tideCoords: { lat: 50.3533, lon: -4.4567, name: "Looe" },
      driving: { from: "Clovelly", to: "Looe", approx: "~110 km · ~1,5 t" },
      timeline: [
        { time: "~10:00", icon: "🚗", label: "Avreise fra Red Lion Hotel" },
        { time: "~12:00", icon: "🐟", label: "Ankomst Polperro — lunsj og utforsking" },
        { time: "~15:00", icon: "🏨", label: "Innsjekk Fieldhead Hotel, Looe" }
      ],
      activities: ["polperro", "looe-island", "east-west-looe", "talland-bay", "seaton-downderry", "cawsand-kingsand"]
    },
    {
      day: 8,
      date: "2026-07-12",
      title: "Hjemreise",
      subtitle: "Looe · Gatwick",
      location: "Looe → Gatwick",
      hotelId: null,
      coords: [51.1537, -0.1821],
      weatherCoords: { lat: 50.3533, lon: -4.4567 },
      driving: { from: "Looe", to: "Gatwick Airport", approx: "~370 km · ~4 t" },
      timeline: [
        { time: "~10:00", icon: "🚗", label: "Avreise fra Fieldhead Hotel" },
        { time: "~14:30", icon: "🛣️", label: "Estimert ankomst Gatwick-området" },
        { time: "18:00", icon: "🔑", label: "Lever leiebil – Enterprise, Gatwick (LGW)" },
        { time: "20:50", icon: "🛫", label: "Avgang Gatwick — Norwegian DY1313" },
        { time: "23:55", icon: "🛬", label: "Ankomst Oslo (OSL) — hjemme igjen!" }
      ],
      activities: []
    }
  ],

  activities: {
    "eden-project": {
      id: "eden-project",
      name: "The Eden Project",
      description: "Verdens største drivhus med tropiske og middelhavsbiomer inne i en gigantisk gruve. Et ikonisk Cornwall-landemerke.",
      type: "attraksjon",
      url: "https://www.edenproject.com/",
      mapsUrl: "https://maps.google.com/?q=The+Eden+Project+Bodelva+Cornwall",
      tip: "Book billett på forhånd — det kan bli kø. Planlegg 2-3 timer.",
      suggested: true
    },
    "kynance-cove": {
      id: "kynance-cove",
      name: "Kynance Cove",
      description: "En av Cornwalls vakreste bukter med turkisblått vann, dramatiske klipper og hvit sand. Ca. 10 min kjøring fra Housel Bay Hotel.",
      type: "natur",
      url: "https://www.nationaltrust.org.uk/visit/cornwall/kynance-cove",
      mapsUrl: "https://maps.google.com/?q=Kynance+Cove+Lizard+Cornwall",
      tip: "Besøk ved lavvann — bade-mulighetene er best da. Parkering koster £6.",
      suggested: true
    },
    "lizard-point": {
      id: "lizard-point",
      name: "Lizard Point",
      description: "Det sørligste punktet på det britiske fastlandet. Dramatiske klippekanter og fyrtårn. Kort spasertur fra hotellet.",
      type: "natur",
      url: "https://maps.google.com/?q=Lizard+Point+Cornwall",
      mapsUrl: "https://maps.google.com/?q=Lizard+Point+Cornwall",
      tip: "Gå ned til Polpeor Cove nedenfor — rolig og vakkert sted.",
      suggested: true
    },
    "helston": {
      id: "helston",
      name: "Helston — Flora Day-Byen",
      description: "Sjarmerende markedsby, kjent for den årlige Flora Day-feiringen. God shopping og kafeer.",
      type: "by",
      url: "https://maps.google.com/?q=Helston+Cornwall",
      mapsUrl: "https://maps.google.com/?q=Helston+Cornwall",
      tip: "Prøv en Cornish Pasty fra en lokal baker — ikke noe annet sted gjør dem bedre.",
      suggested: false
    },
    "st-michaels-mount": {
      id: "st-michaels-mount",
      name: "St. Michael's Mount",
      description: "Magisk tidevannsøy med middelalderslott og hage. Gå over demningen ved lavvann eller ta båt ved høyvann. Nær Marazion.",
      type: "attraksjon",
      url: "https://www.nationaltrust.org.uk/visit/cornwall/st-michaels-mount",
      mapsUrl: "https://maps.google.com/?q=St+Michaels+Mount+Marazion+Cornwall",
      tip: "Sjekk tidevannstabellen på forhånd — demningen er tilgjengelig 2-3 timer rundt lavvann.",
      suggested: true
    },
    "st-ives-harbour": {
      id: "st-ives-harbour",
      name: "St. Ives Havn og Strandpromenaden",
      description: "Sjarmerende fiskehavn med pittoreske gater, kunstgallerier og fantastiske sandstrender. Porthmeor Beach er byens beste surfestrand.",
      type: "by",
      url: "https://maps.google.com/?q=St+Ives+Harbour+Cornwall",
      mapsUrl: "https://maps.google.com/?q=St+Ives+Harbour+Cornwall",
      tip: "Ta en tur opp på Knill's Steeple-haugen for panoramautsikt over St. Ives.",
      suggested: true
    },
    "tate-st-ives": {
      id: "tate-st-ives",
      name: "Tate St. Ives",
      description: "Ikonisk kunstgalleri med moderne og samtidskunst, rett ved Porthmeor Beach. Nabobygget til leiligheten vår.",
      type: "kultur",
      url: "https://www.tate.org.uk/visit/tate-st-ives",
      mapsUrl: "https://maps.google.com/?q=Tate+St+Ives+Cornwall",
      tip: "Taket gir fantastisk utsikt over havet og stranden.",
      suggested: false
    },
    "polgoon-vineyard": {
      id: "polgoon-vineyard",
      name: "Polgoon Vineyard & Orchard",
      description: "Cornwalls egen vingård nær Penzance — smaksprøver av vin, epler og epledrikk i vakre omgivelser. Ca. 15 min fra St. Ives.",
      type: "mat-og-drikke",
      url: "https://www.polgoon.com/",
      mapsUrl: "https://maps.google.com/?q=Polgoon+Vineyard+Penzance+Cornwall",
      tip: "Book vingårdsomvisning med smaksprøver på forhånd — populært tilbud.",
      suggested: true
    },
    "mousehole": {
      id: "mousehole",
      name: "Mousehole (uttales 'Mowzel')",
      description: "Et av Cornwalls mest sjarmerende fiskevær med trange smug, fargerike båter og kafeer. Start (eller slutt) på vandringen mot Land's End.",
      type: "by",
      url: "https://maps.google.com/?q=Mousehole+Cornwall",
      mapsUrl: "https://maps.google.com/?q=Mousehole+Cornwall",
      tip: "Ta en is på Ship Inn mens dere ser på krabber i havnen.",
      suggested: true
    },
    "barbara-hepworth": {
      id: "barbara-hepworth",
      name: "Barbara Hepworth Sculpture Garden",
      description: "Skulpturhagen til den berømte billedhuggeren Barbara Hepworth er bevart akkurat slik hun etterlot den. Stemningsfull og unik.",
      type: "kultur",
      url: "https://www.tate.org.uk/visit/tate-st-ives/barbara-hepworth-sculpture-garden",
      mapsUrl: "https://maps.google.com/?q=Barbara+Hepworth+Sculpture+Garden+St+Ives",
      tip: "Ligger like ved Tate St. Ives — kombiner gjerne besøket.",
      suggested: false
    },
    "carbis-bay": {
      id: "carbis-bay",
      name: "Carbis Bay Beach",
      description: "Idyllisk sandstrand like utenfor St. Ives, mer skjermet enn strendene i byen. G7-toppmøtet ble holdt her i 2021.",
      type: "natur",
      url: "https://maps.google.com/?q=Carbis+Bay+Beach+St+Ives",
      mapsUrl: "https://maps.google.com/?q=Carbis+Bay+Beach+St+Ives",
      tip: "Ta toget fra St. Ives stasjon — bare ett stopp, og togturen er i seg selv spektakulær.",
      suggested: false
    },
    "lands-end-walk": {
      id: "lands-end-walk",
      name: "Vandring: Mousehole → Land's End",
      description: "Etappe på South West Coast Path fra Mousehole til Land's End. Ca. 16 km langs dramatisk kystlinje. Ta buss tilbake fra Land's End.",
      type: "vandring",
      url: "https://www.southwestcoastpath.org.uk/",
      mapsUrl: "https://maps.google.com/?q=Mousehole+to+Lands+End+Coast+Path",
      tip: "Bus 1/1A fra Land's End til Penzance, deretter tog eller buss til St. Ives. Start tidlig og ta med niste.",
      suggested: true
    },
    "lands-end": {
      id: "lands-end",
      name: "Land's End",
      description: "Det vestligste punktet i England. Dramatiske klipper mot Atlanterhavet — det er noe spesielt ved å stå her.",
      type: "natur",
      url: "https://www.landsend-landmark.co.uk/",
      mapsUrl: "https://maps.google.com/?q=Lands+End+Cornwall",
      tip: "Gå forbi turistattraksjonen og bort til selve klippe-kanten for den ekte opplevelsen.",
      suggested: true
    },
    "port-isaac": {
      id: "port-isaac",
      name: "Port Isaac (Doc Martin-landsbyen)",
      description: "Pittoresk fiskerlandsby på Cornwalls nordkyst, kjent som filmsted for TV-serien Doc Martin. Trange smug, fiskerestauranter og sjarm.",
      type: "by",
      url: "https://maps.google.com/?q=Port+Isaac+Cornwall",
      mapsUrl: "https://maps.google.com/?q=Port+Isaac+Cornwall",
      tip: "Prøv fisken fra den lille kiosken på kaia — lokalt berømt.",
      suggested: false
    },
    "tintagel-castle": {
      id: "tintagel-castle",
      name: "Tintagel Castle",
      description: "Middelalderborgrestene på dramatiske klippekanter, knyttet til legenden om Kong Artur. Nytt besøkssenter og hengebro. Perfekt veistopp mot Clovelly.",
      type: "attraksjon",
      url: "https://www.english-heritage.org.uk/visit/places/tintagel-castle/",
      mapsUrl: "https://maps.google.com/?q=Tintagel+Castle+Cornwall",
      tip: "Planlegg 2 timer. Bestill billett på forhånd. Det er mange trapper — ta det rolig.",
      suggested: true
    },
    "clovelly-village": {
      id: "clovelly-village",
      name: "Clovelly Village",
      description: "Privat eid fiskerlandsby der det eneste transportmiddelet er trege esler. Bratte og sjarmerende smug og gater ned til havnen.",
      type: "by",
      url: "https://www.clovelly.co.uk/",
      mapsUrl: "https://maps.google.com/?q=Clovelly+Village+Devon",
      tip: "Inngangsavgift for besøkende (ca. £9). Som beboere på Red Lion slipper dere inn gratis.",
      suggested: true
    },
    "harbour-restaurant": {
      id: "harbour-restaurant",
      name: "Harbour Restaurant — Red Lion Hotel",
      description: "Forhåndsbestilt middag kl. 20:00, fredag 10. juli. Fersk sjømat med utsikt over Clovelly-havnen.",
      type: "restaurant",
      url: "https://www.clovelly.co.uk/stay/red-lion-hotel/",
      mapsUrl: "https://maps.google.com/?q=Red+Lion+Hotel+Clovelly+Devon",
      tip: "BESTILT ✅ — Bord kl 20:00, 10. juli",
      booked: true,
      suggested: false
    },
    "polperro": {
      id: "polperro",
      name: "Polperro",
      description: "En av Cornwalls mest fotograferte landsbyer — trange smug, hvite hus og en liten havn. Ca. 6 km fra Fieldhead Hotel.",
      type: "by",
      url: "https://maps.google.com/?q=Polperro+Cornwall",
      mapsUrl: "https://maps.google.com/?q=Polperro+Cornwall",
      tip: "Kjøremulighetene er begrenset — det er bilfritt sentrum. Parker ved inngangen og gå ned.",
      suggested: true
    },
    "looe-island": {
      id: "looe-island",
      name: "Looe Island (St. George's Island)",
      description: "Liten naturreservat-øy rett utenfor Looe. Sommerbåter fra Banjo Pier. Fuglekoloni og fredelig natur.",
      type: "natur",
      url: "https://maps.google.com/?q=Looe+Island+Cornwall",
      mapsUrl: "https://maps.google.com/?q=Looe+Island+Cornwall",
      tip: "Sjekk båttider på Banjo Pier om morgenen — avhenger av vær og vind.",
      suggested: false
    },
    "east-west-looe": {
      id: "east-west-looe",
      name: "East & West Looe",
      description: "Sjarmerende to-delt kystby forbundet av en bro. Fiskerestauranter, strender og det maleriske havneområdet.",
      type: "by",
      url: "https://maps.google.com/?q=Looe+Cornwall",
      mapsUrl: "https://maps.google.com/?q=Looe+Cornwall",
      tip: "Banjo Pier er fin å sitte på kvelden med fish & chips.",
      suggested: true
    },

    // ---- Lizard Peninsula ----
    "cadgwith-cove": {
      id: "cadgwith-cove",
      name: "Cadgwith Cove",
      description: "Nesten perfekt bevart fiskerlandsby med halmtekte hus og fargerike båter trukket opp på stranden. Et av de mest pittoreske stedene på hele Lizard-halvøya.",
      type: "by",
      url: "https://maps.google.com/?q=Cadgwith+Cove+Cornwall",
      mapsUrl: "https://maps.google.com/?q=Cadgwith+Cove+Cornwall",
      tip: "Puben The Cadgwith Cove Inn er en klassiker — tradisjonell cornisk pub rett ved stranden.",
      suggested: true
    },
    "mullion-cove": {
      id: "mullion-cove",
      name: "Mullion Cove",
      description: "Dramatisk havn klemt inn mellom høye klipper med turkisblått vann. Nasjonal Trust-eiet og godt bevart — en av Lizards vakreste steder.",
      type: "natur",
      url: "https://www.nationaltrust.org.uk/visit/cornwall/mullion-cove",
      mapsUrl: "https://maps.google.com/?q=Mullion+Cove+Cornwall",
      tip: "Gå ned til selve moloen for den beste utsikten. Mullion Cove Hotel-baren er fin til en drink.",
      suggested: true
    },

    // ---- St. Ives-området ----
    "zennor": {
      id: "zennor",
      name: "Zennor",
      description: "Gammel, intakt landsby med en 1200-tallskirke kjent for sin mermaid-stol-legende. Dramatisk moorlandskap og puben Tinners Arms. D.H. Lawrence bodde her under 1. verdenskrig.",
      type: "by",
      url: "https://maps.google.com/?q=Zennor+Cornwall",
      mapsUrl: "https://maps.google.com/?q=Zennor+Cornwall",
      tip: "Kort kystvandringssti ut til Zennor Head for fin panoramautsikt. Tinners Arms er en av Cornwalls beste gamle puber.",
      suggested: true
    },
    "godrevy": {
      id: "godrevy",
      name: "Godrevy fyrtårn & selkoloni",
      description: "Vandring til fyrtårnet som inspirerte Virginia Woolfs roman *To the Lighthouse*. Under og rundt Mutton Cove nedenfor ligger en koloni av grå seler — best ved lavvann.",
      type: "natur",
      url: "https://www.nationaltrust.org.uk/visit/cornwall/godrevy",
      mapsUrl: "https://maps.google.com/?q=Godrevy+Lighthouse+Cornwall",
      tip: "Parkér ved Godrevy-parkeringen (National Trust). Selene er best synlige ved lavvann — sjekk tidtabell.",
      suggested: true
    },
    "minack-theatre": {
      id: "minack-theatre",
      name: "Minack Theatre",
      description: "Et av Englands mest spektakulære utendørsteatre — hugget inn i klippene 60 meter over en turkis bukt ved Porthcurno. Selv uten forestilling er stedet unikt og verdt turen.",
      type: "kultur",
      url: "https://minack.com/",
      mapsUrl: "https://maps.google.com/?q=Minack+Theatre+Porthcurno+Cornwall",
      tip: "Sjekk spilleprogrammet på minack.com — en kveldforestilling her er en uforglemmelig opplevelse. Book tidlig.",
      suggested: true
    },
    "porthcurno-beach": {
      id: "porthcurno-beach",
      name: "Porthcurno Beach",
      description: "Hvit sand, dypt blått vann og granittfjelsvegger på begge sider — regnes av mange som Cornwalls vakreste strand. Rett ved Minack Theatre.",
      type: "natur",
      url: "https://maps.google.com/?q=Porthcurno+Beach+Cornwall",
      mapsUrl: "https://maps.google.com/?q=Porthcurno+Beach+Cornwall",
      tip: "Kombiner alltid med Minack Theatre like over — de er 5 minutters gange fra hverandre.",
      suggested: true
    },

    // ---- Clovelly / Nord-Devon ----
    "hartland-abbey": {
      id: "hartland-abbey",
      name: "Hartland Abbey",
      description: "1100-tallsabbedi omgjort til privatbolig gjennom 900 år med fascinerende historie. Vakre hager, skogsstier ned til kysten og en usedvanlig autentisk atmosfære.",
      type: "attraksjon",
      url: "https://www.hartlandabbey.com/",
      mapsUrl: "https://maps.google.com/?q=Hartland+Abbey+Devon",
      tip: "Sjekk åpningstider på forhånd — åpner ikke hver dag. Kombiner med Hartland Quay like ved.",
      suggested: true
    },
    "hartland-quay": {
      id: "hartland-quay",
      name: "Hartland Quay",
      description: "Dramatisk og vill kystlinje med noen av Englands mest ekstreme bergformasjoner. Et lite hotell/pub med utsikt rett ut mot Atlanterhavet. En ekte naturoplevelse.",
      type: "natur",
      url: "https://maps.google.com/?q=Hartland+Quay+Devon",
      mapsUrl: "https://maps.google.com/?q=Hartland+Quay+Devon",
      tip: "Puben på Hartland Quay Hotel har utendørssitting med spektakulær utsikt. Perfekt lunsjstopp.",
      suggested: true
    },
    "bucks-mills": {
      id: "bucks-mills",
      name: "Buck's Mills",
      description: "Liten, nesten ukjent bukt 5 km øst for Clovelly — nås til fots langs kystistien. Trange smug, fredelig og nesten ingen turister. En fin liten hemmelighet.",
      type: "natur",
      url: "https://maps.google.com/?q=Bucks+Mills+Devon",
      mapsUrl: "https://maps.google.com/?q=Bucks+Mills+Devon",
      tip: "Ca. 1 times enkel vandring fra Clovelly langs South West Coast Path. Ta med niste.",
      suggested: true
    },

    // ---- Looe-området ----
    "talland-bay": {
      id: "talland-bay",
      name: "Talland Bay",
      description: "Skjult og rolig strand mellom Looe og Polperro, med en gammel kirke på klippekanten over. Gode rockepøler, kafé og langt færre besøkende enn nabostedene.",
      type: "natur",
      url: "https://maps.google.com/?q=Talland+Bay+Cornwall",
      mapsUrl: "https://maps.google.com/?q=Talland+Bay+Cornwall",
      tip: "Parkér oppe ved kirken og gå ned. Fin kyststi videre til Polperro herfra (~3 km).",
      suggested: true
    },
    "seaton-downderry": {
      id: "seaton-downderry",
      name: "Seaton Beach & Downderry",
      description: "Stille og rolige strender øst for Looe med lite turisttrafikk. The Inn on the Shore i Downderry har uteplass rett på vannkanten — perfekt til en øl eller lunsj.",
      type: "natur",
      url: "https://maps.google.com/?q=Downderry+Beach+Cornwall",
      mapsUrl: "https://maps.google.com/?q=Downderry+Beach+Cornwall",
      tip: "The Inn on the Shore er lokalt berømt for god mat med utsikt. Bestill bord om det er kveldsstopp.",
      suggested: true
    },
    "cawsand-kingsand": {
      id: "cawsand-kingsand",
      name: "Cawsand & Kingsand",
      description: "To tvillinglandsbyer på Rame-halvøya — kalt «Glemt Cornwall». Fargerike hus, liten sandstrand og puben The Cross Keys. Sjarmerende og nesten uberørt av masseturisme.",
      type: "by",
      url: "https://maps.google.com/?q=Cawsand+Cornwall",
      mapsUrl: "https://maps.google.com/?q=Cawsand+Cornwall",
      tip: "Ca. 22 km fra Looe. Kombiner gjerne med Rame Head-neset like ved for panoramautsikt over Plymouth Sound.",
      suggested: true
    }
  },

  spotify: [
    {
      day: "alle",
      title: "Cornish Sea Shanties",
      description: "Perfekt stemningssetter for hele turen — historiske shanties fra Cornwall",
      searchUrl: "https://open.spotify.com/search/cornish%20sea%20shanties",
      icon: "⚓"
    },
    {
      day: 1,
      title: "Dag 1 — Road Trip Energy",
      description: "Energisk britisk mix for den lange kjøreturen fra Heathrow",
      searchUrl: "https://open.spotify.com/search/british%20road%20trip%20classics",
      icon: "🚗"
    },
    {
      day: "alle",
      title: "Britpop Classics",
      description: "Blur, Oasis, Radiohead, Supergrass — 90-talls britisk gull",
      searchUrl: "https://open.spotify.com/search/britpop%20classics",
      icon: "🎸"
    },
    {
      day: "alle",
      title: "Coastal Morning Vibes",
      description: "Rolig akustisk til frokost med havutsikt",
      searchUrl: "https://open.spotify.com/search/coastal%20morning%20acoustic",
      icon: "🌅"
    },
    {
      day: 6,
      title: "Dag 6 — Evening in the Harbour",
      description: "Stemningsfull kveld til middagen på Red Lion i Clovelly",
      searchUrl: "https://open.spotify.com/search/celtic%20folk%20acoustic%20evening",
      icon: "🌙"
    },
    {
      day: 8,
      title: "Dag 8 — Hjemtur",
      description: "Nostalgisk avslutning mot Gatwick — tenk på alle minnene",
      searchUrl: "https://open.spotify.com/search/road%20trip%20feel%20good%20classics",
      icon: "🏁"
    }
  ],

  // Legg gjerne til flere fakta her — vises automatisk på Info-siden!
  facts: [
    { icon: "sparkles",   text: "<strong>Cornish pasty</strong> er beskyttet av EU som geografisk betegnelse — bare paier laget i Cornwall kan kalles «Cornish Pasty»." },
    { icon: "landmark",   text: "<strong>Tintagel</strong> ble koblet til Kong Artur-legenden på 1100-tallet. Arkeologer har funnet spor av et kongesete fra 500-tallet." },
    { icon: "anchor",     text: "<strong>Lizard Point</strong> er det sørligste punktet på det britiske fastlandet — lenger sør enn Land's End!" },
    { icon: "palette",    text: "<strong>St. Ives</strong> ble på 1920-tallet en av Europas viktigste kunstnerkolonier, takket være det unike lyset langs kysten." },
    { icon: "horse",      text: "<strong>Clovelly</strong> har vært privateid av samme familie siden 1738. Varer fraktes fortsatt på sleder ned de bratte smugene." },
    { icon: "wine",       text: "<strong>Cornwall</strong> har et overraskende mildt klima takket være Golfstrømmen — og produserer faktisk ganske god vin!" },
    { icon: "waves",      text: "<strong>Kynance Cove</strong> ble kåret til en av Englands vakreste strender. Det turkise vannet skyldes serpentinstein i klippene." },
    { icon: "fish",       text: "<strong>Cornish fiskesuppe</strong> (Stargazy Pie) lages med fiskehoder som stikker opp gjennom paideigen — ja, virkelig." },
    { icon: "map-pin",    text: "<strong>Land's End</strong> er 1 407 km fra John o' Groats i nord — den klassiske britiske reisen «end-to-end»." },
    { icon: "castle",     text: "<strong>St. Michael's Mount</strong> har vært bebodd kontinuerlig i over 600 år og er i dag hjem for familien St Aubyn." },
  ],

  cornishPhrases: [
    { phrase: "Proper job!", meaning: "Bra gjort! / Utmerket!" },
    { phrase: "Dreckly", meaning: "Snart... men ikke veldig snart (som 'mañana')" },
    { phrase: "Ansome", meaning: "Kjempefint / Bra (fra 'handsome')" },
    { phrase: "Emmet", meaning: "Turist (litt fleipete, men vennlig ment)" },
    { phrase: "Oggy / Oggie", meaning: "Cornish pasty — den ikoniske halvmånepaien" },
    { phrase: "Kernow", meaning: "Cornwall på kornisk (gammelkeltisk)" },
    { phrase: "Ello my lover", meaning: "Hei, venn! (vanlig hilsen i Cornwall)" },
    { phrase: "Tidn't", meaning: "It isn't (det er ikke)" },
    { phrase: "Teasy", meaning: "Irritabel / humørsyk" },
    { phrase: "Cheeld", meaning: "Barn (child)" }
  ],

  emergency: {
    uk: "999",
    nonEmergency: "101",
    norwayEmbassyLondon: "+44 20 7591 5500",
    europeanHealth: "EHIC / europeisk helsetrygdkort — husk å ta med!",
    currency: "Britiske pund (GBP) — husk å ha noe kontant til bilfrie steder som Clovelly"
  }
};
