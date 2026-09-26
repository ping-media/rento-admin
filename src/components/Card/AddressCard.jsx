import React from "react";

const AddressCard = ({ adrress = [] }) => {
  if (!adrress.length) {
    return (
      <div className="bg-white rounded-lg shadow-md w-full max-w-md mx-auto flex flex-col">
        <div className="p-3 border-b font-semibold text-sm">Addresses (0)</div>
        <div className="flex items-center justify-center h-full md:h-48 mb-5 text-sm text-gray-500">
          No address found
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md w-full max-w-md mx-auto flex flex-col">
      {/* Header */}
      <div className="p-3 border-b font-semibold text-sm">
        Addresses ({adrress.length})
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto h-full md:h-48">
        {adrress.map((item, index) => (
          <div
            key={index}
            className="p-3 text-sm border-b last:border-b-0 hover:bg-gray-50"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressCard;
