var client = require('./config');

describe('Accont', function(){
	describe('#getAccountStats', function(){
		it('should be completed successfully', function(){
			client.getAccountStats(function(json){
				(json.opstat).should.equal('ok');
				done();
			});
		});
	});

	describe('#getAccountBalance', function(){
		it('should be completed successfully', function(){
			client.getAccountBalance(function(json){
				(json.opstat).should.equal('ok');
				done();
			});
		});
	});
});

	