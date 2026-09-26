// Epoch: 15 Dec 1599 UTC. Chosen so that Season 1 begins at the winter solstice (~21–23 Dec).
export const MS_OF_EPOCH = Date.UTC(1599, 11, 15, 0, 0, 0, 0);
export const MS_IN_DAY = 86400 * 1000;
const COMMON_YEAR_LENGTH = 365;
const LEAPS_IN_CYCLE = 31;
const CYCLE_LENGTH = 128;
export const DAYS_IN_128_YR_CYCLE = COMMON_YEAR_LENGTH * CYCLE_LENGTH + LEAPS_IN_CYCLE;
const PRIMES_MOD_128 = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127];
export const SEASON_LENGTH = 90;
const FESTIVAL_LENGTH = 5;

const PRECOMPUTED_YEAR_LENGTH = Array.from(Array(CYCLE_LENGTH).keys()).map(y => {
    const is_leap = PRIMES_MOD_128.includes(y);
    return is_leap ? COMMON_YEAR_LENGTH + 1 : COMMON_YEAR_LENGTH;
});

/** Whether a year is a leap year: its number within the 128-year cycle is prime. */
export function isLeapYear(year: number): boolean {
    const inCycle = ((year % CYCLE_LENGTH) + CYCLE_LENGTH) % CYCLE_LENGTH;
    return PRIMES_MOD_128.includes(inCycle);
}

function formatUTCTime(ms: number): string {
    const hours = Math.floor(ms / 3_600_000);
    const minutes = Math.floor(ms / 60_000) % 60;
    const seconds = Math.floor(ms / 1000) % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} UTC`;
}

export class PrimeHarmonyDate {
    constructor(
        public year: number,        // year since the epoch (negative number = before the epoch)
        public season = 0,          // 0–4 (0 for festival period, 1–4 for seasons)
        public day = 0,             // zero-based, day in the season (0–5 for festival period, 0–89 in a usual season)
        public ms = 0,              // milliseconds since start of the day (0 ≤ ms < 86400000)
    ) {
        this.validate();
    }

    private validate(): void {
        if (this.season === 0) {
            // The festival lasts 5 days, or 6 in a leap year.
            const maxFestivalDay = isLeapYear(this.year) ? FESTIVAL_LENGTH : FESTIVAL_LENGTH - 1;
            if (!Number.isInteger(this.day) || this.day < 0 || this.day > maxFestivalDay)
                throw new Error(`Festival day must be 0–${maxFestivalDay} for year ${this.year}.\n${JSON.stringify(this, null, 2)}`);
        } else {
            if (this.season < 1 || this.season > 4) throw new Error(`Season must be 1–4\n${JSON.stringify(this, null, 2)}`);
            if (!Number.isInteger(this.day) || this.day < 0 || this.day > SEASON_LENGTH - 1) throw new Error(`Season days must be 0–${SEASON_LENGTH - 1}\n${JSON.stringify(this, null, 2)}`);
        }
        if (this.ms < 0 || this.ms >= MS_IN_DAY) {
            throw new Error("Number of milliseconds in a day must be within [0, 86400000)");
        }
    }

    public static fromUnixTimestampMS(timestamp_ms: number): PrimeHarmonyDate {
        // 1. Find which 128-year cycle contains this timestamp
        const msSinceEpoch = timestamp_ms - MS_OF_EPOCH;
        const cycleNum = Math.floor(msSinceEpoch / (DAYS_IN_128_YR_CYCLE * MS_IN_DAY));

        // 2. Calculate exact start time of this cycle
        const cycleStartMs = MS_OF_EPOCH + cycleNum * DAYS_IN_128_YR_CYCLE * MS_IN_DAY;

        // 3. Get normalized time within this cycle (full day indices 0 to 46,750)
        const msInCycle = timestamp_ms - cycleStartMs;

        // 4. Convert to full days + remaining ms
        const fullDaysInCycle = Math.floor(msInCycle / MS_IN_DAY);
        const msRem = msInCycle % MS_IN_DAY;

        // 5. Find year within cycle using precomputed lengths
        let remainingDays = fullDaysInCycle;
        let yearsInCycle = 0;
        while (yearsInCycle < CYCLE_LENGTH && remainingDays >= PRECOMPUTED_YEAR_LENGTH[yearsInCycle]) {
            remainingDays -= PRECOMPUTED_YEAR_LENGTH[yearsInCycle];
            yearsInCycle++;
        }

        // 6. Handle festival/season days
        const absoluteYear = cycleNum * CYCLE_LENGTH + yearsInCycle;
        const isLeap = isLeapYear(absoluteYear);
        const festivalDays = isLeap ? FESTIVAL_LENGTH + 1 : FESTIVAL_LENGTH;
        let season: number;
        let dayInSeason: number;

        if (remainingDays < festivalDays) {
            season = 0; // Festival period
            dayInSeason = remainingDays;
        } else {
            remainingDays -= festivalDays;
            season = Math.floor(remainingDays / SEASON_LENGTH) + 1;
            dayInSeason = remainingDays % SEASON_LENGTH;
        }

        const res = new PrimeHarmonyDate(
            absoluteYear,
            season,
            dayInSeason,
            msRem
        );
        return res;
    }

    public static fromDate(date: Date) {
        return PrimeHarmonyDate.fromUnixTimestampMS(date.valueOf())
    }

    /**
     * Converts this calendar date to Unix timestamp (milliseconds since 1970-01-01).
     */
    public toUnixTimestampMS(): number {
        // 1. Break down into 128-year cycles
        const cycleNum = Math.floor(this.year / CYCLE_LENGTH);
        const yearsInCycle = ((this.year % CYCLE_LENGTH) + CYCLE_LENGTH) % CYCLE_LENGTH; // Always 0-127

        // 2. Calculate full days from completed cycles
        const daysFromCycles = cycleNum * DAYS_IN_128_YR_CYCLE;

        // 3. Calculate days from completed years in current cycle
        let daysInCycle = 0;
        for (let y = 0; y < yearsInCycle; y++) {
            daysInCycle += PRECOMPUTED_YEAR_LENGTH[y];
        }

        // 4. Add days from season/festival
        const isLeap = isLeapYear(this.year);
        if (this.season === 0) {
            // Festival days (0-5)
            daysInCycle += this.day;
        } else {
            // Season days: festival + seasons
            const festivalDays = isLeap ? FESTIVAL_LENGTH + 1 : FESTIVAL_LENGTH;
            daysInCycle += festivalDays + (this.season - 1) * SEASON_LENGTH + this.day;
        }

        // 5. Combine all days and convert to milliseconds
        const totalMs = MS_OF_EPOCH + (daysFromCycles + daysInCycle) * MS_IN_DAY + this.ms;

        // 6. Verify pre-epoch dates convert correctly
        if (this.year < 0 && totalMs >= MS_OF_EPOCH) {
            throw new Error(`Conversion error: Year ${this.year} should be before epoch`);
        }

        return totalMs;
    }

    public toDate() {
        return new Date(this.toUnixTimestampMS())
    }

    /**
     * Adds days to the current date (handles leap years and festival days).
     * @param days Number of days to add (can be negative)
     */
    public addDays(days: number): PrimeHarmonyDate {
        const totalMs = this.toUnixTimestampMS() + days * MS_IN_DAY;
        return PrimeHarmonyDate.fromUnixTimestampMS(totalMs);
    }

    public cycleInfo() {
        const year = ((this.year % CYCLE_LENGTH) + CYCLE_LENGTH) % CYCLE_LENGTH; // Always 0-127
        const cycle = Math.floor(this.year / CYCLE_LENGTH)
        return { year, cycle };
    }

    public toString() {
        const { year, cycle } = this.cycleInfo();
        const time_res = formatUTCTime(this.ms);
        return `y${this.year}s${this.season}d${this.day + 1} ${time_res} (c${cycle}y${year})`;
    }

    /** This instant shifted into the local timezone, so day boundaries match local midnight. */
    public toLocalDate(): PrimeHarmonyDate {
        const date = this.toDate();
        const offset = date.getTimezoneOffset(); // offset for this instant, not "now"
        date.setMinutes(date.getMinutes() - offset);
        return PrimeHarmonyDate.fromDate(date);
    }
}
