import useVehicleDocumentSettings from "../../../hooks/use-vehicle-document-settings";
import { DOCUMENT_TYPES } from "../../../constants/vehicleDocuments";
import { Switch } from "../../InputAndDropdown/InputSwitch";

const VehicleDocumentSettings = () => {
  const { settings, loading, saving, saveSettings } =
    useVehicleDocumentSettings();

  if (loading || !settings) return <SettingsSkeleton />;

  const { allowCustomerView, visibleDocumentTypes } = settings;

  const toggleType = (value) => {
    const next = visibleDocumentTypes.includes(value)
      ? visibleDocumentTypes.filter((t) => t !== value)
      : [...visibleDocumentTypes, value];
    saveSettings({ visibleDocumentTypes: next });
  };

  return (
    <div className="w-full sm:w-6/12">
      <p className="text-base font-semibold text-gray-800">
        Vehicle documents for customers
      </p>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-800">Customer access</p>
          <p className="text-xs text-gray-500">
            Master switch. When OFF, customers see no vehicle documents during
            their ride.
          </p>
        </div>
        <Switch
          variant="button"
          checked={!!allowCustomerView}
          disabled={saving}
          onChange={() =>
            saveSettings({ allowCustomerView: !allowCustomerView })
          }
        />
      </div>

      <div className="mt-4 border-t border-gray-100 pt-4">
        <p className="text-base font-semibold text-gray-800">
          Allowed document types
        </p>
        <p className="mb-2 text-sm text-gray-500">
          A customer sees a document only if its type is ticked here and its own
          "Show to customer" switch is ON.
        </p>

        <div
          className={`grid grid-cols-1 gap-2 sm:grid-cols-2 ${
            allowCustomerView ? "" : "opacity-50"
          }`}
        >
          {DOCUMENT_TYPES.map(({ value, label }) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2 rounded-md border-2 border-gray-300 px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                className="h-4 w-4 accent-theme"
                checked={visibleDocumentTypes.includes(value)}
                disabled={saving}
                onChange={() => toggleType(value)}
              />
              {label}
            </label>
          ))}
        </div>

        {!allowCustomerView && (
          <p className="mt-4 text-xs text-gray-500">
            Customer access is OFF, so no document is shown right now.
          </p>
        )}
      </div>
    </div>
  );
};

export default VehicleDocumentSettings;

const SettingsSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 w-48 rounded bg-gray-200" />
    <div className="mt-4 flex items-center justify-between gap-3">
      <div className="space-y-2">
        <div className="h-4 w-64 max-w-full rounded bg-gray-200" />
        <div className="h-3 w-40 rounded bg-gray-200" />
      </div>
      <div className="h-5 w-9 shrink-0 rounded-full bg-gray-200" />
    </div>
    <div className="mt-4 border-t border-gray-100 pt-4">
      <div className="mb-3 h-4 w-40 rounded bg-gray-200" />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 rounded-md bg-gray-200" />
        ))}
      </div>
    </div>
  </div>
);
