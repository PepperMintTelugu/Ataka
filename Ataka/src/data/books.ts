
export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice: number;
  coverImage: string;
  description: string;
  language: string;
  publisher: string;
  publicationYear: number;
  pages: number;
  categories: string[];
  tags: string[];
  isbn: string;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  rating: number;
  slug: string;
}

const books: Book[] = [
  {
    id: '1',
    title: 'మహాప్రస్థానం',
    author: 'శ్రీ శ్రీ',
    price: 299,
    originalPrice: 499,
    coverImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop',
    description: 'శ్రీశ్రీ రాసిన మహాప్రస్థానం ఒక విప్లవాత్మక కావ్యం. ఇది సామాజిక అసమానతలపై తిరుగుబాటు చేసే నిప్పులా మొదలవుతుంది. సమకాలీన తెలుగు సాహిత్యంలో ఎంతో ప్రాముఖ్యత సంతరించుకున్న ఈ కావ్యం ఆధునిక తెలుగు కవిత్వంలో ఒక మైలురాయి.',
    language: 'Telugu',
    publisher: 'Visalandhra Publishing House',
    publicationYear: 1950,
    pages: 145,
    categories: ['Poetry', 'Classic'],
    tags: ['revolution', 'social-commentary', 'telugu-literature'],
    isbn: '9788126415847',
    stockStatus: 'in_stock',
    rating: 4.9,
    slug: 'mahaprasthanam'
  },
  {
    id: '2',
    title: 'బరితెగింపు',
    author: 'యండమూరి వీరేంద్రనాథ్',
    price: 199,
    originalPrice: 350,
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop',
    description: 'బరితెగింపు అనే ఈ నవల సమాజంలోని దుష్ప్రవర్తనలను ఎండగడుతుంది. ఆధునిక వ్యవస్థలో నిజాయితీ, ధైర్యం లాంటి విలువలకు ఎంత ప్రాముఖ్యత ఉందో చెబుతుంది. తన ప్రత్యేకమైన శైలితో యండమూరి ఈ నవలని మలిచారు.',
    language: 'Telugu',
    publisher: 'Emesco Books',
    publicationYear: 2008,
    pages: 256,
    categories: ['Novel', 'Fiction'],
    tags: ['social-drama', 'contemporary'],
    isbn: '9788172473747',
    stockStatus: 'in_stock',
    rating: 4.2,
    slug: 'barithegimpu'
  },
  {
    id: '3',
    title: 'నా ఇష్టమైన కధలు',
    author: 'చలం',
    price: 350,
    originalPrice: 450,
    coverImage: 'https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?q=80&w=600&auto=format&fit=crop',
    description: 'సామాజిక సంప్రదాయాలపై తిరుగుబాటు చేసిన రచయిత చలం తన ఆత్మకథాత్మక కథల సంకలనం ఇది. ప్రేమ, స్వేచ్ఛ, మానవ సంబంధాలపై చలం దృష్టికోణం ఈ కథల ద్వారా అర్థమవుతుంది.',
    language: 'Telugu',
    publisher: 'Chalam Publications',
    publicationYear: 1976,
    pages: 320,
    categories: ['Short Stories', 'Autobiography'],
    tags: ['feminism', 'freedom', 'relationships'],
    isbn: '8173712384',
    stockStatus: 'low_stock',
    rating: 4.8,
    slug: 'na-ishtamaina-kadhalu'
  },
  {
    id: '4',
    title: 'మైదానం',
    author: 'కేతు విశ్వనాథరెడ్డి',
    price: 280,
    originalPrice: 399,
    coverImage: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?q=80&w=600&auto=format&fit=crop',
    description: 'మైదానం అనే ఈ నవల గ్రామీణ ప్రాంతాల జీవితాన్ని చిత్రిస్తుంది. వ్యవసాయం, గ్రామీణ సంస్కృతి, కుటుంబ బంధాలు, గ్రామ రాజకీయాలు లాంటి అంశాలను ఈ రచన స్పృశిస్తుంది.',
    language: 'Telugu',
    publisher: 'Telugu Academy',
    publicationYear: 1999,
    pages: 276,
    categories: ['Novel', 'Rural Literature'],
    tags: ['village-life', 'agriculture', 'family'],
    isbn: '9788172471022',
    stockStatus: 'in_stock',
    rating: 4.5,
    slug: 'maidanam'
  },
  {
    id: '5',
    title: 'కాలం',
    author: 'డాక్టర్ సి. నారాయణరెడ్డి',
    price: 230,
    originalPrice: 350,
    coverImage: 'https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=600&auto=format&fit=crop',
    description: 'కాలం అనే ఈ కవితా సంపుటి కాలాన్ని గురించిన భావాలను వ్యక్తం చేస్తుంది. జీవితం, మరణం, సమయం పై డాక్టర్ సి. నారాయణరెడ్డి గారి ఆలోచనలు మరియు అనుభవాలు ఈ కవితల్లో ప్రతిఫలిస్తాయి.',
    language: 'Telugu',
    publisher: 'Sahitya Akademi',
    publicationYear: 1987,
    pages: 132,
    categories: ['Poetry', 'Philosophy'],
    tags: ['time', 'life', 'existence'],
    isbn: '9788126014996',
    stockStatus: 'in_stock',
    rating: 4.7,
    slug: 'kalam'
  },
  {
    id: '6',
    title: 'బాటసారి',
    author: 'గురజాడ అప్పారావు',
    price: 150,
    originalPrice: 299,
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop',
    description: 'గురజాడ అప్పారావు రచించిన బాటసారి తెలుగు సాహిత్యంలో ఒక ప్రసిద్ధ రచన. సామాజిక దృక్కోణంతో కూడిన ఈ రచన ఆ కాలపు సామాజిక పరిస్థితులను నిశితంగా పరిశీలిస్తుంది.',
    language: 'Telugu',
    publisher: 'Andhra Pradesh Book Distributors',
    publicationYear: 1910,
    pages: 184,
    categories: ['Classic', 'Social Commentary'],
    tags: ['reform', 'tradition', 'society'],
    isbn: '8173456278',
    stockStatus: 'out_of_stock',
    rating: 4.6,
    slug: 'batasari'
  },
  {
    id: '7',
    title: 'పాలపిట్ట',
    author: 'మాలతీ చందూర్',
    price: 275,
    originalPrice: 399,
    coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=600&auto=format&fit=crop',
    description: 'మాలతీ చందూర్ రచించిన పాలపిట్ట అనే ఈ నవల స్త్రీవాదం మరియు స్త్రీల స్వేచ్ఛా ఆకాంక్షలకు ప్రాధాన్యత ఇస్తుంది. మహిళల జీవితాలు, వారి సంఘర్షణలు మరియు స్వతంత్రంగా జీవించటానికి వారి పోరాటం గురించి వివరిస్తుంది.',
    language: 'Telugu',
    publisher: 'Vishalaandhra',
    publicationYear: 2005,
    pages: 230,
    categories: ['Novel', 'Feminist Literature'],
    tags: ['women', 'freedom', 'struggle'],
    isbn: '9788172474645',
    stockStatus: 'in_stock',
    rating: 4.4,
    slug: 'palapitta'
  },
  {
    id: '8',
    title: 'అరణ్య కాండం',
    author: 'వడ్డేపల్లి కృష్ణ',
    price: 320,
    originalPrice: 450,
    coverImage: 'https://images.unsplash.com/photo-1618365908648-e71bd5716cba?q=80&w=600&auto=format&fit=crop',
    description: 'అరణ్య కాండం అనే ఈ నవల ప్రకృతి మరియు మానవుల మధ్య సంబంధాన్ని వివరిస్తుంది. అడవులు, అక్కడి జీవిత వైవిధ్యం, మానవ జీవనంతో వాటి అనుబంధం గురించి వివరిస్తుంది.',
    language: 'Telugu',
    publisher: 'Navya Publications',
    publicationYear: 2013,
    pages: 310,
    categories: ['Novel', 'Environment'],
    tags: ['nature', 'forests', 'ecology'],
    isbn: '9788172474782',
    stockStatus: 'low_stock',
    rating: 4.3,
    slug: 'aranya-kandam'
  }
];

export default books;
