require('should');

const zapier = require('zapier-platform-core');

// Use this to make test calls into your app:
const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('My App', () => {

	it('should find a pulse', (done) => {
		const bundle = {};

		appTester(App.searches.pulse.operation.perform, bundle)
	  		.then(results => {
				console.log(`Result ${results.length}`)
			    should(results.length).equal(1);

			    const firstResult = results[0];
			    console.log('test result: ', firstResult)

		    	done();
	  		}).catch(done);
	});

	it('should get updated pulses', (done) => {
		const bundle = {};
	
		appTester(App.triggers.pulses.operation.perform, bundle)
		  .then(results => {
			should(results.length).above(1);
			const firstResult = results[0];
			console.log('test result: ', firstResult)
	
			done();
		  })
		  .catch(done);
	  });
});
