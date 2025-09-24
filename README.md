# Fish Catch Block

A comprehensive WordPress plugin for anglers to document and display fishing catches with interactive maps, photo galleries, and detailed catch information.

![WordPress](https://img.shields.io/badge/WordPress-6.0+-blue.svg)
![PHP](https://img.shields.io/badge/PHP-7.4+-blue.svg)
![License](https://img.shields.io/badge/License-GPL%20v2+-green.svg)

## Overview

Fish Catch Block provides two powerful Gutenberg blocks that transform WordPress into a comprehensive fishing journal platform. Built with modern WordPress block development practices, it offers a seamless experience for anglers to document their fishing adventures.

## ✨ Features

### 🎣 Fish Catch Block
- **Detailed Catch Records**: Species, size, weight, comments, and timestamps
- **Photo/Video Galleries**: Multiple media uploads with built-in lightbox viewer
- **Interactive Location Mapping**: Set fishing locations with map picker
- **Map Service Integration**: Links to Google Maps, Apple Maps, Waze, Bing, and OpenStreetMap
- **Flexible Display Options**: List and grid view modes with customizable styling
- **Responsive Design**: Optimized for all device sizes

### 🗺️ Fish Catch Map Block
- **Aggregate View**: Display all catches on a single interactive map
- **Custom Fish Markers**: Animated markers with catch count overlays
- **Reveal Panels**: Rich location details with images and catch information
- **Filtering Options**: Minimum catch count and other display preferences
- **Auto-fit Bounds**: Automatically zoom to show all fishing locations

### 🎨 Customization
- **23 Map Themes**: From OpenStreetMap to satellite imagery and artistic styles
- **API Key Support**: Premium themes via Thunderforest and Jawg Maps
- **Styling Controls**: Colors, borders, spacing, and image sizes
- **Block-level Settings**: Per-block customization options

## 🚀 Installation

### For Users
1. Download the latest release from [GitHub](https://github.com/gin0115/fish-catch-block/releases)
2. Upload to WordPress via Plugins > Add New > Upload Plugin
3. Activate the plugin
4. Start using the blocks in the block editor!

### For Developers
```bash
# Clone the repository
git clone https://github.com/gin0115/fish-catch-block.git
cd fish-catch-block

# Install dependencies
npm install

# Build for development
npm run build

# Start development with watch mode
npm run start
```

## 🛠️ Development

### Prerequisites
- **Node.js**: v16+ recommended
- **npm**: v8+ 
- **WordPress**: 6.0+
- **PHP**: 7.4+

### Tech Stack
- **WordPress Block Editor**: Gutenberg blocks with JSX/React
- **Build Tools**: @wordpress/scripts (webpack, babel, eslint)
- **Mapping**: Leaflet.js with leaflet-providers
- **Styling**: SCSS with PostCSS
- **Assets**: WordPress asset generation and enqueueing

### Project Structure
```
fish-catch-block/
├── src/
│   ├── fish-catch/              # Main catch documentation block
│   │   ├── block.json          # Block configuration
│   │   ├── edit.js             # Editor component
│   │   ├── save.js             # Frontend output
│   │   ├── index.js            # Block registration
│   │   ├── style.scss          # Block styles
│   │   └── editor.scss         # Editor-only styles
│   └── fish-catch-map/          # Map overview block
│       ├── block.json
│       ├── edit.js
│       ├── save.js
│       ├── frontend.js         # Frontend interactivity
│       ├── index.js
│       ├── style.scss
│       └── editor.scss
├── assets/
│   ├── frontend.js             # Shared frontend JavaScript
│   └── frontend.css            # Frontend styles
├── build/                      # Compiled blocks (auto-generated)
├── .github/
│   └── workflows/
│       └── build-release.yml   # Automated releases
├── fish-catch-block.php        # Main plugin file
├── readme.txt                 # WordPress.org plugin directory
└── README.md                  # Developer documentation
```

### Development Workflow

```bash
# Start development server with hot reload
npm run start

# Build for production
npm run build

# Lint JavaScript
npm run lint:js

# Format code
npm run format

# Package for release
npm run packages-update  # Update dependencies
npm run build            # Build production assets
```

### API Keys Configuration

For premium map themes, users can configure API keys in **WordPress Admin > Settings > General**:

**Thunderforest** (Landscape, Transport, etc.)
- Free tier: 7,500 requests/month
- Register: https://www.thunderforest.com/maps/api/

**Jawg Maps** (Streets, Dark, Matrix, etc.) 
- Free tier: 8,000 requests/month
- Register: https://www.jawg.io/

### Block Development Notes

#### State Management
- Uses WordPress `@wordpress/data` for editor state
- Post meta integration for coordinates and catch counts
- Local state for UI interactions and form data

#### REST API Integration
- Custom meta fields: `fish_catch_coordinates`, `fish_catch_total_count`
- Enhanced REST endpoints with query parameters
- Proper schema validation for API responses

#### Frontend Interactivity
- Vanilla JavaScript for maximum compatibility
- Dynamic map loading with theme support
- Lightbox galleries and view toggles
- Progressive enhancement approach

## 🧪 Testing

### Manual Testing Checklist
- [ ] Block insertion and configuration
- [ ] Map location picker functionality  
- [ ] Photo upload and gallery display
- [ ] Frontend map rendering with different themes
- [ ] Mobile responsiveness
- [ ] API key integration
- [ ] Block validation and recovery

### Browser Support
- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 📦 Build & Release

### Automated Releases
GitHub Actions automatically:
1. Builds production assets
2. Excludes development files (`src/`, `node_modules/`, etc.)
3. Creates plugin zip file
4. Publishes GitHub release
5. Includes `readme.txt` for WordPress.org compatibility

### Manual Release
```bash
# Build production assets
npm run build

# Create release package (matches GitHub Actions workflow)
zip -r fish-catch-block.zip . \
  -x ".git/*" ".github/*" "node_modules/*" "src/*" "build/*" \
     ".gitignore" ".editorconfig" "package.json" "package-lock.json" "README.md"
```

The latest releases are available at: https://github.com/gin0115/fish-catch-block/releases

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly (manual testing checklist above)
5. Ensure build passes: `npm run build`
6. Commit changes: `git commit -m 'Add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Coding Standards
- Follow WordPress coding standards
- Use ESLint configuration provided
- Write semantic, accessible HTML
- Include JSDoc comments for functions
- Test across different WordPress themes

### Issue Reporting
Please include:
- WordPress version
- PHP version  
- Theme being used
- Browser and version
- Steps to reproduce
- Expected vs actual behavior

## 📄 License

This project is licensed under the GPL v2 or later - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **WordPress Block Editor Team** - For the excellent Gutenberg framework
- **Leaflet.js** - For the mapping functionality
- **Leaflet-providers** - For the extensive map theme collection
- **WordPress Community** - For development tools and best practices

## 📞 Support

- **Documentation**: See `readme.txt` for user documentation
- **Issues**: [GitHub Issues](https://github.com/gin0115/fish-catch-block/issues) for bug reports and feature requests
- **Development**: WordPress Slack #core-editor for block development questions
- **Author**: [Glynn Quelch](https://github.com/gin0115) - glynn@pinkcrab.co.uk

---

**Happy Fishing! 🎣**