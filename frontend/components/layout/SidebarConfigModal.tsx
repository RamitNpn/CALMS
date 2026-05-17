function SidebarConfigModal({
  open,
  onClose,
  config,
  setConfig,
  onSave,
}: any) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[500px] p-4 rounded-lg">
        <h2 className="text-lg font-bold mb-4">Customize Sidebar</h2>

        {config.map((item: any, index: number) => (
          <div key={item.service_key} className="mb-3 border p-2 rounded">
            <p className="font-medium">{item.service_key}</p>

            <input
              className="border p-1 w-full mt-1"
              value={item.custom_name}
              onChange={(e) => {
                const updated = [...config];
                updated[index].custom_name = e.target.value;
                setConfig(updated);
              }}
            />

            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={item.enabled}
                onChange={(e) => {
                  const updated = [...config];
                  updated[index].enabled = e.target.checked;
                  setConfig(updated);
                }}
              />
              Enabled
            </label>
          </div>
        ))}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 bg-gray-200">
            Cancel
          </button>

          <button onClick={onSave} className="px-3 py-1 bg-black text-white">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}