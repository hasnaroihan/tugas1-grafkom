// perhitungan matriks dengan format
/* [1,5,9 ,13,
    2,6,10,14,
    3,7,11,15,
    4,8,12,16] */

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
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                res[j*4+i] += a[i]*b[j*4] + b[j*4+1]*a[i+4] + b[j*4+2]*a[i+8] + b[j*4+3]*a[i+12];
            }
        }
        return res;
    }
}

function inverse(A) {
    _A = A.slice();
    let temp,
    E = Array(16).fill(0);
   
    for (i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++) {
        E[i*4 + j] = 0;
        if (i == j)
          E[i*4+j] = 1;
      }
   
    for (let k = 0; k < 4; k++) {
      temp = _A[k*4 + k];
   
      for (let j = 0; j < 4; j++)
      {
        _A[k*4 + j] /= temp;
        E[k*4 + j] /= temp;
      }
   
      for (let i = k + 1; i < 4; i++)
      {
        temp = _A[i*4 + k];
   
        for (let j = 0; j < 4; j++)
        {
          _A[i*4 + j] -= _A[k*4 + j] * temp;
          E[i*4 + j] -= E[k*4 + j] * temp;
        }
      }
    }
   
    for (let k = 4 - 1; k > 0; k--)
    {
      for (let i = k - 1; i >= 0; i--)
      {
        temp = _A[i*4 + k];
   
        for (let j = 0; j < 4; j++)
        {
          _A[i*4 + j] -= _A[k*4 + j] * temp;
          E[i*4 + j] -= E[k*4 + j] * temp;
        }
      }
    }
   
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++)
        _A[i*4 + j] = E[i*4 + j];
    return _A;
}