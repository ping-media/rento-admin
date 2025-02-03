// import Spinner from "../../../components/Spinner/Spinner";
// import { handleAsyncError } from "../../../utils/Helper/handleAsyncError";
// import { useDispatch } from "react-redux";
// import { useEffect, useRef, useState } from "react";
// import { tableIcons } from "../../../Data/Icons";
// import { deleteDataById } from "../../../Data/index";
// import GLightbox from "glightbox";
// import "glightbox/dist/css/glightbox.css";

// const UserDocuments = ({ data, dataId, hookLoading }) => {
//   const [loading, setLoading] = useState(false);
//   const dispatch = useDispatch();
//   const lightbox = useRef(null);

//   useEffect(() => {
//     if (data?.length > 0) {
//       lightbox.current = GLightbox({
//         selector: ".glightbox",
//         touchNavigation: true,
//         keyboardNavigation: true,
//         zoomable: true,
//         closeButton: true,
//         openEffect: "zoom",
//         closeEffect: "zoom",
//         slideEffect: "fade",
//         loop: true,
//         width: "100vw",
//         height: "100vh",
//         autoplayVideos: false,
//       });
//     }
//     return () => {
//       if (lightbox.current) {
//         lightbox.current.destroy();
//       }
//     };
//   }, [data]);

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

//   // return (
//   //   <div className="">
//   //     <h2 className="mb-2 uppercase text-theme font-bold text-lg">
//   //       User Documents ({data?.length || 0})
//   //     </h2>
//   //     {hookLoading && <Spinner />}
//   //     {!hookLoading && data && data?.length > 0 ? (
//   //       <div className="flex items-center gap-2 flex-wrap">
//   //         {data?.map((item) => (
//   //           <div
//   //             className="relative w-52 border-2 rounded-md p-1 h-full"
//   //             key={item?._id}
//   //           >
//   //             <button
//   //               className="absolute right-3 z-20"
//   //               type="button"
//   //               onClick={() => handleDeleteDocument(dataId, item)}
//   //               disabled={loading}
//   //             >
//   //               {tableIcons.delete}
//   //             </button>
//   //             <LightGallery
//   //               plugins={[lgThumbnail, lgZoom]}
//   //               speed={500} // Animation speed
//   //             >
//   //               <Link to={item.imageUrl}>
//   //                 <img
//   //                   src={item.imageUrl}
//   //                   alt={item.fileName}
//   //                   className="w-full h-full object-contain brightness-95"
//   //                 />
//   //               </Link>
//   //             </LightGallery>
//   //           </div>
//   //         ))}
//   //       </div>
//   //     ) : (
//   //       <p className="italic text-sm my-2 text-gray-400">No documents found.</p>
//   //     )}
//   //   </div>
//   // );

//   return (
//     <div>
//       {!location.pathname.includes("/all-bookings/details/") && (
//         <h2 className="mb-2 uppercase text-theme font-bold text-lg">
//           User Documents ({data?.length || 0})
//         </h2>
//       )}
//       {hookLoading && <Spinner />}
//       {!hookLoading && data?.length > 0 ? (
//         <div className="flex items-center gap-2 flex-wrap">
//           {data.map((item) => (
//             <div
//               className={`relative ${
//                 dataId ? "w-52" : "w-auto"
//               } border-2 rounded-md p-1 h-full`}
//               key={item?._id}
//             >
//               {dataId && (
//                 <button
//                   className="absolute right-3 z-20"
//                   type="button"
//                   onClick={() => handleDeleteDocument(dataId && dataId, item)}
//                   disabled={loading}
//                 >
//                   {tableIcons.delete}
//                 </button>
//               )}
//               {!location.pathname.includes("/all-bookings/details/") ? (
//                 // this is image view
//                 <a
//                   href={item.imageUrl}
//                   className="glightbox"
//                   data-glightbox="user-documents"
//                   data-title={item?.fileName?.split("_")[3]}
//                 >
//                   <img
//                     src={item.imageUrl}
//                     alt={item.fileName}
//                     className="w-full h-full object-contain brightness-95"
//                   />
//                 </a>
//               ) : (
//                 // this is button view
//                 <a
//                   href={item.imageUrl}
//                   data-glightbox="user-documents"
//                   className="glightbox flex items-center gap-1"
//                 >
//                   {tableIcons?.image}
//                   {item?.fileName?.split("_")[3]}
//                 </a>
//               )}
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="italic text-sm my-2 text-gray-400">No documents found.</p>
//       )}
//     </div>
//   );
// };

// export default UserDocuments;
