import ApplicationErrorMessage from "./ApplicationErrorMessage";

const AdsErrorMessage = (item) => {
  return (
    <>
      {((!item?.agent || item?.agent == "" || item?.agent == "0") && (
        <ApplicationErrorMessage />
      )) ||
        (item?.tokan == "0" && (
          <ApplicationErrorMessage type={"lowBalance"} />
        )) ||
        (item?.enquiryLimit == "0" && (
          <ApplicationErrorMessage type={"enquiryLimit"} />
        )) ||
        (item?.limitoff == "yes" && (
          <ApplicationErrorMessage type={"enquiryLimit"} />
        ))}
    </>
  );
};

export default AdsErrorMessage;
