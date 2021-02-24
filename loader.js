function download_txt() {
    var jason = {
        poligons: poligons,
        lines: lines,
        squares: squares,
    }
    var hiddenElement = document.createElement('a');
  
    hiddenElement.href = 'data:attachment/text,' + JSON.stringify(jason);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'Grafkom.txt';
    hiddenElement.click();
  }
  
  document.getElementById('download').addEventListener('click', download_txt);

function openFile(e) {
    console.log('hai')
    let file = e.target.files[0];
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
        let contents = e.target.result;
        let jason = JSON.parse(contents);
        squares = jason.squares
        lines = jason.lines
        poligons = jason.poligons
        poligons.forEach(pol => {
            pol.updateAnchor = function() {
                let sumX = 0;
                let sumY = 0;
                for (let i = 0; i < this.sides*3; i+=3) {
                    sumX += this.vertex[i];
                    sumY += this.vertex[i+1];
                }
                this.anchor[0] = sumX/this.sides;
                this.anchor[1] = sumY/this.sides;
            }
        });
    };
    reader.readAsText(file);
}

function browse() {
	let fileInput = document.getElementById('file-input');
    fileInput.click();
}

document.getElementById('load').addEventListener('click', browse);
document.getElementById('file-input').addEventListener('change', openFile);