//ラベル読み込み(大域関数)
/*
document.write("<script type='text/javascript' src='./label_radar.js'></script>"); //label.js読み込み処理
var labelData = labelList_radar();
console.log(labelData);
*/



/*

//--------------D3.js--------------
main();
function main(){ //main関数
  d3.json("./json/radar.json", function(error, data) {

    var w = 600;
    var h = 600;
    var padding = 40;
    var svg = d3.select("#allRadar")
      .attr({
        width: w,
        height: h
      })
      .attr("class", "svgStyle");

    //jsonデータ読み込み
    var dataSet = [];
    data.forEach(function(d) {
      dataSet.push([d.data0, d.data1, d.data2, d.data3]); //ここで数字の微調整可能
    })

    //レーダーチャート描写時に使用するデータセット
    var aveRadarSet = dataSet[0];
    var radarSet = dataSet[1];
    console.log(aveRadarSet);

    //描写時に利用するデータセット指定
    var dataset = [
      aveRadarSet, //dataSet[0],
      radarSet     //dataSet[1]
    ];

    //レーダーチャート頂点数。(データセット数に対応)
    var paramCount = aveRadarSet.length;
    console.log(paramCount);

    //スケール設定
    var max = d3.max(d3.merge(dataset));
    var rScale = d3.scale.linear()
      .domain([0, 7])
      .range([0, (w / 2.5)-padding]); //出力範囲を微調整したconsole.log(dataset);

    plotGrit(dataset, rScale, w, paramCount);


  })
}

function plotGrit(dataset, rScale, w, paramCount){

  var line = d3.svg.line()
    .x(function(d, i) {
      return rScale(d) * Math.cos(2 * Math.PI / paramCount * i - (Math.PI / 2)) + (w / 2);
    })
    .y(function(d, i) {
      return rScale(d) * Math.sin(2 * Math.PI / paramCount * i - (Math.PI / 2)) + (w / 2.6);//微調整
    })
    .interpolate('linear'); //各座標を直線で繋ぐ

  //レーダーチャートグリッド線規定
  var grid = (function() {
    var result = [];
    for (var i = 1; i <= 7; i++) { //パラーメータの最大値範囲
      var arr = [];
      for (var j = 0; j < paramCount; j++) { //レーダーの頂点数
        arr.push(i);
      }
      result.push(arr);
    }
    return result;
  })();
  console.log(grid);

  //グリッド線表示(透けさせて表示させたい)
  svg.selectAll("path.grid")
    .data(grid)
    .enter()
    .append("path")
    .attr("d", function(d, i) {
      return line(d) + "z";
    })
    .attr("stroke", "black")
    .attr("stroke-dasharray", "3")
    .attr('fill', 'none');
}





/*

  //座標値計算
  var line = d3.svg.line()
    .x(function(d, i) {
      return rScale(d) * Math.cos(2 * Math.PI / paramCount * i - (Math.PI / 2)) + (w / 2);
    })
    .y(function(d, i) {
      return rScale(d) * Math.sin(2 * Math.PI / paramCount * i - (Math.PI / 2)) + (w / 2.6);//微調整
    })
    .interpolate('linear'); //各座標を直線で繋ぐ

  //レーダーチャートグリッド線規定
  var grid = (function() {
    var result = [];
    for (var i = 1; i <= 7; i++) { //パラーメータの最大値範囲
      var arr = [];
      for (var j = 0; j < paramCount; j++) { //レーダーの頂点数
        arr.push(i);
      }
      result.push(arr);
    }
    return result;
  })();

  //ラベル表示位置規定
  var label = (function() {
      var result = [];
      for (var i = 0; i < paramCount; i++) {
        result.push(7.3); //半径r = [7.3, ..., 7.3]を規定した。
      }
      console.log(result);
      return result;
    })();

  //レーダーチャート描写
  svg.selectAll("path")
    .data(dataset)
    .enter()
    .append("path")
    .attr("d", function(d) {
      return line(d) + "z";
    })
    .attr("stroke", function(d, i){
      return "rgb(3,71,30)";//d3.scale.category20().range()[i]; //switch文で色分けも可能
    }) //線の色
    .attr("class", "radarDesign")
    .attr('fill', function(d, i){
      return d3.scale.category20().range()[i+3]; //switch文で色分けも可能
    })
    .style("opacity", "0.5");

  //グリッド線表示(透けさせて表示させたい)
  svg.selectAll("path.grid")
    .data(grid)
    .enter()
    .append("path")
    .attr("d", function(d, i) {
      return line(d) + "z";
    })
    .attr("stroke", "black")
    .attr("stroke-dasharray", "3")
    .attr('fill', 'none');


  //ラベルテキスト表示

  console.log(line.x());

  svg.selectAll("text")
     .data(label)
     .enter()
     .append('text')
     .text(function(d, i){ return labelData[i]; })
     .attr("text-anchor", "middle")
     .attr("dominant-baseline", "middle")
     .attr('x', function(d, i){
       return rScale(d) * Math.cos(2 * Math.PI / paramCount * i - (Math.PI / 2)) + w/2;
     })
     .attr('y', function(d, i){
       return rScale(d) * Math.sin(2 * Math.PI / paramCount * i - (Math.PI / 2)) + w/2.6;
     })
     .attr("class", "labeltext");

})
*/
