var multer 			= require('multer');
var randomstring = require("randomstring");
var path 			= require('path');
var notify   		= require(__path.__path_configs+'notify');
var fs 				= require('fs');



let uploadFile = (field,folderDes = 'users',fileNameLength = 10,fileSizeMb = 5,fileExtension ='jpeg|jpg|png|gif') =>{
	var storage = multer.diskStorage({
		destination: function (req, file, cb) {
		  cb(null, __path.__path_uploads+folderDes+'/')
		},
		filename: function (req, file, cb) {
		  cb(null, randomstring.generate(20) + path.extname(file.originalname))
		}
	  })

	var upload = multer({
		storage: storage,
		limits:{
			fileSize:fileSizeMb * 1024 * 1024,
		},
		fileFilter:(req,file,cb) => {
			const filetypes = new RegExp(fileExtension);
			const extname 	= filetypes.test(path.extname(file.originalname).toLowerCase());
			const mimetype  = filetypes.test(file.mimetype);

			if(mimetype && extname){
				return cb(null,true);
			}else{
				cb(notify.VALIDATES.ERROR_FILE_EXTENSION);
			}

		}
	}).single(field);
	return  upload;
}

let removeFile = (folder,fileName) =>{
	if(fileName !=""&&fileName!=undefined){
		let path = folder + fileName;
		if(fs.existsSync(path)) fs.unlink(path,(err)=>{if (err) throw err });
	}
}

module.exports = {
	uploadFile:uploadFile,
	removeFile:removeFile
}
   