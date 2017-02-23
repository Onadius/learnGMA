//きたねえコーディングだから修正したい
//svg基本要素の生成(グローバル変数)



d3.json("./json/biography.json", function(error, data) {

  var w = 600;
  var h = 600;
  var padding = 40;
  var svg = d3.select("#biography")
    .attr({
      width: w,
      height: h
    })
    .attr("class", "svgStyle");

  //グラフ描写関数
  function plotGraph() {

    //jsonデータ読み込み
    var dataSet = [];
    data.forEach(function(d) {
      dataSet.push([d.Avedata, d.Ydata, d.r]); //ここで数字の微調整可能
    })
    console.log(dataSet);

    //-------入出力スケールの設定---------
    var YdataMax = d3.max(dataSet, function(d) {
      return d[1];
    })
    var YdataMin = d3.min(dataSet, function(d) {
      return d[1];
    })

    var padding = 40; //余白調整

    var rScale = d3.scale.linear()
      .domain([1, dataSet.length]) //入力範囲
      .range([padding, w - padding]);

    var YdataScale = d3.scale.linear()
      .domain([1, 7]) //入力範囲
      .range([h - padding, padding]); //出力範囲(コンピュータ座標)


    //折れ線グラフ座標値計算
    var line = d3.svg.line()
      .x(function(d, i) {
        return　 rScale(d[2]);
      })
      .y(function(d, i) {
        return YdataScale(d[1]);
      });


    //折れ線グラフ描写
    var lineElements = d3.select("#biography")
      .append("path")
      .style({
        fill: "none",
        stroke: "green"
      })
      .style("stroke-width", "1px")
      .attr("d", line(dataSet));


    /*----------------------軸挿入-------------------------*/
    var yAxis = d3.svg.axis() //y軸
      .scale(YdataScale)
      .orient("left")
      .ticks(12);

    d3.select("#biography")
      .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + padding + ", 0)")
      .call(yAxis);


    var xAxis = d3.svg.axis() //x軸
      .scale(rScale)
      .orient("bottom");

    d3.select("#biography")
      .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + (h - padding) + ")") //水平方向, 垂直方向に移動する
      .call(xAxis);




    //プロット点挿入
    var Elements = d3.select("#biography")
      .selectAll("circle")
      .data(dataSet);

    Elements.enter() //circle要素足りなかったら空参照を追加
      .append("circle") //空参照にcircle要素追加.style("fill", function(d, i){
      .style("fill", "lightgreen")
      .attr("class", "circleDesign") //透明度指定
      .attr("cx", function(d, i) {
        return rScale(d[2]);
      })
      .attr("cy", function(d, i) {
        return YdataScale(d[1]);
      })
      .attr("r", function(d, i) {
        return 5;
      })
      .style("opacity", "0.5");
  }
  plotGraph();

})
