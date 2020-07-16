interface snapshotItem {
    crc: number;
    date: number;
    size: number;
}
declare type snapshotData = {
    [url: string]: snapshotItem;
};
/**
 *
 * @param pattern
 * @param basePath
 * @param isPrint
 */
export declare function DirSnapshot(pattern: string, basePath: string, isPrint?: boolean): Promise<snapshotData>;
/**
 *
 * @param snapShotStr
 */
export declare function ReadSnapshot(snapShotStr: string): any;
/**
 * 変更があったファイル一覧を取得
 * @param snapShotA
 * @param snapShotB
 * @param isPrint
 */
export declare function DiffSnapshot(snapShotA: snapshotData, snapShotB: snapshotData, isPrint?: boolean): Promise<string[]>;
export {};
