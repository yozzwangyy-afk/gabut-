interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
  type?: 'spinner' | 'dots' | 'pulse';
}

export default function Loading({ 
  message = 'Memuat...', 
  fullScreen = false,
  type = 'spinner'
}: LoadingProps) {
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-700 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );

  const LoadingDots = () => (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
      <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
  );

  const LoadingPulse = () => (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 bg-purple-500 rounded-full animate-ping opacity-75"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-purple-600 rounded-full"></div>
      </div>
    </div>
  );

  const renderLoader = () => {
    switch (type) {
      case 'dots': return <LoadingDots />;
      case 'pulse': return <LoadingPulse />;
      default: return <LoadingSpinner />;
    }
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center z-50">
        <div className="text-center">
          {renderLoader()}
          <p className="mt-6 text-gray-300 text-lg font-medium">{message}</p>
          <p className="mt-2 text-gray-500 text-sm">
            Mohon tunggu sebentar...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {renderLoader()}
      <p className="mt-4 text-gray-400">{message}</p>
    </div>
  );
}
