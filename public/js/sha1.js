
export function sha1(message) {
    let h0 = 0x67452301;
    let h1 = 0xEFCDAB89;
    let h2 = 0x98BADCFE;
    let h3 = 0x10325476;
    let h4 = 0xC3D2E1F0;
 
    // Convert message to a byte array
    const msgBytes = new TextEncoder().encode(message);
    const ml = msgBytes.length * 8;
 
    // Padding
    const withOneBit = new Uint8Array([...msgBytes, 0x80]);
    const zeroPaddingLength = (56 - withOneBit.length % 64 + 64) % 64;
    const zeroPadding = new Uint8Array(zeroPaddingLength);
    const lengthPadding = new Uint8Array(8);
 
    for (let i = 0; i < 8; i++) {
        lengthPadding[7 - i] = (ml >>> (i * 8)) & 0xFF;
    }
 
    const paddedMessage = new Uint8Array([...withOneBit, ...zeroPadding, ...lengthPadding]);
 
    // Process each 512-bit chunk
    const words = new Uint32Array(80);
    for (let i = 0; i < paddedMessage.length / 64; i++) {
        const chunk = paddedMessage.slice(i * 64, (i + 1) * 64);
        for (let j = 0; j < 16; j++) {
            words[j] = (
                (chunk[j * 4] << 24) |
                (chunk[j * 4 + 1] << 16) |
                (chunk[j * 4 + 2] << 8) |
                (chunk[j * 4 + 3])
            ) >>> 0;
        }
 
        for (let j = 16; j < 80; j++) {
            const w = words[j - 3] ^ words[j - 8] ^ words[j - 14] ^ words[j - 16];
            words[j] = (w << 1) | (w >>> 31);
        }
 
        let a = h0;
        let b = h1;
        let c = h2;
        let d = h3;
        let e = h4;
 
        for (let j = 0; j < 80; j++) {
            let f, k;
            if (j < 20) {
                f = (b & c) | (~b & d);
                k = 0x5A827999;
            } else if (j < 40) {
                f = b ^ c ^ d;
                k = 0x6ED9EBA1;
            } else if (j < 60) {
                f = (b & c) | (b & d) | (c & d);
                k = 0x8F1BBCDC;
            } else {
                f = b ^ c ^ d;
                k = 0xCA62C1D6;
            }
 
            const temp = ((a << 5) | (a >>> 27)) + f + e + k + words[j];
            e = d;
            d = c;
            c = (b << 30) | (b >>> 2);
            b = a;
            a = temp >>> 0;
        }
 
        h0 = (h0 + a) >>> 0;
        h1 = (h1 + b) >>> 0;
        h2 = (h2 + c) >>> 0;
        h3 = (h3 + d) >>> 0;
        h4 = (h4 + e) >>> 0;
    }
 
    const hash = new Uint8Array([
        (h0 >> 24) & 0xFF, (h0 >> 16) & 0xFF, (h0 >> 8) & 0xFF, h0 & 0xFF,
        (h1 >> 24) & 0xFF, (h1 >> 16) & 0xFF, (h1 >> 8) & 0xFF, h1 & 0xFF,
        (h2 >> 24) & 0xFF, (h2 >> 16) & 0xFF, (h2 >> 8) & 0xFF, h2 & 0xFF,
        (h3 >> 24) & 0xFF, (h3 >> 16) & 0xFF, (h3 >> 8) & 0xFF, h3 & 0xFF,
        (h4 >> 24) & 0xFF, (h4 >> 16) & 0xFF, (h4 >> 8) & 0xFF, h4 & 0xFF
    ]);
 
    return Array.from(hash).map(b => b.toString(16).padStart(2, '0')).join('');
 }
 