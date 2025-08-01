import { Book } from "@/types/book";

export const mockBooks: Book[] = [
  {
    id: "1",
    title: "Veyipadagalu",
    titleTelugu: "వేయిపదగలు",
    author: "Viswanatha Satyanarayana",
    authorTelugu: "విశ్వనాథ సత్యనారాయణ",
    publisher: "Vishwakarma Publications",
    publisherTelugu: "విశ్వకర్మ పబ్లికేషన్స్",
    isbn: "978-81-234-5678-9",
    price: 299,
    originalPrice: 399,
    discount: 25,
    description:
      "A classic Telugu novel that explores the depths of human nature and social dynamics. Winner of the Jnanpith Award.",
    descriptionTelugu:
      "మానవ స్వభావం మరియు సామాజిక గతిశీలతల లోతులను అన్వేషించే ఒక అద్భుతమైన తెలుగు నవల. జ్ఞానపీఠ పురస్కార విజేత రచన.",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1494790108755-2616b332b1c0?w=300&h=400&fit=crop",
    ],
    category: "Literature",
    categoryTelugu: "సాహిత్యం",
    pages: 456,
    language: "Telugu",
    dimensions: { length: 22, width: 14, height: 3 },
    weight: 580,
    publicationYear: 1952,
    rating: 4.8,
    reviewCount: 234,
    inStock: true,
    stockCount: 45,
    tags: ["Classic", "Jnanpith", "Literature"],
    seoTitle: "Veyipadagalu - Classic Telugu Novel by Viswanatha Satyanarayana",
    seoDescription:
      "Buy Veyipadagalu, the acclaimed Telugu novel by Viswanatha Satyanarayana. Winner of Jnanpith Award. Free delivery and aesthetic packaging.",
    featured: true,
    bestseller: true,
    newArrival: false,
    // Overall Ataka rankings
    atakaRank: 1,
    atakaRankingBasis: "sales",

    // Category rankings
    categoryRank: 1,
    categoryRankingBasis: "sales",

    // Legacy fields for backward compatibility
    rank: 1,
    rankingCategory: "Literature",
    rankingBasis: "sales",
  },
  {
    id: "2",
    title: "Maa Telugu Talli",
    titleTelugu: "మా తెలుగుతల్లి",
    author: "Sankarambadi Sundarachari",
    authorTelugu: "శంకరంబాడి సుందరాచారి",
    publisher: "Telugu Bharathi",
    publisherTelugu: "తెలుగు భారతి",
    isbn: "978-81-234-5679-6",
    price: 199,
    originalPrice: 249,
    discount: 20,
    description:
      "A beautiful collection of poems celebrating Telugu language and culture. Perfect for students and poetry lovers.",
    descriptionTelugu:
      "తెలుగు భాష మరియు సంస్క���తిని కీర్తించే అందమైన కవితల సంకలనం. విద్యార్థులు మరియు కవిత్వ ప్రేమికులకు అనువైనది.",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
    ],
    category: "Poetry",
    categoryTelugu: "కవిత్వం",
    pages: 180,
    language: "Telugu",
    dimensions: { length: 20, width: 13, height: 1.5 },
    weight: 220,
    publicationYear: 1920,
    rating: 4.6,
    reviewCount: 89,
    inStock: true,
    stockCount: 67,
    tags: ["Poetry", "Culture", "Educational"],
    seoTitle: "Maa Telugu Talli - Telugu Poetry Collection",
    seoDescription:
      "Classic Telugu poetry collection celebrating our beautiful language and culture. Perfect for students and literature enthusiasts.",
    featured: false,
    bestseller: true,
    newArrival: false,
    // Overall Ataka rankings
    atakaRank: 3,
    atakaRankingBasis: "reviews",

    // Category rankings
    categoryRank: 1,
    categoryRankingBasis: "reviews",

    // Legacy fields for backward compatibility
    rank: 2,
    rankingCategory: "Poetry",
    rankingBasis: "reviews",
  },
  {
    id: "3",
    title: "Annamayya Keerthanalu",
    titleTelugu: "అన్నమయ్య కీర్తనలు",
    author: "Annamayya",
    authorTelugu: "అన్నమయ్య",
    publisher: "TTD Publications",
    publisherTelugu: "టిటిడి పబ్లికేషన్స్",
    isbn: "978-81-234-5680-2",
    price: 349,
    originalPrice: 449,
    discount: 22,
    description:
      "Complete collection of Annamayya's devotional songs. Includes Telugu lyrics with meanings and musical notations.",
    descriptionTelugu:
      "అన్నమయ్య యొ��్క భక్తి పాటల పూర్తి సంకలనం. తెలుగు సాహిత్యం మరియు సంగీత అర్థాలతో పాటు సంగీత సంకేతాలు కూడా ఉన్నాయి.",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&h=400&fit=crop",
    ],
    category: "Devotional",
    categoryTelugu: "భక్తి",
    pages: 520,
    language: "Telugu",
    dimensions: { length: 23, width: 15, height: 3.5 },
    weight: 680,
    publicationYear: 2018,
    rating: 4.9,
    reviewCount: 456,
    inStock: true,
    stockCount: 23,
    tags: ["Devotional", "Music", "Classical"],
    seoTitle: "Annamayya Keerthanalu - Complete Collection of Devotional Songs",
    seoDescription:
      "Buy the complete collection of Annamayya's devotional songs. Includes lyrics, meanings, and musical notations.",
    featured: true,
    bestseller: false,
    newArrival: false,
    // Overall Ataka rankings
    atakaRank: 5,
    atakaRankingBasis: "rating",

    // Category rankings
    categoryRank: 1,
    categoryRankingBasis: "rating",

    // Legacy fields for backward compatibility
    rank: 3,
    rankingCategory: "Devotional",
    rankingBasis: "rating",
  },
  {
    id: "4",
    title: "Telugu Grammar Made Easy",
    titleTelugu: "తెలుగు వ్యాకరణం సులభంగా",
    author: "Dr. K. V. Ramakrishna Rao",
    authorTelugu: "��ాక�����ర్ క����.వి. రామకృష్ణ రావు",
    publisher: "Educational Publishers",
    publisherTelugu: "ఎడ్యుకేషనల్ పబ్లిషర్స్",
    isbn: "978-81-234-5681-9",
    price: 249,
    originalPrice: 299,
    discount: 17,
    description:
      "Comprehensive guide to Telugu grammar with examples and exercises. Essential for students and teachers.",
    descriptionTelugu:
      "ఉదాహరణలు మరియు వ్యాయామాలతో తెలుగు వ్యాకరణానికి సమగ్ర మార్గదర్శి. విద్యార్థులు మరియు ఉపాధ్యాయులకు అవసరమైనది.",
    image:
      "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=300&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=300&h=400&fit=crop",
    ],
    category: "Educational",
    categoryTelugu: "విద్యా",
    pages: 320,
    language: "Telugu",
    dimensions: { length: 21, width: 14, height: 2.2 },
    weight: 420,
    publicationYear: 2021,
    rating: 4.4,
    reviewCount: 156,
    inStock: true,
    stockCount: 89,
    tags: ["Grammar", "Educational", "Reference"],
    seoTitle: "Telugu Grammar Made Easy - Complete Grammar Guide",
    seoDescription:
      "Learn Telugu grammar easily with this comprehensive guide. Includes examples and exercises for better understanding.",
    featured: false,
    bestseller: false,
    newArrival: true,
    // Overall Ataka rankings
    atakaRank: 8,
    atakaRankingBasis: "pageViews",

    // Category rankings
    categoryRank: 2,
    categoryRankingBasis: "pageViews",

    // Legacy fields for backward compatibility
    rank: 4,
    rankingCategory: "Educational",
    rankingBasis: "pageViews",
  },
  {
    id: "5",
    title: "Chandamama Stories",
    titleTelugu: "చందమామ కథలు",
    author: "Various Authors",
    authorTelugu: "వివిధ రచయితలు",
    publisher: "Chandamama Publications",
    publisherTelugu: "చందమామ పబ్లికేషన్స్",
    isbn: "978-81-234-5682-6",
    price: 179,
    originalPrice: 199,
    discount: 10,
    description:
      "Collection of beloved Chandamama stories for children. Beautifully illustrated with moral tales.",
    descriptionTelugu:
      "పిల్లలకు ప్రియమైన చందమామ కథల సంకలనం. నైతిక కథలతో అందంగా చిత్రీకరించబడింది.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
    ],
    category: "Children",
    categoryTelugu: "పిల్లల పుస్తకలు",
    pages: 240,
    language: "Telugu",
    dimensions: { length: 20, width: 14, height: 2 },
    weight: 280,
    publicationYear: 2020,
    rating: 4.7,
    reviewCount: 89,
    inStock: true,
    stockCount: 156,
    tags: ["Children", "Stories", "Illustrated"],
    seoTitle: "Chandamama Stories - Classic Telugu Stories for Children",
    seoDescription:
      "Beautiful collection of Chandamama stories for children. Illustrated moral tales that kids love.",
    featured: false,
    bestseller: true,
    newArrival: false,
    rank: 1,
    rankingCategory: "Children",
    rankingBasis: "wishlist",
  },
  {
    id: "6",
    title: "Modern Telugu Poetry",
    titleTelugu: "ఆధునిక తెలుగు కవిత్వం",
    author: "Contemporary Poets",
    authorTelugu: "సమకాలీన కవ���లు",
    publisher: "New Age Publications",
    publisherTelugu: "న్యూ ఏజ్ పబ్లికేషన్స్",
    isbn: "978-81-234-5683-3",
    price: 279,
    originalPrice: 349,
    discount: 20,
    description:
      "Collection of contemporary Telugu poetry exploring modern themes and emotions.",
    descriptionTelugu:
      "ఆధునిక ఇతివృత్తాలు మరియు భావో��్వేగాలను అన్వేషించే సమకాలీన తెలుగు కవిత్వ సంకలనం.",
    image:
      "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=300&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=300&h=400&fit=crop",
    ],
    category: "Poetry",
    categoryTelugu: "కవిత్వం",
    pages: 200,
    language: "Telugu",
    dimensions: { length: 20, width: 13, height: 1.8 },
    weight: 250,
    publicationYear: 2023,
    rating: 4.3,
    reviewCount: 67,
    inStock: true,
    stockCount: 34,
    tags: ["Poetry", "Modern", "Contemporary"],
    seoTitle: "Modern Telugu Poetry - Contemporary Poetry Collection",
    seoDescription:
      "Explore modern Telugu poetry with this contemporary collection. Fresh voices and modern themes.",
    featured: false,
    bestseller: false,
    newArrival: true,
    // Overall Ataka rankings
    atakaRank: 12,
    atakaRankingBasis: "newness",

    // Category rankings
    categoryRank: 3,
    categoryRankingBasis: "newness",

    // Legacy fields for backward compatibility
    rank: 5,
    rankingCategory: "Poetry",
    rankingBasis: "newness",
  },
  {
    id: "7",
    title: "Telugu Vyakarana Sarvaswa",
    titleTelugu: "తెలుగు వ్యాకరణ సర్వస్వం",
    author: "Gidugu Venkata Ramamoorthy",
    authorTelugu: "గిడుగు వెంకట రామమూర్తి",
    publisher: "Andhra Saraswata Parishad",
    publisherTelugu: "ఆంధ్ర సరస్వత పరిషత్",
    isbn: "978-81-234-5684-0",
    price: 125,
    originalPrice: 175,
    discount: 29,
    description:
      "Complete Telugu grammar guide for students and scholars. A comprehensive reference book.",
    descriptionTelugu:
      "విద్యార్థులు మరియు పండితుల కోసం పూర్తి తెలుగు వ్యాకరణ గైడ్. ఒక సమగ్ర సంદర్భ పుస్తకం.",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=400&fit=crop",
    ],
    category: "Educational",
    categoryTelugu: "విద్యా",
    pages: 320,
    language: "Telugu",
    dimensions: { length: 20, width: 13, height: 2 },
    weight: 420,
    publicationYear: 1985,
    rating: 4.5,
    reviewCount: 145,
    inStock: true,
    stockCount: 78,
    tags: ["Grammar", "Educational", "Reference"],
    seoTitle: "Telugu Vyakarana Sarvaswa - Complete Grammar Guide",
    seoDescription:
      "Learn Telugu grammar with this comprehensive guide. Perfect for students and language enthusiasts. Affordable price.",
    featured: false,
    bestseller: true,
    newArrival: false,
    // Overall Ataka rankings
    atakaRank: 2,
    atakaRankingBasis: "sales",

    // Category rankings
    categoryRank: 1,
    categoryRankingBasis: "sales",

    // Legacy fields for backward compatibility
    rank: 2,
    rankingCategory: "Educational",
    rankingBasis: "sales",
  },
  {
    id: "8",
    title: "Bala Ramayanam",
    titleTelugu: "బాల రామాయణం",
    author: "Viswanatha Satyanarayana",
    authorTelugu: "విశ్వనాథ సత్యనారాయణ",
    publisher: "Saraswati Pustakalayam",
    publisherTelugu: "సరస్వతి పుస్తకాలయం",
    isbn: "978-81-234-5685-7",
    price: 99,
    originalPrice: 149,
    discount: 34,
    description:
      "Ramayana retold for children in simple Telugu. Perfect introduction to our epic literature.",
    descriptionTelugu:
      "పిల్లల కోసం సరళ తెలుగులో చెప్పబడిన రామాయణం. మన మహాకావ్య సాహిత్యానికి అద్భుతమైన పరిచయం.",
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop",
    ],
    category: "Children",
    categoryTelugu: "పిల్లల పుస్తకలు",
    pages: 180,
    language: "Telugu",
    dimensions: { length: 19, width: 13, height: 1.5 },
    weight: 250,
    publicationYear: 2010,
    rating: 4.7,
    reviewCount: 298,
    inStock: true,
    stockCount: 156,
    tags: ["Children", "Epic", "Mythology"],
    seoTitle: "Bala Ramayanam - Ramayana for Children in Telugu",
    seoDescription:
      "Introduce your children to Ramayana with this beautifully written Telugu adaptation. Under ₹100!",
    featured: true,
    bestseller: true,
    newArrival: false,
    // Overall Ataka rankings
    atakaRank: 4,
    atakaRankingBasis: "sales",

    // Category rankings
    categoryRank: 1,
    categoryRankingBasis: "sales",

    // Legacy fields for backward compatibility
    rank: 1,
    rankingCategory: "Children",
    rankingBasis: "sales",
  },
  {
    id: "9",
    title: "Andhra Mahabharatam - Adi Parva",
    titleTelugu: "ఆంధ్ర మహాభారతం - ఆది పర్వ",
    author: "Nannaya Bhattu",
    authorTelugu: "నన్నయ భట్టు",
    publisher: "Vavilla Ramaswamy Sastrulu and Sons",
    publisherTelugu: "వావిళ్ల రామస్వామి శాస్త్రులు అండ్ సన్స్",
    isbn: "978-81-234-5686-4",
    price: 149,
    originalPrice: 199,
    discount: 25,
    description:
      "The first part of Telugu Mahabharata by Nannaya. A cornerstone of Telugu literature.",
    descriptionTelugu:
      "నన్నయ రచించిన తెలుగు మహాభారతం యొక్క మొదటి భాగం. తెలుగు సాహిత్యం యొక్క మూలస్తంభం.",
    image:
      "https://images.unsplash.com/photo-1509266272358-7701da638078?w=300&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1509266272358-7701da638078?w=300&h=400&fit=crop",
    ],
    category: "Literature",
    categoryTelugu: "సాహిత్యం",
    pages: 280,
    language: "Telugu",
    dimensions: { length: 21, width: 14, height: 2 },
    weight: 380,
    publicationYear: 1950,
    rating: 4.9,
    reviewCount: 189,
    inStock: true,
    stockCount: 89,
    tags: ["Classic", "Epic", "Literature"],
    seoTitle: "Andhra Mahabharatam Adi Parva - Nannaya's Masterpiece",
    seoDescription:
      "Read the foundational work of Telugu literature. Nannaya's Adi Parva available at an affordable price.",
    featured: true,
    bestseller: true,
    newArrival: false,
    // Overall Ataka rankings
    atakaRank: 6,
    atakaRankingBasis: "reviews",

    // Category rankings
    categoryRank: 2,
    categoryRankingBasis: "reviews",

    // Legacy fields for backward compatibility
    rank: 3,
    rankingCategory: "Literature",
    rankingBasis: "reviews",
  },
  {
    id: "10",
    title: "Telugu Hasya Kathalu",
    titleTelugu: "తెలుగు హాస్య కథలు",
    author: "Multiple Authors",
    authorTelugu: "అనేక రచయితలు",
    publisher: "Hasya Manjari Publications",
    publisherTelugu: "హాస్య మంజరి పబ్లికేషన్స్",
    isbn: "978-81-234-5687-1",
    price: 89,
    originalPrice: 129,
    discount: 31,
    description:
      "Collection of hilarious Telugu short stories. Perfect for light reading and entertainment.",
    descriptionTelugu:
      "వినోదభరితమైన తెలుగు చిన్న కథల సంకలనం. తేలికపాటి చదువు మరియు వినోదం కోసం అద్భుతం.",
    image:
      "https://images.unsplash.com/photo-1495001258031-d1b407bc1776?w=300&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1495001258031-d1b407bc1776?w=300&h=400&fit=crop",
    ],
    category: "Literature",
    categoryTelugu: "సాహిత్యం",
    pages: 160,
    language: "Telugu",
    dimensions: { length: 18, width: 12, height: 1.2 },
    weight: 200,
    publicationYear: 2018,
    rating: 4.4,
    reviewCount: 267,
    inStock: true,
    stockCount: 124,
    tags: ["Humor", "Short Stories", "Entertainment"],
    seoTitle: "Telugu Hasya Kathalu - Funny Telugu Short Stories",
    seoDescription:
      "Laugh out loud with these funny Telugu stories. Great value for money under ₹90!",
    featured: false,
    bestseller: true,
    newArrival: false,
    // Overall Ataka rankings
    atakaRank: 7,
    atakaRankingBasis: "rating",

    // Category rankings
    categoryRank: 3,
    categoryRankingBasis: "rating",

    // Legacy fields for backward compatibility
    rank: 4,
    rankingCategory: "Literature",
    rankingBasis: "rating",
  },
];

export const categories = [
  { id: "literature", name: "Literature", nameTelugu: "సాహిత్యం" },
  { id: "poetry", name: "Poetry", nameTelugu: "కవిత్వం" },
  { id: "devotional", name: "Devotional", nameTelugu: "భక్తి" },
  { id: "educational", name: "Educational", nameTelugu: "విద్యా" },
  { id: "children", name: "Children", nameTelugu: "పిల్లల పుస్తకలు" },
  { id: "history", name: "History", nameTelugu: "చరిత్ర" },
  { id: "philosophy", name: "Philosophy", nameTelugu: "తత్వశాస్త్రం" },
  { id: "biography", name: "Biography", nameTelugu: "జీవితచరిత్ర" },
  {
    id: "under-150",
    name: "Books Under ₹150",
    nameTelugu: "₹150 లోపు పుస్తకలు",
  },
  { id: "drama", name: "Drama & Theatre", nameTelugu: "నాటకం & రంగస్థలం" },
  { id: "fiction", name: "Fiction", nameTelugu: "కల్పిత కథలు" },
  { id: "science", name: "Science", nameTelugu: "వైజ్ఞానిక" },
  {
    id: "health",
    name: "Health & Wellness",
    nameTelugu: "ఆరోగ్యం & శ్రేయస్సు",
  },
  { id: "cooking", name: "Cooking", nameTelugu: "వంట" },
  { id: "travel", name: "Travel", nameTelugu: "ప్రయాణం" },
  { id: "self-help", name: "Self Help", nameTelugu: "స్వయం సహాయం" },
  { id: "business", name: "Business", nameTelugu: "వ్యాపారం" },
  { id: "technology", name: "Technology", nameTelugu: "సాంకేతికత" },
  { id: "art", name: "Arts & Crafts", nameTelugu: "కళలు & హస్తకళలు" },
  { id: "music", name: "Music", nameTelugu: "సంగీతం" },
];

// Authors data
export const authors = [
  {
    id: "viswanatha-satyanarayana",
    name: "Viswanatha Satyanarayana",
    nameTelugu: "విశ్వనాథ సత్యనారాయణ",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    bio: "Jnanpith Award winner and renowned Telugu author known for his contributions to literature.",
    bioTelugu:
      "జ్ఞానపీఠ పురస్కార విజేత మరియు సాహిత్యానికి చేసిన కృషికి ప్రసిద్ధ తెలుగు రచయిత.",
    booksCount: 25,
    specialization: "Literature",
    birthYear: 1895,
    awards: ["Jnanpith Award", "Sahitya Akademi Award"],
  },
  {
    id: "gurajada-apparao",
    name: "Gurajada Apparao",
    nameTelugu: "గురజాడ అప్పారావు",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    bio: "Pioneer of modern Telugu literature and social reformer.",
    bioTelugu: "ఆధునిక తెలుగు సాహిత్యానికి మార్గదర్శి మరియు సమాజ సేవకుడు.",
    booksCount: 18,
    specialization: "Drama",
    birthYear: 1862,
    awards: ["Literary Excellence Award"],
  },
  {
    id: "devulapalli-krishna-sastry",
    name: "Devulapalli Krishna Sastry",
    nameTelugu: "దేవ���లపల్లి కృష్ణ శాస్త్రి",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face",
    bio: "Revolutionary poet known for his progressive and patriotic poems.",
    bioTelugu: "తన ప్రగతిశీల మరియు దేశభక్తి కవితలకు ప్రసిద్ధ విప్లవ కవి.",
    booksCount: 22,
    specialization: "Poetry",
    birthYear: 1897,
    awards: ["Kala Prapoorna"],
  },
  {
    id: "sri-sri",
    name: "Sri Sri (Srirangam Srinivasa Rao)",
    nameTelugu: "శ్రీశ్రీ (శ్రీరంగం శ్రీనివాస రావు)",
    image:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&h=300&fit=crop&crop=face",
    bio: "Revolutionary poet and writer who transformed modern Telugu poetry.",
    bioTelugu: "ఆధునిక తెలుగు కవిత్వాన్ని మార్చివేసిన విప్లవ కవి మరియు రచయిత.",
    booksCount: 30,
    specialization: "Poetry",
    birthYear: 1910,
    awards: ["Sahitya Akademi Award"],
  },
  {
    id: "yandamuri-veerendranath",
    name: "Yandamuri Veerendranath",
    nameTelugu: "యండమూరి వీరేంద్రనాథ",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
    bio: "Contemporary novelist known for social novels and psychological thrillers.",
    bioTelugu:
      "సామాజిక నవలలు మరియు మానసిక థ్రిల్లర్లకు ప్రసిద్ధ సమకాలీన రచయిత.",
    booksCount: 45,
    specialization: "Fiction",
    birthYear: 1948,
    awards: ["Nandi Award"],
  },
  {
    id: "annamayya",
    name: "Annamayya",
    nameTelugu: "అన్నమయ్య",
    image:
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=300&h=300&fit=crop&crop=face",
    bio: "15th-century mystic poet and composer of devotional songs.",
    bioTelugu: "15వ శతాబ్దానికి చెందిన ఆధ్యాత్మిక కవి మరియు భక్తి గీతాల రచయిత.",
    booksCount: 12,
    specialization: "Devotional",
    birthYear: 1408,
    awards: ["Cultural Heritage Award"],
  },
  {
    id: "rachakonda-viswanatha-sastry",
    name: "Rachakonda Viswanatha Sastry",
    nameTelugu: "రాచకొండ విశ్వనాథ శాస్త్రి",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    bio: "Versatile writer known for novels, short stories, and essays.",
    bioTelugu: "నవలలు, చిన్న కథలు మరియు వ్యాసాలకు ప్రసిద్ధ బహుముఖ రచయిత.",
    booksCount: 35,
    specialization: "Literature",
    birthYear: 1922,
    awards: ["Sahitya Akademi Award"],
  },
  {
    id: "tripuraneni-ramaswamy",
    name: "Tripuraneni Ramaswamy",
    nameTelugu: "త్రిపురనేని రామస్వామి",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face",
    bio: "Social reformer and rationalist writer who challenged orthodox beliefs.",
    bioTelugu:
      "సంప్రదాయ విశ్వాసాలను సవాలు చేసిన సమాజ సంస్కర్త మరియు హేతువాది రచయిత.",
    booksCount: 28,
    specialization: "Philosophy",
    birthYear: 1887,
    awards: ["Rationalist Writer Award"],
  },
  {
    id: "bhanumathi-ramakrishna",
    name: "Bhanumathi Ramakrishna",
    nameTelugu: "భానుమతి రామకృష్ణ",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b332b1c0?w=300&h=300&fit=crop&crop=face",
    bio: "Multi-talented artist, writer, and filmmaker who contributed to Telugu cinema and literature.",
    bioTelugu:
      "తెలుగు సినిమా మరియు సాహిత్యానికి దోహదపడిన బహుముఖ కళాకారిణి, రచయిత్రి మరియు చిత్రనిర్మాత్రి.",
    booksCount: 15,
    specialization: "Arts",
    birthYear: 1925,
    awards: ["Padma Bhushan"],
  },
  {
    id: "malladi-venkata-krishnamurthy",
    name: "Malladi Venkata Krishnamurthy",
    nameTelugu: "మల్లాది వెంకట కృష్ణమూర్తి",
    image:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&h=300&fit=crop&crop=face",
    bio: "Contemporary novelist known for his engaging storytelling and social themes.",
    bioTelugu:
      "తన ఆకర్షణీయమైన కథా చెప్పికలు మరియు సామాజిక అంశాలకు ప్రసిద్ధ సమకాలీన రచయిత.",
    booksCount: 40,
    specialization: "Fiction",
    birthYear: 1951,
    awards: ["State Literary Award"],
  },
  {
    id: "volga",
    name: "Volga (Popuri Lalitha Kumari)",
    nameTelugu: "వోల్గా (పొప్పూరి లలిత కుమారి)",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    bio: "Feminist writer and translator known for her bold and progressive works.",
    bioTelugu:
      "తన ధైర్యవంతమైన మరియు ప్రగతిశీల రచనలకు ప్రసిద్ధ స్త్రీవాద రచయిత్రి మరియు అనువాదకురాలు.",
    booksCount: 20,
    specialization: "Fiction",
    birthYear: 1950,
    awards: ["Sahitya Akademi Award"],
  },
  {
    id: "sivasankari",
    name: "Sivasankari",
    nameTelugu: "శివశంకరి",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop&crop=face",
    bio: "Prolific Tamil writer whose works have been translated into Telugu.",
    bioTelugu:
      "తెలుగులోకి అనువదించబడిన రచనలతో ప్రసిద్ధ ప్రఖ్యాత తమిళ రచయిత్రి.",
    booksCount: 25,
    specialization: "Fiction",
    birthYear: 1942,
    awards: ["Padma Shri"],
  },
];

// Publishers data
export const publishers = [
  {
    id: "vishwakarma-publications",
    name: "Vishwakarma Publications",
    nameTelugu: "విశ్వకర్మ పబ్లికేషన్స్",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
    established: 1952,
    location: "Hyderabad",
    specialization: "Literature & Poetry",
    booksPublished: 500,
    description:
      "Leading Telugu publisher specializing in classical and contemporary literature.",
    descriptionTelugu:
      "సాంప్రదాయ మరియు సమకాలీన సాహిత్యంలో ప్రత్యేకత కలిగిన ప్రధాన తెలుగు ప్రచురణకర్త.",
  },
  {
    id: "andhra-saraswata-parishad",
    name: "Andhra Saraswata Parishad",
    nameTelugu: "ఆంధ్ర సరస్వత పరిషత్",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    established: 1938,
    location: "Vijayawada",
    specialization: "Educational & Cultural",
    booksPublished: 800,
    description:
      "Cultural organization promoting Telugu language and literature through publications.",
    descriptionTelugu:
      "ప్రచురణల ద్వారా తెలుగు భాష మరియు సాహిత్యాన్ని ప్రోత్సహిస్తున్న సాంస్కృతిక సంస్థ.",
  },
  {
    id: "vavilla-ramaswamy-sastrulu",
    name: "Vavilla Ramaswamy Sastrulu and Sons",
    nameTelugu: "వావిళ్ల రామస్వామి శాస్త్రులు అండ్ సన్స్",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=300&fit=crop",
    established: 1945,
    location: "Chennai",
    specialization: "Classical Literature",
    booksPublished: 600,
    description:
      "Renowned for publishing classical Telugu texts and translations.",
    descriptionTelugu:
      "సాంప్రదాయ తెలుగు గ్రంథాలు మరియు అనువాదాల ప్రచురణకు ప్రసిద్ధి.",
  },
  {
    id: "saraswati-pustakalayam",
    name: "Saraswati Pustakalayam",
    nameTelugu: "సరస్వతి పుస్తకాలయం",
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
    established: 1960,
    location: "Hyderabad",
    specialization: "Children's Books",
    booksPublished: 300,
    description:
      "Specializing in children's literature and educational materials.",
    descriptionTelugu: "పిల్లల సాహిత్యం మరియు విద్యా సామగ్రిలో ప్రత్యేకత.",
  },
  {
    id: "hasya-manjari-publications",
    name: "Hasya Manjari Publications",
    nameTelugu: "హాస్య మంజరి పబ్లికేషన్స్",
    image:
      "https://images.unsplash.com/photo-1495001258031-d1b407bc1776?w=400&h=300&fit=crop",
    established: 1975,
    location: "Bangalore",
    specialization: "Humor & Entertainment",
    booksPublished: 200,
    description:
      "Popular publisher of humor books and entertainment literature.",
    descriptionTelugu:
      "హాస్య పుస్తకలు మరియు వినోద సాహిత్య ప్రసిద్ధ ప్రచురణకర్త.",
  },
  {
    id: "telugu-university-press",
    name: "Telugu University Press",
    nameTelugu: "తెలుగు విశ్వవిద్యాలయ ప్రెస్",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
    established: 1985,
    location: "Hyderabad",
    specialization: "Academic & Research",
    booksPublished: 400,
    description: "Academic publisher focusing on research and scholarly works.",
    descriptionTelugu:
      "పరిశోధన మరియు పండిత్య రచనలపై దృష్టి సారించే అకాడమిక్ ప్రచురణకర్త.",
  },
  {
    id: "emesco-books",
    name: "Emesco Books",
    nameTelugu: "ఎమెస్కో బుక్స్",
    image:
      "https://images.unsplash.com/photo-1509266272358-7701da638078?w=400&h=300&fit=crop",
    established: 1980,
    location: "Vijayawada",
    specialization: "Contemporary Fiction",
    booksPublished: 350,
    description:
      "Modern publisher known for contemporary Telugu fiction and novels.",
    descriptionTelugu:
      "సమకాలీన తెలుగు కల్పిత కథలు మరియు నవలలకు ప్రసిద్ధ ఆధునిక ప్రచురణకర్త.",
  },
  {
    id: "navya-sahitya-mandali",
    name: "Navya Sahitya Mandali",
    nameTelugu: "నవ్య సాహిత్య మండలి",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop",
    established: 1970,
    location: "Guntur",
    specialization: "Modern Poetry",
    booksPublished: 250,
    description: "Promoting new age Telugu poetry and experimental literature.",
    descriptionTelugu:
      "కొత్త తరం తెలుగు కవిత్వం మరియు ప్రయోగాత్మక సాహిత్యాన్ని ప్రోత్సహిస్తుంది.",
  },
  {
    id: "bharathi-book-depot",
    name: "Bharathi Book Depot",
    nameTelugu: "భారతి బుక్ డిపో",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    established: 1955,
    location: "Visakhapatnam",
    specialization: "Devotional Books",
    booksPublished: 300,
    description: "Renowned for spiritual and devotional literature in Telugu.",
    descriptionTelugu:
      "తెలుగులో ఆధ్యాత్మిక మరియు భక్తి సాహిత్యానికి ప్రసిద్ధి.",
  },
  {
    id: "pragati-publications",
    name: "Pragati Publications",
    nameTelugu: "ప్రగతి పబ్లికేషన్స్",
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop",
    established: 1990,
    location: "Hyderabad",
    specialization: "Self-Help & Business",
    booksPublished: 180,
    description:
      "Modern publisher focusing on self-help, business, and motivational books.",
    descriptionTelugu:
      "స్వయం సహాయం, వ్యాపారం మరియు ప్రేరణాత్మక పుస్తకాలపై దృష్టి సారించే ఆధునిక ప్రచురణకర్త.",
  },
  {
    id: "kinige-publications",
    name: "Kinige Publications",
    nameTelugu: "కిణిగె పబ్లికేషన్స్",
    image:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=400&h=300&fit=crop",
    established: 2005,
    location: "Bangalore",
    specialization: "Digital & Print",
    booksPublished: 150,
    description:
      "New generation publisher with both digital and print offerings.",
    descriptionTelugu:
      "డిజిటల్ మరియు ప్రింట్ రెండింటినీ అందించే కొత్త తరం ప్రచురణకర్త.",
  },
  {
    id: "akshara-publications",
    name: "Akshara Publications",
    nameTelugu: "అక్షర పబ్లికేషన్స్",
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
    established: 1965,
    location: "Warangal",
    specialization: "Educational Textbooks",
    booksPublished: 400,
    description:
      "Leading publisher of educational textbooks and reference materials.",
    descriptionTelugu:
      "విద్యా పాఠ్య పుస్తకలు మరియు సంदర్భ సామగ్రి యొక్క ప్రధాన ప్రచురణకర్త.",
  },
];

export const languages = [
  { id: "telugu", name: "Telugu", nameTelugu: "తెలుగు" },
  { id: "english", name: "English", nameTelugu: "ఇంగ్లీ��్" },
  { id: "hindi", name: "Hindi", nameTelugu: "హిందీ" },
];

// Helper functions
export function getBookById(id: string): Book | undefined {
  return mockBooks.find((book) => book.id === id);
}

export function getRankedBooksByCategory(category: string): Book[] {
  return mockBooks
    .filter(
      (book) =>
        book.categoryRank &&
        book.category &&
        book.category.toLowerCase() === category.toLowerCase(),
    )
    .sort((a, b) => (a.categoryRank || 999) - (b.categoryRank || 999));
}

export function getTopRankedBooks(limit: number = 10): Book[] {
  return mockBooks
    .filter((book) => book.atakaRank)
    .sort((a, b) => (a.atakaRank || 999) - (b.atakaRank || 999))
    .slice(0, limit);
}

export function getRankingCategories(): string[] {
  const categories = new Set<string>();
  mockBooks.forEach((book) => {
    if (book.rankingCategory) {
      categories.add(book.rankingCategory);
    }
  });
  return Array.from(categories).sort();
}

export function getAffordableBooks(maxPrice: number = 150): Book[] {
  return mockBooks
    .filter((book) => book.price <= maxPrice)
    .sort((a, b) => a.price - b.price); // Sort by price ascending
}
export function getFeaturedBooks(): Book[] {
  return mockBooks.filter((book) => book.featured);
}

export function getBestsellers(): Book[] {
  return mockBooks.filter((book) => book.bestseller);
}

export function getNewArrivals(): Book[] {
  return mockBooks.filter((book) => book.newArrival);
}

export function searchBooks(query: string): Book[] {
  const lowerQuery = query.toLowerCase();
  return mockBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(lowerQuery) ||
      book.titleTelugu?.toLowerCase().includes(lowerQuery) ||
      book.author.toLowerCase().includes(lowerQuery) ||
      book.authorTelugu?.toLowerCase().includes(lowerQuery) ||
      book.category.toLowerCase().includes(lowerQuery) ||
      book.categoryTelugu?.toLowerCase().includes(lowerQuery) ||
      book.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
  );
}
