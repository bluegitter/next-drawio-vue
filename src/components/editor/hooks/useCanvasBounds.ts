import type { Ref } from 'vue';

type UseCanvasBoundsArgs = {
  pageWidth: number;
  pageHeight: number;
  pageCountX: Ref<number>;
  pageCountY: Ref<number>;
  pageNegX: Ref<number>;
  pageNegY: Ref<number>;
  setPageCountX: (value: number) => void;
  setPageCountY: (value: number) => void;
  setPageNegX: (value: number) => void;
  setPageNegY: (value: number) => void;
  scrollContainerRef: Ref<HTMLDivElement | null>;
  zoom: Ref<number>;
};

export const useCanvasBounds = ({
  pageWidth,
  pageHeight,
  pageCountX,
  pageCountY,
  pageNegX,
  pageNegY,
  setPageCountX,
  setPageCountY,
  setPageNegX,
  setPageNegY,
  scrollContainerRef,
  zoom,
}: UseCanvasBoundsArgs) => {
  return (bounds: { minX: number; minY: number; maxX: number; maxY: number }) => {
    const STEP = 0.5;
    const shrinkPaddingX = pageWidth * 0.1;
    const shrinkPaddingY = pageHeight * 0.1;
    const ceilToStep = (value: number) => Math.ceil(value / STEP) * STEP;

    const paddedMinX = bounds.minX - shrinkPaddingX;
    const paddedMaxX = bounds.maxX + shrinkPaddingX;
    const paddedMinY = bounds.minY - shrinkPaddingY;
    const paddedMaxY = bounds.maxY + shrinkPaddingY;

    const requiredNegX = Math.max(0, ceilToStep(Math.max(0, -paddedMinX) / pageWidth));
    const requiredNegY = Math.max(0, ceilToStep(Math.max(0, -paddedMinY) / pageHeight));
    const requiredPosX = Math.max(1, ceilToStep(Math.max(0, paddedMaxX) / pageWidth));
    const requiredPosY = Math.max(1, ceilToStep(Math.max(0, paddedMaxY) / pageHeight));

    const nextNegX = requiredNegX;
    const nextNegY = requiredNegY;
    const nextPosX = requiredPosX;
    const nextPosY = requiredPosY;

    const deltaNegX = nextNegX - pageNegX.value;
    const deltaNegY = nextNegY - pageNegY.value;

    if (
      nextNegX === pageNegX.value &&
      nextNegY === pageNegY.value &&
      nextPosX === pageCountX.value &&
      nextPosY === pageCountY.value
    ) {
      return;
    }

    setPageNegX(nextNegX);
    setPageNegY(nextNegY);
    setPageCountX(nextPosX);
    setPageCountY(nextPosY);

    if ((deltaNegX !== 0 || deltaNegY !== 0) && scrollContainerRef.value) {
      const scroller = scrollContainerRef.value;
      const newLeft = scroller.scrollLeft + deltaNegX * pageWidth * zoom.value;
      const newTop = scroller.scrollTop + deltaNegY * pageHeight * zoom.value;
      requestAnimationFrame(() => {
        scroller.scrollTo({
          left: Math.max(0, newLeft),
          top: Math.max(0, newTop),
          behavior: 'instant' as ScrollBehavior,
        });
      });
    }
  };
};
