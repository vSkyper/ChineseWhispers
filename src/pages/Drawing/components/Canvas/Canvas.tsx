import useOnDraw from 'hooks/useOnDraw';
import { IPoint } from 'interfaces';

interface Props {
  width: number;
  height: number;
}

export default function Canvas({ width, height }: Props) {
  const onDraw = (
    ctx: CanvasRenderingContext2D,
    point: IPoint,
    prevPoint: IPoint
  ) => {
    drawLine(prevPoint, point, ctx, 'black', 5);
  };

  const drawLine = (
    start: IPoint,
    end: IPoint,
    ctx: CanvasRenderingContext2D,
    color: string,
    width: number
  ) => {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(start.x, start.y, width / 2, 0, 2 * Math.PI);
    ctx.fill();
  };

  const { setCanvasRef, onMouseDown } = useOnDraw(onDraw);

  return (
    <canvas
      width={width}
      height={height}
      className='border border-black'
      onMouseDown={onMouseDown}
      ref={setCanvasRef}
    />
  );
}
