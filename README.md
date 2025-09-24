# Fish Catch Block

A simple WordPress block created with wp-scripts, extracted from the team51-plugin-scaffold.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Development mode (with hot reload):**
   ```bash
   npm start
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## File Structure

```
fish-catch-block/
├── src/
│   └── fish-catch/
│       ├── block.json      # Block configuration
│       ├── index.js        # Block registration
│       ├── edit.js         # Editor component
│       ├── save.js         # Frontend component
│       ├── editor.scss     # Editor styles
│       └── style.scss      # Frontend styles
├── build/                  # Generated files (after build)
├── package.json            # Dependencies and scripts
└── fish-catch-block.php    # Plugin main file
```

## Key Features

- **Minimal setup**: Only essential wp-scripts dependencies
- **SCSS support**: Automatic compilation of SCSS files
- **Hot reload**: Development mode with automatic rebuilding
- **Block registration**: Automatic block registration via block.json

## Scripts

- `npm start` - Development mode with hot reload
- `npm run build` - Production build
- `npm run lint:js` - Lint JavaScript files
- `npm run lint:css` - Lint CSS/SCSS files
- `npm run format` - Format code

## Development

1. Run `npm start` to begin development
2. Edit files in `src/fish-catch/`
3. Changes will be automatically compiled to `build/fish-catch/`
4. The block will be available in the WordPress block editor

## Building for Production

Run `npm run build` to create optimized files in the `build/` directory.
