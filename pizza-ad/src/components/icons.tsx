import React from "react";
import { COLORS } from "../config";

type IconProps = { size: number; color?: string; style?: React.CSSProperties };

export const FireIcon: React.FC<IconProps> = ({ size, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <path
      d="M12 2c1 3.2-.6 5-2 6.6C8.6 10.2 7 12 7 14.6 7 18.2 9.4 21 12 21s5-2.4 5-6c0-2.6-1.4-4.2-2.4-5.2.1 1.6-.5 2.7-1.5 3.2.4-3.6-.6-7.6-1.1-11z"
      fill="#FF7A1A"
    />
    <path
      d="M12 21c-1.8 0-3-1.5-3-3.3 0-1.8 1.2-2.7 2-3.8.6 1.2 1.5 1.6 2.3 1.3-.1 1 .7 1.7.7 2.6C14 19.6 13.6 21 12 21z"
      fill={COLORS.yellowPrimary}
    />
  </svg>
);

export const SadFaceIcon: React.FC<IconProps> = ({ size, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <circle
      cx="12"
      cy="12"
      r="10.5"
      fill={COLORS.yellowPrimary}
      stroke={COLORS.yellowGold}
      strokeWidth="1"
    />
    <circle cx="8.4" cy="10" r="1.4" fill={COLORS.ink} />
    <circle cx="15.6" cy="10" r="1.4" fill={COLORS.ink} />
    <path
      d="M7.8 17c1.2-1.6 2.6-2.3 4.2-2.3s3 .7 4.2 2.3"
      stroke={COLORS.ink}
      strokeWidth="1.6"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M17.4 11.6c.6 1 .9 1.8.9 2.4a1 1 0 0 1-2 0c0-.6.4-1.4 1.1-2.4z"
      fill="#5BC2FF"
    />
  </svg>
);

export const PizzaIcon: React.FC<IconProps> = ({ size, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <path d="M12 22 3 6.5C8.6 3.2 15.4 3.2 21 6.5z" fill="#FFD36B" />
    <path
      d="M3 6.5C8.6 3.2 15.4 3.2 21 6.5l-1.2 2C14.9 5.7 9.1 5.7 4.2 8.5z"
      fill="#D9822B"
    />
    <circle cx="10" cy="10.5" r="1.6" fill={COLORS.redPrimary} />
    <circle cx="14.4" cy="11" r="1.4" fill={COLORS.redPrimary} />
    <circle cx="12" cy="15.5" r="1.3" fill={COLORS.redPrimary} />
    <circle cx="13.8" cy="8.2" r=".6" fill="#3E8E41" />
    <circle cx="9.6" cy="13.6" r=".6" fill="#3E8E41" />
  </svg>
);

export const ScooterIcon: React.FC<IconProps> = ({
  size,
  color = COLORS.ink,
  style,
}) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 32 24" style={style}>
    <rect
      x="2.5"
      y="5"
      width="9"
      height="7.5"
      rx="1.4"
      fill={COLORS.redPrimary}
    />
    <path
      d="M4.5 8.5h5"
      stroke={COLORS.yellowPrimary}
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <path
      d="M3 13.5h12.5l3-6.5h3.5l3 8.5"
      stroke={color}
      strokeWidth="2.2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 5.5h3.5"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <circle
      cx="7"
      cy="18.5"
      r="3.3"
      fill="none"
      stroke={color}
      strokeWidth="2.2"
    />
    <circle
      cx="25"
      cy="18.5"
      r="3.3"
      fill="none"
      stroke={color}
      strokeWidth="2.2"
    />
    <path d="M10.3 18.5h11.4" stroke={color} strokeWidth="2.2" />
  </svg>
);

export const PhoneIcon: React.FC<IconProps> = ({
  size,
  color = COLORS.yellowPrimary,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <path
      d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"
      fill={color}
    />
  </svg>
);

export const PersonIcon: React.FC<IconProps> = ({
  size,
  color = COLORS.cream,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <circle cx="12" cy="9" r="4" fill={color} />
    <path d="M4.5 21c.8-4 3.8-6.2 7.5-6.2s6.7 2.2 7.5 6.2z" fill={color} />
  </svg>
);
