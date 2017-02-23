/*バブルチャート作成*/

//ラベル読み込み(大域関数)
document.write("<script type='text/javascript' src='./label_bub.js'></script>"); //label.js読み込み処理
var labelData = labelList();
console.log(labelData);


d3.json("./json/data_bub.json", function(error, data){

    //jsonデータ読み込み
    var dataSet = [];
    data.forEach(function(d){
        dataSet.push([d.x, d.y, d.r, d.category]); //ここで数字の微調整可能
    })
    console.log(dataSet);


    //svg要素の横幅と縦幅を、cssより読み出して変数に入れる
    var svgEle = document.getElementById("bubble1");
    var svgWidth = window.getComputedStyle(svgEle, null).getPropertyValue("width");
    var svgHeight = window.getComputedStyle(svgEle, null).getPropertyValue("height");
    svgWidth = parseFloat(svgWidth); //取得した値は単位がついているので、単位の削除
    svgHeight = parseFloat(svgHeight);
    console.log(svgHeight);

    var offsetX = 30; //メモリ調整 いわゆる左下らへんの余白
    var offsetY = 20; //メモリ調整

    /* 入力ドメイン(入力範囲)、出力レンジ(出力範囲)
       * 入力ドメインとは、入力データの値の取りうる範囲のこと
       *スケールとは入力ドメインを出力レンジにマップする関数のこと
    */
    var cxMax = d3.max(dataSet, function(d){
        return d[0];  // 各内部配列の最初の値を参照
    });
    var cxMin = d3.min(dataSet, function(d){
        return d[0];  // 各内部配列の最初の値を参照
    });
    var cyMax = d3.max(dataSet, function(d){
        return d[1];  // 各内部配列の最初の値を参照
    });
    var cyMin = d3.min(dataSet, function(d){
        return d[1];  // 各内部配列の最初の値を参照
    });
    var rMax = d3.max(dataSet, function(d){
        return d[2];  // 各内部配列の最初の値を参照
    });
    var rMin = d3.min(dataSet, function(d){
        return d[2];  // 各内部配列の最初の値を参照
    });
    console.log(rMax);
    console.log(rMin);
    var padding = 80;

    //線形スケール(フレキシブルな座標設定が可能 = svgの値に合わせて、出力値範囲を自動変化)
    var xScale = d3.scale.linear() //満足度
                   .domain([0, cxMax]) //最小値をcxMinにすることも可能
                   .range([padding, svgWidth - padding]);

    var yScale = d3.scale.linear() //重要度
                   .domain([0, cyMax]) //最小値をcyMinにすることも可能
                   .range([svgHeight - padding, padding]); //コンピュータ座標

    var rScale = d3.scale.linear() //積極度
                   .domain([0, rMax]) //最小値をrMinにすることも可能
                   .range([0, 55]);

    //円要素
    var Elements = d3.select("#bubble1")
            .selectAll("circle")
            .data(dataSet);

    //描画
    Elements.enter() //circle要素足りなかったら空参照を追加
            .append("circle") //空参照にcircle要素追加.style("fill", function(d, i){
            .style("fill", function(d, i){
                switch(d[3]){
                    case "1": return "red"; break;
                    case "2": return "orange"; break;
                    case "3": return "lightgreen"; break;
                    case "4": return "aqua"; break;
                    case "5": return "blueviolet"; break;
                    case "6": return "gray"; break;
                }
            })
            .attr("class", "circleDesign") //透明度指定
            .attr("cx", function(d, i){
                return xScale(d[0]); //d[0]*200;
            })
            .attr("cy", function(d, i){
                return yScale(d[1]); //(svgHeight-d[1]*100); yの値が増加するにつれ座標は下に移動
            })
            .attr("r", function(d, i){
                return rScale(d[2]);
            });
            //

    //ラベル挿入
    Elements.enter()
            .append("text")
            .attr("class", "labeltext")
            .attr("x", function(d, i){
                return xScale(d[0])-padding;
            })
            .attr("y", function(d, i){
                return yScale(d[1]);
            })
            .text(function(d, i){
                return labelData[i]; //ラベル名を返す
            });


    //--------軸挿入-----------------------
    var xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient("bottom")
                  .ticks(15);

    var yAxis = d3.svg.axis()
                  .scale(yScale)
                  .orient("left")
                  .ticks(15);

    d3.select("#bubble1")
      .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + (svgHeight - padding) + ")") //水平方向, 垂直方向に移動する
      .call(xAxis);

    d3.select("#bubble1")
     .append("g")
     .attr("class", "axis")
     .attr("transform", "translate("+ padding + ", 0)")
     .call(yAxis);




})
