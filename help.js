function helpLoad() {
    let help = document.getElementById("help")

    help.innerHTML=`
    <button id="tutupbantuan" onclick="helpUnload()">Tutup Bantuan</button>
    <h1>Bantuan</h1>
        <pre>
            Menu Poligon:
            1. Mengubah warna poligon menggunakan slide bar. Warna hasil adalah kalkulasi dari tiga komponen merah, biru, dan hijau.
            2. Menambah poligon dengan menggunakan "Add Polygon", dengan memasukkan jumlah simpul.
            3. Menggeser simpul poligon dapat langsung dilakukan di kanvas.
            4. Poligon tidak dapat digeser secara sekaligus, harus satu persatu dengan simpul.

            Menu Garis:
            1. Mengubah warna garis dengan menggunakan slide bar.
            2. Menambah garis dengan menggunakan "Add Line", dengan memasukkan jumlah simpul.
            3. Menggeser simpul dapat langsung dilakukan di kanvas.

            Menu Persegi:
            1. Mengubah warna persegi menggunakan slide bar.
            2. Mengubah ukuran persegi.
            3. Menambah persegi dengan memasukkan ukuran sisi persegi.

            Scroll ke bawah mendekatkan kamera, sementara scroll ke atas akan menjauhkan kamera.
        </pre>`
}

function helpUnload(){
    let help = document.getElementById("help")
    help.innerHTML=``
}