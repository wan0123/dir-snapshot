"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiffSnapshot = exports.ReadSnapshot = exports.DirSnapshot = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const glob_1 = __importDefault(require("glob"));
const crc_1 = __importDefault(require("crc"));
/**
 *
 * @param pattern
 * @param basePath
 * @param isPrint
 */
function DirSnapshot(pattern, basePath, isPrint = false) {
    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
        // 
        pattern = path_1.default.normalize(pattern);
        basePath = path_1.default.resolve(basePath) + path_1.default.sep;
        // 
        let matches = glob_1.default.sync(pattern);
        let data = {};
        let length = matches.length;
        while (matches.length > 0) {
            let promises = [];
            let urls = [];
            for (let i = 0; i < 10; i++) {
                // 
                let matche = matches.pop();
                if (!matche)
                    break;
                matche = path_1.default.resolve(matche);
                // File 以外は無視
                let stats = yield fs_1.default.promises.stat(matche);
                if (!stats.isFile()) {
                    continue;
                }
                let url = matche.replace(basePath, '');
                url = path_1.default.normalize(url).replace(/\\/g, '/');
                if (isPrint) {
                    let par = Math.floor(((length - matches.length) / length) * 100 * 100) / 100;
                    process.stdout.write(`${par} %\r`);
                }
                urls.push(url);
                promises.push(one(matche));
            }
            // 待つ
            let items = yield Promise.all(promises);
            for (let i = 0; i < urls.length; i++) {
                data[urls[i]] = items[i];
            }
        }
        resolve(data);
    }));
}
exports.DirSnapshot = DirSnapshot;
/**
 *
 * @param snapShotStr
 */
function ReadSnapshot(snapShotStr) {
    return JSON.parse(snapShotStr);
}
exports.ReadSnapshot = ReadSnapshot;
/**
 * 変更があったファイル一覧を取得
 * @param snapShotA
 * @param snapShotB
 * @param isPrint
 */
function DiffSnapshot(snapShotA, snapShotB, isPrint = false) {
    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
        let result = [];
        for (let url in snapShotA) {
            if (snapShotA[url] !== snapShotB[url]) {
                result.push(url);
            }
        }
        resolve(result);
    }));
}
exports.DiffSnapshot = DiffSnapshot;
// --------------------------------------------------
// --------------------------------------------------
// 
// --------------------------------------------------
// --------------------------------------------------
/**
 *
 * @param filePath
 */
function one(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        filePath = path_1.default.normalize(filePath);
        let stats = yield fs_1.default.promises.stat(filePath);
        let buffer = yield fs_1.default.promises.readFile(filePath);
        if (!buffer) {
            throw new Error();
        }
        let item = {
            crc: crc_1.default.crc32(buffer),
            date: stats.mtimeMs,
            size: buffer.length
        };
        return item;
    });
}
//# sourceMappingURL=index.js.map