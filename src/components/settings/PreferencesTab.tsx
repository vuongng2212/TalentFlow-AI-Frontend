import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Palette, Save } from "lucide-react";
import { toast } from "sonner";

interface ThemeOption {
  id: string;
  label: string;
  isSelected: boolean;
}

const themeOptions: ThemeOption[] = [
  { id: "light", label: "Light", isSelected: true },
  { id: "dark", label: "Dark", isSelected: false },
  { id: "system", label: "System", isSelected: false },
];

export function PreferencesTab() {
  const handleSaveSettings = () => {
    toast.success("Settings saved!", {
      description: "Your regional settings have been updated.",
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Theme</Label>
            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map((option) => (
                <button
                  key={option.id}
                  className={`p-4 rounded-lg text-center transition-smooth ${
                    option.isSelected
                      ? "border-2 border-primary bg-background"
                      : "border border-border bg-background hover:border-primary"
                  }`}
                >
                  <Palette
                    className={`h-6 w-6 mx-auto mb-2 ${
                      option.isSelected ? "text-primary" : ""
                    }`}
                  />
                  <p className="text-sm font-medium">{option.label}</p>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Regional Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="language">Language</Label>
            <select
              id="language"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option>English (US)</option>
              <option>Vietnamese</option>
              <option>Japanese</option>
              <option>French</option>
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dateFormat">Date Format</Label>
            <select
              id="dateFormat"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>

          <Button className="gap-2" onClick={handleSaveSettings}>
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
