import JSZip from 'jszip';
import { parse, writeUncompressed } from 'mcnbt';
import { Buffer } from 'buffer';

export async function convertWorld(file, onStatusUpdate) {
    try {
        onStatusUpdate('Reading file...');
        const zip = new JSZip();
        const content = await zip.loadAsync(file);

        if (!content.files['level.dat']) {
            throw new Error('Invalid world file: level.dat not found.');
        }

        onStatusUpdate('Parsing level.dat...');
        const levelDatContent = await content.files['level.dat'].async('arraybuffer');
        let buffer = Buffer.from(levelDatContent);

        // Check for Bedrock header (Version + Length, 8 bytes)
        let header = null;
        let version = 0;

        if (buffer.length > 8) {
            const potentialVersion = buffer.readInt32LE(0);
            const potentialLength = buffer.readInt32LE(4);

            // Simple heuristic: Version is small positive, Length matches remaining data size
            if (potentialVersion > 0 && potentialVersion < 100 && potentialLength === buffer.length - 8) {
                console.log(`Detected Bedrock header. Version: ${potentialVersion}, Length: ${potentialLength}`);
                version = potentialVersion;
                header = buffer.slice(0, 8);
                buffer = buffer.slice(8); // Slice off the header for NBT parsing
            }
        }

        // Parse NBT using mcnbt
        const parsed = parse(buffer);

        onStatusUpdate('Converting world data...');

        // mcnbt returns the parsed data directly
        const root = parsed.data;

        const tagsToRemove = ['eduOffer', 'eduSharedResource', 'educationFeaturesEnabled'];

        let modified = false;

        tagsToRemove.forEach(tag => {
            if (root[tag] !== undefined) {
                delete root[tag];
                modified = true;
                console.log(`Removed ${tag}`);
            }
        });

        if (!modified) {
            console.log('No Education Edition tags found or already removed.');
        }

        onStatusUpdate('Repacking world...');

        // Write back using mcnbt
        const newNbtBuffer = writeUncompressed(parsed);
        let finalBuffer = newNbtBuffer;

        if (header) {
            // Reconstruct header with new length
            const newHeader = Buffer.alloc(8);
            newHeader.writeInt32LE(version, 0);
            newHeader.writeInt32LE(newNbtBuffer.length, 4);
            finalBuffer = Buffer.concat([newHeader, newNbtBuffer]);
            console.log(`Restored Bedrock header. New Length: ${newNbtBuffer.length}`);
        }

        // Update the zip
        zip.file('level.dat', finalBuffer);

        onStatusUpdate('Generating download...');
        const newBlob = await zip.generateAsync({ type: 'blob' });

        return newBlob;

    } catch (error) {
        console.error('Conversion failed:', error);
        throw error;
    }
}
