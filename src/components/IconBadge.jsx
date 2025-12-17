const IconBadge = ({ text, icon, icon2, count, className, onClick }) => {
  return (
    <button
      className={`relative flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition ${className}`}
      onClick={onClick}
    >
      {/* Render React icon components directly */}
      {icon && <span className="text-xl">{icon}</span>}
      {icon2 && <span className="text-xl">{icon2}</span>}

      {/* Count */}
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1 min-w-[18px] text-center">
          {count}
        </span>
      )}

      {text && <span>{text}</span>}
    </button>
  );
};

export default IconBadge;
