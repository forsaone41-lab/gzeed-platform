const fs = require('fs');

const path = 'src/pages/GZeedBuilder.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldBlock = `<div className="p-6 grid grid-cols-2 gap-4">
                        <button onClick={() => handleAddCustomSection('text')} className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-slate-200 hover:border-cyan-500 hover:bg-cyan-50 transition-all">
                           <Type className="w-8 h-8 text-cyan-600" />
                           <span className="font-bold text-slate-700">{lang === 'ar' ? 'نص' : 'Text'}</span>
                        </button>
                        <button onClick={() => handleAddCustomSection('slider')} className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50 transition-all">
                           <ImageIcon className="w-8 h-8 text-amber-600" />
                           <span className="font-bold text-slate-700">{lang === 'ar' ? 'معرض صور' : 'Slider'}</span>
                        </button>
                        <button onClick={() => handleAddCustomSection('video')} className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-slate-200 hover:border-rose-500 hover:bg-rose-50 transition-all">
                           <Video className="w-8 h-8 text-rose-600" />
                           <span className="font-bold text-slate-700">{lang === 'ar' ? 'فيديو' : 'Video'}</span>
                        </button>
                        <button onClick={() => handleAddCustomSection('html')} className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all">
                           <Code className="w-8 h-8 text-indigo-600" />
                           <span className="font-bold text-slate-700">HTML</span>
                        </button>
                      </div>`;

const newBlock = `<div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                        <button onClick={() => handleAddCustomSection('text')} className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border border-slate-200 hover:border-cyan-500 hover:bg-cyan-50 transition-all text-center">
                           <Type className="w-6 h-6 text-cyan-600" />
                           <span className="font-bold text-slate-700 text-[11px]">{lang === 'ar' ? 'نص' : 'Text'}</span>
                        </button>
                        <button onClick={() => handleAddCustomSection('slider')} className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50 transition-all text-center">
                           <ImageIcon className="w-6 h-6 text-amber-600" />
                           <span className="font-bold text-slate-700 text-[11px]">{lang === 'ar' ? 'معرض صور' : 'Slider'}</span>
                        </button>
                        <button onClick={() => handleAddCustomSection('video')} className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border border-slate-200 hover:border-rose-500 hover:bg-rose-50 transition-all text-center">
                           <Video className="w-6 h-6 text-rose-600" />
                           <span className="font-bold text-slate-700 text-[11px]">{lang === 'ar' ? 'فيديو' : 'Video'}</span>
                        </button>
                        <button onClick={() => handleAddCustomSection('newsletter')} className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-center">
                           <Mail className="w-6 h-6 text-emerald-600" />
                           <span className="font-bold text-slate-700 text-[11px]">{lang === 'ar' ? 'نشرة بريدية' : 'Newsletter'}</span>
                        </button>
                        <button onClick={() => handleAddCustomSection('features')} className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-center">
                           <Star className="w-6 h-6 text-blue-600" />
                           <span className="font-bold text-slate-700 text-[11px]">{lang === 'ar' ? 'مميزاتنا' : 'Features'}</span>
                        </button>
                        <button onClick={() => handleAddCustomSection('testimonials')} className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border border-slate-200 hover:border-pink-500 hover:bg-pink-50 transition-all text-center">
                           <MessageSquare className="w-6 h-6 text-pink-600" />
                           <span className="font-bold text-slate-700 text-[11px]">{lang === 'ar' ? 'آراء العملاء' : 'Testimonials'}</span>
                        </button>
                        <button onClick={() => handleAddCustomSection('html')} className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all text-center">
                           <Code className="w-6 h-6 text-indigo-600" />
                           <span className="font-bold text-slate-700 text-[11px]">HTML</span>
                        </button>
                      </div>`;

// Wait, the encoding of arabic characters might be an issue, let's just use string replacement on parts.
// The arabic characters in the original file are mangled like 'Ù†Øµ' when printed to console sometimes, but when reading utf8 it might match or not.
const startIndex = content.indexOf('<div className="p-6 grid grid-cols-2 gap-4">');
const endIndex = content.indexOf('</div>', startIndex + 500) + 6; // find the closing div of the grid. Let's just find the first </div> after <Code ...>

if (startIndex !== -1) {
    const afterCodeIndex = content.indexOf('<Code className="w-8 h-8 text-indigo-600" />', startIndex);
    const htmlCloseSpan = content.indexOf('</span>', afterCodeIndex);
    const htmlButtonClose = content.indexOf('</button>', htmlCloseSpan);
    const gridClose = content.indexOf('</div>', htmlButtonClose);
    
    if (gridClose !== -1) {
        const toReplace = content.substring(startIndex, gridClose + 6);
        content = content.replace(toReplace, newBlock);
        fs.writeFileSync(path, content, 'utf8');
        console.log("Replaced successfully!");
    } else {
        console.log("Could not find grid close.");
    }
} else {
    console.log("Could not find start index.");
}
