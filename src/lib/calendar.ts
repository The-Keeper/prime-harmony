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


function formatUTCTime(date: Date): string {
    return `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}:${String(date.getUTCSeconds()).padStart(2, '0')} UTC`;
}

export class PrimeHarmonyDate {
    constructor(
        public year: number,        // year since the epoch (negative number = before the epoch)
        public season = 0,          // 0–4 (0 for festival period, 1–4 for seasons)
        public day = 0,             // zero-based, day in the season (0–5 for festival period, 0–89 in a usual season)
        public ms = 0,              // milliseconds since start of the day
    ) {
        this.validate();
    }

    private validate(): void {
        if (this.season === 0) {
            if (this.day < 0 || this.day > 5)
                throw new Error(`Festival day must be 0–5.\n${JSON.stringify(this, null, 2)}`);
        } else if (this.season !== undefined && this.day !== undefined) {
            if (this.season < 1 || this.season > 4) throw new Error(`Season must be 1–4\n${JSON.stringify(this, null, 2)}`);
            if (this.day < 0 || this.day > 89) throw new Error(`Season days must be 0–89\n${JSON.stringify(this, null, 2)}`);
        } else {
            throw new Error("Must specify season/day or festivalDay.");
        }
        if (this.ms > MS_IN_DAY || this.ms < 0) {
            throw new Error("Number of milliseconds in a day must be within range");
        }
    }

    public static fromUnixTimestampMS(timestamp_ms: number): PrimeHarmonyDate {
        // 1. Find which 128-year cycle contains this timestamp
        const msSinceEpoch = timestamp_ms - MS_OF_EPOCH;
        const cycleNum = Math.floor(msSinceEpoch / (DAYS_IN_128_YR_CYCLE * MS_IN_DAY));
        
        // 2. Calculate exact start time of this cycle
        const cycleStartMs = MS_OF_EPOCH + cycleNum * DAYS_IN_128_YR_CYCLE * MS_IN_DAY;
        
        // 3. Get normalized time within this cycle (0 to 46,750 days worth of ms)
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
        const isLeap = PRIMES_MOD_128.includes(yearsInCycle);
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
        
        // 7. Combine cycle offset with intra-cycle position
        const absoluteYear = cycleNum * CYCLE_LENGTH + yearsInCycle;
        
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
        const isLeap = PRIMES_MOD_128.includes(yearsInCycle);
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
        const time_res = formatUTCTime(new Date(this.ms));
        return `y${this.year}s${this.season}d${this.day + 1} ${time_res} (c${cycle}y${year})`;
    }
}
