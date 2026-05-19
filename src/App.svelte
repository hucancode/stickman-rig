<script lang="ts">
  import { Download, SlidersHorizontal, PersonStanding } from '@lucide/svelte';
  import RoughPath from './components/RoughPath.svelte';
  import RoughEllipse from './components/RoughEllipse.svelte';
  import RoughCircle from './components/RoughCircle.svelte';
  import Handle from './components/Handle.svelte';
  import ControlSection from './components/ControlSection.svelte';
  import ScalarSlider from './components/ScalarSlider.svelte';
  import CyclicSlider from './components/CyclicSlider.svelte';
  import PointControl from './components/PointControl.svelte';
  import ToggleControl from './components/ToggleControl.svelte';
  import {
    DEFAULT_CONFIG, DEFAULT_RIG, DEFAULT_HIDDEN_CONTROLS, EXPRESSION_PRESETS, POSE_PRESETS, BODY_TYPE_PRESETS,
    loadSaved, getLimbPath, getBodyPath, computeShouldersHips, computeLimbs,
    computeLimbTransform,
    computeCrossSections, computeTorsoSeams,
    computeFacePaths, computeHeadBaseRoll, computeHeadGeometry,
    type Config, type RigState, type Point, type HiddenControls
  } from './lib/rig';

  type Tab = 'pose' | 'geometry' | 'props' | 'render' | 'expressions';

  let config = $state<Config>(loadSaved('stickman_config', DEFAULT_CONFIG));
  let rig = $state<RigState>(loadSaved('stickman_rig', DEFAULT_RIG));
  let hiddenControls = $state<HiddenControls>(loadSaved('stickman_hidden_controls', DEFAULT_HIDDEN_CONTROLS));
  let autoSave = $state(localStorage.getItem('stickman_autosave') === 'true');

  let activeTab = $state<Tab>('pose');
  let zoom = $state(1);
  let showPanel = $state(true);
  let pan = $state({ x: 0, y: 0 });
  let panRef = $state<{ startX: number; startY: number; panX: number; panY: number } | null>(null);

  let svgEl: SVGSVGElement | null = $state(null);
  let draggingNode = $state<string | null>(null);

  function saveToStorage() {
    localStorage.setItem('stickman_config', JSON.stringify(config));
    localStorage.setItem('stickman_rig', JSON.stringify(rig));
    localStorage.setItem('stickman_hidden_controls', JSON.stringify(hiddenControls));
  }

  $effect(() => {
    void config; void rig; void hiddenControls; void autoSave;
    if (autoSave) saveToStorage();
  });

  function handlePointerDown(node: string, e: PointerEvent) {
    e.stopPropagation();
    e.preventDefault();
    draggingNode = node;
  }

  $effect(() => {
    if (!draggingNode) return;

    function move(e: PointerEvent) {
      if (!draggingNode || !svgEl) return;
      const CTM = svgEl.getScreenCTM();
      if (!CTM) return;
      const newX = (e.clientX - CTM.e) / CTM.a;
      const newY = (e.clientY - CTM.f) / CTM.d;
      if (draggingNode.startsWith('acc_')) {
        const accId = draggingNode.split('_')[1];
        config = {
          ...config,
          accessories: config.accessories.map(a => a.id === accId ? { ...a, position: { x: newX, y: newY } } : a)
        };
      } else if (draggingNode === 'head_yawpitch') {
        const gx = rig.head.x + config.headRadius + 70;
        const gy = rig.head.y;
        const gr = 36;
        const yaw = Math.max(-90, Math.min(90, ((newX - gx) / gr) * 90));
        const pitch = Math.max(-90, Math.min(90, -((newY - gy) / gr) * 90));
        config = { ...config, headRotationY: yaw, headRotationX: pitch };
      } else if (draggingNode === 'head_roll') {
        const gx = rig.head.x + config.headRadius + 70;
        const gy = rig.head.y;
        const ang = Math.atan2(newX - gx, -(newY - gy)) * 180 / Math.PI;
        config = { ...config, headRotationZ: ang };
      } else if (draggingNode.startsWith('rot_')) {
        const id = draggingNode.slice(4);
        const isLeg = id.includes('Foot');
        const limbId = isLeg
          ? (id === 'leftFoot' ? 'leftLeg' : 'rightLeg')
          : (id === 'leftHand' ? 'leftArm' : 'rightArm');
        const limb = limbs.find(l => l.id === limbId);
        if (limb) {
          const dx = newX - limb.end.x;
          const dy = newY - limb.end.y;
          const toeDeg = Math.atan2(dy, dx) * 180 / Math.PI;
          let rot: number;
          let key: keyof Config;
          if (isLeg) {
            const dir = id === 'leftFoot' ? -1 : 1;
            const baseDeg = dir === -1 ? 180 : 0;
            rot = toeDeg - baseDeg;
            key = id === 'leftFoot' ? 'leftFootRotation' : 'rightFootRotation';
          } else {
            const armDeg = Math.atan2(limb.end.y - rig.chest.y, limb.end.x - rig.chest.x) * 180 / Math.PI;
            rot = toeDeg - armDeg;
            key = id === 'leftHand' ? 'leftHandRotation' : 'rightHandRotation';
          }
          while (rot > 180) rot -= 360;
          while (rot < -180) rot += 360;
          config = { ...config, [key]: rot };
        }
      } else if (draggingNode === 'twist_chest' || draggingNode === 'twist_hip') {
        const section = draggingNode === 'twist_chest' ? 'chest' : 'hip';
        const cs = crossSections.find(c => c.section === section && (c.id === 'upperChest' || c.id === 'lowerHip'));
        if (cs) {
          const dx = newX - cs.center.x;
          const dy = newY - cs.center.y;
          const fwdLen = cs.radius * 1.4;
          const proj = (dx * cs.normal.x + dy * cs.normal.y) / fwdLen;
          const clamped = Math.max(-1, Math.min(1, proj));
          const deg = Math.asin(clamped) * 180 / Math.PI;
          const key = section === 'chest' ? 'chestTwist' : 'hipTwist';
          config = { ...config, [key]: deg };
        }
      } else {
        rig = { ...rig, [draggingNode as keyof RigState]: { x: newX, y: newY } };
      }
    }
    function up() { draggingNode = null; }

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  });

  const shouldersHips = $derived(computeShouldersHips(rig, config));
  const limbs = $derived(computeLimbs(rig, config, shouldersHips));
  const backLimbs = $derived(limbs.filter(l => l.z < 0).sort((a, b) => a.z - b.z));
  const frontLimbs = $derived(limbs.filter(l => l.z >= 0).sort((a, b) => a.z - b.z));
  const bodyPath = $derived(getBodyPath(rig, config));
  const crossSections = $derived(computeCrossSections(rig, config));
  const torsoSeams = $derived(computeTorsoSeams(rig, config));

  const yawRad = $derived(config.headRotationY * Math.PI / 180);
  const pitchRad = $derived(config.headRotationX * Math.PI / 180);
  const headGeom = $derived(computeHeadGeometry(config, yawRad, pitchRad));
  const baseHeadRoll = $derived(computeHeadBaseRoll(rig));
  const totalHeadRoll = $derived(baseHeadRoll + config.headRotationZ);

  const face = $derived(computeFacePaths(config, headGeom.rx, headGeom.ry, headGeom.rz, yawRad, pitchRad));

  function exportSvg() {
    if (!svgEl) return;
    const svgClone = svgEl.cloneNode(true) as SVGSVGElement;
    const handlesGroup = svgClone.querySelector('#rig-handles');
    if (handlesGroup) handlesGroup.remove();
    const svgData = new XMLSerializer().serializeToString(svgClone);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'stickman_rig.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function onCanvasPointerDown(e: PointerEvent) {
    if ((e.target as Element).closest('[data-no-pan]')) return;
    panRef = { startX: e.clientX, startY: e.clientY, panX: pan.x, panY: pan.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onCanvasPointerMove(e: PointerEvent) {
    if (!panRef) return;
    pan = { x: panRef.panX + e.clientX - panRef.startX, y: panRef.panY + e.clientY - panRef.startY };
  }
  function onCanvasPointerUp() { panRef = null; }

  function setRigPoint(key: keyof RigState, pt: Point) {
    rig = { ...rig, [key]: pt };
  }

  function updateConfig<K extends keyof Config>(key: K, value: Config[K]) {
    config = { ...config, [key]: value };
  }

  function toggleHidden(cat: string) {
    hiddenControls = { ...hiddenControls, [cat]: !hiddenControls[cat] };
  }

  function applyExpression(name: string) {
    config = { ...config, ...EXPRESSION_PRESETS[name] };
  }

  function applyPose(name: string) {
    const preset = POSE_PRESETS[name];
    rig = { ...preset.rig };
    config = { ...config, ...preset.config };
  }

  function applyBodyType(name: string) {
    config = { ...config, ...BODY_TYPE_PRESETS[name] };
  }

  function addAccessory(emoji: string) {
    const id = Math.random().toString(36).substring(2, 9);
    const pt = { x: rig.head.x + 30, y: rig.head.y - 30 };
    config = {
      ...config,
      accessories: [...config.accessories, { id, emoji, position: pt, scale: 1, rotation: 0, flipX: false }]
    };
  }

  function removeAccessory(id: string) {
    config = { ...config, accessories: config.accessories.filter(a => a.id !== id) };
  }

  function updateAccessory(id: string, patch: Partial<{ scale: number; rotation: number; flipX: boolean }>) {
    config = {
      ...config,
      accessories: config.accessories.map(a => a.id === id ? { ...a, ...patch } : a)
    };
  }

  const visibilityCats = ['head', 'core', 'arm', 'hand', 'leg', 'feet', 'accessories'];
  const tabs: Tab[] = ['pose', 'geometry', 'expressions', 'props', 'render'];
  const emojis = ['🎩', '🧢', '👑', '👓', '🕶️', '💖'];
</script>

<div class="h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 overflow-hidden">
  <header class="h-16 border-b border-slate-800 flex items-center px-6 justify-between shrink-0 bg-slate-950/50 backdrop-blur-md">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
        <PersonStanding size={18} />
      </div>
      <h1 class="font-semibold tracking-tight text-slate-200">Stickman</h1>
    </div>
    <div class="flex items-center gap-4">
      <label class="flex items-center gap-2 text-sm text-slate-400 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={autoSave}
          onchange={(e) => { autoSave = (e.currentTarget as HTMLInputElement).checked; localStorage.setItem('stickman_autosave', String(autoSave)); }}
          class="accent-blue-500"
        />
        Auto save
      </label>
      <button
        onclick={saveToStorage}
        class="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md font-medium transition-colors"
      >Save</button>
      <button
        onclick={exportSvg}
        class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md font-medium transition-colors shadow-sm shadow-blue-900/50"
      >
        <Download size={18} />
        <span>Export SVG</span>
      </button>
    </div>
  </header>

  <div class="flex flex-1 overflow-hidden">
    <main
      class="flex-1 relative overflow-hidden grid place-items-center bg-slate-900"
      style:cursor={panRef ? 'grabbing' : 'grab'}
      onpointerdown={onCanvasPointerDown}
      onpointermove={onCanvasPointerMove}
      onpointerup={onCanvasPointerUp}
      role="presentation"
    >
      <div
        data-no-pan
        class="bg-slate-50 w-full max-w-4xl aspect-[4/3] rounded-xl shadow-2xl shadow-black/50 overflow-hidden ring-1 ring-white/10 flex items-center justify-center relative touch-none"
        style:transform={`translate(${pan.x}px, ${pan.y}px) scale(${zoom})`}
        style:transform-origin="center center"
      >
        <svg
          bind:this={svgEl}
          viewBox="0 0 800 800"
          class="w-full h-full text-slate-900 select-none"
          style:touch-action="none"
        >
          {#each backLimbs as limb (limb.id)}
            {@const lt = computeLimbTransform(limb, rig, config)}
            <g stroke="currentColor" stroke-width={config.outlineThickness} stroke-linecap="round" stroke-linejoin="round">
              <RoughPath d={getLimbPath(limb.start, limb.joint, limb.end, lt.isSmooth)} fill="none" strokeWidth={config.outlineThickness} roughness={config.roughness} />
              <g transform={lt.transform}>
                <RoughPath d={lt.pathD} fill="white" strokeWidth={config.outlineThickness} roughness={config.roughness} />
              </g>
            </g>
          {/each}

          <RoughPath
            d={bodyPath}
            fill="white"
            stroke="currentColor"
            strokeWidth={config.outlineThickness}
            strokeLinecap="round"
            strokeLinejoin="round"
            roughness={config.roughness}
                     />

          {#each torsoSeams as seam (seam.id)}
            {#if seam.back}
              <path d={seam.back} fill="none" stroke="currentColor" stroke-width={config.outlineThickness * 0.45} stroke-dasharray="5 3" stroke-linecap="round" opacity="0.35" />
            {/if}
            {#if seam.front}
              <path d={seam.front} fill="none" stroke="currentColor" stroke-width={config.outlineThickness * 0.6} stroke-linecap="round" opacity="0.75" />
            {/if}
          {/each}

          {#each frontLimbs as limb (limb.id)}
            {@const lt = computeLimbTransform(limb, rig, config)}
            <g stroke="currentColor" stroke-width={config.outlineThickness} stroke-linecap="round" stroke-linejoin="round">
              <RoughPath d={getLimbPath(limb.start, limb.joint, limb.end, lt.isSmooth)} fill="none" strokeWidth={config.outlineThickness} roughness={config.roughness} />
              <g transform={lt.transform}>
                <RoughPath d={lt.pathD} fill="white" strokeWidth={config.outlineThickness} roughness={config.roughness} />
              </g>
            </g>
          {/each}

          <g transform={`translate(${rig.head.x}, ${rig.head.y}) rotate(${totalHeadRoll})`}>
            <RoughEllipse
              cx={0} cy={0}
              rx={headGeom.rxView}
              ry={headGeom.ryView}
              fill="white"
              stroke="currentColor"
              strokeWidth={config.outlineThickness}
              roughness={config.roughness}
                         />

            {#if face.glabellaOvershoot > 0 && face.leftGlabella}
              <RoughPath d={face.leftGlabella} fill="none" stroke="currentColor" strokeWidth={config.eyebrowThickness * config.outlineThickness * 0.2} strokeLinecap="round" roughness={config.roughness} />
            {/if}
            {#if face.glabellaOvershoot > 0 && face.rightGlabella}
              <RoughPath d={face.rightGlabella} fill="none" stroke="currentColor" strokeWidth={config.eyebrowThickness * config.outlineThickness * 0.2} strokeLinecap="round" roughness={config.roughness} />
            {/if}

            <defs>
              <clipPath id="eye-clip-left"><path d={face.leftEyeClip} /></clipPath>
              <clipPath id="eye-clip-right"><path d={face.rightEyeClip} /></clipPath>
            </defs>
            {#if face.leftEye.visible}
              <g clip-path="url(#eye-clip-left)">
                <RoughCircle cx={face.leftEye.x} cy={face.leftEye.y} r={config.eyeSize} fill="currentColor" stroke="none" strokeWidth={0} roughness={config.roughness} />
              </g>
            {/if}
            {#if face.rightEye.visible}
              <g clip-path="url(#eye-clip-right)">
                <RoughCircle cx={face.rightEye.x} cy={face.rightEye.y} r={config.eyeSize} fill="currentColor" stroke="none" strokeWidth={0} roughness={config.roughness} />
              </g>
            {/if}

            {#if config.showEyelidUpper && face.leftUpperLid}
              <RoughPath d={face.leftUpperLid} fill="none" stroke="currentColor" strokeWidth={config.outlineThickness * 0.4} strokeLinecap="round" roughness={config.roughness} />
            {/if}
            {#if config.showEyelidUpper && face.rightUpperLid}
              <RoughPath d={face.rightUpperLid} fill="none" stroke="currentColor" strokeWidth={config.outlineThickness * 0.4} strokeLinecap="round" roughness={config.roughness} />
            {/if}
            {#if config.showEyelidLower && face.leftLowerLid}
              <RoughPath d={face.leftLowerLid} fill="none" stroke="currentColor" strokeWidth={config.outlineThickness * 0.3} strokeLinecap="round" roughness={config.roughness} />
            {/if}
            {#if config.showEyelidLower && face.rightLowerLid}
              <RoughPath d={face.rightLowerLid} fill="none" stroke="currentColor" strokeWidth={config.outlineThickness * 0.3} strokeLinecap="round" roughness={config.roughness} />
            {/if}

            {#if face.leftBrow}
              <RoughPath d={face.leftBrow} fill="none" stroke="currentColor" strokeWidth={config.eyebrowThickness * config.outlineThickness * 0.3} strokeLinecap="round" strokeLinejoin="round" roughness={config.roughness} />
            {/if}
            {#if face.rightBrow}
              <RoughPath d={face.rightBrow} fill="none" stroke="currentColor" strokeWidth={config.eyebrowThickness * config.outlineThickness * 0.3} strokeLinecap="round" strokeLinejoin="round" roughness={config.roughness} />
            {/if}

            {#if face.mouth}
              <RoughPath d={face.mouth} fill="none" stroke="currentColor" strokeWidth={config.outlineThickness * 0.5} strokeLinecap="round" roughness={config.roughness} />
            {/if}
          </g>

          {#each config.accessories as acc (acc.id)}
            <g transform={`translate(${acc.position.x}, ${acc.position.y}) scale(${acc.flipX ? -acc.scale : acc.scale}, ${acc.scale}) rotate(${acc.rotation})`}>
              <text x={0} y={0} text-anchor="middle" dominant-baseline="central" font-size="40" style="user-select: none">{acc.emoji}</text>
            </g>
          {/each}

          <g id="rig-handles">
            {#if !hiddenControls.head}
              <Handle id="head" pt={rig.head} label="Head Center" color="#ef4444" shape="target" dragging={draggingNode === 'head'} onPointerDown={handlePointerDown} />

              {@const gx = rig.head.x + config.headRadius + 70}
              {@const gy = rig.head.y}
              {@const gr = 36}
              {@const gOuter = gr * 1.45}
              {@const yawNorm = Math.max(-1, Math.min(1, config.headRotationY / 90))}
              {@const pitchNorm = Math.max(-1, Math.min(1, -config.headRotationX / 90))}
              {@const rollRad = config.headRotationZ * Math.PI / 180}
              {@const rollX = gx + Math.sin(rollRad) * gOuter}
              {@const rollY = gy - Math.cos(rollRad) * gOuter}
              <g>
                <circle cx={gx} cy={gy} r={gOuter} fill="none" stroke="#a78bfa" stroke-width="1" stroke-dasharray="2 3" opacity="0.55" pointer-events="none" />
                <rect x={gx - gr} y={gy - gr} width={2 * gr} height={2 * gr} rx="6"
                      fill="rgba(15,23,42,0.35)" stroke="#64748b" stroke-width="1" stroke-dasharray="3 2" opacity="0.7" pointer-events="none" />
                <line x1={gx - gr} y1={gy} x2={gx + gr} y2={gy} stroke="#475569" stroke-width="0.5" opacity="0.6" pointer-events="none" />
                <line x1={gx} y1={gy - gr} x2={gx} y2={gy + gr} stroke="#475569" stroke-width="0.5" opacity="0.6" pointer-events="none" />
                <line x1={gx} y1={gy} x2={gx + yawNorm * gr} y2={gy + pitchNorm * gr}
                      stroke="#f59e0b" stroke-width="1.5" opacity="0.7" pointer-events="none" />
                <circle cx={gx + yawNorm * gr} cy={gy + pitchNorm * gr} r="7"
                        fill={draggingNode === 'head_yawpitch' ? '#fbbf24' : '#f59e0b'}
                        stroke="white" stroke-width="1.5"
                        style="cursor: grab"
                        onpointerdown={(e) => handlePointerDown('head_yawpitch', e)} />
                <circle cx={rollX} cy={rollY} r="6"
                        fill={draggingNode === 'head_roll' ? '#c4b5fd' : '#8b5cf6'}
                        stroke="white" stroke-width="1.5"
                        style="cursor: grab"
                        onpointerdown={(e) => handlePointerDown('head_roll', e)} />
                <text x={gx} y={gy - gOuter - 6} text-anchor="middle" font-size="9" fill="#94a3b8" pointer-events="none">head rot</text>
              </g>
            {/if}
            {#if !hiddenControls.core}
              <Handle id="chest" pt={rig.chest} label="Chest" color="#22c55e" shape="diamond" dragging={draggingNode === 'chest'} onPointerDown={handlePointerDown} />
              <Handle id="hip" pt={rig.hip} label="Hip" color="#ef4444" shape="target" dragging={draggingNode === 'hip'} onPointerDown={handlePointerDown} />

              {#each crossSections as cs (cs.id)}
                {@const angleDeg = Math.atan2(cs.normal.y, cs.normal.x) * 180 / Math.PI}
                {@const twistRad = cs.twistDeg * Math.PI / 180}
                {@const sinT = Math.sin(twistRad)}
                {@const cosT = Math.cos(twistRad)}
                {@const fwdLen = cs.radius * 1.4}
                {@const fwdX = cs.normal.x * sinT * fwdLen}
                {@const fwdY = cs.normal.y * sinT * fwdLen}
                {@const ringColor = cs.section === 'chest' ? '#22c55e' : '#0ea5e9'}
                {@const draggable = cs.id === 'upperChest' || cs.id === 'lowerHip'}
                {@const dragId = cs.section === 'chest' ? 'twist_chest' : 'twist_hip'}
                <g opacity="0.85">
                  <ellipse
                    cx={cs.center.x} cy={cs.center.y}
                    rx={cs.radius} ry={cs.radius * 0.22}
                    transform={`rotate(${angleDeg} ${cs.center.x} ${cs.center.y})`}
                    fill="none" stroke={ringColor} stroke-width="1.5" stroke-dasharray="3 2"
                    pointer-events="none"
                  />
                  <line x1={cs.center.x} y1={cs.center.y} x2={cs.center.x + fwdX} y2={cs.center.y + fwdY}
                        stroke="#f59e0b" stroke-width="2" pointer-events="none" />
                  {#if draggable}
                    <circle cx={cs.center.x + fwdX} cy={cs.center.y + fwdY} r="7"
                            fill={cosT >= 0 ? '#f59e0b' : 'transparent'} stroke="#f59e0b" stroke-width="2"
                            style="cursor: grab"
                            onpointerdown={(e) => handlePointerDown(dragId, e)} />
                  {:else}
                    <circle cx={cs.center.x + fwdX} cy={cs.center.y + fwdY} r="3.5"
                            fill={cosT >= 0 ? '#f59e0b' : 'none'} stroke="#f59e0b" stroke-width="1.5"
                            pointer-events="none" />
                  {/if}
                </g>
              {/each}
            {/if}
            {#if !hiddenControls.arm}
              <Handle id="leftElbow" pt={rig.leftElbow} label="Left Elbow" color="#a855f7" shape="circle" dragging={draggingNode === 'leftElbow'} onPointerDown={handlePointerDown} />
              <Handle id="rightElbow" pt={rig.rightElbow} label="Right Elbow" color="#a855f7" shape="circle" dragging={draggingNode === 'rightElbow'} onPointerDown={handlePointerDown} />
            {/if}
            {#if !hiddenControls.hand}
              <Handle id="leftHand" pt={rig.leftHand} label="Left Hand" color="#0ea5e9" shape="square" dragging={draggingNode === 'leftHand'} onPointerDown={handlePointerDown} />
              <Handle id="rightHand" pt={rig.rightHand} label="Right Hand" color="#0ea5e9" shape="square" dragging={draggingNode === 'rightHand'} onPointerDown={handlePointerDown} />

              {#each [{ id: 'leftHand', pt: rig.leftHand, rot: config.leftHandRotation }, { id: 'rightHand', pt: rig.rightHand, rot: config.rightHandRotation }] as h (h.id)}
                {@const armDeg = Math.atan2(h.pt.y - rig.chest.y, h.pt.x - rig.chest.x) * 180 / Math.PI}
                {@const toeRad = (armDeg + h.rot) * Math.PI / 180}
                {@const ringR = config.handRadius * 2.2 + 8}
                {@const hx = h.pt.x + Math.cos(toeRad) * ringR}
                {@const hy = h.pt.y + Math.sin(toeRad) * ringR}
                <g opacity="0.85">
                  <circle cx={h.pt.x} cy={h.pt.y} r={ringR} fill="none" stroke="#0ea5e9" stroke-width="0.8" stroke-dasharray="2 3" opacity="0.5" pointer-events="none" />
                  <line x1={h.pt.x} y1={h.pt.y} x2={hx} y2={hy} stroke="#0ea5e9" stroke-width="1" opacity="0.6" pointer-events="none" />
                  <circle cx={hx} cy={hy} r="6"
                          fill={draggingNode === `rot_${h.id}` ? '#7dd3fc' : '#0ea5e9'}
                          stroke="white" stroke-width="1.5"
                          style="cursor: grab"
                          onpointerdown={(e) => handlePointerDown(`rot_${h.id}`, e)} />
                </g>
              {/each}
            {/if}
            {#if !hiddenControls.leg}
              <Handle id="leftKnee" pt={rig.leftKnee} label="Left Knee" color="#a855f7" shape="circle" dragging={draggingNode === 'leftKnee'} onPointerDown={handlePointerDown} />
              <Handle id="rightKnee" pt={rig.rightKnee} label="Right Knee" color="#a855f7" shape="circle" dragging={draggingNode === 'rightKnee'} onPointerDown={handlePointerDown} />
            {/if}
            {#if !hiddenControls.feet}
              <Handle id="leftFoot" pt={rig.leftFoot} label="Left Foot" color="#0ea5e9" shape="square" dragging={draggingNode === 'leftFoot'} onPointerDown={handlePointerDown} />
              <Handle id="rightFoot" pt={rig.rightFoot} label="Right Foot" color="#0ea5e9" shape="square" dragging={draggingNode === 'rightFoot'} onPointerDown={handlePointerDown} />

              {#each [{ id: 'leftFoot', pt: rig.leftFoot, rot: config.leftFootRotation, dir: -1 }, { id: 'rightFoot', pt: rig.rightFoot, rot: config.rightFootRotation, dir: 1 }] as f (f.id)}
                {@const baseDeg = f.dir === -1 ? 180 : 0}
                {@const toeRad = (baseDeg + f.rot) * Math.PI / 180}
                {@const ringR = config.footRadius * 2.2 + 8}
                {@const fx = f.pt.x + Math.cos(toeRad) * ringR}
                {@const fy = f.pt.y + Math.sin(toeRad) * ringR}
                <g opacity="0.85">
                  <circle cx={f.pt.x} cy={f.pt.y} r={ringR} fill="none" stroke="#0ea5e9" stroke-width="0.8" stroke-dasharray="2 3" opacity="0.5" pointer-events="none" />
                  <line x1={f.pt.x} y1={f.pt.y} x2={fx} y2={fy} stroke="#0ea5e9" stroke-width="1" opacity="0.6" pointer-events="none" />
                  <circle cx={fx} cy={fy} r="6"
                          fill={draggingNode === `rot_${f.id}` ? '#7dd3fc' : '#0ea5e9'}
                          stroke="white" stroke-width="1.5"
                          style="cursor: grab"
                          onpointerdown={(e) => handlePointerDown(`rot_${f.id}`, e)} />
                </g>
              {/each}
            {/if}
            {#if !hiddenControls.accessories}
              {#each config.accessories as acc (acc.id)}
                <Handle id={`acc_${acc.id}`} pt={acc.position} label={`Prop: ${acc.emoji}`} color="#f59e0b" shape="diamond" dragging={draggingNode === `acc_${acc.id}`} onPointerDown={handlePointerDown} />
              {/each}
            {/if}

            <g stroke="#ffffff" stroke-width="0.5" stroke-dasharray="2 3" opacity="0.3">
              {#if !hiddenControls.core}
                <line x1={rig.head.x} y1={rig.head.y} x2={rig.chest.x} y2={rig.chest.y} />
                <line x1={rig.chest.x} y1={rig.chest.y} x2={rig.hip.x} y2={rig.hip.y} />
                <path d={`M ${rig.head.x} ${rig.head.y} Q ${rig.chest.x} ${rig.chest.y} ${rig.hip.x} ${rig.hip.y}`} fill="none" stroke-dasharray="4 4" stroke-width="1" opacity="0.5" />
              {/if}
              {#if !hiddenControls.arm}
                <line x1={shouldersHips.leftShoulder.point.x} y1={shouldersHips.leftShoulder.point.y} x2={rig.leftElbow.x} y2={rig.leftElbow.y} />
                <line x1={shouldersHips.rightShoulder.point.x} y1={shouldersHips.rightShoulder.point.y} x2={rig.rightElbow.x} y2={rig.rightElbow.y} />
              {/if}
              {#if !hiddenControls.hand}
                <line x1={rig.leftElbow.x} y1={rig.leftElbow.y} x2={rig.leftHand.x} y2={rig.leftHand.y} />
                <line x1={rig.rightElbow.x} y1={rig.rightElbow.y} x2={rig.rightHand.x} y2={rig.rightHand.y} />
              {/if}
              {#if !hiddenControls.leg}
                <line x1={shouldersHips.leftHip.point.x} y1={shouldersHips.leftHip.point.y} x2={rig.leftKnee.x} y2={rig.leftKnee.y} />
                <line x1={shouldersHips.rightHip.point.x} y1={shouldersHips.rightHip.point.y} x2={rig.rightKnee.x} y2={rig.rightKnee.y} />
              {/if}
              {#if !hiddenControls.feet}
                <line x1={rig.leftKnee.x} y1={rig.leftKnee.y} x2={rig.leftFoot.x} y2={rig.leftFoot.y} />
                <line x1={rig.rightKnee.x} y1={rig.rightKnee.y} x2={rig.rightFoot.x} y2={rig.rightFoot.y} />
              {/if}
            </g>
          </g>
        </svg>

        <div class="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-sm text-slate-300 text-xs px-3 py-2 rounded pointer-events-none">
          Drag points to pose character
        </div>
      </div>

      <div data-no-pan class="absolute bottom-6 right-6 flex flex-col gap-2">
        <button onclick={() => showPanel = !showPanel} class="w-9 h-9 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 flex items-center justify-center shadow backdrop-blur-sm" title="Toggle controls">
          <SlidersHorizontal size={16} />
        </button>
        <button onclick={() => zoom = Math.min(zoom + 0.25, 3)} class="w-9 h-9 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 flex items-center justify-center shadow backdrop-blur-sm text-lg font-bold">+</button>
        <button onclick={() => zoom = 1} class="w-9 h-9 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 flex items-center justify-center shadow backdrop-blur-sm text-xs font-medium">{Math.round(zoom * 100)}%</button>
        <button onclick={() => zoom = Math.max(zoom - 0.25, 0.25)} class="w-9 h-9 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 flex items-center justify-center shadow backdrop-blur-sm text-lg font-bold">−</button>
      </div>

      <div data-no-pan class="absolute top-6 left-6 flex flex-wrap gap-2">
        {#each visibilityCats as cat (cat)}
          {@const hidden = hiddenControls[cat]}
          <button
            onclick={() => toggleHidden(cat)}
            class="px-2.5 py-1 rounded text-xs font-medium transition-colors shadow backdrop-blur-sm {hidden ? 'bg-slate-800/70 text-slate-500' : 'bg-slate-800/90 text-slate-200'}"
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        {/each}
      </div>
    </main>

    {#if showPanel}
      <aside class="w-80 border-l border-slate-800 bg-slate-950/80 backdrop-blur-md flex flex-col shrink-0">
        <div class="p-4 border-b border-slate-800 flex items-center justify-between text-slate-300">
          <div class="flex items-center gap-2">
            <SlidersHorizontal size={18} />
            <h2 class="font-medium">Settings</h2>
          </div>
        </div>
        <div class="flex px-4 pt-2 gap-1 border-b border-slate-800 overflow-x-auto hide-scrollbar">
          {#each tabs as tab (tab)}
            <button
              onclick={() => activeTab = tab}
              class="px-3 py-2 text-xs font-medium uppercase tracking-wider border-b-2 transition-colors {activeTab === tab ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'}"
            >{tab}</button>
          {/each}
        </div>

        <div class="flex-1 overflow-y-auto p-4 space-y-6">
          {#if activeTab === 'pose'}
            <ControlSection title="Pose Presets">
              <div class="grid grid-cols-2 gap-2">
                {#each Object.keys(POSE_PRESETS) as preset (preset)}
                  <button
                    onclick={() => applyPose(preset)}
                    class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-sm text-center capitalize transition-colors"
                  >{preset}</button>
                {/each}
              </div>
            </ControlSection>

            <ControlSection title="3D Rotations">
              <ScalarSlider label="Chest Twist" value={config.chestTwist} min={-90} max={90} onChange={(v) => updateConfig('chestTwist', v)} />
              <ScalarSlider label="Hip Twist" value={config.hipTwist} min={-90} max={90} onChange={(v) => updateConfig('hipTwist', v)} />
              <ScalarSlider label="Twist Falloff" value={config.twistFalloff} min={0} max={1} step={0.05} onChange={(v) => updateConfig('twistFalloff', v)} />
              <ScalarSlider label="Face Yaw (Y)" value={config.headRotationY} min={-90} max={90} onChange={(v) => updateConfig('headRotationY', v)} />
              <ScalarSlider label="Face Pitch (X)" value={config.headRotationX} min={-90} max={90} onChange={(v) => updateConfig('headRotationX', v)} />
              <CyclicSlider label="Head Roll (Z)" value={config.headRotationZ} min={-180} max={180} onChange={(v) => updateConfig('headRotationZ', v)} />
            </ControlSection>

            <ControlSection title="Limb Rotations">
              <CyclicSlider label="Left Hand" value={config.leftHandRotation} min={-180} max={180} onChange={(v) => updateConfig('leftHandRotation', v)} />
              <CyclicSlider label="Right Hand" value={config.rightHandRotation} min={-180} max={180} onChange={(v) => updateConfig('rightHandRotation', v)} />
              <CyclicSlider label="Left Foot" value={config.leftFootRotation} min={-180} max={180} onChange={(v) => updateConfig('leftFootRotation', v)} />
              <CyclicSlider label="Right Foot" value={config.rightFootRotation} min={-180} max={180} onChange={(v) => updateConfig('rightFootRotation', v)} />
            </ControlSection>
          {/if}

          {#if activeTab === 'geometry'}
            <ControlSection title="Body Type">
              <div class="grid grid-cols-2 gap-2">
                {#each Object.keys(BODY_TYPE_PRESETS) as preset (preset)}
                  <button
                    onclick={() => applyBodyType(preset)}
                    class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-sm text-center capitalize transition-colors"
                  >{preset}</button>
                {/each}
              </div>
            </ControlSection>

            <ControlSection title="Body">
              <div class="text-sm font-medium text-slate-400 mt-2">Smooth Limbs</div>
              <div class="grid grid-cols-2 gap-3 mb-2">
                <ToggleControl label="Left Arm" checked={config.smoothLeftArm} onChange={(v) => updateConfig('smoothLeftArm', v)} />
                <ToggleControl label="Right Arm" checked={config.smoothRightArm} onChange={(v) => updateConfig('smoothRightArm', v)} />
                <ToggleControl label="Left Leg" checked={config.smoothLeftLeg} onChange={(v) => updateConfig('smoothLeftLeg', v)} />
                <ToggleControl label="Right Leg" checked={config.smoothRightLeg} onChange={(v) => updateConfig('smoothRightLeg', v)} />
              </div>
              <ScalarSlider label="Hand Radius" value={config.handRadius} min={2} max={40} onChange={(v) => updateConfig('handRadius', v)} />
              <ScalarSlider label="Foot Radius" value={config.footRadius} min={2} max={40} onChange={(v) => updateConfig('footRadius', v)} />
              <ScalarSlider label="Neck Width" value={config.neckWidth} min={5} max={150} onChange={(v) => updateConfig('neckWidth', v)} />
              <ScalarSlider label="Chest Width" value={config.chestWidth} min={10} max={150} onChange={(v) => updateConfig('chestWidth', v)} />
              <ScalarSlider label="Hip Width" value={config.hipWidth} min={10} max={150} onChange={(v) => updateConfig('hipWidth', v)} />
            </ControlSection>

            <ControlSection title="Head & Face">
              <ScalarSlider label="Head Scale" value={config.headRadius} min={20} max={200} onChange={(v) => updateConfig('headRadius', v)} />
              <ScalarSlider label="Head Squash/Stretch" value={config.headSquash} min={-1} max={1} step={0.05} onChange={(v) => updateConfig('headSquash', v)} />
              <ScalarSlider label="Eye Size" value={config.eyeSize} min={1} max={15} step={0.5} onChange={(v) => updateConfig('eyeSize', v)} />
              <ScalarSlider label="Eye Spacing" value={config.eyeSpacing} min={5} max={60} onChange={(v) => updateConfig('eyeSpacing', v)} />
            </ControlSection>
          {/if}

          {#if activeTab === 'expressions'}
            <ControlSection title="Expression Presets">
              <div class="grid grid-cols-2 gap-2">
                {#each Object.keys(EXPRESSION_PRESETS) as preset (preset)}
                  <button
                    onclick={() => applyExpression(preset)}
                    class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-sm text-center capitalize transition-colors"
                  >{preset}</button>
                {/each}
              </div>
            </ControlSection>

            <ControlSection title="Mouth">
              <ScalarSlider label="Mouth Width" value={config.mouthWidth} min={2} max={40} step={1} onChange={(v) => updateConfig('mouthWidth', v)} />
              <ScalarSlider label="Smile/Frown" value={config.mouthScale} min={-3} max={3} step={0.1} onChange={(v) => updateConfig('mouthScale', v)} />
              <ScalarSlider label="Mouth Y Offset" value={config.mouthOffset} min={-10} max={40} step={1} onChange={(v) => updateConfig('mouthOffset', v)} />
            </ControlSection>

            <ControlSection title="Eyebrows">
              <ScalarSlider label="Y Offset" value={config.eyebrowOffset} min={-40} max={10} step={1} onChange={(v) => updateConfig('eyebrowOffset', v)} />
              <ScalarSlider label="Angry/Relax" value={config.eyebrowRotation} min={-45} max={45} step={1} onChange={(v) => updateConfig('eyebrowRotation', v)} />
              <ScalarSlider label="Thickness" value={config.eyebrowThickness} min={0.5} max={10} step={0.5} onChange={(v) => updateConfig('eyebrowThickness', v)} />
            </ControlSection>

            <ControlSection title="Eyelids">
              <div class="flex gap-2 mb-2">
                <ToggleControl label="Upper" checked={config.showEyelidUpper} onChange={(v) => updateConfig('showEyelidUpper', v)} />
                <ToggleControl label="Lower" checked={config.showEyelidLower} onChange={(v) => updateConfig('showEyelidLower', v)} />
              </div>
              <ScalarSlider label="Openness" value={config.eyelidOpenness} min={0} max={20} step={0.5} onChange={(v) => updateConfig('eyelidOpenness', v)} />
              <ScalarSlider label="Curve" value={config.eyelidCurve} min={-10} max={10} step={0.5} onChange={(v) => updateConfig('eyelidCurve', v)} />
            </ControlSection>
          {/if}

          {#if activeTab === 'props'}
            <ControlSection title="Accessories">
              <div class="flex gap-2 flex-wrap">
                {#each emojis as emoji (emoji)}
                  <button
                    class="w-10 h-10 flex text-xl items-center justify-center bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors shadow-sm"
                    onclick={() => addAccessory(emoji)}
                  >{emoji}</button>
                {/each}
              </div>

              <div class="space-y-3 mt-4">
                {#each config.accessories as acc (acc.id)}
                  <div class="bg-slate-800/50 p-3 rounded-lg border border-slate-700 space-y-3">
                    <div class="flex justify-between items-center text-slate-300 text-sm">
                      <span class="font-medium">{acc.emoji} Prop</span>
                      <button
                        class="text-red-400 hover:text-red-300 text-xs px-2 py-1 hover:bg-red-400/10 rounded transition-colors"
                        onclick={() => removeAccessory(acc.id)}
                      >Remove</button>
                    </div>
                    <ScalarSlider label="Scale" value={acc.scale} min={0.5} max={3} step={0.1} onChange={(v) => updateAccessory(acc.id, { scale: v })} />
                    <CyclicSlider label="Rotation" value={acc.rotation} min={-180} max={180} step={5} onChange={(v) => updateAccessory(acc.id, { rotation: v })} />
                    <ToggleControl label="Flip Horizontal" checked={acc.flipX} onChange={(v) => updateAccessory(acc.id, { flipX: v })} />
                  </div>
                {/each}
                {#if config.accessories.length === 0}
                  <div class="text-slate-500 text-sm italic text-center py-4 bg-slate-900/50 rounded-lg border border-slate-800 border-dashed">No props added yet</div>
                {/if}
              </div>
            </ControlSection>
          {/if}

          {#if activeTab === 'render'}
            <ControlSection title="Render Options">
              <ScalarSlider label="Outline Size" value={config.outlineThickness} min={0.1} max={10} step={0.1} onChange={(v) => updateConfig('outlineThickness', v)} />
              <ScalarSlider label="Roughness" value={config.roughness} min={0} max={4} step={0.1} onChange={(v) => updateConfig('roughness', v)} />
            </ControlSection>
          {/if}
        </div>
      </aside>
    {/if}
  </div>
</div>
