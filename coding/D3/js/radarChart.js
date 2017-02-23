main(); //引数もたせて、データの読み込みをgon.dataにすればrubyに対応可能

//data読み取り関数 = gon.data相当
function main(){
  d3.json("./json/testData.json", function(error, data){

    var DATASET = data;
    /*
    console.log(data.length); //id数(回答者数)
    console.log(data[0]); //id=1のデータ全部
    console.log(data[0].ques_1); //id=1の人の質問番号1(ques_1)の回答データ
    console.log(data[0].ques_1.category); //id=1の人の質問番号1(ques_1)のカテゴリー値
    console.log(data[0]["ques_" + 2]["category"]); //id=1の人の質問番号1(ques_1)の回答データ
    console.log(Object.keys(DATASET[0]).length - 1); //id=1 の人の質問回答数
    */

    //各々ユーザーの6カテゴリ毎の平均回答結果算出--> forで全員分回せ
    var shapedDataSet = [];
    for(var id=0; id<DATASET.length; id++){
       var DataSet_user =  calculateData(DATASET[id]);
       shapedDataSet.push(DataSet_user);
     }
    console.log(shapedDataSet);
    drowChart(shapedDataSet);
  })// d3.json()
}// function main()


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


//chart.jsにおけるレーダーチャート描写関数
function drowChart(dataset){
  var radarChartData = {
      labels: ["会社方針", "仕事内容", "人間関係", "仕事環境", "IT関連", "組織状態"],
      datasets: [
        {//radarChart1
          label: "user_1",
          fillColor : "rgba(242,218,232,0.6)",
          strokeColor : "rgba(221,156,180,0.6)",
          pointColor : "rgba(221,156,180,0.6)",
          pointStrokeColor : "#fff",
          pointHighlightFill : "#fff",
          pointHighlightStroke : "rgba(221,156,180,0.6)",
          data : dataset[0]
        },
        {//radarChart2
          label: "user_2", //項目名
          fillColor : "rgba(175,208,239,0.6)", //塗りつぶす色
          strokeColor : "rgba(143,183,221,0.6)", //線の色
          pointColor : "rgba(143,183,221,0.6)", //値の点を塗りつぶす
          pointStrokeColor : "#fff", //値の点の枠線の色
          pointHighlightFill : "#fff", //マウスオーバー時値の点を塗りつぶす色
          pointHighlightStroke : "rgba(143,183,221,0.6)", //マウスオーバー時値の点の枠線を塗りつぶす色
          data : [35,62,42,40,37,67]
        }
      ]
    };
    window.myRadar = new Chart(document.getElementById("radarChart")
                                         .getContext("2d"))
                                         .Radar(radarChartData, {
                                           responsive: false //true でレスポンシブ
                                         })
}
