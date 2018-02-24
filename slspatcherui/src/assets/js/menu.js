var pathToDest, body='';
const remote = require('electron').remote;

function getFolderSelection() {
  var dialog = remote.dialog
  var selection = dialog.showOpenDialog({ properties: ['openDirectory']})

  if (selection && selection[0]) {
    console.log('got Selection');
  }

  console.log(selection);

  return selection[0];  
}

function openDestFolder() {
  pathToDest = getFolderSelection();
}


function syncDir(path){
  console.log("checking dir "+path);
  var Client = require('ftp');
   
  var c = new Client();
  c.on('ready', function() {
    c.cwd(path, function(){
      c.list(function(err, list) {
        if (err) syncDir(path);
        try{
          list.forEach(function(item) {
            if(item.type == "d"){
              syncDir(path+"/"+item.name);
            }
            else{
              syncFile(item, path);
            }
          });
          trimDeletedFiles(list, path);
          c.end();
        }catch(err){
          syncDir(path);
        }
      });
    });
  });
  var config = {
    host:"arma.uk-sf.com",
    user:"SLSREAD",
    password:"password"
  };
  // connect to localhost:21 as anonymous 
  c.connect(config);
}

function syncFile(item, path){

  var fs = require('fs');

  fs.stat(pathToDest+'/'+path+"/"+item.name, function(err, stats) {

    if (stats==null || stats["size"] != item.size) {
      console.log("syncing file "+item.name);
      var Client = require('ftp');
      var c = new Client();
      c.on('ready', function() {
        c.cwd(path, function(){
          c.get(item.name, function(err, stream) {
            if (err || stream == null)  syncFile(item, path);
            stream.once('close', function() { c.end(); });
            var shell = require('shelljs');
            shell.mkdir('-p', pathToDest+"/"+path+"/");
            stream.pipe(fs.createWriteStream(pathToDest+'/'+path+"/"+item.name));
          });
        });
      });
      var config = {
        host:"arma.uk-sf.com",
        user:"SLSREAD",
        password:"password"
      };
      // connect to localhost:21 as anonymous 
      c.connect(config);
    }
    else{
      console.log("skipping file "+item.name);
    }
  });

  
}

function trimDeletedFiles(remoteList, path){
  //delete all files not included in the list object
  var fs = require('fs');
  fs.readdir(pathToDest+'/'+path, function(err, items) {
    if(items == null) return;
    for (var i=0; i<items.length; i++) {
      for (var w=0; w<remoteList.length; w++) {
        if(remoteList[w].name === items[i]){
          return;
        }
      }
    }

    console.log("");
    console.log("bad found = "+items[i]);
    console.log("from");
    console.log(items);
    console.log("against");
    console.log(remoteList);
    console.log("");
  });
}

function startSync() {
  var Client = require('ftp');
  
  var c = new Client();
  c.on('ready', function() {
    c.list(function(err, list) {
      if (err) throw err;
      try{
        console.log(list);
        list.forEach(function(item) {
          if(item.type == "d"){
            syncDir("/"+item.name);
          }
          else{
            syncFile(item, "/");
          }
        });
        trimDeletedFiles(list, "");
    
        c.end();
        var authButton = document.getElementById('container').innerHTML = "done";
      }catch(err){
        syncDir("/");
      }
    });
  });
  var config = {
    host:"arma.uk-sf.com",
    user:"SLSREAD",
    password:"password"
  };
  // connect to localhost:21 as anonymous 
  c.connect(config);
}

function read(html){
  console.log(html);
}