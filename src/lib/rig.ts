export interface Point {
  x: number;
  y: number;
}

export const MOUTH_STYLES = ['curve', 'flat', 'smirk', 'open', 'teeth', 'oh', 'kiss', 'tongue'] as const;
export type MouthStyle = typeof MOUTH_STYLES[number];

export interface Accessory {
  id: string;
  emoji: string;
  position: Point;
  scale: number;
  rotation: number;
  flipX: boolean;
}

export interface Config {
  headRadius: number;
  neckWidth: number;
  chestWidth: number;
  hipWidth: number;
  handRadius: number;
  footRadius: number;
  outlineThickness: number;
  smoothLeftArm: boolean;
  smoothRightArm: boolean;
  smoothLeftLeg: boolean;
  smoothRightLeg: boolean;
  eyeSize: number;
  eyeSpacing: number;
  mouthScale: number;
  mouthOffset: number;
  mouthWidth: number;
  mouthStyle: MouthStyle;
  eyebrowOffset: number;
  eyebrowRotation: number;
  eyebrowThickness: number;
  eyelidOpenness: number;
  eyelidCurve: number;
  showEyelidUpper: boolean;
  showEyelidLower: boolean;
  headSquash: number;
  headRotationY: number;
  headRotationX: number;
  headRotationZ: number;
  chestTwist: number;
  hipTwist: number;
  twistFalloff: number;
  roughness: number;
  leftHandRotation: number;
  rightHandRotation: number;
  leftFootRotation: number;
  rightFootRotation: number;
  accessories: Accessory[];
}

export type HiddenControls = Record<string, boolean>;

export interface RigState {
  head: Point;
  chest: Point;
  hip: Point;
  leftElbow: Point;
  leftHand: Point;
  rightElbow: Point;
  rightHand: Point;
  leftKnee: Point;
  leftFoot: Point;
  rightKnee: Point;
  rightFoot: Point;
}

export interface Limb {
  id: 'leftArm' | 'rightArm' | 'leftLeg' | 'rightLeg';
  start: Point;
  joint: Point;
  end: Point;
  radius: number;
  z: number;
}

export const EXPRESSION_PRESETS: Record<string, Partial<Config>> = {
  neutral: { eyeSize: 4, mouthScale: 0.5, mouthOffset: 15, eyebrowOffset: -10, eyebrowRotation: 0, eyebrowThickness: 2, eyelidOpenness: 10, eyelidCurve: 0, mouthWidth: 12, showEyelidUpper: true, showEyelidLower: false, mouthStyle: 'curve' },
  happy: { eyeSize: 4.5, mouthScale: 1.5, mouthOffset: 14, eyebrowOffset: -12, eyebrowRotation: -10, eyebrowThickness: 2, eyelidOpenness: 9, eyelidCurve: -1.5, mouthWidth: 16, showEyelidUpper: true, showEyelidLower: true, mouthStyle: 'curve' },
  sad: { eyeSize: 3.5, mouthScale: -1.2, mouthOffset: 18, eyebrowOffset: -9, eyebrowRotation: 15, eyebrowThickness: 2, eyelidOpenness: 9, eyelidCurve: 1, mouthWidth: 10, showEyelidUpper: true, showEyelidLower: false, mouthStyle: 'curve' },
  angry: { eyeSize: 3, mouthScale: -0.5, mouthOffset: 16, eyebrowOffset: -6, eyebrowRotation: -25, eyebrowThickness: 3, eyelidOpenness: 7, eyelidCurve: -0.5, mouthWidth: 14, showEyelidUpper: true, showEyelidLower: true, mouthStyle: 'flat' },
  surprised: { eyeSize: 6, mouthScale: 1.8, mouthOffset: 18, eyebrowOffset: -15, eyebrowRotation: 5, eyebrowThickness: 2, eyelidOpenness: 14, eyelidCurve: 0, mouthWidth: 8, showEyelidUpper: false, showEyelidLower: false, mouthStyle: 'oh' },
  confused: { eyeSize: 4, mouthScale: -0.2, mouthOffset: 16, eyebrowOffset: -10, eyebrowRotation: -10, eyebrowThickness: 2, eyelidOpenness: 9, eyelidCurve: 0, mouthWidth: 10, showEyelidUpper: true, showEyelidLower: false, mouthStyle: 'smirk' },
  excited: { eyeSize: 5, mouthScale: 2, mouthOffset: 13, eyebrowOffset: -13, eyebrowRotation: -5, eyebrowThickness: 2.5, eyelidOpenness: 12, eyelidCurve: -0.5, mouthWidth: 18, showEyelidUpper: true, showEyelidLower: true, mouthStyle: 'teeth' },
  scared: { eyeSize: 5, mouthScale: -1, mouthOffset: 17, eyebrowOffset: -14, eyebrowRotation: 10, eyebrowThickness: 1.5, eyelidOpenness: 12, eyelidCurve: 0, mouthWidth: 14, showEyelidUpper: false, showEyelidLower: false, mouthStyle: 'open' },
  disgusted: { eyeSize: 3, mouthScale: -0.8, mouthOffset: 15, eyebrowOffset: -7, eyebrowRotation: 20, eyebrowThickness: 2.5, eyelidOpenness: 5, eyelidCurve: 0.5, mouthWidth: 10, showEyelidUpper: true, showEyelidLower: true, mouthStyle: 'curve' },
  tired: { eyeSize: 3, mouthScale: -0.2, mouthOffset: 17, eyebrowOffset: -8, eyebrowRotation: 0, eyebrowThickness: 2, eyelidOpenness: 4, eyelidCurve: 1.5, mouthWidth: 12, showEyelidUpper: true, showEyelidLower: true, mouthStyle: 'flat' },
  relaxed: { eyeSize: 3.5, mouthScale: 0.8, mouthOffset: 16, eyebrowOffset: -9, eyebrowRotation: 0, eyebrowThickness: 2, eyelidOpenness: 6, eyelidCurve: 0, mouthWidth: 14, showEyelidUpper: true, showEyelidLower: false, mouthStyle: 'curve' },
  sly: { eyeSize: 3.5, mouthScale: 0.8, mouthOffset: 15, eyebrowOffset: -8, eyebrowRotation: -15, eyebrowThickness: 2.5, eyelidOpenness: 6, eyelidCurve: -1, mouthWidth: 15, showEyelidUpper: true, showEyelidLower: true, mouthStyle: 'smirk' },
  suspicious: { eyeSize: 2.5, mouthScale: -0.2, mouthOffset: 16, eyebrowOffset: -7, eyebrowRotation: 5, eyebrowThickness: 2, eyelidOpenness: 4, eyelidCurve: 0.5, mouthWidth: 12, showEyelidUpper: true, showEyelidLower: true, mouthStyle: 'flat' },
  determined: { eyeSize: 4, mouthScale: 0.1, mouthOffset: 15, eyebrowOffset: -7, eyebrowRotation: -20, eyebrowThickness: 3, eyelidOpenness: 8, eyelidCurve: 0, mouthWidth: 14, showEyelidUpper: true, showEyelidLower: false, mouthStyle: 'flat' },
  worried: { eyeSize: 4.5, mouthScale: -0.8, mouthOffset: 17, eyebrowOffset: -12, eyebrowRotation: 20, eyebrowThickness: 2, eyelidOpenness: 10, eyelidCurve: 0.5, mouthWidth: 12, showEyelidUpper: true, showEyelidLower: false, mouthStyle: 'curve' },
  dizzy: { eyeSize: 3, mouthScale: 0.5, mouthOffset: 17, eyebrowOffset: -10, eyebrowRotation: 5, eyebrowThickness: 2, eyelidOpenness: 7, eyelidCurve: 0, mouthWidth: 12, showEyelidUpper: false, showEyelidLower: true, mouthStyle: 'tongue' },
  cheeky: { eyeSize: 4, mouthScale: 1.2, mouthOffset: 14, eyebrowOffset: -11, eyebrowRotation: -5, eyebrowThickness: 2, eyelidOpenness: 9, eyelidCurve: -0.5, mouthWidth: 14, showEyelidUpper: true, showEyelidLower: true, mouthStyle: 'tongue' },
  sleepy: { eyeSize: 2, mouthScale: 0.2, mouthOffset: 17, eyebrowOffset: -8, eyebrowRotation: 0, eyebrowThickness: 2, eyelidOpenness: 2, eyelidCurve: 1.5, mouthWidth: 10, showEyelidUpper: true, showEyelidLower: true, mouthStyle: 'oh' },
  focused: { eyeSize: 3.5, mouthScale: 0, mouthOffset: 15, eyebrowOffset: -8, eyebrowRotation: -10, eyebrowThickness: 2.5, eyelidOpenness: 6, eyelidCurve: 0, mouthWidth: 10, showEyelidUpper: true, showEyelidLower: false, mouthStyle: 'flat' },
  crying: { eyeSize: 4, mouthScale: -1.5, mouthOffset: 18, eyebrowOffset: -10, eyebrowRotation: 15, eyebrowThickness: 2, eyelidOpenness: 10, eyelidCurve: 0.5, mouthWidth: 16, showEyelidUpper: true, showEyelidLower: true, mouthStyle: 'open' },
  kissy: { eyeSize: 3, mouthScale: 0, mouthOffset: 16, eyebrowOffset: -11, eyebrowRotation: -5, eyebrowThickness: 2, eyelidOpenness: 5, eyelidCurve: -1, mouthWidth: 10, showEyelidUpper: true, showEyelidLower: true, mouthStyle: 'kiss' },
  smug: { eyeSize: 3.5, mouthScale: 0.4, mouthOffset: 15, eyebrowOffset: -10, eyebrowRotation: -8, eyebrowThickness: 2.5, eyelidOpenness: 6, eyelidCurve: -0.5, mouthWidth: 14, showEyelidUpper: true, showEyelidLower: true, mouthStyle: 'smirk' },
  laughing: { eyeSize: 4, mouthScale: 2, mouthOffset: 13, eyebrowOffset: -13, eyebrowRotation: -8, eyebrowThickness: 2.5, eyelidOpenness: 4, eyelidCurve: -2, mouthWidth: 20, showEyelidUpper: true, showEyelidLower: true, mouthStyle: 'teeth' },
  shocked: { eyeSize: 6.5, mouthScale: 1.5, mouthOffset: 18, eyebrowOffset: -16, eyebrowRotation: 8, eyebrowThickness: 2, eyelidOpenness: 14, eyelidCurve: 0, mouthWidth: 12, showEyelidUpper: false, showEyelidLower: false, mouthStyle: 'open' }
};

export type PoseRot = Pick<Config,
  'chestTwist' | 'hipTwist' | 'twistFalloff' |
  'headRotationX' | 'headRotationY' | 'headRotationZ' |
  'leftHandRotation' | 'rightHandRotation' | 'leftFootRotation' | 'rightFootRotation'
>;

export interface PosePreset {
  rig: RigState;
  config: PoseRot;
}

export const POSE_PRESET_KEYS: ReadonlyArray<keyof PoseRot> = [
  'chestTwist', 'hipTwist', 'twistFalloff',
  'headRotationX', 'headRotationY', 'headRotationZ',
  'leftHandRotation', 'rightHandRotation', 'leftFootRotation', 'rightFootRotation',
];

export const POSE_PRESETS: Record<string, PosePreset> = {
  standing: {
    rig: {
      head: { x: 400, y: 200 }, chest: { x: 400, y: 320 }, hip: { x: 400, y: 420 },
      leftElbow: { x: 320, y: 340 }, leftHand: { x: 280, y: 390 },
      rightElbow: { x: 480, y: 340 }, rightHand: { x: 520, y: 390 },
      leftKnee: { x: 350, y: 490 }, leftFoot: { x: 330, y: 570 },
      rightKnee: { x: 450, y: 490 }, rightFoot: { x: 470, y: 570 },
    },
    config: {
      chestTwist: 0, hipTwist: 0, twistFalloff: 0.5,
      headRotationX: 0, headRotationY: 0, headRotationZ: 0,
      leftHandRotation: 0, rightHandRotation: 0, leftFootRotation: 0, rightFootRotation: 0,
    },
  },
  tpose: {
    rig: {
      head: { x: 400, y: 200 }, chest: { x: 400, y: 320 }, hip: { x: 400, y: 420 },
      leftElbow: { x: 300, y: 320 }, leftHand: { x: 200, y: 320 },
      rightElbow: { x: 500, y: 320 }, rightHand: { x: 600, y: 320 },
      leftKnee: { x: 380, y: 500 }, leftFoot: { x: 370, y: 590 },
      rightKnee: { x: 420, y: 500 }, rightFoot: { x: 430, y: 590 },
    },
    config: {
      chestTwist: 0, hipTwist: 0, twistFalloff: 0.5,
      headRotationX: 0, headRotationY: 0, headRotationZ: 0,
      leftHandRotation: 0, rightHandRotation: 0, leftFootRotation: -90, rightFootRotation: 90,
    },
  },
  sitting: {
    rig: {
      head: { x: 400, y: 220 }, chest: { x: 400, y: 340 }, hip: { x: 400, y: 440 },
      leftElbow: { x: 340, y: 380 }, leftHand: { x: 340, y: 450 },
      rightElbow: { x: 460, y: 380 }, rightHand: { x: 460, y: 450 },
      leftKnee: { x: 320, y: 460 }, leftFoot: { x: 320, y: 580 },
      rightKnee: { x: 480, y: 460 }, rightFoot: { x: 480, y: 580 },
    },
    config: {
      chestTwist: 0, hipTwist: 0, twistFalloff: 0.5,
      headRotationX: 0, headRotationY: 0, headRotationZ: 0,
      leftHandRotation: 0, rightHandRotation: 0, leftFootRotation: 0, rightFootRotation: 0,
    },
  },
  running: {
    rig: {
      head: { x: 430, y: 215 }, chest: { x: 415, y: 330 }, hip: { x: 318.82, y: 413.10 },
      leftElbow: { x: 294.36, y: 289.22 }, leftHand: { x: 203.23, y: 359.04 },
      rightElbow: { x: 499.83, y: 278.86 }, rightHand: { x: 555.56, y: 270.61 },
      leftKnee: { x: 509.22, y: 408.25 }, leftFoot: { x: 426.57, y: 486.37 },
      rightKnee: { x: 284.03, y: 497.53 }, rightFoot: { x: 92.88, y: 568.45 },
    },
    config: {
      chestTwist: -82, hipTwist: -90, twistFalloff: 0.5,
      headRotationX: -6, headRotationY: 58, headRotationZ: -21,
      leftHandRotation: -78, rightHandRotation: 175,
      leftFootRotation: -174, rightFootRotation: 44,
    },
  },
  waving: {
    rig: {
      head: { x: 400, y: 200 }, chest: { x: 400, y: 320 }, hip: { x: 400, y: 420 },
      leftElbow: { x: 340, y: 240 }, leftHand: { x: 320, y: 150 },
      rightElbow: { x: 480, y: 340 }, rightHand: { x: 520, y: 390 },
      leftKnee: { x: 350, y: 490 }, leftFoot: { x: 330, y: 570 },
      rightKnee: { x: 450, y: 490 }, rightFoot: { x: 470, y: 570 },
    },
    config: {
      chestTwist: 10, hipTwist: 0, twistFalloff: 0.5,
      headRotationX: -5, headRotationY: 15, headRotationZ: 0,
      leftHandRotation: -30, rightHandRotation: 0, leftFootRotation: 0, rightFootRotation: 0,
    },
  },
  jumping: {
    rig: {
      head: { x: 400, y: 170 }, chest: { x: 400, y: 290 }, hip: { x: 400, y: 390 },
      leftElbow: { x: 340, y: 220 }, leftHand: { x: 305, y: 130 },
      rightElbow: { x: 460, y: 220 }, rightHand: { x: 495, y: 130 },
      leftKnee: { x: 345, y: 405 }, leftFoot: { x: 380, y: 480 },
      rightKnee: { x: 455, y: 405 }, rightFoot: { x: 420, y: 480 },
    },
    config: {
      chestTwist: 0, hipTwist: 0, twistFalloff: 0.5,
      headRotationX: 10, headRotationY: 0, headRotationZ: 0,
      leftHandRotation: 0, rightHandRotation: 0, leftFootRotation: 90, rightFootRotation: -90,
    },
  },
  thinker: {
    rig: {
      head: { x: 405, y: 210 }, chest: { x: 400, y: 330 }, hip: { x: 400, y: 430 },
      leftElbow: { x: 360, y: 360 }, leftHand: { x: 340, y: 420 },
      rightElbow: { x: 430, y: 280 }, rightHand: { x: 405, y: 230 },
      leftKnee: { x: 360, y: 500 }, leftFoot: { x: 340, y: 580 },
      rightKnee: { x: 440, y: 500 }, rightFoot: { x: 460, y: 580 },
    },
    config: {
      chestTwist: -10, hipTwist: 0, twistFalloff: 0.5,
      headRotationX: -15, headRotationY: -10, headRotationZ: -8,
      leftHandRotation: 30, rightHandRotation: -60, leftFootRotation: 0, rightFootRotation: 0,
    },
  },
  cheer: {
    rig: {
      head: { x: 400, y: 200 }, chest: { x: 400, y: 320 }, hip: { x: 400, y: 420 },
      leftElbow: { x: 350, y: 250 }, leftHand: { x: 310, y: 160 },
      rightElbow: { x: 450, y: 250 }, rightHand: { x: 490, y: 160 },
      leftKnee: { x: 350, y: 490 }, leftFoot: { x: 330, y: 570 },
      rightKnee: { x: 450, y: 490 }, rightFoot: { x: 470, y: 570 },
    },
    config: {
      chestTwist: 0, hipTwist: 0, twistFalloff: 0.5,
      headRotationX: 8, headRotationY: 0, headRotationZ: 0,
      leftHandRotation: 0, rightHandRotation: 0, leftFootRotation: 0, rightFootRotation: 0,
    },
  },
};

type BodyGeom = Pick<Config, 'headRadius' | 'neckWidth' | 'chestWidth' | 'hipWidth' | 'handRadius' | 'footRadius' | 'headSquash'>;

export const BODY_TYPE_PRESETS: Record<string, BodyGeom> = {
  default:   { headRadius: 80,  neckWidth: 35, chestWidth: 75,  hipWidth: 80,  handRadius: 15, footRadius: 15, headSquash: 0.2 },
  chubby:    { headRadius: 85,  neckWidth: 50, chestWidth: 105, hipWidth: 115, handRadius: 18, footRadius: 18, headSquash: 0.1 },
  skinny:    { headRadius: 70,  neckWidth: 22, chestWidth: 45,  hipWidth: 50,  handRadius: 11, footRadius: 12, headSquash: 0.3 },
  muscular:  { headRadius: 75,  neckWidth: 48, chestWidth: 115, hipWidth: 80,  handRadius: 19, footRadius: 18, headSquash: 0.15 },
  pear:      { headRadius: 75,  neckWidth: 28, chestWidth: 55,  hipWidth: 105, handRadius: 13, footRadius: 16, headSquash: 0.2 },
  bigHead:   { headRadius: 130, neckWidth: 30, chestWidth: 65,  hipWidth: 70,  handRadius: 14, footRadius: 14, headSquash: 0.1 },
  chibi:     { headRadius: 140, neckWidth: 45, chestWidth: 85,  hipWidth: 90,  handRadius: 18, footRadius: 18, headSquash: -0.05 },
  giant:     { headRadius: 110, neckWidth: 55, chestWidth: 110, hipWidth: 115, handRadius: 22, footRadius: 22, headSquash: 0.2 },
};

export const DEFAULT_CONFIG: Config = {
  headRadius: 80, neckWidth: 35, chestWidth: 75, hipWidth: 80, handRadius: 15, footRadius: 15,
  outlineThickness: 1, smoothLeftArm: true, smoothRightArm: true, smoothLeftLeg: true, smoothRightLeg: true,
  eyeSize: 4, eyeSpacing: 25, mouthScale: 1, mouthOffset: 15, mouthWidth: 12, mouthStyle: 'curve',
  eyebrowOffset: -10, eyebrowRotation: 0, eyebrowThickness: 2,
  eyelidOpenness: 10, eyelidCurve: 0,
  showEyelidUpper: false, showEyelidLower: false,
  headSquash: 0.2, headRotationY: 0, headRotationX: 0, headRotationZ: 0,
  chestTwist: 0, hipTwist: 0, twistFalloff: 0.5,
  roughness: 1,
  leftHandRotation: 0, rightHandRotation: 0, leftFootRotation: 0, rightFootRotation: 0,
  accessories: [],
};

export const DEFAULT_HIDDEN_CONTROLS: HiddenControls = {
  head: false, core: false, arm: false, hand: false, leg: false, feet: false, accessories: false,
};

export const DEFAULT_RIG: RigState = {
  head: { x: 400, y: 200 },
  chest: { x: 400, y: 320 },
  hip: { x: 400, y: 420 },
  leftElbow: { x: 320, y: 340 }, leftHand: { x: 280, y: 390 },
  rightElbow: { x: 480, y: 340 }, rightHand: { x: 520, y: 390 },
  leftKnee: { x: 350, y: 490 }, leftFoot: { x: 330, y: 570 },
  rightKnee: { x: 450, y: 490 }, rightFoot: { x: 470, y: 570 },
};

export const CHEST_BOTTOM_T = 0.55;
export const HIP_TOP_T = 0.75;
const SHOULDER_T = 0.3;
const HIP_ATTACH_T = 0.95;
const UPPER_CHEST_T = 0.3;

export function loadSaved<T>(key: string, defaults: T): T {
  try { return { ...defaults, ...JSON.parse(localStorage.getItem(key) || 'null') }; } catch { return defaults; }
}

export function getBezierPoint(t: number, p0: Point, p1: Point, p2: Point): Point {
  const mt = 1 - t;
  return {
    x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
    y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y
  };
}

export function getBezierDerivative(t: number, p0: Point, p1: Point, p2: Point): Point {
  const mt = 1 - t;
  return {
    x: 2 * mt * (p1.x - p0.x) + 2 * t * (p2.x - p1.x),
    y: 2 * mt * (p1.y - p0.y) + 2 * t * (p2.y - p1.y)
  };
}

export function getBezierNormal(t: number, p0: Point, p1: Point, p2: Point): Point {
  const d = getBezierDerivative(t, p0, p1, p2);
  const len = Math.hypot(d.x, d.y) || 1;
  return { x: -d.y / len, y: d.x / len };
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function getWidthAt(t: number, config: Config): number {
  const w0 = config.neckWidth;
  const w1 = config.chestWidth;
  const w2 = config.hipWidth;
  const mt = 1 - t;
  return mt * mt * w0 + 2 * mt * t * w1 + t * t * w2;
}

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

export function getInnerTwists(config: Config): { lowerChest: number; upperHip: number } {
  const f = clamp01(config.twistFalloff);
  return {
    lowerChest: config.chestTwist * (1 - f),
    upperHip: config.hipTwist * (1 - f),
  };
}

export function getTwistAt(t: number, config: Config): number {
  const { lowerChest, upperHip } = getInnerTwists(config);
  if (t <= CHEST_BOTTOM_T) {
    const k = CHEST_BOTTOM_T > 0 ? t / CHEST_BOTTOM_T : 1;
    return lerp(config.chestTwist, lowerChest, k);
  }
  if (t >= HIP_TOP_T) {
    const denom = 1 - HIP_TOP_T;
    const k = denom > 0 ? (t - HIP_TOP_T) / denom : 0;
    return lerp(upperHip, config.hipTwist, k);
  }
  const k = (t - CHEST_BOTTOM_T) / (HIP_TOP_T - CHEST_BOTTOM_T);
  return lerp(lowerChest, upperHip, k);
}

export function getPointOnTorso(
  rig: RigState,
  t: number,
  width: number,
  angleDeg: number,
  twistDeg: number
): { point: Point; z: number } {
  const normal = getBezierNormal(t, rig.head, rig.chest, rig.hip);
  const R = width / 2;
  const rad = (angleDeg + twistDeg) * Math.PI / 180;
  const xOffset = R * Math.sin(rad);
  const zOffset = R * Math.cos(rad);
  const spine = getBezierPoint(t, rig.head, rig.chest, rig.hip);
  return {
    point: { x: spine.x + normal.x * xOffset, y: spine.y + normal.y * xOffset },
    z: zOffset
  };
}

export function getLimbPath(start: Point, joint: Point, end: Point, smooth: boolean): string {
  if (!smooth) {
    return `M ${start.x} ${start.y} L ${joint.x} ${joint.y} L ${end.x} ${end.y}`;
  }
  const p1x = 2 * joint.x - 0.5 * start.x - 0.5 * end.x;
  const p1y = 2 * joint.y - 0.5 * start.y - 0.5 * end.y;
  return `M ${start.x} ${start.y} Q ${p1x} ${p1y} ${end.x} ${end.y}`;
}

export interface ShoulderHip {
  leftShoulder: { point: Point; z: number };
  rightShoulder: { point: Point; z: number };
  leftHip: { point: Point; z: number };
  rightHip: { point: Point; z: number };
}

export function computeShouldersHips(rig: RigState, config: Config): ShoulderHip {
  const sWidth = Math.max(1, getWidthAt(SHOULDER_T, config) * 0.95);
  const hWidth = Math.max(1, getWidthAt(HIP_ATTACH_T, config));
  const rightShoulder = getPointOnTorso(rig, SHOULDER_T, sWidth, -90, config.chestTwist);
  const leftShoulder = getPointOnTorso(rig, SHOULDER_T, sWidth, 90, config.chestTwist);
  const rightHip = getPointOnTorso(rig, HIP_ATTACH_T, hWidth, -90, config.hipTwist);
  const leftHip = getPointOnTorso(rig, HIP_ATTACH_T, hWidth, 90, config.hipTwist);

  leftShoulder.z -= 0.001;
  leftHip.z -= 0.001;
  rightShoulder.z += 0.001;
  rightHip.z += 0.001;

  return { leftShoulder, rightShoulder, leftHip, rightHip };
}

export function computeLimbs(rig: RigState, config: Config, sh: ShoulderHip): Limb[] {
  return [
    { id: 'leftArm', start: sh.leftShoulder.point, joint: rig.leftElbow, end: rig.leftHand, radius: config.handRadius, z: sh.leftShoulder.z },
    { id: 'rightArm', start: sh.rightShoulder.point, joint: rig.rightElbow, end: rig.rightHand, radius: config.handRadius, z: sh.rightShoulder.z },
    { id: 'leftLeg', start: sh.leftHip.point, joint: rig.leftKnee, end: rig.leftFoot, radius: config.footRadius, z: sh.leftHip.z },
    { id: 'rightLeg', start: sh.rightHip.point, joint: rig.rightKnee, end: rig.rightFoot, radius: config.footRadius, z: sh.rightHip.z },
  ];
}

export function getBodyPath(rig: RigState, config: Config): string {
  const n0 = getBezierNormal(0, rig.head, rig.chest, rig.hip);
  const n1 = getBezierNormal(0.5, rig.head, rig.chest, rig.hip);
  const n2 = getBezierNormal(1, rig.head, rig.chest, rig.hip);

  const w0 = Math.max(1, config.neckWidth / 2);
  const w1 = Math.max(1, config.chestWidth / 2);
  const w2 = Math.max(1, config.hipWidth / 2);

  const l0 = { x: rig.head.x + n0.x * w0, y: rig.head.y + n0.y * w0 };
  const r0 = { x: rig.head.x - n0.x * w0, y: rig.head.y - n0.y * w0 };

  const leftControl = { x: rig.chest.x + n1.x * w1, y: rig.chest.y + n1.y * w1 };
  const rightControl = { x: rig.chest.x - n1.x * w1, y: rig.chest.y - n1.y * w1 };

  const l2 = { x: rig.hip.x + n2.x * w2, y: rig.hip.y + n2.y * w2 };
  const r2 = { x: rig.hip.x - n2.x * w2, y: rig.hip.y - n2.y * w2 };

  return `
    M ${l0.x} ${l0.y}
    Q ${leftControl.x} ${leftControl.y} ${l2.x} ${l2.y}
    A ${w2} ${w2} 0 0 0 ${r2.x} ${r2.y}
    Q ${rightControl.x} ${rightControl.y} ${r0.x} ${r0.y}
    A ${w0} ${w0} 0 0 0 ${l0.x} ${l0.y}
    Z
  `;
}

export interface CrossSection {
  id: 'upperChest' | 'lowerChest' | 'upperHip' | 'lowerHip';
  center: Point;
  normal: Point;
  tangent: Point;
  radius: number;
  twistDeg: number;
  section: 'chest' | 'hip';
}

export function computeCrossSections(rig: RigState, config: Config): CrossSection[] {
  const { lowerChest, upperHip } = getInnerTwists(config);
  const specs: Array<{ id: CrossSection['id']; t: number; twist: number; section: 'chest' | 'hip' }> = [
    { id: 'upperChest', t: UPPER_CHEST_T, twist: config.chestTwist, section: 'chest' },
    { id: 'lowerChest', t: CHEST_BOTTOM_T, twist: lowerChest, section: 'chest' },
    { id: 'upperHip', t: HIP_TOP_T, twist: upperHip, section: 'hip' },
    { id: 'lowerHip', t: HIP_ATTACH_T, twist: config.hipTwist, section: 'hip' },
  ];
  return specs.map(({ id, t, twist, section }) => {
    const center = getBezierPoint(t, rig.head, rig.chest, rig.hip);
    const normal = getBezierNormal(t, rig.head, rig.chest, rig.hip);
    const d = getBezierDerivative(t, rig.head, rig.chest, rig.hip);
    const len = Math.hypot(d.x, d.y) || 1;
    const tangent = { x: d.x / len, y: d.y / len };
    const radius = getWidthAt(t, config) / 2;
    return { id, center, normal, tangent, radius, twistDeg: twist, section };
  });
}

export interface SeamPath {
  id: 'left' | 'right';
  front: string;
  back: string;
}

interface SeamSample { x: number; y: number; z: number; }

function splitSeamByZ(samples: SeamSample[]): { front: string; back: string } {
  const frontParts: string[] = [];
  const backParts: string[] = [];
  let frontBuf: string[] = [];
  let backBuf: string[] = [];
  const flushFront = () => { if (frontBuf.length > 1) frontParts.push('M ' + frontBuf.join(' L ')); frontBuf = []; };
  const flushBack = () => { if (backBuf.length > 1) backParts.push('M ' + backBuf.join(' L ')); backBuf = []; };
  const fmt = (x: number, y: number) => `${x.toFixed(2)} ${y.toFixed(2)}`;

  for (let i = 0; i < samples.length; i++) {
    const p = samples[i];
    const prev = i > 0 ? samples[i - 1] : null;
    if (prev && (prev.z >= 0) !== (p.z >= 0)) {
      const k = prev.z / (prev.z - p.z);
      const cx = lerp(prev.x, p.x, k);
      const cy = lerp(prev.y, p.y, k);
      const crossStr = fmt(cx, cy);
      if (prev.z >= 0) {
        frontBuf.push(crossStr);
        flushFront();
        backBuf.push(crossStr);
      } else {
        backBuf.push(crossStr);
        flushBack();
        frontBuf.push(crossStr);
      }
    }
    if (p.z >= 0) frontBuf.push(fmt(p.x, p.y));
    else backBuf.push(fmt(p.x, p.y));
  }
  flushFront();
  flushBack();
  return { front: frontParts.join(' '), back: backParts.join(' ') };
}

export function computeTorsoSeams(rig: RigState, config: Config): SeamPath[] {
  const N = 40;
  const seams: Array<{ id: 'left' | 'right'; angle: number }> = [
    { id: 'left', angle: 90 },
    { id: 'right', angle: -90 },
  ];
  return seams.map(({ id, angle }) => {
    const samples: SeamSample[] = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const spine = getBezierPoint(t, rig.head, rig.chest, rig.hip);
      const normal = getBezierNormal(t, rig.head, rig.chest, rig.hip);
      const R = getWidthAt(t, config) / 2;
      const tw = getTwistAt(t, config);
      const rad = (angle + tw) * Math.PI / 180;
      samples.push({
        x: spine.x + R * Math.sin(rad) * normal.x,
        y: spine.y + R * Math.sin(rad) * normal.y,
        z: R * Math.cos(rad),
      });
    }
    return { id, ...splitSeamByZ(samples) };
  });
}

export interface LimbTransform {
  pathD: string;
  transform: string;
  isSmooth: boolean;
}

function handShape(r: number): string {
  const rx = r * 1.1;
  const ry = r * 0.85;
  return `M 0 0 A ${rx} ${ry} 0 0 1 ${2 * rx} 0 A ${rx} ${ry} 0 0 1 0 0 Z`;
}

function footShape(r: number, dir: 1 | -1): string {
  const toe = r * 1.5;
  const heel = r * 0.5;
  const rx = (toe + heel) / 2;
  const ry = r * 0.7;
  const heelX = -dir * heel;
  const toeX = dir * toe;
  return `M ${heelX} 0 A ${rx} ${ry} 0 0 1 ${toeX} 0 A ${rx} ${ry} 0 0 1 ${heelX} 0 Z`;
}

export function computeLimbTransform(limb: Limb, rig: RigState, config: Config): LimbTransform {
  const isLeg = limb.id.toLowerCase().includes('leg');
  const r = limb.radius;
  let transformStr = '';
  let pathD = '';

  if (isLeg) {
    const direction: 1 | -1 = limb.id === 'leftLeg' ? -1 : 1;
    const manualRot = limb.id === 'leftLeg' ? config.leftFootRotation : config.rightFootRotation;
    transformStr = `translate(${limb.end.x}, ${limb.end.y}) rotate(${manualRot})`;
    pathD = footShape(r, direction);
  } else {
    const dx = limb.end.x - rig.chest.x;
    const dy = limb.end.y - rig.chest.y;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const manualRot = limb.id === 'leftArm' ? config.leftHandRotation : config.rightHandRotation;
    transformStr = `translate(${limb.end.x}, ${limb.end.y}) rotate(${angle + manualRot})`;
    pathD = handShape(r);
  }

  const isSmooth =
    limb.id === 'leftArm' ? config.smoothLeftArm :
    limb.id === 'rightArm' ? config.smoothRightArm :
    limb.id === 'leftLeg' ? config.smoothLeftLeg :
    config.smoothRightLeg;

  return { pathD, transform: transformStr, isSmooth };
}

export interface Projection {
  x: number;
  y: number;
  z: number;
  visible: boolean;
}

export function project3DFace(
  xLocal: number,
  yLocal: number,
  rx: number,
  ry: number,
  rz: number,
  yawRad: number,
  pitchRad: number,
): Projection {
  const sx = Math.max(-0.9999, Math.min(0.9999, xLocal / Math.max(rx, 0.001)));
  const sy = Math.max(-0.9999, Math.min(0.9999, yLocal / Math.max(ry, 0.001)));
  const theta = Math.asin(sx);
  const phi = Math.asin(sy);
  const cosPhi = Math.cos(phi);
  const x0 = rx * Math.sin(theta) * cosPhi;
  const y0 = ry * Math.sin(phi);
  const z0 = rz * Math.cos(theta) * cosPhi;
  const cY = Math.cos(yawRad), sY = Math.sin(yawRad);
  const xY = x0 * cY + z0 * sY;
  const zY = -x0 * sY + z0 * cY;
  const cX = Math.cos(pitchRad), sX = Math.sin(pitchRad);
  const yP = y0 * cX - zY * sX;
  const zP = y0 * sX + zY * cX;
  return { x: xY, y: yP, z: zP, visible: zP >= 0 };
}

export function samplePath3D(
  samples: Point[],
  rx: number, ry: number, rz: number,
  yawRad: number, pitchRad: number,
): string {
  if (samples.length === 0) return '';
  let path = '';
  let started = false;
  for (const s of samples) {
    const p = project3DFace(s.x, s.y, rx, ry, rz, yawRad, pitchRad);
    if (p.visible) {
      path += (started ? ' L ' : 'M ') + `${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
      started = true;
    } else {
      started = false;
    }
  }
  return path;
}

export interface HeadGeometry {
  rx: number;
  ry: number;
  rz: number;
  rxView: number;
  ryView: number;
}

export function computeHeadGeometry(config: Config, yawRad: number, pitchRad: number): HeadGeometry {
  const rx = config.headRadius * (1 + 0.3 * config.headSquash);
  const ry = config.headRadius * (1 - 0.5 * config.headSquash);
  const rz = config.headRadius;
  const rxView = Math.sqrt(rx * rx * Math.cos(yawRad) ** 2 + rz * rz * Math.sin(yawRad) ** 2);
  const ryView = Math.sqrt(ry * ry * Math.cos(pitchRad) ** 2 + rz * rz * Math.sin(pitchRad) ** 2);
  return { rx, ry, rz, rxView, ryView };
}

export function computeHeadBaseRoll(rig: RigState): number {
  const dx = rig.chest.x - rig.head.x;
  const dy = rig.chest.y - rig.head.y;
  if (Math.hypot(dx, dy) < 0.001) return 0;
  return -Math.atan2(dx, dy) * 180 / Math.PI;
}

export interface MouthPart { d: string; filled: boolean; }

export interface FacePaths {
  leftEye: Projection;
  rightEye: Projection;
  leftBrow: string;
  rightBrow: string;
  leftUpperLid: string;
  rightUpperLid: string;
  leftLowerLid: string;
  rightLowerLid: string;
  leftEyeClip: string;
  rightEyeClip: string;
  mouth: MouthPart[];
  leftGlabella: string;
  rightGlabella: string;
  glabellaOvershoot: number;
}

const EYEBROW_ANGRY_THRESHOLD = -10;

function eyebrowSamples(side: 1 | -1, cfg: Config, rotDeg: number, overshoot: number): Point[] {
  const cx = side * cfg.eyeSpacing;
  const cy = cfg.eyebrowOffset;
  const localRotDeg = side === -1 ? -rotDeg : rotDeg;
  const r = localRotDeg * Math.PI / 180;
  const cR = Math.cos(r), sR = Math.sin(r);
  const halfLen = cfg.eyeSize * 2.6;
  const tiltGain = 1.8;
  const N = 12;
  const pts: Point[] = [];
  for (let i = 0; i <= N; i++) {
    const k = (i / N) * 2 - 1;
    const lx = halfLen * k;
    pts.push({ x: cx + lx * cR, y: cy + lx * sR * tiltGain });
  }
  if (overshoot > 0) {
    const innerSign = side === -1 ? 1 : -1;
    const extras: Point[] = [
      { x: innerSign * (halfLen + 2), y: -2 },
      { x: innerSign * (halfLen + 4), y: 2 },
    ];
    for (const e of extras) {
      pts.push({ x: cx + e.x * cR - e.y * sR, y: cy + e.x * sR + e.y * cR });
    }
  }
  return pts;
}

function eyelidSamples(side: 1 | -1, cfg: Config, isUpper: boolean): Point[] {
  const cx = side * cfg.eyeSpacing;
  const halfO = cfg.eyelidOpenness / 2;
  const cy = isUpper ? -halfO : halfO;
  const curve = cfg.eyelidCurve;
  const halfW = cfg.eyeSize * (isUpper ? 1.5 : 1.2);
  const x0 = cx - halfW, y0 = cy;
  const x1 = cx, y1 = cy + curve;
  const x2 = cx + halfW, y2 = cy;
  const N = 10;
  const pts: Point[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N, mt = 1 - t;
    pts.push({ x: mt*mt*x0 + 2*mt*t*x1 + t*t*x2, y: mt*mt*y0 + 2*mt*t*y1 + t*t*y2 });
  }
  return pts;
}

function eyeClipPath(side: 1 | -1, cfg: Config, rx: number, ry: number, rz: number, yaw: number, pitch: number): string {
  const cx = side * cfg.eyeSpacing;
  const margin = 2;
  const halfW = cfg.eyeSize + margin;
  const topPts: Point[] = cfg.showEyelidUpper
    ? eyelidSamples(side, cfg, true)
    : [{ x: cx - halfW, y: -cfg.eyeSize - margin }, { x: cx + halfW, y: -cfg.eyeSize - margin }];
  const botPts: Point[] = cfg.showEyelidLower
    ? eyelidSamples(side, cfg, false)
    : [{ x: cx - halfW, y: cfg.eyeSize + margin }, { x: cx + halfW, y: cfg.eyeSize + margin }];
  const ordered = [...topPts, ...botPts.slice().reverse()];
  let d = '';
  for (let i = 0; i < ordered.length; i++) {
    const p = project3DFace(ordered[i].x, ordered[i].y, rx, ry, rz, yaw, pitch);
    d += (i === 0 ? 'M ' : ' L ') + `${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
  }
  return d + ' Z';
}

function bezierSamples(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, N: number): Point[] {
  const pts: Point[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N, mt = 1 - t;
    pts.push({ x: mt*mt*x0 + 2*mt*t*x1 + t*t*x2, y: mt*mt*y0 + 2*mt*t*y1 + t*t*y2 });
  }
  return pts;
}

function ellipseSamples(cx: number, cy: number, rx: number, ry: number, N = 20): Point[] {
  const pts: Point[] = [];
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * Math.PI * 2;
    pts.push({ x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) });
  }
  return pts;
}

export interface MouthGeom { samples: Point[]; closed: boolean; filled: boolean; }

export function buildMouthGeometry(cfg: Config): MouthGeom[] {
  const style: MouthStyle = cfg.mouthStyle ?? 'curve';
  const w = cfg.mouthWidth;
  const y = cfg.mouthOffset;
  const s = cfg.mouthScale;
  switch (style) {
    case 'flat':
      return [{ samples: [{ x: -w/2, y }, { x: w/2, y }], closed: false, filled: false }];
    case 'smirk': {
      const dir = s >= 0 ? 1 : -1;
      const mag = Math.max(0.3, Math.abs(s));
      const samples = bezierSamples(-w/2, y - 3 * mag * dir, 0, y, w/2, y + 5 * mag * dir, 14);
      return [{ samples, closed: false, filled: false }];
    }
    case 'open': {
      const ry = Math.max(3, 4 + 3 * Math.abs(s));
      return [{ samples: ellipseSamples(0, y + ry, w/2, ry, 24), closed: true, filled: true }];
    }
    case 'oh': {
      const r = Math.max(2, w / 4);
      return [{ samples: ellipseSamples(0, y + r, r, r, 18), closed: true, filled: true }];
    }
    case 'kiss': {
      const rx = Math.max(2, w / 5);
      const ry = Math.max(3, w / 3);
      return [{ samples: ellipseSamples(0, y + ry, rx, ry, 18), closed: true, filled: true }];
    }
    case 'teeth': {
      const main = bezierSamples(-w/2, y, 0, y + 8 * s, w/2, y, 14);
      const chord: Point[] = [{ x: -w/2, y: y + 2 * s }, { x: w/2, y: y + 2 * s }];
      const verts: MouthGeom[] = [];
      const teethCount = 3;
      const teethH = 3 + 1.5 * Math.abs(s);
      for (let i = 1; i <= teethCount; i++) {
        const xx = -w/2 + (w * i / (teethCount + 1));
        verts.push({ samples: [{ x: xx, y: y + 2 * s - teethH/2 }, { x: xx, y: y + 2 * s + teethH/2 }], closed: false, filled: false });
      }
      return [
        { samples: main, closed: false, filled: false },
        { samples: chord, closed: false, filled: false },
        ...verts,
      ];
    }
    case 'tongue': {
      const ry = Math.max(4, 5 + 2 * Math.abs(s));
      const oval = ellipseSamples(0, y + ry, w/2, ry, 24);
      const tongueR = w / 4;
      const tcy = y + ry + tongueR * 0.4;
      const tongue = ellipseSamples(0, tcy, tongueR, tongueR * 0.75, 16);
      return [
        { samples: oval, closed: true, filled: true },
        { samples: tongue, closed: true, filled: false },
      ];
    }
    case 'curve':
    default: {
      const samples = bezierSamples(-w/2, y, 0, y + 8 * s, w/2, y, 14);
      return [{ samples, closed: false, filled: false }];
    }
  }
}

function glabellaSamples(side: 1 | -1, cfg: Config, overshoot: number): Point[] {
  const x = side * 3;
  const y0 = cfg.eyebrowOffset - overshoot * 0.2;
  const y1 = cfg.eyebrowOffset + overshoot * 0.3;
  const N = 4;
  const pts: Point[] = [];
  for (let i = 0; i <= N; i++) pts.push({ x, y: y0 + (y1 - y0) * (i / N) });
  return pts;
}

export function computeFacePaths(
  cfg: Config,
  headRx: number, headRy: number, headRz: number,
  yawRad: number, pitchRad: number,
): FacePaths {
  const isAngry = cfg.eyebrowRotation < EYEBROW_ANGRY_THRESHOLD;
  const clampedRot = isAngry ? EYEBROW_ANGRY_THRESHOLD : cfg.eyebrowRotation;
  const glabellaOvershoot = isAngry ? (EYEBROW_ANGRY_THRESHOLD - cfg.eyebrowRotation) : 0;
  return {
    leftEye: project3DFace(-cfg.eyeSpacing, 0, headRx, headRy, headRz, yawRad, pitchRad),
    rightEye: project3DFace(cfg.eyeSpacing, 0, headRx, headRy, headRz, yawRad, pitchRad),
    leftBrow: samplePath3D(eyebrowSamples(-1, cfg, clampedRot, glabellaOvershoot), headRx, headRy, headRz, yawRad, pitchRad),
    rightBrow: samplePath3D(eyebrowSamples(1, cfg, clampedRot, glabellaOvershoot), headRx, headRy, headRz, yawRad, pitchRad),
    leftUpperLid: samplePath3D(eyelidSamples(-1, cfg, true), headRx, headRy, headRz, yawRad, pitchRad),
    rightUpperLid: samplePath3D(eyelidSamples(1, cfg, true), headRx, headRy, headRz, yawRad, pitchRad),
    leftLowerLid: samplePath3D(eyelidSamples(-1, cfg, false), headRx, headRy, headRz, yawRad, pitchRad),
    rightLowerLid: samplePath3D(eyelidSamples(1, cfg, false), headRx, headRy, headRz, yawRad, pitchRad),
    leftEyeClip: eyeClipPath(-1, cfg, headRx, headRy, headRz, yawRad, pitchRad),
    rightEyeClip: eyeClipPath(1, cfg, headRx, headRy, headRz, yawRad, pitchRad),
    mouth: buildMouthGeometry(cfg).map(g => {
      let d = samplePath3D(g.samples, headRx, headRy, headRz, yawRad, pitchRad);
      if (g.closed && d) d += ' Z';
      return { d, filled: g.filled };
    }),
    leftGlabella: samplePath3D(glabellaSamples(-1, cfg, glabellaOvershoot), headRx, headRy, headRz, yawRad, pitchRad),
    rightGlabella: samplePath3D(glabellaSamples(1, cfg, glabellaOvershoot), headRx, headRy, headRz, yawRad, pitchRad),
    glabellaOvershoot,
  };
}

