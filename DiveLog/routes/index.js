
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};


exports.divelog = function(req, res){
  res.render('divelog', { title: 'Express' });
};
