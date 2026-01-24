import { Sparkles, Calendar, Clock, Star } from 'lucide-react';

interface HeroProps {
  onBookNow: () => void;
}

export function Hero({ onBookNow }: HeroProps) {
  return (
    <div className="relative bg-gradient-to-br from-cyan-50 via-blue-50 to-white py-20 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center space-x-2 bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Професійний догляд за вашою красою</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Салон краси
              <span className="block bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Beauty Pro
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Онлайн запис 24/7. Найкращі майстри манікюру та педикюру.
              Професійне обладнання та матеріали преміум класу.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={onBookNow}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Записатися онлайн</span>
              </button>
              <a
                href="tel:+380000000000"
                className="bg-white text-cyan-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-cyan-50 transition-colors border-2 border-cyan-200 flex items-center justify-center space-x-2"
              >
                <span>+380 00 000 00 00</span>
              </a>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-white rounded-lg p-4 shadow-md border border-cyan-100">
                  <Clock className="w-8 h-8 text-cyan-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">24/7</div>
                  <div className="text-sm text-gray-600">Онлайн запис</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-lg p-4 shadow-md border border-cyan-100">
                  <Star className="w-8 h-8 text-cyan-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Задоволених клієнтів</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-lg p-4 shadow-md border border-cyan-100">
                  <Sparkles className="w-8 h-8 text-cyan-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">10+</div>
                  <div className="text-sm text-gray-600">Років досвіду</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <img
                  src="https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Manicure workplace"
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <img
                  src="https://images.pexels.com/photos/5128215/pexels-photo-5128215.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Nail art"
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <img
                  src="https://images.pexels.com/photos/8536590/pexels-photo-8536590.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Pedicure workplace"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <img
                  src="https://images.pexels.com/photos/3997987/pexels-photo-3997987.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Nail care"
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
