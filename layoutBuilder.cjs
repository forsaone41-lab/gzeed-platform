const fs = require('fs');

let demoCode = fs.readFileSync('src/pages/demos/UniformStoreDemo.tsx', 'utf8');

// Strip out imports and the MOCK_PRODUCTS array, we only want the component body.
let componentCode = demoCode.substring(demoCode.indexOf('export default function UniformStoreDemo() {'));

// Change signature
componentCode = componentCode.replace('export default function UniformStoreDemo() {', 'const LayoutUniformStore = ({ page, setPage, navigateToProduct, storeProducts, config, activeTheme, storeName, heroTitle, heroSubtitle, heroImage }: any) => {');

// Replace state variables that should come from props or global context in StoreBuilder
componentCode = componentCode.replace('const { isAr } = useLang();', 'const isAr = true; // Handled by StoreBuilder storeIsAr'); 
componentCode = componentCode.replace("const [currentView, setCurrentView] = useState<'home' | 'product'>('home');", "");
componentCode = componentCode.replace(/currentView === 'home'/g, "page === 'home'");
componentCode = componentCode.replace(/currentView === 'product'/g, "page === 'product'");
componentCode = componentCode.replace(/setCurrentView\('home'\)/g, "setPage('home')");
componentCode = componentCode.replace(/setCurrentView\('product'\)/g, "setPage('product')");
componentCode = componentCode.replace(/goHome/g, "(() => { setPage('home'); window.scrollTo(0,0); })");

// Replace mock products with storeProducts
componentCode = componentCode.replace(/MOCK_PRODUCTS/g, 'storeProducts');

// Add edit IDs
componentCode = componentCode.replace('<nav className=', '<nav id="store-header" className=');
componentCode = componentCode.replace('<div className="relative h-screen min-h-[600px] w-full overflow-hidden">', '<div id="store-hero" className="relative h-screen min-h-[600px] w-full overflow-hidden">');
componentCode = componentCode.replace('{/* Featured Categories */}', '{/* Featured Categories */}\\n          <div id="store-categories">');
componentCode = componentCode.replace('{/* Best Sellers */}', '</div>\\n          {/* Best Sellers */}');
componentCode = componentCode.replace('<div className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-24">', '<div id="store-products" className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-24">');
componentCode = componentCode.replace('<footer className="bg-white border-t border-slate-200 pt-20 pb-10">', '<footer id="store-footer" className="bg-white border-t border-slate-200 pt-20 pb-10">');

// Now inject it into StoreBuilder.tsx
let storeBuilder = fs.readFileSync('src/pages/StoreBuilder.tsx', 'utf8');

if (!storeBuilder.includes('LayoutUniformStore')) {
  const insertIndex = storeBuilder.indexOf('const Layout = () => {');
  storeBuilder = storeBuilder.substring(0, insertIndex) + componentCode + '\\n\\n  ' + storeBuilder.substring(insertIndex);
  
  // Add it to Layout switcher
  storeBuilder = storeBuilder.replace(
    "if (activeTheme.layout === 'glamour-beauty') return <LayoutGlamour {...props} />;",
    "if (activeTheme.layout === 'glamour-beauty') return <LayoutGlamour {...props} />;\\n       if (activeTheme.layout === 'hero-center' && activeTheme.id === 'uniform-store') return <LayoutUniformStore {...props} />;"
  );
  
  fs.writeFileSync('src/pages/StoreBuilder.tsx', storeBuilder);
  console.log("Successfully injected LayoutUniformStore!");
} else {
  console.log("Already injected.");
}
