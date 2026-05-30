/**
 * Course catalogue - matches plan slugs from checkout.
 * Used to seed MongoDB and as fallback for dashboard.
 */

// ─── YouTube video mapping: course name keywords → YouTube video URL ─────────
// Videos from the official @adyapan21 channel
export const YOUTUBE_CHANNEL_ID = 'UCWXy5qiG6WqTrHq14KR4Bmg';
export const YOUTUBE_UPLOADS_PLAYLIST_ID = 'UUWXy5qiG6WqTrHq14KR4Bmg';

export const YOUTUBE_VIDEO_MAP: Record<string, string> = {
  // AI / ML
  'artificial intelligence':        'https://youtu.be/psK_6baeBVM',
  'ai engineering':                 'https://youtu.be/psK_6baeBVM',
  'generative ai':                  'https://youtu.be/psK_6baeBVM',
  'machine learning':               'https://youtu.be/7MVvXm1sgns',
  // Data
  'data science':                   'https://youtu.be/u9KHcqw052o',
  'data engineering':               'https://youtu.be/tOp2TJkXjdI',
  'data analytics':                 'https://youtu.be/ylnlLbTjsnU',
  'database management':            'https://www.youtube.com/@adyapan21',
  'data structures':                'https://www.youtube.com/@adyapan21',
  'business analytics':             'https://youtu.be/C4eGK63uHQs',
  // Web / Dev
  'web development':                'https://youtu.be/rUmsWcxtCF4',
  'web 3.0':                        'https://youtu.be/TMMYc2Xy71w',
  'web 3':                          'https://youtu.be/TMMYc2Xy71w',
  'app development':                'https://www.youtube.com/@adyapan21',
  'python full stack':              'https://youtu.be/7sV0xpH5mBg',
  'python programming':             'https://youtu.be/-6oPsFnwL1Q',
  'java programming':               'https://www.youtube.com/watch?v=frCcSHS3Rio',
  'java full stack':                'https://www.youtube.com/watch?v=frCcSHS3Rio',
  'selenium testing':               'https://www.youtube.com/@adyapan21',
  // Cloud / DevOps
  'devops engineering':             'https://youtu.be/YEhpSfLNhe0',
  'devops':                         'https://youtu.be/YEhpSfLNhe0',
  'cloud computing':                'https://youtu.be/KEt387h652I',
  'amazon web services':            'https://youtu.be/aM9IYYiA2TY',
  'aws':                            'https://youtu.be/aM9IYYiA2TY',
  // Security / Blockchain
  'cyber security':                 'https://www.youtube.com/watch?v=l2P6qQ-JTWY',
  'blockchain & bitcoin':           'https://youtu.be/h72Y6RbCZLU',
  'blockchain':                     'https://youtu.be/h72Y6RbCZLU',
  'bitcoin':                        'https://youtu.be/h72Y6RbCZLU',
  // Design
  'ar/vr development':              'https://youtu.be/xIHZD3YoW3g',
  'ar/vr':                          'https://youtu.be/xIHZD3YoW3g',
  'ar vr':                          'https://youtu.be/xIHZD3YoW3g',
  'ui/ux design':                   'https://youtu.be/jCaAYmHnnHw?si=Z9DSYqz9Yhv_Jjse',
  'ui/ux':                          'https://youtu.be/jCaAYmHnnHw?si=Z9DSYqz9Yhv_Jjse',
  'ui ux design':                   'https://youtu.be/jCaAYmHnnHw?si=Z9DSYqz9Yhv_Jjse',
  'ui ux':                          'https://youtu.be/jCaAYmHnnHw?si=Z9DSYqz9Yhv_Jjse',
  'graphic design':                 'https://www.youtube.com/@adyapan21',
  'vfx':                            'https://www.youtube.com/@adyapan21',
  // Management / Commerce
  'finance':                        'https://youtu.be/qZctuN6wHfA',
  'investment banking':             'https://www.youtube.com/@adyapan21',
  'investment analysis':            'https://www.youtube.com/@adyapan21',
  'financial economics':            'https://www.youtube.com/@adyapan21',
  'chartered accountancy':          'https://www.youtube.com/@adyapan21',
  'acca f4':                        'https://youtu.be/ujUeNUhFOz0',
  'acca':                           'https://youtu.be/ujUeNUhFOz0',
  'marketing management':           'https://www.youtube.com/@adyapan21',
  'digital marketing':              'https://www.youtube.com/@adyapan21',
  'social media marketing':         'https://www.youtube.com/@adyapan21',
  'hrm':                            'https://www.youtube.com/watch?v=y7wnUmnECTU',
  'human resource':                 'https://www.youtube.com/watch?v=y7wnUmnECTU',
  'management consultancy':         'https://www.youtube.com/@adyapan21',
  'supply chain':                   'https://www.youtube.com/@adyapan21',
  'sap fica':                       'https://www.youtube.com/@adyapan21',
  'salesforce':                     'https://www.youtube.com/@adyapan21',
  'stock marketing':                'https://www.youtube.com/@adyapan21',
  'spoken english':                 'https://www.youtube.com/@adyapan21',
  // ECE
  'embedded systems':               'https://youtu.be/HsICMiee2DM',
  'hybrid and electric vehicle':    'https://www.youtube.com/@adyapan21',
  'hybrid':                         'https://www.youtube.com/@adyapan21',
  'electric vehicle':               'https://www.youtube.com/@adyapan21',
  'vlsi':                           'https://youtu.be/xSb5VH_3kH8',
  'iot':                            'https://www.youtube.com/@adyapan21',
  'robotics':                       'https://www.youtube.com/@adyapan21',
  'power systems':                  'https://www.youtube.com/watch?v=27r9XUgbljQ',
  // Economics
  'business & financial economics': 'https://www.youtube.com/@adyapan21',
  'data analysis for economics':    'https://www.youtube.com/@adyapan21',
  // Mechanical
  'autocad':                        'https://youtu.be/6rbw-l_B4EI',
  'catia':                          'https://www.youtube.com/@adyapan21',
  'car design':                     'https://www.youtube.com/@adyapan21',
  'quality':                        'https://www.youtube.com/@adyapan21',
  // Bio & Life Sciences
  'bioinformatics':                 'https://www.youtube.com/watch?v=YKfhLqtWtEc',
  'microbiology':                   'https://www.youtube.com/watch?v=0YMd8eCm1KQ',
  'molecular biology':              'https://www.youtube.com/watch?v=_xzXGKukdug',
  'genetic engineering':            'https://www.youtube.com/@adyapan21',
  'pharmacovigilance':              'https://www.youtube.com/@adyapan21',
  'nanotechnology':                 'https://youtu.be/KhHUeokRGlg',
  'nano technology':                'https://youtu.be/KhHUeokRGlg',
  'nano tech':                      'https://youtu.be/KhHUeokRGlg',
  'food science':                   'https://www.youtube.com/@adyapan21',
  'nutrition':                      'https://www.youtube.com/@adyapan21',
  'sensory science':                'https://www.youtube.com/@adyapan21',
  'medical coding':                 'https://www.youtube.com/watch?v=lSJgOAfWUmw&t=751s',
  // Civil
  'construction':                   'https://www.youtube.com/@adyapan21',
  'civil':                          'https://www.youtube.com/@adyapan21',
  // Other engineering videos currently available on the channel
  'chemical engineering':           'https://www.youtube.com/watch?v=DSKIlN7bbaA',
};

/** Default YouTube channel URL */
export const DEFAULT_YOUTUBE_URL = 'https://www.youtube.com/@adyapan21';

/**
 * Given a course title, return the YouTube video URL.
 * Returns channel URL as fallback.
 */
export function getYouTubeUrl(title: string): string {
  const lower = title.toLowerCase();
  const keys = Object.keys(YOUTUBE_VIDEO_MAP).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (lower.includes(key)) return YOUTUBE_VIDEO_MAP[key];
  }
  return DEFAULT_YOUTUBE_URL;
}

/**
 * Extract YouTube video ID from URL or return the official uploads playlist.
 */
export function getYouTubeEmbedUrl(title: string): string {
  const url = getYouTubeUrl(title);
  
  // If only the channel is mapped, embed the official uploads playlist.
  if (url.includes('@adyapan21') || url.includes('/channel/') || url.includes('/c/')) {
    return `https://www.youtube.com/embed/videoseries?list=${YOUTUBE_UPLOADS_PLAYLIST_ID}`;
  }
  
  // Extract video ID from various YouTube URL formats
  let videoId = '';
  
  // Format: https://www.youtube.com/watch?v=VIDEO_ID
  if (url.includes('watch?v=')) {
    videoId = url.split('watch?v=')[1].split('&')[0];
  }
  // Format: https://youtu.be/VIDEO_ID
  else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0];
  }
  // Format: https://www.youtube.com/embed/VIDEO_ID
  else if (url.includes('/embed/')) {
    videoId = url.split('/embed/')[1].split('?')[0];
  }
  
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

// ─── Thumbnail mapping: course name keywords → local thumbnail file ───────────
// Filenames match exactly what's in public/course-thumbnails/
// Course brochure mapping: course name keywords -> PDF file in public/brochures/
export const BROCHURE_MAP: Record<string, string> = {
  'artificial intelligence':        'Artificial Intelligence.pdf',
  'ai engineering':                 'AI ML Blended (3 months).pdf',
  'generative ai':                  'Gen AI.pdf',
  'machine learning':               'Machine Learning .pdf',
  'data science':                   'Data Science.pdf',
  'data engineering':               'Data Engineering .pdf',
  'data analytics':                 'Data Analytics.pdf',
  'database management':            'Data Science.pdf',
  'data structures':                'C++ with DSA.pdf',
  'data structure':                 'C++ with DSA.pdf',
  'web development':                'Web Development (Java) 8 weeks.pdf',
  'web 3.0':                        'Web 3.0 with Blockchain.pdf',
  'web 3':                          'Web 3.0 with Blockchain.pdf',
  'app development':                'Android App Development.pdf',
  'python full stack':              'Web Development (Python) 8 weeks.pdf',
  'python programming':             'Python.pdf',
  'java programming':               'Java Full Stack Development.pdf',
  'java full stack':                'Java Full Stack Development.pdf',
  'selenium testing':               'Selenium Testing with Java.pdf',
  'devops engineering':             'DevOps.pdf',
  'devops':                         'DevOps.pdf',
  'cloud computing':                'Cloud Computing.pdf',
  'aws':                            'AWS.pdf',
  'cyber security':                 'Cyber Security.pdf',
  'blockchain & bitcoin':           'Blockchain & Bitcoin.pdf',
  'blockchain':                     'Blockchain & Bitcoin.pdf',
  'bitcoin':                        'Blockchain & Bitcoin.pdf',
  'ar/vr development':              'AR_VR.pdf',
  'ar/vr':                          'AR_VR.pdf',
  'ar vr':                          'AR_VR.pdf',
  'ui/ux design':                   'UI_UX Design.pdf',
  'ui/ux':                          'UI_UX Design.pdf',
  'ui ux':                          'UI_UX Design.pdf',
  'graphic design':                 'Graphic design.pdf',
  'vfx':                            'Graphic design.pdf',
  'investment banking':             'Investment Banking.pdf',
  'investment analysis':            'Investment Banking.pdf',
  'business analytics':             'Business Analytics (8weeks).pdf',
  'financial economics':            'Finance (Advanced).pdf',
  'business & financial economics': 'Finance (Advanced).pdf',
  'data analysis for economics':    'Data Analytics.pdf',
  'chartered accountancy':          'ACCA F4 (Corporate Law).pdf',
  'cfa':                            'Finance (Advanced).pdf',
  'acca f4':                        'ACCA F4 (Corporate Law).pdf',
  'acca':                           'ACCA F4 (Corporate Law).pdf',
  'marketing management':           'Marketing Management .pdf',
  'digital marketing':              'Digital marketing.pdf',
  'social media marketing':         'Social Media Marketing .pdf',
  'hrm':                            'HR Management.pdf',
  'human resource':                 'HR Management.pdf',
  'management consultancy':         'Management consulting.pdf',
  'management consulting':          'Management consulting.pdf',
  'supply chain':                   'Supply Chain Management.pdf',
  'sap fica':                       'SAP FICA.pdf',
  'salesforce':                     'Business Analytics (8weeks).pdf',
  'stock marketing':                'Stock Market.pdf',
  'spoken english':                 'Spoken English.pdf',
  'finance':                        'Finance (Beginner).pdf',
  'embedded systems':               'Embedded Systems.pdf',
  'hybrid & electric vehicle':      'Hybrid and electric vehicle.pdf',
  'hybrid':                         'Hybrid and electric vehicle.pdf',
  'electric vehicle':               'Electric Vehicles.pdf',
  'vlsi':                           'VLSI.pdf',
  'iot & robotics':                 'Robotics.pdf',
  'iot':                            'Robotics.pdf',
  'robotics':                       'Robotics.pdf',
  'power systems':                  'Power System.pdf',
  'autocad':                        'Auto CAD.pdf',
  'catia':                          'CATIA.pdf',
  'car design':                     'Car Design.pdf',
  'quality':                        'CNC.pdf',
  'bioinformatics':                 'Bioinformatics Algorithms.pdf',
  'microbiology':                   'Microbiology.pdf',
  'molecular biology':              'Molecular Biology.pdf',
  'genetic engineering':            'Genetic engineering.pdf',
  'pharmacovigilance':              'Pharmacovigilence.pdf',
  'nanotechnology':                 'Nanotechnology Program.pdf',
  'nano technology':                'Nanotechnology Program.pdf',
  'nano tech':                      'Nanotechnology Program.pdf',
  'food science':                   'Microbiology.pdf',
  'nutrition':                      'Microbiology.pdf',
  'sensory science':                'Microbiology.pdf',
  'medical coding':                 'Medical Coding.pdf',
  'construction planning':          'Construction Planning.pdf',
  'construction':                   'Construction Planning.pdf',
  'civil':                          'Construction Planning.pdf',
};

export function getBrochureFile(title: string): string | null {
  const lower = title.toLowerCase();
  const keys = Object.keys(BROCHURE_MAP).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (lower.includes(key)) return BROCHURE_MAP[key];
  }
  return null;
}

export function getBrochureHref(title: string): string | null {
  const file = getBrochureFile(title);
  return file ? `/brochures/${encodeURIComponent(file)}` : null;
}

const courseThumb = (file: string) => `/course-thumbnails/${file}.webp`;

export const THUMBNAIL_MAP: Record<string, string> = {
  // AI / ML
  'artificial intelligence':        courseThumb('artificial-intelligence'),
  'ai engineering':                 courseThumb('ai-engineering'),
  'generative ai':                  courseThumb('generative-ai'),
  'machine learning':               courseThumb('ml'),
  // Data
  'data science':                   courseThumb('data-science'),
  'data engineering':               courseThumb('data-engineering'),
  'data analytics':                 courseThumb('data-analytics'),
  'database management':            courseThumb('database-management'),
  'data structures':                courseThumb('data-structure-and-algorithms'),
  'data structure':                 courseThumb('data-structure-and-algorithms'),
  'business analytics':             courseThumb('business-analytics'),
  // Web / Dev
  'web development':                courseThumb('web-development'),
  'web 3.0':                        courseThumb('web-3-0'),
  'web 3':                          courseThumb('web-3-0'),
  'app development':                courseThumb('app-development'),
  'python full stack':              courseThumb('python-full-stack-final'),
  'python programming':             courseThumb('python-programming'),
  'java programming':               courseThumb('java-programming'),
  'java full stack':                courseThumb('java-full-stack'),
  'selenium testing':               courseThumb('selenium-testing-with-java'),
  // Cloud / DevOps
  'devops engineering':             courseThumb('devops-engineering'),
  'devops':                         courseThumb('devops-engineering'),
  'cloud computing':                courseThumb('cloud-computing'),
  'aws':                            courseThumb('aws-final'),
  // Security / Blockchain
  'cyber security':                 courseThumb('cyber-security'),
  'blockchain & bitcoin':           courseThumb('bitcoin-final'),
  'blockchain':                     courseThumb('bitcoin-final'),
  'bitcoin':                        courseThumb('bitcoin-final'),
  // Design
  'ar/vr development':              courseThumb('ar-vr-development'),
  'ar/vr':                          courseThumb('ar-vr-development'),
  'ar vr':                          courseThumb('ar-vr-development'),
  'ui/ux design':                   courseThumb('ui-ux-design'),
  'ui/ux':                          courseThumb('ui-ux-design'),
  'ui ux':                          courseThumb('ui-ux-design'),
  'graphic design':                 courseThumb('graphic-design'),
  'vfx':                            courseThumb('graphic-design-2'),
  // Management / Commerce
  'investment banking':             courseThumb('investment-banking'),
  'investment analysis':            courseThumb('investment-analysis'),
  'financial economics':            courseThumb('financial-economics'),
  'chartered accountancy':          courseThumb('ca-cfa'),
  'cfa':                            courseThumb('ca-cfa'),
  'acca f4':                        courseThumb('acca-f4-final'),
  'acca':                           courseThumb('acca-f4-final'),
  'marketing management':           courseThumb('marketing-management'),
  'digital marketing':              courseThumb('digital-marketing'),
  'social media marketing':         courseThumb('social-media-marketing'),
  'hrm':                            courseThumb('human-resource-management-final'),
  'human resource':                 courseThumb('human-resource-management-final'),
  'management consultancy':         courseThumb('management-consultancy'),
  'supply chain':                   courseThumb('supply-chain-management'),
  'sap fica':                       courseThumb('sap-fica'),
  'salesforce':                     courseThumb('salesforce'),
  'stock marketing':                courseThumb('stock-marketing'),
  'spoken english':                 courseThumb('spoken-english-and-communication'),
  'finance':                        courseThumb('finance'),
  // ECE
  'embedded systems':               courseThumb('embedded-systems'),
  'hybrid & electric vehicle':      courseThumb('hybrid-and-electric-vehicle-final'),
  'hybrid':                         courseThumb('hybrid-and-electric-vehicle-final'),
  'electric vehicle':               courseThumb('hybrid-and-electric-vehicle-final'),
  'vlsi':                           courseThumb('vlsi-final'),
  'iot & robotics':                 courseThumb('iot-and-robotics'),
  'iot':                            courseThumb('iot-and-robotics'),
  'robotics':                       courseThumb('iot-and-robotics'),
  'power systems':                  courseThumb('power-systems-final'),
  // Economics
  'business & financial economics': courseThumb('business-and-financial-economics'),
  'data analysis for economics':    courseThumb('data-analysis-for-economics'),
  // Mechanical
  'autocad':                        courseThumb('autocad-final'),
  'catia':                          courseThumb('catia'),
  'car design':                     courseThumb('car-design'),
  'quality':                        courseThumb('quality-and-safety-professionals'),
  // Bio & Life Sciences
  'bioinformatics':                 courseThumb('bioinformatics-final'),
  'microbiology':                   courseThumb('microbiology'),
  'molecular biology':              courseThumb('molecular-biology-final'),
  'genetic engineering':            courseThumb('genetic-engineering'),
  'pharmacovigilance':              courseThumb('pharmacovigilance'),
  'nanotechnology':                 courseThumb('nano-tech-final'),
  'nano technology':                courseThumb('nano-tech-final'),
  'nano tech':                      courseThumb('nano-tech-final'),
  'food science':                   courseThumb('food-science-and-technology'),
  'nutrition':                      courseThumb('nutrition-and-health-management'),
  'sensory science':                courseThumb('sensory-science'),
  'medical coding':                 courseThumb('medical-coding-final'),
  // Civil
  'construction planning':          courseThumb('construction-planning'),
  'construction':                   courseThumb('construction-planning'),
  'civil':                          courseThumb('construction-planning'),
};

/** Fallback thumbnail when no match is found */
export const FALLBACK_THUMBNAIL = courseThumb('artificial-intelligence');

/**
 * Given a course title, return the best-matching local thumbnail path.
 * Tries longest keyword match first for accuracy.
 */
export function getThumbnail(title: string): string {
  const lower = title.toLowerCase();
  // Sort keys by length descending so longer/more-specific keys match first
  const keys = Object.keys(THUMBNAIL_MAP).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (lower.includes(key)) return THUMBNAIL_MAP[key];
  }
  return FALLBACK_THUMBNAIL;
}

// ─── All Programs data (used by /programs page) ──────────────────────────────
export interface CourseProgram {
  title: string;
  slug: string;
  category: string;
  description: string;
  price: string;
  duration: string;
  thumbnail: string;
}

export const ALL_PROGRAMS: CourseProgram[] = [
  // ── CSE / IT DOMAINS ──────────────────────────────────────────────────────
  { title: 'Artificial Intelligence',       slug: 'artificial-intelligence',       category: 'CSE / IT DOMAINS',       description: 'Master AI fundamentals: Machine Learning, Deep Learning, Neural Networks & real-world applications.',                                    price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Artificial Intelligence') },
  { title: 'AI Engineering',               slug: 'ai-engineering',               category: 'CSE / IT DOMAINS',       description: 'Build production-grade AI systems, pipelines, and deploy intelligent models at scale.',                                              price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('AI Engineering') },
  { title: 'Generative AI',                slug: 'generative-ai',                category: 'CSE / IT DOMAINS',       description: 'Explore LLMs, prompt engineering, image generation, and build GenAI-powered applications.',                                          price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Generative AI') },
  { title: 'Machine Learning',             slug: 'machine-learning',             category: 'CSE / IT DOMAINS',       description: 'Master ML algorithms, model building, evaluation, and deployment with Python and Scikit-learn.',                                    price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Machine Learning') },
  { title: 'Data Science',                 slug: 'data-science',                 category: 'CSE / IT DOMAINS',       description: 'Master Data Science: Python, SQL, ML, Power BI, NLP, Gen AI & more with real-world projects.',                                      price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Data Science') },
  { title: 'Data Engineering',             slug: 'data-engineering',             category: 'CSE / IT DOMAINS',       description: 'Build scalable data pipelines, ETL workflows, and cloud-based data infrastructure.',                                               price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Data Engineering') },
  { title: 'Data Analytics',               slug: 'data-analytics',               category: 'CSE / IT DOMAINS',       description: 'Turn raw data into actionable insights using Excel, SQL, Python, and Power BI dashboards.',                                         price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Data Analytics') },
  { title: 'Database Management (DBMS)',   slug: 'database-management-dbms',     category: 'CSE / IT DOMAINS',       description: 'Learn relational databases, SQL, normalization, indexing, and database design principles.',                                         price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Database Management') },
  { title: 'Data Structures & Algorithms', slug: 'data-structures-algorithms',   category: 'CSE / IT DOMAINS',       description: 'Master DSA concepts, problem-solving patterns, and crack top tech company interviews.',                                            price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Data Structures') },
  { title: 'Web Development',              slug: 'web-development',              category: 'CSE / IT DOMAINS',       description: 'Build full-stack web apps with HTML, CSS, JavaScript, React, Node.js, and MongoDB.',                                              price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Web Development') },
  { title: 'Web 3.0',                      slug: 'web-30',                       category: 'CSE / IT DOMAINS',       description: 'Explore decentralized web, smart contracts, DApps, and blockchain-based web development.',                                         price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Web 3.0') },
  { title: 'App Development',              slug: 'app-development',              category: 'CSE / IT DOMAINS',       description: 'Build cross-platform mobile apps using React Native, Flutter, and modern mobile frameworks.',                                      price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('App Development') },
  { title: 'Python Full Stack',            slug: 'python-full-stack',            category: 'CSE / IT DOMAINS',       description: 'End-to-end Python development: Django/Flask backend, REST APIs, and React frontend.',                                              price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Python Full Stack') },
  { title: 'Python Programming Curriculum',slug: 'python-programming-curriculum',category: 'CSE / IT DOMAINS',       description: 'Comprehensive Python from basics to advanced: OOP, libraries, automation, and scripting.',                                          price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Python Programming') },
  { title: 'Java Programming',             slug: 'java-programming',             category: 'CSE / IT DOMAINS',       description: 'Core and advanced Java: OOP, collections, multithreading, and enterprise application patterns.',                                   price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Java Programming') },
  { title: 'Java Full Stack',              slug: 'java-full-stack',              category: 'CSE / IT DOMAINS',       description: 'Full-stack Java development with Spring Boot, Hibernate, REST APIs, and Angular/React.',                                           price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Java Full Stack') },
  { title: 'Selenium Testing with Java',   slug: 'selenium-testing-with-java',   category: 'CSE / IT DOMAINS',       description: 'Automate web testing with Selenium WebDriver, TestNG, Maven, and CI/CD integration.',                                             price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Selenium Testing') },
  { title: 'DevOps Engineering',           slug: 'devops-engineering',           category: 'CSE / IT DOMAINS',       description: 'Master CI/CD, Docker, Kubernetes, Jenkins, Terraform, and cloud-native DevOps practices.',                                        price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('DevOps') },
  { title: 'Cloud Computing',              slug: 'cloud-computing',              category: 'CSE / IT DOMAINS',       description: 'Learn cloud architecture, services, and deployment on AWS, Azure, and Google Cloud Platform.',                                     price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Cloud Computing') },
  { title: 'AWS',                          slug: 'aws',                          category: 'CSE / IT DOMAINS',       description: 'Master Amazon Web Services: EC2, S3, Lambda, RDS, and cloud solution architecture.',                                              price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('AWS') },
  { title: 'Cyber Security',               slug: 'cyber-security',               category: 'CSE / IT DOMAINS',       description: 'Learn ethical hacking, network security, penetration testing, and cybersecurity frameworks.',                                      price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Cyber Security') },
  { title: 'Blockchain & Bitcoin',         slug: 'blockchain-bitcoin',           category: 'CSE / IT DOMAINS',       description: 'Understand blockchain technology, cryptocurrency, smart contracts, and DeFi applications.',                                        price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Blockchain') },
  { title: 'AR/VR Development',            slug: 'ar-vr-development',            category: 'CSE / IT DOMAINS',       description: 'Build immersive augmented and virtual reality experiences using Unity and Unreal Engine.',                                         price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('AR/VR') },
  { title: 'UI/UX Design',                 slug: 'ui-ux-design',                 category: 'CSE / IT DOMAINS',       description: 'Design user-centered interfaces with Figma, wireframing, prototyping, and usability testing.',                                     price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('UI/UX') },
  { title: 'Graphic Design',               slug: 'graphic-design',               category: 'CSE / IT DOMAINS',       description: 'Master visual design, branding, typography, and digital media using Adobe Creative Suite.',                                        price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Graphic Design') },
  { title: 'VFX',                          slug: 'vfx',                          category: 'CSE / IT DOMAINS',       description: 'Create stunning visual effects for film and media using industry-standard VFX tools.',                                             price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('VFX') },
  // ── MANAGEMENT & COMMERCE ─────────────────────────────────────────────────
  { title: 'Finance',                                  slug: 'finance',                                  category: 'MANAGEMENT & COMMERCE', description: 'Master financial analysis, budgeting, valuation, and corporate finance fundamentals.',                                          price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Finance') },
  { title: 'Investment Banking',                       slug: 'investment-banking',                       category: 'MANAGEMENT & COMMERCE', description: 'Learn M&A, IPOs, financial modeling, and investment banking deal processes.',                                                  price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Investment Banking') },
  { title: 'Business Analytics',                      slug: 'business-analytics',                      category: 'MANAGEMENT & COMMERCE', description: 'Use data-driven insights to solve business problems with Excel, SQL, and Power BI.',                                           price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Business Analytics') },
  { title: 'Marketing Management',                    slug: 'marketing-management',                    category: 'MANAGEMENT & COMMERCE', description: 'Learn strategic marketing, consumer behavior, brand management, and market research.',                                         price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Marketing Management') },
  { title: 'Digital Marketing & Growth Strategy',     slug: 'digital-marketing-growth-strategy',       category: 'MANAGEMENT & COMMERCE', description: 'Master SEO, SEM, social media, email marketing, and growth hacking strategies.',                                              price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Digital Marketing') },
  { title: 'Social Media Marketing',                  slug: 'social-media-marketing',                  category: 'MANAGEMENT & COMMERCE', description: 'Build and manage brand presence across Instagram, LinkedIn, YouTube, and Meta Ads.',                                           price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Social Media Marketing') },
  { title: 'HRM',                                     slug: 'hrm',                                     category: 'MANAGEMENT & COMMERCE', description: 'Learn human resource management: recruitment, payroll, performance, and HR analytics.',                                        price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('HRM') },
  { title: 'Management Consultancy',                  slug: 'management-consultancy',                  category: 'MANAGEMENT & COMMERCE', description: 'Develop consulting frameworks, problem-solving skills, and business strategy expertise.',                                      price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Management Consultancy') },
  { title: 'Supply Chain Management',                 slug: 'supply-chain-management',                 category: 'MANAGEMENT & COMMERCE', description: 'Master logistics, procurement, inventory management, and supply chain optimization.',                                          price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Supply Chain') },
  { title: 'SAP FICA',                                slug: 'sap-fica',                                category: 'MANAGEMENT & COMMERCE', description: 'Learn SAP Financial Contract Accounting for utilities and telecommunications industries.',                                       price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('SAP FICA') },
  { title: 'Salesforce',                              slug: 'salesforce',                              category: 'MANAGEMENT & COMMERCE', description: 'Master Salesforce CRM, administration, development, and cloud platform certifications.',                                        price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Salesforce') },
  { title: 'Stock Marketing',                         slug: 'stock-marketing',                         category: 'MANAGEMENT & COMMERCE', description: 'Learn equity markets, technical analysis, trading strategies, and portfolio management.',                                      price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Stock Marketing') },
  { title: 'ACCA F4 (Business & Corporate Law)',      slug: 'acca-f4-business-corporate-law',          category: 'MANAGEMENT & COMMERCE', description: 'Prepare for ACCA F4 exam covering business law, corporate governance, and legal frameworks.',                                  price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('ACCA') },
  { title: 'Chartered Accountancy / CFA',             slug: 'chartered-accountancy-cfa',               category: 'MANAGEMENT & COMMERCE', description: 'Structured preparation for CA/CFA exams with financial accounting and analysis modules.',                                      price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Chartered Accountancy') },
  { title: 'Spoken English & Communication',          slug: 'spoken-english-communication',            category: 'MANAGEMENT & COMMERCE', description: 'Build professional communication, presentation, and business English skills for the workplace.',                                price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Spoken English') },
  // ── ECE DOMAINS ───────────────────────────────────────────────────────────
  { title: 'Embedded Systems',          slug: 'embedded-systems',          category: 'ECE DOMAINS', description: 'Learn microcontrollers, RTOS, firmware development, and embedded C programming.',                                                    price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Embedded Systems') },
  { title: 'Hybrid & Electric Vehicle', slug: 'hybrid-electric-vehicle',   category: 'ECE DOMAINS', description: 'Understand EV architecture, battery management systems, and hybrid powertrain technology.',                                         price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Hybrid') },
  { title: 'VLSI',                      slug: 'vlsi',                      category: 'ECE DOMAINS', description: 'Master VLSI design, Verilog/VHDL, FPGA programming, and chip design methodologies.',                                               price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('VLSI') },
  { title: 'IoT & Robotics',            slug: 'iot-robotics',              category: 'ECE DOMAINS', description: 'Build IoT systems, smart devices, and robotic applications with Arduino and Raspberry Pi.',                                         price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('IoT') },
  { title: 'Power Systems',             slug: 'power-systems',             category: 'ECE DOMAINS', description: 'Study power generation, transmission, distribution, and renewable energy systems.',                                                  price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Power Systems') },
  // ── ECONOMICS ─────────────────────────────────────────────────────────────
  { title: 'Business & Financial Economics', slug: 'business-financial-economics', category: 'ECONOMICS', description: 'Explore microeconomics, macroeconomics, financial markets, and economic policy analysis.',                                    price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Business & Financial Economics') },
  { title: 'Investment Analysis',            slug: 'investment-analysis',          category: 'ECONOMICS', description: 'Learn equity valuation, portfolio theory, risk analysis, and investment decision frameworks.',                                 price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Investment Analysis') },
  { title: 'Data Analysis for Economics',    slug: 'data-analysis-for-economics',  category: 'ECONOMICS', description: 'Apply statistical tools, econometrics, and data visualization to economic research.',                                         price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Data Analysis for Economics') },
  { title: 'Financial Economics',            slug: 'financial-economics',          category: 'ECONOMICS', description: 'Study asset pricing, derivatives, risk management, and financial market theory.',                                             price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Financial Economics') },
  // ── MECHANICAL ENGINEERING ────────────────────────────────────────────────
  { title: 'AutoCAD',                        slug: 'autocad',                       category: 'MECHANICAL ENGINEERING', description: 'Master 2D and 3D CAD drafting, mechanical drawings, and design documentation with AutoCAD.',                     price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('AutoCAD') },
  { title: 'CATIA',                          slug: 'catia',                         category: 'MECHANICAL ENGINEERING', description: 'Learn CATIA V5/V6 for 3D modeling, surface design, and product lifecycle management.',                           price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('CATIA') },
  { title: 'Car Design',                     slug: 'car-design',                    category: 'MECHANICAL ENGINEERING', description: 'Explore automotive design principles, styling, aerodynamics, and concept car development.',                      price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Car Design') },
  { title: 'Quality & Safety Professionals', slug: 'quality-safety-professionals',  category: 'MECHANICAL ENGINEERING', description: 'Learn quality management systems, ISO standards, safety protocols, and Six Sigma methodologies.',               price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Quality') },
  // ── BIO & LIFE SCIENCES ───────────────────────────────────────────────────
  { title: 'Bioinformatics',               slug: 'bioinformatics',               category: 'BIO & LIFE SCIENCES', description: 'Apply computational tools to analyze biological data, genomics, and protein structures.',                              price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Bioinformatics') },
  { title: 'Microbiology',                 slug: 'microbiology',                 category: 'BIO & LIFE SCIENCES', description: 'Study microorganisms, microbial genetics, immunology, and industrial microbiology applications.',                     price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Microbiology') },
  { title: 'Molecular Biology',            slug: 'molecular-biology',            category: 'BIO & LIFE SCIENCES', description: 'Explore DNA, RNA, gene expression, cloning techniques, and molecular diagnostics.',                                   price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Molecular Biology') },
  { title: 'Genetic Engineering',          slug: 'genetic-engineering',          category: 'BIO & LIFE SCIENCES', description: 'Learn CRISPR, recombinant DNA technology, gene therapy, and biotechnology applications.',                             price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Genetic Engineering') },
  { title: 'Pharmacovigilance',            slug: 'pharmacovigilance',            category: 'BIO & LIFE SCIENCES', description: 'Study drug safety monitoring, adverse event reporting, and regulatory pharmacovigilance systems.',                    price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Pharmacovigilance') },
  { title: 'Nano Technology',              slug: 'nano-technology',              category: 'BIO & LIFE SCIENCES', description: 'Explore nanomaterials, nanofabrication, and applications in medicine, electronics, and energy.',                     price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Nano Technology') },
  { title: 'Food Science & Technology',    slug: 'food-science-technology',      category: 'BIO & LIFE SCIENCES', description: 'Learn food processing, preservation, quality control, and food safety regulations.',                                  price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Food Science') },
  { title: 'Nutrition & Health Management',slug: 'nutrition-health-management',  category: 'BIO & LIFE SCIENCES', description: 'Study clinical nutrition, dietetics, health promotion, and therapeutic diet planning.',                               price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Nutrition') },
  { title: 'Sensory Science',              slug: 'sensory-science',              category: 'BIO & LIFE SCIENCES', description: 'Understand sensory evaluation methods, consumer testing, and product development applications.',                      price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Sensory Science') },
  { title: 'Medical Coding',               slug: 'medical-coding',               category: 'BIO & LIFE SCIENCES', description: 'Master ICD-10, CPT coding, medical billing, and healthcare documentation standards.',                                price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Medical Coding') },
  // ── CIVIL ENGINEERING ─────────────────────────────────────────────────────
  { title: 'Construction Planning',        slug: 'construction-planning',        category: 'CIVIL ENGINEERING',   description: 'Learn project planning, scheduling, cost estimation, and construction management techniques.',                         price: 'Rs. 3,000', duration: '2-3 Months', thumbnail: getThumbnail('Construction') },
];

export const COURSE_CATALOGUE = [
  {
    slug: 'plan-1',
    title: 'Adyapan Starter',
    subtitle: '30-day industry training with course and project certification',
    duration: '30 Days',
    category: 'Foundation',
    level: 'Beginner' as const,
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=600&q=80',
    modules: [
      {
        title: 'Month 1 - Industry Training',
        lessons: [
          { title: 'Welcome to Adyapan', duration: '5 min', isFree: true },
          { title: 'Course Overview & Roadmap', duration: '8 min', isFree: true },
          { title: 'Setting Up Your Environment', duration: '12 min', isFree: false },
          { title: 'Core Concepts Explained', duration: '18 min', isFree: false },
        ],
      },
      {
        title: 'Core Skills Practice',
        lessons: [
          { title: 'Skill Building Session 1', duration: '20 min', isFree: false },
          { title: 'Skill Building Session 2', duration: '22 min', isFree: false },
          { title: 'Hands-on Exercise', duration: '30 min', isFree: false },
          { title: 'Quiz & Assessment', duration: '15 min', isFree: false },
        ],
      },
      {
        title: 'Project Certificate Preparation',
        lessons: [
          { title: 'Real-world Project Intro', duration: '10 min', isFree: false },
          { title: 'Project Walkthrough', duration: '35 min', isFree: false },
          { title: 'Submission Guidelines', duration: '8 min', isFree: false },
        ],
      },
      {
        title: 'Course Completion Certification',
        lessons: [
          { title: 'Final Assessment', duration: '20 min', isFree: false },
          { title: 'Certificate Walkthrough', duration: '5 min', isFree: false },
          { title: 'Next Steps & Career Guidance', duration: '12 min', isFree: false },
        ],
      },
    ],
  },
  {
    slug: 'plan-2',
    title: 'Adyapan Standard',
    subtitle: '45-day industry training with live project allotment',
    duration: '45 Days',
    category: 'Professional',
    level: 'Intermediate' as const,
    thumbnail: 'AWS.png',
    modules: [
      {
        title: '45 Days - Industry Training',
        lessons: [
          { title: 'Program Introduction', duration: '6 min', isFree: true },
          { title: 'Industry Overview', duration: '14 min', isFree: true },
          { title: 'Tools & Technologies', duration: '20 min', isFree: false },
          { title: 'Best Practices', duration: '18 min', isFree: false },
          { title: 'Module Quiz', duration: '10 min', isFree: false },
        ],
      },
      {
        title: 'Live Project Allotment',
        lessons: [
          { title: 'Project 1: Setup & Planning', duration: '25 min', isFree: false },
          { title: 'Project 1: Development', duration: '45 min', isFree: false },
          { title: 'Project 1: Review & Feedback', duration: '20 min', isFree: false },
          { title: 'Project 2: Advanced Features', duration: '40 min', isFree: false },
        ],
      },
      {
        title: 'Industry Case Studies',
        lessons: [
          { title: 'Case Study 1', duration: '30 min', isFree: false },
          { title: 'Case Study 2', duration: '28 min', isFree: false },
          { title: 'Discussion & Analysis', duration: '20 min', isFree: false },
        ],
      },
      {
        title: 'Internship Completion Guidance',
        lessons: [
          { title: 'Mentor Session 1: Career Path', duration: '45 min', isFree: false },
          { title: 'Mentor Session 2: Technical Review', duration: '45 min', isFree: false },
          { title: 'Portfolio Building', duration: '30 min', isFree: false },
        ],
      },
      {
        title: 'Course, Internship & Performance Certification',
        lessons: [
          { title: 'Final Project Submission', duration: '60 min', isFree: false },
          { title: 'Peer Review', duration: '20 min', isFree: false },
          { title: 'Certificate & Next Steps', duration: '10 min', isFree: false },
        ],
      },
    ],
  },
  {
    slug: 'plan-3',
    title: 'Adyapan Professional',
    subtitle: '3-month program with projects, resume building and mock interviews',
    duration: '3 Months',
    category: 'Advanced',
    level: 'Advanced' as const,
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80',
    modules: [
      {
        title: 'Month 1 - Industry Training',
        lessons: [
          { title: 'Advanced Architecture Overview', duration: '20 min', isFree: true },
          { title: 'Design Patterns', duration: '35 min', isFree: false },
          { title: 'Performance Optimization', duration: '28 min', isFree: false },
          { title: 'Security Best Practices', duration: '22 min', isFree: false },
          { title: 'Module Assessment', duration: '15 min', isFree: false },
        ],
      },
      {
        title: 'Month 2 - Minor & Major Projects',
        lessons: [
          { title: 'Project Scoping & Planning', duration: '30 min', isFree: false },
          { title: 'Sprint 1: Core Features', duration: '60 min', isFree: false },
          { title: 'Sprint 2: Advanced Features', duration: '60 min', isFree: false },
          { title: 'Sprint 3: Testing & QA', duration: '45 min', isFree: false },
          { title: 'Sprint 4: Deployment', duration: '40 min', isFree: false },
        ],
      },
      {
        title: 'Industry Expert Sessions',
        lessons: [
          { title: 'Expert Talk: Industry Trends', duration: '50 min', isFree: false },
          { title: 'Expert Talk: Career Growth', duration: '45 min', isFree: false },
          { title: 'Live Q&A Session', duration: '60 min', isFree: false },
        ],
      },
      {
        title: 'Month 3 - Resume Building',
        lessons: [
          { title: 'Portfolio Strategy', duration: '20 min', isFree: false },
          { title: 'GitHub Profile Optimization', duration: '25 min', isFree: false },
          { title: 'LinkedIn Profile', duration: '20 min', isFree: false },
          { title: 'Resume Building', duration: '30 min', isFree: false },
        ],
      },
      {
        title: 'Mock Interviews',
        lessons: [
          { title: 'Mock Interview 1', duration: '45 min', isFree: false },
          { title: 'Mock Interview 2', duration: '45 min', isFree: false },
          { title: 'Aptitude & Coding Tests', duration: '60 min', isFree: false },
        ],
      },
      {
        title: 'Project, Internship & Course Certification',
        lessons: [
          { title: 'Final Capstone Project', duration: '90 min', isFree: false },
          { title: 'Evaluation & Feedback', duration: '30 min', isFree: false },
          { title: 'Certificate Ceremony', duration: '10 min', isFree: false },
        ],
      },
    ],
  },
  {
    slug: 'plan-4-premium',
    title: 'Adyapan Career Pro',
    subtitle: 'Premium career support with stipend, references and job support',
    duration: '4 Months',
    category: 'Career',
    level: 'Advanced' as const,
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    modules: [
      {
        title: 'Months 1-3 - Training + Minor & Major Industry Projects',
        lessons: [
          { title: 'Program Kickoff & Goal Setting', duration: '15 min', isFree: true },
          { title: 'Core Technology Deep Dive', duration: '45 min', isFree: false },
          { title: 'Advanced Patterns & Architecture', duration: '40 min', isFree: false },
          { title: 'System Design Fundamentals', duration: '50 min', isFree: false },
          { title: 'Module 1 Assessment', duration: '20 min', isFree: false },
        ],
      },
      {
        title: 'Industry Project Execution',
        lessons: [
          { title: 'Project 1: E-commerce Platform', duration: '90 min', isFree: false },
          { title: 'Project 2: Real-time Application', duration: '90 min', isFree: false },
          { title: 'Project 3: Data Pipeline', duration: '75 min', isFree: false },
          { title: 'Code Review & Optimization', duration: '45 min', isFree: false },
        ],
      },
      {
        title: 'Interview Training',
        lessons: [
          { title: 'Masterclass: Scaling Systems', duration: '60 min', isFree: false },
          { title: 'Masterclass: Cloud Architecture', duration: '60 min', isFree: false },
          { title: 'Masterclass: AI/ML Integration', duration: '60 min', isFree: false },
          { title: 'Live Workshop', duration: '90 min', isFree: false },
        ],
      },
      {
        title: 'Mock Interviews',
        lessons: [
          { title: 'Technical Interview Prep', duration: '45 min', isFree: false },
          { title: 'Mock Interview Round 1', duration: '60 min', isFree: false },
          { title: 'Mock Interview Round 2', duration: '60 min', isFree: false },
          { title: 'Group Discussion Practice', duration: '45 min', isFree: false },
          { title: 'HR Interview Prep', duration: '30 min', isFree: false },
        ],
      },
      {
        title: 'Month 4 (Offline) - Resume Building',
        lessons: [
          { title: 'ATS-Optimized Resume', duration: '35 min', isFree: false },
          { title: 'Portfolio Website', duration: '45 min', isFree: false },
          { title: 'LinkedIn Optimization', duration: '25 min', isFree: false },
          { title: 'GitHub Profile', duration: '20 min', isFree: false },
        ],
      },
      {
        title: 'Resume Referrals & Company References',
        lessons: [
          { title: 'Company Shortlisting', duration: '20 min', isFree: false },
          { title: 'Application Strategy', duration: '25 min', isFree: false },
          { title: 'Offer Negotiation', duration: '20 min', isFree: false },
        ],
      },
      {
        title: 'Experience Certificate & Job Support',
        lessons: [
          { title: 'Final Capstone Presentation', duration: '60 min', isFree: false },
          { title: 'Peer & Mentor Evaluation', duration: '30 min', isFree: false },
          { title: 'Certificate & Alumni Network', duration: '15 min', isFree: false },
        ],
      },
    ],
  },
];

/** Compute totalLessons from modules */
export function withTotalLessons(course: typeof COURSE_CATALOGUE[0]) {
  const total = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  return { ...course, totalLessons: total };
}
