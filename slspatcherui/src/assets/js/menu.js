var pathToDest, body='';
var child = require('child_process').execFile;
const remote = require('electron').remote;
const electron = require('electron');
var AsyncLock = require('async-lock');
const fs = require('fs');
const path = require('path');
var lock = new AsyncLock();
let TotalFiles = 0;
let FilesComplete = 0;
let SizeTodo = 0;
let SizeDownload = 0;
GetConfigDir();
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
  SaveConfig(pathToDest);
  GetConfigDir();
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

function syncFile(item, path, isRetry = false, checkOnly = false){

  var fs = require('fs');

  fs.stat(pathToDest+'/'+path+"/"+item.name, function(err, stats) {

    if (stats==null || stats["size"] != item.size) {
      
      lock.acquire('GetFile', function(callback){
        if(!isRetry){
          lock.acquire('TotalFilesLock', function(cb){
            TotalFiles++;
            updateMessage(project);
            cb();
          }, function(err, ret){
            if(err!=null)
            console.log(err.message) // output: error
          });
        }
        console.log("syncing file "+item.name);
        console.log("syncing path "+path);
        var Client = require('ftp');
        var c = new Client();
        c.on('ready', function() {
          c.cwd(path, function(){
            c.get(item.name, function(err, stream) {
              try{
                stream.once('close', function() { c.end(); });
                var shell = require('shelljs');
                shell.mkdir('-p', pathToDest+"/"+path+"/");
                console.log(pathToDest+'/'+path+"/"+item.name);
                stream.pipe(fs.createWriteStream(pathToDest+'/'+path+"/"+item.name));
                callback();
                lock.acquire('completeFilesLock', function(cb){
                  FilesComplete++;
                  if(!isRetry)
                  SizeDownload+=item.size;
                  console.log(SizeTodo);
                  console.log(SizeDownload);
                  updateMessage(project);
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
function scanAll(path){
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
              scanAll(path+"/"+item.name);
            }
            else{
              lock.acquire('TotalFilesLock', function(cb){
                totalGb += item.size;
                updateMessage(project);
                cb();
              }, function(err, ret){
                if(err!=null)
                console.log(err.message) // output: error
              });
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

function updateMessage(){
  let msg = "";
  msg += FilesComplete + "/";
  msg += TotalFiles + " files complete";
  if(FilesComplete == TotalFiles){
    msg="Done";
  }
  if(project){
    if(msg=="Done"){
      window.dispatchEvent(new CustomEvent('project-status', {detail:{state:"ready", project:project}}));
    }else{
      window.dispatchEvent(new CustomEvent('project-status', {detail:{state:"downloading", project:project, DownloadSize:bytesToSize(SizeDownload)}}));
    }
  }else{
    window.dispatchEvent(new CustomEvent('syncing-all', {detail:{state:msg}}));
  }
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
window.addEventListener("get-project-status", function (event){
  lock.acquire('GetDiff', function(cb){
    window.dispatchEvent(new CustomEvent('project-status', {detail:{state:"calculating", project:event.detail.project, Size:0}}));

    var calculator = new SizeCalculator(event.detail.directory, pathToDest, require('fs'));
    calculator.mainCallback = (calculation)=>{
      if(calculation.NoRemote){
        window.dispatchEvent(new CustomEvent('project-status', {detail:{state:"unavailable", project:event.detail.project, Size:bytesToSize(calculation.TotalSize)}}));
      }
      else if(calculation.RequiresInstall){
        window.dispatchEvent(new CustomEvent('project-status', {detail:{state:"available", project:event.detail.project, Size:bytesToSize(calculation.TotalSize), UpdateSize:bytesToSize(calculation.TotalSize)}}));
      }
      else if(calculation.RequiresUpdate){
        window.dispatchEvent(new CustomEvent('project-status', {detail:{state:"update", project:event.detail.project, Size:bytesToSize(calculation.TotalSize), UpdateSize:bytesToSize(calculation.UpdateSize)}}));
      }
      else{
        window.dispatchEvent(new CustomEvent('project-status', {detail:{state:"ready", project:event.detail.project, Size:bytesToSize(calculation.TotalSize)}}));
      }
    };
    calculator.Start();
    cb();
  }, LockError);
});

function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

window.addEventListener("install-project", function (event){
  project = event.detail.name;
  //syncDir(event.detail.directory);
  
  var calculator = new SizeCalculator(event.detail.directory, pathToDest, require('fs'), require('shelljs'));
  calculator.sync = true;
  calculator.mainCallback = (calculation)=>{console.log("syncing")};
  calculator.Start();
});

function Update(directory){

}

window.addEventListener("launch-project", function (event){
  var executablePath = pathToDest+'/'+event.detail.directory+"/"+event.detail.launch;

  child(executablePath, function(err, data) {
      if(err){
         console.error(err);
         return;
      }
   
      console.log(data.toString());
  });
  
});

window.addEventListener("open-project-folder", function (event){
  var executablePath = pathToDest+'/'+event.detail.directory;

  require('child_process').exec('start "" "'+executablePath+'"');
});

function Delete(directory){

}

function GetConfig(){

}

function SaveConfig(data){
  fs.writeFileSync(this.GetConfigPath(), JSON.stringify({
    path: data
  }));
}

function GetConfigDir(){
  console.log("checking "+this.GetConfigPath());
  fs.exists(this.GetConfigPath(), (exists)=>{
    if(exists){
      var data = JSON.parse(fs.readFileSync(this.GetConfigPath()));
      pathToDest = data.path;
      window.dispatchEvent(new CustomEvent('config-read', {detail:{state:data}}));
      console.log(data);
    }
    console.log("no config file");
  })
}

function GetConfigPath(){
  const userDataPath = (electron.app || electron.remote.app).getPath('userData');
  return path.join(userDataPath, 'config' + '.json');
}
