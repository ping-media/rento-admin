export const DOCUMENT_TYPES = [
  {
    value: "rc",
    label: "Registration Certificate (RC)",
    short: "RC",
    single: true,
  },
  { value: "insurance", label: "Insurance", short: "Insurance", single: true },
  { value: "puc", label: "PUC Certificate", short: "PUC", single: true },
  {
    value: "fitness",
    label: "Fitness Certificate",
    short: "Fitness",
    single: true,
  },
  {
    value: "service_invoice",
    label: "Service / Repair Invoice",
    short: "Service invoice",
    single: false,
  },
  { value: "others", label: "Others", short: "Others", single: false },
];

// `single: true` means the slot holds one document (upload again = replace).
// `single: false` means the slot can hold many.

export const ALLOWED_DOC_MIME = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const MAX_DOC_MB = 10; // must match the backend limit

// Tells the admin whether customers can really see this document right now
export const getCustomerVisibility = (doc, settings) => {
  if (!settings) return null;

  if (!doc.isVisibleToCustomer) {
    return { shown: false, text: "Hidden from customers" };
  }
  if (!settings.allowCustomerView) {
    return {
      shown: false,
      text: "Not shown: Customer access is OFF in settings",
    };
  }
  if (!settings.visibleDocumentTypes.includes(doc.documentType)) {
    const short =
      DOCUMENT_TYPES.find((t) => t.value === doc.documentType)?.short ||
      "This type";
    return {
      shown: false,
      text: `Not shown: ${short} is not allowed in settings`,
    };
  }
  return { shown: true, text: "Shown to customers" };
};
