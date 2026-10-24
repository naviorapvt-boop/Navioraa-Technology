/**
 * NAVIORAA Institute of Technology & R&D
 * Official Syllabi & Study Notes Repository
 * Provides rich downloadable curriculum modules and topic study notes.
 */

export interface TopicNote {
  id: string;
  title: string;
  slug: string;
  category: string;
  level: string;
  duration: string;
  fileFormat: string;
  fileSize: string;
  description: string;
  summary: string;
  modules: {
    moduleNumber: number;
    title: string;
    duration: string;
    topics: string[];
    practicalLab: string;
  }[];
  prerequisites: string[];
  keyOutcomes: string[];
  toolsAndStack: string[];
  careerRoles: string[];
}

export const TOPIC_NOTES: TopicNote[] = [
  {
    id: 'note-python-fullstack',
    title: 'Python Full Stack Engineering — Complete Syllabus & Notes',
    slug: 'python-fullstack-syllabus',
    category: 'Full Stack Development',
    level: 'Beginner to Advanced',
    duration: '16 Weeks (Hands-on)',
    fileFormat: 'PDF / Text Guide',
    fileSize: '4.2 MB',
    description: 'Complete course curriculum and study notes covering Python 3, OOP, PostgreSQL schema design, Django REST Framework, React integration, and AWS cloud deployment.',
    summary: 'Master full-stack enterprise web development using modern Python, Django, PostgreSQL, and React. Includes 6 production-grade projects and CI/CD pipelines.',
    modules: [
      {
        moduleNumber: 1,
        title: 'Core Python, Memory Model & Object-Oriented Architecture',
        duration: 'Weeks 1-3',
        topics: [
          'Python memory management, mutable vs immutable data types',
          'List comprehensions, generators, and memory-efficient iterators',
          'Advanced OOP: Polymorphism, multiple inheritance, and mixins',
          'Decorators, context managers, and custom exception handling',
          'PEP 8 formatting, type hints, and unit testing with pytest'
        ],
        practicalLab: 'Develop a high-performance CLI task runner and automated file system organizer with comprehensive test coverage.'
      },
      {
        moduleNumber: 2,
        title: 'Relational Database Architecture with PostgreSQL',
        duration: 'Weeks 4-6',
        topics: [
          'Relational database modeling, normalization (1NF to 3NF)',
          'Indexes: B-tree, GIN, composite indexes, and EXPLAIN ANALYZE',
          'Complex SQL joins, subqueries, window functions, and views',
          'Transactions, ACID compliance, and isolation levels',
          'Django ORM: Model inheritance, QuerySets, migrations, and transactions'
        ],
        practicalLab: 'Design a normalized multi-tenant database for an e-commerce platform with query optimization under 100k rows.'
      },
      {
        moduleNumber: 3,
        title: 'Django REST Framework & Secure API Engineering',
        duration: 'Weeks 7-10',
        topics: [
          'Django project architecture, settings segmentation, and apps',
          'DRF Serializers, ModelSerializers, and field-level validation',
          'JWT authentication, refresh token rotation, and role-based permissions',
          'API throttling, caching with Redis, and pagination strategies',
          'Swagger / OpenAPI automated documentation generation'
        ],
        practicalLab: 'Construct an enterprise REST API gateway with JWT authorization, rate-limiting, and Redis caching.'
      },
      {
        moduleNumber: 4,
        title: 'React Frontend Integration & Cloud Deployment',
        duration: 'Weeks 11-16',
        topics: [
          'React 18 fundamentals: Hooks, custom hooks, and Context API',
          'Axios interceptors, async state management, and error boundaries',
          'Tailwind CSS design system and responsive UI architecture',
          'Docker containerization: Dockerfile and multi-stage docker-compose',
          'AWS deployment: EC2 instance provisioning, Nginx reverse proxy, and SSL'
        ],
        practicalLab: 'Deploy a full-stack SaaS platform to AWS EC2 behind an Nginx reverse proxy with automated SSL certificates.'
      }
    ],
    prerequisites: [
      'Basic familiarity with computers and operating systems',
      'No prior programming background strictly required (begins from fundamentals)',
      'A computer with at least 8GB RAM and stable internet'
    ],
    keyOutcomes: [
      'Build and deploy production-ready web apps from database to UI',
      'Write secure, rate-limited REST APIs with token authentication',
      'Deploy containerized applications with Docker to cloud servers',
      'Graduate with 6 verified GitHub repositories and a live portfolio'
    ],
    toolsAndStack: ['Python 3.12', 'Django 5', 'Django REST Framework', 'PostgreSQL', 'React', 'Tailwind CSS', 'Docker', 'AWS EC2', 'Git / GitHub'],
    careerRoles: ['Python Full Stack Developer', 'Django Backend Engineer', 'Software Engineer - Associate', 'Web Systems Developer']
  },
  {
    id: 'note-mern-stack',
    title: 'MERN Stack Web Development — Architecture & Notes',
    slug: 'mern-stack-syllabus',
    category: 'Web Development',
    level: 'Beginner to Advanced',
    duration: '14 Weeks (Hands-on)',
    fileFormat: 'PDF / Text Guide',
    fileSize: '3.6 MB',
    description: 'Modern full-stack JavaScript: MongoDB aggregation pipelines, Express.js microservices, React state systems, and Node.js asynchronous architecture.',
    summary: 'Build end-to-end JavaScript applications with MongoDB, Express, React, and Node.js. Master asynchronous programming, WebSockets, and cloud hosting.',
    modules: [
      {
        moduleNumber: 1,
        title: 'Modern JavaScript (ES6+) & Node.js Runtime',
        duration: 'Weeks 1-3',
        topics: [
          'Event loop, libuv, non-blocking I/O, and asynchronous patterns',
          'Promises, async/await, and error propagation',
          'Node.js core modules: fs, path, http, and events',
          'NPM package management, semantic versioning, and environment variables'
        ],
        practicalLab: 'Build an event-driven file processing server with stream pipelines and custom event emitters.'
      },
      {
        moduleNumber: 2,
        title: 'Express.js & MongoDB Document Databases',
        duration: 'Weeks 4-7',
        topics: [
          'Express middleware pipeline, route handlers, and error middlewares',
          'MongoDB schema modeling with Mongoose, indexes, and validation',
          'Advanced aggregation pipelines: $match, $group, $lookup, $unwind',
          'Bcrypt password hashing and JWT token authentication'
        ],
        practicalLab: 'Develop a secure collaborative team portal API with document validation and aggregation analytics.'
      },
      {
        moduleNumber: 3,
        title: 'React Single Page Applications & UI State',
        duration: 'Weeks 8-11',
        topics: [
          'Component lifecycle, state, props, and functional hooks',
          'Global state management with Zustand / Context API',
          'React Router v6: Nested layouts, loaders, and protected routes',
          'Consuming REST APIs, optimistic UI updates, and caching'
        ],
        practicalLab: 'Build an interactive dashboard with real-time chart visualizers and responsive layouts.'
      },
      {
        moduleNumber: 4,
        title: 'Real-Time WebSockets, Testing & Deployment',
        duration: 'Weeks 12-14',
        topics: [
          'Bidirectional real-time communication with Socket.io',
          'Unit testing with Vitest and integration testing with Supertest',
          'CI/CD pipelines with GitHub Actions',
          'Production deployment to Render / Vercel / Railway'
        ],
        practicalLab: 'Launch a real-time multiplayer collaborative workspace with live cursor synchronization.'
      }
    ],
    prerequisites: [
      'Basic knowledge of HTML & CSS',
      'Logical reasoning and enthusiasm for web software'
    ],
    keyOutcomes: [
      'Develop end-to-end applications entirely in modern JavaScript / TypeScript',
      'Architect resilient MongoDB schemas capable of high read/write throughput',
      'Implement real-time features using WebSockets and event listeners'
    ],
    toolsAndStack: ['JavaScript ES2024', 'TypeScript', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'React', 'Socket.io', 'Vercel / Render'],
    careerRoles: ['MERN Stack Developer', 'Frontend Developer', 'Node.js Backend Developer', 'Full Stack Engineer']
  },
  {
    id: 'note-ai-ml',
    title: 'Applied AI & Machine Learning Engineering — Curriculum & Notes',
    slug: 'ai-ml-syllabus',
    category: 'Artificial Intelligence',
    level: 'Intermediate',
    duration: '16 Weeks (Hands-on)',
    fileFormat: 'PDF / Text Guide',
    fileSize: '5.1 MB',
    description: 'From statistical fundamentals and NumPy/Pandas pipelines to deep neural networks, transformer architectures, and applied LLM engineering.',
    summary: 'Comprehensive hands-on AI curriculum covering data preprocessing, supervised/unsupervised machine learning, PyTorch neural networks, computer vision, and generative AI.',
    modules: [
      {
        moduleNumber: 1,
        title: 'Scientific Computing, Statistics & Data Engineering',
        duration: 'Weeks 1-4',
        topics: [
          'Linear algebra, matrix operations, and multivariable calculus intuition',
          'NumPy vectorization, broadcasting, and performance optimizations',
          'Pandas data frames: Wrangling, missing value imputation, and feature engineering',
          'Exploratory data analysis (EDA) with Seaborn and Matplotlib'
        ],
        practicalLab: 'Clean and explore a 500,000-record real-world financial transaction dataset to detect fraud indicators.'
      },
      {
        moduleNumber: 2,
        title: 'Supervised & Unsupervised Machine Learning Algorithms',
        duration: 'Weeks 5-8',
        topics: [
          'Regression models: Linear, Ridge, Lasso, and Polynomial',
          'Classification: Logistic regression, Decision Trees, Random Forests, XGBoost',
          'Model evaluation: Precision, recall, ROC-AUC, confusion matrix, cross-validation',
          'Clustering and dimensionality reduction: K-Means, DBSCAN, PCA'
        ],
        practicalLab: 'Train and fine-tune an ensemble gradient-boosted classifier achieving >92% accuracy on clinical diagnostic data.'
      },
      {
        moduleNumber: 3,
        title: 'Deep Learning & Neural Networks with PyTorch',
        duration: 'Weeks 9-12',
        topics: [
          'Perceptrons, backpropagation, and activation functions (ReLU, GELU, Sigmoid)',
          'Convolutional Neural Networks (CNNs) for image classification',
          'Transfer learning with ResNet and Vision Transformers',
          'Recurrent networks, LSTMs, and sequence modeling'
        ],
        practicalLab: 'Train a medical imaging classifier with PyTorch using transfer learning and data augmentation.'
      },
      {
        moduleNumber: 4,
        title: 'NLP, Transformers & Generative AI Systems',
        duration: 'Weeks 13-16',
        topics: [
          'Word embeddings (Word2Vec, GloVe) and self-attention mechanism',
          'Hugging Face transformers: BERT, RoBERTa, and GPT architectures',
          'Retrieval-Augmented Generation (RAG) using LangChain / LlamaIndex and vector databases',
          'Model serving with FastAPI and Docker'
        ],
        practicalLab: 'Build and deploy a domain-specific conversational RAG assistant connected to a vector knowledge base.'
      }
    ],
    prerequisites: [
      'Basic Python programming familiarity',
      'Fundamental high school mathematics (algebra & statistics basics)'
    ],
    keyOutcomes: [
      'Formulate and solve real-world problems with machine learning pipelines',
      'Train deep neural networks using PyTorch with GPU acceleration',
      'Build end-to-end RAG systems using modern vector databases and LLM APIs'
    ],
    toolsAndStack: ['Python 3.12', 'NumPy', 'Pandas', 'Scikit-Learn', 'PyTorch', 'Hugging Face', 'FastAPI', 'Qdrant / ChromaDB', 'Docker'],
    careerRoles: ['AI / ML Engineer', 'Machine Learning Specialist', 'Data Scientist', 'Applied AI Researcher']
  },
  {
    id: 'note-data-analytics',
    title: 'Data Analytics & Power BI Mastery — Study Notes & Roadmap',
    slug: 'data-analytics-syllabus',
    category: 'Data Analytics',
    level: 'Beginner to Intermediate',
    duration: '10 Weeks (Hands-on)',
    fileFormat: 'PDF / Text Guide',
    fileSize: '3.4 MB',
    description: 'Master advanced SQL queries, Excel business modeling, Power BI interactive dashboard design, and introductory predictive analytics.',
    summary: 'Practical enterprise data analysis curriculum focused on solving business challenges with SQL, advanced spreadsheet modeling, DAX measures, and Power BI dashboards.',
    modules: [
      {
        moduleNumber: 1,
        title: 'Advanced SQL for Business Intelligence',
        duration: 'Weeks 1-3',
        topics: [
          'Relational querying: Aggregations, GROUP BY, HAVING',
          'Window functions: ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD',
          'Common Table Expressions (CTEs) and recursive queries',
          'Data cleaning, regex extraction, and conditional transformations in SQL'
        ],
        practicalLab: 'Write complex SQL business reports to analyze customer churn, cohort retention, and monthly recurring revenue.'
      },
      {
        moduleNumber: 2,
        title: 'Power BI Modeling & DAX Formulas',
        duration: 'Weeks 4-7',
        topics: [
          'Power Query ETL: Extracting, transforming, and merging multi-source data',
          'Data modeling: Star schema vs Snowflake schema, relationships',
          'DAX (Data Analysis Expressions): CALCULATE, FILTER, RELATED, Time Intelligence',
          'Creating interactive KPI cards, matrix tables, and custom drill-through charts'
        ],
        practicalLab: 'Build an executive sales & financial performance dashboard with dynamic filtering and time-period comparison.'
      },
      {
        moduleNumber: 3,
        title: 'Python for Data Automation & Visualization',
        duration: 'Weeks 8-10',
        topics: [
          'Automating Excel reports using openpyxl and Pandas',
          'Statistical hypothesis testing and correlation matrices',
          'Storytelling with data: Designing clear, stakeholder-ready presentations'
        ],
        practicalLab: 'Create an automated weekly KPI report generator that pulls from SQL and outputs formatted PDF/Excel summaries.'
      }
    ],
    prerequisites: [
      'Basic comfort with spreadsheets (Excel / Google Sheets)',
      'No coding background required'
    ],
    keyOutcomes: [
      'Extract and transform data from diverse databases using standard SQL',
      'Architect production Power BI dashboards with DAX measures',
      'Present actionable business intelligence to organizational decision-makers'
    ],
    toolsAndStack: ['PostgreSQL / MySQL', 'Microsoft Power BI', 'DAX', 'Power Query', 'Excel (Advanced)', 'Python Pandas'],
    careerRoles: ['Data Analyst', 'Business Intelligence (BI) Developer', 'Financial Data Analyst', 'Reporting Specialist']
  },
  {
    id: 'note-programming-interview',
    title: 'Core Programming & Technical Interview Handbook',
    slug: 'programming-interview-handbook',
    category: 'Programming',
    level: 'All Levels',
    duration: 'Self-Paced / 8 Weeks',
    fileFormat: 'PDF / Text Guide',
    fileSize: '3.8 MB',
    description: 'High-frequency algorithmic problem patterns, data structure diagrams, time complexity cheatsheets, and system design essentials.',
    summary: 'The comprehensive technical interview survival guide covering arrays, strings, two pointers, sliding window, trees, graphs, and dynamic programming.',
    modules: [
      {
        moduleNumber: 1,
        title: 'Data Structures Foundations & Big-O Analysis',
        duration: 'Self-Paced',
        topics: [
          'Time and space complexity analysis with practical examples',
          'Arrays, dynamic resizing, hash tables, and collision handling',
          'Singly and doubly linked lists, fast and slow pointers',
          'Stacks and queues: Monotonic stacks and priority queues'
        ],
        practicalLab: 'Implement dynamic array and LRU cache from scratch with O(1) operations.'
      },
      {
        moduleNumber: 2,
        title: 'Algorithmic Problem-Solving Patterns',
        duration: 'Self-Paced',
        topics: [
          'Two pointers, sliding window, and binary search variations',
          'Tree traversals: BFS, DFS, lowest common ancestor, validation',
          'Graph algorithms: Dijkstra, topological sort, union-find',
          'Dynamic programming: Top-down memoization vs bottom-up tabulation'
        ],
        practicalLab: 'Solve and benchmark 50 curated high-frequency coding interview challenges with idiomatic code.'
      }
    ],
    prerequisites: [
      'Basic familiarity with either Python, Java, C++, or JavaScript'
    ],
    keyOutcomes: [
      'Confidently tackle technical coding rounds in software engineering interviews',
      'Optimize algorithm runtimes from exponential to linear / logarithmic',
      'Structure clean, bug-free implementations under interview time limits'
    ],
    toolsAndStack: ['Python', 'Java', 'C++', 'Data Structures', 'Algorithms', 'LeetCode Patterns'],
    careerRoles: ['Software Engineer', 'Backend Developer', 'Systems Engineer']
  }
];

/**
 * Generates and downloads a clean, beautifully formatted course syllabus or study notes file.
 */
export function downloadSyllabusFile(note: TopicNote): void {
  const separator = '='.repeat(70);
  const subSeparator = '-'.repeat(70);

  let content = '';
  content += `${separator}\n`;
  content += `NAVIORAA INSTITUTE OF TECHNOLOGY & R&D\n`;
  content += `OFFICIAL CURRICULUM SYLLABUS & STUDY NOTES\n`;
  content += `${separator}\n\n`;

  content += `TITLE: ${note.title}\n`;
  content += `CATEGORY: ${note.category}\n`;
  content += `SKILL LEVEL: ${note.level}\n`;
  content += `ESTIMATED DURATION: ${note.duration}\n`;
  content += `INSTITUTE CONTACT: +91 9890187383 | naviora.pvt@gmail.com\n`;
  content += `WEBSITE: https://navioraa.com\n\n`;

  content += `${subSeparator}\n`;
  content += `PROGRAM OVERVIEW\n`;
  content += `${subSeparator}\n`;
  content += `${note.description}\n\n`;
  content += `Summary:\n${note.summary}\n\n`;

  content += `${subSeparator}\n`;
  content += `TECHNOLOGY STACK & TOOLS MASTERED\n`;
  content += `${subSeparator}\n`;
  content += note.toolsAndStack.map(t => `  • ${t}`).join('\n') + '\n\n';

  content += `${subSeparator}\n`;
  content += `PREREQUISITES\n`;
  content += `${subSeparator}\n`;
  content += note.prerequisites.map(p => `  • ${p}`).join('\n') + '\n\n';

  content += `${subSeparator}\n`;
  content += `DETAILED MODULE BREAKDOWN & PRACTICAL LABS\n`;
  content += `${subSeparator}\n\n`;

  note.modules.forEach(mod => {
    content += `Module ${mod.moduleNumber}: ${mod.title} (${mod.duration})\n`;
    content += `Key Topics Covered:\n`;
    mod.topics.forEach(topic => {
      content += `   - ${topic}\n`;
    });
    content += `Hands-On Production Lab:\n`;
    content += `   -> ${mod.practicalLab}\n\n`;
  });

  content += `${subSeparator}\n`;
  content += `EXPECTED LEARNING OUTCOMES\n`;
  content += `${subSeparator}\n`;
  note.keyOutcomes.forEach(o => {
    content += `  [✓] ${o}\n`;
  });
  content += '\n';

  content += `${subSeparator}\n`;
  content += `CAREER OPPORTUNITIES & GRADUATE ROLES\n`;
  content += `${subSeparator}\n`;
  content += note.careerRoles.map(r => `  • ${r}`).join('\n') + '\n\n';

  content += `${separator}\n`;
  content += `HOW TO ENQUIRE OR ENROLL:\n`;
  content += `Call or WhatsApp: +91 9890187383\n`;
  content += `Official Email: naviora.pvt@gmail.com\n`;
  content += `Campus Admissions: Mon - Sat: 9:00 AM - 7:00 PM IST\n`;
  content += `© ${new Date().getFullYear()} NAVIORAA Institute of Technology & R&D. All rights reserved.\n`;
  content += `${separator}\n`;

  // Trigger browser download via Blob
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `NAVIORAA_${note.slug.toUpperCase()}_SYLLABUS.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
