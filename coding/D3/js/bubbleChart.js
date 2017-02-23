/*--- かなり近づけたバブルチャートの実装 ---*/

//svg要素生成global変数
var w = 600;
var h = 600;
var padding = 40;
var svg = d3.select("#bubble")
  .attr({
    width: w,
    height: h
  })
  .attr("class", "svgStyle");
main(); //引数もたせて、データの読み込みをgon.dataにすればrubyに対応可能

//data読み取り関数 = gon.data相当
function main(){
  d3.json("./json/sample.json", function(error, data){

    var dataSet = [];
    data.forEach(function(d){
        dataSet.push([d.x, d.y, d.r, d.category]); //[array0[], array1[], array2[]..., array5[]]
    })
    console.log(dataSet[0]); //一つのバブルが持つ座標と半径、カテゴリーの値


    //描写スケールの設定
    var xScale = d3.scale.linear()
      .domain([d3.min(dataSet, function(d){ return d[0] - 0.5; }), d3.max(dataSet, function(d){ return d[0]; })])
      .range([padding, w - padding])
      .nice();

    var yScale = d3.scale.linear()
      .domain([d3.min(dataSet, function(d){ return d[1] - 0.5; }), d3.max(dataSet, function(d){ return d[1]; })])
      .range([h - padding, padding])
      .nice();

    var rScale = d3.scale.linear()
      .domain([0, d3.max(dataSet, function(d){ return d[2]; })])
      .range([0, h/11])
      .nice();

    drawAxis(dataSet, xScale, yScale, h, padding); //軸の描写
    drawBubble(dataSet, xScale, yScale, rScale); //チャートの描写

  })

  /*
  //生データ(testData.json)の使用テスト
  d3.json("./json/testData.json", function(error, data){

    var DATASET = data;
    console.log(data.length); //id数(回答者数)
    console.log(data[0]); //id=1のデータ全部
    console.log(data[0].ques_1); //id=1の人の質問番号1(ques_1)の回答データ
    console.log(data[0].ques_1.category); //id=1の人の質問番号1(ques_1)のカテゴリー値
    console.log(data[0]["ques_" + 2]["category"]); //id=1の人の質問番号1(ques_1)の回答データ
    console.log(Object.keys(DATASET[0]).length - 1); //id=1 の人の質問回答数

    //各々ユーザーの6カテゴリ毎の平均回答結果算出--> forで全員分回せ
    var shapedDataSet = [];
    for(var id=0; id<DATASET.length; id++){
       var DataSet_user =  calculateData(DATASET[id]);
       shapedDataSet.push(DataSet_user);
     }
    console.log(shapedDataSet);

  })*/
  
}

//生データよりId=xのユーザーの回答結果(カテゴリ毎)の平均算出 --> 配列で返す
function calculateData(data){

  var numQues = Object.keys(data).length - 1; //全設問数
  console.log(numQues);

  //sum:カテゴリ別結果合計値　cnt:カウントアップ用変数
  var sumAns = 0;
  var sum1 = 0;
  var sum2 = 0;
  var sum3 = 0;
  var sum4 = 0;
  var sum5 = 0;
  var sum6 = 0;
  var cnt1 = 0;
  var cnt2 = 0;
  var cnt3 = 0;
  var cnt4 = 0;
  var cnt5 = 0;
  var cnt6 = 0;

  var i = 1;
  while(i <= numQues){
    var CategoryData = parseInt(data["ques_" + i]["category"]); //カテゴリ値

    switch (CategoryData) {
      case 1: sum1 += parseInt(data["ques_" + i]["ans"]); cnt1++; break;
      case 2: sum2 += parseInt(data["ques_" + i]["ans"]); cnt2++; break;
      case 3: sum3 += parseInt(data["ques_" + i]["ans"]); cnt3++; break;
      case 4: sum4 += parseInt(data["ques_" + i]["ans"]); cnt4++; break;
      case 5: sum5 += parseInt(data["ques_" + i]["ans"]); cnt5++; break;
      case 6: sum6 += parseInt(data["ques_" + i]["ans"]); cnt6++; break;
    }
    sumAns += parseInt(data["ques_" + i]["ans"]); //全回答結果の合計
    i++;
  }
  var allAveAns = sumAns/numQues; //全回答結果平均値

  var newDataSet = [];
  newDataSet.push(sum1/cnt1);
  newDataSet.push(sum2/cnt2);
  newDataSet.push(sum3/cnt3);
  newDataSet.push(sum4/cnt4);
  newDataSet.push(sum5/cnt5);
  newDataSet.push(sum6/cnt6);

  return newDataSet;
}



//軸の描写
function drawAxis(dataSet, xScale, yScale){
  //X軸の設定
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom") //ラベルをどっち方向につけるか
    .ticks(15);

  svg.append("g")
    .attr({
      class: "axis",
      transform: "translate(0," + (h - padding) + ")"//(x, y)
    })
    .call(xAxis);

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(15);

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding + ", 0)")
    .call(yAxis);
}


//バブルチャート描写関数
function drawBubble(dataSet, xScale, yScale, rScale){

  svg.selectAll("circle")
     .data(dataSet)
     .enter()
     .append("circle")
     .attr({ //座標軸
       cx: function(d, i){
         return xScale(d[0]);
       },
       cy: function(d, i){
         return yScale(d[1]);
       },
       r: 0
     })
     .style({ //色, デザイン
       opacity: 0.5
     })
     .style("fill", function(d, i){
         switch(d[3]){
             case "1": return "red"; break;
             case "2": return "orange"; break;
             case "3": return "lightgreen"; break;
             case "4": return "aqua"; break;
             case "5": return "blueviolet"; break;
             case "6": return "gray"; break;
         }
     }) //以下アニメーションメソッド
     .transition()
     .delay(function(d, i){
       return i*300;
     })
     .duration(2000)
     .attr("r", function(d, i){
       return rScale(d[2]);
     });
}
/*
.on("mouseover", function(d){
  d3.select(this).attr("fill", "green");
})
.on("mouseout", function(d){
  d3.select(this).attr("fill", "red");
})
.on("click", function(d){
  var res = d3.select(this).attr("r");
  alert(res);
})
*/
