const RadarLoader = () => {
  return (
    <div className="relative w-[150px] h-[150px] rounded-full border border-[#333] shadow-[25px_25px_75px_rgba(0,0,0,0.55)] flex items-center justify-center overflow-hidden before:content-[''] before:absolute before:inset-5 before:rounded-full before:border before:border-dashed before:border-[#444] before:shadow-[inset_-5px_-5px_25px_rgba(0,0,0,0.25),inset_5px_5px_35px_rgba(0,0,0,0.25)] after:content-[''] after:absolute after:w-[50px] after:h-[50px] after:rounded-full after:border after:border-dashed after:border-[#444] after:shadow-[inset_-5px_-5px_25px_rgba(0,0,0,0.25),inset_5px_5px_35px_rgba(0,0,0,0.25)]">
      <span className="absolute top-1/2 left-1/2 w-1/2 h-full bg-transparent origin-top-left animate-radar border-t border-dashed border-white">
        <span className="absolute top-0 left-0 w-full h-full bg-theme-purple-secondary origin-top-left rotate-[-55deg] blur-[30px] drop-shadow-[20px_20px_20px_seagreen]" />
      </span>
    </div>
  );
};

export default RadarLoader;
