import path from 'path'
import fs from 'fs'
import glob from 'glob';
import crc from 'crc';

export interface SnapshotItem {  
	crc: number,
//	date: number,
	size: number,
} 
export type SnapshotData = { [ url: string ]: SnapshotItem };

/**
 * 
 * @param pattern 
 * @param basePath 
 * @param isPrint 
 */
export function DirSnapshot( pattern: string, basePath: string, isPrint: boolean = false ) {
	return new Promise<SnapshotData>( async ( resolve: ( snapshot: SnapshotData )=>void ) => {

		// 
		pattern = path.normalize( pattern );
		basePath = path.resolve( basePath ) + path.sep;

		// 
		let matches = glob.sync( pattern );
		let data: SnapshotData = {};
		let length = matches.length;
		
		while( matches.length > 0 ) {

			let promises: Promise<SnapshotItem>[] = [];
			let urls: string[] = [];

			for( let i = 0; i < 10; i++ ) {

				// 
				let matche = matches.pop();
				if( !matche ) break;

				matche = path.resolve( matche );

				// File 以外は無視
				let stats = await fs.promises.stat( matche );
				if( !stats.isFile() ) {
					continue;
				} 

				let url = matche.replace( basePath, '' );
				url = path.normalize( url ).replace( /\\/g, '/' );

				if( isPrint ) {
					let par = Math.floor( ( ( length - matches.length ) / length ) * 100 * 100 ) / 100;
					process.stdout.write( `${par} %\r`);
				}

				urls.push( url );
				promises.push( one( matche ) );
			}

			// 待つ
			let items = await Promise.all( promises );		

			for( let i = 0; i < urls.length; i++ ) {
				data[ urls[ i ] ] = items[ i ];
			}
		}

		resolve( data );
	});
}

/**
 * 
 * @param snapShotStr 
 */
export function ReadSnapshot( snapShotStr: string ) {

	return JSON.parse( snapShotStr );
}

/**
 * 
 * @param ssDataPath 
 * @param data 
 */
export function WriteSnapshot( ssDataPath: string, data: SnapshotData ) {

	fs.writeFileSync( ssDataPath, JSON.stringify( data, null, "\t" ) );
}

/**
 * 変更があったファイル一覧を取得
 * @param snapShotA 
 * @param snapShotB 
 * @param isPrint 
 */
export function DiffSnapshot( snapShotA: SnapshotData, snapShotB: SnapshotData, isPrint: boolean = false ) {
	return new Promise<string[]>( async ( resolve: ( result: string[] )=>void ) => {

		let result: string[] = [];
		for( let url in snapShotA ) {
		
			if( snapShotA[ url ] !== snapShotB[ url ] ) {
				result.push( url );
			}
		}

		resolve( result );

	});

}

// --------------------------------------------------
// --------------------------------------------------
// 
// --------------------------------------------------
// --------------------------------------------------


/**
 * 
 * @param filePath 
 */
async function one( filePath: string ) {

	filePath = path.normalize( filePath );

	// let stats = await fs.promises.stat( filePath );

	let buffer = await fs.promises.readFile( filePath );
	if( !buffer ) {
		throw new Error();
	}

	let item: SnapshotItem = {
		crc: 	crc.crc32( buffer ),
	//	date: 	stats.mtimeMs,
		size: 	buffer.length
	};
	
	return item;
}
