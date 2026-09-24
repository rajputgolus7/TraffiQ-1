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

interface SimulatedVehicle {
  id: string;
  plate: string;
  type: 'sedan' | 'suv' | 'truck' | 'bus';
  color: string;
  lane: number; // 0, 1 = Southbound (down), 2, 3 = Northbound (up)
  y: number; // 0.15 to 1.15
  speed: number;
  isTarget?: boolean;
  isWatchlist?: boolean;
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

    // Distinct vehicle populations per camera so feeds look unique and realistic
    const getCameraVehicles = (): SimulatedVehicle[] => {
      switch (cameraId) {
        case 'CAM-01': // Rajpura Junction - Target V-1027 is here
          return [
            { id: 'V-1027', plate: 'PB10XX1234', type: 'sedan', color: '#f8fafc', lane: 1, y: 0.52, speed: 0.0022, isTarget: true },
            { id: 'V-3109', plate: 'DL01AB9921', type: 'suv', color: '#38bdf8', lane: 0, y: 0.25, speed: 0.0019 },
            { id: 'V-5120', plate: 'UP16BZ7733', type: 'truck', color: '#f97316', lane: 3, y: 0.70, speed: -0.0018 },
            { id: 'V-4890', plate: 'CH01TC5512', type: 'bus', color: '#eab308', lane: 2, y: 0.38, speed: -0.0015 },
          ];
        case 'CAM-02': // GT Road Flyover - Highway flow
          return [
            { id: 'V-3109', plate: 'DL01AB9921', type: 'sedan', color: '#94a3b8', lane: 1, y: 0.65, speed: 0.0026 },
            { id: 'V-8821', plate: 'HR10AQ4421', type: 'suv', color: '#e2e8f0', lane: 0, y: 0.35, speed: 0.0024 },
            { id: 'V-4890', plate: 'CH01TC5512', type: 'bus', color: '#eab308', lane: 2, y: 0.82, speed: -0.0020 },
            { id: 'V-6610', plate: 'PB65DD1100', type: 'truck', color: '#3b82f6', lane: 3, y: 0.30, speed: -0.0017 },
          ];
        case 'CAM-03': // Industrial Tollway - Priority Watchlist Target V-2041
          return [
            { id: 'V-2041', plate: 'HR26DK8899', type: 'suv', color: '#18181b', lane: 1, y: 0.58, speed: 0.0028, isWatchlist: true },
            { id: 'V-7712', plate: 'UP14EX9901', type: 'truck', color: '#f97316', lane: 0, y: 0.82, speed: 0.0016 },
            { id: 'V-5120', plate: 'UP16BZ7733', type: 'truck', color: '#0284c7', lane: 3, y: 0.40, speed: -0.0016 },
            { id: 'V-9011', plate: 'DL08CK2211', type: 'sedan', color: '#f1f5f9', lane: 2, y: 0.20, speed: -0.0022 },
          ];
        case 'CAM-04': // Metro Terminal Interchange - Busy intersection
          return [
            { id: 'V-6602', plate: 'DL04MC8812', type: 'bus', color: '#10b981', lane: 2, y: 0.45, speed: -0.0018 },
            { id: 'V-1027', plate: 'PB10XX1234', type: 'sedan', color: '#f8fafc', lane: 1, y: 0.78, speed: 0.0021, isTarget: true },
            { id: 'V-8831', plate: 'CH03AA9012', type: 'sedan', color: '#cbd5e1', lane: 0, y: 0.30, speed: 0.0023 },
            { id: 'V-9910', plate: 'PB11BM3344', type: 'suv', color: '#dc2626', lane: 3, y: 0.62, speed: -0.0024 },
          ];
        case 'CAM-05': // Sector 14 Ring Road
          return [
            { id: 'V-5511', plate: 'DL02CL5544', type: 'sedan', color: '#f1f5f9', lane: 1, y: 0.40, speed: 0.0020 },
            { id: 'V-3109', plate: 'DL01AB9921', type: 'suv', color: '#38bdf8', lane: 2, y: 0.75, speed: -0.0022 },
          ];
        default: // Northern Freight Gate
          return [
            { id: 'V-7023', plate: 'HR55TR1122', type: 'truck', color: '#d97706', lane: 0, y: 0.50, speed: 0.0015 },
            { id: 'V-6101', plate: 'UP80TT9988', type: 'truck', color: '#2563eb', lane: 3, y: 0.68, speed: -0.0017 },
          ];
      }
    };

    const vehicles = getCameraVehicles();

    // Lane centers relative to road width at that Y:
    // Lanes 0, 1 = Southbound (downward), Lanes 2, 3 = Northbound (upward)
    const laneOffsets = [0.15, 0.36, 0.64, 0.85];

    const render = () => {
      t += 1;
      const w = canvas.width;
      const h = canvas.height;

      // 1. Background Surroundings (Asphalt & Shoulder)
      ctx.fillStyle = nightVision ? '#030d0a' : '#080d16';
      ctx.fillRect(0, 0, w, h);

      // Road boundary coordinates in perspective
      const topY = h * 0.16;
      const botY = h * 0.98;
      const topL = w * 0.28;
      const topR = w * 0.72;
      const botL = w * 0.05;
      const botR = w * 0.95;

      // 2. Perspective Road Surface
      ctx.beginPath();
      ctx.moveTo(topL, topY);
      ctx.lineTo(topR, topY);
      ctx.lineTo(botR, botY);
      ctx.lineTo(botL, botY);
      ctx.closePath();
      ctx.fillStyle = nightVision ? '#072017' : '#111827';
      ctx.fill();
      ctx.strokeStyle = nightVision ? '#0f4030' : '#1e293b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Road shoulder curb lines
      ctx.strokeStyle = nightVision ? '#047857' : '#475569';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(topL, topY);
      ctx.lineTo(botL, botY);
      ctx.moveTo(topR, topY);
      ctx.lineTo(botR, botY);
      ctx.stroke();

      // 3. Lane Dividers
      // Center Double Line (Separates North & South traffic)
      const centerTopX = (topL + topR) / 2;
      const centerBotX = (botL + botR) / 2;
      ctx.strokeStyle = nightVision ? 'rgba(52, 211, 153, 0.7)' : 'rgba(234, 179, 8, 0.75)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerTopX - 2, topY);
      ctx.lineTo(centerBotX - 4, botY);
      ctx.moveTo(centerTopX + 2, topY);
      ctx.lineTo(centerBotX + 4, botY);
      ctx.stroke();

      // Dashed lane dividers for Southbound (between lane 0 & 1) and Northbound (between lane 2 & 3)
      const dividerFractions = [0.255, 0.745];
      dividerFractions.forEach((frac) => {
        const divTopX = topL + (topR - topL) * frac;
        const divBotX = botL + (botR - botL) * frac;

        ctx.beginPath();
        ctx.setLineDash([12, 14]);
        ctx.lineDashOffset = -t * 1.4;
        ctx.moveTo(divTopX, topY);
        ctx.lineTo(divBotX, botY);
        ctx.strokeStyle = nightVision ? 'rgba(52, 211, 153, 0.35)' : 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
      ctx.setLineDash([]); // Reset line dash

      // 4. Draw Animated Vehicles Moving Vertically Along Their Lanes
      vehicles.forEach((v) => {
        v.y += v.speed;

        // Reset loop when moving past screen bounds
        if (v.speed > 0 && v.y > 1.15) {
          v.y = 0.14;
        } else if (v.speed < 0 && v.y < 0.14) {
          v.y = 1.15;
        }

        // Clamp calculation values to screen space
        const clampY = Math.max(0.14, Math.min(1.15, v.y));
        const progress = (clampY - 0.16) / (0.98 - 0.16);

        // Perspective road width and lateral X position for vehicle's lane
        const currentL = topL + (botL - topL) * progress;
        const currentR = topR + (botR - topR) * progress;
        const currentWidth = currentR - currentL;
        const posX = currentL + currentWidth * laneOffsets[v.lane];
        const posY = clampY * h;

        // Scale factor: small at horizon (~0.45), large at bottom (~1.25)
        const scale = 0.42 + 0.85 * Math.max(0, Math.min(1, progress));

        // Vehicle Dimensions (Vertical orientation: Width along X, Length along Y)
        const baseW = v.type === 'truck' ? 28 : v.type === 'bus' ? 30 : v.type === 'suv' ? 25 : 22;
        const baseH = v.type === 'truck' ? 68 : v.type === 'bus' ? 82 : v.type === 'suv' ? 48 : 42;
        const vW = baseW * scale;
        const vH = baseH * scale;

        // Direction: 1 = Southbound (heading down towards camera), -1 = Northbound (heading up)
        const isSouthbound = v.speed > 0;

        // --- A. Headlight Cones (Cast onto road) ---
        if (isSouthbound) {
          // Southbound headlights shine DOWNWARDS towards the camera
          const coneLength = 55 * scale;
          const coneSpread = 28 * scale;
          ctx.beginPath();
          ctx.moveTo(posX - vW * 0.3, posY + vH / 2);
          ctx.lineTo(posX - vW * 0.3 - coneSpread * 0.4, posY + vH / 2 + coneLength);
          ctx.lineTo(posX - vW * 0.3 + coneSpread * 0.6, posY + vH / 2 + coneLength);
          ctx.closePath();
          ctx.fillStyle = nightVision ? 'rgba(52, 211, 153, 0.18)' : 'rgba(254, 240, 138, 0.18)';
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(posX + vW * 0.3, posY + vH / 2);
          ctx.lineTo(posX + vW * 0.3 - coneSpread * 0.6, posY + vH / 2 + coneLength);
          ctx.lineTo(posX + vW * 0.3 + coneSpread * 0.4, posY + vH / 2 + coneLength);
          ctx.closePath();
          ctx.fillStyle = nightVision ? 'rgba(52, 211, 153, 0.18)' : 'rgba(254, 240, 138, 0.18)';
          ctx.fill();
        }

        // --- B. Vehicle Shadow ---
        ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
        ctx.fillRect(posX - vW / 2 + 2, posY - vH / 2 + 3, vW, vH);

        // --- C. Vehicle Main Body (Rounded vertical chassis) ---
        ctx.fillStyle = nightVision ? '#10b981' : v.color;
        const cornerR = 3 * scale;
        ctx.beginPath();
        ctx.roundRect(posX - vW / 2, posY - vH / 2, vW, vH, cornerR);
        ctx.fill();
        ctx.strokeStyle = nightVision ? '#047857' : '#0f172a';
        ctx.lineWidth = 1;
        ctx.stroke();

        // --- D. Roof & Windows (Top-down CCTV view) ---
        // Roof
        const roofW = vW * 0.72;
        const roofH = vH * 0.45;
        const roofY = posY - (isSouthbound ? 2 * scale : -2 * scale);
        ctx.fillStyle = nightVision ? '#065f46' : 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(posX - roofW / 2, roofY - roofH / 2, roofW, roofH);

        // Windshield & Rear Glass
        const glassColor = nightVision ? '#022c22' : '#0f172a';
        ctx.fillStyle = glassColor;
        if (isSouthbound) {
          // Front windshield is at bottom of roof
          ctx.fillRect(posX - roofW * 0.45, roofY + roofH / 2, roofW * 0.9, 4 * scale);
          // Rear window is at top of roof
          ctx.fillRect(posX - roofW * 0.45, roofY - roofH / 2 - 3 * scale, roofW * 0.9, 3 * scale);
        } else {
          // Front windshield is at top of roof
          ctx.fillRect(posX - roofW * 0.45, roofY - roofH / 2 - 4 * scale, roofW * 0.9, 4 * scale);
          // Rear window is at bottom of roof
          ctx.fillRect(posX - roofW * 0.45, roofY + roofH / 2, roofW * 0.9, 3 * scale);
        }

        // --- E. Headlights / Taillights ---
        if (isSouthbound) {
          // Front headlights at bottom of vehicle (pointing down)
          ctx.fillStyle = nightVision ? '#6ee7b7' : '#fef08a';
          ctx.fillRect(posX - vW / 2 + 1, posY + vH / 2 - 2, 4 * scale, 2);
          ctx.fillRect(posX + vW / 2 - 4 * scale - 1, posY + vH / 2 - 2, 4 * scale, 2);
          // Red rear taillights at top
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(posX - vW / 2 + 2, posY - vH / 2, 3 * scale, 2);
          ctx.fillRect(posX + vW / 2 - 3 * scale - 2, posY - vH / 2, 3 * scale, 2);
        } else {
          // Front headlights at top of vehicle (pointing up)
          ctx.fillStyle = nightVision ? '#6ee7b7' : '#fef08a';
          ctx.fillRect(posX - vW / 2 + 1, posY - vH / 2, 4 * scale, 2);
          ctx.fillRect(posX + vW / 2 - 4 * scale - 1, posY - vH / 2, 4 * scale, 2);
          // Red rear taillights at bottom (pointing down towards camera)
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(posX - vW / 2 + 2, posY + vH / 2 - 2, 3.5 * scale, 2.5);
          ctx.fillRect(posX + vW / 2 - 3.5 * scale - 2, posY + vH / 2 - 2, 3.5 * scale, 2.5);
        }

        // --- F. Technical AI Bounding Box Overlays ---
        const shouldShowBox = showBoxes && (v.isTarget || v.isWatchlist);
        if (shouldShowBox) {
          const isWatch = v.isWatchlist;
          const boxColor = isWatch ? '#ef4444' : '#f97316';
          const pad = 5 * scale;
          const bx = posX - vW / 2 - pad;
          const by = posY - vH / 2 - pad;
          const bw = vW + pad * 2;
          const bh = vH + pad * 2;

          // Technical Corner Brackets
          ctx.strokeStyle = boxColor;
          ctx.lineWidth = 1.8;
          const clen = Math.min(10, Math.min(bw, bh) * 0.35);

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
          ctx.fillStyle = isWatch ? 'rgba(239, 68, 68, 0.14)' : 'rgba(249, 115, 22, 0.12)';
          ctx.fillRect(bx, by, bw, bh);

          // Top Label Badge: V-1027 • SEDAN 96%
          ctx.fillStyle = boxColor;
          ctx.fillRect(bx, by - 16, Math.max(90, bw + 20), 16);
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 9px "JetBrains Mono", monospace';
          ctx.fillText(`${v.id} • ${v.type.toUpperCase()} ${isWatch ? '91%' : '96%'}`, bx + 4, by - 4);

          // Bottom ANPR Badge: [ PB10XX1234 ]
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(bx, by + bh + 2, 78, 14);
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 8.5px "JetBrains Mono", monospace';
          ctx.fillText(`[ ${v.plate} ]`, bx + 4, by + bh + 12);
        }
      });

      // 5. CCTV Crosshair Reticle & HUD Lines
      ctx.strokeStyle = nightVision ? 'rgba(52, 211, 153, 0.2)' : 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      // Center crosshair
      ctx.beginPath();
      ctx.moveTo(w / 2 - 14, h / 2);
      ctx.lineTo(w / 2 + 14, h / 2);
      ctx.moveTo(w / 2, h / 2 - 14);
      ctx.lineTo(w / 2, h / 2 + 14);
      ctx.stroke();

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
