type LoadingRowsProps = {
  rowsNum?: number;
};

const LoadingRows = ({ rowsNum = 4 }: LoadingRowsProps) => (
  <div className="flex-1 flex flex-col items-center">
    {Array.from({ length: rowsNum }).map((_, index) => (
      <div key={index} className="w-full h-[68px] bg-gray-200 animate-pulse mb-[68px]" />
    ))}
  </div>
);

export { LoadingRows };
