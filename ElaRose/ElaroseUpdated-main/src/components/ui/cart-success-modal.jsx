import { CheckCircle, X, ShoppingBag, Eye } from 'lucide-react';
import { Button } from './button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export default function CartSuccessModal({
    isOpen,
    onClose,
    onViewCart,
    onContinueShopping,
    product
}) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="flex items-center space-x-2">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                            <span>Added to Cart!</span>
                        </DialogTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-6 w-6 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Product Summary */}
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 overflow-hidden rounded-lg flex-shrink-0">
                            <ImageWithFallback
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm truncate">{product.name}</h3>
                            <div className="text-sm text-gray-600 mt-1">
                                <p>Size: {product.selectedSize} | Color: {product.colorName}</p>
                                <p>Quantity: {product.quantity}</p>
                            </div>
                            <p className="font-semibold text-sm mt-2">${(product.price * product.quantity).toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Success Message */}
                    <div className="text-center py-2">
                        <p className="text-gray-600 text-sm">
                            Your item has been successfully added to your cart
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2">
                        <Button
                            onClick={onViewCart}
                            className="w-full flex items-center justify-center space-x-2"
                        >
                            <ShoppingBag className="h-4 w-4" />
                            <span>View Cart</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={onContinueShopping}
                            className="w-full flex items-center justify-center space-x-2"
                        >
                            <Eye className="h-4 w-4" />
                            <span>Continue Shopping</span>
                        </Button>
                    </div>

                    {/* Additional Info */}
                    <div className="text-center pt-2 border-t">
                        <p className="text-xs text-gray-500">
                            Free shipping on orders over $100
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export { CartSuccessModal };