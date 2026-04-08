import { Suspense } from "react";
import PostPropertyClientPage from "./post-property-client";

export default function PostPropertyPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PostPropertyClientPage />
    </Suspense>
  );
}
