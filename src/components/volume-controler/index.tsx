import React, { memo, useMemo, useRef } from "react";
import ProgressBar from "@/components/progress-bar";
import player from "@/lib/player";
import { useAppSelector } from "@/hooks";

const VolumeControler: React.FC = memo(() => {
  const volume = useAppSelector((state) => state.player.volume);
  const mute = useAppSelector((state) => state.player.mute);

  const icon = useMemo(() => {
    if (mute) {
      return "icon-volume_cross";
    } else if (volume >= 80) {
      return "icon-volume_high";
    } else if (volume >= 40) {
      return "icon-volume-middle";
    } else if (volume > 0) {
      return "icon-volume-low";
    } else {
      return "icon-volume_zero";
    }
  }, [mute, volume]);
  const lastVolume = useRef(volume);
  function handleClick() {
    player.setMute(!mute);
    if (mute) {
      player.setVolume(lastVolume.current);
    } else {
      player.setVolume(0);
      lastVolume.current = volume || 10;
    }
  }
  function handleVolumeInput(percent: number) {
    if (mute) player.setMute(false);
    player.setVolume(percent);
  }
  return (
    <div className="group/volume relative w-5 h-5 flex justify-center items-center">
      <i
        className={`iconfont ${icon} cursor-pointer`}
        onClick={handleClick}
      ></i>
      <div className="hidden group-hover/volume:inline-block p-4 absolute -top-2 left-2/4 -translate-x-1/2 -translate-y-full bg-white shadow-md rounded">
        <div className="h-20">
          <ProgressBar
            percent={volume}
            onInput={handleVolumeInput}
            barWidth="4px"
            pointSize="10px"
            alwaysPoint
            vertical
            round
          />
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-t-[6px] border-x-4 divide-solid border-x-[transparent] border-t-white"></div>
      </div>
    </div>
  );
});

export default VolumeControler;
