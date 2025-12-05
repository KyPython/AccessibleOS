import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
  size?: number;
};

const makeIcon = (path: React.ReactNode) => {
  return ({ title, size = 24, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : 'presentation'}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {path}
    </svg>
  );
};

export const ChartBar = makeIcon(
  <>
    <rect x="3" y="11" width="4" height="10" />
    <rect x="9" y="6" width="4" height="15" />
    <rect x="15" y="2" width="4" height="19" />
  </>
);

export const CheckCircle = makeIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2 4-4" />
  </>
);

export const Clock = makeIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </>
);

export const AlertTriangle = makeIcon(
  <>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </>
);

export const TrendingUp = makeIcon(
  <>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </>
);

export const Calendar = makeIcon(
  <>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
  </>
);

export const Zap = makeIcon(
  <>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </>
);

export const Menu = makeIcon(
  <>
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </>
);

export const Bell = makeIcon(
  <>
    <path d="M18 8a6 6 0 0 0-12 0v5H4l2 2h12l2-2h-2V8" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </>
);

export const Search = makeIcon(
  <>
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </>
);

export const Sun = makeIcon(
  <>
    <circle cx="12" cy="12" r="4" />
    <g>
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
    </g>
  </>
);

export const Moon = makeIcon(
  <>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </>
);

export const Contrast = makeIcon(
  <>
    <path d="M12 3v18a9 9 0 0 0 0-18z" />
  </>
);

export const Plus = makeIcon(
  <>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </>
);

export const Filter = makeIcon(
  <>
    <polygon points="22 3 2 3 10 12 10 19 14 21 14 12 22 3" />
  </>
);

export const Trophy = makeIcon(
  <>
    <path d="M2 7h4v2a5 5 0 0 0 5 5h2a5 5 0 0 0 5-5V7h4" />
    <path d="M8 21h8" />
  </>
);

export const Target = makeIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </>
);

export const AlertCircle = makeIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </>
);

export const User = makeIcon(
  <>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </>
);

export const Camera = makeIcon(
  <>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </>
);

export const Mail = makeIcon(
  <>
    <path d="M4 4h16v16H4z" />
    <polyline points="22,6 12,13 2,6" />
  </>
);

export const Shield = makeIcon(
  <>
    <path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" />
  </>
);

export const Eye = makeIcon(
  <>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
  </>
);

export const EyeOff = makeIcon(
  <>
    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.86 21.86 0 0 1 5.06-6.94" />
    <path d="M1 1l22 22" />
  </>
);

export const X = makeIcon(
  <>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </>
);

export const Info = makeIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </>
);

export const Play = makeIcon(
  <>
    <polygon points="5 3 19 12 5 21 5 3" />
  </>
);

export const Pause = makeIcon(
  <>
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </>
);

export const LayoutGrid = makeIcon(
  <>
    <rect x="3" y="3" width="8" height="8" />
    <rect x="13" y="3" width="8" height="8" />
    <rect x="3" y="13" width="8" height="8" />
    <rect x="13" y="13" width="8" height="8" />
  </>
);

export const ClipboardList = makeIcon(
  <>
    <path d="M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
    <path d="M9 7h6" />
    <path d="M9 11h6" />
    <path d="M9 15h6" />
  </>
);

export const Settings = makeIcon(
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 2.27 16.88l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82L4.2 3.73A2 2 0 1 1 7 1.9l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V1a2 2 0 1 1 4 0v.09c.2.8.7 1.48 1.5 1.51h.12a1.65 1.65 0 0 0 1.82-.33l.06-.06A2 2 0 1 1 21 4.12l-.06.06a1.65 1.65 0 0 0-.33 1.82V7c.01.7-.3 1.37-1 1.51H21a2 2 0 1 1 0 4h-.09c-.8.2-1.48.7-1.51 1.5v.12c.01.7.3 1.37 1 1.51z" />
  </>
);

export const LogOut = makeIcon(
  <>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </>
);

export default {
  ChartBar,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Zap,
  Menu,
  Bell,
  Search,
  Sun,
  Moon,
  Contrast,
  Plus,
  Filter,
  Trophy,
  Target,
  AlertCircle,
  User,
  Camera,
  Mail,
  Shield,
  Eye,
  EyeOff,
  X,
  Info,
  Play,
  Pause,
};
