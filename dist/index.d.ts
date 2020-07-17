export interface SnapshotItem {
    crc: number;
    size: number;
}
export declare type SnapshotData = {
    [url: string]: SnapshotItem;
};
/**
 *
 * @param pattern
 * @param basePath
 * @param isPrint
 */
export declare function DirSnapshot(pattern: string, basePath: string, isPrint?: boolean): Promise<SnapshotData>;
/**
 *
 * @param snapShotStr
 */
export declare function ReadSnapshot(snapShotStr: string): any;
/**
 *
 * @param ssDataPath
 * @param data
 */
export declare function WriteSnapshot(ssDataPath: string, data: SnapshotData): void;
/**
 * 変更があったファイル一覧を取得
 * @param snapShotA
 * @param snapShotB
 * @param isPrint
 */
export declare function DiffSnapshot(snapShotA: SnapshotData, snapShotB: SnapshotData, isPrint?: boolean): Promise<string[]>;
