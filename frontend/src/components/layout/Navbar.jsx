// import { Search, Plus, Sparkles } from "lucide-react";

// export default function Navbar({ onNewEntry }) {
//   return (
//     // <header className="flex items-center justify-between bg-white px-6 py-4 border-b h-16">
//       //  <header className="flex   flex-col sm:flex-row gap-3 sm:items-center sm:justify-between bg-white px-4 py-3 border-b w-full">
//       <header
      
//    className="
//   flex items-center gap-2
//   bg-sky-500 text-white
//   px-5 py-2
//   rounded-xl
//   hover:bg-sky-600
//   whitespace-nowrap
//   min-w-fit
// "
// >
    


//         <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
//       {/* Search Bar */}
//            <div className="relative w-full max-w-[420px]">

//         <Search
//           size={18}
//           className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
//         />
//         <input
//           type="text"
//           placeholder="Search medicine, history or symptoms..."
//           className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
//         />
//       </div>

//       {/* Right Side Icons */}
//       <div className="flex items-center gap-4">

//         {/* AI Synced */}
//         {/* <div className="flex items-center gap-1 text-xs text-gray-500">
//           <Sparkles size={14} className="text-sky-500" />
//           AI SYNCED
//         </div> */}

//         {/* New Entry Button */}
//         <button
//         onClick={onNewEntry}
//         className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-xl hover:bg-sky-600"
//       >
//         <Plus size={18} />
//         New Entry
//       </button>
// </div>

//       </div>
//     </header>
//   );
// }




// import { Search, Plus } from "lucide-react";

// export default function Navbar({ onNewEntry }) {
//   return (
//     <header
//      className="
//     fixed top-0 right-0
//     z-50
//     flex flex-col sm:flex-row
//     gap-3 sm:items-center sm:justify-between
//     bg-white
//     px-4 py-3
//     border-b
//     w-full lg:w-[calc(100%-16rem)]
//     w-full lg:left-64 lg:w-[calc(100%-16rem)]
//   "

//     >
//       {/* Search Bar */}
//       <div className="relative w-full max-w-[420px]">
//         <Search
//           size={18}
//           className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
//         />
//         <input
//           type="text"
//           placeholder="Search medicine, history or symptoms..."
//           className="
//             w-full
//             pl-12 pr-4 py-2.5
//             rounded-xl
//             border border-gray-200
//             bg-gray-50
//             text-gray-800
//             focus:outline-none
//             focus:ring-2 focus:ring-sky-500
//           "
//         />
//       </div>

//       {/* Right side */}
//       <div className="flex items-center gap-4">
//         {/* New Entry Button (ONLY this is blue) */}
//         <button
//           onClick={onNewEntry}
//           className="
//             flex items-center gap-2
//             bg-sky-500 text-white
//             px-5 py-2
//             rounded-xl
//             hover:bg-sky-600
//             whitespace-nowrap
//             min-w-fit
//           "
//         >
//           <Plus size={18} />
//           New Entry
//         </button>
//       </div>
//     </header>
//   );
// }


import { Menu, Search, Plus } from "lucide-react";
import { useState } from "react";
import NewEntryModal from "../dashboard/NewEntryModal";


export default function Navbar({ onMenuClick }) {
  const [openEntry, setOpenEntry] = useState(false); // ✅ ADD

  return (
    <>
      <header className="fixed top-0 left-0 right-0 lg:left-64 h-16 bg-white border-b z-30 flex items-center gap-3 px-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded hover:bg-gray-100"
        >
          <Menu size={22} />
        </button>

        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 border text-sm outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Search medicine..."
          />
        </div>

        {/* ✅ ONLY CHANGE HERE */}
        <button
          onClick={() => setOpenEntry(true)}
          className="bg-sky-500 text-white px-4 py-2 rounded-xl hover:bg-sky-600 flex items-center gap-2"
        >
          <Plus size={18} />
          <span className="hidden sm:block">New Entry</span>
        </button>
      </header>

      {/* ✅ MODAL */}
      <NewEntryModal
        isOpen={openEntry}
        onClose={() => setOpenEntry(false)}
      />
    </>
  );
}








