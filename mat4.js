// perhitungan matriks dengan format
/* [a,b,c,d,
    e,f,g,h,
    i,j,k,l,
    m,n,o,p] */

function mul(a,b) {
    if (b.length == 4) {
        let res = [0, 0, 0, 1];
        for (let i = 0; i < 4; i++) {
            res[i] = a[i] * b[0] + a[i+4] * b[1] + a[i+8] * b[2] + a[i+12] * b[3]
        }
        return res;
    }
    else{
        let res = Array(16);
        res.fill(0);
        console.log(res);
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                res[i*4+j] += b[i*4]*a[j] + b[i*4+1]*a[j+4] + b[i*4+2]*a[j+8] + b[i*4+3]*a[j+12];
            }
        }
        return res;
    }
}