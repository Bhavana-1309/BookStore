const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/user');
const Book = require('../models/book');
const Cart = require('../models/cart');
const Order = require('../models/order');

dotenv.config();

const sampleBooks = [
  // Programming
  {
    title: "Eloquent JavaScript, 3rd Edition",
    author: "Marijn Haverbeke",
    genre: "Programming",
    description: "A modern introduction to programming. A guide to the JavaScript language, covering variables, control structures, functions, and data structures, as well as DOM manipulation.",
    price: 899,
    rating: 4.8,
    stock: 15,
    image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    genre: "Programming",
    description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. This book teaches you how to write good code and dismantle bad code.",
    price: 1250,
    rating: 4.9,
    stock: 8,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "You Don't Know JS: Scope & Closures",
    author: "Kyle Simpson",
    genre: "Programming",
    description: "No matter how much experience you have with JavaScript, odds are you don't fully understand the language. This guide focuses on scope, closures, and the foundation of JavaScript execution.",
    price: 549,
    rating: 4.7,
    stock: 20,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    genre: "Programming",
    description: "The bible of algorithms. A comprehensive textbook covering a broad range of algorithms in depth, yet making their design and analysis accessible to all levels of readers.",
    price: 2499,
    rating: 4.8,
    stock: 6,
    image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&q=80&w=400"
  },

  // Technology
  {
    title: "The Innovators",
    author: "Walter Isaacson",
    genre: "Technology",
    description: "The story of the pioneers, hackers, inventors, and entrepreneurs who created the digital revolution, explaining how their minds worked and what made them so creative.",
    price: 699,
    rating: 4.6,
    stock: 12,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "Life 3.0: Being Human in the Age of AI",
    author: "Max Tegmark",
    genre: "Technology",
    description: "An exploration of how Artificial Intelligence will affect our future, including jobs, laws, warfare, crime, and our very sense of being human.",
    price: 599,
    rating: 4.5,
    stock: 14,
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "Zero to One",
    author: "Peter Thiel",
    genre: "Technology",
    description: "Notes on Startups, or How to Build the Future. Thiel talks about how to find value in unexpected places and construct singular monopolies in the technology sector.",
    price: 499,
    rating: 4.6,
    stock: 25,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400"
  },

  // Science
  {
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    genre: "Science",
    description: "Hawking's landmark book about the origin and structure of the universe, introducing concepts like the Big Bang, black holes, and the nature of space and time.",
    price: 450,
    rating: 4.8,
    stock: 18,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "Cosmos",
    author: "Carl Sagan",
    genre: "Science",
    description: "A cosmic journey through 15 billion years of evolution, exploring science, philosophy, history, and how human consciousness has sought its place in the universe.",
    price: 520,
    rating: 4.9,
    stock: 10,
    image: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "The Selfish Gene",
    author: "Richard Dawkins",
    genre: "Science",
    description: "A brilliant classic on evolutionary biology that explains how genes act as the fundamental units of natural selection and shape the behavior of living organisms.",
    price: 499,
    rating: 4.4,
    stock: 11,
    image: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&q=80&w=400"
  },

  // Fiction
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    description: "A timeless novel examining prejudice and injustice in the American South through the eyes of Scout Finch, whose father defends a black man falsely accused of rape.",
    price: 399,
    rating: 4.9,
    stock: 22,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "1984",
    author: "George Orwell",
    genre: "Fiction",
    description: "A dystopian classic about a totalitarian regime led by Big Brother, illustrating how censorship, surveillance, and propaganda manipulate public thoughts and behaviors.",
    price: 350,
    rating: 4.7,
    stock: 30,
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Fiction",
    description: "A tragic story of love, ambition, and the American Dream during the Roaring Twenties, narrated by Nick Carraway, who observes the mysterious millionaire Jay Gatsby.",
    price: 299,
    rating: 4.5,
    stock: 15,
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400"
  },

  // History
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    genre: "History",
    description: "An intellectual sweep of human history, detailing how cognitive, agricultural, and scientific revolutions have shaped Homo sapiens and our current global society.",
    price: 599,
    rating: 4.8,
    stock: 17,
    image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "The Silk Roads",
    author: "Peter Frankopan",
    genre: "History",
    description: "An extraordinary history of the world, shifting the focus away from Europe and towards the east, detailing how the Silk Roads connected civilizations across centuries.",
    price: 650,
    rating: 4.6,
    stock: 9,
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "Guns, Germs, and Steel",
    author: "Jared Diamond",
    genre: "History",
    description: "A fascinating explanation of why Eurasian civilizations survived and conquered others, citing environmental and geographical advantages rather than genetic superiority.",
    price: 499,
    rating: 4.5,
    stock: 10,
    image: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&q=80&w=400"
  },

  // Biography
  {
    title: "Steve Jobs",
    author: "Walter Isaacson",
    genre: "Biography",
    description: "The exclusive, bestselling biography of Apple's co-founder Steve Jobs, based on dozens of interviews with Jobs himself, friends, family, and rivals.",
    price: 799,
    rating: 4.7,
    stock: 11,
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "The Diary of a Young Girl",
    author: "Anne Frank",
    genre: "Biography",
    description: "The powerful diary written by Anne Frank, a Jewish teenager who hid with her family during the Nazi occupation of the Netherlands in World War II.",
    price: 250,
    rating: 4.9,
    stock: 25,
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "Elon Musk",
    author: "Walter Isaacson",
    genre: "Biography",
    description: "The astonishingly intimate story of the most controversial and creative innovator of our era—a rule-breaking visionary who helped lead the world into the epoch of electric vehicles and private space flight.",
    price: 999,
    rating: 4.5,
    stock: 14,
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=400"
  },

  // Self-Help
  {
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Help",
    description: "A highly practical guide to breaking bad habits and creating good ones, by using tiny 1% daily changes to achieve life-altering results.",
    price: 499,
    rating: 4.9,
    stock: 40,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "The Subtle Art of Not Giving a F*ck",
    author: "Mark Manson",
    genre: "Self-Help",
    description: "A counterintuitive guide to living a good life, showing how to embrace struggle and limitations rather than constantly striving for toxic positivity.",
    price: 399,
    rating: 4.3,
    stock: 35,
    image: "https://images.unsplash.com/photo-1491841573190-7cb5212ee332?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "Man's Search for Meaning",
    author: "Viktor E. Frankl",
    genre: "Self-Help",
    description: "Psychiatrist Viktor Frankl's memoir of his experiences in Nazi concentration camps, introducing logotherapy and illustrating how finding purpose helps survive suffering.",
    price: 299,
    rating: 4.8,
    stock: 20,
    image: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&q=80&w=400"
  },

  // Business
  {
    title: "The Intelligent Investor",
    author: "Benjamin Graham",
    genre: "Business",
    description: "The classic guide to value investing, offering practical strategies to protect assets and achieve long-term wealth in the stock market.",
    price: 699,
    rating: 4.7,
    stock: 13,
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    genre: "Business",
    description: "First published in 1937, this book details the money-making secrets of some of the most successful individuals of the early 20th century.",
    price: 250,
    rating: 4.5,
    stock: 30,
    image: "https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    genre: "Business",
    description: "Kiyosaki tells the story of his two fathers, illustrating different attitudes toward money, investing, assets, and financial literacy.",
    price: 399,
    rating: 4.6,
    stock: 50,
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=400"
  },

  // Mystery
  {
    title: "The Adventures of Sherlock Holmes",
    author: "Arthur Conan Doyle",
    genre: "Mystery",
    description: "A collection of twelve short stories featuring the famous consulting detective Sherlock Holmes and his companion Dr. John Watson.",
    price: 250,
    rating: 4.8,
    stock: 15,
    image: "https://images.unsplash.com/photo-1587876931567-564ce588bfbd?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "And Then There Were None",
    author: "Agatha Christie",
    genre: "Mystery",
    description: "Ten strangers are lured to an isolated island off the Devon coast by a mysterious host, where they are killed off one by one in accordance with a nursery rhyme.",
    price: 320,
    rating: 4.9,
    stock: 12,
    image: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "The Girl with the Dragon Tattoo",
    author: "Stieg Larsson",
    genre: "Mystery",
    description: "A dark mystery involving journalist Mikael Blomkvist and hacker Lisbeth Salander as they investigate the decades-old disappearance of a wealthy family's heir.",
    price: 450,
    rating: 4.4,
    stock: 10,
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=400"
  },

  // Romance
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    description: "The classic romantic comedy following Elizabeth Bennet as she learns the errors of hasty judgments and discovers the depth of Mr. Darcy's character.",
    price: 299,
    rating: 4.8,
    stock: 18,
    image: "https://images.unsplash.com/photo-1513001900722-370f803f498d?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "The Fault in Our Stars",
    author: "John Green",
    genre: "Romance",
    description: "A touching and humorous story of Hazel Grace Lancaster, a sixteen-year-old cancer patient, who meets and falls in love with Augustus Waters in a support group.",
    price: 350,
    rating: 4.6,
    stock: 20,
    image: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "Normal People",
    author: "Sally Rooney",
    genre: "Romance",
    description: "The complex relationship between Marianne Sheridan and Connell Waldron as they navigate high school and university life in Ireland.",
    price: 499,
    rating: 4.2,
    stock: 15,
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "Jane Eyre",
    author: "Charlotte Brontë",
    genre: "Romance",
    description: "The gothic romance following the orphan Jane Eyre as she becomes a governess at Thornfield Hall and falls in love with her employer, the brooding Edward Rochester.",
    price: 299,
    rating: 4.7,
    stock: 10,
    image: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "The Notebook",
    author: "Nicholas Sparks",
    genre: "Romance",
    description: "The tragic and beautiful love story of Noah Calhoun and Allison Nelson, whose love spans decades, social barriers, and memory loss.",
    price: 350,
    rating: 4.5,
    stock: 16,
    image: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&q=80&w=400"
  },
  // ================= Programming =================
{
  title: "Effective Java",
  author: "Joshua Bloch",
  genre: "Programming",
  description: "A definitive guide to Java best practices, covering object-oriented design, generics, concurrency, and performance optimization.",
  price: 1099,
  rating: 4.9,
  stock: 18,
  image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400"
},
{
  title: "Head First Design Patterns",
  author: "Eric Freeman",
  genre: "Programming",
  description: "An easy-to-understand introduction to software design patterns with practical Java examples.",
  price: 1199,
  rating: 4.8,
  stock: 12,
  image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400"
},

// ================= Technology =================
{
  title: "The Phoenix Project",
  author: "Gene Kim",
  genre: "Technology",
  description: "A novel about DevOps, IT operations, and how modern software teams improve productivity.",
  price: 699,
  rating: 4.7,
  stock: 14,
  image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400"
},
{
  title: "The DevOps Handbook",
  author: "Gene Kim",
  genre: "Technology",
  description: "Practical guidance for implementing DevOps culture, automation, and continuous delivery.",
  price: 899,
  rating: 4.8,
  stock: 10,
  image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=400"
},

// ================= Science =================
{
  title: "Astrophysics for People in a Hurry",
  author: "Neil deGrasse Tyson",
  genre: "Science",
  description: "An accessible introduction to astrophysics and the mysteries of the universe.",
  price: 499,
  rating: 4.7,
  stock: 16,
  image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=400"
},
{
  title: "Brief Answers to the Big Questions",
  author: "Stephen Hawking",
  genre: "Science",
  description: "Stephen Hawking answers humanity's biggest questions about science and our future.",
  price: 550,
  rating: 4.8,
  stock: 11,
  image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=400"
},

// ================= Fiction =================
{
  title: "The Alchemist",
  author: "Paulo Coelho",
  genre: "Fiction",
  description: "A philosophical novel about following your dreams and discovering your destiny.",
  price: 399,
  rating: 4.8,
  stock: 22,
  image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400"
},
{
  title: "The Kite Runner",
  author: "Khaled Hosseini",
  genre: "Fiction",
  description: "A moving story of friendship, betrayal, and redemption set in Afghanistan.",
  price: 450,
  rating: 4.9,
  stock: 17,
  image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=400"
},

// ================= History =================
{
  title: "India After Gandhi",
  author: "Ramachandra Guha",
  genre: "History",
  description: "A detailed history of independent India and its political and social transformation.",
  price: 799,
  rating: 4.7,
  stock: 13,
  image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=400"
},
{
  title: "SPQR",
  author: "Mary Beard",
  genre: "History",
  description: "A comprehensive history of Ancient Rome from its origins to its imperial peak.",
  price: 699,
  rating: 4.6,
  stock: 12,
  image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400"
},

// ================= Biography =================
{
  title: "Wings of Fire",
  author: "A. P. J. Abdul Kalam",
  genre: "Biography",
  description: "The inspiring autobiography of India's Missile Man and former President.",
  price: 399,
  rating: 4.9,
  stock: 28,
  image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=400"
},
{
  title: "Shoe Dog",
  author: "Phil Knight",
  genre: "Biography",
  description: "The remarkable story of how Nike was built from a small startup into a global brand.",
  price: 699,
  rating: 4.8,
  stock: 18,
  image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=400"
},

// ================= Self Help =================
{
  title: "Deep Work",
  author: "Cal Newport",
  genre: "Self-Help",
  description: "Learn how focused work can dramatically improve productivity and career success.",
  price: 499,
  rating: 4.8,
  stock: 20,
  image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=400"
},
{
  title: "The Power of Habit",
  author: "Charles Duhigg",
  genre: "Self-Help",
  description: "Explains how habits are formed and how they can be changed for better living.",
  price: 450,
  rating: 4.7,
  stock: 19,
  image: "https://images.unsplash.com/photo-1491841573190-7cb5212ee332?auto=format&fit=crop&q=80&w=400"
},

// ================= Business =================
{
  title: "The Lean Startup",
  author: "Eric Ries",
  genre: "Business",
  description: "A modern guide to building successful startups using continuous innovation.",
  price: 650,
  rating: 4.8,
  stock: 14,
  image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=400"
},
{
  title: "Good to Great",
  author: "Jim Collins",
  genre: "Business",
  description: "Explores why some companies make the leap from good to truly great.",
  price: 750,
  rating: 4.7,
  stock: 15,
  image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&q=80&w=400"
},

// ================= Mystery =================
{
  title: "Gone Girl",
  author: "Gillian Flynn",
  genre: "Mystery",
  description: "A psychological thriller full of shocking twists surrounding a missing wife.",
  price: 499,
  rating: 4.6,
  stock: 18,
  image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400"
},
{
  title: "The Silent Patient",
  author: "Alex Michaelides",
  genre: "Mystery",
  description: "A gripping psychological mystery about a woman who stops speaking after a murder.",
  price: 599,
  rating: 4.8,
  stock: 16,
  image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=400"
},

// ================= Romance =================
{
  title: "Me Before You",
  author: "Jojo Moyes",
  genre: "Romance",
  description: "An emotional love story about two people whose lives are changed forever.",
  price: 450,
  rating: 4.7,
  stock: 20,
  image: "https://images.unsplash.com/photo-1513001900722-370f803f498d?auto=format&fit=crop&q=80&w=400"
},
{
  title: "It Ends With Us",
  author: "Colleen Hoover",
  genre: "Romance",
  description: "A bestselling contemporary romance exploring love, resilience, and difficult choices.",
  price: 499,
  rating: 4.8,
  stock: 22,
  image: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&q=80&w=400"
},
// ================= Programming =================
{
  title: "Effective Java",
  author: "Joshua Bloch",
  genre: "Programming",
  description: "A definitive guide to Java best practices, covering object-oriented design, generics, concurrency, and performance optimization.",
  price: 1099,
  rating: 4.9,
  stock: 18,
  image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400"
},
{
  title: "Head First Design Patterns",
  author: "Eric Freeman",
  genre: "Programming",
  description: "An easy-to-understand introduction to software design patterns with practical Java examples.",
  price: 1199,
  rating: 4.8,
  stock: 12,
  image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400"
},

// ================= Technology =================
{
  title: "The Phoenix Project",
  author: "Gene Kim",
  genre: "Technology",
  description: "A novel about DevOps, IT operations, and how modern software teams improve productivity.",
  price: 699,
  rating: 4.7,
  stock: 14,
  image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400"
},
{
  title: "The DevOps Handbook",
  author: "Gene Kim",
  genre: "Technology",
  description: "Practical guidance for implementing DevOps culture, automation, and continuous delivery.",
  price: 899,
  rating: 4.8,
  stock: 10,
  image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=400"
},

// ================= Science =================
{
  title: "Astrophysics for People in a Hurry",
  author: "Neil deGrasse Tyson",
  genre: "Science",
  description: "An accessible introduction to astrophysics and the mysteries of the universe.",
  price: 499,
  rating: 4.7,
  stock: 16,
  image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=400"
},
{
  title: "Brief Answers to the Big Questions",
  author: "Stephen Hawking",
  genre: "Science",
  description: "Stephen Hawking answers humanity's biggest questions about science and our future.",
  price: 550,
  rating: 4.8,
  stock: 11,
  image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=400"
},

// ================= Fiction =================
{
  title: "The Alchemist",
  author: "Paulo Coelho",
  genre: "Fiction",
  description: "A philosophical novel about following your dreams and discovering your destiny.",
  price: 399,
  rating: 4.8,
  stock: 22,
  image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400"
},
{
  title: "The Kite Runner",
  author: "Khaled Hosseini",
  genre: "Fiction",
  description: "A moving story of friendship, betrayal, and redemption set in Afghanistan.",
  price: 450,
  rating: 4.9,
  stock: 17,
  image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=400"
},

// ================= History =================
{
  title: "India After Gandhi",
  author: "Ramachandra Guha",
  genre: "History",
  description: "A detailed history of independent India and its political and social transformation.",
  price: 799,
  rating: 4.7,
  stock: 13,
  image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=400"
},
{
  title: "SPQR",
  author: "Mary Beard",
  genre: "History",
  description: "A comprehensive history of Ancient Rome from its origins to its imperial peak.",
  price: 699,
  rating: 4.6,
  stock: 12,
  image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400"
},

// ================= Biography =================
{
  title: "Wings of Fire",
  author: "A. P. J. Abdul Kalam",
  genre: "Biography",
  description: "The inspiring autobiography of India's Missile Man and former President.",
  price: 399,
  rating: 4.9,
  stock: 28,
  image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=400"
},
{
  title: "Shoe Dog",
  author: "Phil Knight",
  genre: "Biography",
  description: "The remarkable story of how Nike was built from a small startup into a global brand.",
  price: 699,
  rating: 4.8,
  stock: 18,
  image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=400"
},

// ================= Self Help =================
{
  title: "Deep Work",
  author: "Cal Newport",
  genre: "Self-Help",
  description: "Learn how focused work can dramatically improve productivity and career success.",
  price: 499,
  rating: 4.8,
  stock: 20,
  image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=400"
},
{
  title: "The Power of Habit",
  author: "Charles Duhigg",
  genre: "Self-Help",
  description: "Explains how habits are formed and how they can be changed for better living.",
  price: 450,
  rating: 4.7,
  stock: 19,
  image: "https://images.unsplash.com/photo-1491841573190-7cb5212ee332?auto=format&fit=crop&q=80&w=400"
},

// ================= Business =================
{
  title: "The Lean Startup",
  author: "Eric Ries",
  genre: "Business",
  description: "A modern guide to building successful startups using continuous innovation.",
  price: 650,
  rating: 4.8,
  stock: 14,
  image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=400"
},
{
  title: "Good to Great",
  author: "Jim Collins",
  genre: "Business",
  description: "Explores why some companies make the leap from good to truly great.",
  price: 750,
  rating: 4.7,
  stock: 15,
  image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&q=80&w=400"
},

// ================= Mystery =================
{
  title: "Gone Girl",
  author: "Gillian Flynn",
  genre: "Mystery",
  description: "A psychological thriller full of shocking twists surrounding a missing wife.",
  price: 499,
  rating: 4.6,
  stock: 18,
  image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400"
},
{
  title: "The Silent Patient",
  author: "Alex Michaelides",
  genre: "Mystery",
  description: "A gripping psychological mystery about a woman who stops speaking after a murder.",
  price: 599,
  rating: 4.8,
  stock: 16,
  image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=400"
},

// ================= Romance =================
{
  title: "Me Before You",
  author: "Jojo Moyes",
  genre: "Romance",
  description: "An emotional love story about two people whose lives are changed forever.",
  price: 450,
  rating: 4.7,
  stock: 20,
  image: "https://images.unsplash.com/photo-1513001900722-370f803f498d?auto=format&fit=crop&q=80&w=400"
},
{
  title: "It Ends With Us",
  author: "Colleen Hoover",
  genre: "Romance",
  description: "A bestselling contemporary romance exploring love, resilience, and difficult choices.",
  price: 499,
  rating: 4.8,
  stock: 22,
  image: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&q=80&w=400"
},

];

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bookstore');
    console.log('Seed connection established...');

    // Clear existing data
    await User.deleteMany();
    await Book.deleteMany();
    await Cart.deleteMany();
    await Order.deleteMany();
    console.log('Existing collections cleared...');

    // Create test accounts
    const userPassword = 'user123';
    const adminPassword = 'admin123';

    // Seeding users (pre-save hook hashes their password automatically)
    const testUser = await User.create({
      name: "John Doe",
      email: "user@gmail.com",
      password: userPassword,
      phone: "9876543210",
      role: "user"
    });

    const testAdmin = await User.create({
      name: "Admin Manager",
      email: "admin@gmail.com",
      password: adminPassword,
      phone: "9988776655",
      role: "admin"
    });

    console.log('Default accounts created:');
    console.log(`- Customer: user@gmail.com / ${userPassword}`);
    console.log(`- Admin:    admin@gmail.com / ${adminPassword}`);

    // Seed Books
    await Book.insertMany(sampleBooks);
    console.log(`${sampleBooks.length} sample books seeded successfully!`);

    // Create empty carts for seeded users
    await Cart.create({ userId: testUser._id, items: [] });
    await Cart.create({ userId: testAdmin._id, items: [] });

    console.log('Seeding process complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
