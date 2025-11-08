const MainTableHeader = () => {
  return (
    <div className="flex flex-row">
      <div className="items-center justify-center flex-row flex gap-2">
        <div className="flex justify-center flex-col cursor-pointer rounded-lg py-1 font-medium outline-hidden hover:opacity-90 text-high-emphasis px-3 h-8 text-sm bg-base-background-l2">
          Spot
        </div>
        <div className="flex justify-center flex-col cursor-pointer rounded-lg py-1 font-medium outline-hidden hover:opacity-90 text-med-emphasis px-3 h-8 text-sm">
          Futures
        </div>
        <div className="flex justify-center flex-col cursor-pointer rounded-lg py-1 font-medium outline-hidden hover:opacity-90 text-med-emphasis px-3 h-8 text-sm">
          Lend
        </div>
      </div>
    </div>
  );
};

export default MainTableHeader;
