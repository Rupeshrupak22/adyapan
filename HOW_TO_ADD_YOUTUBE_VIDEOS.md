# YouTube Videos Add Karne Ka Tarika

## Step-by-Step Guide

### Step 1: YouTube Channel Check Karo
1. Browser mein jao: `https://www.youtube.com/@adyapan21/videos`
2. Sare uploaded videos dekho
3. Har video ka URL copy karo

### Step 2: Video ID Nikalo

YouTube video URL se Video ID nikalne ke tarike:

#### Format 1: Watch URL
```
URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
Video ID: dQw4w9WgXcQ
```

#### Format 2: Short URL
```
URL: https://youtu.be/dQw4w9WgXcQ
Video ID: dQw4w9WgXcQ
```

#### Format 3: Share Link
```
URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ&feature=share
Video ID: dQw4w9WgXcQ (& ke pehle wala part)
```

### Step 3: courseData.ts File Edit Karo

File location: `d:\GANJA\src\lib\courseData.ts`

Find this section:
```typescript
export const YOUTUBE_VIDEO_MAP: Record<string, string> = {
  // AI / ML
  'artificial intelligence':        'https://www.youtube.com/@adyapan21',
  'ai engineering':                 'https://www.youtube.com/@adyapan21',
  // ... more courses
};
```

### Step 4: Video URLs Update Karo

**Example:**

Agar aapke paas ye videos hain:
- Web Development video ID: `ABC123XYZ`
- Data Science video ID: `DEF456UVW`
- Python Programming video ID: `GHI789RST`

Toh update karo:

```typescript
export const YOUTUBE_VIDEO_MAP: Record<string, string> = {
  // AI / ML
  'artificial intelligence':        'https://www.youtube.com/@adyapan21', // No video yet
  'ai engineering':                 'https://www.youtube.com/@adyapan21', // No video yet
  'generative ai':                  'https://www.youtube.com/@adyapan21', // No video yet
  'machine learning':               'https://www.youtube.com/@adyapan21', // No video yet
  
  // Data
  'data science':                   'https://www.youtube.com/watch?v=DEF456UVW', // ✅ Video added
  'data engineering':               'https://www.youtube.com/@adyapan21', // No video yet
  'data analytics':                 'https://www.youtube.com/@adyapan21', // No video yet
  
  // Web / Dev
  'web development':                'https://www.youtube.com/watch?v=ABC123XYZ', // ✅ Video added
  'web 3.0':                        'https://www.youtube.com/@adyapan21', // No video yet
  'app development':                'https://www.youtube.com/@adyapan21', // No video yet
  'python full stack':              'https://www.youtube.com/@adyapan21', // No video yet
  'python programming':             'https://www.youtube.com/watch?v=GHI789RST', // ✅ Video added
  
  // ... rest of the courses
};
```

## Quick Reference Template

Niche ek template hai jisme aap apne video IDs fill kar sakte hain:

```typescript
// ─── CSE / IT DOMAINS ───
'artificial intelligence':        'https://www.youtube.com/watch?v=_____', // Video ID yahan
'ai engineering':                 'https://www.youtube.com/watch?v=_____',
'generative ai':                  'https://www.youtube.com/watch?v=_____',
'machine learning':               'https://www.youtube.com/watch?v=_____',
'data science':                   'https://www.youtube.com/watch?v=_____',
'data engineering':               'https://www.youtube.com/watch?v=_____',
'data analytics':                 'https://www.youtube.com/watch?v=_____',
'database management':            'https://www.youtube.com/watch?v=_____',
'data structures':                'https://www.youtube.com/watch?v=_____',
'web development':                'https://www.youtube.com/watch?v=_____',
'web 3.0':                        'https://www.youtube.com/watch?v=_____',
'app development':                'https://www.youtube.com/watch?v=_____',
'python full stack':              'https://www.youtube.com/watch?v=_____',
'python programming':             'https://www.youtube.com/watch?v=_____',
'java programming':               'https://www.youtube.com/watch?v=_____',
'java full stack':                'https://www.youtube.com/watch?v=_____',
'selenium testing':               'https://www.youtube.com/watch?v=_____',
'devops':                         'https://www.youtube.com/watch?v=_____',
'cloud computing':                'https://www.youtube.com/watch?v=_____',
'aws':                            'https://www.youtube.com/watch?v=_____',
'cyber security':                 'https://www.youtube.com/watch?v=_____',
'blockchain':                     'https://www.youtube.com/watch?v=_____',
'bitcoin':                        'https://www.youtube.com/watch?v=_____',
'ar/vr':                          'https://www.youtube.com/watch?v=_____',
'ar vr':                          'https://www.youtube.com/watch?v=_____',
'ui/ux':                          'https://www.youtube.com/watch?v=_____',
'ui ux':                          'https://www.youtube.com/watch?v=_____',
'graphic design':                 'https://www.youtube.com/watch?v=_____',
'vfx':                            'https://www.youtube.com/watch?v=_____',

// ─── MANAGEMENT & COMMERCE ───
'finance':                        'https://www.youtube.com/watch?v=_____',
'investment banking':             'https://www.youtube.com/watch?v=_____',
'investment analysis':            'https://www.youtube.com/watch?v=_____',
'financial economics':            'https://www.youtube.com/watch?v=_____',
'chartered accountancy':          'https://www.youtube.com/watch?v=_____',
'acca':                           'https://www.youtube.com/watch?v=_____',
'marketing management':           'https://www.youtube.com/watch?v=_____',
'digital marketing':              'https://www.youtube.com/watch?v=_____',
'social media marketing':         'https://www.youtube.com/watch?v=_____',
'hrm':                            'https://www.youtube.com/watch?v=_____',
'human resource':                 'https://www.youtube.com/watch?v=_____',
'management consultancy':         'https://www.youtube.com/watch?v=_____',
'supply chain':                   'https://www.youtube.com/watch?v=_____',
'sap fica':                       'https://www.youtube.com/watch?v=_____',
'salesforce':                     'https://www.youtube.com/watch?v=_____',
'stock marketing':                'https://www.youtube.com/watch?v=_____',
'spoken english':                 'https://www.youtube.com/watch?v=_____',

// ─── ECE DOMAINS ───
'embedded systems':               'https://www.youtube.com/watch?v=_____',
'hybrid':                         'https://www.youtube.com/watch?v=_____',
'electric vehicle':               'https://www.youtube.com/watch?v=_____',
'vlsi':                           'https://www.youtube.com/watch?v=_____',
'iot':                            'https://www.youtube.com/watch?v=_____',
'robotics':                       'https://www.youtube.com/watch?v=_____',
'power systems':                  'https://www.youtube.com/watch?v=_____',

// ─── ECONOMICS ───
'business & financial economics': 'https://www.youtube.com/watch?v=_____',
'data analysis for economics':    'https://www.youtube.com/watch?v=_____',

// ─── MECHANICAL ENGINEERING ───
'autocad':                        'https://www.youtube.com/watch?v=_____',
'catia':                          'https://www.youtube.com/watch?v=_____',
'car design':                     'https://www.youtube.com/watch?v=_____',
'quality':                        'https://www.youtube.com/watch?v=_____',

// ─── BIO & LIFE SCIENCES ───
'bioinformatics':                 'https://www.youtube.com/watch?v=_____',
'microbiology':                   'https://www.youtube.com/watch?v=_____',
'molecular biology':              'https://www.youtube.com/watch?v=_____',
'genetic engineering':            'https://www.youtube.com/watch?v=_____',
'pharmacovigilance':              'https://www.youtube.com/watch?v=_____',
'nano technology':                'https://www.youtube.com/watch?v=_____',
'nano tech':                      'https://www.youtube.com/watch?v=_____',
'food science':                   'https://www.youtube.com/watch?v=_____',
'nutrition':                      'https://www.youtube.com/watch?v=_____',
'sensory science':                'https://www.youtube.com/watch?v=_____',
'medical coding':                 'https://www.youtube.com/watch?v=_____',

// ─── CIVIL ENGINEERING ───
'construction':                   'https://www.youtube.com/watch?v=_____',
'civil':                          'https://www.youtube.com/watch?v=_____',
```

## Testing After Update

### Step 1: Save File
`Ctrl + S` press karke file save karo

### Step 2: Restart Dev Server
```bash
# Terminal mein
Ctrl + C (server stop karo)
npm run dev (phir se start karo)
```

### Step 3: Test Video
1. Browser mein course page kholo
2. Play button click karo
3. Video play hona chahiye

## Important Notes

### ✅ Do's
- Video ID correctly copy karo
- URL format check karo
- Save karne ke baad test karo
- Ek ek karke videos add karo

### ❌ Don'ts
- Private videos mat use karo
- Unlisted videos avoid karo (unless intentional)
- Wrong video IDs mat dalo
- Embedding disabled videos mat use karo

## Video Requirements

### YouTube Video Settings
Video upload karte waqt ye settings check karo:

1. **Visibility**: Public (recommended) ya Unlisted
2. **Embedding**: Allowed (enabled hona chahiye)
3. **Age Restriction**: None (unless necessary)
4. **Comments**: Enabled (optional)

### Video Content Guidelines
- Course introduction clear ho
- 2-5 minutes ka video ideal hai
- Good audio quality
- Professional presentation
- Course highlights cover karo

## Troubleshooting

### Video Play Nahi Ho Raha?
**Check karo:**
1. Video ID correct hai?
2. Video public hai?
3. Embedding allowed hai?
4. Internet connection stable hai?

### Wrong Video Play Ho Raha?
**Check karo:**
1. Course name spelling correct hai?
2. Video ID sahi course ke liye hai?
3. File save kiya hai?
4. Server restart kiya hai?

## Example: Complete Update

Maan lo aapke paas 3 videos hain:

### Videos Available:
1. **Web Development** - Video ID: `ABC123`
2. **Data Science** - Video ID: `XYZ789`
3. **Python Programming** - Video ID: `PQR456`

### Update in courseData.ts:

```typescript
export const YOUTUBE_VIDEO_MAP: Record<string, string> = {
  // ... other courses with channel URL ...
  
  'web development': 'https://www.youtube.com/watch?v=ABC123',
  'data science': 'https://www.youtube.com/watch?v=XYZ789',
  'python programming': 'https://www.youtube.com/watch?v=PQR456',
  
  // ... rest courses with channel URL ...
};
```

### Result:
- Web Development course page → ABC123 video play hoga
- Data Science course page → XYZ789 video play hoga
- Python Programming course page → PQR456 video play hoga
- Baaki courses → Channel page open hoga

## Quick Commands

### Open courseData.ts in VS Code
```bash
code d:\GANJA\src\lib\courseData.ts
```

### Find YOUTUBE_VIDEO_MAP
Press `Ctrl + F` and search: `YOUTUBE_VIDEO_MAP`

### Save and Test
1. `Ctrl + S` - Save
2. `Ctrl + C` - Stop server
3. `npm run dev` - Start server
4. Test in browser

## Need Help?

Agar koi problem aaye toh:
1. Check console for errors
2. Verify video ID is correct
3. Test video URL in browser first
4. Check file is saved properly

---

**Pro Tip:** Ek spreadsheet bana lo jisme course names aur video IDs track kar sako. Isse manage karna easy hoga!
