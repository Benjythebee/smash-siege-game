import { create } from 'zustand';
import { onSlingshotLoadingObservable, onSlingshotReleaseObservable } from '../../../observables.js';

export const useSlingshot = create<{ loading: boolean }>((set) => ({ loading: false }));

onSlingshotLoadingObservable.add(() => {
  useSlingshot.setState({ loading: true });
});
onSlingshotReleaseObservable.add(() => {
  useSlingshot.setState({ loading: false });
});
