const StatCard = ({ icon, label, value, color, textColor, variant = 'gradient' }) => {
  if (variant === 'white') {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">{label}</p>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
          </div>
          <div className="w-18 h-12 flex items-center justify-center text-2xl">
            <img src={icon} alt={label} className="w-16 h-16" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br ${color} rounded-xl p-6 text-white shadow-lg`}>
      <img src={icon} alt={label} className="w-16 h-16 mb-2" />
      <div className="text-3xl font-bold">{value}</div>
      <div className={textColor}>{label}</div>
    </div>
  );
};

export default StatCard;
