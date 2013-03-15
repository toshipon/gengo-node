var request = require('request')
  , crypto = require('crypto')
  , _ = require('underscore')

function gengo(opts) {
  _.defaults(this, opts, {
      publicKey: ''
    , privateKey: ''
    , sandbox: true
    , version: 'v2'
  });
  this.host = this.sandbox ? 'api.sandbox.gengo.com' : 'api.gengo.com';
};

gengo.prototype.signRequest = function(params) {
  var data = _.map(Object.keys(params).sort(), function(key){
    return key + '=' + escape(params[key]);
  }).join('&');
  return crypto.createHmac('sha1', this.privateKey).update(data).digest('hex');
};

gengo.prototype.makeRequest = function(method, path, params, callback) {
  params.api_key = this.publicKey;
  params.ts = new Date().getTime() / 1000;
  params.api_sig = this.signRequest(params);
  params = _.map(Object.keys(params), function(key){
    return key + '=' + escape(params[key]);
  }).join('&');
  var uri = 'http://' + this.host + '/' + this.version + '/' + path;
  if (method == 'GET') {
    uri += '?' + params;
  }
  var opts = {
      uri: uri
    , method: method
    , headers: {Accept: "application/json"}
  };
  if (method != 'GET') {
    opts.body = params;
  }
  request(opts, function(e, r, body) {
    var json = JSON.parse(body);
    callback(json);
  });
};

gengo.prototype.getAccountStats = function(callback) {
  this.makeRequest('GET', 'account/stats', {}, callback);
};
gengo.prototype.getAccountBalance = function(callback) {
  this.makeRequest('GET', 'account/balance', {}, callback);
};
gengo.prototype.getTranslationJobPreviewImage = function(id, callback) {
  this.makeRequest('GET', 'translate/job/' + id + '/preview', {}, callback);
};
gengo.prototype.getTranslationJobRevision = function(id, revId, callback) {
  this.makeRequest('GET', 'translate/job/' + id + '/revision/' + revId, {}, callback);
};
gengo.prototype.getTranslationJobRevisions = function(id, callback) {
  this.makeRequest('GET', 'translate/job/' + id + '/revisions', {}, callback);
};
gengo.prototype.getTranslationJobFeedback = function(id, callback) {
  this.makeRequest('GET', 'translate/job/' + id + '/feedback', {}, callback);
};
gengo.prototype.postTranslationJobComment = function(id, comment, callback) {
  this.makeRequest('POST', 'translate/job/' + id + '/comment', {body: comment}, callback);
};
gengo.prototype.getTranslationJobComments = function(id, callback) {
  this.makeRequest('POST', 'translate/job/' + id + '/comments', {}, callback);
};
gengo.prototype.deleteTranslationJob = function(id, callback) {
  this.makeRequest('DELETE', 'translate/job/' + id , {}, callback);
};
gengo.prototype.getTranslationJob = function(id, callback) {
  this.makeRequest('GET', 'translate/job/' + id , {}, callback);
};
gengo.prototype.putTranslationJob = function(id, params, callback) {
  this.makeRequest('PUT', 'translate/job/' + id , params, callback);
};
gengo.prototype.rejectTranslationJob = function(id, reason, captcha, followup) {
  var params = {
      action: 'reject'
    , reason: reason
    , captcha: captcha
    , followup: followup
  };
  this.putTranslationJob(id, params, callback);
};
gengo.prototype.approveTranslationJob = function(id, rating, translatorComment, staffComment, public) {
  var params = {
      action: 'approve'
    , rating: rating
    , for_translator: translatorComment
    , for_mygengo: staffComment
  };
  this.putTranslationJob(id, params, callback);
};
gengo.prototype.reviseTranslationJob = function(id, comment) {
  var params = {
      action: 'revise'
    , comment: comment
  };
  this.putTranslationJob(id, params, callback);
};
gengo.prototype.postTranslationJob = function(id, job, callback) {
  /* see http://mygengo.com/api/developer-docs/methods/translate-jobs-post/ for all opts */
  this.makeRequest('POST', 'translate/job', job, callback);
};
gengo.prototype.postTranslationJob = function(id, groupId, callback) {
  this.makeRequest('GET', 'translate/jobs/group/' + groupId , {}, callback);
};
gengo.prototype.getTranslationJobs = function(id, opts, callback) {
  /* see http://mygengo.com/api/developer-docs/methods/translate-jobs-get/ for all opts */
  this.makeRequest('GET', 'translate/jobs', opts, callback);
};
gengo.prototype.postTranslationJobs = function(id, jobs, asGroup, callback) {
  opts = _.defaults(opts, {
      jobs: jobs
    , as_group: asGroup
  });
  this.makeRequest('POST', 'translate/jobs' , opts, callback);
};
gengo.prototype.getServiceLanguagePairs = function(srcLang, callback) {
  var opts = {};
  if (srcLang) opts.lc_src = srcLang;
  this.makeRequest('GET', 'translate/service/language_pairs', opts, callback);
};
gengo.prototype.getServiceLanguages = function(callback) {
  this.makeRequest('GET', 'translate/service/languages', {}, callback);
};
gengo.prototype.getServiceQuote = function(jobs, callback) {
  this.makeRequest('GET', 'translate/service/quote', {jobs: jobs}, callback);
};

exports.init = function(opts) {
  return new gengo(opts);
};