export class Helpers {
  public static removeNonNumericCharacters(value: string) {
    return value.replace(/\D/g, '');
  }
}
