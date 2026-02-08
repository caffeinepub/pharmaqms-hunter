import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ALLOWED_LOCATIONS } from '@/constants/locations';

type LocationMultiSelectProps = {
  selectedLocations: string[];
  onLocationsChange: (locations: string[]) => void;
};

export default function LocationMultiSelect({
  selectedLocations,
  onLocationsChange,
}: LocationMultiSelectProps) {
  const handleToggle = (location: string) => {
    if (selectedLocations.includes(location)) {
      onLocationsChange(selectedLocations.filter((l) => l !== location));
    } else {
      onLocationsChange([...selectedLocations, location]);
    }
  };

  return (
    <div className="space-y-3">
      <Label className="font-semibold">Locations</Label>
      <p className="text-sm text-muted-foreground">
        {selectedLocations.length === 0
          ? 'All locations'
          : `${selectedLocations.length} selected`}
      </p>
      <div className="space-y-2">
        {ALLOWED_LOCATIONS.map((location) => (
          <div key={location} className="flex items-center space-x-2">
            <Checkbox
              id={`location-${location}`}
              checked={selectedLocations.includes(location)}
              onCheckedChange={() => handleToggle(location)}
            />
            <Label
              htmlFor={`location-${location}`}
              className="text-sm font-normal cursor-pointer"
            >
              {location}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
