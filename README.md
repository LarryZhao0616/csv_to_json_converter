# csv_to_json_converter
A converter that could save csv file(along with images if you want) as json file into MongoDB with mlab.

### Who need this?
* Someone who want to read and operate csv(or xlsx) file data using Nodejs.
* Someone who want to save csv data to mongodb using Nodejs.
* Someone who confused how [fast-csv package](https://www.npmjs.com/package/fast-csv) read the data stream
* Especially someone who want to save some csv data along with some images to mongodb
* You could try things like [mongoimport](https://docs.mongodb.com/v3.4/reference/program/mongoimport/), but sometimes your csv file may not be well formatted (for example different column's length), while you need to do something manually.



### Usage
`node convertAndSave.js [csv_file_path] [optional:image_folder_path]`
> for example:

`node convertAndSave.js ./1.csv ./images`

or

`node convertAndSave.js ./1.csv`

But before successfully run the script, you have to do something else. Let me show you a demo.

***


### Demo
Literally, this converter is a demo to help you learn. I'm showing a scenario of saving a house's data and its images into mongodb using [mlab](https://mlab.com/).

The house's data is collected from <https://www.realtor.com/>. And I modified the data a little bit to hide personal information.

* #### Structure

<pre>
.
├── convertAndSave.js
├── 1.csv    
├── images
│   ├── 1.jpg
│   ├── 2.jpg
│   ├── 3.jpg
│   └── 4.jpg
├── NewHouse.js
├── keys.js
├── package-lock.json
└── package.json
</pre>
`convertAndSave.js` is the converter.

`1.csv` file contains the text data of a house, most of columns' length are different.

`images` is the folder that contains the pictures of the house. It doesn't matter how you name those pictures in the folder, although I named them in numerical order.

`NewHouse.js` is the file to create data schema.

`keys.js` saves your mlab connection key.

* #### Preparation
	Install packages.
	
		`npm install`
	
	
	Set your own mlab keys in keys.js file.
	
	I'm using [mlab](https://mlab.com/welcome/), a Database-as-a-Service for MongoDB. So I have a key to connect my account in mlab. [Set your key](http://docs.mlab.com/) in keys.js to save your data in your database.
		
	If you are not using mlab, remember to modify the line 12 in convertAndSave.js
	
		`const { mLab } = require('./keys.js');`
		
* #### Data schema and csv header
	First, you need to create a data schema for yourself. Note that try to name the fields by some [standard](https://stackoverflow.com/questions/7662/database-table-and-column-naming-conventions), or you gonna mess up one day.
	
	Then, you have to **manually copy** those fields' name and insert(or cover) them into your csv's first row. This step makes sure the result of reading stream will be a json file whose keys of each objects are the same as schema's field names.
	
	You gonna spend most of your time in this step. For example, my original data source is a .xlsx file whose first row looks like this:
	
	![original header](https://drive.google.com/uc?export=&id=1eAZvzv7OaQEmhJMF4ttedLhOu7PpwnPq)
	
	I don't like those spaces in field name, so I chose to manually modify my cvs file. That means if you have 30 csv files, you have to copy and paste 30 times.
	
	
* #### Run the script

	Ok, run the script!
	
	`node convertAndSave.js ./1.csv ./images`
	
	If everything goes well, you will see this in console:
	
	`successfully create a document in your mongodb collection!`
	
	Then close the script by pressing `Control` + `c`
	
	Check your mlab to see the result:
	
![mlab result](https://drive.google.com/uc?export=&id=1mnOcnTCFh8IXxVl88_lilPSWay97n25U)

Done!
	
	 







***

### A much more powerful converter
I found a powerful converter created by @[shancarter](https://github.com/shancarter) 

here: <http://shancarter.github.io/mr-data-converter/>

If you don't have to modify things in your data and just want a pure json object, try this one, it is wonderful! It will convert your Excel data into one of several web-friendly formats, including HTML, JSON and XML.


***

### TODO lists

1. Clean those warning messages while running the script.
![Warning Message](https://drive.google.com/uc?export=&id=1aTN8qtsjdt04HCfZ_ZH2Sq79ucWnmFtW)
2. process and convert multiple cvs files and their images at one time.
3. develop a tool to help user set cvs file's header(1st row) value according to the data schema's field names.
4. Or instead of No.3, create an instance of the data schema, then use something like this:         

        intance.house_id = 1;
        intense.save();
   In this way, we could save much more time due the reason that we don't have to manually copy header in csv files anymore.



