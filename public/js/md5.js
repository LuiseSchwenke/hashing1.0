export function md5(message= '') {

    const s = [
        7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
        5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
        4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
        6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
    ];

    const K = [
        0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
        0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
        0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
        0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
        0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
        0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
        0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
        0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
    ];

    function leftRotate(x, c) {
        return (x << c) | (x >>> (32 - c));
    }

    function toLittleEndian(word) {
        return ((word << 8) & 0xFF00FF00) | ((word >>> 8) & 0x00FF00FF);
    }

    function toHexString(num) {
        let hex = num.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }

    function toHex(array) {
        return array.map(num => toHexString(num)).join('');
    }

    // Initialization
    let A = 0x67452301;
    let B = 0xEFCDAB89;
    let C = 0x98BADCFE;
    let D = 0x10325476;

    // Pre-processing
    let originalLength = message.length * 8;
    message += '\x80';
    while ((message.length % 64) !== 56) {
        message += '\x00';
    }

    for (let i = 0; i < 8; i++) {
        message += String.fromCharCode((originalLength >>> (i * 8)) & 0xFF);
    }

    // Process the message in successive 512-bit chunks
    for (let i = 0; i < message.length; i += 64) {
        let M = [];
        for (let j = 0; j < 64; j += 4) {
            M[j / 4] = message.charCodeAt(i + j) | (message.charCodeAt(i + j + 1) << 8) |
                (message.charCodeAt(i + j + 2) << 16) | (message.charCodeAt(i + j + 3) << 24);
        }

        let a = A;
        let b = B;
        let c = C;
        let d = D;

        for (let j = 0; j < 64; j++) {
            let F, g;
            if (j < 16) {
                F = (b & c) | (~b & d);
                g = j;
            } else if (j < 32) {
                F = (d & b) | (~d & c);
                g = (5 * j + 1) % 16;
            } else if (j < 48) {
                F = b ^ c ^ d;
                g = (3 * j + 5) % 16;
            } else {
                F = c ^ (b | ~d);
                g = (7 * j) % 16;
            }

            let temp = d;
            d = c;
            c = b;
            b = b + leftRotate((a + F + K[j] + M[g]), s[j]);
            a = temp;
        }

        A = (A + a) >>> 0;
        B = (B + b) >>> 0;
        C = (C + c) >>> 0;
        D = (D + d) >>> 0;
    }
    return toHex([toLittleEndian(A), toLittleEndian(B), toLittleEndian(C), toLittleEndian(D)]);
}
