import ModalWrapper from "./ModalWrapper";
import VehicleDocumentsManager from "../VehicleDetails/VehicleDocuments/VehicleDocumentsManager";

const VehicleDocumentsModal = ({ active, onClose, vehicleTableId }) => (
  <ModalWrapper
    active={active}
    onClose={onClose}
    title="Vehicle Documents"
    size="2xl"
    position="center"
  >
    {/* mounted only while open, so it always loads fresh data */}
    {active && <VehicleDocumentsManager vehicleTableId={vehicleTableId} />}
  </ModalWrapper>
);

export default VehicleDocumentsModal;
