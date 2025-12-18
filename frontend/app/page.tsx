import { FaHubspot } from "react-icons/fa";

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
        <div className="absolute px-12 py-6 w-full h-full z-10">
          <div className="bg-gray-100 w-full h-full rounded-lg"></div>
        </div>
        <button className="flex gap-2 text-xl items-center bg-white hover:bg-orange-100 px-9 py-3 rounded-lg cursor-pointer z-20">
          <div className="font-medium">Login with HubSpot</div>
          <FaHubspot size={30} className="text-orange-500"/>
        </button>
      </div>   
    </div>
  );
}
