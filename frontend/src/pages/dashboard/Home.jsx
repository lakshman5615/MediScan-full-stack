import ScanCard from "../../components/dashboard/ScanCard";
import UploadCard from "../../components/dashboard/UploadCard";
import ManualEntryCard from "../../components/dashboard/ManualEntryCard";
import ExpiryCard from "../../components/dashboard/ExpiryCard";
import LowStockCard from "../../components/dashboard/LowStockCard";
import RecentScans from "../../components/dashboard/RecentScans";
import TodaySchedule from "../../components/dashboard/TodaySchedule";

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            Welcome back, Alex
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Your health management is on track today.
          </p>
        </div>

        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
          Emergency Assistance
        </div>
      </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ScanCard />
        <UploadCard />
        <ManualEntryCard />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExpiryCard />
        <LowStockCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentScans />
        </div>
        <TodaySchedule />
      </div>
    </div>
  );
}








// import ScanCard from "@/components/dashboard/ScanCard";
// import ManualEntryCard from "@/components/dashboard/ManualEntryCard";
// // import ExpiryCard from "@/components/dashboard/ExpiryCard";
// // import LowStockCard from "@/components/dashboard/LowStockCard";
// // import RecentScans from "@/components/dashboard/RecentScans";
// // import TodaySchedule from "@/components/dashboard/TodaySchedule";

// const Home = () => {
//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-semibold ">
//         Welcome back, Alex
//       </h1>

//       <p className="text-sm text-muted mt-1">
//   Your health management is on track today. 3 tasks pending.
// </p>

//       <div className="grid grid-cols-12 gap-5">
//         <div className="col-span-3"><ScanCard /></div>
//         {/* <div className="col-span-3"><ManualEntryCard /></div> */}
//         {/* <div className="col-span-3"><ExpiryCard /></div> */}
//         {/* <div className="col-span-3"><LowStockCard /></div> */}
//       </div>

//       <div className="grid grid-cols-12 gap-5">
//         {/* <div className="col-span-8"><RecentScans /></div> */}
//         {/* <div className="col-span-4"><TodaySchedule /></div> */}
//       </div>
//     </div>
//   );
// };

// export default Home;

