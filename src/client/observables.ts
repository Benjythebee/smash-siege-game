import { Observable } from './libs/observable.js';

export const onSlingshotLoadingObservable = new Observable<void>();
export const onSlingshotReleaseObservable = new Observable<void>();
export const onReloadLevel = new Observable<void>();
export const onTouchXRotate = new Observable<'right' | 'left' | null>();
