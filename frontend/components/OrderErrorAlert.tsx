import { AlertCircle, Package } from "lucide-react";

export const OrderErrorAlert = ({ 
  error, 
  items,
  onDismiss 
}: { 
  error: string | Record<string, string>; 
  items: any[];
  onDismiss?: () => void;
}) => {
  if (typeof error === "string") {
    return (
      <div className="relative bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg animate-in slide-in-from-top-2 duration-300">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-800 text-sm">Ошибка при оформлении</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
          {onDismiss && (
            <button 
              onClick={onDismiss}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    );
  }

  const errorEntries = Object.entries(error);

  return (
    <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg overflow-hidden animate-in slide-in-from-top-2 duration-300">
      <div className="px-4 py-3 bg-red-100/50 border-b border-red-200 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <p className="font-semibold text-red-900 text-sm">
          Не удалось оформить заказ ({errorEntries.length})
        </p>
      </div>
      
      <ul className="divide-y divide-red-100">
        {errorEntries.map(([variantId, message]) => {
          const item = items.find(i => String(i.variantId) === String(variantId));
          
          return (
            <li key={variantId} className="px-4 py-3 flex items-start gap-3 hover:bg-red-100/30 transition-colors">
              {/* Миниатюра товара */}
              {item?.mainImageUrl ? (
                <div className="relative w-12 h-12 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                  <img 
                    src={item.mainImageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                  <Package className="w-5 h-5 text-gray-400" />
                </div>
              )}
              
              {/* Информация */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    {item?.brand || "Товар"}
                  </p>
                  {item?.size && (
                    <span className="text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">
                      {item.size}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 truncate mt-0.5">
                  {item?.title || `ID: ${variantId}`}
                </p>
                <p className="text-sm text-red-700 font-medium mt-1.5 flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {message}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};