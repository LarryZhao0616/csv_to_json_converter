# csv_to_json_converter
A converter that could save csv file(along with images if you want) as json file into MongoDB with mlab.

###who need this?
* Someone who want to read and operate csv(or xlsx) file data using Nodejs.
* Someone who want to save csv data to mongodb using Nodejs.
* Someone who confused how [fast-csv package](https://www.npmjs.com/package/fast-csv) read the data stream
* Especially someone who want to save some csv data along with some images to mongodb
* You could try things like [mongoimport](https://docs.mongodb.com/v3.4/reference/program/mongoimport/), but sometimes your csv file may not be well formatted (for example different column's length), while you need to do something manually.

###a demo
Literally, this converter is a demo to help you learn. I'm showing a scenario of saving a house's data and its images into mongodb using [mlab](https://mlab.com/).

The house's data is collected from <https://www.realtor.com/>. And I modified the data a little bit to hide personal information.