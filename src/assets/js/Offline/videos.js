$(document).ready(function () {
    app.init();
});

const AzureMidiamyOptions = {
    "nativeControlsForTouch": false,
    controls: true,
    autoplay: false,
    width: "640",
    height: "400",
    logo: {enabled: false}
}

var app = {
    async init() {
        var self = this;
        await db.init();
        //await this.LoadVideo();
    },
    async LoadVideo(){

        //verifica se aplicação está online
        if(navigator.onLine){
            //online

            myPlayer1 = amp("azuremediaplayer1", AzureMidiamyOptions);
			myPlayer1.src([
				{
					"src": "/video/v2.mp4",
					"type": "video/mp4"
					
				}
            ]);

        }else{

            //offline

            //acess offline bd
            await db.init();

            //get data
            //db.allDocs.find(x => x.id === 'video_1');
            var doc = await db.db.getAttachment('video_1', 'video.mp4')
            var url = window.URL || window.webkitURL;
            var blobUrl = url.createObjectURL(doc);

            myPlayer1 = amp("azuremediaplayer1", AzureMidiamyOptions);
			myPlayer1.src([
				{
					"src": blobUrl,
					"type": "video/mp4"
					
				}
            ]);

        }
    },
    downloadVideo(video) {
        var self = this;

        console.log(video);

        $.ajax({
            url: video.src,
            cache: false,
            xhr: function () {
                var xhr = new XMLHttpRequest();
                xhr.responseType = 'arraybuffer'
                //Upload progress
                xhr.addEventListener('progress', function (e) {
                    if (e.lengthComputable) {
                        console.log((100 * e.loaded / e.total))
                        $('.progress-bar > div').css('width', '' + (100 * e.loaded / e.total) + '%');
                    }
                });
                return xhr;
            },
            success: function (data) {

                var videoRow = {
                    "_id": 'video_' + video.id,
                    "title": video.title,
                    "_attachments": {
                        "video.mp4": {
                            "content_type": "video/mp4",
                            "data": new Blob([new Uint8Array(data)], {type: 'video/mp4'})
                        }
                    }
                };
                db.db.put(videoRow).then(function (result) {
                    console.log('video success download , can watch in download list');
                    console.log(result);
                    //self.getDownloadTool(video)
                }).catch(function (err) {
                    console.log(err);
                });


            },
        });
    }
}

var db = {
    db: null,
    allDocs: [],
    init() {
        var self = this;
        return new Promise((resolve, reject) => {
            this.db = new PouchDB('video');
            this.db.allDocs({include_docs: true, descending: true}, function (err, doc) {
                self.allDocs = doc.rows;
                resolve()
            });
        })
    },
}
