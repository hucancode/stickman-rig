export interface Point {
  x: number;
  y: number;
}

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
  chestWidth: number;
  stomachWidth: number;
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
  eyebrowOffset: number;
  eyebrowRotation: number;
  eyebrowThickness: number;
  eyelidUpperOffset: number;
  eyelidLowerOffset: number;
  eyelidUpperCurvature: number;
  eyelidLowerCurvature: number;
  showEyelidUpper: boolean;
  showEyelidLower: boolean;
  headSquishY: number;
  headSquishX: number;
  headRotationY: number;
  headRotationX: number;
  headRotationZ: number;
  coreRotationY: number;
  roughness: number;
  bowing: number;
  leftHandRotation: number;
  rightHandRotation: number;
  leftFootRotation: number;
  rightFootRotation: number;
  hairStyle: string;
  accessories: Accessory[];
  hiddenControls: Record<string, boolean>;
}

export interface RigState {
  head: Point;
  pelvis: Point;
  torsoCurve: Point;
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
  neutral: { eyeSize: 4, mouthScale: 0.5, mouthOffset: 15, eyebrowOffset: -10, eyebrowRotation: 0, eyebrowThickness: 2, eyelidUpperOffset: -5, eyelidLowerOffset: 5, eyelidUpperCurvature: 0, eyelidLowerCurvature: 0, mouthWidth: 12, showEyelidUpper: true, showEyelidLower: false },
  happy: { eyeSize: 4.5, mouthScale: 1.5, mouthOffset: 14, eyebrowOffset: -12, eyebrowRotation: -10, eyebrowThickness: 2, eyelidUpperOffset: -5, eyelidLowerOffset: 4, eyelidUpperCurvature: -2, eyelidLowerCurvature: -1, mouthWidth: 16, showEyelidUpper: true, showEyelidLower: true },
  sad: { eyeSize: 3.5, mouthScale: -1.2, mouthOffset: 18, eyebrowOffset: -9, eyebrowRotation: 15, eyebrowThickness: 2, eyelidUpperOffset: -4, eyelidLowerOffset: 5, eyelidUpperCurvature: 2, eyelidLowerCurvature: 0, mouthWidth: 10, showEyelidUpper: true, showEyelidLower: false },
  angry: { eyeSize: 3, mouthScale: -0.5, mouthOffset: 16, eyebrowOffset: -6, eyebrowRotation: -25, eyebrowThickness: 3, eyelidUpperOffset: -2, eyelidLowerOffset: 5, eyelidUpperCurvature: -1, eyelidLowerCurvature: 0, mouthWidth: 14, showEyelidUpper: true, showEyelidLower: true },
  surprised: { eyeSize: 6, mouthScale: 1.8, mouthOffset: 18, eyebrowOffset: -15, eyebrowRotation: 5, eyebrowThickness: 2, eyelidUpperOffset: -7, eyelidLowerOffset: 7, eyelidUpperCurvature: -3, eyelidLowerCurvature: 3, mouthWidth: 8, showEyelidUpper: false, showEyelidLower: false },
  confused: { eyeSize: 4, mouthScale: -0.2, mouthOffset: 16, eyebrowOffset: -10, eyebrowRotation: -10, eyebrowThickness: 2, eyelidUpperOffset: -4, eyelidLowerOffset: 5, eyelidUpperCurvature: 0, eyelidLowerCurvature: 0, mouthWidth: 10, showEyelidUpper: true, showEyelidLower: false },
  excited: { eyeSize: 5, mouthScale: 2, mouthOffset: 13, eyebrowOffset: -13, eyebrowRotation: -5, eyebrowThickness: 2.5, eyelidUpperOffset: -6, eyelidLowerOffset: 6, eyelidUpperCurvature: -2, eyelidLowerCurvature: 1, mouthWidth: 18, showEyelidUpper: true, showEyelidLower: true },
  scared: { eyeSize: 5, mouthScale: -1, mouthOffset: 17, eyebrowOffset: -14, eyebrowRotation: 10, eyebrowThickness: 1.5, eyelidUpperOffset: -6, eyelidLowerOffset: 6, eyelidUpperCurvature: 0, eyelidLowerCurvature: 0, mouthWidth: 14, showEyelidUpper: false, showEyelidLower: false },
  disgusted: { eyeSize: 3, mouthScale: -0.8, mouthOffset: 15, eyebrowOffset: -7, eyebrowRotation: 20, eyebrowThickness: 2.5, eyelidUpperOffset: -2, eyelidLowerOffset: 3, eyelidUpperCurvature: 2, eyelidLowerCurvature: -1, mouthWidth: 10, showEyelidUpper: true, showEyelidLower: true },
  tired: { eyeSize: 3, mouthScale: -0.2, mouthOffset: 17, eyebrowOffset: -8, eyebrowRotation: 0, eyebrowThickness: 2, eyelidUpperOffset: -1, eyelidLowerOffset: 3, eyelidUpperCurvature: 2, eyelidLowerCurvature: 1, mouthWidth: 12, showEyelidUpper: true, showEyelidLower: true },
  relaxed: { eyeSize: 3.5, mouthScale: 0.8, mouthOffset: 16, eyebrowOffset: -9, eyebrowRotation: 0, eyebrowThickness: 2, eyelidUpperOffset: -2, eyelidLowerOffset: 4, eyelidUpperCurvature: 1, eyelidLowerCurvature: -1, mouthWidth: 14, showEyelidUpper: true, showEyelidLower: false },
  sly: { eyeSize: 3.5, mouthScale: 0.8, mouthOffset: 15, eyebrowOffset: -8, eyebrowRotation: -15, eyebrowThickness: 2.5, eyelidUpperOffset: -2, eyelidLowerOffset: 4, eyelidUpperCurvature: -1, eyelidLowerCurvature: -1, mouthWidth: 15, showEyelidUpper: true, showEyelidLower: true },
  suspicious: { eyeSize: 2.5, mouthScale: -0.2, mouthOffset: 16, eyebrowOffset: -7, eyebrowRotation: 5, eyebrowThickness: 2, eyelidUpperOffset: -1, eyelidLowerOffset: 3, eyelidUpperCurvature: 1, eyelidLowerCurvature: 0, mouthWidth: 12, showEyelidUpper: true, showEyelidLower: true },
  determined: { eyeSize: 4, mouthScale: 0.1, mouthOffset: 15, eyebrowOffset: -7, eyebrowRotation: -20, eyebrowThickness: 3, eyelidUpperOffset: -3, eyelidLowerOffset: 5, eyelidUpperCurvature: 0, eyelidLowerCurvature: 0, mouthWidth: 14, showEyelidUpper: true, showEyelidLower: false },
  worried: { eyeSize: 4.5, mouthScale: -0.8, mouthOffset: 17, eyebrowOffset: -12, eyebrowRotation: 20, eyebrowThickness: 2, eyelidUpperOffset: -5, eyelidLowerOffset: 5, eyelidUpperCurvature: 1, eyelidLowerCurvature: 0, mouthWidth: 12, showEyelidUpper: true, showEyelidLower: false },
  dizzy: { eyeSize: 3, mouthScale: 0.5, mouthOffset: 17, eyebrowOffset: -10, eyebrowRotation: 5, eyebrowThickness: 2, eyelidUpperOffset: -3, eyelidLowerOffset: 4, eyelidUpperCurvature: 0, eyelidLowerCurvature: 0, mouthWidth: 12, showEyelidUpper: false, showEyelidLower: true },
  cheeky: { eyeSize: 4, mouthScale: 1.2, mouthOffset: 14, eyebrowOffset: -11, eyebrowRotation: -5, eyebrowThickness: 2, eyelidUpperOffset: -4, eyelidLowerOffset: 5, eyelidUpperCurvature: -1, eyelidLowerCurvature: 0, mouthWidth: 14, showEyelidUpper: true, showEyelidLower: true },
  sleepy: { eyeSize: 2, mouthScale: 0.2, mouthOffset: 17, eyebrowOffset: -8, eyebrowRotation: 0, eyebrowThickness: 2, eyelidUpperOffset: 0, eyelidLowerOffset: 2, eyelidUpperCurvature: 2, eyelidLowerCurvature: 1, mouthWidth: 10, showEyelidUpper: true, showEyelidLower: true },
  focused: { eyeSize: 3.5, mouthScale: 0, mouthOffset: 15, eyebrowOffset: -8, eyebrowRotation: -10, eyebrowThickness: 2.5, eyelidUpperOffset: -2, eyelidLowerOffset: 4, eyelidUpperCurvature: 0, eyelidLowerCurvature: 0, mouthWidth: 10, showEyelidUpper: true, showEyelidLower: false },
  crying: { eyeSize: 4, mouthScale: -1.5, mouthOffset: 18, eyebrowOffset: -10, eyebrowRotation: 15, eyebrowThickness: 2, eyelidUpperOffset: -4, eyelidLowerOffset: 6, eyelidUpperCurvature: 1, eyelidLowerCurvature: 0, mouthWidth: 16, showEyelidUpper: true, showEyelidLower: true }
};

export const DEFAULT_CONFIG: Config = {
  headRadius: 80, chestWidth: 60, stomachWidth: 70, hipWidth: 80, handRadius: 15, footRadius: 15,
  outlineThickness: 2, smoothLeftArm: true, smoothRightArm: true, smoothLeftLeg: true, smoothRightLeg: true,
  eyeSize: 4, eyeSpacing: 25, mouthScale: 1, mouthOffset: 15, mouthWidth: 12,
  eyebrowOffset: -10, eyebrowRotation: 0, eyebrowThickness: 2,
  eyelidUpperOffset: -5, eyelidLowerOffset: 5, eyelidUpperCurvature: 0, eyelidLowerCurvature: 0,
  showEyelidUpper: false, showEyelidLower: false,
  headSquishX: 1, headSquishY: 0.9, headRotationY: 0, headRotationX: 0, headRotationZ: 0, coreRotationY: 0,
  roughness: 1.5, bowing: 1,
  leftHandRotation: 0, rightHandRotation: 0, leftFootRotation: 0, rightFootRotation: 0,
  hairStyle: 'none', accessories: [],
  hiddenControls: { head: false, core: false, arm: false, hand: false, leg: false, feet: false, accessories: false, hair: false }
};

export const DEFAULT_RIG: RigState = {
  head: { x: 400, y: 200 }, pelvis: { x: 400, y: 400 }, torsoCurve: { x: 410, y: 300 },
  leftElbow: { x: 320, y: 300 }, leftHand: { x: 280, y: 350 },
  rightElbow: { x: 480, y: 300 }, rightHand: { x: 520, y: 350 },
  leftKnee: { x: 350, y: 470 }, leftFoot: { x: 330, y: 550 },
  rightKnee: { x: 450, y: 470 }, rightFoot: { x: 470, y: 550 },
};

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

export function getPointOnCylinder(
  rig: RigState,
  t: number,
  width: number,
  angleDeg: number,
  rotationYDeg: number
): { point: Point; z: number } {
  const normal = getBezierNormal(t, rig.head, rig.torsoCurve, rig.pelvis);
  const R = width / 2;
  const rad = (angleDeg + rotationYDeg) * Math.PI / 180;
  const xOffset = R * Math.sin(rad);
  const zOffset = R * Math.cos(rad);
  const spine = getBezierPoint(t, rig.head, rig.torsoCurve, rig.pelvis);
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
  const rightShoulder = getPointOnCylinder(rig, 0.3, Math.max(1, config.chestWidth * 0.95), -90, config.coreRotationY);
  const leftShoulder = getPointOnCylinder(rig, 0.3, Math.max(1, config.chestWidth * 0.95), 90, config.coreRotationY);
  const rightHip = getPointOnCylinder(rig, 1, Math.max(1, config.hipWidth), -90, config.coreRotationY);
  const leftHip = getPointOnCylinder(rig, 1, Math.max(1, config.hipWidth), 90, config.coreRotationY);

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
  const n0 = getBezierNormal(0, rig.head, rig.torsoCurve, rig.pelvis);
  const n1 = getBezierNormal(0.5, rig.head, rig.torsoCurve, rig.pelvis);
  const n2 = getBezierNormal(1, rig.head, rig.torsoCurve, rig.pelvis);

  const w0 = Math.max(1, config.chestWidth / 2);
  const w1 = Math.max(1, config.stomachWidth / 2);
  const w2 = Math.max(1, config.hipWidth / 2);

  const l0 = { x: rig.head.x + n0.x * w0, y: rig.head.y + n0.y * w0 };
  const r0 = { x: rig.head.x - n0.x * w0, y: rig.head.y - n0.y * w0 };

  const leftControl = { x: rig.torsoCurve.x + n1.x * w1, y: rig.torsoCurve.y + n1.y * w1 };
  const rightControl = { x: rig.torsoCurve.x - n1.x * w1, y: rig.torsoCurve.y - n1.y * w1 };

  const l2 = { x: rig.pelvis.x + n2.x * w2, y: rig.pelvis.y + n2.y * w2 };
  const r2 = { x: rig.pelvis.x - n2.x * w2, y: rig.pelvis.y - n2.y * w2 };

  return `
    M ${l0.x} ${l0.y}
    Q ${leftControl.x} ${leftControl.y} ${l2.x} ${l2.y}
    A ${w2} ${w2} 0 0 0 ${r2.x} ${r2.y}
    Q ${rightControl.x} ${rightControl.y} ${r0.x} ${r0.y}
    A ${w0} ${w0} 0 0 0 ${l0.x} ${l0.y}
    Z
  `;
}

export interface LimbTransform {
  pathD: string;
  transform: string;
  isSmooth: boolean;
}

export function computeLimbTransform(limb: Limb, rig: RigState, config: Config): LimbTransform {
  const isLeg = limb.id.toLowerCase().includes('leg');
  const r = limb.radius;
  let transformStr = '';
  let pathD = '';

  if (isLeg) {
    let direction = 1;
    if (Math.abs(config.coreRotationY) > 5) {
      direction = config.coreRotationY > 0 ? 1 : -1;
    } else {
      direction = (limb.end.x - rig.pelvis.x) >= 0 ? 1 : -1;
    }
    const manualRot = limb.id === 'leftLeg' ? config.leftFootRotation : config.rightFootRotation;
    transformStr = `translate(${limb.end.x}, ${limb.end.y}) rotate(${manualRot})`;
    pathD = direction >= 0
      ? `M 0 0 A ${r} ${r} 0 0 1 ${2 * r} 0 Z`
      : `M 0 0 A ${r} ${r} 0 0 0 ${-2 * r} 0 Z`;
  } else {
    const dx = limb.end.x - rig.torsoCurve.x;
    const dy = limb.end.y - rig.torsoCurve.y;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const manualRot = limb.id === 'leftArm' ? config.leftHandRotation : config.rightHandRotation;
    transformStr = `translate(${limb.end.x}, ${limb.end.y}) rotate(${angle + manualRot})`;
    pathD = dx >= 0
      ? `M 0 0 A ${r} ${r} 0 0 1 0 ${2 * r} Z`
      : `M 0 0 A ${r} ${r} 0 0 0 0 ${-2 * r} Z`;
  }

  const isSmooth =
    limb.id === 'leftArm' ? config.smoothLeftArm :
    limb.id === 'rightArm' ? config.smoothRightArm :
    limb.id === 'leftLeg' ? config.smoothLeftLeg :
    config.smoothRightLeg;

  return { pathD, transform: transformStr, isSmooth };
}

export function getHairPath(style: string, headRadius: number): string | null {
  const h = headRadius;
  switch (style) {
    case 'bob':
      return `M ${-h*1.15} ${h*0.2} C ${-h*1.3} ${-h*0.8} ${-h*0.5} ${-h*1.4} 0 ${-h*1.4} C ${h*0.5} ${-h*1.4} ${h*1.3} ${-h*0.8} ${h*1.15} ${h*0.2} C ${h*1.2} ${h*0.6} ${h*0.6} ${h*0.6} ${h*0.6} ${h*0.2} L ${-h*0.6} ${h*0.2} C ${-h*0.6} ${h*0.6} ${-h*1.2} ${h*0.6} ${-h*1.15} ${h*0.2} Z`;
    case 'long':
      return `M ${-h*1.1} ${-h*0.1} C ${-h*1.2} ${-h*1.4} ${h*1.2} ${-h*1.4} ${h*1.1} ${-h*0.1} C ${h*1.2} ${h} ${h*1.5} ${h*2} ${h*1.2} ${h*2.5} C ${h*0.8} ${h*2} ${h*0.8} ${h} ${h*0.6} ${h*0.2} L ${-h*0.6} ${h*0.2} C ${-h*0.8} ${h} ${-h*0.8} ${h*2} ${-h*1.2} ${h*2.5} C ${-h*1.5} ${h*2} ${-h*1.2} ${h} ${-h*1.1} ${-h*0.1} Z`;
    case 'spiky':
      return `M ${-h*1.0} ${-h*0.1} L ${-h*0.8} ${-h*1.5} L ${-h*0.3} ${-h*0.9} L 0 ${-h*1.8} L ${h*0.4} ${-h*0.9} L ${h*0.9} ${-h*1.4} L ${h*1.0} ${-h*0.1} Z`;
    case 'messy':
      return `M ${-h*1.0} ${h*0.2} L ${-h*1.2} ${-h*0.5} L ${-h*0.8} ${-h*0.4} L ${-h*0.9} ${-h*1.2} L ${-h*0.4} ${-h*0.8} L ${-h*0.2} ${-h*1.6} L ${h*0.2} ${-h*0.9} L ${h*0.6} ${-h*1.5} L ${h*0.8} ${-h*0.7} L ${h*1.2} ${-h*0.9} L ${h*1.0} ${-h*0.1} Z`;
    case 'short':
      return `M ${-h} ${-h*0.1} C ${-h*1.1} ${-h*1.2} ${h*1.1} ${-h*1.2} ${h} ${-h*0.1} C ${h*0.8} ${-h*0.4} ${h*0.4} ${-h*0.3} 0 ${-h*0.5} C ${-h*0.4} ${-h*0.3} ${-h*0.8} ${-h*0.4} ${-h} ${-h*0.1} Z`;
    case 'curly':
      return `M ${-h*1.0} ${-h*0.1} A ${h*0.5} ${h*0.5} 0 0 1 ${-h*0.6} ${-h*0.9} A ${h*0.5} ${h*0.5} 0 0 1 ${-h*0.1} ${-h*1.2} A ${h*0.5} ${h*0.5} 0 0 1 ${h*0.5} ${-h*1.0} A ${h*0.5} ${h*0.5} 0 0 1 ${h*1.0} ${-h*0.4} A ${h*0.4} ${h*0.4} 0 0 1 ${h*1.1} 0 Z`;
    case 'bowl':
      return `M ${-h*1.15} ${-h*0.1} A ${h*1.15} ${h*1.15} 0 0 1 ${h*1.15} ${-h*0.1} Z`;
    default:
      return null;
  }
}

export interface PigtailPaths {
  left: string;
  right: string;
  bangs: string;
}

export function getPigtailPaths(headRadius: number): PigtailPaths {
  const h = headRadius;
  return {
    left: `M ${-h*0.9} ${-h*0.4} C ${-h*1.8} ${-h*0.8} ${-h*2.2} ${h*0.8} ${-h*1.2} ${h*1.2} C ${-h*1.4} ${h*0.5} ${-h*0.8} 0 ${-h*0.9} ${-h*0.4} Z`,
    right: `M ${h*0.9} ${-h*0.4} C ${h*1.8} ${-h*0.8} ${h*2.2} ${h*0.8} ${h*1.2} ${h*1.2} C ${h*1.4} ${h*0.5} ${h*0.8} 0 ${h*0.9} ${-h*0.4} Z`,
    bangs: `M ${-h*1.1} ${-h*0.1} C ${-h*1.2} ${-h*1.4} ${h*1.2} ${-h*1.4} ${h*1.1} ${-h*0.1} C ${h} ${-h*0.4} ${-h} ${-h*0.4} ${-h*1.1} ${-h*0.1} Z`
  };
}
