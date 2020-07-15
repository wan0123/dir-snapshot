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
        basePath = path_1.default.normalize(basePath);
        // 
        let matches = glob_1.default.sync(pattern);
        let data = {};
        let length = matches.length;
        while (matches.length > 0) {
            let promises = [];
            let urls = [];
            for (let i = 0; i < 100; i++) {
                let matche = matches.pop();
                if (!matche)
                    break;
                // File 以外は無視
                let stats = yield fs_1.default.promises.stat(matche);
                if (!stats.isFile()) {
                    continue;
                }
                if (isPrint) {
                    let par = Math.floor(((length - matches.length) / length) * 100 * 100) / 100;
                    process.stdout.write(`${par} %\r`);
                }
                urls.push(matche);
                promises.push(one(matche));
            }
            // 待つ
            let crcs = yield Promise.all(promises);
            for (let i = 0; i < urls.length; i++) {
                data[urls[i]] = crcs[i];
            }
        }
        resolve(data);
        /*
                let xml = new xmldom.DOMImplementation();
            //	let serializer = new xmldom.XMLSerializer();
        
                let dom = xml.createDocument( null, 'snapshot', null );
                let dom2 = dom.getElementsByTagName('snapshot');
                let node = dom2[0] as Node;
        
                for( let item of items ) {
                    let elem = dom.createElement( "item" );
                    elem.setAttribute( "url", item.filePath.replace( basePath, "" ).replace( /\\/g, '/' ) );
                    elem.setAttribute( "crc", item.crc.toString() );
                    node.appendChild( elem );
                }
        
            //	console.log( xmlFormatter( serializer.serializeToString( dom ) ) );
        
                resolve( dom );
        */
    }));
}
exports.DirSnapshot = DirSnapshot;
function ReadSnapshot(snapShotStr) {
    return JSON.parse(snapShotStr);
}
exports.ReadSnapshot = ReadSnapshot;
function DiffSnapshot(snapShotA, snapShotB, isPrint = false) {
    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
        let result = [];
        for (let url in snapShotA) {
            if (snapShotA[url] !== snapShotB[url]) {
                result.push(url);
            }
        }
        resolve(result);
        /*
        let snapshotA = xmlA.getElementsByTagName( 'snapshot' ) [ 0 ];
        let snapshotB = xmlB.getElementsByTagName( 'snapshot' ) [ 0 ];

        
        let result = [];

        let items = Array.prototype.slice.call( snapshotB.getElementsByTagName('item') ) as Element[];
        let length = items.length;

        while( items.length > 0 ) {

            let item = items.pop();
            if( !item ) continue;

            let url = item.getAttribute('url');
            if( !url ) continue;

            let crcStr = item.getAttribute('crc');
            if( !crcStr ) continue;

            try {
                let target = xpath.select1( `item[@url='${url}']`, snapshotA ) as Element; // [url='${url}]
                let a = target.getAttribute('crc');

                if( isPrint ) {
                    let par = Math.floor( ( ( length - items.length ) / length ) * 100 * 100 ) / 100;
                    process.stdout.write( `${par} %\r`);
                }
                
                if( crcStr !== a ) {
                    result.push( url );
                }
            } catch ( e ) {
                console.log( e );
            }

        }

        resolve( result );
        */
    }));
}
exports.DiffSnapshot = DiffSnapshot;
function one(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        filePath = path_1.default.normalize(filePath);
        let buffer = yield fs_1.default.promises.readFile(filePath);
        if (!buffer) {
            throw new Error();
        }
        return crc_1.default.crc32(buffer);
    });
}
//# sourceMappingURL=index.js.map