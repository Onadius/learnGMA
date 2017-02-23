var radarChartData = {
    labels: ["優しさ", "食欲", "性欲", "オタ力", "技術力", "パンチ力"],
    datasets: [
      {//radarChart1
        label: "本田恭平",
        fillColor : "rgba(242,218,232,0.6)",
        strokeColor : "rgba(221,156,180,0.6)",
        pointColor : "rgba(221,156,180,0.6)",
        pointStrokeColor : "#fff",
        pointHighlightFill : "#fff",
        pointHighlightStroke : "rgba(221,156,180,0.6)",
        data : [100,20,100,40,100,30,]
      }

    ]
  };
  window.myRadar = new Chart(document.getElementById("honndaChart")
                                       .getContext("2d"))
                                       .Radar(radarChartData, {
                                         responsive: false //true でレスポンシブ
                                       })
