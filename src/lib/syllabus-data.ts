/**
 * NAVIORAA Institute of Technology & R&D
 * Official Syllabi & Study Notes Repository
 * Provides rich downloadable curriculum modules and topic study notes in PDF.
 */
import jsPDF from 'jspdf';

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
    fileFormat: 'Official PDF Syllabus',
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
    fileFormat: 'Official PDF Syllabus',
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
    fileFormat: 'Official PDF Syllabus',
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
    fileFormat: 'Official PDF Syllabus',
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
    fileFormat: 'Official PDF Syllabus',
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
 * Generates and downloads a clean, beautifully formatted course syllabus or study notes PDF.
 */
export function downloadSyllabusFile(note: TopicNote): void {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth(); // 595.28 pt
    const pageHeight = doc.internal.pageSize.getHeight(); // 841.89 pt
    const margin = 40;
    const contentWidth = pageWidth - margin * 2; // 515.28 pt
    let y = margin;

    const drawPageHeader = () => {
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
      doc.text('NAVIORAA INSTITUTE OF TECHNOLOGY & R&D | OFFICIAL SYLLABUS', margin, 24);
      doc.text('+91 9890187383 | naviora.pvt@gmail.com', pageWidth - margin, 24, { align: 'right' });
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, 28, pageWidth - margin, 28);
    };

    const checkPageBreak = (spaceNeeded: number) => {
      if (y + spaceNeeded > pageHeight - 45) {
        doc.addPage();
        y = margin;
        drawPageHeader();
      }
    };

    // First page top banner
    doc.setFillColor(0, 82, 255); // #0052FF Brand Blue
    doc.roundedRect(margin, y, contentWidth, 70, 8, 8, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('NAVIORAA INSTITUTE OF TECHNOLOGY & R&D', margin + 16, y + 24);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('OFFICIAL CURRICULUM SYLLABUS & PRACTICAL STUDY GUIDE', margin + 16, y + 40);

    doc.setFontSize(7.5);
    doc.setTextColor(219, 234, 254);
    doc.text('ISO-Aligned Pedagogy  ·  1-on-1 Code Reviews  ·  Production Capstones  ·  Industry Faculty', margin + 16, y + 55);

    y += 88;

    // Course Title & Metadata
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    const titleLines = doc.splitTextToSize(note.title, contentWidth);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 18 + 4;

    // Metadata Badges Row
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 82, 255);
    doc.text(`Category: ${note.category}   |   Level: ${note.level}   |   Duration: ${note.duration}`, margin, y);
    y += 16;

    // Contact info line
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text('Admissions & Faculty Helpdesk: +91 9890187383  ·  naviora.pvt@gmail.com  ·  navioraa.com', margin, y);
    y += 12;

    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, margin + contentWidth, y);
    y += 16;

    // Program Overview
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(0, 82, 255);
    doc.text('1. PROGRAM OVERVIEW & OBJECTIVES', margin, y);
    y += 13;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    const descLines = doc.splitTextToSize(note.description, contentWidth);
    doc.text(descLines, margin, y);
    y += descLines.length * 12 + 6;

    const summaryLines = doc.splitTextToSize(note.summary, contentWidth);
    doc.text(summaryLines, margin, y);
    y += summaryLines.length * 12 + 14;

    // Technologies & Tools
    checkPageBreak(70);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(0, 82, 255);
    doc.text('2. TECHNOLOGY STACK & TOOLS MASTERED', margin, y);
    y += 13;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    const techText = note.toolsAndStack.join('  •  ');
    const techLines = doc.splitTextToSize(techText, contentWidth);
    doc.text(techLines, margin, y);
    y += techLines.length * 12 + 14;

    // Prerequisites
    checkPageBreak(70);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(0, 82, 255);
    doc.text('3. PREREQUISITES & ELIGIBILITY', margin, y);
    y += 13;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    note.prerequisites.forEach((p) => {
      checkPageBreak(18);
      const pLines = doc.splitTextToSize(`• ${p}`, contentWidth - 10);
      doc.text(pLines, margin + 5, y);
      y += pLines.length * 12 + 2;
    });
    y += 10;

    // Module Breakdown
    checkPageBreak(90);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(0, 82, 255);
    doc.text('4. INTENSIVE CURRICULUM MODULES & PRACTICAL LABS', margin, y);
    y += 15;

    note.modules.forEach((mod) => {
      checkPageBreak(95);

      doc.setFillColor(241, 245, 249);
      doc.rect(margin, y - 9, contentWidth, 18, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(`Module ${mod.moduleNumber}: ${mod.title} (${mod.duration})`, margin + 6, y + 4);
      y += 17;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      mod.topics.forEach((t) => {
        checkPageBreak(16);
        const tLines = doc.splitTextToSize(`- ${t}`, contentWidth - 16);
        doc.text(tLines, margin + 12, y);
        y += tLines.length * 11 + 2;
      });

      checkPageBreak(28);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(5, 150, 105);
      doc.text('Hands-On Production Lab:', margin + 12, y + 2);
      y += 11;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
      const labLines = doc.splitTextToSize(mod.practicalLab, contentWidth - 20);
      doc.text(labLines, margin + 16, y);
      y += labLines.length * 11 + 10;
    });

    // Learning Outcomes - Highlighted in Green per user instruction
    checkPageBreak(90);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(5, 150, 105);
    doc.text('5. WHAT YOU WILL ACHIEVE (LEARNING OUTCOMES)', margin, y);
    y += 13;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    note.keyOutcomes.forEach((out) => {
      checkPageBreak(22);
      const oLines = doc.splitTextToSize(`[✓] ${out}`, contentWidth - 10);
      doc.text(oLines, margin + 5, y);
      y += oLines.length * 12 + 3;
    });
    y += 10;

    // Career Paths
    checkPageBreak(60);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(0, 82, 255);
    doc.text('6. CAREER OPPORTUNITIES & GRADUATE ROLES', margin, y);
    y += 13;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    const roleText = note.careerRoles.join('   ·   ');
    const roleLines = doc.splitTextToSize(roleText, contentWidth);
    doc.text(roleLines, margin, y);
    y += roleLines.length * 12 + 14;

    // Footer Info Box
    checkPageBreak(65);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, contentWidth, 48, 6, 6, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, y, contentWidth, 48, 6, 6, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text('HOW TO ENROL OR SCHEDULE 1-ON-1 FACULTY CONSULTATION:', margin + 10, y + 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text('Call / WhatsApp: +91 9890187383   |   Email: naviora.pvt@gmail.com   |   Website: navioraa.com', margin + 10, y + 28);
    doc.text(`© ${new Date().getFullYear()} NAVIORAA Institute of Technology & R&D. Verified Educational Document.`, margin + 10, y + 39);

    const totalPages = doc.internal.pages.length - 1;
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin, pageHeight - 16, { align: 'right' });
    }

    doc.save(`NAVIORAA_${note.slug.toUpperCase()}_SYLLABUS.pdf`);
  } catch (err) {
    console.warn('PDF generation fallback to text:', err);
    const separator = '='.repeat(70);
    let content = `${separator}
NAVIORAA INSTITUTE OF TECHNOLOGY & R&D
OFFICIAL SYLLABUS: ${note.title}
Contact: +91 9890187383 | naviora.pvt@gmail.com
${separator}

`;
    content += `DESCRIPTION:
${note.description}

`;
    content += `MODULES:\n` + note.modules.map(m => `Module ${m.moduleNumber}: ${m.title}\n  Lab: ${m.practicalLab}`).join('\n\n') + '\n\n';
    content += `WHAT YOU ACHIEVE:\n` + note.keyOutcomes.map(o => `[✓] ${o}`).join('\n') + '\n';
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
}
