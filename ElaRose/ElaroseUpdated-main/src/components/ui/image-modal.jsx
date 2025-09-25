import { Dialog, DialogContent } from './dialog';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export default function ImageModal({ isOpen, onOpenChange, images = [], currentIndex = 0, onPrev, onNext }) {
    const currentImage = images && images.length > 0 ? images[currentIndex] : null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl w-full p-0 bg-transparent">
                <div className="relative bg-black/90 rounded-xl overflow-hidden">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20">
                        <X className="w-5 h-5 text-white" />
                    </button>

                    {images && images.length > 0 ? (
                        <div className="flex items-center justify-center relative">
                            <button
                                onClick={onPrev}
                                className="absolute left-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="w-6 h-6 text-white" />
                            </button>

                            <div className="max-h-[80vh] w-full flex items-center justify-center">
                                <ImageWithFallback
                                    src={currentImage}
                                    alt={`Product image ${currentIndex + 1}`}
                                    className="max-h-[80vh] object-contain w-full"
                                />
                            </div>

                            <button
                                onClick={onNext}
                                className="absolute right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20"
                                aria-label="Next image"
                            >
                                <ChevronRight className="w-6 h-6 text-white" />
                            </button>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-white">No image available</div>
                    )}

                    {/* Footer indicator */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-3 z-20">
                        <div className="text-white text-sm bg-black/40 px-3 py-1 rounded-full">{`${currentIndex + 1} / ${images.length}`}</div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
