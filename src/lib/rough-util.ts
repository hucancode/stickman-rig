import rough from 'roughjs/bin/rough';

export const roughGen = rough.generator();

export interface RoughOps {
  d?: string;
  cx?: number;
  cy?: number;
  rx?: number;
  ry?: number;
  r?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  roughness?: number;
  bowing?: number;
}

export interface RoughSubPath {
  d: string;
  fill: string;
  strokeWidth?: number;
}

function commonOpts(o: RoughOps) {
  return {
    stroke: o.stroke || 'currentColor',
    strokeWidth: o.strokeWidth || 1,
    fill: o.fill && o.fill !== 'none' ? o.fill : undefined,
    fillStyle: 'solid',
    roughness: o.roughness ?? 1.5,
    bowing: o.bowing ?? 1,
    seed: 1,
  };
}

export function roughPathPaths(o: RoughOps): RoughSubPath[] {
  if (!o.d) return [];
  try {
    const drawable = roughGen.path(o.d, commonOpts(o));
    return roughGen.toPaths(drawable) as RoughSubPath[];
  } catch {
    return [];
  }
}

export function roughEllipsePaths(o: RoughOps): RoughSubPath[] {
  const drawable = roughGen.ellipse(o.cx!, o.cy!, 2 * o.rx!, 2 * o.ry!, commonOpts(o));
  return roughGen.toPaths(drawable) as RoughSubPath[];
}

export function roughCirclePaths(o: RoughOps): RoughSubPath[] {
  const drawable = roughGen.circle(o.cx!, o.cy!, 2 * o.r!, commonOpts(o));
  return roughGen.toPaths(drawable) as RoughSubPath[];
}
