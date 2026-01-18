/**
 * Convert a date to relative time format (e.g., "2 hours ago", "3 days ago")
 * @param {string|Date} date - The date to convert
 * @returns {string} - Relative time string in Arabic
 */
export const getRelativeTime = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    // Less than a minute
    if (diffInSeconds < 60) {
        return 'الآن';
    }

    // Minutes
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        if (diffInMinutes === 1) return 'دقيقة';
        if (diffInMinutes === 2) return 'دقيقتين';
        if (diffInMinutes <= 10) return `${diffInMinutes} دقائق`;
        return `${diffInMinutes} دقيقة`;
    }

    // Hours
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        if (diffInHours === 1) return 'ساعة';
        if (diffInHours === 2) return 'ساعتين';
        if (diffInHours <= 10) return `${diffInHours} ساعات`;
        return `${diffInHours} ساعة`;
    }

    // Days
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        if (diffInDays === 1) return 'يوم';
        if (diffInDays === 2) return 'يومين';
        return `${diffInDays} أيام`;
    }

    // Weeks
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
        if (diffInWeeks === 1) return 'أسبوع';
        if (diffInWeeks === 2) return 'أسبوعين';
        return `${diffInWeeks} أسابيع`;
    }

    // Months
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        if (diffInMonths === 1) return 'شهر';
        if (diffInMonths === 2) return 'شهرين';
        if (diffInMonths <= 10) return `${diffInMonths} أشهر`;
        return `${diffInMonths} شهر`;
    }

    // Years
    const diffInYears = Math.floor(diffInMonths / 12);
    if (diffInYears === 1) return 'سنة';
    if (diffInYears === 2) return 'سنتين';
    return `${diffInYears} سنوات`;
};
