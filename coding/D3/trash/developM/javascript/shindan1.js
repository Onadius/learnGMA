/* 
メモ
結果グラフの描画は、平均等の、各設問の加工済みのデータを受け取ったものとして作成する 
外部jsファイルより、ラベルデータだけ抽出してこい -> clear
 */


document.write("<script type='text/javascript' src='label.js'></script>"); //label.js読み込み処理

d3.json("./json/shindan1.json", function(error, data){
    
    //変数一覧
    var dataSet = []; //データを格納する配列
    
    var label = labelList(); //外部Javascriptファイルからラベルデータを取得
    console.log(label);
    
    //svg要素の横幅と縦幅を、cssより読み出して変数に入れる
    var svgEle = document.getElementById("myGraph2");
    var svgWidth = window.getComputedStyle(svgEle, null).getPropertyValue("width");
    var svgHeight = window.getComputedStyle(svgEle, null).getPropertyValue("height");
        
    svgWidth = parseFloat(svgWidth); //取得した値は単位がついているので、単位の削除
    svgHeight = parseFloat(svgHeight);
    
    var offsetX = 30; //メモリ調整 いわゆる左下らへんの余白
    var offsetY = 20; //メモリ調整
    var dataMax = 400; 
    var barWidth = 20; //棒グラフ横幅
    var barMargin = 20; //棒の横の間隔
    
    var barElements1; //グラフの棒の要素を格納する変数
    
    for(var i=0; i<data.length; i++){ //データの行数分だけ繰り返し
        dataSet.push(data[i].ave); // item2のデータだけを抽出
    }
    
    barElements1 = d3.select("#myGraph2")
                     .selectAll("rect")
                     .data(dataSet);
   
    //データの追加
    barElements1.enter()
            .append("rect") //要素追加
            .attr("class", "bar") //cssの指定
            .attr("height", 0)
            .attr("width", barWidth)  //横幅の指定
            .attr("x", function(d, i){  // x座標
                return i*(barWidth + barMargin) + offsetX + barWidth;
            })
            .attr("y", svgHeight - offsetY) //Y座標を(0, 0)に
     //マウスイベント
            .on("mouseover", function(){
                d3.select(this)
                  .style("fill", "LightGreen")
            })
            .on("mouseout", function(){
                d3.select(this)
                  .style("fill", "green")
            })
    //アニメーション処理
            .transition()
            .delay(function(d, i){
                return i*100; //0.1秒まち
            })
            .duration(1000) //animation時間
            .attr("y", function(d, i){ //座標
                return svgHeight - offsetY - (d*100)
            })
            .attr("height", function(d, i){ //グラフの長さ
                return (d*100);
            })
            
           
     
    //データ表示
    barElements1.enter()
            .append("text") //要素追加
            .attr("class", "barNum") // cssの指定
            .attr("x", function(d ,i){
                return i*(barWidth + barMargin) + offsetX + barWidth*2; //調整要
            })
            .attr("y", function(d, i){
                return svgHeight - (d*100) - offsetY - 3 //調整要
            })
            .text(function(d, i){ //テキストデータ表示
                return d;
            });
    
    
    /*--- メモリ表示  ---*/
    var yScale = d3.scale.linear()
            .domain([0, 4]) //元のデータ(dataSet)範囲
            .range([dataMax, 0]); //実際の出力サイズ
    
    d3.select("#myGraph2").append("g")
            .attr("class", "axis")
            .attr("transform", "translate("+offsetX+", "+((svgHeight-dataMax)-offsetY)+")")
            .call(
                d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .ticks(20) //メモリの間隔
            );
    
    
    /* 横方向の直線追加表示  */
    d3.select("#myGraph2")
            .append("rect")
            .attr("class", "axis_x")
            .attr("width", svgWidth-50)
            .attr("height", 0.5)
            .attr("transform", "translate("+offsetX+", "+(svgHeight - offsetY)+")");
    
    
    //棒のラベル表示
    barElements1.enter()
            .append("text")
            .attr("class", "barName")
            .attr("x", function(d, i){
                return i*((barWidth + barMargin)) + offsetX + 30;
            })
            .attr("y", svgHeight - offsetY -5)
            .text(function(d, i){
                return label[i]; //ラベル名を返す
            })
  
})
    
