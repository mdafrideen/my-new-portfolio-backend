import pool from './config/db';

const skills = [
  // Frontend
  { name: 'JavaScript', icon: 'JS', category: 'Frontend', sort_order: 1 },
  { name: 'HTML', icon: 'HTML', category: 'Frontend', sort_order: 2 },
  { name: 'CSS', icon: 'CSS', category: 'Frontend', sort_order: 3 },
  { name: 'React', icon: '⚛️', category: 'Frontend', sort_order: 4 },
  { name: 'Next.js', icon: '▲', category: 'Frontend', sort_order: 5 },
  { name: 'Tailwind CSS', icon: '🎨', category: 'Frontend', sort_order: 6 },
  
  // Backend
  { name: 'Node.js', icon: '🟢', category: 'Backend', sort_order: 7 },
  { name: 'Django', icon: '🐍', category: 'Backend', sort_order: 8 },
  { name: 'Python', icon: '🐍', category: 'Backend', sort_order: 9 },
  { name: 'Flask', icon: '🌶️', category: 'Backend', sort_order: 10 },
  { name: 'Express.js', icon: '🚀', category: 'Backend', sort_order: 11 },
  
  // Database
  { name: 'MySQL', icon: '🗄️', category: 'Database', sort_order: 12 },
  { name: 'MongoDB', icon: '🍃', category: 'Database', sort_order: 13 },
  { name: 'Firebase', icon: '🔥', category: 'Database', sort_order: 14 },
  { name: 'Supabase', icon: '⚡', category: 'Database', sort_order: 15 },
  
  // Tools
  { name: 'Power BI', icon: '📊', category: 'Tools', sort_order: 16 },
  { name: 'Pandas', icon: '🐼', category: 'Tools', sort_order: 17 },
  { name: 'Scikit-learn', icon: '🤖', category: 'Tools', sort_order: 18 },
  { name: 'Streamlit', icon: '🎈', category: 'Tools', sort_order: 19 },
  { name: 'Git', icon: '📦', category: 'Tools', sort_order: 20 },
];

const experience = [
  {
    company: 'Coimbatore Institute of Technology',
    role: 'MSc Data Science Student',
    duration: '2023 - 2028',
    description: 'Integrated MSc Data Science student exploring data engineering, MLOps, and scalable web architectures. Building real-world projects at the intersection of data and full-stack development.',
    is_current: true,
    sort_order: 1
  },
  {
    company: 'Green Valley Matriculation School',
    role: 'Higher Secondary Education',
    duration: 'Completed 2023',
    description: 'Completed higher secondary education with focus on mathematics and science.',
    is_current: false,
    sort_order: 2
  }
];

const projects = [
  // 1
  {
    title: "Spotify Data Analytics Dashboard",
    slug: "spotify-dashboard",
    description: "Built an end-to-end data pipeline to load Spotify data from CSV into MySQL using Python scripts. Performed SQL analysis on tracks, artists, genres, and audio features to uncover popularity trends.",
    long_description: "End-to-end data pipeline project that loads Spotify data from CSV into MySQL using Python scripts. SQL analysis performed on tracks, artists, genres, and audio features to uncover popularity trends. Includes Power BI dashboard for visualization.",
    thumbnail: "https://portfolio-malairaj.netlify.app/images/spotify.png",
    images: '["https://portfolio-malairaj.netlify.app/images/spotify.png"]',
    tags: '["MySQL","Python","Power BI","Pandas"]',
    github_url: "https://github.com/MALAIRAJ23/SPOTIFY_DASHBOARD",
    live_url: "",
    featured: true,
    sort_order: 1
  },
  // 2
  {
    title: "SympAI — AI-Powered Symptom Checker",
    slug: "sympai",
    description: "AI-driven symptom checker using React, Node.js, and BERT. Predicts medical conditions in under 1.5 seconds with Firebase Authentication.",
    long_description: "AI-powered symptom checker that uses BERT model to predict medical conditions. Built with React frontend, Node.js backend, and Firebase Authentication. Delivers predictions in under 1.5 seconds.",
    thumbnail: "https://portfolio-malairaj.netlify.app/images/symAI.png",
    images: '["https://portfolio-malairaj.netlify.app/images/symAI.png"]',
    tags: '["React","Node.js","BERT","Firebase"]',
    github_url: "https://github.com/MALAIRAJ23/SYMP-AI",
    live_url: "https://symp-ai-1.onrender.com/",
    featured: true,
    sort_order: 2
  },
  // 3
  {
    title: "Eunoia — Mental Wellness Web App",
    slug: "eunoia",
    description: "Full-stack Django app for journaling, sentiment analysis (NLTK VADER), and mood prediction using Ridge Regression with Plotly dashboards.",
    long_description: "Mental wellness web app built with Django. Features journaling, sentiment analysis using NLTK VADER, and mood prediction using Ridge Regression. Includes Plotly dashboards for mood visualization. Data stored in Firestore.",
    thumbnail: "https://portfolio-malairaj.netlify.app/images/eunoia.png",
    images: '["https://portfolio-malairaj.netlify.app/images/eunoia.png"]',
    tags: '["Django","NLTK","Plotly","Firestore"]',
    github_url: "https://github.com/MALAIRAJ23/eunoia_1",
    live_url: "",
    featured: true,
    sort_order: 3
  },
  // 4
  {
    title: "Moodify — Music Recommendation App",
    slug: "moodify",
    description: "Music recommendation app generating personalized playlists based on mood and language. React frontend with Node.js/Express backend and Spotify API.",
    long_description: "Mood-based music recommendation app. Generates personalized playlists based on user mood and language preference. Built with React frontend, Node.js/Express backend, Firebase for auth, and Spotify API for music data.",
    thumbnail: "https://portfolio-malairaj.netlify.app/images/moodify.png",
    images: '["https://portfolio-malairaj.netlify.app/images/moodify.png"]',
    tags: '["React","Node.js","Firebase","Spotify API"]',
    github_url: "https://github.com/MALAIRAJ23/music-recommendation-moodify",
    live_url: "",
    featured: false,
    sort_order: 4
  },
  // 5
  {
    title: "Smart Mask Recommendation System",
    slug: "smart-mask",
    description: "Rule-based scoring engine analyzing 6+ health and environmental factors. Flask REST APIs delivering results in under 1 second.",
    long_description: "Smart mask recommendation system built with Python and Flask. Rule-based scoring engine that analyzes 6+ health and environmental factors including AQI, health conditions, and activity level. REST APIs deliver results in under 1 second.",
    thumbnail: "https://portfolio-malairaj.netlify.app/images/Smartmask.png",
    images: '["https://portfolio-malairaj.netlify.app/images/Smartmask.png"]',
    tags: '["Python","Flask","REST API"]',
    github_url: "https://github.com/MALAIRAJ23/SMART-MASK-RECOMMENDATION",
    live_url: "",
    featured: false,
    sort_order: 5
  },
  // 6
  {
    title: "Student Failure Prediction System",
    slug: "smartedu",
    description: "Supervised ML system comparing 5 models on 1,000+ records, achieving ~90% accuracy. Streamlit dashboard for real-time predictions.",
    long_description: "Supervised machine learning system that compares 5 different models on 1,000+ student records. Achieves approximately 90% accuracy. Includes a Streamlit dashboard for real-time predictions and model comparison.",
    thumbnail: "https://portfolio-malairaj.netlify.app/images/smartEdu.png",
    images: '["https://portfolio-malairaj.netlify.app/images/smartEdu.png"]',
    tags: '["Python","Scikit-learn","XGBoost","Streamlit"]',
    github_url: "https://github.com/MALAIRAJ23/Student-failure-prediction",
    live_url: "",
    featured: false,
    sort_order: 6
  },
  // 7
  {
    title: "Digital Garden — Knowledge Management",
    slug: "digital-garden",
    description: "Next.js app inspired by Obsidian & Roam Research. Features markdown editing, wiki-style linking, knowledge graph visualization, offline sync, and cloud backup via Supabase.",
    long_description: "Knowledge management system built with Next.js 14. Features markdown editing, wiki-style linking between notes, knowledge graph visualization, offline sync, cloud backup via Supabase, analytics dashboard, and dark/light themes.",
    thumbnail: "https://portfolio-malairaj.netlify.app/images/digigarden.jpg",
    images: '["https://portfolio-malairaj.netlify.app/images/digigarden.jpg"]',
    tags: '["Next.js 14","React 18","Tailwind CSS","Supabase"]',
    github_url: "https://github.com/MALAIRAJ23/digigarden",
    live_url: "",
    featured: false,
    sort_order: 7
  },
  // 8
  {
    title: "Shopper's Verdict — AI E-Commerce Tool",
    slug: "shoppers-verdict",
    description: "AI shopping assistant that scores products from Amazon and Flipkart, surfaces pros/cons, flags suspect reviews, and suggests better picks via a Chrome MV3 extension.",
    long_description: "AI-powered e-commerce analysis tool that scores products from Amazon and Flipkart. Surfaces pros/cons, flags suspect reviews, and suggests better picks. Delivered as a Chrome MV3 extension with in-page insights. Built with Python, Flask, Playwright, and scikit-learn.",
    thumbnail: "https://portfolio-malairaj.netlify.app/images/shoppers.jpg",
    images: '["https://portfolio-malairaj.netlify.app/images/shoppers.jpg"]',
    tags: '["Python","Flask","Playwright","scikit-learn","Chrome Extension"]',
    github_url: "https://github.com/MALAIRAJ23/shoppers-verdict-010",
    live_url: "https://shoppers-verdict-010.onrender.com/",
    featured: false,
    sort_order: 8
  }
];

const seedDatabase = async () => {
  try {
    const connection = await pool.getConnection();

    // 1. Clear existing data
    console.log('Clearing existing data...');
    await connection.query('DELETE FROM skills');
    await connection.query('DELETE FROM experience');
    await connection.query('DELETE FROM projects');
    console.log('✅ Tables cleared successfully.');

    // 2. Insert Skills
    for (const skill of skills) {
      await connection.query(
        'INSERT INTO skills (name, icon, category, sort_order) VALUES (?, ?, ?, ?)',
        [skill.name, skill.icon, skill.category, skill.sort_order]
      );
    }
    console.log(`✅ ${skills.length} skills inserted successfully.`);

    // 3. Insert Experience
    for (const exp of experience) {
      await connection.query(
        'INSERT INTO experience (company, role, duration, description, is_current, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
        [exp.company, exp.role, exp.duration, exp.description, exp.is_current, exp.sort_order]
      );
    }
    console.log(`✅ ${experience.length} experience entries inserted successfully.`);

    // 4. Insert Projects
    for (const project of projects) {
      await connection.query(
        `INSERT INTO projects 
        (title, slug, description, long_description, thumbnail, images, tags, github_url, live_url, featured, sort_order) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          project.title, 
          project.slug, 
          project.description, 
          project.long_description, 
          project.thumbnail, 
          project.images, 
          project.tags, 
          project.github_url, 
          project.live_url, 
          project.featured, 
          project.sort_order
        ]
      );
    }
    console.log(`✅ ${projects.length} projects inserted successfully.`);

    console.log('🎉 Database seeding completed successfully!');
    connection.release();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
