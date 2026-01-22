import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Maximize2, Video, Camera, MoreVertical, Mic, MicOff, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CameraData {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'alert';
  location: string;
}

const MOCK_CAMERAS: CameraData[] = [
  { id: 'CAM-01', name: '大门入口全景', status: 'online', location: '大门区' },
  { id: 'CAM-02', name: '塔吊1号高空', status: 'online', location: '塔吊高空' },
  { id: 'CAM-03', name: '基坑东侧', status: 'alert', location: '基坑区' },
  { id: 'CAM-04', name: '材料堆放区', status: 'offline', location: '加工区' },
  { id: 'CAM-05', name: '工人生活区A', status: 'online', location: '办公生活区' },
  { id: 'CAM-06', name: '主体施工层3F', status: 'online', location: '主体施工区' },
  { id: 'CAM-07', name: '车辆冲洗台', status: 'online', location: '大门区' },
  { id: 'CAM-08', name: '基坑西侧', status: 'online', location: '基坑区' },
  { id: 'CAM-09', name: '塔吊2号高空', status: 'online', location: '塔吊高空' },
];

export default function VideoWall() {
  const [gridSize, setGridSize] = useState<2 | 3 | 4>(3);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);

  const gridCols = {
    2: 'grid-cols-2 grid-rows-2',
    3: 'grid-cols-3 grid-rows-3',
    4: 'grid-cols-4 grid-rows-4',
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* 工具栏 */}
      <div className="flex items-center justify-between bg-card border border-border p-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground uppercase mr-2">Grid View:</span>
          <Button 
            variant={gridSize === 2 ? "secondary" : "ghost"} 
            size="sm" 
            onClick={() => setGridSize(2)}
            className="h-7 w-7 p-0"
          >
            2x2
          </Button>
          <Button 
            variant={gridSize === 3 ? "secondary" : "ghost"} 
            size="sm" 
            onClick={() => setGridSize(3)}
            className="h-7 w-7 p-0"
          >
            3x3
          </Button>
          <Button 
            variant={gridSize === 4 ? "secondary" : "ghost"} 
            size="sm" 
            onClick={() => setGridSize(4)}
            className="h-7 w-7 p-0"
          >
            4x4
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-xs gap-2">
            <Settings className="h-3 w-3" />
            轮巡设置
          </Button>
        </div>
      </div>

      {/* 视频网格 */}
      <div className={cn("grid gap-2 flex-1 min-h-0", gridCols[gridSize])}>
        {Array.from({ length: gridSize * gridSize }).map((_, index) => {
          const camera = MOCK_CAMERAS[index];
          return (
            <VideoPlayer 
              key={index} 
              camera={camera} 
              index={index}
              isSelected={selectedCamera === camera?.id}
              onSelect={() => camera && setSelectedCamera(camera.id)}
            />
          );
        })}
      </div>
    </div>
  );
}

function VideoPlayer({ camera, index, isSelected, onSelect }: { 
  camera?: CameraData, 
  index: number,
  isSelected: boolean,
  onSelect: () => void
}) {
  return (
    <div 
      className={cn(
        "relative bg-black border group overflow-hidden flex flex-col",
        isSelected ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/50"
      )}
      onClick={onSelect}
    >
      {/* 视频画面区域 */}
      <div className="flex-1 relative flex items-center justify-center bg-[#0a0a0a]">
        {/* 网格背景 */}
        <div className="absolute inset-0 opacity-10" 
          style={{ 
            backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        ></div>
        
        {/* No Signal 提示 */}
        <div className="flex flex-col items-center gap-2 text-muted-foreground/30 z-10">
          <Video className="h-12 w-12" />
          <span className="font-mono text-lg tracking-widest">NO SIGNAL</span>
        </div>

        {/* 状态覆盖层 */}
        {camera?.status === 'alert' && (
          <div className="absolute inset-0 border-4 border-destructive animate-pulse pointer-events-none z-20">
            <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-0.5 text-xs font-bold animate-bounce">
              ALARM
            </div>
          </div>
        )}

        {/* 悬停控制层 */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-30 backdrop-blur-[1px]">
          <Button variant="secondary" size="icon" className="rounded-full h-10 w-10">
            <Maximize2 className="h-5 w-5" />
          </Button>
          <Button variant="secondary" size="icon" className="rounded-full h-10 w-10">
            <Camera className="h-5 w-5" />
          </Button>
          <Button variant="secondary" size="icon" className="rounded-full h-10 w-10">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* 底部信息栏 */}
      <div className="h-8 bg-card/90 border-t border-border flex items-center justify-between px-2 text-xs">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            !camera ? "bg-muted" :
            camera.status === 'online' ? "bg-primary shadow-[0_0_5px_var(--primary)]" :
            camera.status === 'alert' ? "bg-destructive shadow-[0_0_5px_var(--destructive)] animate-pulse" :
            "bg-muted-foreground"
          )}></div>
          <span className="font-mono font-medium text-foreground/90">
            {camera ? camera.name : `CH-${String(index + 1).padStart(2, '0')}`}
          </span>
        </div>
        
        {camera && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="font-mono text-[10px] opacity-70">REC</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 hover:text-foreground">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>云台控制</DropdownMenuItem>
                <DropdownMenuItem>历史回放</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">强制报警</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
}
