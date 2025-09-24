=== Fish Catch Block ===
Contributors: gin0115
Donate link: https://github.com/gin0115/fish-catch-block
Tags: fishing, catch, blocks, gutenberg, maps, location
Requires at least: 6.0
Tested up to: 6.4
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPL v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

A comprehensive WordPress block for anglers to document and display their fishing catches with locations, photos, and interactive maps.

== Description ==

Fish Catch Block is a powerful WordPress plugin that allows fishing enthusiasts to create detailed records of their fishing trips and catches directly within the WordPress block editor.

**Key Features:**

* **Interactive Maps**: Display catch locations with customizable map styles (23 different themes available)
* **Detailed Catch Records**: Document species, size, weight, photos, and comments for each catch
* **Location Integration**: Automatic integration with Google Maps, Apple Maps, Waze, Bing Maps, and OpenStreetMap
* **Photo Galleries**: Upload multiple photos/videos with built-in lightbox viewer
* **Flexible Display**: Switch between list and grid views for catch displays
* **Map Block**: Display all your catches on a single interactive map with custom fish markers
* **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
* **Customizable Styling**: Adjust colors, borders, spacing, and image sizes

**Perfect for:**
* Fishing bloggers and content creators
* Angling clubs and communities
* Fishing guides and charter services
* Personal fishing journals and logs
* Tourism and fishing destination websites

**Two Powerful Blocks:**

1. **Fish Catch Block**: Document individual fishing trips with detailed catch information
2. **Fish Catch Map Block**: Display all your fishing locations on an interactive map

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/fish-catch-block` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. Start using the blocks in the WordPress block editor!

**Optional: Configure Map API Keys**
For access to premium map themes (Thunderforest, Jawg Maps), configure API keys in Settings > General.

== Frequently Asked Questions ==

= How do I add a fishing catch record? =

1. Create a new post or page
2. Add the "Fish Catch Block" from the block inserter
3. Set your fishing location using the map picker or address
4. Add details about each fish caught including species, size, weight, and photos
5. Publish your post!

= What map styles are available? =

The plugin includes 23 different map themes:
* OpenStreetMap (default - no API key required)
* Satellite imagery (Esri WorldImagery)
* Terrain and watercolor styles (Stamen)
* CartoDB themes
* And many more!

Some premium themes require API keys (see below).

= How do I set up API keys for premium map themes? =

**For Thunderforest themes** (Landscape, Transport, etc.):
1. Register at https://www.thunderforest.com/maps/api/
2. Get your free API key (up to 7,500 requests/month)
3. Go to WordPress Admin > Settings > General
4. Scroll to "Fish Catch Block - Map Settings"
5. Enter your Thunderforest API key
6. Save changes

**For Jawg Maps themes** (Streets, Dark, Matrix, etc.):
1. Register at https://www.jawg.io/
2. Get your access token
3. Go to WordPress Admin > Settings > General
4. Scroll to "Fish Catch Block - Map Settings" 
5. Enter your Jawg Maps access token
6. Save changes

= Can I display all my catches on one map? =

Yes! Use the "Fish Catch Map Block" to display all posts containing fishing catches on a single interactive map. The map will:
* Show custom fish markers with catch counts
* Display location details in a reveal panel
* Only include posts with coordinates and catches
* Allow filtering by minimum catch count

= How do I customize the appearance? =

The Fish Catch Block includes several customization options:
* **Card colors**: Background and border colors
* **Border radius**: Adjust corner roundness
* **Image sizes**: Choose from small, medium, or large image displays
* **View options**: Set default view to list or grid
* **Map styles**: Choose from 23 different map themes

= Can I use this for saltwater and freshwater fishing? =

Absolutely! The plugin works for any type of fishing - saltwater, freshwater, fly fishing, ice fishing, etc. Simply document your catches regardless of the fishing type.

= Does this work with my theme? =

Yes! The plugin is designed to work with any properly coded WordPress theme. The blocks use semantic HTML and follow WordPress coding standards.

= Can I export my fishing data? =

Currently, all data is stored in your WordPress database as post content and meta data. You can export your content using WordPress's built-in export tools under Tools > Export.

= Is this plugin GDPR compliant? =

The plugin doesn't collect any personal data from visitors. All fishing data is entered by the site administrator/authors and stored locally in your WordPress database.

= Can I use this plugin commercially? =

Yes! The plugin is released under GPL v2 license, which allows commercial use. Perfect for fishing guides, charter services, or fishing-related businesses.

= The map isn't loading properly, what should I do? =

1. Check if you're using a premium map theme that requires an API key
2. Verify your API keys are correctly entered in Settings > General
3. Ensure your server can make external HTTP requests
4. Try switching to the default OpenStreetMap theme
5. Check browser console for JavaScript errors

= How do I change map marker styles? =

The Fish Catch Map Block uses custom fish-shaped markers with catch count overlays. The styling is handled by CSS and can be customized by developers if needed.

== Screenshots ==

1. Fish Catch Block in the editor showing catch details and location picker
2. Frontend display of a fishing catch with photos and map location
3. Fish Catch Map Block showing multiple catches on an interactive map  
4. Block settings panel with customization options
5. Map style selector with 23 different themes
6. API key configuration in WordPress General Settings

== Changelog ==

= 1.0.0 =
* Initial release
* Fish Catch Block with photo galleries and location mapping
* Fish Catch Map Block for displaying all catches
* 23 map themes including premium options
* API key support for Thunderforest and Jawg Maps
* Responsive design and mobile optimization
* List and grid view options
* Customizable styling options

== Upgrade Notice ==

= 1.0.0 =
Initial release of Fish Catch Block plugin.

== Technical Requirements ==

* WordPress 6.0 or higher
* PHP 7.4 or higher
* Modern web browser with JavaScript enabled
* Internet connection for map functionality

== API Key Information ==

**Free Usage:**
* OpenStreetMap and most themes work without any API keys
* Perfect for personal blogs and small sites

**Premium Themes:**
* **Thunderforest**: Free tier includes 7,500 requests/month
* **Jawg Maps**: Free tier includes 8,000 requests/month
* Higher usage requires paid plans

**Security:**
* API keys are stored securely in WordPress database
* Keys are only transmitted to respective map providers
* No third-party tracking or data collection

== Support ==

For support, feature requests, or bug reports, please visit:

* **GitHub Repository**: https://github.com/gin0115/fish-catch-block
* **Issues & Bug Reports**: https://github.com/gin0115/fish-catch-block/issues
* **Latest Releases**: https://github.com/gin0115/fish-catch-block/releases
* **Author**: Glynn Quelch (glynn@pinkcrab.co.uk)

== Credits ==

* Built with WordPress Block Editor (Gutenberg)
* Maps powered by Leaflet.js
* Map themes provided by Leaflet-providers
* Icons and styling use WordPress design standards
