// import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
// import { tableIcons } from "../../Data/Icons";
// import { useDispatch } from "react-redux";
// import { deleteDataById } from "../../Data/index";
// import { useState } from "react";
// import PreLoader from "../../components/Skeleton/PreLoader";
// import { handleUpdateImageData } from "../../Redux/VehicleSlice/VehicleSlice";
// import LightGallery from "lightgallery/react";

// // Plugins for lightgallery
// import lgThumbnail from "lightgallery/plugins/thumbnail";
// import lgZoom from "lightgallery/plugins/zoom";

// // Import CSS for lightgallery
// import "lightgallery/css/lightgallery.css";
// import "lightgallery/css/lg-thumbnail.css";
// import "lightgallery/css/lg-zoom.css";
// import { Link } from "react-router-dom";

const UserDocumentCell = ({ item }) => {
  //   const [loading, setLoading] = useState(false);
  //   const dispatch = useDispatch();

  //   //   delete document
  //   const handleDeleteDocument = async (id, item) => {
  //     setLoading(true);
  //     try {
  //       const response = await deleteDataById("/deleteDocument", {
  //         _id: id,
  //         fileName: item?.fileName,
  //       });
  //       if (response?.status == 200) {
  //         dispatch(handleUpdateImageData({ id: item?._id }));
  //         return handleAsyncError(dispatch, response?.message, "success");
  //       } else {
  //         return handleAsyncError(dispatch, response?.message);
  //       }
  //     } catch (error) {
  //       return handleAsyncError(dispatch, "unable to delete image! try again.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  return;
  //     <>
  //       {loading === true && <PreLoader />}
  //       {Array.from({
  //         length: location.pathname == "/users-documents" ? 2 : 6,
  //       }).map((_, index) => (
  //         <td
  //           className="p-3 whitespace-nowrap text-sm leading-6 font-medium text-gray-900 relative"
  //           key={index}
  //         >
  //           {item.files[index] ? (
  //             <>
  //               <button
  //                 className="absolute right-10"
  //                 type="button"
  //                 onClick={() =>
  //                   handleDeleteDocument(item?._id, item?.files[index])
  //                 }
  //                 disabled={loading}
  //               >
  //                 {tableIcons.delete}
  //               </button>
  //               <LightGallery
  //                 plugins={[lgThumbnail, lgZoom]}
  //                 speed={500} // Animation speed
  //               >
  //                 <Link to={item.files[index].imageUrl}>
  //                   <img
  //                     src={item.files[index].imageUrl}
  //                     alt={item.files[index].fileName}
  //                     className="w-full h-20 object-contain"
  //                   />
  //                 </Link>
  //               </LightGallery>
  //             </>
  //           ) : (
  //             "N/A"
  //           )}
  //         </td>
  //       ))}
  //     </>
};

export default UserDocumentCell;
