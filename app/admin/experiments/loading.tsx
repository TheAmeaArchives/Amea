import { Loader2 } from "lucide-react";

export default function ExperimentsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-36 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-52 bg-gray-100 rounded mt-2 animate-pulse" />
        </div>
        <div className="h-10 w-36 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="rounded-md border p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-default" />
        </div>
      </div>
    </div>
  );
}
