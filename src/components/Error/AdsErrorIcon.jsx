import ApplicationError from "./ApplicationError";

const AdsErrorIcon = (item) => {
  return (
    <>
      {((!item?.agent || item?.agent == "" || item?.agent == "0") && (
        <ApplicationError type={"inreview"} />
      )) ||
        (item?.Type == "block" && <ApplicationError type={"disabled"} />) ||
        (item?.tokan == "0" && <ApplicationError />) ||
        (item?.enquiryLimit == "0" && <ApplicationError />) ||
        (item?.limitoff == "yes" ? <ApplicationError /> : "")}
    </>
  );
};

export default AdsErrorIcon;
