import { onPostWorkletCtx } from '../worklet/ctx.js';
import { type GestureKind, GestureTypeInner, type ComposedGesture, type BaseGesture } from './types.js';

export function processGestureBackground(gesture: GestureKind): void {
  if (gesture.type === GestureTypeInner.COMPOSED) {
    for (const subGesture of (gesture as ComposedGesture).gestures) {
      processGestureBackground(subGesture);
    }
  } else {
    const baseGesture = gesture as BaseGesture;
    for (const [name, value] of Object.entries(baseGesture.callbacks)) {
      baseGesture.callbacks[name] = onPostWorkletCtx(value)!;
    }
  }
}
