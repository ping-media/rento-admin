const CheckBoxInput = () => {
  return (
    <>
      <label for="hr" className="flex flex-row items-center gap-2.5 text-black">
        <input id="hr" type="checkbox" className="peer hidden" />
        <div
          for="hr"
          className="h-5 w-5 flex rounded-md border border-[#a2a1a833] bg-[#e8e8e8] peer-checked:bg-[#7152f3] transition"
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            className="w-5 h-5 light:stroke-[#e8e8e8] dark:stroke-[#212121]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 12.6111L8.92308 17.5L20 6.5"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </div>
      </label>
    </>
  );
};

export default CheckBoxInput;
