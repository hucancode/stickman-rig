import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Download, SlidersHorizontal, PersonStanding } from 'lucide-react';
import rough from 'roughjs/bin/rough';

const roughGen = rough.generator();

function RoughPath({ d, fill, stroke, strokeWidth, strokeLinecap, strokeLinejoin, roughness = 1.5, bowing = 1 }: any) {
  const paths = useMemo(() => {
    if (!d) return [];
    try {
      const drawable = roughGen.path(d, {
        stroke: stroke || 'currentColor',
        strokeWidth: strokeWidth || 1,
        fill: fill && fill !== 'none' ? fill : undefined,
        fillStyle: 'solid',
        roughness: roughness,
        bowing: bowing,
        seed: 1
      });
      return roughGen.toPaths(drawable);
    } catch (e) {
      return [];
    }
  }, [d, fill, stroke, strokeWidth, roughness, bowing]);

  return (
    <>
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill={p.fill === 'currentColor' ? 'currentColor' : (p.fill || 'none')} stroke={stroke} strokeWidth={p.strokeWidth || strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} />
      ))}
    </>
  );
}

function RoughEllipse({ cx, cy, rx, ry, fill, stroke, strokeWidth, roughness = 1.5, bowing = 1 }: any) {
  const paths = useMemo(() => {
    const drawable = roughGen.ellipse(cx, cy, 2 * rx, 2 * ry, {
       stroke: stroke || 'currentColor',
       strokeWidth: strokeWidth || 1,
       fill: fill && fill !== 'none' ? fill : undefined,
       fillStyle: 'solid',
       roughness: roughness,
       bowing: bowing,
       seed: 1
    });
    return roughGen.toPaths(drawable);
  }, [cx, cy, rx, ry, fill, stroke, strokeWidth, roughness, bowing]);

  return (
    <>
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill={p.fill === 'currentColor' ? 'currentColor' : (p.fill || 'none')} stroke={stroke} strokeWidth={p.strokeWidth || strokeWidth} />
      ))}
    </>
  );
}

function RoughCircle({ cx, cy, r, fill, stroke, strokeWidth, roughness = 1.5, bowing = 1 }: any) {
  const paths = useMemo(() => {
    const drawable = roughGen.circle(cx, cy, 2 * r, {
       stroke: stroke || 'currentColor',
       strokeWidth: strokeWidth || 1,
       fill: fill && fill !== 'none' ? fill : undefined,
       fillStyle: 'solid',
       roughness: roughness,
       bowing: bowing,
       seed: 1
    });
    return roughGen.toPaths(drawable);
  }, [cx, cy, r, fill, stroke, strokeWidth, roughness, bowing]);

  return (
    <>
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill={p.fill === 'currentColor' ? 'currentColor' : (p.fill || 'none')} stroke={stroke} strokeWidth={p.strokeWidth || strokeWidth} />
      ))}
    </>
  );
}

interface Point {
  x: number;
  y: number;
}

interface Config {
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
  accessories: Array<{
    id: string;
    emoji: string;
    position: Point;
    scale: number;
    rotation: number;
    flipX: boolean;
  }>;
  hiddenControls: Record<string, boolean>;
}

interface RigState {
  head: Point;
  faceDirection: Point;
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

const EXPRESSION_PRESETS: Record<string, Partial<Config>> = {
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

export default function App() {
  const [config, setConfig] = useState<Config>({
    headRadius: 80,
    chestWidth: 60,
    stomachWidth: 70,
    hipWidth: 80,
    handRadius: 15,
    footRadius: 15,
    outlineThickness: 2,
    smoothLeftArm: true,
    smoothRightArm: true,
    smoothLeftLeg: true,
    smoothRightLeg: true,
    eyeSize: 4,
    eyeSpacing: 25,
    mouthScale: 1,
    mouthOffset: 15,
    mouthWidth: 12,
    eyebrowOffset: -10,
    eyebrowRotation: 0,
    eyebrowThickness: 2,
    eyelidUpperOffset: -5,
    eyelidLowerOffset: 5,
    eyelidUpperCurvature: 0,
    eyelidLowerCurvature: 0,
    showEyelidUpper: false,
    showEyelidLower: false,
    headSquishX: 1,
    headSquishY: 0.9,
    headRotationY: 0,
    headRotationX: 0,
    headRotationZ: 0,
    coreRotationY: 0,
    roughness: 1.5,
    bowing: 1,
    leftHandRotation: 0,
    rightHandRotation: 0,
    leftFootRotation: 0,
    rightFootRotation: 0,
    hairStyle: 'none',
    accessories: [],
    hiddenControls: {
      head: false,
      core: false,
      arm: false,
      hand: false,
      leg: false,
      feet: false,
      accessories: false,
      hair: false,
    }
  });

  const [activeTab, setActiveTab] = useState<'rig' | 'geometry' | 'props' | 'render' | 'expressions'>('rig');
  const [zoom, setZoom] = useState(1);
  const [showPanel, setShowPanel] = useState(true);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const panRef = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null);

  const [rig, setRig] = useState<RigState>({
    head: { x: 400, y: 200 },
    pelvis: { x: 400, y: 400 },
    torsoCurve: { x: 410, y: 300 },

    leftElbow: { x: 320, y: 300 },
    leftHand: { x: 280, y: 350 },
    rightElbow: { x: 480, y: 300 },
    rightHand: { x: 520, y: 350 },

    leftKnee: { x: 350, y: 470 },
    leftFoot: { x: 330, y: 550 },
    rightKnee: { x: 450, y: 470 },
    rightFoot: { x: 470, y: 550 },
  });

  const svgRef = useRef<SVGSVGElement>(null);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!draggingNode || !svgRef.current) return;

      const CTM = svgRef.current.getScreenCTM();
      if (!CTM) return;

      const newX = (e.clientX - CTM.e) / CTM.a;
      const newY = (e.clientY - CTM.f) / CTM.d;

      if (draggingNode.startsWith('acc_')) {
        const accId = draggingNode.split('_')[1];
        setConfig(prev => ({
          ...prev,
          accessories: prev.accessories.map(a => a.id === accId ? { ...a, position: { x: newX, y: newY } } : a)
        }));
      } else {
        setRig((prev) => ({
          ...prev,
          [draggingNode as keyof RigState]: { x: newX, y: newY }
        }));
      }
    };

    const handlePointerUp = () => {
      setDraggingNode(null);
    };

    if (draggingNode) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggingNode]);

  const handlePointerDown = (node: string, e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault(); // prevent touch scroll
    setDraggingNode(node);
  };

  const getLimbPath = (start: Point, joint: Point, end: Point, smooth: boolean) => {
    if (!smooth) {
      return `M ${start.x} ${start.y} L ${joint.x} ${joint.y} L ${end.x} ${end.y}`;
    } else {
      const p1x = 2 * joint.x - 0.5 * start.x - 0.5 * end.x;
      const p1y = 2 * joint.y - 0.5 * start.y - 0.5 * end.y;
      return `M ${start.x} ${start.y} Q ${p1x} ${p1y} ${end.x} ${end.y}`;
    }
  };

  const exportSvg = () => {
    if (!svgRef.current) return;
    const svgClone = svgRef.current.cloneNode(true) as SVGSVGElement;

    // Remove UI handles from export
    const handlesGroup = svgClone.querySelector('#rig-handles');
    if (handlesGroup) handlesGroup.remove();

    // Serialize and download
    const svgData = new XMLSerializer().serializeToString(svgClone);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'stickman_rig.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const Handle = ({ id, pt, label, color = "#3b82f6", shape = "circle" }: { id: string, pt: Point, label: string, color?: string, shape?: "square" | "circle" | "diamond" | "target" }) => {
    const isDragging = draggingNode === id;
    return (
      <g
        transform={`translate(${pt.x}, ${pt.y})`}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        onPointerDown={(e) => handlePointerDown(id, e)}
        className="group relative"
      >
        {/* Invisible larger hit area for easier grabbing */}
        <circle r={25} fill="transparent" />

        {shape === 'circle' && (
          <g>
            <circle r={isDragging ? 7 : 5} fill="none" stroke={color} strokeWidth={isDragging ? 2 : 1.5} strokeDasharray={isDragging ? "none" : "2 2"} />
            <circle r={2} fill={color} />
          </g>
        )}

        {shape === 'square' && (
          <g>
            <rect x={-5} y={-5} width={10} height={10} fill="none" stroke={color} strokeWidth={isDragging ? 2 : 1.5} strokeDasharray={isDragging ? "none" : "2 2"} rx={1} />
            <rect x={-2} y={-2} width={4} height={4} fill={color} rx={0.5} />
          </g>
        )}

        {shape === 'diamond' && (
          <g>
            <polygon points="0,-7 7,0 0,7 -7,0" fill="none" stroke={color} strokeWidth={isDragging ? 2 : 1.5} strokeDasharray={isDragging ? "none" : "2 2"} />
            <polygon points="0,-2 2,0 0,2 -2,0" fill={color} />
          </g>
        )}

        {shape === 'target' && (
          <g>
            <circle r={7} fill="none" stroke={color} strokeWidth={isDragging ? 2 : 1.5} />
            <line x1={-12} y1={0} x2={12} y2={0} stroke={color} strokeWidth={1} opacity={0.6} />
            <line x1={0} y1={-12} x2={0} y2={12} stroke={color} strokeWidth={1} opacity={0.6} />
            <circle r={2} fill={color} />
          </g>
        )}

        {/* Hover Label */}
        <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <rect x={12} y={-10} width={label.length * 6 + 16} height={20} fill="#1e293b" rx={4} stroke={color} strokeWidth={1} />
          <text x={20} y={4} fill="#f8fafc" fontSize={11} fontFamily="sans-serif" fontWeight="500">{label}</text>
        </g>
      </g>
    );
  };

  const getBezierPoint = (t: number, p0: Point, p1: Point, p2: Point): Point => {
    const mt = 1 - t;
    return {
      x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
      y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y
    };
  };

  const getBezierDerivative = (t: number, p0: Point, p1: Point, p2: Point): Point => {
    const mt = 1 - t;
    return {
      x: 2 * mt * (p1.x - p0.x) + 2 * t * (p2.x - p1.x),
      y: 2 * mt * (p1.y - p0.y) + 2 * t * (p2.y - p1.y)
    };
  };

  const getBezierNormal = (t: number, p0: Point, p1: Point, p2: Point): Point => {
    const d = getBezierDerivative(t, p0, p1, p2);
    const len = Math.hypot(d.x, d.y) || 1;
    return { x: -d.y / len, y: d.x / len };
  };

  const getPointOnCylinder = (t: number, width: number, angleDeg: number, rotationYDeg: number) => {
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
  };

  const rightShoulder = getPointOnCylinder(0.3, Math.max(1, config.chestWidth * 0.95), -90, config.coreRotationY);
  const leftShoulder = getPointOnCylinder(0.3, Math.max(1, config.chestWidth * 0.95), 90, config.coreRotationY);
  const rightHip = getPointOnCylinder(1, Math.max(1, config.hipWidth), -90, config.coreRotationY);
  const leftHip = getPointOnCylinder(1, Math.max(1, config.hipWidth), 90, config.coreRotationY);

  // Bias for deterministic z-sorting when perfectly flat
  leftShoulder.z -= 0.001;
  leftHip.z -= 0.001;
  rightShoulder.z += 0.001;
  rightHip.z += 0.001;

  const limbs = [
    { id: 'leftArm', start: leftShoulder.point, joint: rig.leftElbow, end: rig.leftHand, radius: config.handRadius, z: leftShoulder.z },
    { id: 'rightArm', start: rightShoulder.point, joint: rig.rightElbow, end: rig.rightHand, radius: config.handRadius, z: rightShoulder.z },
    { id: 'leftLeg', start: leftHip.point, joint: rig.leftKnee, end: rig.leftFoot, radius: config.footRadius, z: leftHip.z },
    { id: 'rightLeg', start: rightHip.point, joint: rig.rightKnee, end: rig.rightFoot, radius: config.footRadius, z: rightHip.z },
  ];

  const backLimbs = limbs.filter(l => l.z < 0).sort((a, b) => a.z - b.z);
  const frontLimbs = limbs.filter(l => l.z >= 0).sort((a, b) => a.z - b.z);

  const getBodyPath = () => {
    const n0 = getBezierNormal(0, rig.head, rig.torsoCurve, rig.pelvis);
    const n1 = getBezierNormal(0.5, rig.head, rig.torsoCurve, rig.pelvis);
    const n2 = getBezierNormal(1, rig.head, rig.torsoCurve, rig.pelvis);

    const w0 = Math.max(1, config.chestWidth / 2);
    const w1 = Math.max(1, config.stomachWidth / 2);
    const w2 = Math.max(1, config.hipWidth / 2);

    const l0 = { x: rig.head.x + n0.x * w0, y: rig.head.y + n0.y * w0 };
    const r0 = { x: rig.head.x - n0.x * w0, y: rig.head.y - n0.y * w0 };

    const leftControl = {
      x: rig.torsoCurve.x + n1.x * w1,
      y: rig.torsoCurve.y + n1.y * w1,
    };
    const rightControl = {
      x: rig.torsoCurve.x - n1.x * w1,
      y: rig.torsoCurve.y - n1.y * w1,
    };

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
  };

  const faceRotY = (config.headRotationY * Math.PI) / 180;
  const faceRotX = (config.headRotationX * Math.PI) / 180;
  const faceOffsetX = config.headRadius * config.headSquishX * Math.sin(faceRotY);
  const faceOffsetY = config.headRadius * config.headSquishY * Math.sin(faceRotX);
  const faceScaleX = Math.cos(faceRotY);
  const faceScaleY = Math.cos(faceRotX);

  const isAngry = config.eyebrowRotation < -10;
  const clampedEyebrowRotation = isAngry ? -10 : config.eyebrowRotation;
  const glabellaOvershoot = isAngry ? (-10 - config.eyebrowRotation) : 0;

  const renderLimb = (limb: typeof limbs[0]) => {
    const isLeg = limb.id.toLowerCase().includes('leg');
    const r = limb.radius;

    let transformStr = "";
    let pathD = "";

    if (isLeg) {
      let direction = 1;
      // automatic feet positioning based on current hip angle to convey 3d feel
      if (Math.abs(config.coreRotationY) > 5) {
        direction = config.coreRotationY > 0 ? 1 : -1;
      } else {
        direction = (limb.end.x - rig.pelvis.x) >= 0 ? 1 : -1;
      }

      const manualRot = limb.id === 'leftLeg' ? config.leftFootRotation : config.rightFootRotation;
      transformStr = `translate(${limb.end.x}, ${limb.end.y}) rotate(${manualRot})`;

      if (direction >= 0) {
        pathD = `M 0 0 A ${r} ${r} 0 0 1 ${2 * r} 0 Z`;
      } else {
        pathD = `M 0 0 A ${r} ${r} 0 0 0 ${-2 * r} 0 Z`;
      }
    } else {
      const dx = limb.end.x - rig.torsoCurve.x;
      const dy = limb.end.y - rig.torsoCurve.y;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      const manualRot = limb.id === 'leftArm' ? config.leftHandRotation : config.rightHandRotation;
      transformStr = `translate(${limb.end.x}, ${limb.end.y}) rotate(${angle + manualRot})`;

      if (dx >= 0) {
        pathD = `M 0 0 A ${r} ${r} 0 0 1 0 ${2 * r} Z`;
      } else {
        pathD = `M 0 0 A ${r} ${r} 0 0 0 0 ${-2 * r} Z`;
      }
    }

    const isSmooth =
      limb.id === 'leftArm' ? config.smoothLeftArm :
      limb.id === 'rightArm' ? config.smoothRightArm :
      limb.id === 'leftLeg' ? config.smoothLeftLeg :
      config.smoothRightLeg;

    return (
      <g key={limb.id} stroke="currentColor" strokeWidth={config.outlineThickness} strokeLinecap="round" strokeLinejoin="round">
        <RoughPath d={getLimbPath(limb.start, limb.joint, limb.end, isSmooth)} fill="none" strokeWidth={config.outlineThickness} roughness={config.roughness} bowing={config.bowing} />
        <g transform={transformStr}>
          <RoughPath d={pathD} fill="white" strokeWidth={config.outlineThickness} roughness={config.roughness} bowing={config.bowing} />
        </g>
      </g>
    );
  };

  return (
    <div className="h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 overflow-hidden">
      <header className="h-16 border-b border-slate-800 flex items-center px-6 justify-between shrink-0 bg-slate-950/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
            <PersonStanding size={18} />
          </div>
          <h1 className="font-semibold tracking-tight text-slate-200">Stickman Rig</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={exportSvg}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md font-medium transition-colors shadow-sm shadow-blue-900/50"
          >
            <Download size={18} />
            <span>Export SVG</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Canvas Area */}
        <main
          className="flex-1 relative overflow-hidden grid place-items-center bg-slate-900"
          style={{ cursor: panRef.current ? 'grabbing' : 'grab' }}
          onPointerDown={(e) => {
            if ((e.target as Element).closest('[data-no-pan]')) return;
            panRef.current = { startX: e.clientX, startY: e.clientY, panX: pan.x, panY: pan.y };
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!panRef.current) return;
            setPan({ x: panRef.current.panX + e.clientX - panRef.current.startX, y: panRef.current.panY + e.clientY - panRef.current.startY });
          }}
          onPointerUp={() => { panRef.current = null; }}
        >
          <div
            data-no-pan
            className="bg-slate-50 w-full max-w-4xl aspect-[4/3] rounded-xl shadow-2xl shadow-black/50 overflow-hidden ring-1 ring-white/10 flex items-center justify-center relative touch-none"
            style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'center center' }}
          >
            <svg
              ref={svgRef}
              viewBox="0 0 800 800"
              className="w-full h-full text-slate-900 select-none"
              style={{ touchAction: 'none' }}
            >
              {/* === FIGURE RENDERING === */}
              {/* === Back Limbs === */}
              {backLimbs.map(renderLimb)}

              {/* === Body Blob === */}
              <RoughPath
                d={getBodyPath()}
                fill="white"
                stroke="currentColor"
                strokeWidth={config.outlineThickness}
                strokeLinecap="round"
                strokeLinejoin="round"

                roughness={config.roughness}
                bowing={config.bowing}
              />

              {/* === Front Limbs === */}
              {frontLimbs.map(renderLimb)}

              {/* === Head === */}
              <g transform={`translate(${rig.head.x}, ${rig.head.y}) rotate(${config.headRotationZ})`}>
                {config.hairStyle === 'bob' && (
                  <RoughPath d={`M ${-config.headRadius*1.15} ${config.headRadius*0.2} C ${-config.headRadius*1.3} ${-config.headRadius*0.8} ${-config.headRadius*0.5} ${-config.headRadius*1.4} 0 ${-config.headRadius*1.4} C ${config.headRadius*0.5} ${-config.headRadius*1.4} ${config.headRadius*1.3} ${-config.headRadius*0.8} ${config.headRadius*1.15} ${config.headRadius*0.2} C ${config.headRadius*1.2} ${config.headRadius*0.6} ${config.headRadius*0.6} ${config.headRadius*0.6} ${config.headRadius*0.6} ${config.headRadius*0.2} L ${-config.headRadius*0.6} ${config.headRadius*0.2} C ${-config.headRadius*0.6} ${config.headRadius*0.6} ${-config.headRadius*1.2} ${config.headRadius*0.6} ${-config.headRadius*1.15} ${config.headRadius*0.2} Z`} fill="currentColor" stroke="currentColor" strokeWidth={config.outlineThickness} strokeLinejoin="round" roughness={config.roughness} bowing={config.bowing} />
                )}
                {config.hairStyle === 'pigtails' && (
                  <g>
                    {/* Left pigtail */}
                    <RoughPath d={`M ${-config.headRadius*0.9} ${-config.headRadius*0.4} C ${-config.headRadius*1.8} ${-config.headRadius*0.8} ${-config.headRadius*2.2} ${config.headRadius*0.8} ${-config.headRadius*1.2} ${config.headRadius*1.2} C ${-config.headRadius*1.4} ${config.headRadius*0.5} ${-config.headRadius*0.8} ${0} ${-config.headRadius*0.9} ${-config.headRadius*0.4} Z`} fill="currentColor" stroke="currentColor" strokeWidth={config.outlineThickness} strokeLinejoin="round" roughness={config.roughness} bowing={config.bowing} />
                    {/* Right pigtail */}
                    <RoughPath d={`M ${config.headRadius*0.9} ${-config.headRadius*0.4} C ${config.headRadius*1.8} ${-config.headRadius*0.8} ${config.headRadius*2.2} ${config.headRadius*0.8} ${config.headRadius*1.2} ${config.headRadius*1.2} C ${config.headRadius*1.4} ${config.headRadius*0.5} ${config.headRadius*0.8} ${0} ${config.headRadius*0.9} ${-config.headRadius*0.4} Z`} fill="currentColor" stroke="currentColor" strokeWidth={config.outlineThickness} strokeLinejoin="round" roughness={config.roughness} bowing={config.bowing} />
                    {/* Bangs / Top */}
                    <RoughPath d={`M ${-config.headRadius*1.1} ${-config.headRadius*0.1} C ${-config.headRadius*1.2} ${-config.headRadius*1.4} ${config.headRadius*1.2} ${-config.headRadius*1.4} ${config.headRadius*1.1} ${-config.headRadius*0.1} C ${config.headRadius} ${-config.headRadius*0.4} ${-config.headRadius} ${-config.headRadius*0.4} ${-config.headRadius*1.1} ${-config.headRadius*0.1} Z`} fill="currentColor" stroke="currentColor" strokeWidth={config.outlineThickness} strokeLinejoin="round" roughness={config.roughness} bowing={config.bowing} />
                  </g>
                )}
                {config.hairStyle === 'long' && (
                  <RoughPath d={`M ${-config.headRadius*1.1} ${-config.headRadius*0.1} C ${-config.headRadius*1.2} ${-config.headRadius*1.4} ${config.headRadius*1.2} ${-config.headRadius*1.4} ${config.headRadius*1.1} ${-config.headRadius*0.1} C ${config.headRadius*1.2} ${config.headRadius} ${config.headRadius*1.5} ${config.headRadius*2} ${config.headRadius*1.2} ${config.headRadius*2.5} C ${config.headRadius*0.8} ${config.headRadius*2} ${config.headRadius*0.8} ${config.headRadius*1} ${config.headRadius*0.6} ${config.headRadius*0.2} L ${-config.headRadius*0.6} ${config.headRadius*0.2} C ${-config.headRadius*0.8} ${config.headRadius*1} ${-config.headRadius*0.8} ${config.headRadius*2} ${-config.headRadius*1.2} ${config.headRadius*2.5} C ${-config.headRadius*1.5} ${config.headRadius*2} ${-config.headRadius*1.2} ${config.headRadius} ${-config.headRadius*1.1} ${-config.headRadius*0.1} Z`} fill="currentColor" stroke="currentColor" strokeWidth={config.outlineThickness} strokeLinejoin="round" roughness={config.roughness} bowing={config.bowing} />
                )}
                <RoughEllipse
                  cx={0} cy={0}
                  rx={config.headRadius * config.headSquishX}
                  ry={config.headRadius * config.headSquishY}
                  fill="white"
                  stroke="currentColor"
                  strokeWidth={config.outlineThickness}

                  roughness={config.roughness}
                  bowing={config.bowing}
                />
                {config.hairStyle === 'spiky' && (
                  <RoughPath d={`M ${-config.headRadius*1.0} ${-config.headRadius*0.1} L ${-config.headRadius*0.8} ${-config.headRadius*1.5} L ${-config.headRadius*0.3} ${-config.headRadius*0.9} L ${0} ${-config.headRadius*1.8} L ${config.headRadius*0.4} ${-config.headRadius*0.9} L ${config.headRadius*0.9} ${-config.headRadius*1.4} L ${config.headRadius*1.0} ${-config.headRadius*0.1} Z`} fill="currentColor" stroke="currentColor" strokeWidth={config.outlineThickness} strokeLinejoin="round" roughness={config.roughness} bowing={config.bowing} />
                )}
                {config.hairStyle === 'messy' && (
                  <RoughPath d={`M ${-config.headRadius*1.0} ${config.headRadius*0.2} L ${-config.headRadius*1.2} ${-config.headRadius*0.5} L ${-config.headRadius*0.8} ${-config.headRadius*0.4} L ${-config.headRadius*0.9} ${-config.headRadius*1.2} L ${-config.headRadius*0.4} ${-config.headRadius*0.8} L ${-config.headRadius*0.2} ${-config.headRadius*1.6} L ${config.headRadius*0.2} ${-config.headRadius*0.9} L ${config.headRadius*0.6} ${-config.headRadius*1.5} L ${config.headRadius*0.8} ${-config.headRadius*0.7} L ${config.headRadius*1.2} ${-config.headRadius*0.9} L ${config.headRadius*1.0} ${-config.headRadius*0.1} Z`} fill="currentColor" stroke="currentColor" strokeWidth={config.outlineThickness} strokeLinejoin="round" roughness={config.roughness} bowing={config.bowing} />
                )}
                {config.hairStyle === 'short' && (
                  <RoughPath d={`M ${-config.headRadius} ${-config.headRadius*0.1} C ${-config.headRadius*1.1} ${-config.headRadius*1.2} ${config.headRadius*1.1} ${-config.headRadius*1.2} ${config.headRadius} ${-config.headRadius*0.1} C ${config.headRadius*0.8} ${-config.headRadius*0.4} ${config.headRadius*0.4} ${-config.headRadius*0.3} ${0} ${-config.headRadius*0.5} C ${-config.headRadius*0.4} ${-config.headRadius*0.3} ${-config.headRadius*0.8} ${-config.headRadius*0.4} ${-config.headRadius} ${-config.headRadius*0.1} Z`} fill="currentColor" stroke="currentColor" strokeWidth={config.outlineThickness} strokeLinejoin="round" roughness={config.roughness} bowing={config.bowing} />
                )}
                {config.hairStyle === 'curly' && (
                  <RoughPath d={`M ${-config.headRadius*1.0} ${-config.headRadius*0.1} A ${config.headRadius*0.5} ${config.headRadius*0.5} 0 0 1 ${-config.headRadius*0.6} ${-config.headRadius*0.9} A ${config.headRadius*0.5} ${config.headRadius*0.5} 0 0 1 ${-config.headRadius*0.1} ${-config.headRadius*1.2} A ${config.headRadius*0.5} ${config.headRadius*0.5} 0 0 1 ${config.headRadius*0.5} ${-config.headRadius*1.0} A ${config.headRadius*0.5} ${config.headRadius*0.5} 0 0 1 ${config.headRadius*1.0} ${-config.headRadius*0.4} A ${config.headRadius*0.4} ${config.headRadius*0.4} 0 0 1 ${config.headRadius*1.1} ${0} Z`} fill="currentColor" stroke="currentColor" strokeWidth={config.outlineThickness} strokeLinejoin="round" roughness={config.roughness} bowing={config.bowing} />
                )}
                {config.hairStyle === 'bowl' && (
                  <RoughPath d={`M ${-config.headRadius*1.15} ${-config.headRadius*0.1} A ${config.headRadius*1.15} ${config.headRadius*1.15} 0 0 1 ${config.headRadius*1.15} ${-config.headRadius*0.1} Z`} fill="currentColor" stroke="currentColor" strokeWidth={config.outlineThickness} strokeLinejoin="round" roughness={config.roughness} bowing={config.bowing} />
                )}

                {/* Face */}
                {faceScaleX > -0.2 && faceScaleY > -0.2 && (
                  <g transform={`translate(${faceOffsetX}, ${faceOffsetY}) scale(${faceScaleX}, ${faceScaleY})`}>
                    {/* Eyes */}
                    <g>
                      {glabellaOvershoot > 0 && (
                        <g>
                          <RoughPath
                            d={`M -3 ${config.eyebrowOffset - glabellaOvershoot * 0.2} L -3 ${config.eyebrowOffset + glabellaOvershoot * 0.3}`}
                            fill="none" stroke="currentColor" strokeWidth={config.eyebrowThickness * config.outlineThickness * 0.2} strokeLinecap="round" roughness={config.roughness} bowing={config.bowing}
                          />
                          <RoughPath
                            d={`M 3 ${config.eyebrowOffset - glabellaOvershoot * 0.2} L 3 ${config.eyebrowOffset + glabellaOvershoot * 0.3}`}
                            fill="none" stroke="currentColor" strokeWidth={config.eyebrowThickness * config.outlineThickness * 0.2} strokeLinecap="round" roughness={config.roughness} bowing={config.bowing}
                          />
                        </g>
                      )}

                      {/* Left Eye */}
                      <RoughCircle cx={-config.eyeSpacing} cy={0} r={config.eyeSize} fill="currentColor" stroke="none" strokeWidth={0} roughness={config.roughness} bowing={config.bowing} />
                      {config.showEyelidUpper && (
                        <RoughPath
                          d={`M ${-config.eyeSpacing - config.eyeSize * 1.5} ${config.eyelidUpperOffset} Q ${-config.eyeSpacing} ${config.eyelidUpperOffset + config.eyelidUpperCurvature} ${-config.eyeSpacing + config.eyeSize * 1.5} ${config.eyelidUpperOffset}`}
                          fill="none" stroke="currentColor" strokeWidth={config.outlineThickness * 0.4} strokeLinecap="round" roughness={config.roughness} bowing={config.bowing}
                        />
                      )}
                      {config.showEyelidLower && (
                        <RoughPath
                          d={`M ${-config.eyeSpacing - config.eyeSize * 1.2} ${config.eyelidLowerOffset} Q ${-config.eyeSpacing} ${config.eyelidLowerOffset + config.eyelidLowerCurvature} ${-config.eyeSpacing + config.eyeSize * 1.2} ${config.eyelidLowerOffset}`}
                          fill="none" stroke="currentColor" strokeWidth={config.outlineThickness * 0.3} strokeLinecap="round" roughness={config.roughness} bowing={config.bowing}
                        />
                      )}
                      <g transform={`translate(${-config.eyeSpacing}, ${config.eyebrowOffset}) rotate(${-clampedEyebrowRotation})`}>
                        <RoughPath d={`M ${-config.eyeSize * 1.8} 0 L ${config.eyeSize * 1.8} 0 ${glabellaOvershoot > 0 ? `L ${config.eyeSize * 1.8 + 2} -2 L ${config.eyeSize * 1.8 + 4} 2` : ''}`} fill="none" stroke="currentColor" strokeWidth={config.eyebrowThickness * config.outlineThickness * 0.3} strokeLinecap="round" strokeLinejoin="round" roughness={config.roughness} bowing={config.bowing} />
                      </g>

                      {/* Right Eye */}
                      <RoughCircle cx={config.eyeSpacing} cy={0} r={config.eyeSize} fill="currentColor" stroke="none" strokeWidth={0} roughness={config.roughness} bowing={config.bowing} />
                      {config.showEyelidUpper && (
                        <RoughPath
                          d={`M ${config.eyeSpacing - config.eyeSize * 1.5} ${config.eyelidUpperOffset} Q ${config.eyeSpacing} ${config.eyelidUpperOffset + config.eyelidUpperCurvature} ${config.eyeSpacing + config.eyeSize * 1.5} ${config.eyelidUpperOffset}`}
                          fill="none" stroke="currentColor" strokeWidth={config.outlineThickness * 0.4} strokeLinecap="round" roughness={config.roughness} bowing={config.bowing}
                        />
                      )}
                      {config.showEyelidLower && (
                        <RoughPath
                          d={`M ${config.eyeSpacing - config.eyeSize * 1.2} ${config.eyelidLowerOffset} Q ${config.eyeSpacing} ${config.eyelidLowerOffset + config.eyelidLowerCurvature} ${config.eyeSpacing + config.eyeSize * 1.2} ${config.eyelidLowerOffset}`}
                          fill="none" stroke="currentColor" strokeWidth={config.outlineThickness * 0.3} strokeLinecap="round" roughness={config.roughness} bowing={config.bowing}
                        />
                      )}
                      <g transform={`translate(${config.eyeSpacing}, ${config.eyebrowOffset}) rotate(${clampedEyebrowRotation})`}>
                        <RoughPath d={`M ${config.eyeSize * 1.8} 0 L ${-config.eyeSize * 1.8} 0 ${glabellaOvershoot > 0 ? `L ${-config.eyeSize * 1.8 - 2} -2 L ${-config.eyeSize * 1.8 - 4} 2` : ''}`} fill="none" stroke="currentColor" strokeWidth={config.eyebrowThickness * config.outlineThickness * 0.3} strokeLinecap="round" strokeLinejoin="round" roughness={config.roughness} bowing={config.bowing} />
                      </g>
                    </g>
                    {/* Mouth */}
                    <RoughPath
                      d={`M ${-config.mouthWidth/2} ${config.mouthOffset} Q 0 ${config.mouthOffset + 8 * config.mouthScale} ${config.mouthWidth/2} ${config.mouthOffset}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={config.outlineThickness * 0.5}
                      strokeLinecap="round"

                      roughness={config.roughness}
                      bowing={config.bowing}
                    />
                  </g>
                )}
              </g>

              {/* === Accessories === */}
              {config.accessories.map(acc => (
                <g
                  key={acc.id}
                  transform={`translate(${acc.position.x}, ${acc.position.y}) scale(${acc.flipX ? -acc.scale : acc.scale}, ${acc.scale}) rotate(${acc.rotation})`}
                >
                  <text
                    x={0} y={0}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="40"
                    style={{ userSelect: 'none' }}
                  >
                    {acc.emoji}
                  </text>
                </g>
              ))}

              {/* === HANDLES (Excluded from export) === */}
              <g id="rig-handles">
                {!config.hiddenControls.head && (
                  <Handle id="head" pt={rig.head} label="Head Center" color="#ef4444" shape="target" />
                )}
                {!config.hiddenControls.core && (
                  <>
                    <Handle id="pelvis" pt={rig.pelvis} label="Pelvis" color="#ef4444" shape="target" />
                    <Handle id="torsoCurve" pt={rig.torsoCurve} label="Torso Curve" color="#22c55e" shape="diamond" />
                  </>
                )}

                {!config.hiddenControls.arm && (
                  <>
                    <Handle id="leftElbow" pt={rig.leftElbow} label="Left Elbow" color="#a855f7" shape="circle" />
                    <Handle id="rightElbow" pt={rig.rightElbow} label="Right Elbow" color="#a855f7" shape="circle" />
                  </>
                )}

                {!config.hiddenControls.hand && (
                  <>
                    <Handle id="leftHand" pt={rig.leftHand} label="Left Hand" color="#0ea5e9" shape="square" />
                    <Handle id="rightHand" pt={rig.rightHand} label="Right Hand" color="#0ea5e9" shape="square" />
                  </>
                )}

                {!config.hiddenControls.leg && (
                  <>
                    <Handle id="leftKnee" pt={rig.leftKnee} label="Left Knee" color="#a855f7" shape="circle" />
                    <Handle id="rightKnee" pt={rig.rightKnee} label="Right Knee" color="#a855f7" shape="circle" />
                  </>
                )}

                {!config.hiddenControls.feet && (
                  <>
                    <Handle id="leftFoot" pt={rig.leftFoot} label="Left Foot" color="#0ea5e9" shape="square" />
                    <Handle id="rightFoot" pt={rig.rightFoot} label="Right Foot" color="#0ea5e9" shape="square" />
                  </>
                )}

                {!config.hiddenControls.accessories && config.accessories.map(acc => (
                  <React.Fragment key={acc.id}>
                    <Handle id={`acc_${acc.id}`} pt={acc.position} label={`Prop: ${acc.emoji}`} color="#f59e0b" shape="diamond" />
                  </React.Fragment>
                ))}

                {/* Guide Lines */}
                <g stroke="#ffffff" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.3">
                  {!config.hiddenControls.core && (
                    <>
                      <line x1={rig.head.x} y1={rig.head.y} x2={rig.torsoCurve.x} y2={rig.torsoCurve.y} />
                      <line x1={rig.torsoCurve.x} y1={rig.torsoCurve.y} x2={rig.pelvis.x} y2={rig.pelvis.y} />
                      <path d={`M ${rig.head.x} ${rig.head.y} Q ${rig.torsoCurve.x} ${rig.torsoCurve.y} ${rig.pelvis.x} ${rig.pelvis.y}`} fill="none" strokeDasharray="4 4" strokeWidth="1" opacity="0.5" />
                    </>
                  )}

                  {!config.hiddenControls.arm && (
                    <>
                      <line x1={leftShoulder.point.x} y1={leftShoulder.point.y} x2={rig.leftElbow.x} y2={rig.leftElbow.y} />
                      <line x1={rightShoulder.point.x} y1={rightShoulder.point.y} x2={rig.rightElbow.x} y2={rig.rightElbow.y} />
                    </>
                  )}
                  {!config.hiddenControls.hand && (
                    <>
                      <line x1={rig.leftElbow.x} y1={rig.leftElbow.y} x2={rig.leftHand.x} y2={rig.leftHand.y} />
                      <line x1={rig.rightElbow.x} y1={rig.rightElbow.y} x2={rig.rightHand.x} y2={rig.rightHand.y} />
                    </>
                  )}

                  {!config.hiddenControls.leg && (
                    <>
                      <line x1={leftHip.point.x} y1={leftHip.point.y} x2={rig.leftKnee.x} y2={rig.leftKnee.y} />
                      <line x1={rightHip.point.x} y1={rightHip.point.y} x2={rig.rightKnee.x} y2={rig.rightKnee.y} />
                    </>
                  )}
                  {!config.hiddenControls.feet && (
                    <>
                      <line x1={rig.leftKnee.x} y1={rig.leftKnee.y} x2={rig.leftFoot.x} y2={rig.leftFoot.y} />
                      <line x1={rig.rightKnee.x} y1={rig.rightKnee.y} x2={rig.rightFoot.x} y2={rig.rightFoot.y} />
                    </>
                  )}
                </g>
              </g>
            </svg>

            {/* Instruction tooltip overlay */}
            <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-sm text-slate-300 text-xs px-3 py-2 rounded pointer-events-none">
              Drag points to pose character
            </div>
          </div>
          {/* Canvas overlay controls */}
          <div data-no-pan className="absolute bottom-6 right-6 flex flex-col gap-2">
            <button onClick={() => setShowPanel(v => !v)} className="w-9 h-9 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 flex items-center justify-center shadow backdrop-blur-sm" title="Toggle controls">
              <SlidersHorizontal size={16} />
            </button>
            <button onClick={() => setZoom(v => Math.min(v + 0.25, 3))} className="w-9 h-9 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 flex items-center justify-center shadow backdrop-blur-sm text-lg font-bold">+</button>
            <button onClick={() => setZoom(1)} className="w-9 h-9 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 flex items-center justify-center shadow backdrop-blur-sm text-xs font-medium">{Math.round(zoom * 100)}%</button>
            <button onClick={() => setZoom(v => Math.max(v - 0.25, 0.25))} className="w-9 h-9 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 flex items-center justify-center shadow backdrop-blur-sm text-lg font-bold">−</button>
          </div>
          {/* Visibility toggles overlay */}
          <div data-no-pan className="absolute top-6 left-6 flex flex-wrap gap-2">
            {['head', 'core', 'arm', 'hand', 'leg', 'feet', 'accessories'].map(cat => {
              const hidden = config.hiddenControls[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setConfig(prev => ({ ...prev, hiddenControls: { ...prev.hiddenControls, [cat]: !hidden } }))}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors shadow backdrop-blur-sm ${hidden ? 'bg-slate-800/70 text-slate-500' : 'bg-slate-800/90 text-slate-200'}`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              );
            })}
          </div>
        </main>

        {/* Sidebar Controls */}
        {showPanel && <aside className="w-80 border-l border-slate-800 bg-slate-950/80 backdrop-blur-md flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between text-slate-300">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} />
              <h2 className="font-medium">Settings</h2>
            </div>
          </div>
          <div className="flex px-4 pt-2 gap-1 border-b border-slate-800 overflow-x-auto hide-scrollbar">
            {['rig', 'geometry', 'expressions', 'props', 'render'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-3 py-2 text-xs font-medium uppercase tracking-wider border-b-2 transition-colors ${activeTab === tab ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">

            {activeTab === 'rig' && (
              <>
                <ControlSection title="Pivot Points (X, Y)">
              <PointControl label="Head" value={rig.head} onChange={(pt) => setRig({...rig, head: pt})} />
              <PointControl label="Torso Curve" value={rig.torsoCurve} onChange={(pt) => setRig({...rig, torsoCurve: pt})} />
              <PointControl label="Pelvis" value={rig.pelvis} onChange={(pt) => setRig({...rig, pelvis: pt})} />

              <div className="h-px bg-slate-800 my-2" />

              <div className="grid grid-cols-2 gap-3">
                <PointControl label="Left Elbow" value={rig.leftElbow} onChange={(pt) => setRig({...rig, leftElbow: pt})} compact />
                <PointControl label="Right Elbow" value={rig.rightElbow} onChange={(pt) => setRig({...rig, rightElbow: pt})} compact />
                <PointControl label="Left Hand" value={rig.leftHand} onChange={(pt) => setRig({...rig, leftHand: pt})} compact />
                <PointControl label="Right Hand" value={rig.rightHand} onChange={(pt) => setRig({...rig, rightHand: pt})} compact />
              </div>

              <div className="h-px bg-slate-800 my-2" />

              <div className="grid grid-cols-2 gap-3">
                <PointControl label="Left Knee" value={rig.leftKnee} onChange={(pt) => setRig({...rig, leftKnee: pt})} compact />
                <PointControl label="Right Knee" value={rig.rightKnee} onChange={(pt) => setRig({...rig, rightKnee: pt})} compact />
                <PointControl label="Left Foot" value={rig.leftFoot} onChange={(pt) => setRig({...rig, leftFoot: pt})} compact />
                <PointControl label="Right Foot" value={rig.rightFoot} onChange={(pt) => setRig({...rig, rightFoot: pt})} compact />
              </div>
            </ControlSection>

            <ControlSection title="3D Rotations">
              <SliderControl
                label="Core Rotation (Y)"
                value={config.coreRotationY}
                min={-90} max={90}
                onChange={(coreRotationY) => setConfig({ ...config, coreRotationY })}
              />
              <SliderControl
                label="Face Yaw (Y)"
                value={config.headRotationY}
                min={-90} max={90}
                onChange={(headRotationY) => setConfig({ ...config, headRotationY })}
              />
              <SliderControl
                label="Face Pitch (X)"
                value={config.headRotationX}
                min={-90} max={90}
                onChange={(headRotationX) => setConfig({ ...config, headRotationX })}
              />
              <SliderControl
                label="Head Roll (Z)"
                value={config.headRotationZ}
                min={-180} max={180}
                onChange={(headRotationZ) => setConfig({ ...config, headRotationZ })}
              />
            </ControlSection>

            <ControlSection title="Limb Rotations">
              <SliderControl
                label="Left Hand"
                value={config.leftHandRotation}
                min={-180} max={180}
                onChange={(leftHandRotation) => setConfig({ ...config, leftHandRotation })}
              />
              <SliderControl
                label="Right Hand"
                value={config.rightHandRotation}
                min={-180} max={180}
                onChange={(rightHandRotation) => setConfig({ ...config, rightHandRotation })}
              />
              <SliderControl
                label="Left Foot"
                value={config.leftFootRotation}
                min={-180} max={180}
                onChange={(leftFootRotation) => setConfig({ ...config, leftFootRotation })}
              />
              <SliderControl
                label="Right Foot"
                value={config.rightFootRotation}
                min={-180} max={180}
                onChange={(rightFootRotation) => setConfig({ ...config, rightFootRotation })}
              />
            </ControlSection>
            </>
            )}

            {activeTab === 'geometry' && (
            <>
              <ControlSection title="Geometry">
              <div className="text-sm font-medium text-slate-400 mt-2">Smooth Limbs</div>
              <div className="grid grid-cols-2 gap-3 mb-2">
                <ToggleControl label="Left Arm" checked={config.smoothLeftArm} onChange={(v) => setConfig({...config, smoothLeftArm: v})} />
                <ToggleControl label="Right Arm" checked={config.smoothRightArm} onChange={(v) => setConfig({...config, smoothRightArm: v})} />
                <ToggleControl label="Left Leg" checked={config.smoothLeftLeg} onChange={(v) => setConfig({...config, smoothLeftLeg: v})} />
                <ToggleControl label="Right Leg" checked={config.smoothRightLeg} onChange={(v) => setConfig({...config, smoothRightLeg: v})} />
              </div>
              <SliderControl
                label="Hand Radius"
                value={config.handRadius}
                min={2} max={40}
                onChange={(handRadius) => setConfig({ ...config, handRadius })}
              />
              <SliderControl
                label="Foot Radius"
                value={config.footRadius}
                min={2} max={40}
                onChange={(footRadius) => setConfig({ ...config, footRadius })}
              />
              <SliderControl
                label="Chest Width"
                value={config.chestWidth}
                min={10} max={150}
                onChange={(chestWidth) => setConfig({ ...config, chestWidth })}
              />
               <SliderControl
                label="Stomach Width"
                value={config.stomachWidth}
                min={10} max={150}
                onChange={(stomachWidth) => setConfig({ ...config, stomachWidth })}
              />
              <SliderControl
                label="Hip Width"
                value={config.hipWidth}
                min={10} max={150}
                onChange={(hipWidth) => setConfig({ ...config, hipWidth })}
              />
            </ControlSection>

            <ControlSection title="Head & Face">
              <SliderControl
                label="Head Scale"
                value={config.headRadius}
                min={20} max={200}
                onChange={(headRadius) => setConfig({ ...config, headRadius })}
              />
              <SliderControl
                label="Head Squish (Width)"
                value={config.headSquishX}
                min={0.5} max={1.5} step={0.05}
                onChange={(headSquishX) => setConfig({ ...config, headSquishX })}
              />
              <SliderControl
                label="Head Squish (Height)"
                value={config.headSquishY}
                min={0.5} max={1.5} step={0.05}
                onChange={(headSquishY) => setConfig({ ...config, headSquishY })}
              />
              <SliderControl
                label="Eye Size"
                value={config.eyeSize}
                min={1} max={15} step={0.5}
                onChange={(eyeSize) => setConfig({ ...config, eyeSize })}
              />
              <SliderControl
                label="Eye Spacing"
                value={config.eyeSpacing}
                min={5} max={60}
                onChange={(eyeSpacing) => setConfig({ ...config, eyeSpacing })}
              />
            </ControlSection>
            </>
            )}

            {activeTab === 'expressions' && (
            <>
              <ControlSection title="Expression Presets">
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(EXPRESSION_PRESETS).map(preset => (
                    <button
                      key={preset}
                      onClick={() => setConfig({ ...config, ...EXPRESSION_PRESETS[preset] })}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-sm text-center capitalize transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </ControlSection>

              <ControlSection title="Mouth">
                <SliderControl
                  label="Mouth Width"
                  value={config.mouthWidth}
                  min={2} max={40} step={1}
                  onChange={(mouthWidth) => setConfig({ ...config, mouthWidth })}
                />
                <SliderControl
                  label="Smile/Frown"
                  value={config.mouthScale}
                  min={-3} max={3} step={0.1}
                  onChange={(mouthScale) => setConfig({ ...config, mouthScale })}
                />
                <SliderControl
                  label="Mouth Y Offset"
                  value={config.mouthOffset}
                  min={-10} max={40} step={1}
                  onChange={(mouthOffset) => setConfig({ ...config, mouthOffset })}
                />
              </ControlSection>

              <ControlSection title="Eyebrows">
                <SliderControl
                  label="Y Offset"
                  value={config.eyebrowOffset}
                  min={-40} max={10} step={1}
                  onChange={(eyebrowOffset) => setConfig({ ...config, eyebrowOffset })}
                />
                <SliderControl
                  label="Rotation"
                  value={config.eyebrowRotation}
                  min={-45} max={45} step={1}
                  onChange={(eyebrowRotation) => setConfig({ ...config, eyebrowRotation })}
                />
                <SliderControl
                  label="Thickness"
                  value={config.eyebrowThickness}
                  min={0.5} max={10} step={0.5}
                  onChange={(eyebrowThickness) => setConfig({ ...config, eyebrowThickness })}
                />
              </ControlSection>

              <ControlSection title="Eyelids">
                <div className="flex gap-2 mb-2">
                  <ToggleControl label="Upper" checked={config.showEyelidUpper} onChange={(v) => setConfig({...config, showEyelidUpper: v})} />
                  <ToggleControl label="Lower" checked={config.showEyelidLower} onChange={(v) => setConfig({...config, showEyelidLower: v})} />
                </div>
                <SliderControl
                  label="Upper Y Offset"
                  value={config.eyelidUpperOffset}
                  min={-20} max={20} step={1}
                  onChange={(eyelidUpperOffset) => setConfig({ ...config, eyelidUpperOffset })}
                />
                <SliderControl
                  label="Upper Curve"
                  value={config.eyelidUpperCurvature}
                  min={-10} max={10} step={0.5}
                  onChange={(eyelidUpperCurvature) => setConfig({ ...config, eyelidUpperCurvature })}
                />
                <SliderControl
                  label="Lower Y Offset"
                  value={config.eyelidLowerOffset}
                  min={-10} max={20} step={1}
                  onChange={(eyelidLowerOffset) => setConfig({ ...config, eyelidLowerOffset })}
                />
                <SliderControl
                  label="Lower Curve"
                  value={config.eyelidLowerCurvature}
                  min={-10} max={10} step={0.5}
                  onChange={(eyelidLowerCurvature) => setConfig({ ...config, eyelidLowerCurvature })}
                />
              </ControlSection>
            </>
            )}

            {activeTab === 'props' && (
              <>
                <ControlSection title="Hair Style">
                  <div className="grid grid-cols-2 gap-2">
                    {['none', 'spiky', 'bob', 'curly', 'bowl', 'short', 'messy', 'pigtails', 'long'].map(style => (
                      <button
                        key={style}
                        onClick={() => setConfig({...config, hairStyle: style})}
                        className={`py-2 px-3 rounded-md text-sm capitalize border transition-colors ${config.hairStyle === style ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </ControlSection>

                <ControlSection title="Accessories">
                  <div className="flex gap-2 flex-wrap">
                    {['🎩', '🧢', '👑', '👓', '🕶️', '⚔️', '🛡️', '🪄', '💖'].map(emoji => (
                      <button
                        key={emoji}
                        className="w-10 h-10 flex text-xl items-center justify-center bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors shadow-sm"
                        onClick={() => {
                          const id = Math.random().toString(36).substring(2, 9);
                          // Place slightly offset from head
                          const pt = { x: rig.head.x + 30, y: rig.head.y - 30 };
                          setConfig({
                            ...config,
                            accessories: [...config.accessories, { id, emoji, position: pt, scale: 1, rotation: 0, flipX: false }]
                          });
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3 mt-4">
                    {config.accessories.map((acc, index) => (
                      <div key={acc.id} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 space-y-3">
                        <div className="flex justify-between items-center text-slate-300 text-sm">
                          <span className="font-medium">{acc.emoji} Prop</span>
                          <button
                            className="text-red-400 hover:text-red-300 text-xs px-2 py-1 hover:bg-red-400/10 rounded transition-colors"
                            onClick={() => {
                              setConfig({...config, accessories: config.accessories.filter(a => a.id !== acc.id)});
                            }}
                          >
                            Remove
                          </button>
                        </div>
                        <SliderControl
                          label="Scale"
                          value={acc.scale}
                          min={0.5} max={3} step={0.1}
                          onChange={(scale) => {
                            const newAcc = [...config.accessories];
                            newAcc[index].scale = scale;
                            setConfig({...config, accessories: newAcc});
                          }}
                        />
                        <SliderControl
                          label="Rotation"
                          value={acc.rotation}
                          min={-180} max={180} step={5}
                          onChange={(rotation) => {
                            const newAcc = [...config.accessories];
                            newAcc[index].rotation = rotation;
                            setConfig({...config, accessories: newAcc});
                          }}
                        />
                        <ToggleControl
                          label="Flip Horizontal"
                          checked={acc.flipX}
                          onChange={(flipX) => {
                            const newAcc = [...config.accessories];
                            newAcc[index].flipX = flipX;
                            setConfig({...config, accessories: newAcc});
                          }}
                        />
                      </div>
                    ))}
                    {config.accessories.length === 0 && (
                      <div className="text-slate-500 text-sm italic text-center py-4 bg-slate-900/50 rounded-lg border border-slate-800 border-dashed">No props added yet</div>
                    )}
                  </div>
                </ControlSection>
              </>
            )}


            {activeTab === 'render' && (
              <ControlSection title="Render Options">
                <SliderControl
                  label="Outline Size"
                  value={config.outlineThickness}
                  min={1} max={50}
                  onChange={(outlineThickness) => setConfig({ ...config, outlineThickness })}
                />
                <SliderControl
                  label="Roughness"
                  value={config.roughness}
                  min={0} max={4} step={0.1}
                  onChange={(roughness) => setConfig({ ...config, roughness })}
                />
                <SliderControl
                  label="Bowing"
                  value={config.bowing}
                  min={0} max={10} step={0.1}
                  onChange={(bowing) => setConfig({ ...config, bowing })}
                />
              </ControlSection>
            )}

          </div>
        </aside>}
      </div>
    </div>
  );
}

function ControlSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</h3>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

function SliderControl({ label, value, min, max, step = 1, onChange }: { label: string, value: number, min: number, max: number, step?: number, onChange: (val: number) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center text-sm">
        <label className="text-slate-300">{label}</label>
        <span className="text-slate-500 tabular-nums text-xs">{value.toFixed(step < 1 ? 2 : 0)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-blue-500 bg-slate-800 rounded-lg outline-none cursor-pointer h-2 appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full"
      />
    </div>
  );
}

function PointControl({ label, value, compact, onChange }: { label: string, value: Point, compact?: boolean, onChange: (val: Point) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-slate-300 text-sm truncate" title={label}>{label}</label>
      <div className={`flex gap-2 ${compact ? 'flex-col' : ''}`}>
        <label className="flex items-center gap-2 bg-slate-800 px-2 py-1.5 rounded-md flex-1 ring-1 ring-inset ring-slate-700/50 focus-within:ring-blue-500/50 transition-shadow">
          <span className="text-slate-500 text-xs font-mono">X</span>
          <input
            type="number"
            className="bg-transparent w-full outline-none text-slate-300 text-sm tabular-nums"
            value={Math.round(value.x)}
            onChange={(e) => onChange({ ...value, x: Number(e.target.value) })}
          />
        </label>
        <label className="flex items-center gap-2 bg-slate-800 px-2 py-1.5 rounded-md flex-1 ring-1 ring-inset ring-slate-700/50 focus-within:ring-blue-500/50 transition-shadow">
          <span className="text-slate-500 text-xs font-mono">Y</span>
          <input
            type="number"
            className="bg-transparent w-full outline-none text-slate-300 text-sm tabular-nums"
            value={Math.round(value.y)}
            onChange={(e) => onChange({ ...value, y: Number(e.target.value) })}
          />
        </label>
      </div>
    </div>
  );
}

function ToggleControl({ label, checked, onChange }: { label: string, checked: boolean, onChange: (val: boolean) => void }) {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <span className="text-sm text-slate-300 group-hover:text-slate-200 transition-colors">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 ${checked ? 'bg-blue-500' : 'bg-slate-700'}`}
      >
        <span className="sr-only">Toggle {label}</span>
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-4' : 'translate-x-0'}`}
        />
      </button>
    </label>
  );
}
