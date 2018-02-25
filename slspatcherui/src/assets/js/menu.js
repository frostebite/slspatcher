var pathToDest, body='';
const remote = require('electron').remote;
var AsyncLock = require('async-lock');
var lock = new AsyncLock();
let TotalFiles = 0;
let FilesComplete = 0;
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

function syncFile(item, path, ignore = false){

  var fs = require('fs');

  fs.stat(pathToDest+'/'+path+"/"+item.name, function(err, stats) {

    if (stats==null || stats["size"] != item.size) {
      
      lock.acquire('GetFile', function(callback){
        if(!ignore){
          lock.acquire('TotalFilesLock', function(cb){
            TotalFiles++;
            updateMessage();
            cb();
          }, function(err, ret){
            if(err!=null)
            console.log(err.message) // output: error
          });
        }
        console.log("syncing file "+item.name);
        var Client = require('ftp');
        var c = new Client();
        c.on('ready', function() {
          c.cwd(path, function(){
            c.get(item.name, function(err, stream) {
              try{
                stream.once('close', function() { c.end(); });
                var shell = require('shelljs');
                shell.mkdir('-p', pathToDest+"/"+path+"/");
                stream.pipe(fs.createWriteStream(pathToDest+'/'+path+"/"+item.name));
                callback();
                lock.acquire('completeFilesLock', function(cb){
                  FilesComplete++;
                  updateMessage();
                  cb();
                }, function(err, ret){
                  if(err!=null)
                  console.log(err.message) // output: error
                });
              }catch(err){
                callback();
                syncFile(item, path, true);
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
      }, function(err, ret){
        if(err!=null)
        console.log(err.message) // output: error
      });
    }
    else{
      console.log("skipping file "+item.name);
    }
  });

  
}

function updateMessage(){
  let msg = "";
  msg += FilesComplete + "/";
  msg += TotalFiles + " files complete";
  if(FilesComplete == TotalFiles){
    msg="Done";
  }
  window.dispatchEvent(new CustomEvent('syncing-all', {detail:{state:msg}}));
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