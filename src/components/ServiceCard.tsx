import { Clock, Sparkles } from 'lucide-react';

interface ServiceCardProps {
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
}

export function ServiceCard({ name, description, duration, price, category }: ServiceCardProps) {
  const categoryColors = {
    manicure: 'from-pink-400 to-rose-400',
    pedicure: 'from-blue-400 to-cyan-400',
    hair: 'from-purple-400 to-indigo-400',
  };

  const gradientClass = categoryColors[category as keyof typeof categoryColors] || 'from-cyan-400 to-blue-400';

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-cyan-100 group">
      <div className={`h-2 bg-gradient-to-r ${gradientClass}`} />
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-cyan-600 transition-colors">
            {name}
          </h3>
          <Sparkles className="w-5 h-5 text-cyan-500" />
        </div>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span>{duration} хв</span>
          </div>
          <div className="text-lg font-bold text-cyan-600">
            {price} грн
          </div>
        </div>
      </div>
    </div>
  );
}
