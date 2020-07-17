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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiffSnapshot = exports.WriteSnapshot = exports.ReadSnapshot = exports.DirSnapshot = void 0;
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var glob_1 = __importDefault(require("glob"));
var crc_1 = __importDefault(require("crc"));
/**
 *
 * @param pattern
 * @param basePath
 * @param isPrint
 */
function DirSnapshot(pattern, basePath, isPrint) {
    var _this = this;
    if (isPrint === void 0) { isPrint = false; }
    return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
        var matches, data, length, promises, urls, i, matche, stats, url, par, items, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // 
                    pattern = path_1.default.normalize(pattern);
                    basePath = path_1.default.resolve(basePath) + path_1.default.sep;
                    matches = glob_1.default.sync(pattern);
                    data = {};
                    length = matches.length;
                    _a.label = 1;
                case 1:
                    if (!(matches.length > 0)) return [3 /*break*/, 7];
                    promises = [];
                    urls = [];
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < 10)) return [3 /*break*/, 5];
                    matche = matches.pop();
                    if (!matche)
                        return [3 /*break*/, 5];
                    matche = path_1.default.resolve(matche);
                    return [4 /*yield*/, fs_1.default.promises.stat(matche)];
                case 3:
                    stats = _a.sent();
                    if (!stats.isFile()) {
                        return [3 /*break*/, 4];
                    }
                    url = matche.replace(basePath, '');
                    url = path_1.default.normalize(url).replace(/\\/g, '/');
                    if (isPrint) {
                        par = Math.floor(((length - matches.length) / length) * 100 * 100) / 100;
                        process.stdout.write(par + " %\r");
                    }
                    urls.push(url);
                    promises.push(one(matche));
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5: return [4 /*yield*/, Promise.all(promises)];
                case 6:
                    items = _a.sent();
                    for (i = 0; i < urls.length; i++) {
                        data[urls[i]] = items[i];
                    }
                    return [3 /*break*/, 1];
                case 7:
                    resolve(data);
                    return [2 /*return*/];
            }
        });
    }); });
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
 *
 * @param ssDataPath
 * @param data
 */
function WriteSnapshot(ssDataPath, data) {
    fs_1.default.writeFileSync(ssDataPath, JSON.stringify(data, null, "\t"));
}
exports.WriteSnapshot = WriteSnapshot;
/**
 * 変更があったファイル一覧を取得
 * @param snapShotA
 * @param snapShotB
 * @param isPrint
 */
function DiffSnapshot(snapShotA, snapShotB, isPrint) {
    var _this = this;
    if (isPrint === void 0) { isPrint = false; }
    return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
        var result, url;
        return __generator(this, function (_a) {
            result = [];
            for (url in snapShotA) {
                if (snapShotA[url] !== snapShotB[url]) {
                    result.push(url);
                }
            }
            resolve(result);
            return [2 /*return*/];
        });
    }); });
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
    return __awaiter(this, void 0, void 0, function () {
        var buffer, item;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filePath = path_1.default.normalize(filePath);
                    return [4 /*yield*/, fs_1.default.promises.readFile(filePath)];
                case 1:
                    buffer = _a.sent();
                    if (!buffer) {
                        throw new Error();
                    }
                    item = {
                        crc: crc_1.default.crc32(buffer),
                        //	date: 	stats.mtimeMs,
                        size: buffer.length
                    };
                    return [2 /*return*/, item];
            }
        });
    });
}
//# sourceMappingURL=index.js.map