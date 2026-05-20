# YouTube Videos Update करने का आसान तरीका

## 🎯 Quick Steps

### 1️⃣ YouTube Channel खोलो
```
https://www.youtube.com/@adyapan21/videos
```

### 2️⃣ Video URL Copy करो
हर video पर right-click → "Copy video URL"

### 3️⃣ Video ID निकालो
```
URL: https://www.youtube.com/watch?v=ABC123XYZ
Video ID: ABC123XYZ (= के बाद वाला part)
```

### 4️⃣ File Edit करो
File: `d:\GANJA\src\lib\courseData.ts`

Line 7 से शुरू होता है `YOUTUBE_VIDEO_MAP`

### 5️⃣ Video URL Update करो

**पहले (Default):**
```typescript
'web development': 'https://www.youtube.com/@adyapan21',
```

**बाद में (With Video):**
```typescript
'web development': 'https://www.youtube.com/watch?v=ABC123XYZ',
```

### 6️⃣ Save और Test करो
1. `Ctrl + S` - File save करो
2. Terminal में `npm run dev` चलाओ
3. Course page खोलो और test करो

## 📋 Course List (Videos Add करने के लिए)

### CSE / IT DOMAINS (26 courses)
```
☐ Artificial Intelligence
☐ AI Engineering
☐ Generative AI
☐ Machine Learning
☐ Data Science
☐ Data Engineering
☐ Data Analytics
☐ Database Management
☐ Data Structures & Algorithms
☐ Web Development
☐ Web 3.0
☐ App Development
☐ Python Full Stack
☐ Python Programming
☐ Java Programming
☐ Java Full Stack
☐ Selenium Testing
☐ DevOps Engineering
☐ Cloud Computing
☐ AWS
☐ Cyber Security
☐ Blockchain & Bitcoin
☐ AR/VR Development
☐ UI/UX Design
☐ Graphic Design
☐ VFX
```

### MANAGEMENT & COMMERCE (15 courses)
```
☐ Finance
☐ Investment Banking
☐ Business Analytics
☐ Marketing Management
☐ Digital Marketing
☐ Social Media Marketing
☐ HRM
☐ Management Consultancy
☐ Supply Chain Management
☐ SAP FICA
☐ Salesforce
☐ Stock Marketing
☐ ACCA F4
☐ Chartered Accountancy / CFA
☐ Spoken English
```

### ECE DOMAINS (5 courses)
```
☐ Embedded Systems
☐ Hybrid & Electric Vehicle
☐ VLSI
☐ IoT & Robotics
☐ Power Systems
```

### ECONOMICS (4 courses)
```
☐ Business & Financial Economics
☐ Investment Analysis
☐ Data Analysis for Economics
☐ Financial Economics
```

### MECHANICAL ENGINEERING (4 courses)
```
☐ AutoCAD
☐ CATIA
☐ Car Design
☐ Quality & Safety
```

### BIO & LIFE SCIENCES (10 courses)
```
☐ Bioinformatics
☐ Microbiology
☐ Molecular Biology
☐ Genetic Engineering
☐ Pharmacovigilance
☐ Nano Technology
☐ Food Science
☐ Nutrition
☐ Sensory Science
☐ Medical Coding
```

### CIVIL ENGINEERING (1 course)
```
☐ Construction Planning
```

## 🎬 Video ID Examples

### Example 1: Watch URL
```
Full URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
Video ID: dQw4w9WgXcQ
```

### Example 2: Short URL
```
Full URL: https://youtu.be/dQw4w9WgXcQ
Video ID: dQw4w9WgXcQ
```

### Example 3: Mobile Share
```
Full URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ&feature=share
Video ID: dQw4w9WgXcQ
```

## 📝 Update Format

### Single Course Update
```typescript
// Find this line in courseData.ts
'course name': 'https://www.youtube.com/@adyapan21',

// Replace with
'course name': 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
```

### Multiple Courses Update
```typescript
// Before
'web development': 'https://www.youtube.com/@adyapan21',
'data science': 'https://www.youtube.com/@adyapan21',
'python programming': 'https://www.youtube.com/@adyapan21',

// After
'web development': 'https://www.youtube.com/watch?v=ABC123',
'data science': 'https://www.youtube.com/watch?v=XYZ789',
'python programming': 'https://www.youtube.com/watch?v=PQR456',
```

## ✅ Checklist

### Before Adding Video
- [ ] Video YouTube पर upload है
- [ ] Video public या unlisted है
- [ ] Embedding allowed है
- [ ] Video ID copy किया है

### After Adding Video
- [ ] courseData.ts में URL update किया
- [ ] File save किया (`Ctrl + S`)
- [ ] Dev server restart किया
- [ ] Browser में test किया
- [ ] Video properly play हो रहा है

## 🔍 Testing Steps

### Test Single Video
```bash
1. npm run dev
2. Browser में course page खोलो
3. Play button click करो
4. Video play होना चाहिए
```

### Test Multiple Videos
```bash
1. npm run dev
2. Different course pages खोलो
3. हर page पर play button test करो
4. Correct videos play हो रहे हैं check करो
```

## 🐛 Common Issues

### Issue 1: Video Play नहीं हो रहा
**Solution:**
- Video ID check करो
- Video public है check करो
- Embedding allowed है check करो

### Issue 2: Wrong Video Play हो रहा
**Solution:**
- Course name spelling check करो
- Video ID correct course के लिए है check करो
- File save किया है check करो

### Issue 3: Changes Reflect नहीं हो रहे
**Solution:**
- File save करो (`Ctrl + S`)
- Server restart करो
- Browser cache clear करो (`Ctrl + Shift + R`)

## 💡 Pro Tips

### Tip 1: Batch Update
एक साथ multiple videos के URLs update करो, फिर एक बार में test करो

### Tip 2: Keep Track
एक Excel/Google Sheet बनाओ:
```
Course Name | Video ID | Status | Date Added
Web Dev     | ABC123   | ✅     | 2024-01-15
Data Sci    | XYZ789   | ✅     | 2024-01-15
```

### Tip 3: Test First
नया video add करने से पहले browser में URL test करो

### Tip 4: Backup
Update करने से पहले courseData.ts का backup लो

## 📞 Need Help?

### Quick Commands
```bash
# File खोलो
code d:\GANJA\src\lib\courseData.ts

# Server start करो
npm run dev

# Server stop करो
Ctrl + C
```

### File Location
```
d:\GANJA\src\lib\courseData.ts
Line 7: YOUTUBE_VIDEO_MAP starts
```

### Search in File
```
Ctrl + F → Search: "YOUTUBE_VIDEO_MAP"
```

## 🎉 Example: Complete Update

### Scenario
आपके पास 3 videos हैं:
1. Web Development - ID: `webdev123`
2. Data Science - ID: `datasci456`
3. Python - ID: `python789`

### Step-by-Step

#### Step 1: Open File
```bash
code d:\GANJA\src\lib\courseData.ts
```

#### Step 2: Find Section
Press `Ctrl + F` → Search: `web development`

#### Step 3: Update URLs
```typescript
// Change from:
'web development': 'https://www.youtube.com/@adyapan21',
'data science': 'https://www.youtube.com/@adyapan21',
'python programming': 'https://www.youtube.com/@adyapan21',

// To:
'web development': 'https://www.youtube.com/watch?v=webdev123',
'data science': 'https://www.youtube.com/watch?v=datasci456',
'python programming': 'https://www.youtube.com/watch?v=python789',
```

#### Step 4: Save
Press `Ctrl + S`

#### Step 5: Test
```bash
npm run dev
# Browser में test करो
```

## 📊 Progress Tracker

### Videos Added: 0 / 67

Track करो कितने videos add हो गए:

```
CSE / IT: 0/26
Management: 0/15
ECE: 0/5
Economics: 0/4
Mechanical: 0/4
Bio Sciences: 0/10
Civil: 0/1
```

---

**Remember:** जो videos available नहीं हैं, उनको channel URL पर ही छोड़ दो। बाद में add कर सकते हो! 🚀
