import { Suspense } from "react";
import DashboardContent from "@/components/DashboardContent";

function DashboardLoading() {
  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading sales data...</p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}
