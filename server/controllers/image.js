import grid from "gridfs-stream";
import mongoose from "mongoose";

let gfs, gridfsBucket;
const conn = mongoose.connection;
conn.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "fs"
    });
    gfs = grid(conn.db, mongoose.mongo);
    gfs.collection("fs");
});

export const getImage = async (request, response) => {
    try {
        const file = await gfs.files.findOne({ filename: request.params.filename });
        response.set('Content-Type', file.contentType);//binary to image format
        const readStream = gridfsBucket.openDownloadStream(file._id);
        readStream.pipe(response);
    } catch (error) {
        response.status(500).json({ msg: error.message });
    }
}