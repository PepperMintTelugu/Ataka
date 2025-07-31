#!/usr/bin/env node

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Mock data (from your frontend)
const mockBooks = [
  {
    _id: "1",
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
    description: "A classic Telugu novel that explores the depths of human nature and social dynamics. Winner of the Jnanpith Award.",
    descriptionTelugu: "మానవ స్వభావం మరియు సామాజిక గతిశీలతల లోతులను అన్వేషించే ఒక అద్భుతమైన తెలుగు నవల. జ్ఞానపీఠ పురస్కార విజేత రచన.",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
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
    seoDescription: "Buy Veyipadagalu, the acclaimed Telugu novel by Viswanatha Satyanarayana. Winner of Jnanpith Award. Free delivery and aesthetic packaging.",
    featured: true,
    bestseller: true,
    newArrival: false,
    atakaRank: 1,
    atakaRankingBasis: "sales",
    categoryRank: 1,
    categoryRankingBasis: "sales",
    rank: 1,
    rankingCategory: "Literature",
    rankingBasis: "sales",
    slug: "veyipadagalu",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "2",
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
    description: "A beautiful collection of poems celebrating Telugu language and culture. Perfect for students and poetry lovers.",
    descriptionTelugu: "తెలుగు భాష మరియు సంస్కృతిని కీర్తించే అందమైన కవితల సంకలనం. విద్యార్థులు మరియు కవిత్వ ప్రేమికులకు అనువైనది.",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop"],
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
    seoDescription: "Classic Telugu poetry collection celebrating our beautiful language and culture. Perfect for students and literature enthusiasts.",
    featured: false,
    bestseller: true,
    newArrival: false,
    atakaRank: 3,
    atakaRankingBasis: "reviews",
    categoryRank: 1,
    categoryRankingBasis: "reviews",
    rank: 2,
    rankingCategory: "Poetry",
    rankingBasis: "reviews",
    slug: "maa-telugu-talli",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Add more books as needed...
];

const categories = [
  { _id: "literature", name: "Literature", nameTelugu: "సాహిత్యం", slug: "literature" },
  { _id: "poetry", name: "Poetry", nameTelugu: "కవిత్వం", slug: "poetry" },
  { _id: "devotional", name: "Devotional", nameTelugu: "భక��తి", slug: "devotional" },
  { _id: "educational", name: "Educational", nameTelugu: "విద్యా", slug: "educational" },
  { _id: "children", name: "Children", nameTelugu: "పిల్లల పుస్తకలు", slug: "children" },
  { _id: "history", name: "History", nameTelugu: "చరిత్ర", slug: "history" },
  { _id: "philosophy", name: "Philosophy", nameTelugu: "తత్వశాస్త్రం", slug: "philosophy" },
  { _id: "biography", name: "Biography", nameTelugu: "జీవితచరిత్ర", slug: "biography" },
];

const authors = [
  {
    _id: "viswanatha-satyanarayana",
    name: "Viswanatha Satyanarayana",
    nameTelugu: "విశ్వనాథ సత్యనారాయణ",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    bio: "Jnanpith Award winner and renowned Telugu author known for his contributions to literature.",
    bioTelugu: "జ్ఞానపీఠ పురస్కార విజేత మరియు సాహిత్యానికి చేసిన కృషికి ప్రసిద్ధ తెలుగు రచయిత.",
    booksCount: 25,
    specialization: "Literature",
    birthYear: 1895,
    awards: ["Jnanpith Award", "Sahitya Akademi Award"],
    slug: "viswanatha-satyanarayana"
  },
  // Add more authors...
];

const publishers = [
  {
    _id: "vishwakarma-publications",
    name: "Vishwakarma Publications",
    nameTelugu: "విశ్వకర్మ పబ్లికేషన్స్",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
    established: 1952,
    location: "Hyderabad",
    specialization: "Literature & Poetry",
    booksPublished: 500,
    description: "Leading Telugu publisher specializing in classical and contemporary literature.",
    descriptionTelugu: "సాంప్రదాయ మరియు సమకాలీన సాహిత్యంలో ప్రత్యేకత కలిగిన ప్రధాన తెలుగు ప్రచురణకర్త.",
    slug: "vishwakarma-publications"
  },
  // Add more publishers...
];

// Simple schemas for migration
const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleTelugu: String,
  author: { type: String, required: true },
  authorTelugu: String,
  publisher: String,
  publisherTelugu: String,
  isbn: String,
  price: { type: Number, required: true },
  originalPrice: Number,
  discount: Number,
  description: String,
  descriptionTelugu: String,
  image: String,
  images: [String],
  category: String,
  categoryTelugu: String,
  pages: Number,
  language: String,
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  weight: Number,
  publicationYear: Number,
  rating: Number,
  reviewCount: Number,
  inStock: Boolean,
  stockCount: Number,
  tags: [String],
  seoTitle: String,
  seoDescription: String,
  featured: Boolean,
  bestseller: Boolean,
  newArrival: Boolean,
  atakaRank: Number,
  atakaRankingBasis: String,
  categoryRank: Number,
  categoryRankingBasis: String,
  rank: Number,
  rankingCategory: String,
  rankingBasis: String,
  slug: { type: String, unique: true }
}, {
  timestamps: true
});

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameTelugu: String,
  slug: { type: String, unique: true }
});

const AuthorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameTelugu: String,
  image: String,
  bio: String,
  bioTelugu: String,
  booksCount: Number,
  specialization: String,
  birthYear: Number,
  awards: [String],
  slug: { type: String, unique: true }
});

const PublisherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameTelugu: String,
  image: String,
  established: Number,
  location: String,
  specialization: String,
  booksPublished: Number,
  description: String,
  descriptionTelugu: String,
  slug: { type: String, unique: true }
});

const Book = mongoose.model('Book', BookSchema);
const Category = mongoose.model('Category', CategorySchema);
const Author = mongoose.model('Author', AuthorSchema);
const Publisher = mongoose.model('Publisher', PublisherSchema);

async function migrateData() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await Book.deleteMany({});
    await Category.deleteMany({});
    await Author.deleteMany({});
    await Publisher.deleteMany({});

    // Insert categories
    console.log('📚 Inserting categories...');
    await Category.insertMany(categories);
    console.log(`✅ Inserted ${categories.length} categories`);

    // Insert authors
    console.log('👤 Inserting authors...');
    await Author.insertMany(authors);
    console.log(`✅ Inserted ${authors.length} authors`);

    // Insert publishers
    console.log('🏢 Inserting publishers...');
    await Publisher.insertMany(publishers);
    console.log(`✅ Inserted ${publishers.length} publishers`);

    // Insert books
    console.log('📖 Inserting books...');
    await Book.insertMany(mockBooks);
    console.log(`✅ Inserted ${mockBooks.length} books`);

    console.log('🎉 Data migration completed successfully!');
    
    // Display summary
    const bookCount = await Book.countDocuments();
    const categoryCount = await Category.countDocuments();
    const authorCount = await Author.countDocuments();
    const publisherCount = await Publisher.countDocuments();
    
    console.log('\n📊 Database Summary:');
    console.log(`- Books: ${bookCount}`);
    console.log(`- Categories: ${categoryCount}`);
    console.log(`- Authors: ${authorCount}`);
    console.log(`- Publishers: ${publisherCount}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Run migration
migrateData();
