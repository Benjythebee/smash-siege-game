import { AuthInEditor } from '../auth-in-editor';
import { LevelBuilderImportSection } from './importExport.tab/import';
import { LevelBuilderExportSection } from './importExport.tab/export';
import type { LevelBuilderTabTypes } from './tabs';

export const LevelBuilderImportExportTab = ({ setTab }: { setTab: (x: LevelBuilderTabTypes) => void }) => {
  return (
    <div className={`LevelBuilderTabs bg-dark/80 text-alice-blue min-h-[11rem] flex gap-4 p-2 w-full justify-between`}>
      {/* Import */}
      <LevelBuilderImportSection setTab={setTab} />
      {/* Export */}
      <LevelBuilderExportSection />
      {/* Auth */}
      <div className="flex flex-col gap-2">
        <AuthInEditor />
      </div>
    </div>
  );
};
