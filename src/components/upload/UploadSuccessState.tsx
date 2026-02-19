import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface UploadSuccessStateProps {
  fileCount: number;
}

export function UploadSuccessState({ fileCount }: UploadSuccessStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">Upload Successful!</h3>
          <p className="text-muted-foreground mb-4">
            {fileCount} CV{fileCount > 1 ? "s" : ""} uploaded and processing...
          </p>
          <p className="text-sm text-muted-foreground">
            Redirecting to candidates page...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
