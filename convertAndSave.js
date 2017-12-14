var fs = require('fs');
var path = require('path');
//fs and path are inbuild packages

var csv = require('fast-csv');
var mongoose = require('mongoose');
var moment = require('moment');
var junk = require('junk');
//use fast-csv to read file stream, monggose to connect mongodb, moment to create a save time tag, use junk to ignore .ds_store when saving images in mac.

//*************require your mlab keys**************//
const { mLab } = require('./keys.js');
//*************require your mlab keys**************//

mongoose.connect(mLab);
var NewHouse = require('./NewHouse.js');
var houseInstance = new NewHouse;
//NewHouse.create() or houseinstance.save(),
//In this demo, I didn't use houseinstance

//the array to save image data
var images = new Array();

//***read command line arguments
var imgdirpath = process.argv[3];
var csvfilepath = process.argv[2];

//image path argument is optional,
//if you want to save some images together with your csv data,
//just save your pictures in a folder and tell this .js the folder path.
//Thanks to :https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
if(imgdirpath){
    var walk = function(dir, done) {
	var results = [];
	fs.readdir(dir, function(err, list) {
	    //	console.log(list);
	    if (err) return done(err);
	    list=list.filter(junk.not);
	    var pending = list.length;
	    if (!pending) return done(null, results);
	    list.forEach(function(file) {
		file = path.resolve(dir, file);
		fs.stat(file, function(err, stat) {
		    results.push(file);
		    if (!--pending) done(null, results);
		});
	    });
	});
    };

    walk(imgdirpath, function(err, results) {
	if (err) throw err;
	results.forEach(function(file) {
	    //use same format in your schema
	    var subimage={data : fs.readFileSync(file),content_type:'image/jpeg'};
	    images.push(subimage);
	});
	//    console.log(images);
    });
}

//create a fime stream
var stream = fs.createReadStream(csvfilepath);

//as the file will be read row by row, headtag is pointer to row.
//e.g: headtag = 5, means the stream is reading the 5th row of the csv file
var headtag=0;

//the final stream read result, will be the same format in schema.
var readResult={};

//fieldname records the headers key name.
var fieldnames={};
csv.fromStream(stream,{ignoreEmpty:true})
    .on("data", function(data){
	if(headtag === 0){
	    //I assume the first row is the headers,so should make sure the headers' names are the same in your schema
	    fieldnames = data;
	    for(var i=+0; i<data.length; i++){
		readResult["data[i]"] = {};
	    }
	}
	if(headtag === 1){
	    //some of fields may only conatins one value, so save them as a String
	    for(var i=+0; i<data.length; i++){
		readResult[fieldnames[i]] = data[i];
	    }
	}
	if(headtag === 2){
	    for(var i=+0 ; i<data.length; i++){
		//for those field that may contains multiple values, convert them as an array, then push all values in it.
		if(data[i]!==""){
		    readResult[fieldnames[i]]=new Array( readResult[fieldnames[i]]);
		     readResult[fieldnames[i]].push(data[i]);
		}
	    }
	}
	if(headtag > 2){
	    for(var i=+0 ; i<data.length; i++){
                if(data[i]!==""){
		    readResult[fieldnames[i]].push(data[i]);
                }
            }
	}
	headtag=headtag+1;
    })
    .on("end",function(){
	readResult.images = images;
	//create a time tag
	var startdate = moment().format('MM/DD/YYYY');
	var starttime = moment().format('H:mm:ss');
	readResult.save_date=startdate;
	readResult.save_time=starttime;
	//save the data in mongodb
	NewHouse.create(readResult, function(error, house){
	    if(error){
		console.log(error);
	    }
	    else{
		console.log("successfully create a document in your mongodb collection!");
	    }
	});
    });

/*
//read line by line
rl.on('line', (line) => {
    var arr = line.split(",").map(function (val){
	return String(val);
    });
    //    console.log(arr[0]);
    var fieldname = arr[0];

});
*/

/*
this is a much more powerful converter I found, you can try it.
http://shancarter.github.io/mr-data-converter/ 
*/


