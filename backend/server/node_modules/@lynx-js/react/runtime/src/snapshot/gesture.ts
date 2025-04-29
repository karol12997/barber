import { SnapshotInstance } from '../snapshot.js';
import { processGesture } from '../gesture/processGesture.js';

export function updateGesture(
  snapshot: SnapshotInstance,
  expIndex: number,
  _oldValue: any,
  elementIndex: number,
  workletType: string,
): void {
  if (!snapshot.__elements) {
    return;
  }
  if (__PROFILE__) {
    console.profile('updateGesture');
  }
  const value = snapshot.__values![expIndex];

  if (workletType === 'main-thread') {
    processGesture(snapshot.__elements[elementIndex]!, value);
  }
  if (__PROFILE__) {
    console.profileEnd();
  }
}
