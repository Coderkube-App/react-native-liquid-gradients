/**
 * Generates a valid 128x128 radial gradient PNG (white center → transparent edges)
 * and outputs the data URI for use in assets.ts.
 * Uses only Node.js built-ins (zlib). Zero external dependencies.
 */
const zlib = require('zlib');

const SIZE = 128;

function createRadialGradientPNG(size) {
  const center = size / 2;
  const radius = size / 2;

  // Raw RGBA pixel data with PNG row filter bytes
  const rawData = Buffer.alloc((size * 4 + 1) * size);

  for (let y = 0; y < size; y++) {
    const rowOffset = y * (size * 4 + 1);
    rawData[rowOffset] = 0; // Filter: None

    for (let x = 0; x < size; x++) {
      const dx = x - center + 0.5;
      const dy = y - center + 0.5;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const normalizedDist = Math.min(distance / radius, 1.0);

      // Smooth cubic falloff for ultra-soft edges
      let alpha = 1.0 - normalizedDist;
      alpha = Math.max(0, Math.min(1, alpha));
      alpha = alpha * alpha * (3 - 2 * alpha); // smoothstep

      const pixelOffset = rowOffset + 1 + x * 4;
      rawData[pixelOffset]     = 255; // R
      rawData[pixelOffset + 1] = 255; // G
      rawData[pixelOffset + 2] = 255; // B
      rawData[pixelOffset + 3] = Math.round(alpha * 255); // A
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // CRC32 lookup table
  const crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[n] = c;
  }

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function createChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeB = Buffer.from(type, 'ascii');
    const crcVal = crc32(Buffer.concat([typeB, data]));
    const crcB = Buffer.alloc(4);
    crcB.writeUInt32BE(crcVal, 0);
    return Buffer.concat([len, typeB, data, crcB]);
  }

  // PNG signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);  // width
  ihdr.writeUInt32BE(size, 4);  // height
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 6;   // color type: RGBA
  ihdr[10] = 0;  // compression
  ihdr[11] = 0;  // filter
  ihdr[12] = 0;  // interlace

  return Buffer.concat([
    sig,
    createChunk('IHDR', ihdr),
    createChunk('IDAT', compressed),
    createChunk('IEND', Buffer.alloc(0)),
  ]);
}

const png = createRadialGradientPNG(SIZE);
const base64 = png.toString('base64');
const dataUri = `data:image/png;base64,${base64}`;

console.log('// Generated data URI length:', dataUri.length);
console.log(dataUri);
