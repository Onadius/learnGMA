
function onOpen(){
  var ss = SpreadsheetApp.getActiveSpreadsheet(); 
  var menu = [
    {name: "更新情報を発信", functionName: "send_set"},
    {name: "習得事項を一覧表示", functionName: "listUp"},
    {name: "催促曜日リマインド開始", functionName: "startDayTrigger"},
    {name: "催促曜日リマインド停止", functionName: "deleteAllTriggers"}
    ];
  ss.addMenu("会得リストメニュー", menu);
}


//----------------(allsheet)シート名を指定すると、シートの要素を格納した2次元配列を取得する関数------------------
function getSheetData(sheetName){
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName) //シートの名前指定
           .getDataRange().getValues(); //シートの範囲指定、二次元配列で値取得
}


//日にち取得関数
function chkDate(){
  var date = new Date().getDate();
  return date;
}

//月取得関数
function chkMonth(){
  var thisMonth = new Date().getMonth() + 1;
  return thisMonth;
}

//Date.parse(data[x][y]) - Date.now() = ①日時を表す文字列を解析し、UTC時刻ミリ秒数を返す - UTC時刻での現在までのミリ秒を返す
for(var i = 1;i<data.length;i++){ 
    var ds = Date.parse(data[i][4]) - Date.now(); // ①<0 ということは、指定した日時を現在日時が過ぎたということ。
    if(data[i][5] === "" && ds<0){
      
      var name = data[i][0];
      var API = getAPI(name);
      Logger.log(API);
      
      var roomURL = data[i][2];
      var msg = data[i][3];
      
      sendCW(roomURL, msg, API);
      setSumiFlag(i+1);
    }
}


//送信メッセージ整形関数
function seikei_msg(title, msg){
  
  var MSG = "[info][title]" + title + "[/title]"
  + msg + "[/info]";
  
  return MSG; 
}



//時間整形関数(タイムスタンプを取得したものを整形)
function editTime(getTime){
  
  var time = new Date(getTime);
  var year = time.getFullYear();
  var month = time.getMonth() + 1;
  var date = time.getDate();
  var youbi = time.getDay(); 
  var day = chkDay(youbi); // youbi -> chkDay() -> day
  var hour = time.getHours();
  var min = time.getMinutes()
  
  
  
  var TIME = year + "/" + month +  "/" + date + "(" + day + ")\n"
  + hour + ":" + min;
  Logger.log(TIME);
  
}

//-------------------------------現在曜日取得----------------------------
function chkDay(){
  var day = new Date().getDay();
  switch(day){
    case 0: return '日'; break;
    case 1: return '月'; break;
    case 2: return '火'; break;
    case 3: return '水'; break;
    case 4: return '木'; break;
    case 5: return '金'; break;
    case 6: return '土'; break;
  }
}




//---------------------    配列追加      ----------------------------
var nameList = [];
  var aidList = [];
  for(var i=1; i<name.length; i++){
    nameList.push(name[i][0]);
    aidList.push(name[i][1]);
  }




/*-------------------Chatwork関連------------------------------------*/

//message送信関数 引数(roomId, toName, message, token)
function send_CW(roomId, aid, toName, message, token){
  UrlFetchApp.fetch('https://api.chatwork.com/v1/rooms/' + roomId + '/messages', {  //通知先のルームIDはroomIdのところに入力します。
        headers: {
            'X-ChatWorkToken': token //(main -> 引数token)
          },
          method: 'post',
          payload: 'body=' + encodeURIComponent(
                    
                    "[To:" + aid + "]" + toName + "さん"  + "\n" + message
                   
          )
        });
}


function sendCW(roomURL,msg){
  
  var mm = roomURL.split('#!rid');
  var roomId = mm[1];
  try{
  UrlFetchApp.fetch('https://api.chatwork.com/v1/rooms/' + roomId + '/messages', {
              headers: {
                'X-ChatWorkToken': '724c363f09b5a5946540a7970d2d25c4'
              },
              method: 'post',
              payload: 'body=' + msg
          });
  }catch(e){}
}


//Task作成関数　引数(content, subject, accountId, roomId, limit, token)
function createTask(subject, content, aid, roomId, limit, token){
  
  UrlFetchApp.fetch('https://api.chatwork.com/v1/rooms/' + roomId + '/tasks', {
              headers: {
                'X-ChatWorkToken': token
              },
              method: 'post',
              payload: 'body=[info][title]' + subject + '[/title]' + 
              content + '\n' + '[/info]' + '&limit=' + limit + '&to_ids=' + aid
            });

}


/*-------------------トリガー設定関連-------------------------------*/

//毎日9時にmain実行トリガーオブジェクト作成
function startDayTrigger(){
  deleteAllTriggers(); //トリガーを全て削除
   
  var onChangeTrigger = ScriptApp.newTrigger("main")     
  .timeBased()
  .atHour(9)
  .everyDays(1)
  .create();  
  
  var res = Browser.msgBox("設定しました。");
}

//トリガー設定重複避けバージョン
function triggerSet_1(){
  var triggers = ScriptApp.getProjectTriggers();
  
  if(triggers.length >=1){
    var res = Browser.msgBox("既に運用中です。");
  }else{
     var fname = 'main';
     var trigger = ScriptApp.newTrigger(fname);
     trigger.timeBased()
            .atHour(9)
            .everyDays(1)
            .create();
     var res = Browser.msgBox("設定いたしました。");
  }
}



//全トリガー削除
function deleteAllTriggers(){
  var allTriggers = ScriptApp.getProjectTriggers(); //配列で、スクリプト内のtrigger全取得
  for(var i=0; i<allTriggers.length; i++ )
    ScriptApp.deleteTrigger(allTriggers[i]);
}


//新規作成フォーム保存関数(IDを介したやり取り) form_name -> folder_id -> form_id -> form_url
function hozonnForm(formName, folderId, formId) {
  var folder = DriveApp.getFolderById(folderId);
  var newfile = DriveApp.getFileById(formId);
  var formUrl = newfile.getUrl();
  Logger.log(formUrl);
  
  if (folder.getFilesByName(formName).hasNext()){
    Logger.log("既に" + formName + "は作成済みです");
  }else{  
    folder.addFile(newfile);//指定保存先に、作成フォームコピー
  } 
  DriveApp.getRootFolder().removeFile(newfile); //コピー元formファイル削除
  
  return formUrl;
}
   

//url貼付け関数
function set_Url(x, url){
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  .getSheetByName("フォーム作成シート")
  .getRange(x, 2)
  .setValue(url);
}


//シート値クリア関数(エラーキャッチ付き)
function clearCell_data(sheetName){
  try{
    var sheet = SpreadsheetApp.getActiveSheet.getSheetByName(sheetName);
    sheet.getRange('A5:A22').clearContent();
  }catch(e){
    Browser.msgBox(e);
  }
}

/*__________________________Javascript(GAS) 便利メソッド_____________________________*/


//済フラグ
SpreadsheetApp.getActiveSpreadsheet()
.getSheetByName("経理シート")
.getRange(行, 列)
.setValue("済");

var newTitle = new String(); //文字列の配列

var newfileUrl = DriveApp.getFileById(formId).getUrl(); //URL取得関数

