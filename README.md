# pinfo

for displaying photo file exposure data in the browser using HTML5 `canvas` and D3.js v4

---
## running locally using python3's built in http server

* `$ cd pinfo/src`
* `$ python3 -m http.server`
* navigate to [http://localhost:8000/pinfo.html](http://localhost:8000/pinfo.html) (*tested in Chrome 53*)
* drag and drop an image file (jpg, png) on to the blue drop zone
* hover over image to see pixel values

---
## sample screenshots

![normalpixel](img/normalpixel.png)

![satpixel](img/saturatedpixel.png)