import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "../../../components/ui/Button";

interface SearchErrorStateProps {
  onRetry: () => void;
}

export const SearchErrorState = ({ onRetry }: SearchErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
        <AlertCircle className="h-10 w-10" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-3">Something went wrong</h2>
      <p className="text-slate-600 max-w-md mb-8">
        We couldn't load these properties. This might be due to a network issue or a temporary server error.
      </p>
      <Button onClick={onRetry} variant="outline" size="lg">
        Try Again
      </Button>
    </div>
  );
};
