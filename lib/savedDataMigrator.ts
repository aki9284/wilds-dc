import { SavedItem } from "@/components/common/SaveLoadPanel";

export function validateAndMigrateData(items: SavedItem[], storageKey: string): SavedItem[] {
  return items.filter(item => {
    if (!item.version) return false;

    switch (item.version) {
        case '1.0.0':
            // 1.0.0から1.1.0へのマイグレーション: condition-settingsに"skillLordsSoulEnabled"を追加
            if (storageKey === 'condition-settings') {
                item.data.skillLordsSoulEnabled = 100;
            }
        case '1.1.0':
            return true;
        default:
            return false;
        }
    }
  );
}