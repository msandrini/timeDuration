const MINUTES_PER_HOUR = 60;

const _isValidNumber = (number, type) => {
	if (Number.isNaN(Number(number))) {
		throw new Error(`Invalid value of ${type}: ${number}`);
	}
	return true;
};

const _objectToNumber = (obj) => {
	if (_isValidNumber(obj.hours, 'hours') || _isValidNumber(obj.minutes, 'minutes')) {
		return (obj.hours * MINUTES_PER_HOUR) + obj.minutes;
	}
	return NaN;
};

const _stringToObject = (str, separator = ':') => {
	const [hours, minutes] = str.split(separator);
	if (_isValidNumber(hours, 'hours') || _isValidNumber(minutes, 'minutes')) {
		return {
			hours: Number(hours),
			minutes: Number(minutes)
		};
	}
	return NaN;
};

export default class TimeDuration {

	constructor(...args) {
		this.time = 0;

		const [firstValue, secondValue] = args;
		const fistValueType = typeof firstValue;

		if (fistValueType === 'number' && args.length === 1) {
			this.time = firstValue;

		} else if (fistValueType === 'string' && args.length === 1 && firstValue.includes(':')) {
			const timeObj = _stringToObject(firstValue, ':');
			if (timeObj) {
				this.time = _objectToNumber(timeObj);
			}

		} else if (fistValueType === 'object' && args.length === 1) {
			this.time = _objectToNumber(firstValue);

		} else if (args.length === 2 && fistValueType === 'number' &&
			typeof secondValue === 'number') {
			this.time = _objectToNumber({
				hours: firstValue,
				minutes: secondValue
			});
		}
	}

	/* Conversion operations (output) */

	toMinutes() {
		return this.time;
	}

	valueOf() {
		return this.time;
	}

	toHours(roundDigits = 2) {
		const hours = this.time / MINUTES_PER_HOUR;
		const factor = 10 ** roundDigits;
		return Math.round(hours * factor) / factor;
	}

	toObject() {
		const hours = Math.floor(this.time / MINUTES_PER_HOUR);
		const minutes = this.time % MINUTES_PER_HOUR;
		return { hours, minutes };
	}

	toString(hoursWithZero = false) {
		const { hours, minutes } = this.toObject();
		const minutesZeroed = minutes < 10 ? `0${minutes}` : minutes;
		const hoursZeroed = hours < 10 && hoursWithZero ? `0${hours}` : hours;
		return `${hoursZeroed}:${minutesZeroed}`;
	}

	/* Getters and setters */

	get hours() {
		return this.toObject().hours;
	}

	get minutes() {
		return this.toObject().minutes;
	}

	set hours(hours) {
		const minutes = this.time % MINUTES_PER_HOUR;
		this.time = (hours * MINUTES_PER_HOUR) + minutes;
	}

	set minutes(minutes) {
		const hours = Math.floor(this.time / MINUTES_PER_HOUR);
		this.time = (hours * MINUTES_PER_HOUR) + minutes;
	}

	/* Internal helper */

	_normalize(timeUnknown) {
		const isTimeDuration = !(timeUnknown instanceof this.constructor);
		return isTimeDuration ? new this.constructor(timeUnknown) : timeUnknown;
	}

	/* Modification operations */

	add(timeToAdd) {
		const timeToAddNormalized = this._normalize(timeToAdd);
		this.time = this.time + timeToAddNormalized.toMinutes();
	}

	subtract(timeToSubtract) {
		const timeToAddNormalized = this._normalize(timeToSubtract);
		this.time = this.time - timeToAddNormalized.toMinutes();
	}

	multiply(multiplicationFactor) {
		this.time = this.time * multiplicationFactor;
	}

	divide(divisionFactor) {
		this.time = Math.round(this.time / divisionFactor);
	}

}
