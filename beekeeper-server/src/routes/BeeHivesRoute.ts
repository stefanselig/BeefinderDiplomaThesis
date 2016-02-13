///<reference path='../../typings/node/node.d.ts'/>
///<reference path='../../typings/express/express.d.ts'/>
///<reference path='../../typings/mongodb/mongodb.d.ts'/>

import BeeHive = require('../models/BeeHive');
import mongodb = require('mongodb');

var config = require('./config');
var express = require('express');
var router = express.Router();

var validator = require('validator');

//Database handeling (MongoDB)
var ObjectId = mongodb.ObjectID;
var databaseServer =  new mongodb.Server('localhost', 27017, {auto_reconnect: true});
var database = new mongodb.Db('beesaver-db', databaseServer, {w: 1});
database.open(function() {});

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Incoming request. - BeeHive');
    next(); // make sure we go to the next routes and don't stop here
});

//Callable with GET on http://localhost:8080/api/BeeHives/
router.get('/', function(req, res) {
    res.json({ message: 'API is online and ready to receive requests! - BeeHive' });   
});


// create a new BeeHive (accessed at POST http://localhost:8080/api/BeeHives/beeHives)
router.route('/beeHives').post(function(req, res) {
        // save the BeeHive and check for errors
        if (req.body.hiveLocation != null && req.body.source != null && req.body.lost != null) {
            var hiveLocation = new BeeHive.HiveLocation(req.body.hiveLocation.lat, req.body.hiveLocation.long, req.body.hiveLocation.address, req.body.hiveLocation.markerId);
            var source = new BeeHive.Source(req.body.source.type, req.body.source.origin);
            var lost = new BeeHive.Lost(req.body.lost.isLost, req.body.lost.reason);
        
            var newHive = new BeeHive.BeeHive(req.body.hiveNumber, req.body.hiveName, req.body.startDate, req.body.description,
            hiveLocation, source, lost, req.body.frameSize, req.body.frameMaterial, req.body.combConstruction); //create a new instance of the BeeHive-model
            
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
            res.json({message: 'Nested objects can not be null! (hiveLocation, lost, source)'})
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
          console.log('One specific BeeHive by Id successfully returned.')
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
       var newHiveLocation = new BeeHive.HiveLocation(req.body.hiveLocation.lat, req.body.hiveLocation.long, req.body.hiveLocation.address, req.body.hiveLocation.markerId);
       var newSource = new BeeHive.Source(req.body.source.type, req.body.source.origin);
       var newLost = new BeeHive.Lost(req.body.lost.isLost, req.body.lost.reason);
        beeHives.findOneAndUpdate({"_id": new ObjectId(req.params.hive_id)},
         {
             "hiveNumber" : req.body.hiveNumber,
             "hiveName" : req.body.hiveName,
             "startDate" : req.body.startDate,
             "description" : req.body.description,
             "hiveLocation" : newHiveLocation,
             "source" : newSource,
             "lost" : newLost,
             "frameSize" : req.body.frameSize,
             "frameMaterial" : req.body.frameMaterial,
             "combConstruction" : req.body.combConstruction
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
    
// gets all Members of the BeeHive-SourceEnum (accessed at GET http://localhost:8080/api/BeeHives/sourceEnum)    
router.route('/sourceEnum').get(function(req, res) {
        res.json(BeeHive.getSourceEnum());
});

// gets all Members of the BeeHive-FrameSizeEnum (accessed at GET http://localhost:8080/api/BeeHives/sizeEnum)    
router.route('/sizeEnum').get(function(req, res) {
        res.json(BeeHive.getFrameSizeEnum());
});

// gets all Members of the BeeHive-FrameMaterialEnum (accessed at GET http://localhost:8080/api/DiaryEntries/materialEnum)    
router.route('/materialEnum').get(function(req, res) {
        res.json(BeeHive.getFrameMaterialEnum());
});

// gets all Members of the BeeHive-CombConstructionEnum (accessed at GET http://localhost:8080/api/DiaryEntries/constructionEnum)    
router.route('/constructionEnum').get(function(req, res) {
        res.json(BeeHive.getCombConstructionEnum());
});
    
module.exports = router;