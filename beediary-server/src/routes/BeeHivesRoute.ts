///<reference path='../../typings/node/node.d.ts'/>
///<reference path='../../typings/express/express.d.ts'/>
///<reference path='../../typings/mongodb/mongodb.d.ts'/>

import BeeHive = require('./../model/model/BeeHive/BeeHive');
import DiaryEntry = require('./../model/model/DiaryEntry/DiaryEntry');
import Utilities = require('./../model/utilities/Utilities');
import Authentication = require('./../Authentication');
import mongodb = require('mongodb');

const express = require('express');
const router = express.Router();
const Auth = new Authentication.Authentication();

//Database handeling (MongoDB)
var ObjectId = mongodb.ObjectID;
var databaseServer =  new mongodb.Server('localhost', 27017, {auto_reconnect: true});
var database = new mongodb.Db('beesaver-db', databaseServer, {w: 1});
database.open(function() {});

router.use(function(req, res, next) {
    console.log('Incoming request. - BeeHive');
    Auth.isTokenValid(req.headers.token, (id: string, err: any) => {
        if(err == "") {
            req.body.googleUserId = id;
            next(); 
        } else {
            console.error(err);
			res.statusCode = 401;
            res.json({message: 'Authentication failed. Token invalid or Access denied.' });
        }
    });
});

//Callable with GET on http://localhost:8080/api/BeeHives/
router.get('/', function(req, res) {
    res.json({ message: 'API is online and ready to receive requests! - BeeHive' });   
});

// create a new BeeHive (accessed at POST http://localhost:8080/api/BeeHives/beeHives)
router.route('/beeHives').post(function(req, res) {
        // save the BeeHive and check for errors
        if (req.body.hiveLocation != null && req.body.source != null && req.body.lost != null) {
            var hiveLocation = new BeeHive.HiveLocation(req.body.hiveLocation.lat, req.body.hiveLocation.lng, req.body.hiveLocation.address, req.body.hiveLocation.markerId, req.body.hiveLocation.position);
            var source = new BeeHive.Source(req.body.source.type, req.body.source.otherSource, req.body.source.origin);
            var lost = new BeeHive.Lost(req.body.lost.isLost, req.body.lost.reason);
            if(req.body.photo == undefined) {
                req.body.photo = {};
            }
            if (req.body.photo.id == 0) {
                req.body.photo.id = new ObjectId();
            }
            var photo = new DiaryEntry.Photo(req.body.photo.id, req.body.photo.content);
            
            var newHive = new BeeHive.BeeHive(req.body.googleUserId,req.body.hiveNumber, req.body.hiveName, req.body.startDate, req.body.description, photo, undefined,
            hiveLocation, source, lost, req.body.frameSize, req.body.otherFrameSize, req.body.frameMaterial, req.body.otherFrameMaterial, req.body.combConstruction, req.body.otherCombConstruction, req.body.trader, '');
            
            database.collection('BeeHives', function(error, beeHives) {
                if(error) {
                    console.error(error);
                    return;
                }
                beeHives.insertOne(newHive, function(error, hive) {
                    if(error) {
                        console.error('Error at adding a new BeeHive.')
                        console.error(error);
                        res.send(error);
                        return;
                    } else {
                        res.json({message: 'BeeHive created!' });
                        console.log('New BeeHive created.');
                    }
                })
            });
        } else {
            res.json({message: 'Nested objects cannot be null! (hiveLocation, lost, source)'})
        }
    });
    
// gets all BeeHives (accessed at GET http://localhost:8080/api/BeeHives/beeHives)    
router.route('/beeHives').get(function(req, res) {
        database.collection('BeeHives', function(error, beeHives) {
       if(error) {
           console.error(error);
           return;
       } 
       beeHives.find().toArray(function(error, beeHives) {
          if(error) {
              res.send(error);
              console.error('Error at getting all BeeHives.');
          } else {
          res.json(beeHives);
          console.log('All BeeHives successfully returned. (' + beeHives.length + ' BeeHives)');
          }
       });
    });
});
    
// get exactly one BeeHive by id(accessed at GET http://localhost:8080/api/BeeHives/beeHives/:hive_id)
router.route('/beeHives/:hive_id').get(function(req, res) { 
    database.collection('BeeHives', function(error, beeHives) {
       if(error) {
           console.error(error);
           return;
       } 
       beeHives.findOne({"_id": new ObjectId(req.params.hive_id)}, function(error, hive) {
          if(error) {
                res.send(error);
                console.log('Error at getting one specific BeeHive by Id.');
          } else {
            res.json(hive);
            console.log('One specific BeeHive by Id successfully returned.');
          }
       });
    });
});

// update a single BeeHive info by id (accessed at PUT http://localhost:8080/api/BeeHives/beeHives/:hive_id)
router.route('/beeHives/:hive_id').put(function(req, res) {
       database.collection('BeeHives', function(error, beeHives) {
       if(error) {
           console.error(error);
           return;
       }
       var newHiveLocation = new BeeHive.HiveLocation(req.body.hiveLocation.lat, req.body.hiveLocation.lng, req.body.hiveLocation.address, req.body.hiveLocation.markerId, req.body.hiveLocation.position);
       var newSource = new BeeHive.Source(req.body.source.type, req.body.source.otherSource, req.body.source.origin);
       var newLost = new BeeHive.Lost(req.body.lost.isLost, req.body.lost.reason);
       if(req.body.photo == undefined) {
                req.body.photo = {};
            }
            if (req.body.photo.id == 0) {
                req.body.photo.id = new ObjectId();
            }
        var photo = new DiaryEntry.Photo(req.body.photo.id, req.body.photo.content);
        beeHives.findOneAndUpdate({"_id": new ObjectId(req.params.hive_id)},
         {
             "googleId" : req.body.googleUserId,
             "hiveNumber" : req.body.hiveNumber,
             "hiveName" : req.body.hiveName,
             "startDate" : req.body.startDate,
             "description" : req.body.description,
             "photo" : photo,
             "lastDiaryEntryDate" : req.body.lastDiaryEntryDate,
             "hiveLocation" : newHiveLocation,
             "source" : newSource,
             "lost" : newLost,
             "frameSize" : req.body.frameSize,
             "otherFrameSize" : req.body.otherFrameSize,
             "frameMaterial" : req.body.frameMaterial,
             "otherFrameMaterial" : req.body.otherFrameMaterial,
             "combConstruction" : req.body.combConstruction,
             "otherCombConstruction" : req.body.otherCombConstruction,
             "trader" : req.body.trader
            }, function(error, hive) {
            if(error) {
                res.send(error);
                console.log('Error at updating one specific BeeHive.');
            } else {
                res.json({message: 'BeeHive by Id successfully updated.' });
                console.log('One specific BeeHive by Id successfully updated.');
            }
        });
    });
});
    
// delete a single BeeHive by id (accessed at DELETE http://localhost:8080/api/BeeHives/beeHives/:hive_id)
router.route('/beeHives/:hive_id').delete(function(req, res) {
        database.collection('BeeHives', function(error, beeHives) {
       if(error) {
           console.error(error);
           return;
       } 
       beeHives.findOneAndDelete({"_id": new ObjectId(req.params.hive_id)}, function(error, hive) {
          if(error) {
                res.send(error);
                console.log('Error at deleting one specific BeeHive by Id.');
          } else {
          res.json({message: 'BeeHive by Id successfully deleted.'});
          console.log('One specific BeeHive by Id successfully deleted.')
          }
       });
    });
    });
    
/*// gets all Members of the BeeHive-SourceEnum (accessed at GET http://localhost:8080/api/BeeHives/sourceEnum)    
router.route('/sourceEnum').get(function(req, res) {
        res.json(Utilities.getArrayOfEnum(BeeHive.sourceEnum));
});

// gets all Members of the BeeHive-FrameSizeEnum (accessed at GET http://localhost:8080/api/BeeHives/sizeEnum)    
router.route('/sizeEnum').get(function(req, res) {
        res.json(Utilities.getArrayOfEnum(BeeHive.frameSizeEnum));
});

// gets all Members of the BeeHive-FrameMaterialEnum (accessed at GET http://localhost:8080/api/DiaryEntries/materialEnum)    
router.route('/materialEnum').get(function(req, res) {
        res.json(Utilities.getArrayOfEnum(BeeHive.frameMaterialEnum));
});

// gets all Members of the BeeHive-CombConstructionEnum (accessed at GET http://localhost:8080/api/DiaryEntries/constructionEnum)    
router.route('/constructionEnum').get(function(req, res) {
        res.json(Utilities.getArrayOfEnum(BeeHive.combConstructionEnum));
});*/

// gets all BeehiveNames with Id's (accessed at GET http://localhost:8080/api/BeeHives/BeeHiveNames)    
router.route('/BeeHiveNames').get(function(req, res) {
       database.collection('BeeHives', function(error, beeHives) {
       if(error) {
           console.error(error);
           return;
       } 
       beeHives.find({ }, {_id: 1, hiveName: 1}).toArray(function(error, beeHives) {
          if(error) {
              res.send(error);
              console.error('Error at getting all BeeHiveNames with Ids..');
          } else {
          res.json(beeHives);
          console.log('All BeeHiveNames with Ids successfully returned. (' + beeHives.length + ' BeeHives)');
          }
       });
    });
});

module.exports = router;