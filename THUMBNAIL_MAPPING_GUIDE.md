# Course Thumbnail Mapping Guide

## Complete Mapping of Courses to Thumbnails

### CSE / IT DOMAINS
| Course Name | Thumbnail File |
|------------|----------------|
| Artificial Intelligence | `/course-thumbnails/AI .png` |
| AI Engineering | `/course-thumbnails/AI .png` |
| Generative AI | `/course-thumbnails/AI .png` |
| Machine Learning | `/course-thumbnails/ML .png` |
| Data Science | `/course-thumbnails/CS.png` |
| Data Engineering | `/course-thumbnails/CS.png` |
| Data Analytics | `/course-thumbnails/CS.png` |
| Database Management (DBMS) | `/course-thumbnails/CS.png` |
| Data Structures & Algorithms | `/course-thumbnails/CS.png` |
| Web Development | `/course-thumbnails/Web Development.png` |
| Web 3.0 | `/course-thumbnails/Web Development.png` |
| App Development | `/course-thumbnails/Web Development.png` |
| Python Full Stack | `/course-thumbnails/Python Full stack.png` |
| Python Programming Curriculum | `/course-thumbnails/Python Full stack.png` |
| Java Programming | `/course-thumbnails/Java Full Stack .png` |
| Java Full Stack | `/course-thumbnails/Java Full Stack .png` |
| Selenium Testing with Java | `/course-thumbnails/Java Full Stack .png` |
| DevOps Engineering | `/course-thumbnails/AWS .png` |
| Cloud Computing | `/course-thumbnails/AWS .png` |
| AWS | `/course-thumbnails/AWS .png` |
| Cyber Security | `/course-thumbnails/CS.png` |
| Blockchain & Bitcoin | `/course-thumbnails/Bitcoin .png` |
| AR/VR Development | `/course-thumbnails/AR_VR .png` |
| UI/UX Design | `/course-thumbnails/UI_UX.png` |
| Graphic Design | `/course-thumbnails/UI_UX.png` |
| VFX | `/course-thumbnails/UI_UX.png` |

### MANAGEMENT & COMMERCE
| Course Name | Thumbnail File |
|------------|----------------|
| Finance | `/course-thumbnails/Finance .png` |
| Investment Banking | `/course-thumbnails/Finance .png` |
| Business Analytics | `/course-thumbnails/Business Analytics .png` |
| Marketing Management | `/course-thumbnails/Business Analytics .png` |
| Digital Marketing & Growth Strategy | `/course-thumbnails/Business Analytics .png` |
| Social Media Marketing | `/course-thumbnails/Business Analytics .png` |
| HRM | `/course-thumbnails/Human Resource Management .png` |
| Management Consultancy | `/course-thumbnails/Business Analytics .png` |
| Supply Chain Management | `/course-thumbnails/Business Analytics .png` |
| SAP FICA | `/course-thumbnails/Business Analytics .png` |
| Salesforce | `/course-thumbnails/Business Analytics .png` |
| Stock Marketing | `/course-thumbnails/Finance .png` |
| ACCA F4 (Business & Corporate Law) | `/course-thumbnails/ACCA F4 .png` |
| Chartered Accountancy / CFA | `/course-thumbnails/Finance .png` |
| Spoken English & Communication | `/course-thumbnails/Business Analytics .png` |

### ECE DOMAINS
| Course Name | Thumbnail File |
|------------|----------------|
| Embedded Systems | `/course-thumbnails/CS.png` |
| Hybrid & Electric Vehicle | `/course-thumbnails/Hybrid & Electric Vehicle .png` |
| VLSI | `/course-thumbnails/VLSI Final.png` |
| IoT & Robotics | `/course-thumbnails/CS.png` |
| Power Systems | `/course-thumbnails/Power Systems .png` |

### ECONOMICS
| Course Name | Thumbnail File |
|------------|----------------|
| Business & Financial Economics | `/course-thumbnails/Finance .png` |
| Investment Analysis | `/course-thumbnails/Finance .png` |
| Data Analysis for Economics | `/course-thumbnails/Business Analytics .png` |
| Financial Economics | `/course-thumbnails/Finance .png` |

### MECHANICAL ENGINEERING
| Course Name | Thumbnail File |
|------------|----------------|
| AutoCAD | `/course-thumbnails/AutoCAD .png` |
| CATIA | `/course-thumbnails/AutoCAD .png` |
| Car Design | `/course-thumbnails/AutoCAD .png` |
| Quality & Safety Professionals | `/course-thumbnails/AutoCAD .png` |

### BIO & LIFE SCIENCES
| Course Name | Thumbnail File |
|------------|----------------|
| Bioinformatics | `/course-thumbnails/Bioinformatics.png` |
| Microbiology | `/course-thumbnails/Microbiology .png` |
| Molecular Biology | `/course-thumbnails/Molecular Biology .png` |
| Genetic Engineering | `/course-thumbnails/Molecular Biology .png` |
| Pharmacovigilance | `/course-thumbnails/Microbiology .png` |
| Nano Technology | `/course-thumbnails/Nano Tech .png` |
| Food Science & Technology | `/course-thumbnails/Microbiology .png` |
| Nutrition & Health Management | `/course-thumbnails/Microbiology .png` |
| Sensory Science | `/course-thumbnails/Microbiology .png` |
| Medical Coding | `/course-thumbnails/Medical coding.png` |

### CIVIL ENGINEERING
| Course Name | Thumbnail File |
|------------|----------------|
| Construction Planning | `/course-thumbnails/AutoCAD .png` |

## How to Add New Thumbnails

1. **Add the image file** to `public/course-thumbnails/`
2. **Update the mapping** in `src/lib/courseData.ts` in the `THUMBNAIL_MAP` object
3. **Use keywords** that match your course names (case-insensitive)

Example:
```typescript
'new course name': '/course-thumbnails/NewCourseThumbnail.png',
```

## Image Requirements
- **Format**: PNG (recommended) or JPG
- **Size**: Recommended 400x300px or similar aspect ratio
- **File naming**: Use descriptive names with spaces (e.g., "AI .png", "Web Development.png")
- **Location**: Must be in `public/course-thumbnails/` folder

## Fallback Behavior
If no matching thumbnail is found, the system will use:
- **Fallback image**: `/course-thumbnails/CS.png`
- This ensures all courses always have an image displayed
