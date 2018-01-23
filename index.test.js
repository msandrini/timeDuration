import TimeDuration from './index';

/* globals describe, it, expect */

describe('SimpleTime', () => {

	it('the class should be instantiated', () => {
		const td = new TimeDuration();
		expect(typeof td === 'object').toBeTruthy();
	});

});
