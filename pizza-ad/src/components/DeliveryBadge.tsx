import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, COPY, MOTION } from "../config";
import { FONTS } from "../lib/fonts";
import { progress, springAt } from "../lib/motion";
import { ScooterIcon } from "./icons";

/**
 * Yellow pill that slides in from the side; a scooter rides across it and
 * the text is revealed behind the scooter.
 */
export const DeliveryBadge: React.FC<{
  appear?: number;
  frameOffset?: number;
}> = ({ appear, frameOffset = 0 }) => {
  const frame = useCurrentFrame() + frameOffset;
  const { fps } = useVideoConfig();
  const slide =
    appear === undefined ? 1 : springAt(frame, appear, fps, MOTION.punch);
  const ride =
    appear === undefined ? 1 : progress(frame, appear + 3, appear + 17);
  const easedRide = 1 - Math.pow(1 - ride, 3);
  const width = 780;
  const iconSlot = 120;
  const scooterX = interpolate(easedRide, [0, 1], [width - 150, 28]);
  const wheelie = appear === undefined ? 0 : Math.sin(ride * Math.PI) * -10;

  return (
    <div
      style={{
        position: "relative",
        width,
        height: 124,
        borderRadius: 999,
        background: `linear-gradient(180deg, ${COLORS.yellowPrimary}, ${COLORS.yellowGold})`,
        boxShadow: `0 10px 0 #C98700, 0 24px 50px rgba(40,0,6,0.45)`,
        overflow: "hidden",
        translate: `${(1 - slide) * 1000}px 0px`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: iconSlot + 20,
          right: 30,
          top: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONTS.display,
          fontWeight: 800,
          fontSize: 58,
          color: COLORS.ink,
          whiteSpace: "nowrap",
          paddingTop: 6,
          clipPath: `inset(0 ${(1 - easedRide) * 100}% 0 0)`,
        }}
      >
        {COPY.delivery}
      </div>
      <div
        style={{
          position: "absolute",
          left: scooterX,
          top: 22,
          rotate: `${wheelie}deg`,
          transformOrigin: "80% 90%",
        }}
      >
        <ScooterIcon size={104} />
      </div>
    </div>
  );
};
