import { useEffect, useRef } from 'react';
import { VehicleDetection } from '../types';

interface CCTVCanvasProps {
  cameraId: string;
  roadName: string;
  fps: number;
  vehicleCount: number;
  detections: VehicleDetection[];
  nightVision?: boolean;
  showBoxes?: boolean;
}

export default function CCTVCanvas({
  cameraId,
  fps,
  detections,
  nightVision = false,
  showBoxes = true,
}: CCTVCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    // Simulated traffic particles
    const laneY = [0.35, 0.48, 0.62, 0.75];
    const vehicles = [
      { x: 0.1, lane: 0, speed: 0.0018, type: 'car', color: '#e2e8f0', id: 'V-1027', plate: 'PB10XX1234' },
      { x: 0.45, lane: 1, speed: 0.0022, type: 'suv', color: '#38bdf8', id: 'V-3109', plate: 'DL01AB9921' },
      { x: 0.8, lane: 0, speed: 0.0016, type: 'truck', color: '#fb923c', id: 'V-5120', plate: 'UP16BZ7733' },
      { x: 0.25, lane: 2, speed: -0.0020, type: 'car', color: '#cbd5e1', id: 'V-4890', plate: 'CH01TC5512' },
      { x: 0.7, lane: 3, speed: -0.0025, type: 'bus', color: '#facc15', id: 'V-2041', plate: 'HR26DK8899' },
    ];

    const render = () => {
      t += 1;
      const w = canvas.width;
      const h = canvas.height;

      // 1. Clear & Background Asphalt
      ctx.fillStyle = nightVision ? '#04100c' : '#0b111a';
      ctx.fillRect(0, 0, w, h);

      // 2. Perspective Road Polygon
      ctx.beginPath();
      ctx.moveTo(w * 0.2, h * 0.2);
      ctx.lineTo(w * 0.8, h * 0.2);
      ctx.lineTo(w * 0.95, h * 0.95);
      ctx.lineTo(w * 0.05, h * 0.95);
      ctx.closePath();
      ctx.fillStyle = nightVision ? '#072017' : '#141d2b';
      ctx.fill();
      ctx.strokeStyle = nightVision ? '#0f4030' : '#1e293b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 3. Lane Dividers
      const lanes = [0.35, 0.5, 0.65];
      lanes.forEach(laneX => {
        ctx.beginPath();
        ctx.setLineDash([12, 16]);
        ctx.lineDashOffset = -t * 1.5;
        ctx.moveTo(w * (0.2 + laneX * 0.6), h * 0.2);
        ctx.lineTo(w * (0.05 + laneX * 0.9), h * 0.95);
        ctx.strokeStyle = nightVision ? 'rgba(52, 211, 153, 0.4)' : 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
      ctx.setLineDash([]); // Reset line dash

      // 4. Draw Animated Realistic Vehicles
      vehicles.forEach((v) => {
        v.x += v.speed;
        if (v.x > 1.2) v.x = -0.2;
        if (v.x < -0.2) v.x = 1.2;

        const progress = Math.max(0.1, Math.min(0.9, v.x));
        const posY = h * laneY[v.lane];
        const scale = 0.5 + (posY / h) * 0.8;
        const vW = (v.type === 'truck' ? 70 : v.type === 'bus' ? 85 : 44) * scale;
        const vH = (v.type === 'truck' ? 34 : v.type === 'bus' ? 36 : 24) * scale;
        const posX = w * (0.1 + progress * 0.8);

        // Vehicle Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(posX - vW / 2 + 2, posY - vH / 2 + 3, vW, vH);

        // Vehicle Body
        ctx.fillStyle = nightVision ? '#10b981' : v.color;
        ctx.fillRect(posX - vW / 2, posY - vH / 2, vW, vH);

        // Windshield
        ctx.fillStyle = nightVision ? '#042f2e' : '#0f172a';
        ctx.fillRect(posX - vW * 0.35, posY - vH * 0.3, vW * 0.3, vH * 0.6);

        // Headlight glow
        if (v.speed > 0) {
          ctx.beginPath();
          ctx.moveTo(posX + vW / 2, posY - 4);
          ctx.lineTo(posX + vW / 2 + 35 * scale, posY - 15 * scale);
          ctx.lineTo(posX + vW / 2 + 35 * scale, posY + 15 * scale);
          ctx.closePath();
          ctx.fillStyle = nightVision ? 'rgba(52, 211, 153, 0.15)' : 'rgba(254, 240, 138, 0.12)';
          ctx.fill();
        }

        // 5. Technical AI Bounding Box Overlays
        if (showBoxes && (v.id === 'V-1027' || (cameraId === 'CAM-03' && v.id === 'V-2041'))) {
          const isV1027 = v.id === 'V-1027';
          const isV2041 = v.id === 'V-2041';
          const boxColor = isV2041 ? '#ef4444' : '#f97316';
          const boxPad = 6;
          const bx = posX - vW / 2 - boxPad;
          const by = posY - vH / 2 - boxPad;
          const bw = vW + boxPad * 2;
          const bh = vH + boxPad * 2;

          // Technical Corner Brackets
          ctx.strokeStyle = boxColor;
          ctx.lineWidth = 1.8;
          const clen = Math.min(10, bw * 0.25);

          // Top-Left
          ctx.beginPath();
          ctx.moveTo(bx, by + clen);
          ctx.lineTo(bx, by);
          ctx.lineTo(bx + clen, by);
          ctx.stroke();

          // Top-Right
          ctx.beginPath();
          ctx.moveTo(bx + bw - clen, by);
          ctx.lineTo(bx + bw, by);
          ctx.lineTo(bx + bw, by + clen);
          ctx.stroke();

          // Bottom-Left
          ctx.beginPath();
          ctx.moveTo(bx, by + bh - clen);
          ctx.lineTo(bx, by + bh);
          ctx.lineTo(bx + clen, by + bh);
          ctx.stroke();

          // Bottom-Right
          ctx.beginPath();
          ctx.moveTo(bx + bw - clen, by + bh);
          ctx.lineTo(bx + bw, by + bh);
          ctx.lineTo(bx + bw, by + bh - clen);
          ctx.stroke();

          // Subtle box tint
          ctx.fillStyle = isV2041 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(249, 115, 22, 0.10)';
          ctx.fillRect(bx, by, bw, bh);

          // Bounding Box Header Badge: V-1027 | SEDAN | 96%
          ctx.fillStyle = boxColor;
          ctx.fillRect(bx, by - 16, Math.min(110, bw + 15), 16);
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 9px "JetBrains Mono", monospace';
          ctx.fillText(`${v.id} • ${v.type.toUpperCase()} ${isV2041 ? '91%' : '96%'}`, bx + 4, by - 4);

          // ANPR Plate Badge
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(bx, by + bh + 2, 78, 14);
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 8.5px "JetBrains Mono", monospace';
          ctx.fillText(`[ ${v.plate} ]`, bx + 4, by + bh + 12);
        }
      });

      // 6. Draw any manual detections passed from props
      if (showBoxes && detections.length > 0 && !vehicles.some(v => v.id === detections[0]?.id)) {
        detections.forEach(det => {
          const bx = (det.bbox[0] / 100) * w;
          const by = (det.bbox[1] / 100) * h;
          const bw = (det.bbox[2] / 100) * w;
          const bh = (det.bbox[3] / 100) * h;

          ctx.strokeStyle = '#f97316';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(bx, by, bw, bh);
          ctx.fillStyle = 'rgba(249, 115, 22, 0.12)';
          ctx.fillRect(bx, by, bw, bh);

          ctx.fillStyle = '#f97316';
          ctx.fillRect(bx, by - 15, 90, 15);
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 9px monospace';
          ctx.fillText(`${det.id} ${det.type} ${Math.round(det.confidence * 100)}%`, bx + 3, by - 4);

          if (det.anpr) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(bx, by + bh + 2, 70, 14);
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 8.5px monospace';
            ctx.fillText(det.anpr, bx + 4, by + bh + 12);
          }
        });
      }

      // 7. CCTV Crosshair & HUD Reticle
      ctx.strokeStyle = nightVision ? 'rgba(52, 211, 153, 0.25)' : 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      // Center crosshair
      ctx.beginPath();
      ctx.moveTo(w / 2 - 12, h / 2);
      ctx.lineTo(w / 2 + 12, h / 2);
      ctx.moveTo(w / 2, h / 2 - 12);
      ctx.lineTo(w / 2, h / 2 + 12);
      ctx.stroke();

      // Loop animation
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [cameraId, fps, detections, nightVision, showBoxes]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black select-none">
      <canvas
        ref={canvasRef}
        width={480}
        height={270}
        className="w-full h-full object-cover block"
      />
      {/* CCTV Scanline simulation layer */}
      <div className="absolute inset-0 cctv-scanlines pointer-events-none opacity-40"></div>
    </div>
  );
}
