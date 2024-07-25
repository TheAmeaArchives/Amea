export function matchesAny(input: string, patterns: (string | RegExp)[]): boolean {
    let answer = false
    for (const pattern of patterns) {
        if (typeof pattern === 'string') {
            if (input === pattern) {
                answer = true;
                break;
            }
        } else {
            if (pattern.test(input)) {
                answer = true;
                break;
            }
        }
    }
    return answer;
}