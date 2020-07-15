import fs from 'fs';
import { DirSnapshot, DiffSnapshot } from '../src/index'


test('test', async () => {

	// 
	let a = await DirSnapshot( '.\\test\\test-assets\\A\\**\\*', '.\\test\\test-assets\\A\\', true );
	let b = await DirSnapshot( '.\\test\\test-assets\\B\\**\\*', '.\\test\\test-assets\\B', true );
	
	await DiffSnapshot( a, b, true );

}, 0 );
