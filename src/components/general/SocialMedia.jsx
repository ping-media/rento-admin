import Input from "../InputAndDropdown/Input";

const SocialMedia = ({ data }) => {
  return (
    <>
      <div className="flex items-center gap-2 flex-wrap mb-2">
        <div className="w-full lg:flex-1">
          <Input
            item={"facebook"}
            isCapital={false}
            value={data?.facebook}
            require={true}
          />
        </div>
        <div className="w-full lg:flex-1">
          <Input
            item={"instagram"}
            isCapital={false}
            value={data?.instagram}
            require={true}
          />
        </div>
        <div className="w-full lg:flex-1">
          <Input
            item={"twitter"}
            isCapital={false}
            value={data?.twitter}
            require={true}
          />
        </div>
      </div>
    </>
  );
};

export default SocialMedia;
