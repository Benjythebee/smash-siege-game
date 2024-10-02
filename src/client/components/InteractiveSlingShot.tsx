import { Line } from '@react-three/drei';
import { RigidBody, useRapier } from '@react-three/rapier';
import { Slingshot, slingShotCenterPositionVector } from './3d/Slingshot.js';
import { ElasticBand } from './3d/ElasticBand.js';
import { useCallback, useEffect, useRef, useState, WheelEvent } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Euler, Group, Vector2, Vector3 } from 'three';
import { AmmoController } from './ammo.js';
import { currentAmmoPosition, isAmmoReleased, markAmmoAsReleased, MenuStatus, moveCurrentAmmo, useGameStore, useSlingShotStore } from '../store.js';
import { useArrowKeys } from './hooks/use-controls.js';
import { Gear } from './3d/Gear.js';
import { onReloadLevel, onSlingshotLoadingObservable, onSlingshotReleaseObservable } from '../observables.js';
import { useEditorStore } from './ui/levelBuilder/Editor.store.js';
import { useSoundContext } from '../libs/sounds/soundContext.js';
import { SlingShotPlatform } from './3d/SlingShotPlatform.js';
import { isMobile } from '../libs/music/detectors/index.js';

const elasticConstant = 12;

const elasticForce = (distance: number) => {
  return -elasticConstant * distance;
};

export const InteractiveSlingShot = () => {
  const { playSound } = useSoundContext();
  const container = useRef<Group>(null);
  const cameraTarget = useRef<Group>(null);
  const cameraPosition = useRef<Group>(null);
  const [platformRotation, setPlatformRotation] = useState<Euler>(new Euler(0, 0, 0));
  const cameraWorldPosition = useRef(new Vector3(0, 0, 0));
  const cameraWorldLookAtPosition = useRef(new Vector3(0, 0, 0));
  const cameraLookAt = useRef(new Vector3(0, 0, 0));
  const editorCameraTarget = useRef<Vector3>(new Vector3());
  const editorCameraPosition = useRef<Vector3>(new Vector3());
  const editorCameraStep = useRef<number>(0);
  const editorZoom = useRef<number>(0);
  const catapult = useRef<Group>(null);

  const centerSlingShotPosition = useRef(slingShotCenterPositionVector);

  const pointerDown = useRef<Vector2 | null>(null);
  const pointerDragged = useRef<Vector2 | null>(null);
  const arrowKeys = useArrowKeys();

  const [releasing, setReleasing] = useState(false);
  const canvas = useThree((state) => state.gl.domElement);

  useEffect(() => {
    const onReloadLevelHandler = () => {
      // Reset camera rotation
      container.current!.rotation.y = 0;
    };

    const observer = onReloadLevel.add(onReloadLevelHandler);
    return () => {
      onReloadLevel.remove(observer);
    };
  }, []);

  const playSwooshSound = () => {
    const wooshNames = ['woosh_one', 'woosh_two', 'woosh_three', 'woosh_four'] as const;
    const random = Math.floor(Math.random() * wooshNames.length);
    playSound(wooshNames[random], { position: catapult.current?.getWorldPosition(new Vector3()).toArray() });
  };

  const releaseSlingShot = useCallback(() => {
    const currentAmmoRef = useSlingShotStore.getState().currentAmmoRef();
    const currentAmmoIndex = useSlingShotStore.getState().currentAmmoIndex;
    if (!currentAmmoRef) {
      console.error('No ammo to release');
      setReleasing(false);
      return;
    }
    if (isAmmoReleased(currentAmmoIndex)) {
      console.error('Ammo was already released');
      setReleasing(false);
      return;
    }
    markAmmoAsReleased(currentAmmoIndex);
    onSlingshotReleaseObservable.notifyObservers();
    currentAmmoRef.setBodyType(0, true);
    const direction = computeBulletDirection();
    const scaled = direction.multiplyScalar(elasticForce(computeDistance()));

    currentAmmoRef.applyImpulse(scaled, true);

    playSwooshSound();
    setReleasing(false);
    // Switch ammo
    if (!useSlingShotStore.getState().isOutOfAmmo()) {
      useSlingShotStore.getState().nextAmmo();
    }
  }, [releasing]);

  useFrame(({ camera, scene }) => {
    // Focus on the selected feature *EDITOR ONLY*
    const featureFocused = useEditorStore.getState().focused;

    if (featureFocused) {
      // get world position of the feature
      const item = scene.getObjectByName(featureFocused.type + featureFocused.uuid);

      if (item) {
        const position = item.getWorldPosition(new Vector3());

        editorCameraTarget.current.copy(position);
        editorCameraPosition.current.copy(position.clone());
        // editorCameraQuaternion.current.copy(camera.quaternion);
        if (arrowKeys.right) {
          editorCameraStep.current += 0.01;
          editorCameraStep.current > Math.PI * 2 && (editorCameraStep.current = 0);
        } else if (arrowKeys.left) {
          editorCameraStep.current -= 0.01;
          editorCameraStep.current < 0 && (editorCameraStep.current = Math.PI * 2);
        }

        const zoom = clamped(editorZoom.current, -0.5, 2);
        const xPos = position.x + Math.cos(editorCameraStep.current) * (5 * (1 + zoom));
        const zPos = position.z + Math.sin(editorCameraStep.current) * (5 * (1 + zoom));

        editorCameraPosition.current.set(xPos, editorCameraPosition.current.y, zPos);
        camera.position.lerp(editorCameraPosition.current, 0.1);
        camera.lookAt(editorCameraTarget.current);
        return;
      }
    }

    if (arrowKeys.right) {
      container.current!.rotation.y = clamped(container.current!.rotation.y - 0.01, -1.2, container.current!.rotation.y);
      setPlatformRotation(new Euler(0, container.current!.rotation.y, 0));
    } else if (arrowKeys.left) {
      container.current!.rotation.y = clamped(container.current!.rotation.y + 0.01, container.current!.rotation.y, 1.2);
      setPlatformRotation(new Euler(0, container.current!.rotation.y, 0));
    }

    // update position and rotation
    cameraPosition.current?.getWorldPosition(cameraWorldPosition.current);
    camera.position.lerp(cameraWorldPosition.current, 0.1);

    if (cameraTarget.current) {
      cameraTarget.current.getWorldPosition(cameraWorldLookAtPosition.current);
      cameraLookAt.current.lerp(cameraWorldLookAtPosition.current, 0.1);
      camera.lookAt(cameraLookAt.current);
    }
    Howler.pos(cameraWorldPosition.current.x, cameraWorldPosition.current.y, cameraWorldPosition.current.z);
    Howler.orientation(cameraLookAt.current.x, cameraLookAt.current.y, cameraLookAt.current.z);
  });

  useFrame(() => {
    if (pointerDragged.current && pointerDown.current) {
      const distance = pointerDragged.current.clone().sub(pointerDown.current).length();

      // Compute y differential
      const YDelta = pointerDragged.current.y - pointerDown.current.y;
      const currentAmmoRef = useSlingShotStore.getState().currentAmmoRef();
      const activeIndex = useSlingShotStore.getState().currentAmmoIndex;
      const isCurrentReleased = isAmmoReleased(activeIndex);
      if (currentAmmoRef && !isCurrentReleased) {
        computeBulletPosition(distance, YDelta);
      }
    }
  });

  const computeDistance = useCallback(() => {
    const position = currentAmmoPosition();
    return centerSlingShotPosition.current!.distanceTo(position);
  }, [centerSlingShotPosition]);

  const computeBulletDirection = () => {
    // const position = currentAmmoPosition();

    const dir = new Vector3(0, 0, 1);
    dir.applyQuaternion(container.current!.quaternion);

    return dir;
  };

  const computeBulletPosition = useCallback(
    (distance: number, _YDelta: number) => {
      const direction = new Vector3(0, 0, 1);
      direction.applyQuaternion(container.current!.quaternion);
      const newPosition = new Vector3();
      newPosition.copy(centerSlingShotPosition.current!.clone()).addScaledVector(direction, distance / 0.15);

      moveCurrentAmmo(newPosition);
    },
    [centerSlingShotPosition.current]
  );

  useEffect(() => {
    if (!canvas) return;
    const onMouseMoveAnywhere = (event: MouseEvent | TouchEvent) => {
      // NOTE Do something when mouse is moving, regardless if it's within the object or not
      if (pointerDown.current) {
        // We're out of ammo, ignore click
        if (useSlingShotStore.getState().isOutOfAmmo()) {
          console.warn('out of ammo');
          return;
        }
        if (releasing) {
          console.warn('releasing');
          return;
        }
        if (!useSlingShotStore.getState().ammoLoaded) {
          console.warn('ammo not loaded');
          return;
        }

        if ('touches' in event) {
          const touch = event.touches[0];
          const c = [(touch.clientX / canvas.clientWidth) * 2 - 1, -(touch.clientY / canvas.clientHeight) * 2 + 1] as const;
          const pointer = new Vector2().set(...c);
          pointerDragged.current = pointer;
          return;
        }

        // dragging; get the difference in mouse position while draggging;
        pointerDragged.current = new Vector2().set((event.clientX / canvas.clientWidth) * 2 - 1, -(event.clientY / canvas.clientHeight) * 2 + 1);
      }
    };
    const onMouseUpAnywhere = (_event: MouseEvent | TouchEvent) => {
      pointerDown.current = null;
      pointerDragged.current = null;
      // We're out of ammo, ignore click
      if (useSlingShotStore.getState().isOutOfAmmo()) return;

      const dist = computeDistance();
      if (!dist) {
        // if the distance is 0, then it's not dragged,
        return;
      }
      if (dist < 1) {
        //reset
        moveCurrentAmmo(centerSlingShotPosition.current.clone());
        return;
      }
      releaseSlingShot();
      setReleasing(true);
    };

    const onMouseDown = (event: MouseEvent | TouchEvent) => {
      if ('touches' in event) {
        const touch = event.touches[0];
        const c = [(touch.clientX / canvas.clientWidth) * 2 - 1, -(touch.clientY / canvas.clientHeight) * 2 + 1] as const;
        const pointer = new Vector2().set(...c);
        pointerDown.current = pointer;
        onSlingshotLoadingObservable.notifyObservers();
        return;
      }

      switch (event.button) {
        case 0: {
          // left
          const pointer = new Vector2().set((event.clientX / canvas.clientWidth) * 2 - 1, -(event.clientY / canvas.clientHeight) * 2 + 1);
          pointerDown.current = pointer;
          onSlingshotLoadingObservable.notifyObservers();
          break;
        }
        case 1: // middle
          break;
        case 2: // right
          break;
      }
    };

    const onMouseWheel = (event: WheelEvent) => {
      if (useGameStore.getState().menuState !== MenuStatus.LEVEL_BUILDER) return;
      if (event.deltaY > 0) {
        if (editorZoom.current > 2) return;
        editorZoom.current += 0.1;
      } else {
        if (editorZoom.current < 0) return;
        editorZoom.current -= 0.1;
      }
    };

    canvas.addEventListener('pointerdown', onMouseDown);
    canvas.addEventListener('pointermove', onMouseMoveAnywhere);
    canvas.addEventListener('pointerup', onMouseUpAnywhere);
    canvas.addEventListener('wheel', onMouseWheel as any);

    if (isMobile()) {
      canvas.addEventListener('touchstart', onMouseDown);
      canvas.addEventListener('touchmove', onMouseMoveAnywhere);
      canvas.addEventListener('touchend', onMouseUpAnywhere);
    }

    return () => {
      canvas.removeEventListener('pointerdown', onMouseDown);
      canvas.removeEventListener('pointermove', onMouseMoveAnywhere);
      canvas.removeEventListener('pointerup', onMouseUpAnywhere);
      canvas.removeEventListener('wheel', onMouseWheel as any);
      if (isMobile()) {
        canvas.removeEventListener('touchstart', onMouseDown);
        canvas.removeEventListener('touchmove', onMouseMoveAnywhere);
        canvas.removeEventListener('touchend', onMouseUpAnywhere);
      }
    };
  }, [canvas]);

  return (
    <group>
      <Gear scale={[0.02, 0.08, 0.02]} position={[0.5, 0.5, 0]} rotation={new Euler().setFromVector3(new Vector3(0, 0, 1.56).add(new Vector3(platformRotation.y, 0, 0)))} />
      <group ref={container}>
        <group ref={cameraTarget} position={[0, 2, 0]} />
        <group ref={cameraPosition} position={[0, 10, 15]} />
        <ElasticBand container={container.current!} position={centerSlingShotPosition.current.clone()} />

        <group ref={catapult}>
          <group position={centerSlingShotPosition.current} />

          <Gear scale={[0.06, 0.06, 0.06]} position={[-2.25, -0.1, 4.2]} rotation={platformRotation} />
          <RigidBody colliders={'trimesh'} type="fixed" position-y={-0.5}>
            <SlingShotPlatform />
          </RigidBody>
          <Slingshot rotation={[0, -Math.PI / 2, 0]} scale={[5, 5, 5]} />
        </group>
      </group>

      <Projection centerSlingShot={centerSlingShotPosition.current} />
      <AmmoController originalPosition={centerSlingShotPosition.current} />
    </group>
  );
};

const Projection = ({ centerSlingShot }: { centerSlingShot: Vector3 }) => {
  const [trajectoryPoints, setTrajectoryPoints] = useState<Vector3[]>([]);
  const { world } = useRapier();
  const { ammoLoadout, currentAmmoIndex } = useSlingShotStore((state) => ({
    ammoLoadout: state.ammoLoadout,
    currentAmmoIndex: state.currentAmmoIndex
  }));

  const ammoPosition = ammoLoadout[currentAmmoIndex]?.position || undefined;

  const computeBulletForce = useCallback(() => {
    if (!ammoPosition) return;
    if (!centerSlingShot) return;

    if (ammoPosition.distanceTo(centerSlingShot) < 0.1) return;

    let perpendicularDir = new Vector3();
    perpendicularDir.subVectors(ammoPosition, centerSlingShot);

    // Step 3: Normalize the perpendicular vector
    perpendicularDir.normalize();
    perpendicularDir.negate();

    const directionAB = new Vector3();
    directionAB.subVectors(ammoPosition, centerSlingShot);
    const distance = -directionAB.length();

    const scaled = perpendicularDir.multiplyScalar(elasticForce(distance));
    return scaled;
  }, [ammoPosition, centerSlingShot]);

  const computeProjection = (startPosition: Vector3, forceVector: Vector3) => {
    const gravity = world.gravity;
    const p0 = startPosition.clone();
    const v0 = forceVector.clone();

    let time = 0;
    // const steps = 60*2
    const deltaTime = 0.01;
    const trajectoryPoints = [];

    for (let i = 60; i > 0; i--) {
      // Calculate the position at time 'time'
      const tSquared = time * time;
      const position = new Vector3(
        p0.x + v0.x * time + 0.5 * gravity.x * tSquared,
        p0.y + v0.y * time + 0.5 * gravity.y * tSquared,
        p0.z + v0.z * time + 0.5 * gravity.z * tSquared
      );

      // Add the calculated position to the trajectory
      trajectoryPoints.push(position.clone());

      // Increment time
      time += deltaTime;
    }
    setTrajectoryPoints(trajectoryPoints);
  };

  useEffect(() => {
    const force = computeBulletForce();
    if (!force) {
      setTrajectoryPoints([]);
      return;
    }
    if (!ammoPosition) {
      return setTrajectoryPoints([]);
    }
    computeProjection(ammoPosition, force);
  }, [ammoPosition]);

  if (!trajectoryPoints.length) return null;

  return (
    <Line points={trajectoryPoints} color={'#ffffff'}>
      <meshBasicMaterial color={'#ffffff'} />
    </Line>
  );
};

const clamped = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
