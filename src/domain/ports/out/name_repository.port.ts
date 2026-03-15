export interface NameRepository {
    findNames(pattern: RegExp): string[];
}
