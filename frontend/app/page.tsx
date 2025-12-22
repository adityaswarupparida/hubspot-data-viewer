import { Dashboard } from "./components/Dashboard";

export default function Home() {
  return (
    <div className="text-black bg-gray-50 flex flex-col h-screen">
      <div className="py-5 px-12 bg-white flex items-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500">
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className="ml-2">
          <div className="text-2xl font-bold tracking-tighter">
            HubSpot Data Viewer
          </div>
          <div className="text-sm text-gray-500">
            View and manage your CRM data
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center h-full relative">
        <Dashboard />
      </div>   
    </div>
  );
}
