export const BubbleBackground: React.FC = () => {
  return (
    <div className="absolute min-h-screen min-w-full inset-0">
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute animate-[fatter_7s_ease-in-out_infinite] rounded-full size-[700px] bg-primary-300 dark:bg-primary-800/50 -top-32 -right-40 opacity-40"></div>
        <div className="absolute animate-[fatter_4s_ease-in-out_infinite] rounded-full size-[300px] bg-primary-400 dark:bg-primary-800 top-[400px] -right-40 opacity-40 "></div>
        <div className="absolute animate-[fatter_5s_ease-in-out_infinite] rounded-full size-[300px] bg-primary-300 dark:bg-primary-800 -bottom-32 -left-32 opacity-70"></div>
      </div>
    </div>
  );
};
