import { Search, Plus, Sparkles } from "lucide-react";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 border-b h-16">
      
      {/* Search Bar */}
      <div className="relative w-[420px]">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search medicine, history or symptoms..."
          className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center gap-4">

        {/* AI Synced */}
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Sparkles size={14} className="text-sky-500" />
          AI SYNCED
        </div>

        {/* New Entry Button */}
        <button className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-xl hover:bg-sky-600">
          <Plus size={16} />
          New Entry
        </button>

      </div>
    </header>
  );
}








// export default function Navbar() {
//   return (
//     <header className="h-16 bg-white border-b flex items-center justify-between px-6">
//       <input
//         className="w-1/2 px-4 py-2 bg-gray-100 rounded text-sm outline-none"
//         placeholder="Search medicine, history or symptoms..."
//       />

//       <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
//         + New Entry
//       </button>
//     </header>
//   );
// }
