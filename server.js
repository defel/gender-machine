
var fs = require('fs'),
    application_root = __dirname,
    express = require('express'),
    mongoose = require('mongoose'),
    path = require("path"),
    // Create a new Express app
    app = module.exports = express(),
    profiles = JSON.parse(fs.readFileSync('profiles.json')),
    profile;

// === APP SETUP ===
if(!process.env.APPENV) {
  process.env.APPENV = 'prod';
}

profile = profiles[process.env.APPENV];

// Connect to mongodb
mongoose.connect(profile.mongo);

// Use middleware to parse POST data and use custom HTTP methods
app.use(express.bodyParser());
app.use(express.methodOverride());

app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// == APP ==


var SourceSchema = new mongoose.Schema({
  label: { type: String, required: true},
  url: { type: String, required: true}
});

var SearchSchema = new mongoose.Schema({
  searchFor: { type: String, required: true},
  result: { type: String, required: true},
  source: { type: mongoose.Schema.ObjectId, ref: 'Source'},
  example: { type: String, require: true}
});

SearchSchema.index({searchFor: 1, result: 1}, {unique: true}); 

var 
  SourceModel = mongoose.model('Source', SourceSchema),
  SearchModel = mongoose.model('Search', SearchSchema);

app.get('/api', function (req, res) {
  res.send('API is running');
});

// list all entries
/**
app.get('/api/search', function(req, res) {
  return SearchModel.find(function(err, results) {
    if(!err) { 
      return res.send(results)
    } else { 
      console.error(err);
    };
  });
});
**/

// post new entry
app.post('/api/search', function(req, res) {
  var search, source;

  console.log('POST: ', req.body); 

  var saveSearch = function(sourceId) {
    var searchData = {};

    searchData = {
      searchFor: req.body.searchFor,
      result: req.body.result,
      example: req.body.example
    };

    if(sourceId) {
      searchData.source = sourceId;
    }

    search = new SearchModel(searchData);
    search.save(function(err) {
      if(!err) {
        console.log('created');
        res.send(search); 
      } else {
        res.send(err);
      }
    });
  }

  // save source
  if(req.body.source) {
    
    var findQuery = {url: req.body.source.url};
    var source = SourceModel.update(
      findQuery,
      {
        label: req.body.source.label,
        url: req.body.source.url
      },
      {upsert: true},
      function(err, data, result) {
        if(err) {
          console.error('Err: ' + err);
        } else {
          if(result.updatedExisting) {
            // find
            SourceModel.find(findQuery).exec(function(err, results) {
              console.log('SAVE SEARCH: ' + results[0]['_id']);
              saveSearch(results[0]['_id']);
            });
          } else {
            saveSearch(result.upserted);
          }
        }
      }
    );

  } else {
    saveSearch();
  }

});

// search for a single item
app.get('/api/search/:for', function(req, res) {
  console.log('Search For: ', req.params.for);
  if(!req.params.for || req.params.for.length < 3 ) {
    return res.send([]);
  }
  SearchModel.find({ "searchFor": new RegExp(req.params.for, 'i') })
    .populate('source')
    .exec(function(err, results) {
    if(!err) {
      return res.send(results);
    } else {
      console.error(err); 
    }
  });
});


app.listen(8349);
