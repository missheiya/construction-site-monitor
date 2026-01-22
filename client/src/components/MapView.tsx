import React from 'react';
import { cn } from '@/lib/utils';
import { Map as MapIcon, Layers, Navigation, ZoomIn, ZoomOut, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface MapPoint {
  id: string;
  x: number; // 百分比坐标
  y: number;
  type: 'camera' | 'sensor' | 'worker';
  status: 'normal' | 'warning' | 'offline';
  label: string;
}

const MOCK_POINTS: MapPoint[] = [
  { id: 'P1', x: 20, y: 30, type: 'camera', status: 'normal', label: '大门监控' },
  { id: 'P2', x: 45, y: 40, type: 'camera', status: 'warning', label: '基坑东侧' },
  { id: 'P3', x: 70, y: 25, type: 'camera', status: 'offline', label: '材料区' },
  { id: 'P4', x: 50, y: 60, type: 'sensor', status: 'normal', label: '扬尘监测A' },
  { id: 'P5', x: 30, y: 70, type: 'worker', status: 'normal', label: '安全员-张三' },
];

export default function MapView() {
  return (
    <div className="h-full w-full relative bg-[#050505] overflow-hidden group">
      {/* 地图背景网格 */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      ></div>
      
      {/* 模拟建筑轮廓 (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M10,10 L90,10 L90,90 L10,90 Z" fill="none" stroke="var(--primary)" strokeWidth="0.2" />
        <path d="M20,20 L40,20 L40,50 L20,50 Z" fill="rgba(0, 255, 65, 0.05)" stroke="var(--primary)" strokeWidth="0.1" />
        <path d="M50,20 L80,20 L80,40 L50,40 Z" fill="rgba(0, 255, 65, 0.05)" stroke="var(--primary)" strokeWidth="0.1" />
        <circle cx="50" cy="50" r="15" fill="none" stroke="var(--primary)" strokeWidth="0.1" strokeDasharray="1,1" />
      </svg>

      {/* 地图控制栏 */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        <Button variant="secondary" size="icon" className="bg-card/80 backdrop-blur border-border">
          <Layers className="h-4 w-4" />
        </Button>
        <div className="flex flex-col bg-card/80 backdrop-blur border border-border rounded-md overflow-hidden">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none border-b border-border">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none">
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="secondary" size="icon" className="bg-card/80 backdrop-blur border-border">
          <Navigation className="h-4 w-4" />
        </Button>
      </div>

      {/* 地图点位 */}
      {MOCK_POINTS.map((point) => (
        <MapMarker key={point.id} point={point} />
      ))}

      {/* 底部图例 */}
      <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur border border-border p-2 rounded flex gap-4 text-xs z-20">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_5px_var(--primary)]"></span>
          <span className="text-muted-foreground">正常</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-destructive shadow-[0_0_5px_var(--destructive)] animate-pulse"></span>
          <span className="text-muted-foreground">报警</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-muted-foreground"></span>
          <span className="text-muted-foreground">离线</span>
        </div>
      </div>
    </div>
  );
}

function MapMarker({ point }: { point: MapPoint }) {
  const statusColor = 
    point.status === 'normal' ? 'text-primary border-primary bg-primary/20' :
    point.status === 'warning' ? 'text-destructive border-destructive bg-destructive/20 animate-pulse' :
    'text-muted-foreground border-muted-foreground bg-muted/20';

  return (
    <div 
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
      style={{ left: `${point.x}%`, top: `${point.y}%` }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">
            {/* 扩散波纹动画 (仅正常和报警状态) */}
            {point.status !== 'offline' && (
              <div className={cn(
                "absolute inset-0 rounded-full animate-ping opacity-75",
                point.status === 'warning' ? "bg-destructive" : "bg-primary"
              )}></div>
            )}
            
            {/* 图标主体 */}
            <div className={cn(
              "relative h-8 w-8 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-110 bg-black",
              statusColor
            )}>
              {point.type === 'camera' && <Video className="h-4 w-4" />}
              {point.type === 'sensor' && <div className="text-[10px] font-bold">S</div>}
              {point.type === 'worker' && <div className="text-[10px] font-bold">W</div>}
            </div>

            {/* 标签 (悬停显示) */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 bg-black/80 text-[10px] text-white whitespace-nowrap rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10">
              {point.label}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-card border-border text-card-foreground p-0 overflow-hidden">
          <div className="w-48">
            <div className="h-24 bg-black flex items-center justify-center border-b border-border">
              <span className="text-xs text-muted-foreground font-mono">NO SIGNAL</span>
            </div>
            <div className="p-2">
              <div className="font-bold text-sm mb-1">{point.label}</div>
              <div className="text-xs text-muted-foreground flex justify-between">
                <span>状态: {point.status.toUpperCase()}</span>
                <span>ID: {point.id}</span>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
