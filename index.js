const MINUTES_PER_HOUR = 60;
const MILLISECONDS_PER_MINUTE = 60 * 1000;
const TIME_SEPARATOR = ':';

const _isValidNumber = number => !Number.isNaN(Number(number));
const _isValidObjectValue = (obj, key) =>
	Object.prototype.hasOwnProperty.call(obj, key) && (typeof obj[key] !== 'undefined');

const _objectToNumber = (obj) => {
	const hours = _isValidObjectValue(obj, 'hours') ? obj.hours : 0;
	const minutes = _isValidObjectValue(obj, 'minutes') ? obj.minutes : 0;

	if (_isValidNumber(hours) && _isValidNumber(minutes)) {
		const absMinute = (
			(Math.abs(Number(hours)) * MINUTES_PER_HOUR) + Math.abs(Number(minutes))
		);
		if (Object.is(Number(hours), -0) || Number(hours) < 0) {
			return -absMinute;
		}
		return absMinute;
	}
	throw new Error(`Cannot convert object ${JSON.stringify(obj)} to TimeDuration`);
};

const _stringToObject = (str, separator = TIME_SEPARATOR) => {
	const [hours, minutes] = str.split(' ').join('').split(separator);
	if (_isValidNumber(hours) && _isValidNumber(minutes)) {
		return {
			hours: Number(hours),
			minutes: Number(minutes)
		};
	}
	throw new Error(`Cannot convert string "${str}" to TimeDuration`);
};

class TimeDuration {

	constructor(...args) {
		this._minutes = 0;

		const [firstValue, secondValue] = args;

		if (typeof firstValue === 'number' && args.length === 1) {
			this._minutes = firstValue;

		} else if (firstValue instanceof TimeDuration) {
			this._minutes = firstValue.valueOf();

		} else if (firstValue instanceof Date && secondValue instanceof Date) {
			this._firstConversionFromDateDiff(firstValue, secondValue);

		} else {
			this._firstConversionFromCommonFormats(firstValue, secondValue, args.length);
		}
	}

	_firstConversionFromDateDiff(firstValue, secondValue) {
		const milisecondsDiff = Math.abs(firstValue - secondValue);
		this._minutes = Math.round(milisecondsDiff / MILLISECONDS_PER_MINUTE);
	}

	_firstConversionFromCommonFormats(firstValue, secondValue, argsLength) {
		const fistValueType = typeof firstValue;
		if (fistValueType === 'string' && argsLength === 1 &&
			firstValue.includes(TIME_SEPARATOR)) {
			const timeObj = _stringToObject(firstValue);
			this._minutes = _objectToNumber(timeObj);

		} else if (fistValueType === 'object' && argsLength === 1) {
			this._minutes = _objectToNumber(firstValue);

		} else if (argsLength === 2 && fistValueType === 'number' &&
			typeof secondValue === 'number') {
			this._minutes = _objectToNumber({
				hours: firstValue,
				minutes: secondValue
			});
		}
	}

	/* Conversion operations (output) */

	toMinutes() {
		return this._minutes;
	}

	valueOf() {
		return this._minutes;
	}

	toHours(roundDigits = 2) {
		const hours = this._minutes / MINUTES_PER_HOUR;
		const factor = 10 ** roundDigits;
		return Math.round(hours * factor) / factor;
	}

	toObject() {
		const roundFn = this._minutes > 0 ? Math.floor : Math.ceil;
		const hours = roundFn(this._minutes / MINUTES_PER_HOUR);
		const minutes = this._minutes % MINUTES_PER_HOUR;
		return { hours, minutes };
	}

	toString(hoursWithZero = false) {
		const { hours, minutes } = this.toObject();
		const absMinutes = Math.abs(minutes);
		const minutesZeroed = absMinutes < 10 ? `0${absMinutes}` : absMinutes;
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
		const minutes = this._minutes % MINUTES_PER_HOUR;
		this._minutes = (hours * MINUTES_PER_HOUR) + minutes;
	}

	set minutes(minutes) {
		const hours = Math.floor(this._minutes / MINUTES_PER_HOUR);
		this._minutes = (hours * MINUTES_PER_HOUR) + minutes;
	}

	/* Modification operations */

	add(timeToAdd) {
		const timeToAddNormalized = new TimeDuration(timeToAdd);
		this._minutes = this._minutes + timeToAddNormalized;
		return this;
	}

	subtract(timeToSubtract) {
		const timeToAddNormalized = new TimeDuration(timeToSubtract);
		this._minutes = this._minutes - timeToAddNormalized;
		return this;
	}

	multiplyBy(multiplicationFactor) {
		this._minutes = this._minutes * multiplicationFactor;
		return this;
	}

	divideBy(divisionFactor) {
		this._minutes = Math.round(this._minutes / divisionFactor);
		return this;
	}

}

module.exports = TimeDuration;
