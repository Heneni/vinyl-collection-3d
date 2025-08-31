# Mark's Vinyl Collection - 3D Record Bin Browser

A transformed 3D vinyl record browsing experience built with Three.js, specifically designed for Mark's music collection. This creates an authentic vinyl record bin experience where you can browse through your collection in a realistic 3D environment.

## ✨ New Features (Vinyl LP Transformation)

### 🎵 Vinyl-Specific Enhancements
- **Proper LP Size**: Records are now 12" vinyl LPs (6" radius) instead of CDs
- **Authentic Layout**: Records stand upright in a record bin arrangement, not floating
- **Realistic Proportions**: Proper vinyl thickness and center hole sizing
- **Record Bin Environment**: Wooden crate with slats creates authentic record store feel
- **Warmer Lighting**: Record store ambiance with warm, focused lighting

### 🎨 Visual Improvements
- **Album Artwork**: High-quality album cover textures from your collection
- **Vinyl Shine**: Proper material shading with specular highlights
- **Natural Positioning**: Records lean naturally like in a real bin
- **Current Record Highlight**: Active record is elevated and scaled

### 🔄 Auto-Loading
- **Seamless Experience**: Automatically loads your music collection on startup
- **No Manual Steps**: No need to select CSV file - your collection loads immediately
- **Fallback Support**: If auto-load fails, provides file picker as backup

## 🎮 Navigation Controls

- **Arrow Keys / A,D**: Navigate left/right through records
- **Mouse Wheel**: Scroll to browse collection
- **Space/Enter**: Focus on current record
- **UI Buttons**: Click Previous/Next/Show buttons

## 📊 Your Collection Data

The system automatically loads from `MUSIC COLLECTION PERSONA-Grid view.csv` with:
- **Album Artwork**: High-res images from your collection
- **Artist Information**: Tame Impala, Radiohead, Glass Animals, Bon Iver, etc.
- **Rich Metadata**: Genre, year, label information
- **Psychedelic Focus**: Heavy emphasis on psychedelic and indie rock

## 🚀 Usage

1. **Simple Start**: Just open `index.html` - your collection loads automatically
2. **Browse**: Use arrow keys, mouse wheel, or buttons to navigate
3. **Explore**: Each record shows detailed information and artwork
4. **Enjoy**: Experience your collection in an immersive 3D environment

## 🎨 Collection Highlights

Your collection features amazing artwork and artists including:
- Psychedelic and abstract album covers
- Vibrant, colorful artistic designs
- Contemporary and trippy aesthetics
- Artists like Tame Impala, Radiohead, Glass Animals

## 🖥️ Technical Details

### Vinyl Record Specifications
- **Diameter**: 12 inches (6" radius in 3D space)
- **Thickness**: 0.1 units (realistic vinyl thickness)
- **Material**: PhongMaterial with specular highlights
- **Center Hole**: Proper LP-sized center hole

### Environment Features
- Wooden record crate with realistic slats
- Warm ambient and focused lighting
- Ground plane and shadow support
- Authentic record store atmosphere

## 🔧 Local Development

To run locally:
```bash
cd "/Users/markshapiro2/OTM V2/cratedigger-3d"
python3 -m http.server 8000
```
Then open `http://localhost:8000`

## CSV Format

Your collection data includes:
- `imageUrl`: High-resolution album artwork
- `title`: Album/track titles
- `artist`: Artist names
- `genre`: Music genres (psychedelic, indie, etc.)
- `year`: Release years
- `label`: Record labels

## Browser Compatibility

- **Chrome/Edge**: Full support with hardware acceleration
- **Firefox**: Full support  
- **Safari**: Full support
- **Mobile**: Optimized for touch controls

## File Structure

```
cratedigger-3d/
├── index.html                           # Main HTML application
├── js/
│   └── cratedigger.js                   # 3D vinyl record browser engine
├── MUSIC COLLECTION PERSONA-Grid view.csv  # Mark's collection data
├── sample-records.csv                   # Sample data (legacy)
└── README.md                           # This documentation
```

## Performance Optimizations

- **Texture Streaming**: Images load progressively
- **LOD System**: Distant records use lower detail
- **Shadow Optimization**: Dynamic shadow mapping
- **Memory Management**: Efficient texture disposal

## Artistic Features

### Psychedelic Collection Focus
Your collection emphasizes:
- Abstract and surreal artwork
- Vibrant color palettes
- Trippy visual aesthetics
- Contemporary and festival vibes

### Visual Themes
- Cool tones (blues, greens, purples)
- Warm tones (reds, golds, browns)
- Neon and graffiti influences
- Nature and desert themes

---

*Transformed from CD-based cratedigger to authentic vinyl LP experience for Mark's psychedelic music collection*

## Credits

- **Original Concept**: Inspired by risq's cratedigger.js
- **3D Engine**: Three.js WebGL library
- **Transformation**: Customized for vinyl LP record bin experience
- **Collection**: Mark's curated psychedelic and indie music collection
- **Design**: Focused on authentic record store browsing experience