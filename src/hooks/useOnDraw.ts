import { IPoint } from 'interfaces';
import { useCallback, useEffect, useRef } from 'react';

const useOnDraw = (
  onDraw: (
    ctx: CanvasRenderingContext2D,
    point: IPoint,
    prevPoint: IPoint
  ) => void
) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prevPointRef = useRef<IPoint | null>(null);
  const isDrawingRef = useRef<boolean>(false);

  const mouseMoveListenerRef = useRef<((e: MouseEvent) => void) | null>(null);
  const mouseUpListenerRef = useRef<EventListener | null>(null);

  const computePointInCanvas = useCallback(
    (clientX: number, clientY: number) => {
      if (!canvasRef.current) return;

      const boundingRect = canvasRef.current.getBoundingClientRect();
      return {
        x: clientX - boundingRect.left,
        y: clientY - boundingRect.top,
      };
    },
    []
  );

  const initMouseMoveListener = useCallback(() => {
    const listener = (e: MouseEvent) => {
      if (!isDrawingRef.current) return;

      const point = computePointInCanvas(e.clientX, e.clientY);
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx || !point) return;
      if (!prevPointRef.current) prevPointRef.current = point;
      onDraw(ctx, point, prevPointRef.current);
      prevPointRef.current = point;
    };
    mouseMoveListenerRef.current = listener;
    window.addEventListener('mousemove', listener);
  }, [computePointInCanvas, onDraw]);

  const initMouseUpListener = useCallback(() => {
    const listener = () => {
      isDrawingRef.current = false;
      prevPointRef.current = null;
    };
    mouseUpListenerRef.current = listener;
    window.addEventListener('mouseup', listener);
  }, []);

  useEffect(() => {
    initMouseMoveListener();
    initMouseUpListener();

    return () => {
      if (mouseMoveListenerRef.current) {
        window.removeEventListener('mousemove', mouseMoveListenerRef.current);
      }
      if (mouseUpListenerRef.current) {
        window.removeEventListener('mouseup', mouseUpListenerRef.current);
      }
    };
  }, [initMouseMoveListener, initMouseUpListener]);

  const setCanvasRef = (ref: HTMLCanvasElement) => {
    canvasRef.current = ref;
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
  };

  return { setCanvasRef, onMouseDown };
};

export default useOnDraw;
